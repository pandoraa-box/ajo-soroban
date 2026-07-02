const STEPS = [
  {
    n: '1',
    title: 'You set it up',
    body: 'Pick an amount, a frequency, and how many slots. Takes about 90 seconds.',
  },
  {
    n: '2',
    title: 'Your people join',
    body: "Share the circle link. When all the slots fill, it starts on its own — no manual kick-off.",
  },
  {
    n: '3',
    title: 'Everyone pays in each round',
    body: 'Same amount, same day. The contract holds the money until every person has contributed.',
  },
  {
    n: '4',
    title: 'The pot goes to whoever is next',
    body: 'When the round closes, the whole pot moves automatically. Then it repeats until everyone has received.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-28 lg:py-36">
      <div className="page-width">

        <div className="mb-20 animate-slide-up" style={{ animationFillMode: 'both' }}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ajo-lime">The process</p>
          <h2 className="max-w-xl font-serif text-[clamp(2.4rem,5vw,4rem)] font-medium leading-[1.05] tracking-tight text-ajo-dark">
            Simple enough to explain in four steps.
          </h2>
          <p className="mt-5 max-w-md text-lg text-ajo-muted leading-relaxed">
            No jargon. No hidden rules. Just a rotation that keeps going until everyone has had their turn.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div 
              key={s.n} 
              className="rounded-3xl border border-ajo-border bg-ajo-surface p-8 animate-slide-up"
              style={{ animationDelay: `${(i + 1) * 100}ms`, animationFillMode: 'both' }}
            >
              <div className="mb-7 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-ajo-dark font-serif text-lg text-ajo-lime">
                {s.n}
              </div>
              <h3 className="mb-3 font-serif text-[1.2rem] font-medium text-ajo-dark leading-snug">{s.title}</h3>
              <p className="text-sm leading-relaxed text-ajo-muted">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Example */}
        <div className="mt-14 rounded-3xl border border-ajo-border bg-ajo-surface p-9">
          <p className="mb-7 text-xs font-semibold uppercase tracking-widest text-ajo-muted">
            Example — 4 friends, $100 each
          </p>
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              { round: 'Round 1', name: 'Amara',  highlight: true  },
              { round: 'Round 2', name: 'Kofi',   highlight: false },
              { round: 'Round 3', name: 'Fatima', highlight: false },
              { round: 'Round 4', name: 'Emeka',  highlight: false },
            ].map((r) => (
              <div key={r.round} className={`flex flex-col gap-2 rounded-2xl p-6 text-center ${r.highlight ? 'bg-ajo-lime' : 'bg-white'}`}>
                <span className={`text-xs font-semibold ${r.highlight ? 'text-white/70' : 'text-ajo-muted'}`}>{r.round}</span>
                <span className={`text-xl font-bold ${r.highlight ? 'text-white' : 'text-ajo-dark'}`}>{r.name}</span>
                <span className={`text-2xl font-bold ${r.highlight ? 'text-white' : 'text-ajo-lime'}`}>$400</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-ajo-muted">
            Each person pays $400 total ($100 × 4 rounds) and receives $400 once. Everyone ends up even — but one person got their money early.
          </p>
        </div>
      </div>
    </section>
  );
}
