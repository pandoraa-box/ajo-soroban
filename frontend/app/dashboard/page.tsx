'use client';

import { useWallet } from '@/context/WalletContext';
import { useAllCircles } from '@/hooks/useCircle';
import { SavingsChart } from '@/components/dashboard/SavingsChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { CircleList } from '@/components/dashboard/CircleList';
import { Button } from '@/components/ui/Button';
import { formatAmount, shortenAddress } from '@/types/ajo';
import Link from 'next/link';
import { Bell, ArrowUpRight } from 'lucide-react';

const BASE = '/dashboard/circles';

function KPICard({
  label, value, sub, accent = 'default',
}: {
  label: string; value: string; sub?: string; accent?: 'lime' | 'dark' | 'default';
}) {
  const styles = {
    lime:    { wrap: 'bg-ajo-lime border-ajo-lime',         label: 'text-ajo-dark/60', value: 'text-ajo-dark', sub: 'text-ajo-dark/50' },
    dark:    { wrap: 'bg-ajo-dark border-ajo-dark',         label: 'text-white/50',    value: 'text-white',    sub: 'text-white/40'    },
    default: { wrap: 'bg-white border-ajo-border',          label: 'text-ajo-muted',   value: 'text-ajo-dark', sub: 'text-ajo-muted'   },
  }[accent];

  return (
    <div className={`rounded-3xl border p-8 ${styles.wrap}`}>
      <p className={`mb-3 text-sm font-semibold ${styles.label}`}>{label}</p>
      <p className={`text-4xl font-bold tracking-tight ${styles.value}`}>{value}</p>
      {sub && <p className={`mt-2 text-xs ${styles.sub}`}>{sub}</p>}
    </div>
  );
}

