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
    <section id="pricing" className="bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-3xl text-gray-900 md:text-5xl">
            Simple, <span className="text-gradient italic">Transparent</span>{" "}
            Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
            Pay with USDC, ETH, or BNKR on Base. No credit card needed.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 transition-shadow ${
                plan.highlighted
                  ? "border-blue-primary/30 bg-gradient-to-b from-blue-primary/5 to-green-primary/5 shadow-lg shadow-blue-primary/10"
                  : "border-gray-200 bg-white hover:shadow-md"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="btn-gradient rounded-full px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-serif text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm text-gray-500">{plan.period}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">{plan.description}</p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-green-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/app"
                className={`mt-8 block w-full rounded-full py-3 text-center text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? "btn-gradient text-white"
                    : "border border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50"
                }`}
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
