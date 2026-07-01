import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import type { WalletState } from '@/types/ajo';

interface WalletContextValue extends WalletState {
  connect: (publicKey: string) => Promise<void>;
  disconnect: () => void;
  error: string | null;
}

const WalletContext = createContext<WalletContextValue | null>(null);

const KEY_STORE = 'ajo_wallet_pk';

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    publicKey: null,
    network: 'TESTNET',
    isConnected: false,
  });
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async (publicKey: string) => {
    if (!publicKey.startsWith('G') || publicKey.length !== 56) {
      setError('Invalid Stellar public key (must start with G, 56 chars)');
      return;
    }
    await SecureStore.setItemAsync(KEY_STORE, publicKey);
    setState({ publicKey, network: 'TESTNET', isConnected: true });
    setError(null);
  }, []);

  const disconnect = useCallback(async () => {
    await SecureStore.deleteItemAsync(KEY_STORE);
    setState((s) => ({ ...s, publicKey: null, isConnected: false }));
    setError(null);
  }, []);

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect, error }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be inside <WalletProvider>');
  return ctx;
}
