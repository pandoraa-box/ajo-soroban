import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Circle } from '@/types/ajo';
import { formatAmount, contributionProgressPct, cycleIntervalToDays } from '@/types/ajo';
import { Users, Clock, Coins } from 'lucide-react';

interface CircleCardProps {
  circle: Circle;
  basePath?: string;
}

export function CircleCard({ circle: c, basePath = '/circles' }: CircleCardProps) {
  const pct = contributionProgressPct(c.state);
  const days = cycleIntervalToDays(c.config.cycle_interval_ledgers);
  const pool = formatAmount(c.config.contribution_amount * BigInt(c.config.max_participants));
  const status = c.state.status.toLowerCase() as 'open' | 'active' | 'complete';

  return (
    <Card className="flex flex-col gap-5 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ajo-dark text-lg font-bold text-ajo-lime">
            {c.name[0]}
          </div>
          <div>
            <h3 className="font-bold text-ajo-dark">{c.name}</h3>
            <p className="text-xs text-ajo-muted mt-0.5">Circle #{c.id}</p>
          </div>
        </div>
        <Badge variant={status}>{
          status === 'open' ? 'Open to join' :
          status === 'active' ? 'Saving now' : 'Finished'
        }</Badge>
      </div>

      {/* Payout pool highlight */}
      <div className="flex items-center justify-between rounded-2xl bg-ajo-lime px-5 py-4">
        <p className="text-sm font-semibold text-ajo-dark/70">Full pot payout</p>
        <p className="text-xl font-bold text-ajo-dark">{pool}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-ajo-border">
        <Stat icon={<Coins size={13} />} label="Per round" value={formatAmount(c.config.contribution_amount)} />
        <Stat icon={<Users size={13} />} label="People" value={`${c.state.participants.length}/${c.config.max_participants}`} />
        <Stat icon={<Clock size={13} />} label="Every" value={`${days}d`} />
      </div>

      {/* Active progress */}
      {c.state.status === 'Active' && (
        <div>
          <div className="mb-1.5 flex justify-between text-xs text-ajo-muted">
            <span>Round {c.state.current_cycle + 1} of {c.config.max_participants}</span>
            <span>{c.state.paid_this_cycle.length}/{c.state.participants.length} paid in</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-ajo-surface">
            <div
              className="h-full rounded-full bg-ajo-lime transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Open slot indicators */}
      {c.state.status === 'Open' && (
        <div className="flex gap-1">
          {Array.from({ length: c.config.max_participants }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i < c.state.participants.length ? 'bg-ajo-dark' : 'bg-ajo-surface'}`}
            />
          ))}
        </div>
      )}

      <Link href={`${basePath}/${c.id}`} className="mt-auto">
        <Button
          variant={c.state.status === 'Open' ? 'lime' : 'secondary'}
          size="sm"
          className="w-full"
        >
          {c.state.status === 'Open' ? 'Join Circle' : 'View Circle'}
        </Button>
      </Link>
    </Card>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 text-center">
      <div className="flex items-center gap-1 text-ajo-muted">{icon}</div>
      <p className="text-xs text-ajo-muted">{label}</p>
      <p className="text-sm font-bold text-ajo-dark">{value}</p>
    </div>
  );
}
