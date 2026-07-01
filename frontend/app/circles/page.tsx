'use client';

import { useState } from 'react';
import { useAllCircles } from '@/hooks/useCircle';
import { useWallet } from '@/context/WalletContext';
import { CircleCard } from '@/components/circles/CircleCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import type { GroupStatus } from '@/types/ajo';

type Filter = GroupStatus | 'All';
const STATUS_FILTERS: Array<{ label: string; value: Filter }> = [
  { label: 'All',           value: 'All'      },
  { label: 'Open to join',  value: 'Open'     },
  { label: 'Saving now',    value: 'Active'   },
  { label: 'Finished',      value: 'Complete' },
];

export default function CirclesPage() {
  const { publicKey } = useWallet();
  const { circles, loading, error } = useAllCircles(publicKey);
  const [filter, setFilter] = useState<Filter>('All');

  const filtered = filter === 'All' ? circles : circles.filter((c) => c.state.status === filter);

  return (
    <div className="min-h-screen bg-white">
      {/* Page hero */}
      <div className="border-b border-ajo-border bg-ajo-dark py-16">
        <div className="page-width">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white lg:text-5xl">
                All Circles
              </h1>
              <p className="mt-3 text-lg text-white/50">
                Browse circles that are open to join, or track ones that are saving now.
              </p>
            </div>
            <Link href="/circles/create" className="shrink-0">
              <Button variant="lime" size="lg">Start a Circle</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="page-width py-12">
        {/* Filter tabs */}
        <div className="mb-10 flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all ${
                filter === f.value
                  ? 'border-ajo-dark bg-ajo-dark text-white'
                  : 'border-ajo-border bg-white text-ajo-muted hover:border-ajo-dark hover:text-ajo-dark'
              }`}
            >
              {f.label}
              {f.value !== 'All' && (
                <span className="ml-2 opacity-60">
                  {circles.filter((c) => c.state.status === f.value).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-ajo-lime border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="rounded-3xl bg-red-50 px-7 py-5 text-sm text-red-600">{error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-ajo-surface text-3xl">🌀</div>
            <h3 className="mb-2 text-xl font-bold text-ajo-dark">No circles here yet</h3>
            <p className="mb-6 text-ajo-muted">
              {filter !== 'All' ? `No ${filter === 'Open' ? 'open' : filter === 'Active' ? 'active' : 'finished'} circles at the moment.` : 'Be the first to start one!'}
            </p>
            <Link href="/circles/create"><Button>Start a Circle</Button></Link>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c) => <CircleCard key={c.id} circle={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}
