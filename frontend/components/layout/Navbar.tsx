'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/context/WalletContext';
import { cn } from '@/lib/utils';
import { shortenAddress } from '@/types/ajo';

const NAV_LINKS = [
  { href: '/#features',      label: 'Features'     },
  { href: '/#how-it-works',  label: 'How it works' },
  { href: '/dashboard',      label: 'Dashboard'    },
];

export function Navbar() {
  const pathname = usePathname();
  const { publicKey, isConnected, isConnecting, connect, disconnect } = useWallet();

  return (
    <header className="sticky top-0 z-50 border-b border-ajo-border bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-8xl items-center justify-between px-6 sm:px-12 xl:px-12 py-4">
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-ajo-lime transition-transform group-hover:scale-105">
            <span className="font-serif text-sm font-black text-white">A</span>
          </div>
          <span className="font-serif text-2xl font-medium text-ajo-dark">Ajo</span>
        </Link>

        {/* ── Nav links ── */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                pathname === l.href
                  ? 'bg-ajo-surface text-ajo-dark'
                  : 'text-ajo-muted hover:text-ajo-dark',
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* ── Right side ── */}
        <div className="flex items-center gap-3">
          {isConnected && publicKey ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-ajo-border bg-ajo-surface px-3 py-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-ajo-green animate-pulse" />
                <span className="font-mono text-xs text-ajo-muted">
                  {shortenAddress(publicKey)}
                </span>
              </div>
              <button
                onClick={disconnect}
                className="rounded-full border border-ajo-border px-3 py-1.5 text-xs font-semibold text-ajo-muted transition-colors hover:border-ajo-dark hover:text-ajo-dark"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="rounded-xl bg-ajo-lime px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-ajo-lime-dark hover:scale-[0.98] disabled:opacity-60"
            >
              {isConnecting ? 'Connecting…' : 'Connect Wallet'}
            </button>
          )}

          {/* GET APP pill */}
          <Link
            href="/dashboard"
            className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-ajo-dark bg-ajo-dark px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-ajo-dark-surface"
          >
            Open App
            <span className="text-white/50">→</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
