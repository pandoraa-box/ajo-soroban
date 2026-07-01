'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/context/WalletContext';
import { shortenAddress } from '@/types/ajo';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, PlusCircle, LogOut, Wallet, Home } from 'lucide-react';

const NAV = [
  { href: '/dashboard',                label: 'Overview',       icon: LayoutDashboard },
  { href: '/dashboard/circles',        label: 'My Circles',     icon: Users           },
  { href: '/dashboard/circles/create', label: 'Start a Circle', icon: PlusCircle      },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { publicKey, isConnected, disconnect } = useWallet();

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-ajo-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-white/10 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-ajo-lime">
          <span className="text-sm font-bold text-white">A</span>
        </div>
        <span className="text-lg font-bold text-white">Ajo</span>
      </div>

      {/* Wallet chip */}
      {isConnected && publicKey && (
        <div className="mx-4 mt-5 rounded-2xl bg-white/5 px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ajo-lime/20">
              <Wallet size={13} className="text-ajo-lime" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">Connected</p>
              <p className="truncate font-mono text-xs font-semibold text-white">
                {shortenAddress(publicKey, 5)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-white/20">Menu</p>
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all',
              isActive(href)
                ? 'bg-ajo-lime text-white'
                : 'text-white/50 hover:bg-white/5 hover:text-white',
            )}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 p-4 space-y-1">
        <Link href="/" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-white/40 hover:bg-white/5 hover:text-white transition-colors">
          <Home size={13} /> Back to website
        </Link>
        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5">
          <div className="h-1.5 w-1.5 rounded-full bg-ajo-lime animate-pulse" />
          <span className="text-xs text-white/40">Stellar Testnet</span>
        </div>
        {isConnected && (
          <button
            onClick={disconnect}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-white/40 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut size={13} /> Disconnect wallet
          </button>
        )}
      </div>
    </aside>
  );
}
