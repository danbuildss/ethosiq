"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

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

function EthosLines({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.75)} viewBox="0 0 20 15" fill="none">
      <rect width="20" height="2.5" rx="1.25" fill="currentColor" />
      <rect y="6.25" width="20" height="2.5" rx="1.25" fill="currentColor" />
      <rect y="12.5" width="20" height="2.5" rx="1.25" fill="currentColor" />
    </svg>
  );
}

function getScoreTier(score: number) {
  if (score >= 2000) return { label: "Exemplary",    color: "#fbbf24" };
  if (score >= 1600) return { label: "Reputable",    color: "#4B9EFF" };
  if (score >= 1200) return { label: "Known",        color: "rgba(255,255,255,0.55)" };
  if (score >= 800)  return { label: "Questionable", color: "#fbbf24" };
  return               { label: "Untrusted",         color: "#f87171" };
}

function weiToEth(wei: string) {
  const val = (parseInt(wei || "0") / 1e18);
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

function identicon(address: string) {
  const colors = ["from-indigo-600 to-purple-700","from-emerald-600 to-teal-700","from-sky-600 to-blue-700","from-violet-700 to-purple-800","from-amber-600 to-yellow-600","from-red-700 to-orange-600"];
  const idx = parseInt(address.slice(2,4), 16) % colors.length;
  return colors[idx];
}

export default function AppPage() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [profile, setProfile] = useState<EthosProfile | null>(null);
  const [vouches, setVouches] = useState<VouchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="h-7 w-7 rounded-full border-2 animate-spin" style={{ borderColor: "var(--blue)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* App Navbar */}
      <nav
        className="sticky top-0 z-50"
        style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 h-14">
          <Link href="/" className="flex items-center gap-2 text-white shrink-0">
            <EthosLines size={18} />
            <span className="text-[16px] font-bold">
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

          <div className="flex items-center gap-3 ml-auto">
            {authenticated && walletAddress && (
              <span
                className="hidden sm:block rounded-lg px-3 py-1.5 text-[12px] font-mono"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "rgba(255,255,255,0.5)" }}
              >
                {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
              </span>
            )}
            {profile && (
              <div
                className="hidden md:flex items-center gap-1.5 rounded-lg px-3 py-1.5"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <svg width="14" height="11" viewBox="0 0 18 14" fill="none" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <rect width="18" height="2.25" rx="1.125" fill="currentColor" />
                  <rect y="5.75" width="18" height="2.25" rx="1.125" fill="currentColor" />
                  <rect y="11.5" width="18" height="2.25" rx="1.125" fill="currentColor" />
                </svg>
                <span className="text-[13px] font-bold text-white">{profile.score}</span>
              </div>
            )}
            {authenticated ? (
              <button
                onClick={logout}
                className="btn-outline px-3.5 py-2 text-[13px]"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={login}
                className="btn-blue px-4 py-2 text-[13px]"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-5 py-8">

        {/* ── NOT CONNECTED ── */}
        {!authenticated && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div
              className="mb-6 inline-flex items-center justify-center rounded-2xl p-5"
              style={{ background: "var(--blue-dim)" }}
            >
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "var(--blue)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11m5-7h-2a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h2v-4Z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              Connect Your <span style={{ color: "var(--blue)" }}>Wallet</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              Connect your wallet to analyze your Ethos reputation score and get your personalized coaching plan.
            </p>
            <button onClick={login} className="btn-blue mt-8 px-10 py-4 text-[15px]">
              Connect Wallet
            </button>
          </div>
        )}

        {/* ── LOADING ── */}
        {authenticated && loading && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-6 h-11 w-11 rounded-full border-2 animate-spin" style={{ borderColor: "var(--blue)", borderTopColor: "transparent" }} />
            <p className="text-[15px]" style={{ color: "rgba(255,255,255,0.45)" }}>Analyzing your Ethos profile…</p>
          </div>
        )}

        {/* ── ERROR ── */}
        {authenticated && !loading && error && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div
              className="mb-6 inline-flex items-center justify-center rounded-2xl p-5"
              style={{ background: "var(--red-dim, rgba(248,113,113,0.12))" }}
            >
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "var(--red)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">No Ethos Profile Found</h2>
            <p className="mx-auto mt-3 max-w-md text-[14px]" style={{ color: "rgba(255,255,255,0.45)" }}>{error}</p>
            <p className="mt-2 text-[13px]" style={{ color: "var(--text-3)" }}>Make sure this wallet has an Ethos profile, or try a different wallet.</p>
            <button
              onClick={() => walletAddress && fetchEthosData(walletAddress)}
              className="btn-outline mt-6 px-6 py-2.5 text-[13px]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {authenticated && !loading && !error && profile && (() => {
          const tier = getScoreTier(profile.score);
          const gradient = walletAddress ? identicon(walletAddress) : "from-indigo-600 to-purple-700";
          const name = profile.displayName || profile.username || (walletAddress ? walletAddress.slice(0, 8) + "…" : "Unknown");
          const totalReviews = profile.stats.review.received.positive + profile.stats.review.received.neutral + profile.stats.review.received.negative;
          const positiveRate = totalReviews > 0 ? Math.round((profile.stats.review.received.positive / totalReviews) * 100) : 0;

          return (
            <div className="space-y-5">
              {/* Page header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-white">My profile</h1>
                  <p className="text-[13px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Connected via Ethos IQ
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {profile.links?.scoreBreakdown && (
                    <a
                      href={profile.links.scoreBreakdown}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline px-3.5 py-2 text-[13px]"
                    >
                      View on Ethos ↗
                    </a>
                  )}
                  <button
                    onClick={() => walletAddress && fetchEthosData(walletAddress)}
                    className="btn-outline px-3.5 py-2 text-[13px]"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {/* 3-column profile layout */}
              <div className="grid grid-cols-1 lg:grid-cols-[2fr,1.2fr,1fr] gap-4">

                {/* LEFT: Profile card */}
                <div
                  className="rounded-xl overflow-hidden relative"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  {/* Avatar + info top section */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="shrink-0">
                        <div
                          className={`bg-gradient-to-br ${gradient} h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-xl`}
                          style={{ border: "2px solid rgba(75,158,255,0.35)" }}
                        >
                          {name[0].toUpperCase()}
                        </div>
                      </div>

                      {/* Name + stats */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[17px] font-bold" style={{ color: "var(--blue)" }}>{name}</p>
                        <div className="mt-2 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "var(--green)" }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904" />
                            </svg>
                            <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                              {positiveRate}% positive ({totalReviews} reviews)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "var(--blue)" }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                              {profile.stats.vouch.received.count > 0
                                ? `${profile.stats.vouch.received.count} vouches received`
                                : "No vouches yet"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "var(--amber)" }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                            </svg>
                            <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                              {profile.xpTotal?.toLocaleString() ?? "—"} Contributor XP
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "rgba(255,255,255,0.3)" }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                            </svg>
                            <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                              {profile.influenceFactor?.toFixed(0) ?? "—"} influence factor
                              {profile.influenceFactorPercentile != null && (
                                <span style={{ color: "var(--text-3)" }}> (top {100 - profile.influenceFactorPercentile}%)</span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: "1px solid var(--border)" }} />

                  {/* Score display section */}
                  <div className="px-6 pt-5 pb-6 relative overflow-hidden">
                    {/* Background watermark */}
                    <div
                      className="absolute right-0 bottom-0 leading-none select-none pointer-events-none"
                      style={{
                        fontSize: "7.5rem",
                        fontWeight: 800,
                        color: "rgba(255,255,255,0.04)",
                        letterSpacing: "-4px",
                        lineHeight: 1,
                      }}
                    >
                      {profile.score}
                    </div>
                    {/* Ethos lines bg */}
                    <div className="absolute right-5 bottom-4 opacity-[0.06] pointer-events-none text-white">
                      <EthosLines size={28} />
                    </div>

                    <div className="relative z-10">
                      <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {tier.label}
                      </p>
                      <div className="flex items-center gap-3">
                        <span
                          className="text-5xl font-bold"
                          style={{ color: "rgba(255,255,255,0.55)", letterSpacing: "-2px" }}
                        >
                          {profile.score}
                        </span>
                        <EthosLines size={22} />
                      </div>
                      {profile.links?.scoreBreakdown && (
                        <a
                          href={profile.links.scoreBreakdown}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-[12px] transition-colors hover:underline"
                          style={{ color: "var(--blue)" }}
                        >
                          Score breakdown
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* CENTER: AI Analysis */}
                <div className="space-y-4">
                  {/* Top action */}
                  <div
                    className="rounded-xl p-5"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-3)" }}>
                      AI Coach · Top Action Today
                    </p>
                    <div className="flex items-start gap-3">
                      <div
                        className="shrink-0 rounded-lg p-2 mt-0.5"
                        style={{ background: "var(--blue-dim)" }}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "var(--blue)" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                        </svg>
                      </div>
                      <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                        {getTopAction(profile, vouches)}
                      </p>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className="rounded-xl p-4"
                      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-3)" }}>Reviews</p>
                      <p className="text-2xl font-bold text-white">{totalReviews}</p>
                      <p className="text-[12px] mt-0.5" style={{ color: "var(--green)" }}>
                        {profile.stats.review.received.positive} positive
                      </p>
                    </div>
                    <div
                      className="rounded-xl p-4"
                      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-3)" }}>Vouches In</p>
                      <p className="text-2xl font-bold text-white">{profile.stats.vouch.received.count}</p>
                      <p className="text-[12px] mt-0.5" style={{ color: "var(--blue)" }}>
                        {weiToEth(profile.stats.vouch.received.amountWeiTotal)} ETH
                      </p>
                    </div>
                    <div
                      className="rounded-xl p-4"
                      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-3)" }}>Vouches Out</p>
                      <p className="text-2xl font-bold text-white">{profile.stats.vouch.given.count}</p>
                      <p className="text-[12px] mt-0.5" style={{ color: "var(--blue)" }}>
                        {weiToEth(profile.stats.vouch.given.amountWeiTotal)} ETH
                      </p>
                    </div>
                    <div
                      className="rounded-xl p-4"
                      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-3)" }}>Mutual (3,3)</p>
                      <p className="text-2xl font-bold text-white">{vouches?.mutual?.data?.length ?? "—"}</p>
                      <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>reciprocal</p>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Highlights */}
                <div
                  className="rounded-xl p-5"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <p className="text-[13px] font-bold text-white mb-4">Highlights</p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "var(--text-3)" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904" />
                        </svg>
                        <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>Reviews</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-white">{totalReviews}</span>
                        {positiveRate > 0 && (
                          <span className="text-[11px] font-bold rounded px-1.5 py-0.5" style={{ background: "var(--green-dim)", color: "var(--green)" }}>
                            {positiveRate}% pos.
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "var(--text-3)" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                        </svg>
                        <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>Credible vouchers</span>
                      </div>
                      <span className="text-[13px] font-semibold text-white">{profile.stats.vouch.received.count}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "var(--text-3)" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                        </svg>
                        <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>Vouched in others</span>
                      </div>
                      <span className="text-[13px] font-semibold text-white">
                        {weiToEth(profile.stats.vouch.given.amountWeiTotal) === "0" ? "$0.00" : `${weiToEth(profile.stats.vouch.given.amountWeiTotal)} ETH`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "var(--text-3)" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                        <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>Contributor XP</span>
                      </div>
                      <span className="text-[13px] font-semibold" style={{ color: "var(--amber)" }}>
                        {profile.xpTotal?.toLocaleString() ?? "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "var(--text-3)" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                        </svg>
                        <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>Influence factor</span>
                      </div>
                      <span className="text-[13px] font-semibold text-white">
                        {profile.influenceFactor?.toFixed(0) ?? "—"}
                      </span>
                    </div>

                    <div
                      className="pt-3"
                      style={{ borderTop: "1px solid var(--border)" }}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-3)" }}>
                        Score Tier
                      </p>
                      <span
                        className="inline-block text-[12px] font-bold rounded-md px-2.5 py-1"
                        style={{ background: "var(--surface-2)", color: tier.color }}
                      >
                        {tier.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Score bar */}
              <div
                className="rounded-xl p-5"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[13px] font-semibold text-white">Credibility Score Progress</p>
                  <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {profile.score} / 2,800
                  </p>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.min((profile.score / 2800) * 100, 100)}%`,
                      background: "var(--blue)",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  {["Untrusted", "Questionable", "Known", "Reputable", "Exemplary"].map((label, i) => (
                    <span key={label} className="text-[10px]" style={{ color: "var(--text-3)" }}>{label}</span>
                  ))}
                </div>
              </div>

              {/* Upgrade CTA */}
              <div
                className="rounded-xl p-6 text-center relative overflow-hidden"
                style={{ background: "var(--surface)", border: "1px solid var(--blue)" }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse 500px 200px at 50% 100%, rgba(75,158,255,0.07), transparent)" }}
                />
                <div className="relative z-10">
                  <h3 className="text-[17px] font-bold text-white">
                    Want <span style={{ color: "var(--blue)" }}>Weekly Coaching?</span>
                  </h3>
                  <p className="mx-auto mt-2 max-w-lg text-[14px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                    Unlock Weekly Briefs, Reputation Matchmaker, Vouch ROI Analyzer, and Score Simulator.
                  </p>
                  <button className="btn-blue mt-5 px-7 py-2.5 text-[14px]">
                    Upgrade to Core Coaching — $10/mo
                  </button>
                  <p className="mt-2 text-[11px]" style={{ color: "var(--text-3)" }}>
                    Pay with USDC, ETH, or BNKR on Base
                  </p>
                </div>
              </div>

            </div>
          );
        })()}
      </div>
    </div>
  );
}
