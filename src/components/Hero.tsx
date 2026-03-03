import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-grid glow-blue-green relative overflow-hidden px-6 pt-32 pb-20 md:pt-44 md:pb-32">
      <div className="mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-gray-300 backdrop-blur">
          <span className="inline-block h-2 w-2 rounded-full bg-green-primary" />
          Free Score Analysis
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl font-serif text-4xl leading-tight md:text-6xl md:leading-tight lg:text-7xl lg:leading-tight">
          Your{" "}
          <span className="text-gradient italic">Reputation</span> Has a
          Score.
          <br />
          We Help You{" "}
          <span className="text-gradient italic">Fix It.</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 md:text-xl">
          Connect your wallet. Get your Ethos profile analyzed by AI. Receive a
          personalized action plan to build trust and credibility onchain.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/app" className="btn-gradient inline-block rounded-full px-8 py-3.5 text-base font-semibold text-white">
            Launch App — It&apos;s Free
          </Link>
          <a
            href="#features"
            className="rounded-full border border-white/10 px-8 py-3.5 text-base font-medium text-gray-300 transition-colors hover:border-white/20 hover:text-white"
          >
            See How It Works
          </a>
        </div>

        {/* Glassmorphic Score Preview Card */}
        <div className="glass mx-auto mt-16 max-w-lg rounded-2xl p-8">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">
              Score Preview
            </span>
            <span className="rounded-full bg-green-primary/10 px-3 py-1 text-xs font-semibold text-green-light">
              Live
            </span>
          </div>

          {/* Wallet Input */}
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <svg
              className="h-5 w-5 shrink-0 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h11m5-7h-2a2 2 0 00-2 2v0a2 2 0 002 2h2v-4z"
              />
            </svg>
            <span className="text-sm text-gray-500">
              Enter wallet address or ENS...
            </span>
          </div>

          {/* Score Bars Preview */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Credibility</span>
              <span className="font-semibold text-blue-primary">---</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
              <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-blue-primary to-green-primary opacity-40" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Vouches</span>
              <span className="font-semibold text-green-primary">---</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
              <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-green-primary to-blue-primary opacity-40" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Reviews</span>
              <span className="font-semibold text-blue-light">---</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
              <div className="h-full w-1/4 rounded-full bg-gradient-to-r from-blue-light to-green-light opacity-40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
