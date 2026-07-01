const POINTS = [
  { stat: '3,000+', label: 'years of Ajo & Esusu tradition, now on-chain' },
  { stat: '100%',   label: 'of every pot goes to members — we take nothing' },
  { stat: '5 sec',  label: 'average time to settle a payout on Stellar' },
];

export function TrustBand() {
  return (
    <section className="bg-white border-y border-ajo-border">
      <div className="page-width py-16">
        <div className="grid gap-10 sm:grid-cols-3">
          {POINTS.map((p) => (
            <div key={p.stat} className="text-center sm:text-left">
              <p className="text-4xl font-bold text-ajo-dark lg:text-5xl">{p.stat}</p>
              <p className="mt-2 text-sm text-ajo-muted leading-relaxed">{p.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
