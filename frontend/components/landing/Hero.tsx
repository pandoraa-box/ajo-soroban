'use client';

import Link from 'next/link';
import { DashboardPreview } from './DashboardPreview';

export function Hero() {
  return (
    <section className="overflow-hidden bg-white">
      <div className="page-width py-20 lg:py-28">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_400px]">

          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-ajo-border bg-ajo-blue-light px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-ajo-lime animate-pulse-slow" />
              <span className="text-xs font-bold text-ajo-dark">Live on Stellar Testnet</span>
            </div>

            <h1 className="text-[clamp(2.8rem,6vw,5.5rem)] font-bold leading-[1.0] tracking-[-0.03em] text-ajo-dark">
              Your savings<br />
              circle,{' '}
              <span className="text-ajo-lime">on-chain.</span>
            </h1>

            <p className="max-w-lg text-[1.15rem] leading-[1.65] text-ajo-muted">
              Ajo lets you save with friends — everyone puts in the same amount, one person gets the pot each round.
              No bank. No spreadsheets. Just the blockchain keeping things fair.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/dashboard/circles/create"
                className="rounded-full bg-ajo-lime px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-ajo-lime-dark hover:scale-[0.98]"
              >
                Start a Circle
              </Link>
              <Link
                href="/dashboard/circles"
                className="rounded-full border border-ajo-border px-7 py-3.5 text-sm font-bold text-ajo-dark transition-all hover:border-ajo-dark hover:bg-ajo-surface"
              >
                See open circles
              </Link>
            </div>

            <div className="flex gap-10 pt-5 border-t border-ajo-border">
              <div><p className="text-2xl font-bold text-ajo-dark">$0</p><p className="text-xs text-ajo-muted mt-0.5">in fees, forever</p></div>
              <div><p className="text-2xl font-bold text-ajo-dark">USDC</p><p className="text-xs text-ajo-muted mt-0.5">stable currency</p></div>
              <div><p className="text-2xl font-bold text-ajo-dark">Open</p><p className="text-xs text-ajo-muted mt-0.5">source code</p></div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
