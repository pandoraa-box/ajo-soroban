'use client';

import { useState } from 'react';
import { useAllCircles } from '@/hooks/useCircle';
import { useWallet } from '@/context/WalletContext';
import { CircleCard } from '@/components/circles/CircleCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import type { GroupStatus } from '@/types/ajo';

const BASE = '/dashboard/circles';

type Filter = GroupStatus | 'All';

const FILTERS: Array<{ label: string; value: Filter }> = [
  { label: 'All circles',  value: 'All'      },
  { label: 'Open to join', value: 'Open'     },
  { label: 'Saving now',   value: 'Active'   },
  { label: 'Finished',     value: 'Complete' },
];

export default function DashboardCirclesPage() {
  const { publicKey } = useWallet();
  const { circles, loading, error } = useAllCircles(publicKey);
  const [filter, setFilter] = useState<Filter>('All');
  const [tab, setTab] = useState<'mine' | 'all'>('mine');

  const myCircles = circles.filter((c) => publicKey && c.state.participants.includes(publicKey));
  const source = tab === 'mine' ? myCircles : circles;
  const filtered = filter === 'All' ? source : source.filter((c) => c.state.status === filter);

  return (
    <>
      {/* Page header */}
      <div className="border-b border-ajo-border bg-white px-10 py-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-ajo-dark">Circles</h1>
            <p className="mt-2 text-ajo-muted">Your savings circles and ones open to join.</p>
          </div>
          <Link href={`${BASE}/create`}>
            <Button size="md">+ Start a Circle</Button>
          </Link>
        </div>

        {/* My / All tabs */}
        <div className="flex gap-1 border-b border-ajo-border">
          {(['mine', 'all'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 px-4 text-sm font-bold transition-all border-b-2 -mb-px ${
                tab === t ? 'border-ajo-dark text-ajo-dark' : 'border-transparent text-ajo-muted hover:text-ajo-dark'
              }`}
            >
              {t === 'mine' ? `My Circles (${myCircles.length})` : `All Circles (${circles.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="px-10 py-8">
        {/* Status filter pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full border px-5 py-2 text-sm font-bold transition-all ${
                filter === f.value
                  ? 'border-ajo-dark bg-ajo-dark text-white'
                  : 'border-ajo-border bg-white text-ajo-muted hover:border-ajo-dark hover:text-ajo-dark'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-ajo-lime border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-red-50 px-6 py-4 text-sm font-medium text-red-600">{error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-ajo-border bg-white py-24 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-ajo-surface text-3xl">🌀</div>
            <h3 className="mb-2 text-xl font-bold text-ajo-dark">
              {tab === 'mine' ? "You haven't joined any circles yet" : 'No circles here yet'}
            </h3>
            <p className="mb-8 max-w-xs text-ajo-muted">
              {tab === 'mine' ? 'Start your own or browse open circles to join.' : 'Be the first to create one!'}
            </p>
            <Link href={`${BASE}/create`}>
              <Button>Start a Circle</Button>
            </Link>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((c) => (
              <CircleCard key={c.id} circle={c} basePath={BASE} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
