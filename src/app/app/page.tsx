"use client";

export const dynamic = "force-dynamic";

import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ─── Types ───────────────────────────────────────────────────────── */
interface EthosProfile {
  profileId: number;
  displayName: string;
  username: string;
  avatarUrl: string;
  description: string;
  score: number;
  status: string;
  xpTotal: number;
  influenceFactor: number;
  influenceFactorPercentile: number;
  stats: {
    review: {
      received: {
        negative: number;
        neutral: number;
        positive: number;
      };
    };
    vouch: {
      given: {
        amountWeiTotal: string;
        count: number;
      };
      received: {
        amountWeiTotal: string;
        count: number;
      };
    };
  };
  links: {
    scoreBreakdown: string;
  };
}

interface VouchData {
  given: { data: Array<Record<string, unknown>>; total: number };
  received: { data: Array<Record<string, unknown>>; total: number };
  mostCredible: { data: Array<Record<string, unknown>> };
  mutual: { data: Array<Record<string, unknown>> };
}

/* ─── Design tokens ─────────────────────────────────────────────── */
const BG = "#0A0A0A";
const SURFACE = "#111111";
const SURFACE2 = "#161616";
const BORDER = "#1A1A1A";
const BLUE = "#0052FF";
const GREEN = "#00FF94";
const AMBER = "#F59E0B";
const RED = "#F87171";
const MUTED = "rgba(255,255,255,0.45)";
const MUTED2 = "rgba(255,255,255,0.25)";
const MUTED3 = "rgba(255,255,255,0.12)";

/* ─── Helpers ───────────────────────────────────────────────────── */
function getScoreTier(score: number) {
  if (score >= 2000) return { label: "Exemplary",    color: AMBER };
  if (score >= 1600) return { label: "Reputable",    color: "#6B9FFF" };
  if (score >= 1200) return { label: "Known",        color: "rgba(255,255,255,0.55)" };
  if (score >= 800)  return { label: "Questionable", color: AMBER };
  return               { label: "Untrusted",         color: RED };
}

function weiToEth(wei: string) {
  const val = parseInt(wei || "0") / 1e18;
  return val === 0 ? "0" : val.toFixed(4);
}

function getTopAction(profile: EthosProfile, vouches: VouchData | null): string {
  const score = profile.score;
  const reviews = profile.stats.review.received;
  const vouchStats = profile.stats.vouch;
  const totalReviews = reviews.positive + reviews.neutral + reviews.negative;

  if (score < 800) {
    if (reviews.negative > reviews.positive)
      return "Your negative reviews outweigh positives. Reach out to trusted connections and request honest positive reviews to rebuild credibility.";
    return "Your score is critically low. Focus on getting vouches from credible wallets — even small amounts build trust quickly.";
  }
  if (totalReviews < 3)
    return "You have very few reviews. Ask 3 trusted collaborators to leave you a positive review on Ethos this week.";
  if (vouchStats.received.count < 3)
    return "Low vouch count is holding your score back. Identify 3 credible wallets in your network and ask them to vouch for you.";
  if (vouchStats.given.count === 0)
    return "You haven't vouched for anyone yet. Vouch for 2–3 trusted builders to start building mutual credibility (3,3).";
  if (vouches && vouches.mutual?.data?.length === 0 && vouchStats.given.count > 0)
    return "None of your vouches are mutual yet. Reach out to wallets you've vouched for and ask them to vouch back — mutual vouches boost both scores.";
  if (score < 1600)
    return "You're in the Known tier. One more positive review from a high-credibility wallet could push you into 'Reputable'.";
  if (score < 2000)
    return "Strong profile. To reach Exemplary, increase your vouch diversity — vouch for credible wallets across different communities.";
  return "Excellent reputation. Maintain it by staying active — review builders, keep your vouches healthy, and respond to any reviews.";
}

