'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { WalletState } from '@/types/ajo';
import { isFreighterInstalled, requestWalletAccess } from '@/lib/freighter';

interface WalletContextValue extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  error: string | null;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    publicKey: null,
    network: (process.env.NEXT_PUBLIC_NETWORK as 'TESTNET' | 'MAINNET') ?? 'TESTNET',
    isConnected: false,
    isConnecting: false,
  });
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setError(null);
    setState((s) => ({ ...s, isConnecting: true }));
    try {
      const installed = await isFreighterInstalled();
      if (!installed) {
        throw new Error(
          'Freighter wallet not found. Install it from freighter.app to continue.',
        );
      }
      const publicKey = await requestWalletAccess();
      setState((s) => ({ ...s, publicKey, isConnected: true, isConnecting: false }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(message);
      setState((s) => ({ ...s, isConnecting: false }));
    }
  }, []);

  const disconnect = useCallback(() => {
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
  if (!ctx) throw new Error('useWallet must be used inside <WalletProvider>');
  return ctx;
}
