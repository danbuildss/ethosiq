const useCases = [
  {
    title: "New Wallets",
    price: "$15 one-time",
    priceColor: "var(--blue)",
    description: "Zero score? 30-day structured onboarding plan. Who to follow, which communities to join, which attestations to claim, and how to get your first reviews.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      </svg>
    ),
  },
  {
    title: "Active Builders",
    price: "$10 / month",
    priceColor: "var(--blue)",
    description: "Already in the game. Weekly coaching keeps you climbing. Know who to vouch for, who to drop, and which moves will boost your score the most.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L12 16.67l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03 3.656-3.563a1.523 1.523 0 0 0 .387-1.61Z" />
      </svg>
    ),
  },
  {
    title: "Damaged Reps",
    price: "$25 one-time",
    priceColor: "#f87171",
    description: "Got slashed? Score tanked? Emergency recovery plan. We analyze what happened, find the fastest path to recovery, and tell you exactly who to reach out to.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
];

export default function UseCases() {
  return (
    <section id="use-cases" className="px-5 py-20 md:py-28" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-3)" }}>
            Who It&apos;s For
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Built for Every <span style={{ color: "var(--blue)" }}>Reputation</span> Stage
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            Whether you&apos;re just starting out, actively building, or recovering from a setback — there&apos;s a plan for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {useCases.map((uc) => (
            <div
              key={uc.title}
              className="rounded-xl p-7"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div
                className="mb-5 inline-flex rounded-xl p-2.5"
                style={{ background: "var(--blue-dim)", color: "var(--blue)" }}
              >
                {uc.icon}
              </div>
              <h3 className="text-[17px] font-bold text-white mb-2">{uc.title}</h3>
              <span
                className="inline-block text-[12px] font-bold mb-4 rounded-md px-2.5 py-1"
                style={{ background: "var(--surface-2)", color: uc.priceColor }}
              >
                {uc.price}
              </span>
              <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                {uc.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
