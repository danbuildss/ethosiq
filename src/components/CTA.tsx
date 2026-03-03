import Link from "next/link";

export default function CTA() {
  return (
    <section
      className="px-5 py-20 md:py-28"
      style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
    >
      <div className="mx-auto max-w-6xl">
        <div
          className="rounded-2xl p-10 md:p-16 text-center relative overflow-hidden"
          style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
        >
          {/* Background accent */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 600px 300px at 50% 100%, rgba(75,158,255,0.08), transparent)",
            }}
          />

          <div className="relative z-10">
            <div
              className="inline-flex items-center justify-center rounded-2xl p-4 mb-6"
              style={{ background: "var(--blue-dim)" }}
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "var(--blue)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
              </svg>
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white">
              Your <span style={{ color: "var(--blue)" }}>Reputation</span> Won&apos;t<br />Fix Itself.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              Connect your wallet. Get your free score analysis. Start building trust onchain today.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/app" className="btn-blue px-8 py-3.5 text-[15px] justify-center">
                Get Started for Free
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
              <a href="#features" className="btn-outline px-8 py-3.5 text-[15px] justify-center">
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
