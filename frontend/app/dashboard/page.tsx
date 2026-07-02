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
    <div className={`rounded-[2rem] border p-8 shadow-sm transition-transform hover:-translate-y-1 ${styles.wrap} animate-slide-up`}>
      <p className={`mb-4 text-xs font-semibold uppercase tracking-widest ${styles.label}`}>{label}</p>
      <p className={`font-serif text-[clamp(2rem,3vw,3rem)] font-medium leading-none tracking-tight ${styles.value}`}>{value}</p>
      {sub && <p className={`mt-4 text-sm font-medium ${styles.sub}`}>{sub}</p>}
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
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-ajo-border/60 bg-white/80 backdrop-blur-md px-10 py-5">
        <div className="animate-fade-in">
          <h1 className="font-serif text-2xl font-medium text-ajo-dark">
            {isConnected && publicKey ? `Hey, ${shortenAddress(publicKey, 4)} 👋` : 'Dashboard'}
          </h1>
          <p className="text-sm font-medium text-ajo-muted mt-1">
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
              <div className="flex items-center justify-between rounded-[2rem] border border-ajo-lime/30 bg-ajo-lime-soft px-8 py-6 shadow-sm animate-slide-up">
                <div className="flex items-center gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm text-3xl">🎉</div>
                  <div>
                    <p className="font-serif text-xl font-medium text-ajo-dark">It's your turn to receive!</p>
                    <p className="mt-1 text-sm text-ajo-dark/70">
                      {upcomingPayout.name} — once everyone pays in you'll receive{' '}
                      <strong className="font-serif text-lg text-ajo-lime">{formatAmount(upcomingPayout.config.contribution_amount * BigInt(upcomingPayout.config.max_participants))}</strong>.
                    </p>
                  </div>
                </div>
                <Link href={`${BASE}/${upcomingPayout.id}`}>
                  <button className="flex items-center gap-2 rounded-xl bg-ajo-lime px-6 py-3 text-sm font-semibold text-white hover:bg-ajo-lime-dark transition-colors hover:scale-95 transition-transform shadow-sm">
                    View Circle <ArrowUpRight size={16} />
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
            <div className="grid gap-6 lg:grid-cols-5 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
              <div className="lg:col-span-3 rounded-[2rem] border border-ajo-border bg-white shadow-sm overflow-hidden p-1"><SavingsChart circles={myCircles} userKey={publicKey ?? ''} /></div>
              <div className="lg:col-span-2">
                <div className="h-full rounded-[2rem] border border-ajo-border bg-white p-8 shadow-sm">
                  <div className="mb-8 flex items-center justify-between">
                    <h3 className="font-serif text-2xl font-medium text-ajo-dark">My Circles</h3>
                    <Link href={BASE} className="text-xs font-bold uppercase tracking-widest text-ajo-lime hover:text-ajo-lime-dark transition-colors">
                      See all
                    </Link>
                  </div>
                  {loading ? (
                    <div className="flex justify-center py-10">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ajo-lime border-t-transparent" />
                    </div>
                  ) : (
                    <CircleList circles={myCircles.slice(0, 4)} basePath={BASE} emptyLabel="No circles yet — start one!" />
                  )}
                </div>
              </div>
            </div>

            {/* Activity + quick actions */}
            <div className="grid gap-6 lg:grid-cols-3 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
              <div className="lg:col-span-2 rounded-[2rem] border border-ajo-border bg-white shadow-sm overflow-hidden p-1">
                <ActivityFeed circles={myCircles} userKey={publicKey ?? ''} basePath={BASE} />
              </div>
              <div className="rounded-[2rem] border border-ajo-border bg-white p-8 shadow-sm">
                <h3 className="mb-8 font-serif text-2xl font-medium text-ajo-dark">Quick actions</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Start a new circle',  href: `${BASE}/create`, lime: true  },
                    { label: 'Browse all circles',  href: BASE,             lime: false },
                    { label: 'Go to website',       href: '/',              lime: false },
                  ].map((a) => (
                    <Link key={a.label} href={a.href}>
                      <div className={`flex items-center justify-between rounded-xl px-5 py-4 transition-all ${a.lime ? 'bg-ajo-lime hover:bg-ajo-lime-dark' : 'bg-ajo-surface hover:bg-ajo-border'} hover:-translate-y-0.5 shadow-sm`}>
                        <span className={`text-sm font-semibold ${a.lime ? 'text-white' : 'text-ajo-dark'}`}>{a.label}</span>
                        <ArrowUpRight size={16} className={a.lime ? 'text-white/60' : 'text-ajo-dark/40'} />
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-8 rounded-3xl bg-ajo-sidebar p-8 shadow-sm">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">Test wallet balance</p>
                  <p className="font-serif text-3xl font-medium text-white">0 USDC</p>
                  <a
                    href="https://laboratory.stellar.org/#account-creator?network=test"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex w-full justify-center items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-3 text-sm font-semibold text-white transition-colors"
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
