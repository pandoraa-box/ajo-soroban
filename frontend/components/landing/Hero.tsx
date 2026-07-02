'use client';

import Link from 'next/link';

function HeroIllustration() {
  return (
    <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center animate-fade-in">
      <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Soft Organic Background Blob */}
        <path d="M308.5 110C347.5 149 367.5 204.5 352.5 251.5C337.5 298.5 287.5 337 232.5 350.5C177.5 364 117.5 352.5 78.5 313.5C39.5 274.5 21.5 208 32.5 152.5C43.5 97 83.5 52.5 138.5 39C193.5 25.5 269.5 71 308.5 110Z" fill="#F6F2EA" />
        
        {/* Connecting Lines (Blockchain / Network) */}
        <path d="M110 240 Q 200 120 290 190 T 320 280" stroke="#D47253" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" fill="none" />
        <path d="M150 150 L 250 250" stroke="#1E1D1B" strokeWidth="3" opacity="0.2" fill="none" />

        {/* Abstract Leaf Shape (Growth/Wealth) */}
        <path d="M250 250 C 250 150 350 150 350 250 C 350 350 250 350 250 250 Z" fill="#D47253" opacity="0.1" />
        <path d="M270 230 C 270 170 330 170 330 230 C 330 290 270 290 270 230 Z" fill="#D47253" />
        <path d="M270 230 C 270 170 330 170 330 230" stroke="#FFFFFF" strokeWidth="2" fill="none" />
        <path d="M270 230 L 300 200" stroke="#FFFFFF" strokeWidth="2" fill="none" />

        {/* Floating Nodes (Community Members) */}
        <circle cx="110" cy="240" r="28" fill="#1E1D1B" />
        <circle cx="150" cy="150" r="18" fill="#EBE8E1" stroke="#1E1D1B" strokeWidth="4" />
        <circle cx="210" cy="300" r="14" fill="#1E1D1B" />
        <circle cx="290" cy="190" r="36" fill="#FFFFFF" stroke="#D47253" strokeWidth="5" />
        <circle cx="290" cy="190" r="12" fill="#D47253" />

        {/* Accent Sparkles */}
        <path d="M70 120 L 75 135 L 90 140 L 75 145 L 70 160 L 65 145 L 50 140 L 65 135 Z" fill="#D47253" />
        <path d="M330 90 L 333 100 L 343 103 L 333 106 L 330 116 L 327 106 L 317 103 L 327 100 Z" fill="#1E1D1B" />
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ajo-surface border-b border-ajo-border/60">
      {/* Soft background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/50 blur-[100px] rounded-full pointer-events-none" />

      <div className="page-width pt-24 pb-16 lg:pt-32 lg:pb-24 relative z-10">
        <div className="grid items-center gap-16 lg:gap-24 lg:grid-cols-[1.1fr_1fr] xl:grid-cols-[1.2fr_550px]">
          
          <div className="flex flex-col items-start text-left space-y-8">
            <div className="inline-flex items-center gap-2 rounded-lg border border-ajo-border bg-white px-3 py-1.5 shadow-sm animate-slide-up" style={{ animationFillMode: 'both' }}>
              <span className="h-1.5 w-1.5 rounded-full bg-ajo-lime animate-pulse-slow" />
              <span className="text-xs font-semibold tracking-wide uppercase text-ajo-dark">Live on Stellar</span>
            </div>

            <h1 className="font-serif text-[clamp(3.2rem,7vw,6rem)] font-medium leading-[1.05] tracking-tight text-ajo-dark animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
              Your savings circle,<br />
              <span className="italic text-ajo-lime">on-chain.</span>
            </h1>

            <p className="max-w-xl text-[1.15rem] xl:text-[1.3rem] leading-[1.7] text-ajo-muted animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
              Ajo lets you save with friends — everyone puts in the same amount, one person gets the pot each round.
              No bank. No spreadsheets. Just the blockchain keeping things perfectly fair.
            </p>

            <div className="flex flex-wrap justify-start gap-4 pt-4 animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
              <Link
                href="/dashboard/circles/create"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-ajo-lime px-8 text-[0.95rem] font-medium text-white transition-all hover:bg-ajo-lime-dark hover:scale-[0.98]"
              >
                Start a Circle
              </Link>
              <Link
                href="/dashboard/circles"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-ajo-border bg-white px-8 text-[0.95rem] font-medium text-ajo-dark transition-all hover:border-ajo-dark hover:bg-ajo-surface shadow-sm"
              >
                See open circles
              </Link>
            </div>

            <div className="flex flex-wrap justify-start gap-12 pt-8 animate-slide-up" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
              <div className="text-left">
                <p className="font-serif text-3xl font-medium text-ajo-dark">$0</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ajo-muted mt-2">in fees, forever</p>
              </div>
              <div className="text-left">
                <p className="font-serif text-3xl font-medium text-ajo-dark">USDC</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ajo-muted mt-2">stable currency</p>
              </div>
              <div className="text-left">
                <p className="font-serif text-3xl font-medium text-ajo-dark">Open</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ajo-muted mt-2">source code</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end animate-slide-up" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
            <div className="relative w-full max-w-[480px]">
              {/* Orange decorative glow behind the illustration */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-ajo-lime/10 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 w-full">
                <HeroIllustration />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
