export function DashboardPreview() {
  return (
    <div className="relative w-full max-w-[340px] animate-fade-in">
      {/* Phone frame — light */}
      <div className="overflow-hidden rounded-3xl border border-ajo-border bg-white shadow-[0_20px_60px_rgba(27,60,138,0.15)]">
        {/* Title bar */}
        <div className="flex items-center justify-between bg-ajo-dark px-5 py-3">
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-ajo-lime">
              <span className="text-[10px] font-bold text-white">A</span>
            </div>
            <span className="text-xs font-bold text-white">Ajo</span>
          </div>
          <div className="h-1.5 w-1.5 rounded-full bg-ajo-lime animate-pulse-slow" />
        </div>

        <div className="p-5">
          {/* Greeting */}
          <div className="mb-5">
            <p className="text-xs text-ajo-muted">Good morning 👋</p>
            <p className="text-xl font-bold text-ajo-dark">Amara</p>
          </div>

          {/* Balance card — orange */}
          <div className="mb-4 rounded-2xl bg-ajo-lime p-4">
            <p className="text-xs font-semibold text-white/70">Total saved so far</p>
            <p className="mt-1 text-3xl font-bold text-white">$4,820</p>
            <div className="mt-3 flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-white/50" />
              <p className="text-xs font-medium text-white/70">3 active circles</p>
            </div>
          </div>

          {/* Alert */}
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
            <span className="text-lg">⏰</span>
            <div>
              <p className="text-xs font-bold text-amber-700">You're up next!</p>
              <p className="text-xs text-amber-600/70">Lagos Traders — $1,200 coming your way</p>
            </div>
          </div>

          {/* Circles */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ajo-muted">My Circles</p>
            {[
              { name: 'Lagos Traders',  members: '6/8', amount: '$150', dot: 'bg-ajo-lime' },
              { name: 'Abuja Builders', members: '3/5', amount: '$500', dot: 'bg-ajo-dark' },
            ].map((c) => (
              <div key={c.name} className="flex items-center justify-between rounded-xl bg-ajo-surface p-3">
                <div className="flex items-center gap-2.5">
                  <div className={`h-2 w-2 rounded-full ${c.dot}`} />
                  <div>
                    <p className="text-xs font-semibold text-ajo-dark">{c.name}</p>
                    <p className="text-[10px] text-ajo-muted">{c.members} saved this round</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-ajo-lime">{c.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -bottom-4 -right-4 flex items-center gap-2 rounded-2xl border border-ajo-border bg-white px-3 py-2 shadow-xl">
        <span className="text-lg">⛓️</span>
        <div>
          <p className="text-xs font-bold text-ajo-dark">On-chain</p>
          <p className="text-[10px] text-ajo-muted">Stellar Soroban</p>
        </div>
      </div>
    </div>
  );
}
