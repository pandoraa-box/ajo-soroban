import { Hero } from '@/components/landing/Hero';
import { TrustBand } from '@/components/landing/TrustBand';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <TrustBand />
      <Features />
      <HowItWorks />

      {/* CTA — white with a bold blue card */}
      <section className="bg-white py-28 lg:py-36">
        <div className="page-width">
          <div className="rounded-[2.5rem] bg-ajo-dark px-8 py-16 lg:px-16 lg:py-20">
            <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.1] tracking-tight text-white">
                  Ready when you are.
                </h2>
                <p className="mt-4 max-w-md text-lg text-white/50 leading-relaxed">
                  No sign-up. No KYC. Just connect your Stellar wallet and start saving with your people.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link
                  href="/dashboard/circles/create"
                  className="rounded-full bg-ajo-lime px-8 py-4 text-sm font-bold text-white transition-all hover:bg-ajo-lime-dark hover:scale-[0.98]"
                >
                  Start a Circle
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-full border border-white/20 px-8 py-4 text-sm font-bold text-white transition-all hover:border-white/40"
                >
                  Open Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
