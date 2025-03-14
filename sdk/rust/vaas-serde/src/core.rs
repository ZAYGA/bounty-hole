//! Parsers for core bridge VAAs.
//!
//! The core bridge is responsible for emitting messages and VAAs. But it also uses VAA's to
//! update and manage itself.

use serde::{Deserialize, Serialize};

use crate::{Address, Amount, Chain, GuardianSetInfo};

pub type Vaa = crate::Vaa<GovernancePacket>;

/// Represents a governance action targeted at the core bridge itself.
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum Action {
    #[serde(rename = "1")]
    ContractUpgrade { new_contract: Address },
    #[serde(rename = "2")]
    GuardianSetUpgrade {
        new_guardian_set_index: u32,
        new_guardian_set: GuardianSetInfo,
    },
    #[serde(rename = "3")]
    SetFee { amount: Amount },
    #[serde(rename = "4")]
    TransferFee { amount: Amount, recipient: Address },
}

/// Represents the payload for a governance VAA targeted at the core bridge.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct GovernancePacket {
    /// Describes the chain on which the governance action should be carried out.
    pub chain: Chain,

    /// The actual governance action to be carried out.
    pub action: Action,
}

// The wire format for GovernancePackets is wonky and doesn't lend itself well to auto-deriving
// Serialize / Deserialize so we implement it manually here.
mod governance_packet_impl {
    use std::fmt;

    use serde::{
        de::{Error, MapAccess, SeqAccess, Visitor},
        ser::SerializeStruct,
        Deserialize, Deserializer, Serialize, Serializer,
    };

    use crate::{
        core::{Action, GovernancePacket},
        Address, Amount, GuardianSetInfo,
    };

    // MODULE = "Core"
    const MODULE: [u8; 32] = [
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x43, 0x6f,
        0x72, 0x65,
    ];

    struct Module;

    impl Serialize for Module {
        fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: Serializer,
        {
            MODULE.serialize(serializer)
        }
    }

    impl<'de> Deserialize<'de> for Module {
        fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
        where
            D: Deserializer<'de>,
        {
            let arr = <[u8; 32]>::deserialize(deserializer)?;

            if arr == MODULE {
                Ok(Module)
            } else {
                Err(Error::custom(
                    "invalid governance module, expected \"Core\"",
                ))
            }
        }
    }

    #[derive(Serialize, Deserialize)]
    struct ContractUpgrade {
        new_contract: Address,
    }

    #[derive(Serialize, Deserialize)]
    struct GuardianSetUpgrade {
        new_guardian_set_index: u32,
        new_guardian_set: GuardianSetInfo,
    }

    #[derive(Serialize, Deserialize)]
    struct SetFee {
        amount: Amount,
    }

    #[derive(Serialize, Deserialize)]
    struct TransferFee {
        amount: Amount,
        recipient: Address,
    }

    impl Serialize for GovernancePacket {
        fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: Serializer,
        {
            let mut seq = serializer.serialize_struct("GovernancePacket", 4)?;
            seq.serialize_field("module", &Module)?;

            // The wire format encodes the action before the chain and then appends the actual
            // action payload.
            match self.action {
                Action::ContractUpgrade { new_contract } => {
                    seq.serialize_field("action", &1u8)?;
                    seq.serialize_field("chain", &self.chain)?;
                    seq.serialize_field("payload", &ContractUpgrade { new_contract })?;
                }
                Action::GuardianSetUpgrade {
                    new_guardian_set_index,
                    ref new_guardian_set,
                } => {
                    seq.serialize_field("action", &2u8)?;
                    seq.serialize_field("chain", &self.chain)?;
                    seq.serialize_field(
                        "payload",
                        &GuardianSetUpgrade {
                            new_guardian_set_index,
                            new_guardian_set: new_guardian_set.clone(),
                        },
                    )?;
                }
                Action::SetFee { amount } => {
                    seq.serialize_field("action", &3u8)?;
                    seq.serialize_field("chain", &self.chain)?;
                    seq.serialize_field("payload", &SetFee { amount })?;
                }
                Action::TransferFee { amount, recipient } => {
                    seq.serialize_field("action", &4u8)?;
                    seq.serialize_field("chain", &self.chain)?;
                    seq.serialize_field("payload", &TransferFee { amount, recipient })?;
                }
            }

            seq.end()
        }
    }

