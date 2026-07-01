import Link from 'next/link';
import type { Circle } from '@/types/ajo';
import { formatAmount } from '@/types/ajo';

interface ActivityFeedProps {
  circles: Circle[];
  userKey: string;
  basePath?: string;
}

type Event = {
  type: 'contributed' | 'joined' | 'received';
  circleName: string;
  circleId: number;
  amount: string | null;
  time: string;
};

const META: Record<Event['type'], { icon: string; label: string; amountColor: string }> = {
  contributed: { icon: '💸', label: 'You paid into',      amountColor: 'text-ajo-muted'  },
  joined:      { icon: '🙌', label: 'You joined',          amountColor: 'text-ajo-muted'  },
  received:    { icon: '🎉', label: 'You received from',   amountColor: 'text-ajo-green'  },
};

export function ActivityFeed({ circles, userKey, basePath = '/dashboard/circles' }: ActivityFeedProps) {
  // Build the feed purely from real circle state.
  const events: Event[] = circles.flatMap((c) => {
    const items: Event[] = [];

    // Received a payout — user is a past recipient in an active/complete circle.
    const userIndex = c.state.participants.indexOf(userKey);
    if (userIndex >= 0 && userIndex < c.state.current_cycle) {
      items.push({
        type: 'received',
        circleName: c.name,
        circleId: c.id,
        amount: formatAmount(c.config.contribution_amount * BigInt(c.config.max_participants)),
        time: `Round ${userIndex + 1}`,
      });
    }

    // Contributed this round.
    if (c.state.paid_this_cycle.includes(userKey)) {
      items.push({
        type: 'contributed',
        circleName: c.name,
        circleId: c.id,
        amount: formatAmount(c.config.contribution_amount),
        time: 'This round',
      });
    }

    // Joined the circle.
    if (c.state.participants.includes(userKey)) {
      items.push({ type: 'joined', circleName: c.name, circleId: c.id, amount: null, time: 'When you joined' });
    }

    return items;
  });

  return (
    <div className="rounded-3xl border border-ajo-border bg-white p-8">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-ajo-dark">Recent Activity</h3>
        <span className="text-xs text-ajo-muted">{events.length} events</span>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-3xl mb-2">🗂️</p>
          <p className="text-sm font-medium text-ajo-dark">No activity yet</p>
          <p className="text-xs text-ajo-muted mt-1">Your contributions and payouts will appear here.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {events.slice(0, 6).map((item, idx) => {
            const m = META[item.type];
            return (
              <Link key={idx} href={`${basePath}/${item.circleId}`} className="flex items-center gap-4 group">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ajo-surface text-xl transition-colors group-hover:bg-ajo-lime-soft">
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ajo-dark truncate">
                    {m.label} <span className="font-bold">{item.circleName}</span>
                  </p>
                  <p className="text-xs text-ajo-muted">{item.time}</p>
                </div>
                {item.amount && (
                  <span className={`text-sm font-bold shrink-0 ${m.amountColor}`}>
                    {item.type === 'received' ? '+' : '-'}{item.amount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
