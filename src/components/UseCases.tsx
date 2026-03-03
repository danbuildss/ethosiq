const useCases = [
  {
    title: "New Wallets",
    price: "$15 one-time",
    description:
      "Zero score? 30-day structured onboarding plan. Who to follow, which communities to join, which attestations to claim, and how to get your first reviews.",
    icon: (
      <svg
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
        />
      </svg>
    ),
  },
  {
    title: "Active Builders",
    price: "$10/month",
    description:
      "Already in the game. Weekly coaching keeps you climbing. Know who to vouch for, who to drop, and which moves will boost your score the most.",
    icon: (
      <svg
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.42 15.17l-5.82-3.36a.5.5 0 010-.86l5.82-3.36a1 1 0 011.16 0l5.82 3.36a.5.5 0 010 .86l-5.82 3.36a1 1 0 01-1.16 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.924 7.625a1.523 1.523 0 00-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 00-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 001.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 002.226 1.616L12 16.67l4.518 2.375a1.534 1.534 0 002.226-1.617l-.863-5.03L21.536 8.8c.435-.423.6-1.032.389-1.612z"
        />
      </svg>
    ),
  },
  {
    title: "Damaged Reps",
    price: "$25 one-time",
    description:
      "Got slashed? Score tanked? Emergency recovery plan. We analyze what happened, find the fastest path to recovery, and tell you exactly who to reach out to.",
    icon: (
      <svg
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
  },
];

export default function UseCases() {
  return (
    <section className="bg-grid glow-bottom relative bg-dark px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-3xl text-white md:text-5xl">
            Built for Every{" "}
            <span className="text-gradient italic">Reputation</span> Stage
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Whether you&apos;re just starting out, actively building, or recovering
            from a setback — there&apos;s a plan for you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {useCases.map((uc) => (
            <div
              key={uc.title}
              className="glass group rounded-2xl p-8 transition-all hover:border-blue-primary/30"
            >
              <div className="mb-5 inline-flex text-blue-primary">
                {uc.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">{uc.title}</h3>
              <span className="mb-4 inline-block rounded-full bg-green-primary/10 px-3 py-1 text-xs font-semibold text-green-light">
                {uc.price}
              </span>
              <p className="leading-relaxed text-gray-400">{uc.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
