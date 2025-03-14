import { parseUnits } from "@ethersproject/units";
import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";
import { describe, expect, jest, test } from "@jest/globals";
import {
  Fee,
  LCDClient,
  MnemonicKey,
  MsgExecuteContract,
  Tx,
} from "@terra-money/terra.js";
import { ethers } from "ethers";
import {
  CHAIN_ID_ETH,
  CHAIN_ID_TERRA,
  CONTRACTS,
  approveEth,
  attestFromEth,
  attestFromTerra,
  createWrappedOnEth,
  createWrappedOnTerra,
  getEmitterAddressEth,
  getEmitterAddressTerra,
  getForeignAssetEth,
  getForeignAssetTerra,
  getIsTransferCompletedEth,
  getIsTransferCompletedTerra,
  hexToUint8Array,
  parseSequenceFromLogEth,
  parseSequenceFromLogTerra,
  redeemOnEth,
  redeemOnTerra,
  transferFromEth,
  transferFromTerra,
  tryNativeToHexString,
  tryNativeToUint8Array,
  updateWrappedOnEth,
} from "../..";
import { TokenImplementation__factory } from "../../ethers-contracts";
import getSignedVAAWithRetry from "../../rpc/getSignedVAAWithRetry";
import {
  ETH_NODE_URL,
  ETH_PRIVATE_KEY4,
  TERRA_CHAIN_ID,
  TERRA_NODE_URL,
  TERRA_PRIVATE_KEY,
  TERRA_PUBLIC_KEY,
  TEST_ERC20,
  WORMHOLE_RPC_HOSTS,
} from "./utils/consts";
import {
  getSignedVAABySequence,
  queryBalanceOnTerra,
  waitForTerraExecution,
} from "./utils/helpers";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// look, broadcast and broadcastBlock still resulted in sequence mismatches
// and nobody has time for that
async function broadcastAndWait(terra: LCDClient, tx: Tx) {
  const response = await terra.tx.broadcast(tx);
  if ((response as any)?.code !== 0) {
    console.error(response);
    throw new Error(`Transaction failed ${response?.txhash}`);
  }
  let currentHeight = (await terra.tendermint.blockInfo()).block.header.height;
  while (parseInt(currentHeight) <= response.height) {
    await sleep(100);
    currentHeight = (await terra.tendermint.blockInfo()).block.header.height;
  }
  return response;
}

