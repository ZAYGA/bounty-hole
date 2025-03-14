import { Buffer } from "buffer";
import * as elliptic from "elliptic";

export function isValidHexString(s: string): boolean {
  return /^(0x)?[0-9a-fA-F]+$/.test(s);
}

export function hexToUint8Array(s: string): Uint8Array {
  if (!isValidHexString(s)) {
    throw new Error(`${s} is not hex`);
  }
  if (s.startsWith("0x")) {
    s = s.slice(2);
  }
  s.padStart(s.length + (s.length % 2), "0");
  return new Uint8Array(Buffer.from(s, "hex"));
}

export function uint8ArrayToHex(b: Uint8Array) {
  return `0x${Buffer.from(b).toString("hex")}`;
}

export function coalesceUint8Array(b: string | Uint8Array): Uint8Array {
  return typeof b === "string" ? hexToUint8Array(b) : b;
}

export function signaturesToEvmStruct(signatures: string[]) {
  return signatures.map((s) => ({
    r: `0x${s.substring(0, 64)}`,
    s: `0x${s.substring(64, 128)}`,
    v: `0x${(parseInt(s.substring(128, 130), 16) + 27).toString(16)}`,
    guardianIndex: `0x${s.substring(130, 132)}`,
  }));
}

// GuardianSetSig expects the guardian index before the signature, the inverse of what the Query Proxy returns.
// https://docs.rs/wormhole-raw-vaas/0.3.0-alpha.1/src/wormhole_raw_vaas/protocol.rs.html#220
// https://github.com/wormhole-foundation/wormhole/blob/31b01629087c610c12fa8e84069786139dc0b6bd/node/cmd/ccq/http.go#L191
export function signaturesToSolanaArray(signatures: string[]) {
  return signatures.map((s) => [
    ...Buffer.from(s.substring(130, 132), "hex"),
    ...Buffer.from(s.substring(0, 130), "hex"),
  ]);
}

/**
 * @param key Private key used to sign `data`
 * @param data Data for signing
 * @returns ECDSA secp256k1 signature
 */
export function sign(key: string, data: Uint8Array): string {
  const ec = new elliptic.ec("secp256k1");
  const keyPair = ec.keyFromPrivate(key);
  const signature = keyPair.sign(data, { canonical: true });
  const packed =
    signature.r.toString("hex").padStart(64, "0") +
    signature.s.toString("hex").padStart(64, "0") +
    Buffer.from([signature.recoveryParam ?? 0]).toString("hex");
  return packed;
}

/**
 * @param val value to be converted to a big int
 * @returns the value or zero as a bigint
 */
export function bigIntWithDef(val: bigint | undefined): bigint {
  return BigInt(val !== undefined ? val : BigInt(0));
}
