const REVIEWS = [
  {
    text: "We used to track our family savings group in a WhatsApp chat and an Excel sheet. Moving it on-chain with Ajo completely eliminated the awkwardness of reminding cousins to pay.",
    author: "Nneka O.",
    role: "Family Circle Organizer"
  },
  {
    text: "I was skeptical about using crypto for our office Esusu, but having it settle automatically in USDC means we don't worry about inflation or someone forgetting their turn.",
    author: "Kwame A.",
    role: "Freelance Designer"
  },
  {
    text: "The smartest implementation of a traditional savings model I've seen. The smart contract does exactly what a trusted community leader would do, but perfectly and instantly.",
    author: "Sarah J.",
    role: "Tech Entrepreneur"
  }
];

export function Testimonials() {
  return (
    <section className="bg-white py-28 lg:py-36">
      <div className="page-width">
        <div className="mb-16 text-center animate-slide-up">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ajo-lime">Community</p>
          <h2 className="font-serif text-[clamp(2.4rem,5vw,4rem)] font-medium leading-[1.05] tracking-tight text-ajo-dark">
            Trusted by circles everywhere.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <div 
              key={i} 
              className="flex flex-col justify-between rounded-3xl border border-ajo-border bg-ajo-surface p-8 transition-transform hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${(i + 1) * 100}ms`, animationFillMode: 'both' }}
            >
              <div className="mb-8">
                <div className="mb-6 flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="h-5 w-5 text-ajo-lime" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="font-serif text-[1.1rem] leading-relaxed text-ajo-dark">"{review.text}"</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ajo-dark font-serif text-white">
                  {review.author[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-ajo-dark">{review.author}</p>
                  <p className="text-xs text-ajo-muted">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
