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

function getScoreTier(score: number) {
  if (score >= 2000) return { label: "Excellent", color: "text-green-light", bg: "bg-green-primary/10" };
  if (score >= 1600) return { label: "Good", color: "text-blue-light", bg: "bg-blue-primary/10" };
  if (score >= 1200) return { label: "Neutral", color: "text-gray-400", bg: "bg-gray-500/10" };
  if (score >= 800) return { label: "Doubt", color: "text-yellow-400", bg: "bg-yellow-500/10" };
  return { label: "Untrustworthy", color: "text-red-400", bg: "bg-red-500/10" };
}

function weiToEth(wei: string) {
  return (parseInt(wei || "0") / 1e18).toFixed(4);
}

function getTopAction(profile: EthosProfile, vouches: VouchData | null): string {
  const score = profile.score;
  const reviews = profile.stats.review.received;
  const vouchStats = profile.stats.vouch;
  const totalReviews = reviews.positive + reviews.neutral + reviews.negative;

  if (score < 800) {
    if (reviews.negative > reviews.positive) {
      return "Your negative reviews outweigh positives. Reach out to trusted connections and request honest positive reviews to rebuild credibility.";
    }
    return "Your score is critically low. Focus on getting vouches from credible wallets — even small amounts build trust quickly.";
  }

  if (totalReviews < 3) {
    return "You have very few reviews. Ask 3 trusted collaborators to leave you a positive review on Ethos this week.";
  }

  if (vouchStats.received.count < 3) {
    return "Low vouch count is holding your score back. Identify 3 credible wallets in your network and ask them to vouch for you.";
  }

  if (vouchStats.given.count === 0) {
    return "You haven't vouched for anyone yet. Vouch for 2-3 trusted builders to start building mutual credibility (3,3).";
  }

  if (vouches && vouches.mutual?.data?.length === 0 && vouchStats.given.count > 0) {
    return "None of your vouches are mutual yet. Reach out to wallets you've vouched for and ask them to vouch back — mutual vouches boost both scores.";
  }

  if (score < 1600) {
    return "You're in the neutral zone. One more positive review from a high-credibility wallet could push you into 'Good' territory.";
  }

  if (score < 2000) {
    return "Strong profile. To reach Excellent, increase your vouch diversity — vouch for credible wallets across different communities.";
  }

  return "Excellent reputation. Maintain it by staying active — review builders, keep your vouches healthy, and respond to any reviews.";
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

        if (vouchRes.ok) {
          const vouchData = await vouchRes.json();
          setVouches(vouchData);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (walletAddress) {
      fetchEthosData(walletAddress);
    }
  }, [walletAddress, fetchEthosData]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="bg-grid min-h-screen bg-dark">
      {/* App Navbar */}
      <nav className="border-b border-white/5 bg-dark/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-serif text-2xl tracking-tight text-white">
            Ethos<span className="text-gradient"> IQ</span>
          </Link>
          <div className="flex items-center gap-4">
            {authenticated && walletAddress && (
              <span className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400 sm:block">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            )}
            {authenticated ? (
              <button
                onClick={logout}
                className="cursor-pointer rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={login}
                className="btn-gradient cursor-pointer rounded-full px-6 py-2.5 text-sm font-semibold text-white"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {!authenticated ? (
          /* Not connected state */
          <div className="glow-blue-green flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-primary/20 to-green-primary/20 p-5">
              <svg className="h-10 w-10 text-blue-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h11m5-7h-2a2 2 0 00-2 2v0a2 2 0 002 2h2v-4z" />
              </svg>
            </div>
            <h1 className="font-serif text-3xl text-white md:text-5xl">
              Connect Your <span className="text-gradient italic">Wallet</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-lg text-gray-400">
              Connect your wallet to analyze your Ethos reputation score and get your personalized coaching plan.
            </p>
            <button
              onClick={login}
              className="btn-gradient mt-8 cursor-pointer rounded-full px-10 py-4 text-lg font-semibold text-white"
            >
              Connect Wallet
            </button>
          </div>
        ) : loading ? (
          /* Loading state */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-6 h-12 w-12 animate-spin rounded-full border-3 border-blue-primary border-t-transparent" />
            <p className="text-lg text-gray-400">Analyzing your Ethos profile...</p>
          </div>
        ) : error ? (
          /* Error state */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-red-500/10 p-5">
              <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl text-white">No Ethos Profile Found</h2>
            <p className="mx-auto mt-3 max-w-md text-gray-400">{error}</p>
            <p className="mt-2 text-sm text-gray-500">
              Make sure this wallet has an Ethos profile, or try a different wallet.
            </p>
            <button
              onClick={() => walletAddress && fetchEthosData(walletAddress)}
              className="mt-6 cursor-pointer rounded-full border border-white/10 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Try Again
            </button>
          </div>
        ) : profile ? (
          /* Dashboard */
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-serif text-3xl text-white md:text-4xl">
                  Your <span className="text-gradient italic">Score</span>
                </h1>
                <p className="mt-1 text-gray-400">
                  {profile.displayName || profile.username || walletAddress?.slice(0, 10) + "..."}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${getScoreTier(profile.score).bg} ${getScoreTier(profile.score).color}`}>
                  {getScoreTier(profile.score).label}
                </span>
              </div>
            </div>

            {/* Score + Stats Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Big Score Card */}
              <div className="glass rounded-2xl p-8 text-center lg:col-span-1">
                <p className="mb-2 text-sm font-medium text-gray-400">Credibility Score</p>
                <p className="text-gradient font-serif text-7xl font-bold">{profile.score}</p>
                <p className="mt-2 text-sm text-gray-500">out of 2,800</p>
                {/* Score bar */}
                <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-primary to-green-primary transition-all duration-1000"
                    style={{ width: `${(profile.score / 2800) * 100}%` }}
                  />
                </div>
                {profile.links?.scoreBreakdown && (
                  <a
                    href={profile.links.scoreBreakdown}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm text-blue-primary hover:text-blue-light"
                  >
                    View full breakdown on Ethos &rarr;
                  </a>
                )}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 lg:col-span-2">
                {/* Reviews */}
                <div className="glass rounded-2xl p-6">
                  <p className="mb-3 text-sm font-medium text-gray-400">Reviews Received</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-light">Positive</span>
                      <span className="font-semibold text-white">{profile.stats.review.received.positive}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Neutral</span>
                      <span className="font-semibold text-white">{profile.stats.review.received.neutral}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-400">Negative</span>
                      <span className="font-semibold text-white">{profile.stats.review.received.negative}</span>
                    </div>
                  </div>
                </div>

                {/* Vouches Received */}
                <div className="glass rounded-2xl p-6">
                  <p className="mb-3 text-sm font-medium text-gray-400">Vouches Received</p>
                  <p className="text-gradient font-serif text-3xl font-bold">
                    {profile.stats.vouch.received.count}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {weiToEth(profile.stats.vouch.received.amountWeiTotal)} ETH staked
                  </p>
                </div>

                {/* Vouches Given */}
                <div className="glass rounded-2xl p-6">
                  <p className="mb-3 text-sm font-medium text-gray-400">Vouches Given</p>
                  <p className="text-gradient font-serif text-3xl font-bold">
                    {profile.stats.vouch.given.count}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {weiToEth(profile.stats.vouch.given.amountWeiTotal)} ETH staked
                  </p>
                </div>

                {/* Mutual Vouches */}
                <div className="glass rounded-2xl p-6">
                  <p className="mb-3 text-sm font-medium text-gray-400">Mutual Vouches (3,3)</p>
                  <p className="text-gradient font-serif text-3xl font-bold">
                    {vouches?.mutual?.data?.length ?? "—"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">reciprocal connections</p>
                </div>
              </div>
            </div>

            {/* Influence Factor */}
            <div className="glass rounded-2xl p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Influence Factor</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {profile.influenceFactor?.toFixed(2) ?? "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-400">Percentile</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    Top {100 - (profile.influenceFactorPercentile ?? 0)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-400">XP Total</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {profile.xpTotal?.toLocaleString() ?? "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Top Action — Free Tier */}
            <div className="rounded-2xl border border-blue-primary/20 bg-gradient-to-r from-blue-primary/5 to-green-primary/5 p-8">
              <div className="flex items-start gap-4">
                <div className="shrink-0 rounded-xl bg-blue-primary/10 p-3">
                  <svg className="h-6 w-6 text-blue-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Your #1 Action Today</h3>
                  <p className="mt-2 leading-relaxed text-gray-300">
                    {getTopAction(profile, vouches)}
                  </p>
                </div>
              </div>
            </div>

            {/* Upgrade CTA */}
            <div className="glass rounded-2xl p-8 text-center">
              <h3 className="font-serif text-2xl text-white">
                Want <span className="text-gradient italic">Weekly Coaching?</span>
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-gray-400">
                Unlock Weekly Briefs, Reputation Matchmaker, Vouch ROI Analyzer, and Score Simulator for $10/month.
              </p>
              <button className="btn-gradient mt-6 cursor-pointer rounded-full px-8 py-3 text-sm font-semibold text-white">
                Upgrade to Core Coaching — $10/mo
              </button>
              <p className="mt-3 text-xs text-gray-500">Pay with USDC, ETH, or BNKR on Base</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
