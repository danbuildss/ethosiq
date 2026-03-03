"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-dark/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <span className="font-serif text-2xl tracking-tight text-white">
            Ethos<span className="text-gradient"> IQ</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            FAQ
          </a>
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <Link href="/app" className="btn-gradient inline-block rounded-full px-6 py-2.5 text-sm font-semibold text-white">
            Launch App
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`h-0.5 w-6 bg-white transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-opacity ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-white/5 bg-dark/95 px-6 py-6 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4">
            <a
              href="#features"
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              FAQ
            </a>
            <Link href="/app" className="btn-gradient mt-2 inline-block rounded-full px-6 py-2.5 text-center text-sm font-semibold text-white">
              Launch App
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
