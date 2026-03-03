import Link from "next/link";

const mockProfiles = [
  { name: "vitalik.eth",       stat: "+2,840 ★",          badge: "score",    gradient: "from-indigo-600 to-purple-700"  },
  { name: "whateverman✨",      stat: "0.489e vouched",     badge: "vouch",    gradient: "from-emerald-600 to-teal-700"   },
  { name: "SAIF MR",           stat: "3 positive reviews", badge: "review",   gradient: "from-red-700 to-orange-600"     },
  { name: "AiRev",             stat: "+820 ★",             badge: "score",    gradient: "from-sky-600 to-blue-700"       },
  { name: "majdi | Σ:",        stat: "0.12e vouched",      badge: "vouch",    gradient: "from-violet-700 to-purple-800"  },
  { name: "beans.eth",         stat: "27 positive reviews",badge: "review",   gradient: "from-amber-600 to-yellow-600"   },
];

function ScoreLines() {
  return (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="inline-block">
      <rect width="32" height="4" rx="2" fill="currentColor" />
      <rect y="10" width="32" height="4" rx="2" fill="currentColor" />
      <rect y="20" width="32" height="4" rx="2" fill="currentColor" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="pt-14" style={{ background: "var(--bg)" }}>
      {/* Main hero grid */}
      <div className="mx-auto max-w-7xl px-5 pt-8 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr,1fr] gap-0 overflow-hidden rounded-xl" style={{ border: "1px solid var(--border)" }}>

          {/* Left: Featured card */}
          <div
            className="relative min-h-[360px] p-8 overflow-hidden flex flex-col justify-between"
            style={{ background: "var(--surface)" }}
          >
            {/* Top label */}
            <div className="flex items-center gap-2 z-10 relative">
              <span
                className="inline-block h-2 w-2 rounded-full animate-pulse"
                style={{ background: "var(--blue)" }}
              />
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
                AI Score Analysis • Live
              </span>
            </div>

            {/* Score watermark */}
            <div
              className="absolute bottom-0 right-0 leading-none select-none pointer-events-none"
              style={{
                fontSize: "11rem",
                fontWeight: 800,
                color: "rgba(255,255,255,0.04)",
                letterSpacing: "-6px",
                lineHeight: 1,
              }}
            >
              1491
            </div>

            {/* Ethos lines watermark bottom-right */}
            <div
              className="absolute bottom-7 right-8 opacity-10 pointer-events-none"
              style={{ color: "white" }}
            >
              <ScoreLines />
            </div>

            {/* Bottom content */}
            <div className="z-10 relative">
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
                ETHOS IQ · ANALYSIS #4,291
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug max-w-sm">
                "Your credibility score is leaving money on the table."
              </h2>
              <div className="flex items-center gap-3 mt-5">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-white" style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)" }}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--blue)" }}>Ethos IQ</span>
                <span style={{ color: "rgba(255,255,255,0.15)" }}>•</span>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>AI Reputation Coach</span>
              </div>
            </div>
          </div>

          {/* Right: Headline & CTA */}
          <div
            className="p-8 flex flex-col justify-center"
            style={{ background: "var(--surface)", borderLeft: "1px solid var(--border)" }}
          >
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold mb-6 w-fit"
              style={{ background: "var(--blue-dim)", color: "var(--blue)" }}
            >
              Free Score Analysis
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Know Your Score.<br />
              <span style={{ color: "var(--blue)" }}>Fix Your Rep.</span>
            </h1>

            <p className="mt-4 text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              Connect your wallet. Get your Ethos profile analyzed by AI. Receive a personalized action plan to build trust onchain — free.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link href="/app" className="btn-blue px-6 py-3 text-[14px] justify-center">
                Analyze My Wallet
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
              <a href="#features" className="btn-outline px-6 py-3 text-[14px] justify-center">
                See How It Works
              </a>
            </div>

            {/* Small trust signal */}
            <div className="flex items-center gap-2 mt-6">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "var(--green)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                No credit card • Connects via Privy • Built on Base
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile cards grid */}
      <div className="mx-auto max-w-7xl px-5 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {mockProfiles.map((p) => (
            <div
              key={p.name}
              className="relative rounded-xl overflow-hidden group cursor-pointer"
              style={{ border: "1px solid var(--border)" }}
            >
              {/* Avatar gradient background */}
              <div className={`bg-gradient-to-br ${p.gradient} h-32 flex items-center justify-center`}>
                <div
                  className="h-14 w-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ background: "rgba(0,0,0,0.3)", border: "2px solid rgba(255,255,255,0.2)" }}
                >
                  {p.name[0].toUpperCase()}
                </div>
              </div>

              {/* Bottom info */}
              <div
                className="px-3 py-2.5"
                style={{ background: "var(--surface)" }}
              >
                <p className="text-[13px] font-semibold text-white truncate">{p.name}</p>
                <p
                  className="text-[12px] mt-0.5 truncate"
                  style={{
                    color:
                      p.badge === "review" ? "var(--green)" :
                      p.badge === "vouch"  ? "var(--blue)"  :
                      "rgba(255,255,255,0.55)",
                  }}
                >
                  {p.badge === "review" && (
                    <span className="mr-1">↗</span>
                  )}
                  {p.stat}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
