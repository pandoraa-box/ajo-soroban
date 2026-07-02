'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'How does the smart contract ensure fairness?',
    a: 'The contract locks the funds until all participants for a given round have paid their share. Once the pool is complete, it automatically transfers the total amount to the designated receiver for that round. Nobody can withdraw early or change the order.',
  },
  {
    q: 'What happens if someone doesn’t pay?',
    a: 'The current round remains locked until the payment is made. Since you only invite people you trust (like family and friends) to your circle, social accountability keeps things moving. Future updates will include automated collateral options.',
  },
  {
    q: 'Are there any hidden fees?',
    a: 'No. Ajo takes zero fees from your savings. You only pay the nominal Stellar network fee (usually a fraction of a cent) to execute the smart contract transaction.',
  },
  {
    q: 'Do I need crypto experience to use this?',
    a: 'Not at all. You just need a Stellar-compatible wallet like Freighter. We handle the complex smart contract interactions behind a simple, intuitive dashboard.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-ajo-surface py-28 lg:py-36">
      <div className="page-width">
        <div className="mb-16 text-center animate-slide-up">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ajo-lime">Questions</p>
          <h2 className="font-serif text-[clamp(2.4rem,5vw,4rem)] font-medium leading-[1.05] tracking-tight text-ajo-dark">
            Common questions.
          </h2>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className="overflow-hidden rounded-2xl border border-ajo-border bg-white transition-all animate-slide-up shadow-sm"
                style={{ animationDelay: `${(i + 1) * 100}ms`, animationFillMode: 'both' }}
              >
                <button
                  className="flex w-full items-center justify-between p-6 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span className="font-serif text-xl font-medium text-ajo-dark pr-8">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-ajo-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-ajo-muted leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