    struct GovernancePacketVisitor;

    impl<'de> Visitor<'de> for GovernancePacketVisitor {
        type Value = GovernancePacket;

        fn expecting(&self, f: &mut fmt::Formatter) -> fmt::Result {
            f.write_str("struct GovernancePacket")
        }

        #[inline]
        fn visit_seq<A>(self, mut seq: A) -> Result<Self::Value, A::Error>
        where
            A: SeqAccess<'de>,
        {
            static EXPECTING: &str = "struct GovernancePacket with 4 elements";

            let _: Module = seq
                .next_element()?
                .ok_or_else(|| Error::invalid_length(0, &EXPECTING))?;
            let act: u8 = seq
                .next_element()?
                .ok_or_else(|| Error::invalid_length(1, &EXPECTING))?;
            let chain = seq
                .next_element()?
                .ok_or_else(|| Error::invalid_length(2, &EXPECTING))?;

            let action = match act {
                1 => {
                    let ContractUpgrade { new_contract } = seq
                        .next_element()?
                        .ok_or_else(|| Error::invalid_length(3, &EXPECTING))?;

                    Action::ContractUpgrade { new_contract }
                }
                2 => {
                    let GuardianSetUpgrade {
                        new_guardian_set_index,
                        new_guardian_set,
                    } = seq
                        .next_element()?
                        .ok_or_else(|| Error::invalid_length(3, &EXPECTING))?;

                    Action::GuardianSetUpgrade {
                        new_guardian_set_index,
                        new_guardian_set,
                    }
                }
                3 => {
                    let SetFee { amount } = seq
                        .next_element()?
                        .ok_or_else(|| Error::invalid_length(3, &EXPECTING))?;

                    Action::SetFee { amount }
                }
                4 => {
                    let TransferFee { amount, recipient } = seq
                        .next_element()?
                        .ok_or_else(|| Error::invalid_length(3, &EXPECTING))?;

                    Action::TransferFee { amount, recipient }
                }
                v => {
                    return Err(Error::custom(format_args!(
                        "invaliid value {v}, expected one of 1, 2, 3, 4"
                    )))
                }
            };

            Ok(GovernancePacket { chain, action })
        }

        fn visit_map<A>(self, mut map: A) -> Result<Self::Value, A::Error>
        where
            A: MapAccess<'de>,
        {
            #[derive(Serialize, Deserialize)]
            #[serde(rename_all = "snake_case")]
            enum Field {
                Module,
                Action,
                Chain,
                Payload,
            }

            let mut module = None;
            let mut chain = None;
            let mut action = None;
            let mut payload = None;

            while let Some(key) = map.next_key::<Field>()? {
                match key {
                    Field::Module => {
                        if module.is_some() {
                            return Err(Error::duplicate_field("module"));
                        }

                        module = map.next_value::<Module>().map(Some)?;
                    }
                    Field::Action => {
                        if action.is_some() {
                            return Err(Error::duplicate_field("action"));
                        }

                        action = map.next_value::<u8>().map(Some)?;
                    }
                    Field::Chain => {
                        if chain.is_some() {
                            return Err(Error::duplicate_field("chain"));
                        }

                        chain = map.next_value().map(Some)?;
                    }
                    Field::Payload => {
                        if payload.is_some() {
                            return Err(Error::duplicate_field("payload"));
                        }

                        let a = action.as_ref().copied().ok_or_else(|| {
                            Error::custom("`action` must be known before deserializing `payload`")
                        })?;

                        let p = match a {
                            1 => {
                                let ContractUpgrade { new_contract } = map.next_value()?;

                                Action::ContractUpgrade { new_contract }
                            }
                            2 => {
                                let GuardianSetUpgrade {
                                    new_guardian_set_index,
                                    new_guardian_set,
                                } = map.next_value()?;

                                Action::GuardianSetUpgrade {
                                    new_guardian_set_index,
                                    new_guardian_set,
                                }
                            }
                            3 => {
                                let SetFee { amount } = map.next_value()?;

                                Action::SetFee { amount }
                            }
                            4 => {
                                let TransferFee { amount, recipient } = map.next_value()?;

                                Action::TransferFee { amount, recipient }
                            }
                            v => {
                                return Err(Error::custom(format_args!(
                                    "invalid action: {v}, expected one of: 1, 2, 3, 4"
                                )))
                            }
                        };

                        payload = Some(p);
                    }
                }
            }

            let chain = chain.ok_or_else(|| Error::missing_field("chain"))?;
            let action = payload.ok_or_else(|| Error::missing_field("payload"))?;

            Ok(GovernancePacket { chain, action })
        }
    }