describe("Terra Classic Integration Tests", () => {
  describe("Terra deposit and transfer tokens", () => {
    test("Tokens transferred can't exceed tokens deposited", (done) => {
      (async () => {
        try {
          const lcd = new LCDClient({
            URL: TERRA_NODE_URL,
            chainID: TERRA_CHAIN_ID,
            isClassic: false,
          });
          const mk = new MnemonicKey({
            mnemonic: TERRA_PRIVATE_KEY,
          });
          const wallet = lcd.wallet(mk);
          // deposit some tokens (separate transactions)
          for (let i = 0; i < 3; i++) {
            const deposit = new MsgExecuteContract(
              wallet.key.accAddress,
              CONTRACTS.DEVNET.terra.token_bridge,
              {
                deposit_tokens: {},
              },
              { uusd: "900000087654321" }
            );
            const tx = await wallet.createAndSignTx({
              msgs: [deposit],
              memo: "localhost",
              fee: new Fee(200000, { uusd: 10_000_000 }),
            });
            await broadcastAndWait(lcd, tx);
          }
          const provider = new ethers.providers.JsonRpcProvider(ETH_NODE_URL);
          const signer = new ethers.Wallet(ETH_PRIVATE_KEY4, provider);
          // attempt to transfer more than we've deposited
          const transfer = new MsgExecuteContract(
            wallet.key.accAddress,
            CONTRACTS.DEVNET.terra.token_bridge,
            {
              initiate_transfer: {
                asset: {
                  amount: "5900000087654321",
                  info: {
                    native_token: {
                      denom: "uusd",
                    },
                  },
                },
                recipient_chain: CHAIN_ID_ETH,
                recipient: Buffer.from(
                  tryNativeToUint8Array(await signer.getAddress(), "ethereum")
                ).toString("base64"),
                fee: "0",
                nonce: Math.round(Math.round(Math.random() * 100000)),
              },
            },
            {}
          );
          let error = false;
          try {
            await lcd.tx.estimateFee(
              [
                {
                  sequenceNumber: await wallet.sequence(),
                  publicKey: wallet.key.publicKey,
                },
              ],
              {
                msgs: [transfer],
                memo: "localhost",
                feeDenoms: ["uluna"],
              }
            );
          } catch (e) {
            error = e.response.data.message.includes("Overflow: Cannot Sub");
          }
          expect(error).toEqual(true);
          // withdraw the tokens we deposited
          const withdraw = new MsgExecuteContract(
            wallet.key.accAddress,
            CONTRACTS.DEVNET.terra.token_bridge,
            {
              withdraw_tokens: {
                asset: {
                  native_token: {
                    denom: "uusd",
                  },
                },
              },
            },
            {}
          );
          const feeEstimate = await lcd.tx.estimateFee(
            [
              {
                sequenceNumber: await wallet.sequence(),
                publicKey: wallet.key.publicKey,
              },
            ],
            {
              msgs: [withdraw],
              memo: "localhost",
              feeDenoms: ["uluna"],
            }
          );
          const tx = await wallet.createAndSignTx({
            msgs: [withdraw],
            memo: "test",
            feeDenoms: ["uluna"],
            fee: feeEstimate,
          });
          await broadcastAndWait(lcd, tx);
          done();
        } catch (e) {
          console.error(e);
          done(
            "An error occurred while testing deposits to and transfers from Terra"
          );
        }
      })();
    });
  });
  describe("Ethereum to Terra", () => {
    test("Attest Ethereum ERC-20 to Terra", (done) => {
      (async () => {
        try {
          // create a signer for Eth
          const provider = new ethers.providers.JsonRpcProvider(ETH_NODE_URL);
          const signer = new ethers.Wallet(ETH_PRIVATE_KEY4, provider);
          // attest the test token
          const receipt = await attestFromEth(
            CONTRACTS.DEVNET.ethereum.token_bridge,
            signer,
            TEST_ERC20
          );
          // get the sequence from the logs (needed to fetch the vaa)
          const sequence = parseSequenceFromLogEth(
            receipt,
            CONTRACTS.DEVNET.ethereum.core
          );
          const emitterAddress = getEmitterAddressEth(
            CONTRACTS.DEVNET.ethereum.token_bridge
          );
          await provider.send("anvil_mine", ["0x40"]); // 64 blocks should get the above block to `finalized`
          // poll until the guardian(s) witness and sign the vaa
          const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
            WORMHOLE_RPC_HOSTS,
            CHAIN_ID_ETH,
            emitterAddress,
            sequence,
            {
              transport: NodeHttpTransport(),
            }
          );
          const lcd = new LCDClient({
            URL: TERRA_NODE_URL,
            chainID: TERRA_CHAIN_ID,
            isClassic: false,
          });
          const mk = new MnemonicKey({
            mnemonic: TERRA_PRIVATE_KEY,
          });
          const wallet = lcd.wallet(mk);
          const msg = await createWrappedOnTerra(
            CONTRACTS.DEVNET.terra.token_bridge,
            wallet.key.accAddress,
            signedVAA
          );
          const feeEstimate = await lcd.tx.estimateFee(
            [
              {
                sequenceNumber: await wallet.sequence(),
                publicKey: wallet.key.publicKey,
              },
            ],
            {
              msgs: [msg],
              feeDenoms: ["uluna"],
            }
          );
          const tx = await wallet.createAndSignTx({
            msgs: [msg],
            memo: "test",
            feeDenoms: ["uluna"],
            fee: feeEstimate,
          });
          try {
            await broadcastAndWait(lcd, tx);
          } catch (e) {
            // this could fail because the token is already attested (in an unclean env)
          }
          done();
        } catch (e) {
          console.error(e);
          done(
            "An error occurred while trying to attest from Ethereum to Terra"
          );
        }
      })();
    });
    test("Ethereum ERC-20 is attested on Terra", async () => {
      const lcd = new LCDClient({
        URL: TERRA_NODE_URL,
        chainID: TERRA_CHAIN_ID,
        isClassic: false,
      });
      const address = getForeignAssetTerra(
        CONTRACTS.DEVNET.terra.token_bridge,
        lcd,
        "ethereum",
        tryNativeToUint8Array(TEST_ERC20, "ethereum")
      );
      expect(address).toBeTruthy();
    });
    test("Send Ethereum ERC-20 to Terra", (done) => {
      (async () => {
        try {
          // create a signer for Eth
          const provider = new ethers.providers.JsonRpcProvider(
            ETH_NODE_URL
          ) as any;
          const signer = new ethers.Wallet(ETH_PRIVATE_KEY4, provider);
          const amount = parseUnits("1", 18);
          const ERC20 = "0x2D8BE6BF0baA74e0A907016679CaE9190e80dD0A";
          const TerraWalletAddress: string = TERRA_PUBLIC_KEY;
          interface Erc20Balance {
            balance: string;
          }
          const lcd = new LCDClient({
            URL: TERRA_NODE_URL,
            chainID: TERRA_CHAIN_ID,
            isClassic: false,
          });

          // Get initial wallet balances
          let token = TokenImplementation__factory.connect(ERC20, signer);
          const initialBalOnEth = await token.balanceOf(
            await signer.getAddress()
          );
          let initialBalOnEthStr = ethers.utils.formatUnits(
            initialBalOnEth,
            18
          );

          // Get initial balance of ERC20 on Terra
          const originAssetHex = tryNativeToHexString(ERC20, CHAIN_ID_ETH);
          if (!originAssetHex) {
            throw new Error("originAssetHex is null");
          }
          const foreignAsset = await getForeignAssetTerra(
            CONTRACTS.DEVNET.terra.token_bridge,
            lcd,
            CHAIN_ID_ETH,
            hexToUint8Array(originAssetHex)
          );
          if (!foreignAsset) {
            throw new Error("foreignAsset is null");
          }
          const tokenDefinition: any = await lcd.wasm.contractQuery(
            foreignAsset,
            {
              token_info: {},
            }
          );
          let cw20BalOnTerra: Erc20Balance = await lcd.wasm.contractQuery(
            foreignAsset,
            {
              balance: {
                address: TerraWalletAddress,
              },
            }
          );
          let balAmount = ethers.utils.formatUnits(
            cw20BalOnTerra.balance,
            tokenDefinition.decimals
          );
          // let initialCW20BalOnTerra: number = parseInt(balAmount);

          // approve the bridge to spend tokens
          await approveEth(
            CONTRACTS.DEVNET.ethereum.token_bridge,
            TEST_ERC20,
            signer,
            amount
          );
          const mk = new MnemonicKey({
            mnemonic: TERRA_PRIVATE_KEY,
          });
          const wallet = lcd.wallet(mk);
          // transfer tokens
          const receipt = await transferFromEth(
            CONTRACTS.DEVNET.ethereum.token_bridge,
            signer,
            TEST_ERC20,
            amount,
            CHAIN_ID_TERRA,
            tryNativeToUint8Array(wallet.key.accAddress, CHAIN_ID_TERRA)
          );
          // get the sequence from the logs (needed to fetch the vaa)
          const sequence = parseSequenceFromLogEth(
            receipt,
            CONTRACTS.DEVNET.ethereum.core
          );
          const emitterAddress = getEmitterAddressEth(
            CONTRACTS.DEVNET.ethereum.token_bridge
          );
          await provider.send("anvil_mine", ["0x40"]); // 64 blocks should get the above block to `finalized`
          // poll until the guardian(s) witness and sign the vaa
          const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
            WORMHOLE_RPC_HOSTS,
            CHAIN_ID_ETH,
            emitterAddress,
            sequence,
            {
              transport: NodeHttpTransport(),
            }
          );
          expect(
            await getIsTransferCompletedTerra(
              CONTRACTS.DEVNET.terra.token_bridge,
              signedVAA,
              lcd
            )
          ).toBe(false);
          const msg = await redeemOnTerra(
            CONTRACTS.DEVNET.terra.token_bridge,
            wallet.key.accAddress,
            signedVAA
          );
          const feeEstimate = await lcd.tx.estimateFee(
            [
              {
                sequenceNumber: await wallet.sequence(),
                publicKey: wallet.key.publicKey,
              },
            ],
            {
              msgs: [msg],
              memo: "localhost",
              feeDenoms: ["uluna"],
            }
          );
          const tx = await wallet.createAndSignTx({
            msgs: [msg],
            memo: "localhost",
            feeDenoms: ["uluna"],
            fee: feeEstimate,
          });
          await broadcastAndWait(lcd, tx);
          expect(
            await getIsTransferCompletedTerra(
              CONTRACTS.DEVNET.terra.token_bridge,
              signedVAA,
              lcd
            )
          ).toBe(true);

          // Get wallet balance on Eth
          const finalBalOnEth = await token.balanceOf(
            await signer.getAddress()
          );
          let finalBalOnEthStr = ethers.utils.formatUnits(finalBalOnEth, 18);
          expect(
            parseInt(initialBalOnEthStr) - parseInt(finalBalOnEthStr)
          ).toEqual(1);

          // Get wallet balance on Tera
          cw20BalOnTerra = await lcd.wasm.contractQuery(foreignAsset, {
            balance: {
              address: TerraWalletAddress,
            },
          });
          balAmount = ethers.utils.formatUnits(
            cw20BalOnTerra.balance,
            tokenDefinition.decimals
          );
          // let finalCW20BalOnTerra: number = parseInt(balAmount);
          done();
        } catch (e) {
          console.error(e);
          done("An error occurred while trying to send from Ethereum to Terra");
        }
      })();
    });
  });
  describe("Terra to Ethereum", () => {
    test("Attestation from Terra to ETH", (done) => {
      (async () => {
        try {
          const lcd = new LCDClient({
            URL: TERRA_NODE_URL,
            chainID: TERRA_CHAIN_ID,
            isClassic: false,
          });
          const mk = new MnemonicKey({
            mnemonic: TERRA_PRIVATE_KEY,
          });
          const wallet = lcd.wallet(mk);
          const Asset: string = "uluna";
          const TerraWalletAddress: string = TERRA_PUBLIC_KEY;
          const msg = await attestFromTerra(
            CONTRACTS.DEVNET.terra.token_bridge,
            TerraWalletAddress,
            Asset
          );
          const feeEstimate = await lcd.tx.estimateFee(
            [
              {
                sequenceNumber: await wallet.sequence(),
                publicKey: wallet.key.publicKey,
              },
            ],
            {
              msgs: [msg],
              memo: "localhost",
              feeDenoms: ["uusd"],
            }
          );
          const executeTx = await wallet.createAndSignTx({
            msgs: [msg],
            memo: "Testing...",
            feeDenoms: ["uusd"],
            fee: feeEstimate,
          });
          const result = await broadcastAndWait(lcd, executeTx);
          const info = await waitForTerraExecution(result.txhash, lcd);
          if (!info) {
            throw new Error("info not found");
          }
          const sequence = parseSequenceFromLogTerra(info);
          if (!sequence) {
            throw new Error("Sequence not found");
          }
          const emitterAddress = await getEmitterAddressTerra(
            CONTRACTS.DEVNET.terra.token_bridge
          );
          const signedVaa = await getSignedVAABySequence(
            CHAIN_ID_TERRA,
            sequence,
            emitterAddress
          );
          const provider = new ethers.providers.JsonRpcProvider(
            ETH_NODE_URL
          ) as any;
          const signer = new ethers.Wallet(ETH_PRIVATE_KEY4, provider);
          let success: boolean = true;
          try {
            const cr = await createWrappedOnEth(
              CONTRACTS.DEVNET.ethereum.token_bridge,
              signer,
              signedVaa
            );
          } catch (e) {
            success = false;
          }
          if (!success) {
            const cr = await updateWrappedOnEth(
              CONTRACTS.DEVNET.ethereum.token_bridge,
              signer,
              signedVaa
            );
            success = true;
          }
        } catch (e) {
          console.error("Attestation failure: ", e);
        }
        done();
      })();
    });
    test("Transfer from Terra", (done) => {
      (async () => {
        try {
          const lcd = new LCDClient({
            URL: TERRA_NODE_URL,
            chainID: TERRA_CHAIN_ID,
            isClassic: false,
          });
          const mk = new MnemonicKey({
            mnemonic: TERRA_PRIVATE_KEY,
          });
          const Asset: string = "uluna";
          const FeeAsset: string = "uusd";
          const Amount: string = "1000000";

          // Get initial balance of luna on Terra
          const initialTerraBalance: number = await queryBalanceOnTerra(Asset);

          // Get initial balance of uusd on Terra
          // const initialFeeBalance: number = await queryBalanceOnTerra(FeeAsset);

          // Get initial balance of wrapped luna on Eth
          const provider = new ethers.providers.JsonRpcProvider(
            ETH_NODE_URL
          ) as any;
          const signer = new ethers.Wallet(ETH_PRIVATE_KEY4, provider);
          const originAssetHex = tryNativeToHexString(Asset, CHAIN_ID_TERRA);
          if (!originAssetHex) {
            throw new Error("originAssetHex is null");
          }
          const foreignAsset = await getForeignAssetEth(
            CONTRACTS.DEVNET.ethereum.token_bridge,
            provider,
            CHAIN_ID_TERRA,
            hexToUint8Array(originAssetHex)
          );
          if (!foreignAsset) {
            throw new Error("foreignAsset is null");
          }
          let token = TokenImplementation__factory.connect(
            foreignAsset,
            signer
          );

          // Get initial balance of wrapped luna on ethereum
          const initialLunaBalOnEth = await token.balanceOf(
            await signer.getAddress()
          );
          const initialLunaBalOnEthInt = parseInt(initialLunaBalOnEth._hex);

          // Start transfer from Terra to Ethereum
          const hexStr = tryNativeToHexString(
            await signer.getAddress(),
            CHAIN_ID_ETH
          );
          if (!hexStr) {
            throw new Error("Failed to convert to hexStr");
          }
          const wallet = lcd.wallet(mk);
          const msgs = await transferFromTerra(
            wallet.key.accAddress,
            CONTRACTS.DEVNET.terra.token_bridge,
            Asset,
            Amount,
            CHAIN_ID_ETH,
            hexToUint8Array(hexStr) // This needs to be ETH wallet
          );
          const feeEstimate = await lcd.tx.estimateFee(
            [
              {
                sequenceNumber: await wallet.sequence(),
                publicKey: wallet.key.publicKey,
              },
            ],
            {
              msgs: msgs,
              memo: "localhost",
              feeDenoms: [FeeAsset],
            }
          );
          const executeTx = await wallet.createAndSignTx({
            msgs: msgs,
            memo: "Testing transfer...",
            feeDenoms: [FeeAsset],
            fee: feeEstimate,
          });
          const result = await broadcastAndWait(lcd, executeTx);
          const info = await waitForTerraExecution(result.txhash, lcd);
          if (!info) {
            throw new Error("info not found");
          }

          // Get VAA in order to do redemption step
          const sequence = parseSequenceFromLogTerra(info);
          if (!sequence) {
            throw new Error("Sequence not found");
          }
          const emitterAddress = await getEmitterAddressTerra(
            CONTRACTS.DEVNET.terra.token_bridge
          );
          const signedVaa = await getSignedVAABySequence(
            CHAIN_ID_TERRA,
            sequence,
            emitterAddress
          );
          const roe = await redeemOnEth(
            CONTRACTS.DEVNET.ethereum.token_bridge,
            signer,
            signedVaa
          );
          expect(
            await getIsTransferCompletedEth(
              CONTRACTS.DEVNET.ethereum.token_bridge,
              provider,
              signedVaa
            )
          ).toBe(true);

          // Test finished.  Check wallet balances
          // Get final balance of uluna on Terra
          const finalTerraBalance = await queryBalanceOnTerra(Asset);

          // Get final balance of uusd on Terra
          // const finalFeeBalance: number = await queryBalanceOnTerra(FeeAsset);
          // Not exactly equal because tax
          expect(initialTerraBalance - 1e6 >= finalTerraBalance).toBe(true);
          const lunaBalOnEthAfter = await token.balanceOf(
            await signer.getAddress()
          );
          const lunaBalOnEthAfterInt = parseInt(lunaBalOnEthAfter._hex);
          expect(initialLunaBalOnEthInt + 1e6 === lunaBalOnEthAfterInt).toBe(
            true
          );
        } catch (e) {
          console.error("Terra to Ethereum failure: ", e);
          done("Terra to Ethereum Failure");
          return;
        }
        done();
      })();
    });
    test("Transfer wrapped luna back to Terra", (done) => {
      (async () => {
        try {
          // Get initial wallet balances
          const lcd = new LCDClient({
            URL: TERRA_NODE_URL,
            chainID: TERRA_CHAIN_ID,
            isClassic: false,
          });
          const mk = new MnemonicKey({
            mnemonic: TERRA_PRIVATE_KEY,
          });
          const Asset: string = "uluna";
          const initialTerraBalance: number = await queryBalanceOnTerra(Asset);
          const provider = new ethers.providers.JsonRpcProvider(
            ETH_NODE_URL
          ) as any;
          const signer = new ethers.Wallet(ETH_PRIVATE_KEY4, provider);
          const originAssetHex = tryNativeToHexString(Asset, CHAIN_ID_TERRA);
          if (!originAssetHex) {
            throw new Error("originAssetHex is null");
          }
          const foreignAsset = await getForeignAssetEth(
            CONTRACTS.DEVNET.ethereum.token_bridge,
            provider,
            CHAIN_ID_TERRA,
            hexToUint8Array(originAssetHex)
          );
          if (!foreignAsset) {
            throw new Error("foreignAsset is null");
          }
          let token = TokenImplementation__factory.connect(
            foreignAsset,
            signer
          );
          const initialLunaBalOnEth = await token.balanceOf(
            await signer.getAddress()
          );
          const initialLunaBalOnEthInt = parseInt(initialLunaBalOnEth._hex);
          const Amount: string = "1000000";

          // approve the bridge to spend tokens
          await approveEth(
            CONTRACTS.DEVNET.ethereum.token_bridge,
            foreignAsset,
            signer,
            Amount
          );

          // transfer wrapped luna from Ethereum to Terra
          const wallet = lcd.wallet(mk);
          const receipt = await transferFromEth(
            CONTRACTS.DEVNET.ethereum.token_bridge,
            signer,
            foreignAsset,
            Amount,
            CHAIN_ID_TERRA,
            tryNativeToUint8Array(wallet.key.accAddress, CHAIN_ID_TERRA)
          );

          // get the sequence from the logs (needed to fetch the vaa)
          const sequence = parseSequenceFromLogEth(
            receipt,
            CONTRACTS.DEVNET.ethereum.core
          );
          const emitterAddress = getEmitterAddressEth(
            CONTRACTS.DEVNET.ethereum.token_bridge
          );
          await provider.send("anvil_mine", ["0x40"]); // 64 blocks should get the above block to `finalized`
          // poll until the guardian(s) witness and sign the vaa
          const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
            WORMHOLE_RPC_HOSTS,
            CHAIN_ID_ETH,
            emitterAddress,
            sequence,
            {
              transport: NodeHttpTransport(),
            }
          );
          const msg = await redeemOnTerra(
            CONTRACTS.DEVNET.terra.token_bridge,
            wallet.key.accAddress,
            signedVAA
          );
          const feeEstimate = await lcd.tx.estimateFee(
            [
              {
                sequenceNumber: await wallet.sequence(),
                publicKey: wallet.key.publicKey,
              },
            ],
            {
              msgs: [msg],
              memo: "localhost",
              feeDenoms: ["uusd"],
            }
          );
          const tx = await wallet.createAndSignTx({
            msgs: [msg],
            memo: "localhost",
            feeDenoms: ["uusd"],
            fee: feeEstimate,
          });
          await broadcastAndWait(lcd, tx);
          expect(
            await getIsTransferCompletedTerra(
              CONTRACTS.DEVNET.terra.token_bridge,
              signedVAA,
              lcd
            )
          ).toBe(true);

          // Check wallet balances after
          const finalTerraBalance = await queryBalanceOnTerra(Asset);
          // not exactly the transfer size increase due to tax
          expect(initialTerraBalance + 1e6 * 0.9 <= finalTerraBalance).toBe(
            true
          );
          const finalLunaBalOnEth = await token.balanceOf(
            await signer.getAddress()
          );
          const finalLunaBalOnEthInt = parseInt(finalLunaBalOnEth._hex);
          expect(initialLunaBalOnEthInt - 1e6 === finalLunaBalOnEthInt).toBe(
            true
          );
          // const uusdBal = await queryBalanceOnTerra("uusd");
        } catch (e) {
          console.error("Transfer back failure: ", e);
          done("Transfer back Failure");
          return;
        }
        done();
      })();
    });
  });
  describe("Terra <=> Ethereum roundtrip", () => {
    test("Transfer CW20 token from Terra to Ethereum and back again", (done) => {
      (async () => {
        try {
          const CW20: string =
            "terra1zwv6feuzhy6a9wekh96cd57lsarmqlwxdypdsplw6zhfncqw6ftqynf7kp";
          const Asset: string = "uluna";
          const FeeAsset: string = "uusd";
          const Amount: string = "1000000";
          const TerraWalletAddress: string = TERRA_PUBLIC_KEY;

          interface Cw20Balance {
            balance: string;
          }

          const lcd = new LCDClient({
            URL: TERRA_NODE_URL,
            chainID: TERRA_CHAIN_ID,
            isClassic: false,
          });
          const mk = new MnemonicKey({
            mnemonic: TERRA_PRIVATE_KEY,
          });
          const wallet = lcd.wallet(mk);

          // This is the attestation phase of the CW20 token
          let msg = await attestFromTerra(
            CONTRACTS.DEVNET.terra.token_bridge,
            TerraWalletAddress,
            CW20
          );
          let feeEstimate = await lcd.tx.estimateFee(
            [
              {
                sequenceNumber: await wallet.sequence(),
                publicKey: wallet.key.publicKey,
              },
            ],
            {
              msgs: [msg],
              memo: "localhost",
              feeDenoms: [FeeAsset],
            }
          );
          let executeTx = await wallet.createAndSignTx({
            msgs: [msg],
            memo: "Testing...",
            feeDenoms: [FeeAsset],
            fee: feeEstimate,
          });
          let result = await broadcastAndWait(lcd, executeTx);
          let info = await waitForTerraExecution(result.txhash, lcd);
          if (!info) {
            throw new Error("info not found");
          }
          let sequence = parseSequenceFromLogTerra(info);
          if (!sequence) {
            throw new Error("Sequence not found");
          }
          let emitterAddress = await getEmitterAddressTerra(
            CONTRACTS.DEVNET.terra.token_bridge
          );
          let signedVaa = await getSignedVAABySequence(
            CHAIN_ID_TERRA,
            sequence,
            emitterAddress
          );
          const provider = new ethers.providers.JsonRpcProvider(
            ETH_NODE_URL
          ) as any;
          const signer = new ethers.Wallet(ETH_PRIVATE_KEY4, provider);
          let success: boolean = true;
          try {
            const cr = await createWrappedOnEth(
              CONTRACTS.DEVNET.ethereum.token_bridge,
              signer,
              signedVaa
            );
          } catch (e) {
            success = false;
          }
          if (!success) {
            const cr = await updateWrappedOnEth(
              CONTRACTS.DEVNET.ethereum.token_bridge,
              signer,
              signedVaa
            );
            success = true;
          }
          // Attestation is complete

          // Get initial balance of uusd on Terra
          // const initialFeeBalance: number = await queryBalanceOnTerra(FeeAsset);

          // Get wallet on eth
          const originAssetHex = tryNativeToHexString(CW20, CHAIN_ID_TERRA);
          if (!originAssetHex) {
            throw new Error("originAssetHex is null");
          }
          const foreignAsset = await getForeignAssetEth(
            CONTRACTS.DEVNET.ethereum.token_bridge,
            provider,
            CHAIN_ID_TERRA,
            hexToUint8Array(originAssetHex)
          );
          if (!foreignAsset) {
            throw new Error("foreignAsset is null");
          }
          let token = TokenImplementation__factory.connect(
            foreignAsset,
            signer
          );
          const initialCW20BalOnEth = await token.balanceOf(
            await signer.getAddress()
          );
          let initialCW20BalOnEthInt = parseInt(initialCW20BalOnEth._hex);

          // Get initial balance of CW20 on Terra
          const tokenDefinition: any = await lcd.wasm.contractQuery(CW20, {
            token_info: {},
          });
          let cw20BalOnTerra: Cw20Balance = await lcd.wasm.contractQuery(CW20, {
            balance: {
              address: TerraWalletAddress,
            },
          });
          let amount = ethers.utils.formatUnits(
            cw20BalOnTerra.balance,
            tokenDefinition.decimals
          );
          let initialCW20BalOnTerra: number = parseInt(amount);
          const hexStr = tryNativeToHexString(
            await signer.getAddress(),
            CHAIN_ID_ETH
          );
          if (!hexStr) {
            throw new Error("Failed to convert to hexStr");
          }
          const msgs = await transferFromTerra(
            wallet.key.accAddress,
            CONTRACTS.DEVNET.terra.token_bridge,
            CW20,
            Amount,
            CHAIN_ID_ETH,
            hexToUint8Array(hexStr) // This needs to be ETH wallet
          );
          feeEstimate = await lcd.tx.estimateFee(
            [
              {
                sequenceNumber: await wallet.sequence(),
                publicKey: wallet.key.publicKey,
              },
            ],
            {
              msgs: msgs,
              memo: "localhost",
              feeDenoms: [FeeAsset],
            }
          );
          executeTx = await wallet.createAndSignTx({
            msgs: msgs,
            memo: "Testing transfer...",
            feeDenoms: [FeeAsset],
            fee: feeEstimate,
          });
          result = await broadcastAndWait(lcd, executeTx);
          info = await waitForTerraExecution(result.txhash, lcd);
          if (!info) {
            throw new Error("info not found");
          }
          sequence = parseSequenceFromLogTerra(info);
          if (!sequence) {
            throw new Error("Sequence not found");
          }
          emitterAddress = await getEmitterAddressTerra(
            CONTRACTS.DEVNET.terra.token_bridge
          );
          signedVaa = await getSignedVAABySequence(
            CHAIN_ID_TERRA,
            sequence,
            emitterAddress
          );
          const roe = await redeemOnEth(
            CONTRACTS.DEVNET.ethereum.token_bridge,
            signer,
            signedVaa
          );
          expect(
            await getIsTransferCompletedEth(
              CONTRACTS.DEVNET.ethereum.token_bridge,
              provider,
              signedVaa
            )
          ).toBe(true);

          // Check the wallet balances
          let finalCW20BalOnEth = await token.balanceOf(
            await signer.getAddress()
          );
          let finalCW20BalOnEthInt = parseInt(finalCW20BalOnEth._hex);
          expect(initialCW20BalOnEthInt + 1e6 === finalCW20BalOnEthInt).toBe(
            true
          );
          cw20BalOnTerra = await lcd.wasm.contractQuery(CW20, {
            balance: {
              address: TerraWalletAddress,
            },
          });
          amount = ethers.utils.formatUnits(
            cw20BalOnTerra.balance,
            tokenDefinition.decimals
          );
          let finalCW20BalOnTerra: number = parseInt(amount);
          expect(initialCW20BalOnTerra - finalCW20BalOnTerra === 1).toBe(true);
          // Done checking wallet balances

          // Start the reverse transfer from Ethereum back to Terra
          // Get initial wallet balances
          initialCW20BalOnTerra = finalCW20BalOnTerra;
          initialCW20BalOnEthInt = finalCW20BalOnEthInt;

          // approve the bridge to spend tokens
          await approveEth(
            CONTRACTS.DEVNET.ethereum.token_bridge,
            foreignAsset,
            signer,
            Amount
          );

          // transfer token from Ethereum to Terra
          const receipt = await transferFromEth(
            CONTRACTS.DEVNET.ethereum.token_bridge,
            signer,
            foreignAsset,
            Amount,
            CHAIN_ID_TERRA,
            tryNativeToUint8Array(wallet.key.accAddress, CHAIN_ID_TERRA)
          );

          // get the sequence from the logs (needed to fetch the vaa)
          sequence = parseSequenceFromLogEth(
            receipt,
            CONTRACTS.DEVNET.ethereum.core
          );
          emitterAddress = getEmitterAddressEth(
            CONTRACTS.DEVNET.ethereum.token_bridge
          );
          await provider.send("anvil_mine", ["0x40"]); // 64 blocks should get the above block to `finalized`
          // poll until the guardian(s) witness and sign the vaa
          const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
            WORMHOLE_RPC_HOSTS,
            CHAIN_ID_ETH,
            emitterAddress,
            sequence,
            {
              transport: NodeHttpTransport(),
            }
          );
          msg = await redeemOnTerra(
            CONTRACTS.DEVNET.terra.token_bridge,
            wallet.key.accAddress,
            signedVAA
          );
          feeEstimate = await lcd.tx.estimateFee(
            [
              {
                sequenceNumber: await wallet.sequence(),
                publicKey: wallet.key.publicKey,
              },
            ],
            {
              msgs: [msg],
              memo: "localhost",
              feeDenoms: ["uusd"],
            }
          );
          const tx = await wallet.createAndSignTx({
            msgs: [msg],
            memo: "localhost",
            feeDenoms: ["uusd"],
            fee: feeEstimate,
          });
          await broadcastAndWait(lcd, tx);
          expect(
            await getIsTransferCompletedTerra(
              CONTRACTS.DEVNET.terra.token_bridge,
              signedVAA,
              lcd
            )
          ).toBe(true);

          // Check wallet balances after transfer back
          finalCW20BalOnEth = await token.balanceOf(await signer.getAddress());
          finalCW20BalOnEthInt = parseInt(finalCW20BalOnEth._hex);
          expect(initialCW20BalOnEthInt - 1e6 === finalCW20BalOnEthInt).toBe(
            true
          );
          cw20BalOnTerra = await lcd.wasm.contractQuery(CW20, {
            balance: {
              address: TerraWalletAddress,
            },
          });
          amount = ethers.utils.formatUnits(
            cw20BalOnTerra.balance,
            tokenDefinition.decimals
          );
          finalCW20BalOnTerra = parseInt(amount);
          expect(finalCW20BalOnTerra - initialCW20BalOnTerra === 1).toBe(true);
          // Done checking wallet balances
        } catch (e) {
          console.error("CW20 Transfer failure: ", e);
          done("CW20 Transfer Failure");
          return;
        }
        done();
      })();
    });
  });
});