export default function DashboardOverviewPage() {
  const { publicKey, isConnected, connect, isConnecting } = useWallet();
  const { circles, loading } = useAllCircles(publicKey);

  const myCircles = circles.filter((c) => publicKey && c.state.participants.includes(publicKey));
  const activeCount = myCircles.filter((c) => c.state.status === 'Active').length;

  const upcomingPayout = myCircles.find(
    (c) => c.state.status === 'Active' && c.state.participants[c.state.current_cycle] === publicKey,
  );

  const totalSaved = myCircles.reduce(
    (sum, c) => sum + (c.state.paid_this_cycle.includes(publicKey ?? '') ? c.config.contribution_amount : 0n),
    0n,
  );

  return (
    <>
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-ajo-border bg-white px-10 py-5">
        <div>
          <h1 className="text-xl font-bold text-ajo-dark">
            {isConnected && publicKey ? `Hey, ${shortenAddress(publicKey, 4)} 👋` : 'Dashboard'}
          </h1>
          <p className="text-xs text-ajo-muted mt-0.5">
            {isConnected ? "Here's how your savings are going." : 'Connect your wallet to get started.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-ajo-border bg-white hover:bg-ajo-surface transition-colors">
            <Bell size={14} className="text-ajo-muted" />
            {upcomingPayout && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-400" />}
          </button>
          {!isConnected ? (
            <Button onClick={connect} loading={isConnecting} size="sm">Connect Wallet</Button>
          ) : (
            <Link href={`${BASE}/create`}>
              <Button size="sm">+ New Circle</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="px-10 py-10 space-y-10">

        {/* Not connected */}
        {!isConnected && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-ajo-border bg-white py-28 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-ajo-lime text-4xl">🔐</div>
            <h2 className="mb-3 text-3xl font-bold text-ajo-dark">Connect your wallet</h2>
            <p className="mb-8 max-w-sm text-ajo-muted leading-relaxed">
              Link your Stellar wallet to see your circles, track your savings, and manage your payouts.
            </p>
            <Button onClick={connect} loading={isConnecting} size="lg">Connect Freighter Wallet</Button>
          </div>
        )}

        {isConnected && (
          <>
            {/* Payout alert */}
            {upcomingPayout && (
              <div className="flex items-center justify-between rounded-3xl border border-amber-200 bg-amber-50 px-8 py-6">
                <div className="flex items-center gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-3xl">🎉</div>
                  <div>
                    <p className="text-lg font-bold text-amber-900">It's your turn to receive!</p>
                    <p className="mt-0.5 text-sm text-amber-700/70">
                      {upcomingPayout.name} — once everyone pays in you'll receive{' '}
                      <strong>{formatAmount(upcomingPayout.config.contribution_amount * BigInt(upcomingPayout.config.max_participants))}</strong>.
                    </p>
                  </div>
                </div>
                <Link href={`${BASE}/${upcomingPayout.id}`}>
                  <button className="flex items-center gap-2 rounded-full bg-amber-800 px-5 py-2.5 text-xs font-bold text-white hover:bg-amber-900 transition-colors">
                    View Circle <ArrowUpRight size={13} />
                  </button>
                </Link>
              </div>
            )}

            {/* KPI cards */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <KPICard accent="lime" label="Circles you're in"    value={String(myCircles.length)}   sub={`${activeCount} saving right now`} />
              <KPICard              label="Saved this round"       value={totalSaved > 0n ? formatAmount(totalSaved) : '$0'} sub="Your contributions so far" />
              <KPICard accent={upcomingPayout ? 'dark' : 'default'} label="Coming your way" value={upcomingPayout ? formatAmount(upcomingPayout.config.contribution_amount * BigInt(upcomingPayout.config.max_participants)) : '—'} sub={upcomingPayout ? upcomingPayout.name : 'No payout this round'} />
              <KPICard              label="Open to join"           value={String(circles.filter((c) => c.state.status === 'Open').length)} sub="Circles accepting members" />
            </div>

            {/* Chart + circles */}
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3"><SavingsChart circles={myCircles} userKey={publicKey ?? ''} /></div>
              <div className="lg:col-span-2">
                <div className="h-full rounded-3xl border border-ajo-border bg-white p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-ajo-dark">My Circles</h3>
                    <Link href={BASE} className="text-xs font-bold text-ajo-muted hover:text-ajo-dark transition-colors">
                      See all →
                    </Link>
                  </div>
                  {loading ? (
                    <div className="flex justify-center py-10">
                      <div className="h-7 w-7 animate-spin rounded-full border-2 border-ajo-lime border-t-transparent" />
                    </div>
                  ) : (
                    <CircleList circles={myCircles.slice(0, 4)} basePath={BASE} emptyLabel="No circles yet — start one!" />
                  )}
                </div>
              </div>
            </div>

            {/* Activity + quick actions */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ActivityFeed circles={myCircles} userKey={publicKey ?? ''} basePath={BASE} />
              </div>
              <div className="rounded-3xl border border-ajo-border bg-white p-8">
                <h3 className="mb-6 text-lg font-bold text-ajo-dark">Quick actions</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Start a new circle',  href: `${BASE}/create`, lime: true  },
                    { label: 'Browse all circles',  href: BASE,             lime: false },
                    { label: 'Go to website',       href: '/',              lime: false },
                  ].map((a) => (
                    <Link key={a.label} href={a.href}>
                      <div className={`flex items-center justify-between rounded-2xl px-5 py-4 transition-all ${a.lime ? 'bg-ajo-lime hover:bg-ajo-lime-dark' : 'bg-ajo-surface hover:bg-ajo-border'}`}>
                        <span className="text-sm font-bold text-ajo-dark">{a.label}</span>
                        <ArrowUpRight size={14} className="text-ajo-dark/40" />
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl bg-ajo-dark p-6 text-white">
                  <p className="mb-1 text-xs font-semibold text-white/40">Test wallet balance</p>
                  <p className="text-2xl font-bold">0 USDC</p>
                  <a
                    href="https://laboratory.stellar.org/#account-creator?network=test"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ajo-lime px-4 py-2 text-xs font-bold text-white hover:bg-ajo-lime-dark transition-colors"
                  >
                    Get free test funds ↗
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
