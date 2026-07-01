'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/context/WalletContext';
import { cn } from '@/lib/utils';
import { shortenAddress } from '@/types/ajo';

const NAV_LINKS = [
  { href: '/dashboard/circles', label: 'Circles'      },
  { href: '/#how-it-works',     label: 'How it works' },
  { href: '/dashboard',         label: 'Dashboard'    },
];

export function Navbar() {
  const pathname = usePathname();
  const { publicKey, isConnected, isConnecting, connect, disconnect } = useWallet();

  return (
    <header className="sticky top-0 z-50 border-b border-ajo-border bg-white">
      <nav className="mx-auto flex max-w-8xl items-center justify-between px-6 sm:px-12 xl:px-28 py-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-ajo-dark transition-colors group-hover:bg-ajo-lime">
            <span className="text-sm font-bold text-ajo-lime transition-colors group-hover:text-white">A</span>
          </div>
          <span className="text-lg font-bold text-ajo-dark">Ajo</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                pathname === l.href
                  ? 'bg-ajo-blue-light text-ajo-dark'
                  : 'text-ajo-muted hover:text-ajo-dark',
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isConnected && publicKey ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-ajo-border px-3 py-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-ajo-green" />
                <span className="font-mono text-xs text-ajo-muted">{shortenAddress(publicKey)}</span>
              </div>
              <button
                onClick={disconnect}
                className="rounded-full border border-ajo-border px-3 py-1.5 text-xs font-semibold text-ajo-muted hover:border-ajo-dark hover:text-ajo-dark transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="rounded-full bg-ajo-lime px-5 py-2 text-sm font-bold text-white transition-all hover:bg-ajo-lime-dark hover:scale-[0.98] disabled:opacity-60"
            >
              {isConnecting ? 'Connecting…' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
