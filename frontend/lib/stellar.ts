import {
  rpc,
  TransactionBuilder,
  Contract,
  Networks,
  nativeToScVal,
  scValToNative,
  BASE_FEE,
  Address,
  xdr,
} from '@stellar/stellar-sdk';

export const SOROBAN_RPC_URL =
  process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ?? 'https://soroban-testnet.stellar.org';

export const HORIZON_URL =
  process.env.NEXT_PUBLIC_HORIZON_URL ?? 'https://horizon-testnet.stellar.org';

export const NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_NETWORK === 'MAINNET'
    ? Networks.PUBLIC
    : Networks.TESTNET;

export const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID ?? '';

export function getRpcServer(): rpc.Server {
  return new rpc.Server(SOROBAN_RPC_URL, { allowHttp: false });
}

export function addrToScVal(address: string): xdr.ScVal {
  return new Address(address).toScVal();
}

export function u32ToScVal(value: number): xdr.ScVal {
  return nativeToScVal(value, { type: 'u32' });
}

export function i128ToScVal(value: bigint): xdr.ScVal {
  return nativeToScVal(value, { type: 'i128' });
}

export async function simulateContractCall(
  contractId: string,
  method: string,
  args: xdr.ScVal[],
  callerPublicKey: string,
): Promise<unknown> {
  const server = getRpcServer();
  const account = await server.getAccount(callerPublicKey);
  const contract = new Contract(contractId);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(sim)) {
    throw new Error(`Simulation failed: ${sim.error}`);
  }

  const resultScVal = (sim as rpc.Api.SimulateTransactionSuccessResponse).result?.retval;
  if (!resultScVal) return null;
  return scValToNative(resultScVal);
}

export async function buildAndPrepareTransaction(
  contractId: string,
  method: string,
  args: xdr.ScVal[],
  callerPublicKey: string,
): Promise<string> {
  const server = getRpcServer();
  const account = await server.getAccount(callerPublicKey);
  const contract = new Contract(contractId);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const prepared = await server.prepareTransaction(tx);
  return prepared.toXDR();
}

export async function submitSignedTransaction(signedXdr: string): Promise<string> {
  const server = getRpcServer();
  const response = await server.sendTransaction(
    TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE),
  );
  if (response.status === 'ERROR') {
    throw new Error(`Transaction failed: ${JSON.stringify(response)}`);
  }
  return response.hash;
}