    impl<'de> Deserialize<'de> for GovernancePacket {
        fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
        where
            D: Deserializer<'de>,
        {
            const FIELDS: &[&str] = &["module", "action", "chain", "payload"];
            deserializer.deserialize_struct("GovernancePacket", FIELDS, GovernancePacketVisitor)
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    use crate::{vaa::Signature, GuardianAddress, GOVERNANCE_EMITTER};

    #[test]
    fn contract_upgrade() {
        let buf = [
            0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0xe3, 0xdb, 0x30, 0x93, 0x03, 0xb7, 0x12,
            0xa5, 0x62, 0xe6, 0xaa, 0x2a, 0xdc, 0x68, 0xbc, 0x10, 0xff, 0x22, 0x32, 0x8a, 0xb3,
            0x1d, 0xdb, 0x6a, 0x83, 0x70, 0x69, 0x43, 0xa9, 0xda, 0x97, 0xbf, 0x11, 0xba, 0x6e,
            0x3b, 0x96, 0x39, 0x55, 0x15, 0x86, 0x87, 0x86, 0x89, 0x8d, 0xc1, 0x9e, 0xcd, 0x73,
            0x7d, 0x19, 0x7b, 0x0d, 0x1a, 0x1f, 0x3f, 0x3c, 0x6a, 0xea, 0xd5, 0xc1, 0xfe, 0x70,
            0x09, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0x04, 0xc5, 0xd0, 0x5a, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x43, 0x6f, 0x72,
            0x65, 0x01, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x46, 0xda, 0x7a, 0x03, 0x20, 0xdd, 0x99, 0x94, 0x38, 0xb4, 0x43,
            0x5d, 0xac, 0x82, 0xbf, 0x1d, 0xac, 0x13, 0xd2,
        ];

        let vaa = Vaa {
            version: 1,
            guardian_set_index: 0,
            signatures: vec![Signature {
                index: 0,
                signature: [
                    0xe3, 0xdb, 0x30, 0x93, 0x03, 0xb7, 0x12, 0xa5, 0x62, 0xe6, 0xaa, 0x2a, 0xdc,
                    0x68, 0xbc, 0x10, 0xff, 0x22, 0x32, 0x8a, 0xb3, 0x1d, 0xdb, 0x6a, 0x83, 0x70,
                    0x69, 0x43, 0xa9, 0xda, 0x97, 0xbf, 0x11, 0xba, 0x6e, 0x3b, 0x96, 0x39, 0x55,
                    0x15, 0x86, 0x87, 0x86, 0x89, 0x8d, 0xc1, 0x9e, 0xcd, 0x73, 0x7d, 0x19, 0x7b,
                    0x0d, 0x1a, 0x1f, 0x3f, 0x3c, 0x6a, 0xea, 0xd5, 0xc1, 0xfe, 0x70, 0x09, 0x00,
                ],
            }],
            timestamp: 1,
            nonce: 1,
            emitter_chain: Chain::Solana,
            emitter_address: GOVERNANCE_EMITTER,
            sequence: 80_072_794,
            consistency_level: 0,
            payload: GovernancePacket {
                chain: Chain::Fantom,
                action: Action::ContractUpgrade {
                    new_contract: Address([
                        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                        0x00, 0x46, 0xda, 0x7a, 0x03, 0x20, 0xdd, 0x99, 0x94, 0x38, 0xb4, 0x43,
                        0x5d, 0xac, 0x82, 0xbf, 0x1d, 0xac, 0x13, 0xd2,
                    ]),
                },
            },
        };

        assert_eq!(buf.as_ref(), &serde_wormhole::to_vec(&vaa).unwrap());
        assert_eq!(vaa, serde_wormhole::from_slice(&buf).unwrap());

        let encoded = serde_json::to_string(&vaa).unwrap();
        assert_eq!(vaa, serde_json::from_str(&encoded).unwrap());
    }

    #[test]
    fn guardian_set_upgrade() {
        let buf = [
            0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x7a, 0xc3, 0x1b, 0x28, 0x2c, 0x2a, 0xee,
            0xeb, 0x37, 0xf3, 0x38, 0x5e, 0xe0, 0xde, 0x5f, 0x8e, 0x42, 0x1d, 0x30, 0xb9, 0xe5,
            0xae, 0x8b, 0xa3, 0xd4, 0x37, 0x5c, 0x1c, 0x77, 0xa8, 0x6e, 0x77, 0x15, 0x9b, 0xb6,
            0x97, 0xd9, 0xc4, 0x56, 0xd6, 0xf8, 0xc0, 0x2d, 0x22, 0xa9, 0x4b, 0x12, 0x79, 0xb6,
            0x5b, 0x0d, 0x6a, 0x99, 0x57, 0xe7, 0xd3, 0x85, 0x74, 0x23, 0x84, 0x5a, 0xc7, 0x58,
            0xe3, 0x00, 0x61, 0x0a, 0xc1, 0xd2, 0x00, 0x00, 0x00, 0x03, 0x00, 0x01, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x05, 0x39, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x43, 0x6f, 0x72,
            0x65, 0x02, 0x00, 0x16, 0x00, 0x00, 0x00, 0x01, 0x13, 0x58, 0xcc, 0x3a, 0xe5, 0xc0,
            0x97, 0xb2, 0x13, 0xce, 0x3c, 0x81, 0x97, 0x9e, 0x1b, 0x9f, 0x95, 0x70, 0x74, 0x6a,
            0xa5, 0xff, 0x6c, 0xb9, 0x52, 0x58, 0x9b, 0xde, 0x86, 0x2c, 0x25, 0xef, 0x43, 0x92,
            0x13, 0x2f, 0xb9, 0xd4, 0xa4, 0x21, 0x57, 0x11, 0x4d, 0xe8, 0x46, 0x01, 0x93, 0xbd,
            0xf3, 0xa2, 0xfc, 0xf8, 0x1f, 0x86, 0xa0, 0x97, 0x65, 0xf4, 0x76, 0x2f, 0xd1, 0x10,
            0x7a, 0x00, 0x86, 0xb3, 0x2d, 0x7a, 0x09, 0x77, 0x92, 0x6a, 0x20, 0x51, 0x31, 0xd8,
            0x73, 0x1d, 0x39, 0xcb, 0xeb, 0x8c, 0x82, 0xb2, 0xfd, 0x82, 0xfa, 0xed, 0x27, 0x11,
            0xd5, 0x9a, 0xf0, 0xf2, 0x49, 0x9d, 0x16, 0xe7, 0x26, 0xf6, 0xb2, 0x11, 0xb3, 0x97,
            0x56, 0xc0, 0x42, 0x44, 0x1b, 0xe6, 0xd8, 0x65, 0x0b, 0x69, 0xb5, 0x4e, 0xbe, 0x71,
            0x5e, 0x23, 0x43, 0x54, 0xce, 0x5b, 0x4d, 0x34, 0x8f, 0xb7, 0x4b, 0x95, 0x8e, 0x89,
            0x66, 0xe2, 0xec, 0x3d, 0xbd, 0x49, 0x58, 0xa7, 0xcd, 0xeb, 0x5f, 0x73, 0x89, 0xfa,
            0x26, 0x94, 0x15, 0x19, 0xf0, 0x86, 0x33, 0x49, 0xc2, 0x23, 0xb7, 0x3a, 0x6d, 0xde,
            0xe7, 0x74, 0xa3, 0xbf, 0x91, 0x39, 0x53, 0xd6, 0x95, 0x26, 0x0d, 0x88, 0xbc, 0x1a,
            0xa2, 0x5a, 0x4e, 0xee, 0x36, 0x3e, 0xf0, 0x00, 0x0a, 0xc0, 0x07, 0x67, 0x27, 0xb3,
            0x5f, 0xbe, 0xa2, 0xda, 0xc2, 0x8f, 0xee, 0x5c, 0xcb, 0x0f, 0xea, 0x76, 0x8e, 0xaf,
            0x45, 0xce, 0xd1, 0x36, 0xb9, 0xd9, 0xe2, 0x49, 0x03, 0x46, 0x4a, 0xe8, 0x89, 0xf5,
            0xc8, 0xa7, 0x23, 0xfc, 0x14, 0xf9, 0x31, 0x24, 0xb7, 0xc7, 0x38, 0x84, 0x3c, 0xbb,
            0x89, 0xe8, 0x64, 0xc8, 0x62, 0xc3, 0x8c, 0xdd, 0xcc, 0xcf, 0x95, 0xd2, 0xcc, 0x37,
            0xa4, 0xdc, 0x03, 0x6a, 0x8d, 0x23, 0x2b, 0x48, 0xf6, 0x2c, 0xdd, 0x47, 0x31, 0x41,
            0x2f, 0x48, 0x90, 0xda, 0x79, 0x8f, 0x68, 0x96, 0xa3, 0x33, 0x1f, 0x64, 0xb4, 0x8c,
            0x12, 0xd1, 0xd5, 0x7f, 0xd9, 0xcb, 0xe7, 0x08, 0x11, 0x71, 0xaa, 0x1b, 0xe1, 0xd3,
            0x6c, 0xaf, 0xe3, 0x86, 0x79, 0x10, 0xf9, 0x9c, 0x09, 0xe3, 0x47, 0x89, 0x9c, 0x19,
            0xc3, 0x81, 0x92, 0xb6, 0xe7, 0x38, 0x7c, 0xcd, 0x76, 0x82, 0x77, 0xc1, 0x7d, 0xab,
            0x1b, 0x7a, 0x50, 0x27, 0xc0, 0xb3, 0xcf, 0x17, 0x8e, 0x21, 0xad, 0x2e, 0x77, 0xae,
            0x06, 0x71, 0x15, 0x49, 0xcf, 0xbb, 0x1f, 0x9c, 0x7a, 0x9d, 0x80, 0x96, 0xe8, 0x5e,
            0x14, 0x87, 0xf3, 0x55, 0x15, 0xd0, 0x2a, 0x92, 0x75, 0x35, 0x04, 0xa8, 0xd7, 0x54,
            0x71, 0xb9, 0xf4, 0x9e, 0xdb, 0x6f, 0xbe, 0xbc, 0x89, 0x8f, 0x40, 0x3e, 0x47, 0x73,
            0xe9, 0x5f, 0xeb, 0x15, 0xe8, 0x0c, 0x9a, 0x99, 0xc8, 0x34, 0x8d,
        ];

        let vaa = Vaa {
            version: 1,
            guardian_set_index: 0,
            signatures: vec![Signature {
                index: 0,
                signature: [
                    0x7a, 0xc3, 0x1b, 0x28, 0x2c, 0x2a, 0xee, 0xeb, 0x37, 0xf3, 0x38, 0x5e, 0xe0,
                    0xde, 0x5f, 0x8e, 0x42, 0x1d, 0x30, 0xb9, 0xe5, 0xae, 0x8b, 0xa3, 0xd4, 0x37,
                    0x5c, 0x1c, 0x77, 0xa8, 0x6e, 0x77, 0x15, 0x9b, 0xb6, 0x97, 0xd9, 0xc4, 0x56,
                    0xd6, 0xf8, 0xc0, 0x2d, 0x22, 0xa9, 0x4b, 0x12, 0x79, 0xb6, 0x5b, 0x0d, 0x6a,
                    0x99, 0x57, 0xe7, 0xd3, 0x85, 0x74, 0x23, 0x84, 0x5a, 0xc7, 0x58, 0xe3, 0x00,
                ],
            }],
            timestamp: 1_628_094_930,
            nonce: 3,
            emitter_chain: Chain::Solana,
            emitter_address: GOVERNANCE_EMITTER,
            sequence: 1337,
            consistency_level: 0,
            payload: GovernancePacket {
                chain: Chain::Aptos,
                action: Action::GuardianSetUpgrade {
                    new_guardian_set_index: 1,
                    new_guardian_set: GuardianSetInfo {
                        addresses: vec![
                            GuardianAddress([
                                0x58, 0xcc, 0x3a, 0xe5, 0xc0, 0x97, 0xb2, 0x13, 0xce, 0x3c, 0x81,
                                0x97, 0x9e, 0x1b, 0x9f, 0x95, 0x70, 0x74, 0x6a, 0xa5,
                            ]),
                            GuardianAddress([
                                0xff, 0x6c, 0xb9, 0x52, 0x58, 0x9b, 0xde, 0x86, 0x2c, 0x25, 0xef,
                                0x43, 0x92, 0x13, 0x2f, 0xb9, 0xd4, 0xa4, 0x21, 0x57,
                            ]),
                            GuardianAddress([
                                0x11, 0x4d, 0xe8, 0x46, 0x01, 0x93, 0xbd, 0xf3, 0xa2, 0xfc, 0xf8,
                                0x1f, 0x86, 0xa0, 0x97, 0x65, 0xf4, 0x76, 0x2f, 0xd1,
                            ]),
                            GuardianAddress([
                                0x10, 0x7a, 0x00, 0x86, 0xb3, 0x2d, 0x7a, 0x09, 0x77, 0x92, 0x6a,
                                0x20, 0x51, 0x31, 0xd8, 0x73, 0x1d, 0x39, 0xcb, 0xeb,
                            ]),
                            GuardianAddress([
                                0x8c, 0x82, 0xb2, 0xfd, 0x82, 0xfa, 0xed, 0x27, 0x11, 0xd5, 0x9a,
                                0xf0, 0xf2, 0x49, 0x9d, 0x16, 0xe7, 0x26, 0xf6, 0xb2,
                            ]),
                            GuardianAddress([
                                0x11, 0xb3, 0x97, 0x56, 0xc0, 0x42, 0x44, 0x1b, 0xe6, 0xd8, 0x65,
                                0x0b, 0x69, 0xb5, 0x4e, 0xbe, 0x71, 0x5e, 0x23, 0x43,
                            ]),
                            GuardianAddress([
                                0x54, 0xce, 0x5b, 0x4d, 0x34, 0x8f, 0xb7, 0x4b, 0x95, 0x8e, 0x89,
                                0x66, 0xe2, 0xec, 0x3d, 0xbd, 0x49, 0x58, 0xa7, 0xcd,
                            ]),
                            GuardianAddress([
                                0xeb, 0x5f, 0x73, 0x89, 0xfa, 0x26, 0x94, 0x15, 0x19, 0xf0, 0x86,
                                0x33, 0x49, 0xc2, 0x23, 0xb7, 0x3a, 0x6d, 0xde, 0xe7,
                            ]),
                            GuardianAddress([
                                0x74, 0xa3, 0xbf, 0x91, 0x39, 0x53, 0xd6, 0x95, 0x26, 0x0d, 0x88,
                                0xbc, 0x1a, 0xa2, 0x5a, 0x4e, 0xee, 0x36, 0x3e, 0xf0,
                            ]),
                            GuardianAddress([
                                0x00, 0x0a, 0xc0, 0x07, 0x67, 0x27, 0xb3, 0x5f, 0xbe, 0xa2, 0xda,
                                0xc2, 0x8f, 0xee, 0x5c, 0xcb, 0x0f, 0xea, 0x76, 0x8e,
                            ]),
                            GuardianAddress([
                                0xaf, 0x45, 0xce, 0xd1, 0x36, 0xb9, 0xd9, 0xe2, 0x49, 0x03, 0x46,
                                0x4a, 0xe8, 0x89, 0xf5, 0xc8, 0xa7, 0x23, 0xfc, 0x14,
                            ]),
                            GuardianAddress([
                                0xf9, 0x31, 0x24, 0xb7, 0xc7, 0x38, 0x84, 0x3c, 0xbb, 0x89, 0xe8,
                                0x64, 0xc8, 0x62, 0xc3, 0x8c, 0xdd, 0xcc, 0xcf, 0x95,
                            ]),
                            GuardianAddress([
                                0xd2, 0xcc, 0x37, 0xa4, 0xdc, 0x03, 0x6a, 0x8d, 0x23, 0x2b, 0x48,
                                0xf6, 0x2c, 0xdd, 0x47, 0x31, 0x41, 0x2f, 0x48, 0x90,
                            ]),
                            GuardianAddress([
                                0xda, 0x79, 0x8f, 0x68, 0x96, 0xa3, 0x33, 0x1f, 0x64, 0xb4, 0x8c,
                                0x12, 0xd1, 0xd5, 0x7f, 0xd9, 0xcb, 0xe7, 0x08, 0x11,
                            ]),
                            GuardianAddress([
                                0x71, 0xaa, 0x1b, 0xe1, 0xd3, 0x6c, 0xaf, 0xe3, 0x86, 0x79, 0x10,
                                0xf9, 0x9c, 0x09, 0xe3, 0x47, 0x89, 0x9c, 0x19, 0xc3,
                            ]),
                            GuardianAddress([
                                0x81, 0x92, 0xb6, 0xe7, 0x38, 0x7c, 0xcd, 0x76, 0x82, 0x77, 0xc1,
                                0x7d, 0xab, 0x1b, 0x7a, 0x50, 0x27, 0xc0, 0xb3, 0xcf,
                            ]),
                            GuardianAddress([
                                0x17, 0x8e, 0x21, 0xad, 0x2e, 0x77, 0xae, 0x06, 0x71, 0x15, 0x49,
                                0xcf, 0xbb, 0x1f, 0x9c, 0x7a, 0x9d, 0x80, 0x96, 0xe8,
                            ]),
                            GuardianAddress([
                                0x5e, 0x14, 0x87, 0xf3, 0x55, 0x15, 0xd0, 0x2a, 0x92, 0x75, 0x35,
                                0x04, 0xa8, 0xd7, 0x54, 0x71, 0xb9, 0xf4, 0x9e, 0xdb,
                            ]),
                            GuardianAddress([
                                0x6f, 0xbe, 0xbc, 0x89, 0x8f, 0x40, 0x3e, 0x47, 0x73, 0xe9, 0x5f,
                                0xeb, 0x15, 0xe8, 0x0c, 0x9a, 0x99, 0xc8, 0x34, 0x8d,
                            ]),
                        ],
                    },
                },
            },
        };

        assert_eq!(buf.as_ref(), &serde_wormhole::to_vec(&vaa).unwrap());
        assert_eq!(vaa, serde_wormhole::from_slice(&buf).unwrap());

        let encoded = serde_json::to_string(&vaa).unwrap();
        assert_eq!(vaa, serde_json::from_str(&encoded).unwrap());
    }
}
