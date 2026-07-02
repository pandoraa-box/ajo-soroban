export function WhyOnChain() {
  return (
    <section className="bg-ajo-surface py-28 lg:py-36 border-t border-ajo-border/60">
      <div className="page-width">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="animate-slide-up">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ajo-lime">Peace of mind</p>
            <h2 className="mb-6 font-serif text-[clamp(2.4rem,5vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-ajo-dark">
              No awkward reminders.<br className="hidden sm:block" /> No missing money.
            </h2>
            <p className="max-w-lg text-lg leading-relaxed text-ajo-muted mb-8">
              We’ve taken the traditional savings circle and made it completely stress-free. The system holds everyone's contributions securely and releases them automatically the moment a round completes. You never have to chase anyone for payment again.
            </p>
            
            <ul className="space-y-4">
              {[
                'Automated payouts straight to your wallet',
                'Everyone pays the exact agreed amount',
                '100% transparency on who has paid',
                'Funds are locked safely until payout day'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-ajo-dark">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ajo-lime/10">
                    <div className="h-2 w-2 rounded-full bg-ajo-lime" />
                  </div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex justify-center lg:justify-end animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/40 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-ajo-border bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                <svg className="h-10 w-10 text-ajo-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mb-2 font-serif text-2xl font-medium text-ajo-dark">Payout Sent!</h3>
              <p className="text-sm text-ajo-muted mb-8">Round 3 completed successfully</p>
              
              <div className="rounded-2xl bg-ajo-surface p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-ajo-muted mb-2">Sent to Amara</p>
                <p className="font-serif text-4xl font-medium text-ajo-lime">$1,200</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
