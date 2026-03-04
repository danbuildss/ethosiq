"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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

export default function ProfilePage() {
  const params = useParams();
  const address = params.address as string;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  const isAddress = address?.startsWith("0x");

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    // Support both wallet addresses (0x...) and usernames
    const param = isAddress ? `address=${encodeURIComponent(address)}` : `username=${encodeURIComponent(address)}`;
    fetch(`/api/ethos/score?${param}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError("No Ethos profile found.");
        else setProfile(d);
      })
      .catch(() => setError("Failed to fetch profile."))
      .finally(() => setLoading(false));
  }, [address]);

  const tier = profile ? getScoreTier(profile.score) : null;
  const name = profile?.displayName || profile?.username || address?.slice(0, 6) + "..." + address?.slice(-4);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const cardUrl = `/api/og/profile?address=${address}&name=${encodeURIComponent(profile?.displayName || profile?.username || "")}&score=${profile?.score || 0}&tier=${tier?.label || ""}&handle=${encodeURIComponent(profile?.twitterHandle || "")}&avatar=${encodeURIComponent(profile?.avatarUrl || (profile?.twitterHandle ? `https://unavatar.io/twitter/${profile.twitterHandle}` : ""))}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const embedCode = `<a href="https://ethosiq.xyz/profile/${address}" target="_blank"><img src="https://ethosiq.xyz/api/og/profile?address=${address}&score=${profile?.score || 0}&tier=${tier?.label || 'Neutral'}&name=${encodeURIComponent(profile?.displayName || profile?.username || '')}&handle=${encodeURIComponent(profile?.twitterHandle || '')}" width="400" height="210" alt="EthosIQ Reputation Card" style="border-radius:12px" /></a>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#fff", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade { animation: fadeUp 0.5s ease forwards; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`, padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", textDecoration: "none" }}>
          <svg width="18" height="14" viewBox="0 0 20 15" fill="none">
            <rect width="20" height="2.5" rx="1.25" fill="currentColor"/>
            <rect y="6.25" width="20" height="2.5" rx="1.25" fill="currentColor"/>
            <rect y="12.5" width="20" height="2.5" rx="1.25" fill="currentColor"/>
          </svg>
          <span style={{ fontSize: 16, fontWeight: 800 }}>Ethos<span style={{ color: BLUE }}>IQ</span></span>
        </Link>
        <Link href="/app" style={{ background: BLUE, color: "#fff", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Check My Score
        </Link>
      </nav>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px" }}>
        {loading && (
          <div style={{ textAlign: "center", paddingTop: 80 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", border: `3px solid ${BLUE}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ color: MUTED2, fontSize: 14 }}>Loading profile...</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", paddingTop: 80 }}>
            <p style={{ color: "#F87171", fontSize: 15, marginBottom: 16 }}>{error}</p>
            <Link href="/app" style={{ color: BLUE, fontSize: 13 }}>Check your own score</Link>
          </div>
        )}

        {profile && !loading && (
          <div className="fade">
            {/* Profile header */}
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 28, marginBottom: 16, display: "flex", gap: 20, alignItems: "flex-start" }}>
              {(() => {
                const avatarSrc = profile.avatarUrl
                  || (profile.twitterHandle ? `https://unavatar.io/twitter/${profile.twitterHandle}` : null);
                return avatarSrc ? (
                  <img src={avatarSrc} alt={name}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: `2px solid rgba(77,142,255,0.3)`, flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${BLUE}, #7C3AED)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, flexShrink: 0 }}>
                    {name[0]?.toUpperCase()}
                  </div>
                );
              })()}
              <div style={{ flex: 1 }}>
                <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>{name}</h1>
                {profile.description && <p style={{ margin: "0 0 10px", fontSize: 13, color: MUTED, lineHeight: "1.5" }}>{profile.description}</p>}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {profile.twitterHandle && (
                    <a href={`https://x.com/${profile.twitterHandle}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: 4, color: "#1D9BF0", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.766l7.651-8.72L2.25 2.25H8.08l4.262 5.637L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
                      @{profile.twitterHandle}
                    </a>
                  )}
                  {profile.farcasterHandle && (
                    <a href={`https://warpcast.com/${profile.farcasterHandle}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: 4, color: "#8B5CF6", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 2C8.46 2 6 4.46 6 7.5V22h3v-7h5v7h3V7.5C17 4.46 14.54 2 11.5 2zm0 3c1.38 0 2.5 1.12 2.5 2.5V13H9V7.5C9 6.12 10.12 5 11.5 5z"/></svg>
                      @{profile.farcasterHandle}
                    </a>
                  )}
                </div>
              </div>
              {/* Score badge */}
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-1px", color: tier?.color }}>{profile.score.toLocaleString()}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: tier?.color, textTransform: "uppercase", letterSpacing: "0.1em" }}>{tier?.label}</div>
              </div>
            </div>

            {/* Stats row */}
            {profile.stats && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
                {[
                  { label: "Reviews", value: (profile.stats.review?.received?.positive || 0) + (profile.stats.review?.received?.negative || 0) + (profile.stats.review?.received?.neutral || 0) },
                  { label: "Vouches Received", value: profile.stats.vouch?.received?.count || 0 },
                  { label: "XP", value: (profile.xpTotal || 0).toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px", textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{value}</div>
                    <div style={{ fontSize: 11, color: MUTED2, marginTop: 2, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            <div style={{ background: `linear-gradient(135deg, rgba(77,142,255,0.1), rgba(77,142,255,0.03))`, border: `1px solid rgba(77,142,255,0.25)`, borderRadius: 14, padding: "24px", textAlign: "center" }}>
              <p style={{ margin: "0 0 12px", fontSize: 14, color: MUTED }}>Want to know how to improve your own Ethos score?</p>
              <Link href="/app" style={{ display: "inline-block", background: BLUE, color: "#fff", borderRadius: 8, padding: "10px 28px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                Check My Score — Free
              </Link>
            </div>

            {/* Share buttons */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
              <button onClick={copyLink} style={{ display: "flex", alignItems: "center", gap: 6, background: "#111", border: "1px solid #2A2A2A", borderRadius: 8, padding: "9px 18px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {copied ? "Link Copied!" : "Share Profile"}
              </button>
              <a href={cardUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, background: "#4D8EFF", border: "none", borderRadius: 8, padding: "9px 18px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none" }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                View Card
              </a>
            </div>

            {/* Badge embed */}
            <div style={{ marginTop: 24, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
              <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 600, color: MUTED2, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Embed this profile
              </p>
              <div style={{ background: "#0A0A0A", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px", fontFamily: "monospace", fontSize: 11, color: MUTED, wordBreak: "break-all", marginBottom: 10 }}>
                {embedCode}
              </div>
              <button onClick={copyEmbed} style={{ background: "#1A1A1A", border: `1px solid #2A2A2A`, borderRadius: 7, padding: "7px 16px", color: MUTED, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                {embedCopied ? "Copied!" : "Copy Embed Code"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
