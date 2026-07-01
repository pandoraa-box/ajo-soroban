'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Circle } from '@/types/ajo';
import { formatAmount, contributionProgressPct, cycleIntervalToDays } from '@/types/ajo';

interface CircleListProps {
  circles: Circle[];
  basePath?: string;
  emptyLabel?: string;
}

export function CircleList({
  circles,
  basePath = '/circles',
  emptyLabel = 'No circles yet.',
}: CircleListProps) {
  if (circles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ajo-border py-12 text-center">
        <p className="mb-1 text-2xl">🌀</p>
        <p className="font-bold text-ajo-dark">{emptyLabel}</p>
        <p className="mt-1 text-sm text-ajo-muted">Start or join a circle to see it here.</p>
        <Link href={`${basePath.replace('/circles', '')}/circles/create`.replace('//circles', '/circles')} className="mt-4">
          <Button size="sm">Start a Circle</Button>
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {circles.map((c) => (
        <CircleRow key={c.id} circle={c} basePath={basePath} />
      ))}
    </ul>
  );
}

function CircleRow({ circle: c, basePath }: { circle: Circle; basePath: string }) {
  const pct = contributionProgressPct(c.state);
  const days = cycleIntervalToDays(c.config.cycle_interval_ledgers);
  const status = c.state.status.toLowerCase() as 'open' | 'active' | 'complete';

  return (
    <li className="flex items-center justify-between rounded-2xl border border-ajo-border bg-white px-5 py-4 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ajo-dark font-bold text-ajo-lime">
          {c.name[0]}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-bold text-ajo-dark">{c.name}</p>
            <Badge variant={status}>
              {status === 'open' ? 'Open' : status === 'active' ? 'Active' : 'Done'}
            </Badge>
          </div>
          <p className="text-xs text-ajo-muted">
            {formatAmount(c.config.contribution_amount)}/round · {days}-day cycles ·{' '}
            {c.state.participants.length}/{c.config.max_participants} members
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4 ml-4">
        {c.state.status === 'Active' && (
          <div className="hidden flex-col items-end sm:flex">
            <p className="text-xs text-ajo-muted">
              Round {c.state.current_cycle + 1}/{c.config.max_participants}
            </p>
            <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-ajo-surface">
              <div className="h-full rounded-full bg-ajo-lime" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
        <Link href={`${basePath}/${c.id}`}>
          <Button variant="secondary" size="sm">View</Button>
        </Link>
      </div>
    </li>
  );
}
