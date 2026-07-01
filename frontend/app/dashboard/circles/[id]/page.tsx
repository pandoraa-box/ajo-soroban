'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useCircle } from '@/hooks/useCircle';
import { useWallet } from '@/context/WalletContext';
import { ContributionProgress } from '@/components/circles/ContributionProgress';
import { MemberList } from '@/components/circles/MemberList';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  formatAmount,
  cycleIntervalToDays,
  shortenAddress,
  contributionProgressPct,
} from '@/types/ajo';
import { txContribute, txJoinGroup, txPayout } from '@/lib/contract';
import Link from 'next/link';
import { ChevronLeft, ArrowUpRight } from 'lucide-react';

export default function DashboardCircleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const groupId = parseInt(id, 10);
  const { publicKey, isConnected, connect } = useWallet();
  const { circle, loading, error, refresh } = useCircle(groupId, publicKey ?? 'DEMO');

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [txMsg, setTxMsg] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ajo-lime border-t-transparent" />
      </div>
    );
  }

  if (error || !circle) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-10">
        <p className="text-2xl font-bold text-ajo-dark">Circle not found</p>
        <Link href="/dashboard/circles">
          <Button variant="secondary" size="sm">Back to Circles</Button>
        </Link>
      </div>
    );
  }

  const { config, state } = circle;
  const isMember = publicKey ? state.participants.includes(publicKey) : false;
  const hasContributed = publicKey ? state.paid_this_cycle.includes(publicKey) : false;
  const isRecipient = state.participants[state.current_cycle] === publicKey;
  const allPaid = state.paid_this_cycle.length >= state.participants.length;
  const days = cycleIntervalToDays(config.cycle_interval_ledgers);
  const pct = contributionProgressPct(state);
  const status = state.status.toLowerCase() as 'open' | 'active' | 'complete';

  async function runAction(action: string, fn: () => Promise<string>) {
    if (!isConnected) { connect(); return; }
    setActionLoading(action);
    setTxMsg(null);
    try {
      const hash = await fn();
      setTxMsg(`Done! Transaction: ${hash.slice(0, 18)}…`);
      setTimeout(refresh, 1500);
    } catch (err) {
      setTxMsg(`Something went wrong: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <>
      {/* Page header */}
      <div className="border-b border-ajo-border bg-white px-10 py-8">
        <Link
          href="/dashboard/circles"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-ajo-muted hover:text-ajo-dark transition-colors"
        >
          <ChevronLeft size={14} />
          Back to Circles
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ajo-dark text-2xl font-bold text-white">
              {circle.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-ajo-dark">{circle.name}</h1>
                <Badge variant={status}>{state.status}</Badge>
              </div>
              <p className="text-sm text-ajo-muted mt-0.5">
                Organized by {shortenAddress(config.admin)} · Circle #{circle.id}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {state.status === 'Open' && !isMember && (
              <Button loading={actionLoading === 'join'} onClick={() => runAction('join', () => txJoinGroup(circle.id))}>
                Join Circle
              </Button>
            )}
            {state.status === 'Active' && isMember && !hasContributed && (
              <Button variant="lime" loading={actionLoading === 'contribute'} onClick={() => runAction('contribute', () => txContribute(circle.id))}>
                Pay in {formatAmount(config.contribution_amount)}
              </Button>
            )}
            {state.status === 'Active' && allPaid && (
              <Button loading={actionLoading === 'payout'} onClick={() => runAction('payout', () => txPayout(circle.id))}>
                Release Payout
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="px-10 py-10 space-y-8">
        {txMsg && (
          <div className={`rounded-2xl px-6 py-4 text-sm font-medium ${txMsg.startsWith('Something') ? 'bg-red-50 text-red-600' : 'bg-ajo-lime-soft text-ajo-dark'}`}>
            {txMsg}
          </div>
        )}

        {/* Config grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Savings currency', value: 'USDC' },
            { label: 'Each person saves', value: formatAmount(config.contribution_amount) },
            { label: 'How often', value: `Every ${days} days` },
            { label: 'Group size', value: `${config.max_participants} people` },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-ajo-border bg-white px-5 py-5">
              <p className="mb-1.5 text-xs text-ajo-muted">{s.label}</p>
              <p className="text-lg font-bold text-ajo-dark">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Payout pool banner */}
        <div className="flex items-center justify-between rounded-3xl bg-ajo-dark px-8 py-7 text-white">
          <div>
            <p className="mb-1 text-sm text-white/50">Everyone receives</p>
            <p className="text-4xl font-bold">
              {formatAmount(config.contribution_amount * BigInt(config.max_participants))}
            </p>
          </div>
          {state.status === 'Active' && (
            <div className="text-right">
              <p className="text-sm text-white/50">
                Round {state.current_cycle + 1} of {config.max_participants}
              </p>
              <p className="mt-1 font-bold text-ajo-lime">
                {isRecipient ? '🎉 You receive this round!' : `→ ${shortenAddress(state.participants[state.current_cycle] ?? '')}`}
              </p>
            </div>
          )}
        </div>

        {/* Progress + members */}
        <div className="grid gap-6 lg:grid-cols-2">
          {state.status === 'Active' && <ContributionProgress state={state} />}
          <MemberList state={state} currentUserKey={publicKey} />
        </div>
      </div>
    </>
  );
}
