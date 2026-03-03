const features = [
  {
    title: "Weekly Brief",
    description: "Every Monday — what changed in your score, what moved, and one prioritized action to take this week. Delivered to Telegram or email.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
  {
    title: "Reputation Matchmaker",
    description: "Agent scans your network and finds credible wallets who haven't reviewed you yet. Drafts personalized outreach. You approve and send.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    title: "Vouch ROI Analyzer",
    description: "Tracks every ETH you've vouched into other wallets. Shows who vouched back, who hasn't, who's been slashed. Tells you who to keep and who to cut.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    title: "Score Simulator",
    description: "Before you do anything onchain — vouch, slash, accept a review — preview the impact on your score. Decision support before you commit.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="px-5 py-20 md:py-28" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-3)" }}>
            Coaching Modules
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Four Modules. <span style={{ color: "var(--blue)" }}>One Coach.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            Your $10/month subscription unlocks all four AI-powered coaching tools — each designed to grow your reputation strategically.
          </p>
        </div>

        {/* 2x2 grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-xl"
          style={{ border: "1px solid var(--border)" }}
        >
          {features.map((f, i) => (
            <div
              key={f.title}
              className="feature-cell p-8 md:p-10"
              style={{
                background: "var(--surface)",
                borderRight:  (i % 2 === 0) ? "1px solid var(--border)" : undefined,
                borderBottom: (i < 2)       ? "1px solid var(--border)" : undefined,
              }}
            >
              <div
                className="mb-5 inline-flex rounded-xl p-3"
                style={{ background: "var(--blue-dim)", color: "var(--blue)" }}
              >
                {f.icon}
              </div>
              <h3 className="mb-3 text-[17px] font-bold text-white">{f.title}</h3>
              <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
