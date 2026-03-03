import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-grid glow-blue-green relative bg-dark px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        {/* Sparkle icon */}
        <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-primary/20 to-green-primary/20 p-4">
          <svg
            className="h-8 w-8 text-blue-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
            />
          </svg>
        </div>

        <h2 className="font-serif text-3xl text-white md:text-5xl lg:text-6xl">
          Your <span className="text-gradient italic">Reputation</span> Won&apos;t
          Fix Itself.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-400">
          Connect your wallet. Get your free score analysis. Start building
          trust onchain today.
        </p>

        <div className="mt-10">
          <Link href="/app" className="btn-gradient inline-block rounded-full px-10 py-4 text-lg font-semibold text-white">
            Get Started for Free
          </Link>
        </div>
      </div>
    </section>
  );
}
