import {
  CHAIN_ID_WORMCHAIN,
  hexToUint8Array,
  Other,
  Payload,
  serialiseVAA,
  sign,
  VAA,
} from "@certusone/wormhole-sdk";
import { toBinary } from "@cosmjs/cosmwasm-stargate";
import { fromBase64 } from "@cosmjs/encoding";
import {
  getWallet,
  getWormchainSigningClient,
} from "@wormhole-foundation/wormchain-sdk";
import { ZERO_FEE } from "@wormhole-foundation/wormchain-sdk/lib/core/consts";
import "dotenv/config";
import * as fs from "fs";
import { readdirSync } from "fs";
import { keccak256 } from "js-sha3";
import * as util from "util";

if (process.env.INIT_SIGNERS_KEYS_CSV === "undefined") {
  let msg = `.env is missing. run "make contracts-tools-deps" to fetch.`;
  console.error(msg);
  throw msg;
}
const VAA_SIGNERS = process.env.INIT_SIGNERS_KEYS_CSV.split(",");
const WORMCHAIN_HOST = process.env.WORMCHAIN_HOST;
if (!WORMCHAIN_HOST) {
  throw "WORMCHAIN_HOST unset";
}
let MNEMONIC = process.env.MNEMONIC;
if (!MNEMONIC) {
  throw "MNEMONIC unset";
}

const GOVERNANCE_CHAIN = 1;
const GOVERNANCE_EMITTER =
  "0000000000000000000000000000000000000000000000000000000000000004";

const readFileAsync = util.promisify(fs.readFile);

/*
  NOTE: Only append to this array: keeping the ordering is crucial, as the
  contracts must be imported in a deterministic order so their addresses remain
  deterministic.
*/
type ContractName = string;
const artifacts: ContractName[] = ["wormchain_ibc_receiver.wasm"];

const ARTIFACTS_PATH = "../artifacts/";
/* Check that the artifact folder contains all the wasm files we expect and nothing else */

try {
  const actual_artifacts = readdirSync(ARTIFACTS_PATH).filter((a) =>
    a.endsWith(".wasm")
  );

  const missing_artifacts = artifacts.filter(
    (a) => !actual_artifacts.includes(a)
  );
  if (missing_artifacts.length) {
    console.log(
      "Error during wormchain deployment. The following files are expected to be in the artifacts folder:"
    );
    missing_artifacts.forEach((file) => console.log(`  - ${file}`));
    console.log(
      "Hint: the deploy script needs to run after the contracts have been built."
    );
    console.log(
      "External binary blobs need to be manually added in tools/Dockerfile."
    );
    process.exit(1);
  }
} catch (err) {
  console.error(
    `${ARTIFACTS_PATH} cannot be read. Do you need to run "make contracts-deploy-setup"?`
  );
  process.exit(1);
}

