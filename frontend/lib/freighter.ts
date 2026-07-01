'use client';

export async function isFreighterInstalled(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const { isConnected } = await import('@stellar/freighter-api');
    return await isConnected();
  } catch {
    return false;
  }
}

export async function getWalletPublicKey(): Promise<string> {
  const { getPublicKey } = await import('@stellar/freighter-api');
  const key = await getPublicKey();
  if (!key) throw new Error('Freighter returned an empty public key');
  return key;
}

export async function requestWalletAccess(): Promise<string> {
  const { setAllowed, getPublicKey } = await import('@stellar/freighter-api');
  await setAllowed();
  return getWalletPublicKey();
}

export async function signTx(
  txXdr: string,
  networkPassphrase: string,
  accountToSign: string,
): Promise<string> {
  const { signTransaction } = await import('@stellar/freighter-api');
  const signedXdr = await signTransaction(txXdr, { networkPassphrase, accountToSign });
  return signedXdr;
}
