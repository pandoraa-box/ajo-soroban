import type { GroupState, ParticipantRecord } from '@/types/ajo';
import { shortenAddress } from '@/types/ajo';

interface MemberListProps {
  state: GroupState;
  records?: Record<string, ParticipantRecord>;
  currentUserKey?: string | null;
}

export function MemberList({ state, records, currentUserKey }: MemberListProps) {
  return (
    <div className="rounded-2xl border border-ajo-border bg-white overflow-hidden">
      <div className="flex items-center justify-between border-b border-ajo-border px-5 py-4">
        <h3 className="font-semibold text-ajo-dark">Rotation Order</h3>
        <span className="text-xs text-ajo-muted">
          {state.participants.length} members
        </span>
      </div>

      <ul className="divide-y divide-ajo-border">
        {state.participants.map((addr, index) => {
          const record = records?.[addr];
          const isPast = index < state.current_cycle;
          const isCurrent = index === state.current_cycle && state.status === 'Active';
          const isMe = addr === currentUserKey;

          return (
            <li
              key={addr}
              className={`flex items-center justify-between px-5 py-3 ${
                isCurrent ? 'bg-ajo-green-light' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 text-center text-xs font-bold text-ajo-muted">
                  {index + 1}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-ajo-dark">
                  {addr[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-sm text-ajo-dark">
                      {shortenAddress(addr)}
                    </span>
                    {isMe && (
                      <span className="rounded-full bg-ajo-dark px-1.5 py-0.5 text-xs text-white">
                        you
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isCurrent && (
                  <span className="rounded-full bg-ajo-green px-2.5 py-0.5 text-xs font-semibold text-white">
                    This cycle
                  </span>
                )}
                {isPast && record?.received_payout && (
                  <span className="text-xs font-medium text-ajo-muted">✓ Received</span>
                )}
                {isPast && !record?.received_payout && (
                  <span className="text-xs font-medium text-ajo-muted">Done</span>
                )}
                {!isPast && !isCurrent && (
                  <span className="text-xs text-stone-300">Upcoming</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
