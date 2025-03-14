import { getObjectFields } from "@certusone/wormhole-sdk/lib/esm/sui";
import { NETWORKS } from "../../consts/networks";
import { getProvider } from "./utils";
import {
  ChainId,
  Network,
  chainIdToChain,
  contracts,
} from "@wormhole-foundation/sdk";

export async function queryRegistrationsSui(
  network: Network,
  module: "Core" | "NFTBridge" | "TokenBridge"
): Promise<Object> {
  const n = NETWORKS[network]["Sui"];
  const provider = getProvider(network, n.rpc);
  let state_object_id: string;

  switch (module) {
    case "TokenBridge":
      state_object_id = contracts.tokenBridge(network, "Sui");
      if (state_object_id === undefined) {
        throw Error(`Unknown token bridge contract on ${network} for Sui`);
      }
      break;
    default:
      throw new Error(`Invalid module: ${module}`);
  }

  const state = await getObjectFields(provider, state_object_id);
  const emitterRegistryId = state!.emitter_registry.fields.id.id;

  // TODO: handle pagination
  //   - recursive: https://github.com/wormhole-foundation/wormhole/blob/7608b2b740df5d4c2551daaf4d620eac81c07790/sdk/js/src/sui/utils.ts#L175
  //   - iterative: https://github.com/wormhole-foundation/wormhole/blob/7608b2b740df5d4c2551daaf4d620eac81c07790/sdk/js/src/sui/utils.ts#L199
  const emitterRegistry = await provider.getDynamicFields({
    parentId: emitterRegistryId,
  });

  const results: { [key: string]: string } = {};
  for (let idx = 0; idx < emitterRegistry.data.length; idx++) {
    const chainId = emitterRegistry.data[idx].name.value as ChainId;
    for (const { objectId } of emitterRegistry.data.slice(idx, idx + 1)) {
      const emitter = (await provider.getObject({
        id: objectId,
        options: { showContent: true },
      })) as any;
      const emitterAddress: Uint8Array =
        emitter.data?.content?.fields.value.fields.value.fields.data;
      const emitterAddrStr = Buffer.from(emitterAddress).toString("hex");
      results[chainIdToChain(chainId)] = emitterAddrStr;
    }
  }

  return results;
}