function identicon(address: string): string {
  const palettes = [
    ["#0052FF", "#7B61FF"],
    ["#00A86B", "#00FF94"],
    ["#FF6B35", "#FF9500"],
    ["#9B59B6", "#6B9FFF"],
    ["#E74C3C", "#FF6B6B"],
    ["#1ABC9C", "#00FF94"],
  ];
  const idx = parseInt(address.slice(2, 4), 16) % palettes.length;
  return `linear-gradient(135deg, ${palettes[idx][0]}, ${palettes[idx][1]})`;
}

/* ─── Logo mark ─────────────────────────────────────────────────── */
function LogoMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.78)} viewBox="0 0 20 15" fill="none">
      <rect width="20" height="2.5" rx="1.25" fill="currentColor" />
      <rect y="6.25" width="20" height="2.5" rx="1.25" fill="currentColor" />
      <rect y="12.5" width="20" height="2.5" rx="1.25" fill="currentColor" />
    </svg>
  );
}

/* ─── App Navbar ────────────────────────────────────────────────── */
function AppNavbar({
  authenticated,
  walletAddress,
  score,
  login,
  logout,
}: {
  authenticated: boolean;
  walletAddress?: string;
  score?: number;
  login: () => void;
  logout: () => void;
}) {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          <LogoMark size={16} />
          Ethos&nbsp;<span style={{ color: BLUE }}>IQ</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
          {authenticated && walletAddress && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: SURFACE,
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                padding: "6px 12px",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: MUTED2,
                  fontFamily: "monospace",
                }}
              >
                {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
              </span>
              {score !== undefined && (
                <>
                  <div style={{ width: 1, height: 14, background: BORDER }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{score}</span>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: score >= 1600 ? "#6B9FFF" : score >= 1200 ? MUTED2 : RED,
                    }}
                  />
                </>
              )}
            </div>
          )}

          {authenticated ? (
            <button
              onClick={logout}
              style={{
                background: "transparent",
                color: "#fff",
                fontWeight: 500,
                fontSize: 13,
                padding: "8px 14px",
                borderRadius: 8,
                cursor: "pointer",
                border: `1px solid ${MUTED3}`,
                transition: "all 0.15s",
              }}
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={login}
              style={{
                background: BLUE,
                color: "#fff",
                fontWeight: 600,
                fontSize: 13,
                padding: "8px 16px",
                borderRadius: 8,
                cursor: "pointer",
                border: "none",
                transition: "background 0.15s",
              }}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ─── Stat card ─────────────────────────────────────────────────── */
function StatCard({
  label,
  value,
  sub,
  subColor,
}: {
  label: string;
  value: string | number;
  sub: string;
  subColor?: string;
}) {
  return (
    <div
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: "20px",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 600, color: MUTED2, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-1px", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: subColor || MUTED, marginTop: 6 }}>{sub}</div>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────────── */
export default function AppPage() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [profile, setProfile] = useState<EthosProfile | null>(null);
  const [vouches, setVouches] = useState<VouchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<"free" | "core" | "trial">("free");

  const walletAddress = user?.wallet?.address;

  const fetchEthosData = useCallback(async (address: string) => {
    setLoading(true);
    setError(null);
    try {
      const scoreRes = await fetch("/api/ethos/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      if (!scoreRes.ok) {
        const err = await scoreRes.json();
        throw new Error(err.error || "Failed to fetch score");
      }
      const profileData = await scoreRes.json();
      setProfile(profileData);
      if (profileData.profileId) {
        const vouchRes = await fetch("/api/ethos/vouches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileId: profileData.profileId }),
        });
        if (vouchRes.ok) setVouches(await vouchRes.json());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (walletAddress) fetchEthosData(walletAddress);
  }, [walletAddress, fetchEthosData]);

  // Upsert user in Supabase on login
  useEffect(() => {
    if (!authenticated || !user) return;

    const walletAddr = user.wallet?.address;
    const email = user.email?.address;
    const twitterHandle = user.twitter?.username;
    const twitterId = user.twitter?.subject;

    fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        privyUserId: user.id,
        walletAddress: walletAddr,
        email,
        twitterHandle,
        twitterId,
      }),
    }).catch(() => {}); // silent fail — non-blocking
  }, [authenticated, user]);

  useEffect(() => {
    if (!authenticated || !user) return;
    fetch(`/api/user?privyUserId=${user.id}`)
      .then(r => r.json())
      .then(d => { if (d.plan) setUserPlan(d.plan as "free" | "core" | "trial"); })
      .catch(() => {});
  }, [authenticated, user]);

  /* ── Not ready ── */
  if (!ready) {
    return (
      <div style={{ background: BG, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: `2px solid ${BLUE}`,
            borderTopColor: "transparent",
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>
    );
  }

  /* ── Derived values (hoisted for nav) ── */
  const tier = profile ? getScoreTier(profile.score) : null;
  const gradient = walletAddress ? identicon(walletAddress) : "linear-gradient(135deg, #0052FF, #7B61FF)";
  const name = profile
    ? profile.displayName || profile.username || (walletAddress ? walletAddress.slice(0, 8) + "…" : "Unknown")
    : undefined;
  const totalReviews = profile
    ? profile.stats.review.received.positive + profile.stats.review.received.neutral + profile.stats.review.received.negative
    : 0;
  const positiveRate = totalReviews > 0 && profile
    ? Math.round((profile.stats.review.received.positive / totalReviews) * 100)
    : 0;

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>

      <AppNavbar
        authenticated={authenticated}
        walletAddress={walletAddress}
        score={profile?.score}
        login={login}
        logout={logout}
      />

      <main
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "40px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >

        {/* ── NOT CONNECTED ── */}
        {!authenticated && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              textAlign: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: "rgba(0,82,255,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6B9FFF",
              }}
            >
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11m5-7h-2a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h2v-4Z" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-1.5px", marginBottom: 10 }}>
                Check your Ethos score
              </h1>
              <p style={{ fontSize: 15, color: MUTED, maxWidth: 380, lineHeight: 1.65 }}>
                Connect your wallet to analyze your on-chain reputation and get your personalized action plan.
              </p>
            </div>
            <button
              onClick={login}
              style={{
                background: BLUE,
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                padding: "14px 32px",
                borderRadius: 10,
                cursor: "pointer",
                border: "none",
                marginTop: 8,
              }}
            >
              Connect Wallet
            </button>
            <p style={{ fontSize: 12, color: MUTED2 }}>Free forever. No credit card.</p>
          </div>
        )}

        {/* ── LOADING ── */}
        {authenticated && loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `2px solid ${BLUE}`,
                borderTopColor: "transparent",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <p style={{ fontSize: 14, color: MUTED }}>Analyzing your Ethos profile…</p>
          </div>
        )}

        {/* ── ERROR ── */}
        {authenticated && !loading && error && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              textAlign: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "rgba(248,113,113,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: RED,
              }}
            >
              <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8 }}>No Ethos Profile Found</h2>
              <p style={{ fontSize: 14, color: MUTED, marginBottom: 4 }}>{error}</p>
              <p style={{ fontSize: 13, color: MUTED2 }}>Make sure this wallet has an Ethos profile, or try a different wallet.</p>
            </div>
            <button
              onClick={() => walletAddress && fetchEthosData(walletAddress)}
              style={{
                background: "transparent",
                color: "#fff",
                fontWeight: 600,
                fontSize: 13,
                padding: "10px 20px",
                borderRadius: 8,
                cursor: "pointer",
                border: `1px solid ${MUTED3}`,
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {authenticated && !loading && !error && profile && tier && name && (
          <>
            {/* ── Section A: Score Hero ── */}
            <div
              style={{
                background: SURFACE,
                border: `1px solid ${profile.score >= 1600 ? "rgba(0,82,255,0.4)" : BORDER}`,
                borderRadius: 16,
                padding: "28px",
                boxShadow: profile.score >= 1600 ? "0 0 40px rgba(0,82,255,0.1)" : "none",
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: 28,
                alignItems: "center",
              }}
            >
              {/* Left: Identity */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, minWidth: 100 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 24,
                    color: "#fff",
                    border: "2px solid rgba(255,255,255,0.08)",
                    flexShrink: 0,
                  }}
                >
                  {name[0].toUpperCase()}
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{name}</div>
                  {profile.username && profile.username !== name && (
                    <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>@{profile.username}</div>
                  )}
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: tier.color,
                      background: `${tier.color}18`,
                      border: `1px solid ${tier.color}30`,
                      padding: "3px 10px",
                      borderRadius: 20,
                    }}
                  >
                    {tier.label}
                  </span>
                </div>
              </div>

              {/* Center: Score */}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: MUTED2, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>
                  Ethos Score
                </div>
                <div
                  style={{
                    fontSize: 72,
                    fontWeight: 800,
                    color: "#fff",
                    lineHeight: 1,
                    letterSpacing: "-4px",
                  }}
                >
                  {profile.score}
                </div>
                {/* Progress bar */}
                <div style={{ marginTop: 16, padding: "0 16px" }}>
                  <div style={{ height: 6, borderRadius: 6, background: SURFACE2, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min((profile.score / 2800) * 100, 100)}%`,
                        borderRadius: 6,
                        background: `linear-gradient(90deg, ${BLUE}, #6B9FFF)`,
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                    <span style={{ fontSize: 10, color: MUTED2 }}>0</span>
                    <span style={{ fontSize: 10, color: MUTED2 }}>2,800</span>
                  </div>
                </div>
                {profile.links?.scoreBreakdown && (
                  <a
                    href={profile.links.scoreBreakdown}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 12, color: "#6B9FFF", textDecoration: "none", display: "inline-block", marginTop: 8 }}
                  >
                    View score breakdown ↗
                  </a>
                )}
              </div>

              {/* Right: Top Action */}
              <div
                style={{
                  background: SURFACE2,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 12,
                  padding: "18px",
                  maxWidth: 220,
                  minWidth: 180,
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 600, color: MUTED2, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
                  Top Action Today
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "rgba(0,82,255,0.15)",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#6B9FFF" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                    </svg>
                  </div>
                  <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.55 }}>
                    {getTopAction(profile, vouches)}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Section B: 4 Stats ── */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <StatCard
                label="Reviews"
                value={totalReviews}
                sub={`${positiveRate}% positive`}
                subColor={positiveRate >= 80 ? GREEN : MUTED}
              />
              <StatCard
                label="Vouches Received"
                value={profile.stats.vouch.received.count}
                sub={`${weiToEth(profile.stats.vouch.received.amountWeiTotal)} ETH`}
                subColor="#6B9FFF"
              />
              <StatCard
                label="Vouches Given"
                value={profile.stats.vouch.given.count}
                sub={`${weiToEth(profile.stats.vouch.given.amountWeiTotal)} ETH`}
                subColor="#6B9FFF"
              />
              <StatCard
                label="Mutual (3,3)"
                value={vouches?.mutual?.data?.length ?? "—"}
                sub="reciprocal"
                subColor={MUTED2}
              />
            </div>

            {/* ── Section C: Vouch Network ── */}
            {profile.stats.vouch.received.count > 0 && vouches ? (
              <div
                style={{
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 16,
                  padding: "24px",
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 20 }}>
                  Your Vouch Network
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 20,
                  }}
                >
                  {/* Most credible */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: MUTED2, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                      Most Credible Vouchers
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {(vouches.mostCredible?.data?.slice(0, 3) ?? []).length > 0
                        ? (vouches.mostCredible.data.slice(0, 3) as Array<Record<string, unknown>>).map((v, i) => {
                            const voucherName = (v.authorDisplayName as string) || (v.authorUsername as string) || `${String(v.authorAddress || "0x????").slice(0, 8)}…`;
                            const voucherScore = v.score as number;
                            return (
                              <div
                                key={i}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "10px 12px",
                                  background: SURFACE2,
                                  borderRadius: 8,
                                  border: `1px solid ${BORDER}`,
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <div
                                    style={{
                                      width: 28,
                                      height: 28,
                                      borderRadius: "50%",
                                      background: `linear-gradient(135deg, #0052FF, #7B61FF)`,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: 11,
                                      fontWeight: 700,
                                      color: "#fff",
                                    }}
                                  >
                                    {voucherName[0]?.toUpperCase() || "?"}
                                  </div>
                                  <span style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>{voucherName}</span>
                                </div>
                                {voucherScore && (
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#6B9FFF" }}>{voucherScore}</span>
                                )}
                              </div>
                            );
                          })
                        : <p style={{ fontSize: 13, color: MUTED }}>No data available.</p>
                      }
                    </div>
                  </div>

                  {/* Recent vouches received */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: MUTED2, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                      Recent Vouches Received
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {(vouches.received?.data?.slice(0, 3) ?? []).length > 0
                        ? (vouches.received.data.slice(0, 3) as Array<Record<string, unknown>>).map((v, i) => {
                            const voucherName = (v.authorDisplayName as string) || (v.authorUsername as string) || `${String(v.authorAddress || "0x????").slice(0, 8)}…`;
                            const amount = weiToEth(String(v.stakeAmount || "0"));
                            return (
                              <div
                                key={i}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "10px 12px",
                                  background: SURFACE2,
                                  borderRadius: 8,
                                  border: `1px solid ${BORDER}`,
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <div
                                    style={{
                                      width: 28,
                                      height: 28,
                                      borderRadius: "50%",
                                      background: "linear-gradient(135deg, #00A86B, #00FF94)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: 11,
                                      fontWeight: 700,
                                      color: "#fff",
                                    }}
                                  >
                                    {voucherName[0]?.toUpperCase() || "?"}
                                  </div>
                                  <span style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>{voucherName}</span>
                                </div>
                                {amount !== "0" && (
                                  <span style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>{amount} ETH</span>
                                )}
                              </div>
                            );
                          })
                        : <p style={{ fontSize: 13, color: MUTED }}>No recent vouches.</p>
                      }
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 16,
                  padding: "28px 24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: "rgba(0,82,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6B9FFF",
                    margin: "0 auto 14px",
                  }}
                >
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 6 }}>No vouches yet</p>
                <p style={{ fontSize: 13, color: MUTED, maxWidth: 400, margin: "0 auto" }}>
                  Getting vouched by credible wallets is the fastest way to grow your score.
                </p>
              </div>
            )}

            {/* ── Section D: Upgrade Gate ── */}
            <div
              style={{
                background: SURFACE,
                border: `1px solid rgba(0,82,255,0.4)`,
                borderRadius: 16,
                padding: "28px 24px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 0 40px rgba(0,82,255,0.08)",
              }}
            >
              {/* Glow */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  bottom: -60,
                  right: -60,
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(0,82,255,0.15) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#6B9FFF", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
                  Upgrade
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: 16 }}>
                  Unlock Weekly Coaching
                </h3>

                {/* Feature pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                  {["Weekly Brief", "Matchmaker", "Vouch ROI", "Score Simulator"].map((feat) => (
                    <span
                      key={feat}
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#6B9FFF",
                        background: "rgba(0,82,255,0.12)",
                        border: "1px solid rgba(0,82,255,0.25)",
                        padding: "6px 12px",
                        borderRadius: 20,
                      }}
                    >
                      {feat}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-1.5px", lineHeight: 1 }}>
                      $10<span style={{ fontSize: 14, fontWeight: 500, color: MUTED }}>/month</span>
                    </div>
                    <div style={{ fontSize: 12, color: MUTED2, marginTop: 4 }}>
                      Pay with USDC, ETH, or BNKR on Base
                    </div>
                  </div>
                  <button
                    style={{
                      background: BLUE,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 14,
                      padding: "12px 24px",
                      borderRadius: 10,
                      cursor: "pointer",
                      border: "none",
                      transition: "background 0.15s",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1A65FF")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = BLUE)}
                  >
                    Upgrade to Core Coaching
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
