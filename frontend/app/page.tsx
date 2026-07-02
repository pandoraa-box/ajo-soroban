import { Hero } from '@/components/landing/Hero';
import { TrustBand } from '@/components/landing/TrustBand';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { WhyOnChain } from '@/components/landing/WhyOnChain';
import { Testimonials } from '@/components/landing/Testimonials';
import { FAQ } from '@/components/landing/FAQ';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <TrustBand />
      <Features />
      <HowItWorks />
      <WhyOnChain />
      <Testimonials />
      <FAQ />

      {/* CTA — white with a bold dark card */}
      <section className="bg-white py-28 lg:py-36">
        <div className="page-width">
          <div className="rounded-[2.5rem] bg-ajo-dark px-8 py-16 lg:px-16 lg:py-20 animate-slide-up">
            <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-serif text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-white">
                  Ready when you are.
                </h2>
                <p className="mt-4 max-w-md text-lg text-white/50 leading-relaxed">
                  No sign-up. No KYC. Just connect your Stellar wallet and start saving with your people.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link
                  href="/dashboard/circles/create"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-ajo-lime px-8 text-[0.95rem] font-medium text-white transition-all hover:bg-ajo-lime-dark hover:scale-[0.98]"
                >
                  Start a Circle
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-8 text-[0.95rem] font-medium text-white transition-all hover:border-white/40"
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
