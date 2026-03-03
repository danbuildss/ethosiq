import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Score analysis for any wallet",
    features: [
      "Full Ethos profile breakdown",
      "Score explained — what helps, what hurts",
      "One prioritized action to take today",
      "No credit card required",
    ],
    cta: "Connect Wallet",
    highlighted: false,
  },
  {
    name: "Core Coaching",
    price: "$10",
    period: "/month",
    description: "All four coaching modules unlocked",
    features: [
      "Everything in Free",
      "Weekly Brief — Telegram or email",
      "Reputation Matchmaker",
      "Vouch ROI Analyzer",
      "Score Simulator",
    ],
    cta: "Start Coaching",
    highlighted: true,
  },
  {
    name: "Situational",
    price: "$15–$25",
    period: "one-time",
    description: "Targeted plans for specific situations",
    features: [
      "New Wallet Accelerator — $15",
      "Reputation Recovery — $25",
      "Auto-triggers based on your profile",
      "30-day structured action plans",
    ],
    cta: "Get Your Plan",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="px-5 py-20 md:py-28" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-3)" }}>
            Pricing
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Simple, <span style={{ color: "var(--blue)" }}>Transparent</span> Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            Pay with USDC, ETH, or BNKR on Base. No credit card needed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative rounded-xl p-7 flex flex-col"
              style={{
                background: plan.highlighted ? "var(--surface-2)" : "var(--bg)",
                border: plan.highlighted ? "1px solid var(--blue)" : "1px solid var(--border)",
              }}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className="rounded-full px-4 py-1 text-[11px] font-bold text-white"
                    style={{ background: "var(--blue)" }}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-[15px] font-semibold text-white">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm" style={{ color: "var(--text-2)" }}>{plan.period}</span>
                  )}
                </div>
                <p className="mt-1.5 text-[13px]" style={{ color: "var(--text-2)" }}>{plan.description}</p>
              </div>

              <ul className="mt-7 space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-[13px]">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      style={{ color: "var(--green)" }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span style={{ color: "rgba(255,255,255,0.65)" }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/app"
                className="mt-8 block w-full rounded-lg py-2.5 text-center text-[14px] font-semibold transition-colors"
                style={
                  plan.highlighted
                    ? { background: "var(--blue)", color: "white" }
                    : { background: "var(--surface-2)", color: "rgba(255,255,255,0.7)", border: "1px solid var(--border)" }
                }
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
