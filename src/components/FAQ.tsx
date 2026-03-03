"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is an Ethos score and why does it matter?",
    answer:
      "Your Ethos score is a credibility metric for your onchain identity. It's built from reviews, vouches, and activity across the Ethos network. A higher score means more trust — which unlocks deals, community access, and partnerships in web3.",
  },
  {
    question: "How does Ethos IQ improve my score?",
    answer:
      "We analyze your full Ethos profile using AI and identify exactly what's helping and hurting your score. Then we give you a prioritized action plan — who to connect with, where to vouch, what to dispute — and track your progress weekly.",
  },
  {
    question: "What wallets and chains are supported?",
    answer:
      "Ethos IQ works with any wallet connected through Privy. Payments are processed on Base using USDC, ETH, or BNKR via the Bankr API. Your Ethos reputation data is pulled directly from the Ethos Network API.",
  },
  {
    question: "Can I try it before paying?",
    answer:
      "Yes — the free tier gives you a full score breakdown and one prioritized action to take today, no credit card or payment required. Just connect your wallet and get your analysis instantly.",
  },
  {
    question: "How do payments work?",
    answer:
      "All payments are crypto-native through the Bankr API on Base. You can pay with USDC, ETH, or BNKR. Subscriptions are $10/month for Core Coaching. Situational modules are one-time purchases ($15 or $25).",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="border-t border-gray-200 bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-3xl text-gray-900 md:text-5xl">
            Frequently Asked{" "}
            <span className="text-gradient italic">Questions</span>
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {faqs.map((faq, i) => (
            <div key={i} className="py-6">
              <button
                className="flex w-full cursor-pointer items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="pr-4 text-lg font-semibold text-gray-900">
                  {faq.question}
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:border-gray-300">
                  <svg
                    className={`h-4 w-4 transition-transform ${openIndex === i ? "rotate-45" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all ${
                  openIndex === i
                    ? "mt-4 max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="leading-relaxed text-gray-500">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
