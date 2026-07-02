const POINTS = [
  { stat: '3,000+', label: 'years of Ajo & Esusu tradition, now on-chain' },
  { stat: '100%',   label: 'of every pot goes to members — we take nothing' },
  { stat: '5 sec',  label: 'average time to settle a payout on Stellar' },
];

export function TrustBand() {
  return (
    <section className="bg-white border-y border-ajo-border">
      <div className="page-width py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4 md:gap-12 animate-slide-up" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
          {POINTS.map((p) => (
            <div key={p.stat} className="text-center sm:text-left">
              <p className="font-serif text-[clamp(2.5rem,4vw,3.5rem)] font-medium tracking-tight text-ajo-dark">{p.stat}</p>
              <p className="mt-2 text-sm text-ajo-muted leading-relaxed">{p.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
