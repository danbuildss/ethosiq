"use client";

import { useState } from "react";
import Link from "next/link";

function EthosLines() {
  return (
    <svg width="20" height="15" viewBox="0 0 20 15" fill="none">
      <rect width="20" height="2.5" rx="1.25" fill="currentColor" />
      <rect y="6.25" width="20" height="2.5" rx="1.25" fill="currentColor" />
      <rect y="12.5" width="20" height="2.5" rx="1.25" fill="currentColor" />
    </svg>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 text-white">
          <EthosLines />
          <span className="text-[17px] font-bold tracking-tight">
            Ethos <span style={{ color: "var(--blue)" }}>IQ</span>
          </span>
        </Link>

        {/* Search bar */}
        <div
          className="hidden md:flex items-center gap-2 rounded-lg px-3 py-2 w-52"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: "var(--text-3)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <span className="text-[13px]" style={{ color: "var(--text-3)" }}>Search wallet or ENS…</span>
        </div>

        {/* Desktop nav — centered */}
        <div className="hidden md:flex items-center gap-0.5 mx-auto">
          <a href="#" className="px-3.5 py-1.5 rounded-md text-[14px] font-semibold text-white" style={{ background: "rgba(255,255,255,0.08)" }}>
            Home
          </a>
          <a href="#features" className="px-3.5 py-1.5 rounded-md text-[14px] font-medium transition-colors hover:text-white" style={{ color: "var(--text-2)" }}>
            Features
          </a>
          <a href="#pricing" className="px-3.5 py-1.5 rounded-md text-[14px] font-medium transition-colors hover:text-white" style={{ color: "var(--text-2)" }}>
            Pricing
          </a>
          <a href="#faq" className="px-3.5 py-1.5 rounded-md text-[14px] font-medium transition-colors hover:text-white" style={{ color: "var(--text-2)" }}>
            FAQ
          </a>
        </div>

        {/* Right: CTA */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <Link
            href="/app"
            className="btn-blue px-4 py-2 text-[13px]"
          >
            Launch App
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 md:hidden ml-auto"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`h-0.5 w-5 bg-white transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-5 bg-white transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-5 bg-white transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="px-5 py-5 md:hidden flex flex-col gap-3" style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
          <a href="#" className="text-sm font-semibold text-white" onClick={() => setMobileOpen(false)}>Home</a>
          <a href="#features" className="text-sm font-medium" style={{ color: "var(--text-2)" }} onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#pricing" className="text-sm font-medium" style={{ color: "var(--text-2)" }} onClick={() => setMobileOpen(false)}>Pricing</a>
          <a href="#faq" className="text-sm font-medium" style={{ color: "var(--text-2)" }} onClick={() => setMobileOpen(false)}>FAQ</a>
          <Link href="/app" className="btn-blue mt-2 px-4 py-2.5 text-sm justify-center" onClick={() => setMobileOpen(false)}>
            Launch App
          </Link>
        </div>
      )}
    </nav>
  );
}
