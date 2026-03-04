"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ── Shared styles ──────────────────────────────────────────────── */
const BG = "#0A0A0A";
const SURFACE = "#111111";
const SURFACE2 = "#161616";
const BORDER = "#1A1A1A";
const BLUE = "#4D8EFF";
const GREEN = "#00FF94";
const AMBER = "#F59E0B";
const MUTED = "rgba(255,255,255,0.45)";
const MUTED2 = "rgba(255,255,255,0.25)";

/* ── Global responsive styles ───────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @media (max-width: 768px) {
      .hero-inner { flex-direction: column !important; text-align: center; }
      .features-grid { grid-template-columns: 1fr !important; }
      .stats-grid { grid-template-columns: 1fr !important; }
      .pricing-grid { grid-template-columns: 1fr !important; }
      .how-grid { grid-template-columns: 1fr !important; }
      .nav-links { display: none !important; }
      .hero-widget { display: none !important; }
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-fade-up { animation: fadeUp 0.6s ease forwards; }
    .animate-fade-up-delay-1 { animation: fadeUp 0.6s ease 0.1s forwards; opacity: 0; }
    .animate-fade-up-delay-2 { animation: fadeUp 0.6s ease 0.2s forwards; opacity: 0; }
    .animate-fade-up-delay-3 { animation: fadeUp 0.6s ease 0.3s forwards; opacity: 0; }
    .animate-scale-in { animation: scaleIn 0.5s ease forwards; }
    .animate-pulse-slow { animation: pulse 3s ease-in-out infinite; }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    .score-shimmer {
      background: linear-gradient(90deg, #4D8EFF 0%, #a5c4ff 50%, #4D8EFF 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 3s linear infinite;
    }
  `}</style>
);

/* ── Dot-grid overlay ───────────────────────────────────────────── */
function DotGrid() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

/* ── Logo mark ──────────────────────────────────────────────────── */
function LogoMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.78)} viewBox="0 0 20 15" fill="none">
      <rect width="20" height="2.5" rx="1.25" fill="currentColor" />
      <rect y="6.25" width="20" height="2.5" rx="1.25" fill="currentColor" />
      <rect y="12.5" width="20" height="2.5" rx="1.25" fill="currentColor" />
    </svg>
  );
}

