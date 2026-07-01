const FEATURES = [
  {
    number: '01',
    title: 'Everyone gets their turn',
    body: "The rotation is set on day one — no one skips ahead, no one gets left out. When it's your round, the full pot drops straight into your wallet.",
  },
  {
    number: '02',
    title: 'The contract does the chasing',
    body: "Forget reminding people to pay. A smart contract tracks who's paid and who hasn't. Nobody can quietly disappear with everyone's money.",
  },
  {
    number: '03',
    title: 'Built around your life',
    body: "Weekly, fortnightly, monthly — you decide. Small group of four or a big one of twelve. Set it up the way it makes sense for your people.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-white py-28 lg:py-36">
      <div className="page-width">

        <div className="mb-20">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-ajo-lime">Why Ajo</p>
          <h2 className="max-w-xl text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-ajo-dark">
            A savings club that actually works.
          </h2>
          <p className="mt-5 max-w-lg text-lg text-ajo-muted leading-relaxed">
            Ajo and Esusu have existed for generations. We just removed the part where you have to trust someone with the money.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.number}
              className="group relative rounded-3xl border border-ajo-border bg-ajo-surface p-9 transition-all duration-200 hover:border-ajo-dark hover:bg-white hover:shadow-[0_4px_24px_rgba(27,60,138,0.08)]"
            >
              <p className="mb-6 text-4xl font-bold text-ajo-dark/8 group-hover:text-ajo-lime/20 transition-colors">
                {f.number}
              </p>
              <h3 className="mb-3 text-[1.1rem] font-bold text-ajo-dark leading-snug">{f.title}</h3>
              <p className="text-[0.93rem] leading-relaxed text-ajo-muted">{f.body}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
