import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "EthosIQ Reputation Card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { address: string } }) {
  const address = params.address;

  // Fetch profile data
  let name = address.slice(0, 6) + "…" + address.slice(-4);
  let score = 0;
  let tier = "Neutral";
  let handle = "";
  let avatar = "";

  try {
    const res = await fetch(
      `https://ethosiq.xyz/api/ethos/score?address=${encodeURIComponent(address)}`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const data = await res.json();
      name = data.displayName || data.username || name;
      score = data.score || 0;
      handle = data.twitterHandle || "";
      avatar = data.avatarUrl || (handle ? `https://unavatar.io/twitter/${handle}` : "");
      if (score >= 2400) tier = "Exemplary";
      else if (score >= 2000) tier = "Reputable";
      else if (score >= 1600) tier = "Established";
      else if (score >= 1200) tier = "Known";
      else if (score >= 800) tier = "Neutral";
      else tier = "Untrusted";
    }
  } catch { /* use defaults */ }

  const tierColor: Record<string, string> = {
    Untrusted: "#F87171", Neutral: "#9CA3AF", Known: "#F59E0B",
    Established: "#A78BFA", Reputable: "#4D8EFF", Exemplary: "#00FF94",
  };
  const color = tierColor[tier] || "#4D8EFF";
  const tierStars: Record<string, number> = {
    Untrusted: 1, Neutral: 2, Known: 3, Established: 3, Reputable: 4, Exemplary: 5,
  };
  const stars = tierStars[tier] || 2;

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, background: "linear-gradient(135deg, #0A0A0A 0%, #111111 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`, top: "50%", left: "50%", transform: "translate(-50%, -50%)", display: "flex" }} />
        <div style={{ width: 420, background: "#0D0D0D", border: `2px solid ${color}`, borderRadius: 24, padding: "28px 28px 24px", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: `0 0 60px ${color}50`, position: "relative" }}>
          <div style={{ position: "absolute", top: 12, left: 12, width: 20, height: 20, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}`, display: "flex" }} />
          <div style={{ position: "absolute", top: 12, right: 12, width: 20, height: 20, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}`, display: "flex" }} />
          <div style={{ position: "absolute", bottom: 12, left: 12, width: 20, height: 20, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}`, display: "flex" }} />
          <div style={{ position: "absolute", bottom: 12, right: 12, width: 20, height: 20, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}`, display: "flex" }} />
          <div style={{ position: "absolute", top: 20, left: 28, background: "#4D8EFF", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 800, color: "#fff", display: "flex" }}>EthosIQ</div>
          {handle && <div style={{ position: "absolute", top: 24, right: 28, fontSize: 11, color: "rgba(255,255,255,0.35)", display: "flex" }}>@{handle}</div>}
          <div style={{ height: 28, display: "flex" }} />
          <div style={{ fontSize: 32, fontWeight: 800, color: color, marginBottom: 16, display: "flex" }}>{name}</div>
          {avatar ? (
            <img src={avatar} width={120} height={120} style={{ borderRadius: "50%", border: `3px solid ${color}`, objectFit: "cover" }} />
          ) : (
            <div style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg, #4D8EFF, #7C3AED)", border: `3px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 800, color: "#fff" }}>{name[0]?.toUpperCase() || "?"}</div>
          )}
          <div style={{ fontSize: 56, fontWeight: 900, color: "#fff", letterSpacing: "-3px", marginTop: 16, marginBottom: 4, display: "flex" }}>{score.toLocaleString()}</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{ width: 20, height: 20, background: i <= stars ? color : "#1A1A1A", borderRadius: "50%", border: `1px solid ${i <= stars ? color : "#333"}`, display: "flex" }} />
            ))}
          </div>
          <div style={{ background: `${color}18`, border: `1px solid ${color}40`, borderRadius: 99, padding: "5px 20px", fontSize: 13, fontWeight: 800, color: color, textTransform: "uppercase", letterSpacing: "0.15em", display: "flex", marginBottom: 16 }}>{tier}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", display: "flex" }}>ethosiq.xyz</div>
        </div>
        <div style={{ position: "absolute", right: 80, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 8, maxWidth: 320 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", display: "flex" }}>Onchain Reputation</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1.2, display: "flex", flexDirection: "column" }}>
            <span>Your Ethos score</span>
            <span>decides who</span>
            <span style={{ color: "#4D8EFF" }}>trusts you.</span>
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 8, display: "flex" }}>ethosiq.xyz</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
