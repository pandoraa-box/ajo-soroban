'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useWallet } from '@/context/WalletContext';
import { txCreateGroup } from '@/lib/contract';
import { TOKEN_ADDRESSES, STROOPS_PER_UNIT, formatAmount } from '@/types/ajo';

interface CreateCircleFormProps {
  returnTo?: string;
}

const CYCLE_OPTIONS = [
  { label: '1 week',  ledgers: 120960  },
  { label: '2 weeks', ledgers: 241920  },
  { label: '1 month', ledgers: 518400  },
];

const SIZE_OPTIONS = [3, 4, 5, 6, 8, 10, 12];

export function CreateCircleForm({ returnTo = '/dashboard/circles' }: CreateCircleFormProps) {
  const router = useRouter();
  const { isConnected, connect } = useWallet();

  const [amount, setAmount]         = useState('100');
  const [cycleIdx, setCycleIdx]     = useState(0);
  const [maxMembers, setMaxMembers] = useState(5);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [txHash, setTxHash]         = useState<string | null>(null);

  const amountNum     = parseFloat(amount) || 0;
  const amountStroops = BigInt(Math.round(amountNum * Number(STROOPS_PER_UNIT)));
  const totalPool     = amountStroops * BigInt(maxMembers);
  const cycle         = CYCLE_OPTIONS[cycleIdx];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isConnected) { connect(); return; }
    if (amountNum <= 0) { setError('Enter an amount greater than $0'); return; }

    setLoading(true);
    setError(null);
    try {
      const hash = await txCreateGroup(TOKEN_ADDRESSES.USDC, amountStroops, cycle.ledgers, maxMembers);
      setTxHash(hash);
      setTimeout(() => router.push(returnTo), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (txHash) {
    return (
      <div className="flex flex-col items-center gap-5 py-14 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ajo-lime text-3xl text-white">✓</div>
        <h3 className="text-2xl font-bold text-ajo-dark">Circle created!</h3>
        <p className="text-sm text-ajo-muted">Transaction: <span className="font-mono">{txHash.slice(0, 22)}…</span></p>
        <p className="text-xs text-ajo-muted">Taking you to your circles…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Amount */}
      <div>
        <label className="mb-3 block text-sm font-bold text-ajo-dark">
          How much does each person save per round? (USDC)
        </label>
        <div className="relative">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-bold text-ajo-muted">$</span>
          <input
            type="number" min="1" step="1" value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-2xl border border-ajo-border bg-white py-4 pl-10 pr-5 text-2xl font-bold text-ajo-dark outline-none transition-colors focus:border-ajo-dark focus:ring-2 focus:ring-ajo-dark/10"
          />
        </div>
        <p className="mt-2 text-xs text-ajo-muted">Everyone puts in this amount every round.</p>
      </div>

      {/* Cycle length */}
      <div>
        <label className="mb-3 block text-sm font-bold text-ajo-dark">How often does your group save?</label>
        <div className="grid grid-cols-3 gap-3">
          {CYCLE_OPTIONS.map((opt, i) => (
            <button key={opt.label} type="button" onClick={() => setCycleIdx(i)}
              className={`rounded-2xl border py-4 text-sm font-bold transition-all ${
                cycleIdx === i
                  ? 'border-ajo-lime bg-ajo-lime text-white'
                  : 'border-ajo-border bg-white text-ajo-muted hover:border-ajo-dark hover:text-ajo-dark'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Group size */}
      <div>
        <label className="mb-3 block text-sm font-bold text-ajo-dark">How many people in the group?</label>
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((n) => (
            <button key={n} type="button" onClick={() => setMaxMembers(n)}
              className={`h-12 w-12 rounded-full border text-sm font-bold transition-all ${
                maxMembers === n
                  ? 'border-ajo-lime bg-ajo-lime text-white'
                  : 'border-ajo-border bg-white text-ajo-muted hover:border-ajo-dark hover:text-ajo-dark'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-ajo-muted">You'll be first in the payout rotation.</p>
      </div>

      {/* Summary */}
      <div className="rounded-3xl bg-ajo-blue-light p-6 space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-ajo-dark/50">Your Circle Summary</p>
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          {[
            ['Each person saves', `$${amountNum.toFixed(0)} USDC per round`],
            ['Saving frequency',  cycle.label                             ],
            ['Group size',        `${maxMembers} people`                  ],
            ['Total rounds',      `${maxMembers} rounds`                  ],
          ].map(([k, v]) => (
            <div key={k} className="contents">
              <span className="text-ajo-muted">{k}</span>
              <span className="font-bold text-ajo-dark text-right">{v}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-ajo-dark/10 pt-4 flex items-center justify-between">
          <span className="font-bold text-ajo-dark">Everyone receives</span>
          <span className="text-xl font-bold text-ajo-lime">{formatAmount(totalPool)}</span>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium text-red-600">{error}</div>
      )}

      <Button type="submit" size="lg" className="w-full" loading={loading}>
        {isConnected ? 'Create My Circle' : 'Connect Wallet to Continue'}
      </Button>

      <p className="text-center text-xs text-ajo-muted">
        This creates a real transaction on Stellar Testnet.{' '}
        <a href="https://laboratory.stellar.org/#account-creator?network=test"
          target="_blank" rel="noopener noreferrer"
          className="font-semibold text-ajo-dark underline underline-offset-2"
        >
          Get free test funds first ↗
        </a>
      </p>
    </form>
  );
}
