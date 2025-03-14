import {
  Commitment,
  ConfirmOptions,
  Connection,
  Keypair,
  PublicKeyInitData,
  Transaction,
} from "@solana/web3.js";
import {
  signSendAndConfirmTransaction,
  SignTransaction,
  sendAndConfirmTransactionsWithRetry,
  modifySignTransaction,
  TransactionSignatureAndResponse,
  PreparedTransactions,
} from "./utils";
import {
  createPostVaaInstruction,
  createVerifySignaturesInstructions,
} from "./wormhole";
import { isBytes, ParsedVaa, parseVaa, SignedVaa } from "../vaa/wormhole";

/**
 * @deprecated Please use {@link postVaa} instead, which allows
 * retries and commitment to be configured in {@link ConfirmOptions}.
 */
export async function postVaaWithRetry(
  connection: Connection,
  signTransaction: SignTransaction,
  wormholeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData,
  vaa: Buffer,
  maxRetries?: number,
  commitment?: Commitment
): Promise<TransactionSignatureAndResponse[]> {
  const { unsignedTransactions, signers } =
    await createPostSignedVaaTransactions(
      connection,
      wormholeProgramId,
      payer,
      vaa,
      commitment
    );

  const postVaaTransaction = unsignedTransactions.pop()!;

  const options: ConfirmOptions = {
    commitment,
    maxRetries,
  };

  const responses: TransactionSignatureAndResponse[] = [];
  for (const transaction of unsignedTransactions) {
    const response = await signSendAndConfirmTransaction(
      connection,
      payer,
      modifySignTransaction(signTransaction, ...signers),
      transaction,
      options
    );
    responses.push(response);
  }

  // While the signature_set is used to create the final instruction, it doesn't need to sign it.
  responses.push(
    await signSendAndConfirmTransaction(
      connection,
      payer,
      signTransaction,
      postVaaTransaction,
      options
    )
  );
  return responses;
}

export async function postVaa(
  connection: Connection,
  signTransaction: SignTransaction,
  wormholeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData,
  vaa: Buffer,
  options?: ConfirmOptions,
  asyncVerifySignatures: boolean = true
): Promise<TransactionSignatureAndResponse[]> {
  const { unsignedTransactions, signers } =
    await createPostSignedVaaTransactions(
      connection,
      wormholeProgramId,
      payer,
      vaa,
      options?.commitment
    );

  const postVaaTransaction = unsignedTransactions.pop()!;

  const verifySignatures = async (transaction: Transaction) =>
    signSendAndConfirmTransaction(
      connection,
      payer,
      modifySignTransaction(signTransaction, ...signers),
      transaction,
      options
    );

  const output: TransactionSignatureAndResponse[] = [];
  if (asyncVerifySignatures) {
    const verified = await Promise.all(
      unsignedTransactions.map(async (transaction) =>
        verifySignatures(transaction)
      )
    );
    output.push(...verified);
  } else {
    for (const transaction of unsignedTransactions) {
      output.push(await verifySignatures(transaction));
    }
  }
  output.push(
    await signSendAndConfirmTransaction(
      connection,
      payer,
      signTransaction,
      postVaaTransaction,
      options
    )
  );
  return output;
}

/** Send transactions for `verify_signatures` and `post_vaa` instructions.
 *
 * Using a signed VAA, execute transactions generated by {@link verifySignatures} and
 * {@link postVaa}. At most 4 transactions are sent (up to 3 from signature verification
 * and 1 to post VAA data to an account).
 *
 * @param {Connection} connection - Solana web3 connection
 * @param {PublicKeyInitData} wormholeProgramId - wormhole program address
 * @param {web3.Keypair} payer - transaction signer address
 * @param {Buffer} signedVaa - bytes of signed VAA
 * @param {Commitment} [options] - Solana commitment
 *
 */
export async function createPostSignedVaaTransactions(
  connection: Connection,
  wormholeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData,
  vaa: SignedVaa | ParsedVaa,
  commitment?: Commitment
): Promise<PreparedTransactions> {
  const parsed = isBytes(vaa) ? parseVaa(vaa) : vaa;
  const signatureSet = Keypair.generate();

  const verifySignaturesInstructions = await createVerifySignaturesInstructions(
    connection,
    wormholeProgramId,
    payer,
    parsed,
    signatureSet.publicKey,
    commitment
  );

  const unsignedTransactions: Transaction[] = [];
  for (let i = 0; i < verifySignaturesInstructions.length; i += 2) {
    unsignedTransactions.push(
      new Transaction().add(...verifySignaturesInstructions.slice(i, i + 2))
    );
  }

  unsignedTransactions.push(
    new Transaction().add(
      createPostVaaInstruction(
        wormholeProgramId,
        payer,
        parsed,
        signatureSet.publicKey
      )
    )
  );

  return {
    unsignedTransactions,
    signers: [signatureSet],
  };
}
