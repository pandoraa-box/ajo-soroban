'use client';

import type { Circle } from '@/types/ajo';
import { formatAmount } from '@/types/ajo';

interface SavingsChartProps {
  circles: Circle[];
  userKey: string;
}

export function SavingsChart({ circles, userKey }: SavingsChartProps) {
  // One bar per circle the user belongs to — height = their per-round contribution.
  const bars = circles.map((c) => ({
    label: c.name[0],
    name: c.name,
    value: Number(c.config.contribution_amount),
    contributed: c.state.paid_this_cycle.includes(userKey),
  }));

  const totalSaved = circles.reduce(
    (sum, c) => sum + (c.state.paid_this_cycle.includes(userKey) ? c.config.contribution_amount : 0n),
    0n,
  );

  const max = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className="rounded-3xl border border-ajo-border bg-white p-8">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-ajo-dark">Your savings</h3>
        <p className="text-xs text-ajo-muted mt-0.5">Per-round contribution across your circles</p>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-bold text-ajo-dark">
          {totalSaved > 0n ? formatAmount(totalSaved) : '$0'}
        </span>
        <span className="ml-2 text-sm text-ajo-muted">contributed this round</span>
      </div>

      {bars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-3xl mb-2">📊</p>
          <p className="text-sm font-medium text-ajo-dark">No savings to show yet</p>
          <p className="text-xs text-ajo-muted mt-1">Join a circle to start tracking your savings.</p>
        </div>
      ) : (
        <div className="flex items-end gap-3 h-36">
          {bars.map((b, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-1 items-end">
                <div
                  className={`w-full rounded-t-xl transition-all duration-500 ${b.contributed ? 'bg-ajo-lime' : 'bg-ajo-blue-light'}`}
                  style={{ height: `${Math.max((b.value / max) * 100, 8)}%` }}
                />
              </div>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ajo-dark text-[10px] font-bold text-ajo-lime">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {bars.length > 0 && (
        <div className="mt-4 flex items-center gap-4 border-t border-ajo-border pt-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-ajo-lime" />
            <span className="text-xs text-ajo-muted">Paid this round</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-ajo-blue-light" />
            <span className="text-xs text-ajo-muted">Not yet paid</span>
          </div>
        </div>
      )}
    </div>
  );
}
