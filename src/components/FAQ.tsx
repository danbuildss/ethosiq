"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is an Ethos score and why does it matter?",
    answer: "Your Ethos score is a credibility metric for your onchain identity. It's built from reviews, vouches, and activity across the Ethos network. A higher score means more trust — which unlocks deals, community access, and partnerships in web3.",
  },
  {
    question: "How does Ethos IQ improve my score?",
    answer: "We analyze your full Ethos profile using AI and identify exactly what's helping and hurting your score. Then we give you a prioritized action plan — who to connect with, where to vouch, what to dispute — and track your progress weekly.",
  },
  {
    question: "What wallets and chains are supported?",
    answer: "Ethos IQ works with any wallet connected through Privy. Payments are processed on Base using USDC, ETH, or BNKR via the Bankr API. Your Ethos reputation data is pulled directly from the Ethos Network API.",
  },
  {
    question: "Can I try it before paying?",
    answer: "Yes — the free tier gives you a full score breakdown and one prioritized action to take today, no credit card or payment required. Just connect your wallet and get your analysis instantly.",
  },
  {
    question: "How do payments work?",
    answer: "All payments are crypto-native through the Bankr API on Base. You can pay with USDC, ETH, or BNKR. Subscriptions are $10/month for Core Coaching. Situational modules are one-time purchases ($15 or $25).",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="px-5 py-20 md:py-28" style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-3)" }}>
            FAQ
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Frequently Asked <span style={{ color: "var(--blue)" }}>Questions</span>
          </h2>
        </div>

        <div>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <button
                className="flex w-full items-center justify-between gap-4 py-5 text-left cursor-pointer"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-[15px] font-semibold text-white">{faq.question}</span>
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                >
                  <svg
                    className={`h-3.5 w-3.5 transition-transform ${openIndex === i ? "rotate-45" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all ${openIndex === i ? "max-h-60 pb-5" : "max-h-0"}`}
              >
                <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
