"use client";

export const dynamic = "force-dynamic";

import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  twitterHandle?: string;
  discordHandle?: string;
  farcasterHandle?: string;
  socials?: Record<string, unknown>;
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
  searchQuery,
  setSearchQuery,
  handleSearch,
}: {
  authenticated: boolean;
  walletAddress?: string;
  score?: number;
  login: () => void;
  logout: () => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}) {
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
          Ethos<span style={{ color: "#4D8EFF" }}>IQ</span>
        </Link>

        {/* Search form */}
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search wallet or ENS..."
            style={{
              background: "#161616",
              border: "1px solid #2A2A2A",
              borderRadius: 8,
              color: "#fff",
              padding: "7px 12px",
              fontSize: 13,
              outline: "none",
              width: 200,
            }}
          />
          <button type="submit" style={{ background: "#4D8EFF", border: "none", borderRadius: 8, padding: "7px 12px", cursor: "pointer", color: "#fff", fontSize: 13, fontWeight: 600 }}>
            Go
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
          {/* Powered by badge */}
          <span style={{ fontSize: 11, color: MUTED2, fontWeight: 500, flexShrink: 0 }}>
            Powered by Ethos Network
          </span>

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

/* ─── Core Feature Helpers ──────────────────────────────────────── */
function generateWeeklyBrief(profile: any): string {
  if (!profile) return "";
  const total = (profile.stats?.review?.received?.positive || 0) + (profile.stats?.review?.received?.negative || 0) + (profile.stats?.review?.received?.neutral || 0);
  const vouches = profile.stats?.vouch?.received?.count || 0;
  return `Score: ${profile.score.toLocaleString()} (${getScoreTier(profile.score).label}). ${total} total reviews, ${vouches} vouches received. ${profile.stats?.review?.received?.positive || 0} positive reviews. Focus this week: grow vouch count.`;
}

function generateMatchmaker(profile: any, vouches: any): string {
  if (!profile) return "";
  const mutual = vouches?.mutual?.data?.length || 0;
  const received = profile.stats?.vouch?.received?.count || 0;
  if (mutual < 3) return `You have ${mutual} mutual vouches. Find builders you've worked with and start 3,3 vouch chains — each one directly boosts both scores.`;
  if (received < 10) return `${received} vouches received so far. Target builders with scores above ${profile.score} — their vouches carry more weight and lift your score faster.`;
  return `Strong vouch network at ${received} received. Expand into new ecosystems — vouching across communities multiplies your influence factor.`;
}

function generateVouchROI(profile: any, vouches: any): string {
  if (!profile) return "";
  const mutual = vouches?.mutual?.data?.length || 0;
  const given = profile.stats?.vouch?.given?.count || 0;
  const received = profile.stats?.vouch?.received?.count || 0;
  const ratio = given > 0 ? (received / given).toFixed(1) : "N/A";
  return `You've given ${given} vouches, received ${received}. Return ratio: ${ratio}x. Mutual (3,3) vouches: ${mutual}. Your top ROI move: convert one-way vouches to mutual.`;
}

function generateSimulator(profile: any): string {
  if (!profile) return "";
  const score = profile.score;
  const nextTier = score < 800 ? { name: "Neutral", target: 800 } :
    score < 1200 ? { name: "Known", target: 1200 } :
    score < 1600 ? { name: "Established", target: 1600 } :
    score < 2000 ? { name: "Reputable", target: 2000 } :
    score < 2400 ? { name: "Exemplary", target: 2400 } : null;
  if (!nextTier) return `You've reached the top tier — Exemplary. Maintain it by staying active and keeping vouches healthy.`;
  const gap = nextTier.target - score;
  const vouchesNeeded = Math.ceil(gap / 50);
  const reviewsNeeded = Math.ceil(gap / 30);
  return `${gap} points to ${nextTier.name}. Estimated paths: ${vouchesNeeded} new vouches OR ${reviewsNeeded} positive reviews from credible wallets.`;
}

/* ─── Main component ────────────────────────────────────────────── */
export default function AppPage() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [profile, setProfile] = useState<EthosProfile | null>(null);
  const [vouches, setVouches] = useState<VouchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<"free" | "core" | "trial">("free");

  // AI Coaching state
  const [aiCoaching, setAiCoaching] = useState<string | null>(null);
  const [coachingLoading, setCoachingLoading] = useState(false);

  // Upgrade Modal state
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [paymentWallet, setPaymentWallet] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifySuccess, setVerifySuccess] = useState(false);

  // Trial state
  const [showTrialInput, setShowTrialInput] = useState(false);
  const [trialCode, setTrialCode] = useState("");
  const [trialLoading, setTrialLoading] = useState(false);
  const [trialError, setTrialError] = useState<string | null>(null);
  const [trialSuccess, setTrialSuccess] = useState(false);

  const walletAddress = user?.wallet?.address;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/profile/${encodeURIComponent(q)}`);
  };

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

  // Fetch AI coaching when profile is loaded
  useEffect(() => {
    if (!profile) return;
    setCoachingLoading(true);
    fetch("/api/bankr/coaching", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: profile.score,
        tier: getScoreTier(profile.score).label,
        reviews: profile.stats.review.received,
        vouchesReceived: profile.stats.vouch.received.count,
        vouchesGiven: profile.stats.vouch.given.count,
        mutualVouches: vouches?.mutual?.data?.length ?? 0,
        xpTotal: profile.xpTotal,
        influenceFactor: profile.influenceFactor,
      }),
    })
      .then(r => r.json())
      .then(d => { if (d.coaching) setAiCoaching(d.coaching); })
      .catch(() => {})
      .finally(() => setCoachingLoading(false));
  }, [profile]);

  // Fetch payment wallet on mount
  useEffect(() => {
    fetch("/api/bankr/wallet")
      .then(r => r.json())
      .then(d => { if (d.wallet?.address) setPaymentWallet(d.wallet.address); })
      .catch(() => {});
  }, []);

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

  // Verify payment handler
  const verifyPayment = async () => {
    if (!txHash || !user) return;
    setVerifying(true);
    setVerifyError(null);
    const res = await fetch("/api/payment/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ txHash, privyUserId: user.id, plan: "core" }),
    });
    const data = await res.json();
    if (data.success) {
      setVerifySuccess(true);
      setUserPlan("core");
      setTimeout(() => setShowUpgrade(false), 2000);
    } else {
      setVerifyError(data.error || "Verification failed.");
    }
    setVerifying(false);
  };

  // Activate trial handler
  const activateTrial = async () => {
    if (!trialCode || !user) return;
    setTrialLoading(true);
    setTrialError(null);
    const res = await fetch("/api/trial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: trialCode, privyUserId: user.id }),
    });
    const data = await res.json();
    if (data.success) {
      setTrialSuccess(true);
      setUserPlan("trial");
      setTimeout(() => setShowTrialInput(false), 2000);
    } else {
      setTrialError(data.error || "Invalid code.");
    }
    setTrialLoading(false);
  };

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

  // Check if any social handles exist
  const hasSocials = profile && (profile.twitterHandle || profile.farcasterHandle || profile.discordHandle);

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .card-anim-1 { animation: fadeUp 0.5s ease forwards; }
        .card-anim-2 { animation: fadeUp 0.5s ease 0.1s forwards; opacity: 0; }
        .card-anim-3 { animation: fadeUp 0.5s ease 0.2s forwards; opacity: 0; }
        .card-anim-4 { animation: fadeUp 0.5s ease 0.3s forwards; opacity: 0; }
        .card-anim-5 { animation: fadeUp 0.5s ease 0.4s forwards; opacity: 0; }
        .score-glow {
          background: linear-gradient(90deg, #fff 0%, #4D8EFF 50%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      <AppNavbar
        authenticated={authenticated}
        walletAddress={walletAddress}
        score={profile?.score}
        login={login}
        logout={logout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
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
              className="card-anim-1"
              style={{
                background: SURFACE,
                border: `1px solid ${profile.score >= 1600 ? "rgba(0,82,255,0.4)" : BORDER}`,
                borderRadius: 16,
                padding: "28px",
                boxShadow: profile.score >= 1600 ? "0 0 40px rgba(0,82,255,0.1)" : "none",
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 28,
                alignItems: "center",
              }}
            >
              {/* Left: Identity */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, minWidth: 100 }}>
                {/* Avatar */}
                {(() => {
                  const avatarSrc = profile.avatarUrl
                    || (profile.twitterHandle ? `https://unavatar.io/twitter/${profile.twitterHandle}` : null);
                  return avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={name}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid rgba(77,142,255,0.3)",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
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
                  );
                })()}
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
                  {/* Social handles */}
                  {hasSocials && (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10, justifyContent: "center" }}>
                      {profile.twitterHandle && (
                        <a
                          href={`https://x.com/${profile.twitterHandle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: "flex", alignItems: "center", gap: 4, color: "#1D9BF0", fontSize: 11, fontWeight: 600, textDecoration: "none" }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.766l7.651-8.72L2.25 2.25H8.08l4.262 5.637L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                          </svg>
                          @{profile.twitterHandle}
                        </a>
                      )}
                      {profile.farcasterHandle && (
                        <a
                          href={`https://warpcast.com/${profile.farcasterHandle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: "flex", alignItems: "center", gap: 4, color: "#8B5CF6", fontSize: 11, fontWeight: 600, textDecoration: "none" }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.5 2C8.46 2 6 4.46 6 7.5V22h3v-7h5v7h3V7.5C17 4.46 14.54 2 11.5 2zm0 3c1.38 0 2.5 1.12 2.5 2.5V13H9V7.5C9 6.12 10.12 5 11.5 5z"/>
                          </svg>
                          @{profile.farcasterHandle}
                        </a>
                      )}
                      {profile.discordHandle && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#5865F2", fontSize: 11, fontWeight: 600 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                          </svg>
                          {profile.discordHandle}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Center: Score */}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: MUTED2, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>
                  Ethos Score
                </div>
                <span
                  className="score-glow"
                  style={{
                    fontSize: 72,
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: "-4px",
                    display: "inline-block",
                  }}
                >
                  {profile.score}
                </span>
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
            </div>

            {/* ── Section B: Action Today (Priority Card) ── */}
            <div
              className="card-anim-2"
              style={{
                background: "linear-gradient(135deg, rgba(77,142,255,0.12) 0%, rgba(77,142,255,0.04) 100%)",
                border: "1px solid rgba(77,142,255,0.35)",
                borderRadius: 14,
                padding: "20px 24px",
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
              }}
            >
              {/* Icon */}
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#4D8EFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: "#4D8EFF", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Your Action for Today
                </p>
                {coachingLoading ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #4D8EFF", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
                    <span style={{ color: MUTED2, fontSize: 13 }}>Analyzing your profile...</span>
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: 15, lineHeight: "1.65", color: "#E8E8E8", fontWeight: 500 }}>
                    {aiCoaching || getTopAction(profile, vouches)}
                  </p>
                )}
              </div>
            </div>

            {/* ── Section C: 4 Stats ── */}
            <div className="card-anim-3" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
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

            {/* ── Section D: Vouch Network ── */}
            <div className="card-anim-4">
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
            </div>

            {/* ── Section E: Core Features ── */}
            <div style={{ marginTop: 24 }}>
              <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 700, color: MUTED2, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Core Features {userPlan === "free" && <span style={{ color: "#F59E0B", marginLeft: 6 }}>— Locked</span>}
                {(userPlan === "core" || userPlan === "trial") && <span style={{ color: "#00FF94", marginLeft: 6 }}>— Active</span>}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                {[
                  {
                    title: "Weekly Brief",
                    icon: "📋",
                    desc: userPlan === "free" ? "Your reputation summary, delivered weekly." : generateWeeklyBrief(profile),
                    locked: userPlan === "free",
                  },
                  {
                    title: "Reputation Matchmaker",
                    icon: "🤝",
                    desc: userPlan === "free" ? "Find wallets you should vouch with." : generateMatchmaker(profile, vouches),
                    locked: userPlan === "free",
                  },
                  {
                    title: "Vouch ROI",
                    icon: "📈",
                    desc: userPlan === "free" ? "See which vouches are helping your score most." : generateVouchROI(profile, vouches),
                    locked: userPlan === "free",
                  },
                  {
                    title: "Score Simulator",
                    icon: "🎯",
                    desc: userPlan === "free" ? "Simulate what improves your score." : generateSimulator(profile),
                    locked: userPlan === "free",
                  },
                ].map(({ title, icon, desc, locked }) => (
                  <div key={title} style={{
                    background: locked ? "#0D0D0D" : SURFACE,
                    border: `1px solid ${locked ? BORDER : "rgba(77,142,255,0.2)"}`,
                    borderRadius: 12,
                    padding: "16px 18px",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    {locked && (
                      <div style={{ position: "absolute", inset: 0, backdropFilter: "blur(3px)", background: "rgba(10,10,10,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 20, marginBottom: 4 }}>🔒</div>
                          <p style={{ margin: 0, fontSize: 11, color: MUTED2, fontWeight: 600 }}>Core only</p>
                        </div>
                      </div>
                    )}
                    <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>
                    <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: locked ? MUTED : "#fff" }}>{title}</p>
                    <p style={{ margin: 0, fontSize: 12, color: MUTED2, lineHeight: "1.5" }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Section F: Upgrade Gate ── */}
            {userPlan === "free" && (
              <div
                className="card-anim-5"
                style={{
                  background: SURFACE,
                  border: `1px solid rgba(77,142,255,0.3)`,
                  borderRadius: 16,
                  padding: "32px",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 600px 200px at 50% 100%, rgba(77,142,255,0.06), transparent)", pointerEvents: "none" }} />
                <div style={{ position: "relative" }}>
                  <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#fff" }}>
                    Unlock <span style={{ color: "#4D8EFF" }}>Core Coaching</span>
                  </h3>
                  <p style={{ margin: "0 0 20px", fontSize: 14, color: MUTED, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
                    Weekly Briefs, Reputation Matchmaker, Vouch ROI Analyzer, and Score Simulator.
                  </p>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
                    {["Weekly Brief", "Matchmaker", "Vouch ROI", "Score Simulator"].map(f => (
                      <span key={f} style={{ background: "rgba(77,142,255,0.1)", border: "1px solid rgba(77,142,255,0.2)", borderRadius: 99, padding: "4px 12px", fontSize: 12, color: "#4D8EFF", fontWeight: 600 }}>{f}</span>
                    ))}
                  </div>

                  {/* Trial input panel */}
                  {showTrialInput && (
                    <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: 12, padding: "24px", maxWidth: 480, margin: "0 auto 16px", textAlign: "left" }}>
                      {trialSuccess ? (
                        <p style={{ color: "#00FF94", fontWeight: 600, textAlign: "center", margin: 0 }}>Trial activated! Full access unlocked.</p>
                      ) : (
                        <>
                          <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: "#fff" }}>Enter your trial code</p>
                          <input
                            value={trialCode}
                            onChange={e => setTrialCode(e.target.value)}
                            placeholder="TRIAL-XXXX"
                            style={{ width: "100%", background: "#111", border: "1px solid #2A2A2A", borderRadius: 8, color: "#fff", padding: "10px 12px", fontSize: 13, fontFamily: "monospace", boxSizing: "border-box", marginBottom: 8 }}
                          />
                          {trialError && <p style={{ color: "#F87171", fontSize: 12, margin: "0 0 8px" }}>{trialError}</p>}
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              onClick={activateTrial}
                              disabled={!trialCode || trialLoading}
                              style={{ flex: 1, background: "#4D8EFF", color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: 14, fontWeight: 700, cursor: trialCode && !trialLoading ? "pointer" : "not-allowed", opacity: !trialCode || trialLoading ? 0.5 : 1 }}
                            >
                              {trialLoading ? "Activating..." : "Activate Trial"}
                            </button>
                            <button onClick={() => { setShowTrialInput(false); setTrialError(null); setTrialCode(""); }} style={{ background: "#1A1A1A", color: MUTED, border: "1px solid #2A2A2A", borderRadius: 8, padding: "10px 16px", fontSize: 13, cursor: "pointer" }}>
                              Cancel
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Payment panel */}
                  {showUpgrade && (
                    <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: 12, padding: "24px", maxWidth: 480, margin: "0 auto 16px", textAlign: "left" }}>
                      {verifySuccess ? (
                        <p style={{ color: "#00FF94", fontWeight: 600, textAlign: "center", margin: 0 }}>Payment verified. Core Coaching unlocked.</p>
                      ) : (
                        <>
                          <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: "#fff" }}>Send payment on Base</p>
                          <div style={{ background: "#111", border: "1px solid #1A1A1A", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                            <p style={{ margin: "0 0 4px", fontSize: 11, color: MUTED2, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Amount</p>
                            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff" }}>10 USDC <span style={{ color: MUTED2, fontWeight: 400 }}>or equivalent ETH/BNKR</span></p>
                          </div>
                          <div style={{ background: "#111", border: "1px solid #1A1A1A", borderRadius: 8, padding: 12, marginBottom: 16 }}>
                            <p style={{ margin: "0 0 4px", fontSize: 11, color: MUTED2, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Send to</p>
                            <p style={{ margin: 0, fontSize: 12, fontFamily: "monospace", color: "#4D8EFF", wordBreak: "break-all" }}>
                              {paymentWallet || "Loading wallet..."}
                            </p>
                          </div>
                          <p style={{ margin: "0 0 8px", fontSize: 13, color: MUTED2 }}>After sending, paste your transaction hash:</p>
                          <input
                            value={txHash}
                            onChange={e => setTxHash(e.target.value)}
                            placeholder="0x..."
                            style={{ width: "100%", background: "#111", border: "1px solid #2A2A2A", borderRadius: 8, color: "#fff", padding: "10px 12px", fontSize: 13, fontFamily: "monospace", boxSizing: "border-box", marginBottom: 8 }}
                          />
                          {verifyError && <p style={{ color: "#F87171", fontSize: 12, margin: "0 0 8px" }}>{verifyError}</p>}
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              onClick={verifyPayment}
                              disabled={!txHash || verifying}
                              style={{ flex: 1, background: "#4D8EFF", color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: 14, fontWeight: 700, cursor: txHash && !verifying ? "pointer" : "not-allowed", opacity: !txHash || verifying ? 0.5 : 1 }}
                            >
                              {verifying ? "Verifying..." : "Verify Payment"}
                            </button>
                            <button onClick={() => setShowUpgrade(false)} style={{ background: "#1A1A1A", color: MUTED, border: "1px solid #2A2A2A", borderRadius: 8, padding: "10px 16px", fontSize: 13, cursor: "pointer" }}>
                              Cancel
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {!showUpgrade && !showTrialInput && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
                      {/* Trial — PRIMARY */}
                      <button
                        onClick={() => setShowTrialInput(true)}
                        style={{
                          background: "#4D8EFF",
                          color: "#fff",
                          border: "none",
                          borderRadius: 10,
                          padding: "14px 40px",
                          fontSize: 15,
                          fontWeight: 700,
                          cursor: "pointer",
                          boxShadow: "0 0 24px rgba(77,142,255,0.3)",
                        }}
                      >
                        Start 7-Day Free Trial
                      </button>
                      <p style={{ margin: 0, fontSize: 11, color: MUTED2 }}>Full access, no payment required. Use a trial code.</p>
                      {/* Upgrade — SECONDARY */}
                      <button
                        onClick={() => setShowUpgrade(true)}
                        style={{
                          background: "transparent",
                          color: MUTED,
                          border: "1px solid #2A2A2A",
                          borderRadius: 8,
                          padding: "8px 24px",
                          fontSize: 13,
                          cursor: "pointer",
                          marginTop: 4,
                        }}
                      >
                        Or upgrade now — $10/month
                      </button>
                    </div>
                  )}

                  <p style={{ margin: "12px 0 0", fontSize: 11, color: MUTED2 }}>Pay with USDC, ETH, or BNKR on Base. No credit card.</p>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
