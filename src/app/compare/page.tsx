"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const BG = "#0A0A0A";
const SURFACE = "#111111";
const BORDER = "#1A1A1A";
const MUTED = "rgba(255,255,255,0.5)";
const MUTED2 = "rgba(255,255,255,0.25)";
const BLUE = "#4D8EFF";

function getScoreTier(score: number) {
  if (score >= 2400) return { label: "Exemplary", color: "#00FF94" };
  if (score >= 2000) return { label: "Reputable", color: "#4D8EFF" };
  if (score >= 1600) return { label: "Established", color: "#A78BFA" };
  if (score >= 1200) return { label: "Known", color: "#F59E0B" };
  if (score >= 800) return { label: "Neutral", color: MUTED };
  return { label: "Untrusted", color: "#F87171" };
}

interface Profile {
  displayName?: string;
  username?: string;
  avatarUrl?: string;
  twitterHandle?: string;
  score: number;
  xpTotal?: number;
  stats?: {
    review?: { received?: { positive?: number; neutral?: number; negative?: number } };
    vouch?: { received?: { count?: number }; given?: { count?: number } };
  };
}

function ProfileCard({ profile, address, winner }: { profile: Profile; address: string; winner: boolean }) {
  const tier = getScoreTier(profile.score);
  const name = profile.displayName || profile.username || address.slice(0, 6) + "…" + address.slice(-4);
  const avatarSrc = profile.avatarUrl || (profile.twitterHandle ? `https://unavatar.io/twitter/${profile.twitterHandle}` : null);
  const reviews = profile.stats?.review?.received;
  const totalReviews = (reviews?.positive || 0) + (reviews?.neutral || 0) + (reviews?.negative || 0);

  return (
    <div style={{
      background: winner ? "linear-gradient(135deg, rgba(77,142,255,0.08), rgba(77,142,255,0.02))" : SURFACE,
      border: `1px solid ${winner ? "rgba(77,142,255,0.4)" : BORDER}`,
      borderRadius: 16,
      padding: 24,
      flex: 1,
      position: "relative",
    }}>
      {winner && (
        <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: BLUE, color: "#fff", borderRadius: 99, padding: "3px 14px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
          HIGHER SCORE
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
        {avatarSrc ? (
          <img src={avatarSrc} alt={name} style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: `2px solid ${tier.color}` }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : (
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${BLUE}, #7C3AED)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#fff", border: `2px solid ${tier.color}` }}>
            {name[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: "#fff" }}>{name}</p>
          {profile.twitterHandle && <p style={{ margin: 0, fontSize: 12, color: "#1D9BF0" }}>@{profile.twitterHandle}</p>}
        </div>
        <div style={{ fontSize: 48, fontWeight: 900, color: tier.color, letterSpacing: "-2px" }}>{profile.score.toLocaleString()}</div>
        <span style={{ background: `${tier.color}18`, border: `1px solid ${tier.color}30`, borderRadius: 99, padding: "4px 14px", fontSize: 12, fontWeight: 700, color: tier.color, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{tier.label}</span>
        <div style={{ width: "100%", borderTop: `1px solid ${BORDER}`, paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "XP", value: (profile.xpTotal || 0).toLocaleString() },
            { label: "Vouches", value: profile.stats?.vouch?.received?.count || 0 },
            { label: "Reviews", value: totalReviews },
            { label: "Positive Reviews", value: reviews?.positive || 0 },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: MUTED2, fontWeight: 600 }}>{label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompareContent() {
  const searchParams = useSearchParams();
  const [addr1, setAddr1] = useState("");
  const [addr2, setAddr2] = useState("");
  const [profile1, setProfile1] = useState<Profile | null>(null);
  const [profile2, setProfile2] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const runCompare = useCallback(async (a: string, b: string) => {
    if (!a.trim() || !b.trim()) return;
    setLoading(true);
    setError(null);
    setProfile1(null);
    setProfile2(null);
    try {
      const [r1, r2] = await Promise.all([
        fetch(`/api/ethos/score?address=${encodeURIComponent(a.trim())}`).then(r => r.json()),
        fetch(`/api/ethos/score?address=${encodeURIComponent(b.trim())}`).then(r => r.json()),
      ]);
      if (r1.error || r2.error) {
        setError(r1.error || r2.error);
      } else {
        setProfile1(r1);
        setProfile2(r2);
      }
    } catch {
      setError("Failed to fetch profiles.");
    }
    setLoading(false);
  }, []);

  // Auto-compare from URL query params
  useEffect(() => {
    const a = searchParams.get("a");
    const b = searchParams.get("b");
    if (a && b) {
      setAddr1(a);
      setAddr2(b);
      runCompare(a, b);
    }
  }, [searchParams, runCompare]);

  const compare = async (e: React.FormEvent) => {
    e.preventDefault();
    runCompare(addr1, addr2);
  };

  const copyShare = () => {
    const url = `${window.location.origin}/compare?a=${encodeURIComponent(addr1)}&b=${encodeURIComponent(addr2)}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#fff", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } } .fade { animation: fadeUp 0.4s ease forwards; }`}</style>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`, padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", textDecoration: "none" }}>
          <svg width="18" height="14" viewBox="0 0 20 15" fill="none"><rect width="20" height="2.5" rx="1.25" fill="currentColor"/><rect y="6.25" width="20" height="2.5" rx="1.25" fill="currentColor"/><rect y="12.5" width="20" height="2.5" rx="1.25" fill="currentColor"/></svg>
          <span style={{ fontSize: 16, fontWeight: 800 }}>Ethos<span style={{ color: BLUE }}>IQ</span></span>
        </Link>
        <Link href="/app" style={{ background: BLUE, color: "#fff", borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Check My Score</Link>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ margin: "0 0 8px", fontSize: 36, fontWeight: 900, letterSpacing: "-1px" }}>
            Compare <span style={{ color: BLUE }}>Wallets</span>
          </h1>
          <p style={{ margin: 0, fontSize: 15, color: MUTED }}>Side-by-side Ethos reputation breakdown</p>
        </div>

        <form onSubmit={compare} style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap" }}>
          <input value={addr1} onChange={e => setAddr1(e.target.value)} placeholder="First wallet or ENS..."
            style={{ flex: 1, minWidth: 200, background: SURFACE, border: `1px solid #2A2A2A`, borderRadius: 10, color: "#fff", padding: "12px 16px", fontSize: 14, outline: "none" }} />
          <div style={{ display: "flex", alignItems: "center", color: MUTED2, fontWeight: 700, fontSize: 14 }}>VS</div>
          <input value={addr2} onChange={e => setAddr2(e.target.value)} placeholder="Second wallet or ENS..."
            style={{ flex: 1, minWidth: 200, background: SURFACE, border: `1px solid #2A2A2A`, borderRadius: 10, color: "#fff", padding: "12px 16px", fontSize: 14, outline: "none" }} />
          <button type="submit" disabled={loading} style={{ background: BLUE, color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Comparing..." : "Compare"}
          </button>
        </form>

        {error && <p style={{ color: "#F87171", textAlign: "center" }}>{error}</p>}

        {profile1 && profile2 && (
          <div className="fade">
            <div style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
              <ProfileCard profile={profile1} address={addr1} winner={profile1.score > profile2.score} />
              <div style={{ display: "flex", alignItems: "center", color: MUTED2, fontWeight: 900, fontSize: 24, flexShrink: 0, paddingTop: 60 }}>VS</div>
              <ProfileCard profile={profile2} address={addr2} winner={profile2.score > profile1.score} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
              <button onClick={copyShare} style={{ display: "flex", alignItems: "center", gap: 6, background: "#111", border: `1px solid #2A2A2A`, borderRadius: 8, padding: "10px 20px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                {copied ? "Link Copied!" : "Share Comparison"}
              </button>
              <Link href="/app" style={{ display: "flex", alignItems: "center", gap: 6, background: BLUE, borderRadius: 8, padding: "10px 20px", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                Improve My Score
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        Loading...
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
