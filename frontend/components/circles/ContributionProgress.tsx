import type { GroupState } from '@/types/ajo';
import { shortenAddress } from '@/types/ajo';

interface ContributionProgressProps {
  state: GroupState;
}

export function ContributionProgress({ state }: ContributionProgressProps) {
  const total = state.participants.length;
  const paid = state.paid_this_cycle.length;
  const pct = total > 0 ? Math.round((paid / total) * 100) : 0;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-ajo-border bg-white p-6">
      <h3 className="font-semibold text-ajo-dark">Contribution Progress</h3>

      {/* SVG ring */}
      <div className="relative">
        <svg width="140" height="140" className="-rotate-90">
          <circle
            cx="70" cy="70" r={radius}
            stroke="#F3F4F6"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="70" cy="70" r={radius}
            stroke="#16A34A"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-extrabold text-ajo-dark">{paid}/{total}</p>
          <p className="text-xs text-ajo-muted">paid</p>
        </div>
      </div>

      {/* Member rows */}
      <ul className="w-full space-y-2">
        {state.participants.map((addr) => {
          const hasPaid = state.paid_this_cycle.includes(addr);
          const isRecipient = state.participants[state.current_cycle] === addr;
          return (
            <li
              key={addr}
              className="flex items-center justify-between rounded-xl px-3 py-2 odd:bg-stone-50"
            >
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${hasPaid ? 'bg-ajo-green' : 'bg-stone-200'}`} />
                <span className="font-mono text-xs text-ajo-dark">
                  {shortenAddress(addr)}
                </span>
                {isRecipient && (
                  <span className="rounded-full bg-ajo-amber-light px-1.5 py-0.5 text-xs font-medium text-ajo-amber">
                    recipient
                  </span>
                )}
              </div>
              <span
                className={`text-xs font-semibold ${hasPaid ? 'text-ajo-green' : 'text-stone-400'}`}
              >
                {hasPaid ? '✓ Paid' : 'Pending'}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