async function main() {
  /* Set up cosmos client & wallet */

  const wallet = await getWallet(MNEMONIC);
  const client = await getWormchainSigningClient(WORMCHAIN_HOST, wallet);

  // there are several Cosmos chains in devnet, so check the config is as expected
  let id = await client.getChainId();
  if (id !== "wormchain-testnet-0") {
    throw new Error(
      `Wormchain CosmWasmClient connection produced an unexpected chainID: ${id}`
    );
  }

  const signers = await wallet.getAccounts();
  const signer = signers[0].address;
  console.log("wormchain contract deployer is: ", signer);

  /* Deploy artifacts */

  const codeIds: { [name: ContractName]: number } = await artifacts.reduce(
    async (prev, file) => {
      // wait for the previous to finish, to avoid the race condition of wallet sequence mismatch.
      const accum = await prev;

      const contract_bytes = await readFileAsync(`${ARTIFACTS_PATH}${file}`);

      const payload = keccak256(contract_bytes);
      let vaa: VAA<Other> = {
        version: 1,
        guardianSetIndex: 0,
        signatures: [],
        timestamp: 0,
        nonce: 0,
        emitterChain: GOVERNANCE_CHAIN,
        emitterAddress: GOVERNANCE_EMITTER,
        sequence: BigInt(Math.floor(Math.random() * 100000000)),
        consistencyLevel: 0,
        payload: {
          type: "Other",
          hex: `0000000000000000000000000000000000000000005761736D644D6F64756C65010${CHAIN_ID_WORMCHAIN.toString(
            16
          )}${payload}`,
        },
      };
      vaa.signatures = sign(VAA_SIGNERS, vaa as unknown as VAA<Payload>);
      console.log("uploading", file);
      const msg = client.core.msgStoreCode({
        signer,
        wasm_byte_code: new Uint8Array(contract_bytes),
        vaa: hexToUint8Array(serialiseVAA(vaa as unknown as VAA<Payload>)),
      });
      const result = await client.signAndBroadcast(signer, [msg], {
        ...ZERO_FEE,
        gas: "10000000",
      });
      const codeId = Number(
        JSON.parse(result.rawLog)[0]
          .events.find(({ type }) => type === "store_code")
          .attributes.find(({ key }) => key === "code_id").value
      );
      console.log(
        `uploaded ${file}, codeID: ${codeId}, tx: ${result.transactionHash}`
      );

      accum[file] = codeId;
      return accum;
    },
    Object()
  );

  // Migrate contracts.

  async function migrate(code_id: number, migrate_msg: any, contract: string) {
    const migrateMsgBinary = toBinary(migrate_msg);
    const migrateMsgBytes = fromBase64(migrateMsgBinary);

    // see /sdk/vaa/governance.go
    const codeIdBuf = Buffer.alloc(8);
    codeIdBuf.writeBigInt64BE(BigInt(code_id));
    const codeIdHash = keccak256(codeIdBuf);
    const codeIdContractHash = keccak256(
      Buffer.concat([
        Buffer.from(codeIdHash, "hex"),
        Buffer.from(contract, "utf8"),
      ])
    );
    const fullHash = keccak256(
      Buffer.concat([Buffer.from(codeIdContractHash, "hex"), migrateMsgBytes])
    );

    console.log(fullHash);

    let vaa: VAA<Other> = {
      version: 1,
      guardianSetIndex: 0,
      signatures: [],
      timestamp: 0,
      nonce: 0,
      emitterChain: GOVERNANCE_CHAIN,
      emitterAddress: GOVERNANCE_EMITTER,
      sequence: BigInt(Math.floor(Math.random() * 100000000)),
      consistencyLevel: 0,
      payload: {
        type: "Other",
        hex: `0000000000000000000000000000000000000000005761736D644D6F64756C65030${CHAIN_ID_WORMCHAIN.toString(
          16
        )}${fullHash}`,
      },
    };
    // TODO: check for number of guardians in set and use the corresponding keys
    vaa.signatures = sign(VAA_SIGNERS, vaa as unknown as VAA<Payload>);
    const msg = client.core.msgMigrateContract({
      signer,
      code_id,
      contract,
      msg: migrateMsgBytes,
      vaa: hexToUint8Array(serialiseVAA(vaa as unknown as VAA<Payload>)),
    });
    const result = await client.signAndBroadcast(signer, [msg], {
      ...ZERO_FEE,
      gas: "10000000",
    });
    console.log("contract migration msg: ", msg);
    console.log("contract migration result: ", result);
    console.log(
      `migrated contract ${contract}, codeID: ${code_id}, txHash: ${result.transactionHash}`
    );
  }

  // Migrate contracts.

  const wormchainIbcReceiverMigrateMsg = {};
  await migrate(
    codeIds["wormchain_ibc_receiver.wasm"],
    wormchainIbcReceiverMigrateMsg,
    "wormhole1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrq0kdhcj"
  );
}

try {
  main();
} catch (e: any) {
  if (e?.message) {
    console.error(e.message);
  }
  throw e;
}