/* ── Navbar ─────────────────────────────────────────────────────── */
function Navbar() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(10,10,10,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 20px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 17,
          }}
        >
          <LogoMark size={18} />
          <span>Ethos<span style={{ color: BLUE }}>IQ</span></span>
        </Link>

        {/* Nav links */}
        <div
          className="nav-links"
          style={{
            display: "flex",
            gap: 32,
            alignItems: "center",
          }}
        >
          {["How It Works", "Features", "Pricing", "FAQ"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              style={{
                color: MUTED,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/app"
          style={{
            background: BLUE,
            color: "#fff",
            fontWeight: 600,
            fontSize: 14,
            padding: "10px 20px",
            borderRadius: 8,
            textDecoration: "none",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#6BA3FF")}
          onMouseLeave={(e) => (e.currentTarget.style.background = BLUE)}
        >
          Check Your Score
        </Link>
      </div>
    </nav>
  );
}

/* ── Score Widget preview ───────────────────────────────────────── */
function ScoreWidget() {
  return (
    <div
      style={{
        background: SURFACE,
        border: `1px solid rgba(77,142,255,0.35)`,
        borderRadius: 16,
        padding: "28px 24px",
        width: "100%",
        maxWidth: 320,
        boxShadow: "0 0 40px rgba(77,142,255,0.18), 0 0 80px rgba(77,142,255,0.06)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blue glow top right */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(77,142,255,0.25) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4D8EFF, #7B61FF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 16,
              color: "#fff",
            }}
          >
            V
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>vitalik.eth</div>
            <div style={{ fontSize: 12, color: MUTED }}>0x1234&hellip;abcd</div>
          </div>
        </div>
        <span
          style={{
            background: "rgba(77,142,255,0.18)",
            color: "#6B9FFF",
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 20,
            border: "1px solid rgba(77,142,255,0.3)",
          }}
        >
          Reputable
        </span>
      </div>

      {/* Score */}
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: MUTED2, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
          Ethos Score
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1,
            letterSpacing: "-3px",
          }}
        >
          1847
        </div>
        <div style={{ fontSize: 13, color: MUTED, marginTop: 4, fontStyle: "italic" }}>
          Top 12% of all profiles
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ margin: "16px 0 8px" }}>
        <div
          style={{
            height: 6,
            borderRadius: 6,
            background: SURFACE2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "66%",
              borderRadius: 6,
              background: `linear-gradient(90deg, ${BLUE}, #6B9FFF)`,
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 10, color: MUTED2 }}>Untrusted</span>
          <span style={{ fontSize: 10, color: MUTED2 }}>Exemplary</span>
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          marginTop: 16,
          paddingTop: 16,
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        {[
          { label: "Reviews", value: "24", sub: "96% pos" },
          { label: "Vouches", value: "18", sub: "1.2 ETH" },
          { label: "Mutual", value: "11", sub: "(3,3)" },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{s.value}</div>
            <div style={{ fontSize: 10, color: MUTED2, marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 10, color: GREEN, marginTop: 1 }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Hero ───────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      style={{
        minHeight: "92vh",
        background: BG,
        position: "relative",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <DotGrid />

      {/* Blue corner glows */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -200,
          left: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(77,142,255,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -150,
          right: -150,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(77,142,255,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div
        className="hero-inner"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1100,
          margin: "0 auto",
          padding: "80px 20px",
          display: "flex",
          gap: 60,
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Left: copy */}
        <div style={{ maxWidth: 560, flex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(77,142,255,0.1)",
              border: "1px solid rgba(77,142,255,0.25)",
              borderRadius: 20,
              padding: "6px 14px",
              marginBottom: 28,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN }} />
            <span style={{ fontSize: 12, color: "#6B9FFF", fontWeight: 600 }}>
              Now live on Base
            </span>
          </div>

          <h1
            className="animate-fade-up"
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 800,
              lineHeight: 1.08,
              color: "#fff",
              letterSpacing: "-2px",
              marginBottom: 24,
            }}
          >
            Your Web3{" "}
            <em
              style={{
                fontStyle: "italic",
                fontFamily: "Georgia, 'Times New Roman', serif",
                color: "#6B9FFF",
                fontWeight: 700,
              }}
            >
              reputation
            </em>
            <br />
            has a number.
          </h1>

          <p
            className="animate-fade-up-delay-1"
            style={{
              fontSize: 18,
              color: MUTED,
              lineHeight: 1.65,
              marginBottom: 40,
              maxWidth: 460,
            }}
          >
            EthosIQ analyzes your on-chain credibility score, identifies every factor holding you back, and gives you one action per day to improve it.
          </p>

          <div className="animate-fade-up-delay-2" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/app"
              style={{
                background: BLUE,
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                padding: "14px 28px",
                borderRadius: 10,
                textDecoration: "none",
                transition: "background 0.15s",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Check Your Score, Free
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
            <a
              href="#how-it-works"
              style={{
                background: "transparent",
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                padding: "14px 28px",
                borderRadius: 10,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                transition: "all 0.15s",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              See How It Works
            </a>
          </div>

          <p style={{ fontSize: 12, color: MUTED2, marginTop: 16 }}>
            No credit card. Connects with your existing wallet.
          </p>
        </div>

        {/* Right: widget */}
        <div
          className="hero-widget animate-fade-up-delay-3"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <ScoreWidget />
        </div>
      </div>
    </section>
  );
}

/* ── Partners ────────────────────────────────────────────────────── */
function Partners() {
  const logos = [
    {
      src: "/logos/base-logo.jpg",
      alt: "Base",
      bg: "#0052FF",
      imgStyle: { borderRadius: 6, objectFit: "cover" as const },
    },
    {
      src: "/logos/privy-logo.jpg",
      alt: "Privy",
      bg: "#0A0A0A",
      imgStyle: { filter: "brightness(0) invert(1)", objectFit: "contain" as const },
    },
    {
      src: "/logos/ethos-logo.jpg",
      alt: "Ethos Network",
      bg: "#B8B8A8",
      imgStyle: { objectFit: "cover" as const, borderRadius: 4 },
    },
    { src: "/logos/bankr.svg", alt: "Bankr", bg: "#1A1A1A", imgStyle: { filter: "brightness(0) invert(1)", objectFit: "contain" as const } },
    { src: "/logos/claude.svg", alt: "Claude", bg: "#1A1A1A", imgStyle: { filter: "brightness(0) invert(1)", objectFit: "contain" as const } },
  ];

  return (
    <section
      style={{
        background: "#0F0F0F",
        borderTop: "1px solid #1E1E1E",
        borderBottom: "1px solid #1E1E1E",
        padding: "18px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: MUTED2,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginRight: 4,
          }}
        >
          Powered by
        </span>
        {logos.map((logo) => (
          <div
            key={logo.alt}
            style={{
              background: "#1A1A1A",
              border: "1px solid #272727",
              borderRadius: 8,
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              background: logo.bg,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <Image
                src={logo.src}
                alt={logo.alt}
                width={22}
                height={22}
                style={{ ...logo.imgStyle, width: 22, height: 22 }}
              />
            </div>
            <span style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>{logo.alt}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── How It Works ───────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11m5-7h-2a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h2v-4Z" />
        </svg>
      ),
      num: "01",
      title: "Connect Wallet",
      desc: "Link your wallet in one click via Privy. No private key, no permissions required.",
    },
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      ),
      num: "02",
      title: "Analyze Score",
      desc: "We pull your Ethos profile, reviews, vouches, credibility, and break it down factor by factor.",
    },
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      ),
      num: "03",
      title: "Get Your Action Plan",
      desc: "Your AI coach gives you one concrete action today and tracks your progress over time.",
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        background: BG,
        padding: "80px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <DotGrid />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#6B9FFF", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
            Simple by design
          </p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#fff", letterSpacing: "-1.5px" }}>
            Three steps to a{" "}
            <em style={{ fontStyle: "italic", fontFamily: "Georgia, serif", color: "#6B9FFF" }}>
              stronger score
            </em>
          </h2>
        </div>

        <div
          className="how-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                background: SURFACE,
                border: `1px solid ${BORDER}`,
                borderRadius: 16,
                padding: "28px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  right: 24,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "rgba(77,142,255,0.3)",
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                }}
              >
                {step.num}
              </div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "rgba(77,142,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6B9FFF",
                  marginBottom: 20,
                }}
              >
                {step.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 10 }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.65 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Mini dashboard mockup ──────────────────────────────────────── */
function MiniDashboard({ type }: { type: "score" | "coach" | "vouch" | "brief" }) {
  if (type === "score") {
    return (
      <div style={{ background: "#0D0D0D", borderRadius: 10, padding: "14px", height: 130 }}>
        <div style={{ fontSize: 10, color: MUTED2, marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Score Breakdown</div>
        {[
          { label: "Vouches", pct: 72, color: "#6B9FFF" },
          { label: "Reviews", pct: 88, color: GREEN },
          { label: "Activity", pct: 45, color: AMBER },
        ].map((item) => (
          <div key={item.label} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 10, color: MUTED2 }}>{item.label}</span>
              <span style={{ fontSize: 10, color: item.color, fontWeight: 600 }}>{item.pct}%</span>
            </div>
            <div style={{ height: 4, borderRadius: 4, background: "#1A1A1A" }}>
              <div style={{ height: "100%", width: `${item.pct}%`, borderRadius: 4, background: item.color }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (type === "coach") {
    return (
      <div style={{ background: "#0D0D0D", borderRadius: 10, padding: "14px", height: 130 }}>
        <div style={{ fontSize: 10, color: MUTED2, marginBottom: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Today&apos;s Action</div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(77,142,255,0.15)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#6B9FFF" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
          </div>
          <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.55 }}>Ask 2 trusted collaborators for a positive review on Ethos today.</p>
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
          <div style={{ height: 4, borderRadius: 4, flex: 1, background: "#6B9FFF" }} />
          <div style={{ height: 4, borderRadius: 4, flex: 1, background: "#1A1A1A" }} />
          <div style={{ height: 4, borderRadius: 4, flex: 1, background: "#1A1A1A" }} />
          <div style={{ height: 4, borderRadius: 4, flex: 1, background: "#1A1A1A" }} />
          <div style={{ height: 4, borderRadius: 4, flex: 1, background: "#1A1A1A" }} />
          <div style={{ height: 4, borderRadius: 4, flex: 1, background: "#1A1A1A" }} />
          <div style={{ height: 4, borderRadius: 4, flex: 1, background: "#1A1A1A" }} />
        </div>
        <div style={{ fontSize: 10, color: MUTED2, marginTop: 4 }}>Day 1 of 7</div>
      </div>
    );
  }
  if (type === "vouch") {
    return (
      <div style={{ background: "#0D0D0D", borderRadius: 10, padding: "14px", height: 130 }}>
        <div style={{ fontSize: 10, color: MUTED2, marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Vouch Network</div>
        {[
          { name: "0xd4e1&hellip;2a9f", score: 1980, mutual: true },
          { name: "vitalik.eth", score: 2100, mutual: false },
          { name: "0xa7c3&hellip;f102", score: 1560, mutual: true },
        ].map((v) => (
          <div key={v.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: "monospace" }} dangerouslySetInnerHTML={{ __html: v.name }} />
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#6B9FFF", fontWeight: 600 }}>{v.score}</span>
              {v.mutual && <span style={{ fontSize: 9, color: GREEN, fontWeight: 700, background: "rgba(0,255,148,0.1)", padding: "2px 5px", borderRadius: 4 }}>3,3</span>}
            </div>
          </div>
        ))}
      </div>
    );
  }
  // brief
  return (
    <div style={{ background: "#0D0D0D", borderRadius: 10, padding: "14px", height: 130 }}>
      <div style={{ fontSize: 10, color: MUTED2, marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Weekly Brief: Mon</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Your score rose +42 this week</div>
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { label: "+3 Reviews", color: GREEN },
          { label: "+2 Vouches", color: "#6B9FFF" },
          { label: "1 New 3,3", color: AMBER },
        ].map((tag) => (
          <span key={tag.label} style={{ fontSize: 10, fontWeight: 600, color: tag.color, background: "rgba(255,255,255,0.05)", padding: "3px 8px", borderRadius: 4 }}>
            {tag.label}
          </span>
        ))}
      </div>
      <div style={{ fontSize: 11, color: MUTED, marginTop: 10, lineHeight: 1.5 }}>
        Next milestone: <strong style={{ color: "#fff" }}>Exemplary</strong> at 2,000 (+153 pts)
      </div>
    </div>
  );
}

/* ── Features ────────────────────────────────────────────────────── */
function Features() {
  const items = [
    {
      type: "score" as const,
      title: "Score Analysis",
      desc: "See every factor pulling your score down, ranked by impact.",
    },
    {
      type: "coach" as const,
      title: "AI Coach",
      desc: "One action, every day, to move your number forward.",
    },
    {
      type: "vouch" as const,
      title: "Vouch Network",
      desc: "See who&apos;s vouching for you and who you should vouch for.",
    },
    {
      type: "brief" as const,
      title: "Weekly Brief",
      desc: "Your reputation report, delivered every Monday morning.",
    },
  ];

  return (
    <section
      id="features"
      style={{
        background: SURFACE,
        padding: "80px 20px",
        borderTop: `1px solid ${BORDER}`,
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#6B9FFF", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
            What you get
          </p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#fff", letterSpacing: "-1.5px" }}>
            Built for{" "}
            <em style={{ fontStyle: "italic", fontFamily: "Georgia, serif", color: "#6B9FFF" }}>serious builders</em>
          </h2>
        </div>

        <div
          className="features-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
          }}
        >
          {items.map((item) => (
            <div
              key={item.type}
              className="animate-scale-in"
              style={{
                background: BG,
                border: `1px solid ${BORDER}`,
                borderRadius: 16,
                padding: "24px",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(77,142,255,0.4)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = BORDER)}
            >
              <MiniDashboard type={item.type} />
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginTop: 20, marginBottom: 8 }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: item.desc }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Stats ───────────────────────────────────────────────────────── */
function Stats() {
  const stats = [
    { value: "Live on Ethos Network", label: "Real scores, real data, no simulations" },
    { value: "5 Score Factors Tracked", label: "Reviews, vouches, XP, influence, mutual (3,3)" },
    { value: "Free to Start", label: "No wallet required for your first score check" },
  ];

  return (
    <section
      style={{
        background: BG,
        padding: "60px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Center glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(77,142,255,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        className="stats-grid"
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 900,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 40,
          textAlign: "center",
        }}
      >
        {stats.map((s) => (
          <div key={s.label}>
            <div
              className="score-shimmer"
              style={{
                fontSize: "clamp(20px, 2.5vw, 28px)",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                fontStyle: "italic",
                fontFamily: "Georgia, serif",
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 14, color: MUTED, marginTop: 8 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Free Trial Section ──────────────────────────────────────────── */
function FreeTrial() {
  const [code, setCode] = useState("");

  return (
    <section
      style={{
        background: SURFACE,
        padding: "80px 20px",
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            border: "1px solid rgba(77,142,255,0.3)",
            background: "#0F0F0F",
            borderRadius: 16,
            padding: "48px 40px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-1px",
              marginBottom: 12,
            }}
          >
            Start Your Free Trial
          </h2>
          <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.65, maxWidth: 520, margin: "0 auto 32px" }}>
            Get full access to all Core Coaching features for 7 days. No payment required. Connect your wallet in the app and enter your code there to activate.
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <input
              type="text"
              placeholder="Have a trial code?"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{
                background: "#111",
                border: "1px solid #272727",
                borderRadius: 8,
                padding: "13px 16px",
                color: "#fff",
                fontSize: 14,
                width: "100%",
                maxWidth: 280,
                outline: "none",
              }}
            />
            <button
              onClick={() => { window.location.href = "/app"; }}
              style={{
                background: BLUE,
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                padding: "13px 24px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#6BA3FF")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = BLUE)}
            >
              Go to App to Activate
            </button>
          </div>

          <p style={{ fontSize: 13, color: MUTED, marginBottom: 8 }}>
            Don&apos;t have a code? Share EthosIQ on X and DM{" "}
            <a href="https://x.com/danbuildss" target="_blank" style={{ color: BLUE, textDecoration: "none" }}>
              @danbuildss
            </a>{" "}
            for a code.
          </p>
          <p style={{ fontSize: 12, color: MUTED2 }}>One trial per wallet address.</p>
        </div>
      </div>
    </section>
  );
}

/* ── Share & Earn Box ────────────────────────────────────────────── */
function ShareEarn() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("https://ethosiq.vercel.app?ref=wallet").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div
      style={{
        background: "rgba(77,142,255,0.06)",
        border: "1px solid rgba(77,142,255,0.2)",
        borderRadius: 10,
        padding: 16,
        marginTop: 12,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
        Share your score, help a friend
      </div>
      <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 12 }}>
        Share EthosIQ with your network. When 3 people sign up via your link, you get 30 days of Core Coaching free.
      </p>
      <button
        onClick={handleCopy}
        style={{
          background: BLUE,
          color: "#fff",
          fontWeight: 600,
          fontSize: 13,
          padding: "10px 18px",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          width: "100%",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#6BA3FF")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = BLUE)}
      >
        {copied ? "Link Copied!" : "Copy My Share Link"}
      </button>
      <p style={{ fontSize: 11, color: MUTED2, marginTop: 8, textAlign: "center" }}>
        Referral tracking coming soon
      </p>
    </div>
  );
}

/* ── Pricing ─────────────────────────────────────────────────────── */
function Pricing() {
  return (
    <section
      id="pricing"
      style={{
        background: BG,
        padding: "80px 20px",
        borderTop: `1px solid ${BORDER}`,
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#6B9FFF", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
            Pricing
          </p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#fff", letterSpacing: "-1.5px" }}>
            Pay with{" "}
            <em style={{ fontStyle: "italic", fontFamily: "Georgia, serif", color: "#6B9FFF" }}>
              crypto
            </em>
            . No credit card.
          </h2>
          <p style={{ fontSize: 15, color: MUTED, marginTop: 12 }}>USDC, ETH, or BNKR on Base.</p>
        </div>

        {/* Main plans */}
        <div
          className="pricing-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
            marginBottom: 32,
          }}
        >
          {/* Free */}
          <div
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: 16,
              padding: "32px 28px",
              maxWidth: 400,
              width: "100%",
              margin: "0 auto",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: MUTED2, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
              Free
            </div>
            <div style={{ fontSize: 40, fontWeight: 800, color: "#fff", letterSpacing: "-2px", marginBottom: 4 }}>
              $0
            </div>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 28 }}>Forever free</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {[
                "Ethos score analysis",
                "AI Coach: top action daily",
                "Vouch network overview",
              ].map((feat) => (
                <div key={feat} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={GREEN} strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span style={{ fontSize: 14, color: MUTED }}>{feat}</span>
                </div>
              ))}
            </div>
            <Link
              href="/app"
              style={{
                display: "block",
                textAlign: "center",
                background: "transparent",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                padding: "13px",
                borderRadius: 8,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                transition: "all 0.15s",
              }}
            >
              Get Started Free
            </Link>
            <ShareEarn />
          </div>

          {/* Core Coaching */}
          <div
            style={{
              background: SURFACE,
              border: `1px solid rgba(77,142,255,0.45)`,
              borderRadius: 16,
              padding: "32px 28px",
              position: "relative",
              boxShadow: "0 0 40px rgba(77,142,255,0.1)",
              maxWidth: 400,
              width: "100%",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -1,
                left: 24,
                background: BLUE,
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: "0 0 8px 8px",
              }}
            >
              Most Popular
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#6B9FFF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
              Core Coaching
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: 40, fontWeight: 800, color: "#fff", letterSpacing: "-2px" }}>$10</span>
              <span style={{ fontSize: 14, color: MUTED }}>/month</span>
            </div>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 28 }}>Everything in Free, plus:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {[
                "Weekly Brief: every Monday",
                "Reputation Matchmaker",
                "Vouch ROI Analyzer",
                "Score Simulator",
              ].map((feat) => (
                <div key={feat} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={BLUE} strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span style={{ fontSize: 14, color: MUTED }}>{feat}</span>
                </div>
              ))}
            </div>
            <Link
              href="/app"
              style={{
                display: "block",
                textAlign: "center",
                background: BLUE,
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                padding: "13px",
                borderRadius: 8,
                textDecoration: "none",
                transition: "background 0.15s",
              }}
            >
              Upgrade to Core Coaching
            </Link>
          </div>
        </div>

        {/* Add-ons */}
        <div
          style={{
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: 16,
            padding: "28px",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: MUTED2, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>
            One-time add-ons
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {[
              {
                title: "New Wallet Accelerator",
                price: "$15",
                desc: "Fast-track your score from zero with a custom 30-day plan.",
              },
              {
                title: "Reputation Recovery",
                price: "$25",
                desc: "Audit negative signals and get a structured recovery roadmap.",
              },
            ].map((addon) => (
              <div
                key={addon.title}
                style={{
                  background: BG,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 12,
                  padding: "20px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{addon.title}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: AMBER }}>{addon.price}</div>
                </div>
                <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.55 }}>{addon.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ─────────────────────────────────────────────────────────── */
const FAQ_ITEMS = [
  {
    q: "What is Ethos?",
    a: "Ethos is a decentralized reputation protocol on Base. It assigns every wallet a credibility score based on peer reviews, vouches, and on-chain activity. EthosIQ reads that score and helps you understand and improve it.",
  },
  {
    q: "Does this work for any wallet?",
    a: "Yes. Any EVM wallet that has an Ethos profile. If your wallet does not have one yet, EthosIQ will show you how to create it. Wallet age and activity do affect your starting score.",
  },
  {
    q: "Is the free tier actually free?",
    a: "Yes. Score analysis, the vouch overview, and your top daily action are permanently free. No trial period, no credit card required.",
  },
  {
    q: "How does payment work?",
    a: "You pay directly with USDC, ETH, or BNKR on Base. No credit card, no centralized subscription. Payments go on-chain and unlock features immediately.",
  },
  {
    q: "What is the Score Simulator?",
    a: "The Score Simulator lets you model hypothetical changes. For example: what would my score be if I got 5 more vouches? What if I cleared that negative review? This lets you prioritize actions with the biggest impact.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      style={{
        background: SURFACE,
        padding: "80px 20px",
        position: "relative",
        overflow: "hidden",
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      <DotGrid />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#6B9FFF", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
            FAQ
          </p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#fff", letterSpacing: "-1.5px" }}>
            Common questions
          </h2>
        </div>

        <div>
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              style={{
                borderTop: `1px solid ${BORDER}`,
                ...(i === FAQ_ITEMS.length - 1 ? { borderBottom: `1px solid ${BORDER}` } : {}),
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "22px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>{item.q}</span>
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  style={{
                    flexShrink: 0,
                    color: "#6B9FFF",
                    transition: "transform 0.2s",
                    transform: open === i ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {open === i && (
                <div style={{ paddingBottom: 22 }}>
                  <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7 }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA ───────────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section
      style={{
        background: `linear-gradient(135deg, #001433 0%, #001F5C 40%, #003399 70%, #001433 100%)`,
        padding: "64px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(77,142,255,0.12) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(77,142,255,0.35) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-2px",
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          Your score is{" "}
          <em style={{ fontStyle: "italic", fontFamily: "Georgia, serif", color: "#99BBFF" }}>
            live right now
          </em>
          . Check it.
        </h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", marginBottom: 36 }}>
          Free forever. No credit card. Connect in 10 seconds.
        </p>
        <Link
          href="/app"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            color: BLUE,
            fontWeight: 700,
            fontSize: 16,
            padding: "16px 36px",
            borderRadius: 10,
            textDecoration: "none",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.9")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
        >
          Check Your Score, Free
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer
      style={{
        background: SURFACE,
        borderTop: `1px solid ${BORDER}`,
        padding: "24px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", fontWeight: 700, fontSize: 15 }}>
          <LogoMark size={16} />
          <span>Ethos<span style={{ color: BLUE }}>IQ</span></span>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 13, color: MUTED2 }}>
            &copy; {new Date().getFullYear()} EthosIQ. Not affiliated with Ethos Network.
          </p>
          <p style={{ fontSize: 13, color: MUTED2, marginTop: 4 }}>
            Built by{" "}
            <a
              href="https://x.com/danbuildss"
              target="_blank"
              style={{ color: "#4D8EFF", textDecoration: "none" }}
            >
              @danbuildss
            </a>
          </p>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Discord"].map((link) => (
            <a key={link} href="#" style={{ fontSize: 13, color: MUTED2, textDecoration: "none" }}>
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div style={{ background: BG, minHeight: "100vh" }}>
      <GlobalStyles />
      <Navbar />
      <Hero />
      <Partners />
      <HowItWorks />
      <Features />
      <Stats />
      <FreeTrial />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
