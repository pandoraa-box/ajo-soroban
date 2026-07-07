import Link from 'next/link';

const MOCK_CIRCLES = [
  {
    id: 1,
    name: 'Lagos Savers',
    status: 'Active',
    pool: '$2,400',
    contribution: '$200',
    members: '8/12',
    cycle: '5',
    total: '12',
    progress: 62,
  },
  {
    id: 2,
    name: 'Diaspora Circle',
    status: 'Open',
    pool: '$1,500',
    contribution: '$150',
    members: '4/10',
    cycle: '—',
    total: '10',
    progress: 0,
  },
  {
    id: 3,
    name: 'Family Savings',
    status: 'Active',
    pool: '$600',
    contribution: '$100',
    members: '6/6',
    cycle: '3',
    total: '6',
    progress: 80,
  },
];

const STATUS_STYLES: Record<string, { badge: string; dot: string; text: string }> = {
  Active: { badge: 'bg-ajo-lime-soft',  dot: 'bg-ajo-lime',  text: 'text-ajo-lime'  },
  Open:   { badge: 'bg-ajo-amber-light', dot: 'bg-ajo-amber', text: 'text-ajo-amber' },
};

function MockCircleCard({ circle }: { circle: (typeof MOCK_CIRCLES)[0] }) {
  const st = STATUS_STYLES[circle.status] ?? STATUS_STYLES.Active;

  return (
    <div className="rounded-3xl border border-ajo-border bg-white p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ajo-dark">
          <span className="font-serif text-lg font-black text-white">{circle.name[0]}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-ajo-dark">{circle.name}</p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ajo-muted mt-0.5">
            Circle #{circle.id}
          </p>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${st.badge} ${st.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
          {circle.status === 'Active' ? 'Saving now' : 'Open to join'}
        </div>
      </div>

      {/* Pot */}
      <div className="rounded-2xl border border-ajo-border/60 bg-ajo-surface px-5 py-3">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-ajo-muted">
          Full pot payout
        </p>
        <p className="font-serif text-2xl font-bold text-ajo-dark">{circle.pool}</p>
      </div>

      {/* Stats */}
      <div className="flex items-center divide-x divide-ajo-border">
        {[
          { label: 'You save', value: circle.contribution },
          { label: 'Members',  value: circle.members },
          { label: 'Every',    value: '30d' },
        ].map((s) => (
          <div key={s.label} className="flex flex-1 flex-col items-center gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-ajo-muted">
              {s.label}
            </span>
            <span className="text-sm font-bold text-ajo-dark">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Progress */}
      {circle.status === 'Active' && (
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <span className="text-xs text-ajo-muted">
              Round {circle.cycle} of {circle.total}
            </span>
            <span className="text-xs font-semibold text-ajo-dark">{circle.progress}% paid</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-ajo-surface">
            <div
              className="h-2 rounded-full bg-ajo-lime transition-all"
              style={{ width: `${circle.progress}%` }}
            />
          </div>
        </div>
      )}

      {circle.status === 'Open' && (
        <div className="flex gap-1">
          {Array.from({ length: parseInt(circle.members.split('/')[1]) }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i < parseInt(circle.members.split('/')[0]) ? 'bg-ajo-dark' : 'bg-ajo-surface'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CirclesShowcase() {
  return (
    <section className="bg-ajo-dark py-28 lg:py-36 overflow-hidden">
      <div className="page-width">
        <div className="mb-14 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ajo-lime">
              Live circles
            </p>
            <h2 className="font-serif text-[clamp(2.2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-white">
              See how it works<br />
              <span className="italic text-ajo-lime">in real time.</span>
            </h2>
          </div>
          <p className="max-w-sm text-base text-white/50 leading-relaxed md:text-right">
            Every circle is transparent on-chain. Track contributions, payouts, and membership
            — no trust required.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_CIRCLES.map((c) => (
            <MockCircleCard key={c.id} circle={c} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/dashboard/circles"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-ajo-lime px-8 text-sm font-semibold text-white transition-all hover:bg-ajo-lime-dark hover:scale-[0.98]"
          >
            Browse all circles
          </Link>
          <Link
            href="/dashboard/circles/create"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/20 px-8 text-sm font-semibold text-white transition-all hover:border-white/40"
          >
            Start your own
          </Link>
        </div>
      </div>
    </section>
  );
}
