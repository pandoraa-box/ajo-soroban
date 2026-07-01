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
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function CircleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const groupId = parseInt(id, 10);
  const { publicKey, isConnected, connect } = useWallet();
  const { circle, loading, error, refresh } = useCircle(groupId, publicKey ?? 'DEMO');

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [txMsg, setTxMsg] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ajo-green border-t-transparent" />
      </div>
    );
  }

  if (error || !circle) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-xl font-bold text-ajo-dark">Circle not found</p>
        <Link href="/circles">
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
      setTxMsg(`Transaction submitted: ${hash.slice(0, 16)}…`);
      setTimeout(refresh, 1500);
    } catch (err) {
      setTxMsg(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-ajo-bg px-6 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <Link
          href="/circles"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-ajo-muted hover:text-ajo-dark"
        >
          <ArrowLeft size={14} />
          All Circles
        </Link>

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ajo-dark text-2xl font-bold text-white">
              {circle.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-ajo-dark">{circle.name}</h1>
                <Badge variant={status}>{state.status}</Badge>
              </div>
              <p className="text-sm text-ajo-muted">
                Circle #{circle.id} · Admin: {shortenAddress(config.admin)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {state.status === 'Open' && !isMember && (
              <Button
                loading={actionLoading === 'join'}
                onClick={() => runAction('join', () => txJoinGroup(circle.id))}
              >
                Join Circle
              </Button>
            )}
            {state.status === 'Active' && isMember && !hasContributed && (
              <Button
                variant="green"
                loading={actionLoading === 'contribute'}
                onClick={() => runAction('contribute', () => txContribute(circle.id))}
              >
                Contribute {formatAmount(config.contribution_amount)}
              </Button>
            )}
            {state.status === 'Active' && allPaid && (
              <Button
                loading={actionLoading === 'payout'}
                onClick={() => runAction('payout', () => txPayout(circle.id))}
              >
                Trigger Payout
              </Button>
            )}
          </div>
        </div>

        {txMsg && (
          <div
            className={`mb-6 rounded-xl px-4 py-3 text-sm ${
              txMsg.startsWith('Error')
                ? 'bg-red-50 text-red-600'
                : 'bg-ajo-green-light text-ajo-green'
            }`}
          >
            {txMsg}
          </div>
        )}

        {/* Config cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Token',        value: 'USDC'                                   },
            { label: 'Per cycle',    value: formatAmount(config.contribution_amount)  },
            { label: 'Cycle length', value: `${days} days`                           },
            { label: 'Group size',   value: `${config.max_participants} members`     },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-ajo-border bg-white p-4 text-center">
              <p className="mb-1 text-xs text-ajo-muted">{s.label}</p>
              <p className="font-bold text-ajo-dark">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Payout pool banner */}
        <div className="mb-8 flex items-center justify-between rounded-2xl bg-ajo-dark px-6 py-4 text-white">
          <div>
            <p className="text-sm text-white/60">Total payout pool</p>
            <p className="text-2xl font-extrabold">
              {formatAmount(
                config.contribution_amount * BigInt(config.max_participants),
              )}
            </p>
          </div>
          {state.status === 'Active' && (
            <div className="text-right">
              <p className="text-sm text-white/60">
                Cycle {state.current_cycle + 1}/{config.max_participants}
              </p>
              <p className="font-semibold text-ajo-green">
                {isRecipient ? '🎉 You receive next' : `→ ${shortenAddress(state.participants[state.current_cycle] ?? '')}`}
              </p>
            </div>
          )}
        </div>

        {/* Two column layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {state.status === 'Active' && (
            <ContributionProgress state={state} />
          )}
          <MemberList
            state={state}
            currentUserKey={publicKey}
          />
        </div>
      </div>
    </div>
  );
}
