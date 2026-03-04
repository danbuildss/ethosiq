import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address") || "";
  const name = searchParams.get("name") || address.slice(0, 6) + "…" + address.slice(-4);
  const score = parseInt(searchParams.get("score") || "0");
  const tier = searchParams.get("tier") || "Neutral";
  const handle = searchParams.get("handle") || "";
  const avatar = searchParams.get("avatar") || "";

  // Star count by tier
  const tierStars: Record<string, number> = {
    Untrusted: 1, Neutral: 2, Known: 3, Established: 3, Reputable: 4, Exemplary: 5,
  };
  const stars = tierStars[tier] || 2;

  // Tier color
  const tierColor: Record<string, string> = {
    Untrusted: "#F87171", Neutral: "#9CA3AF", Known: "#F59E0B",
    Established: "#A78BFA", Reputable: "#4D8EFF", Exemplary: "#00FF94",
  };
  const color = tierColor[tier] || "#4D8EFF";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "linear-gradient(135deg, #0A0A0A 0%, #111111 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Background glow */}
        <div style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
        }} />

        {/* Card */}
        <div style={{
          width: 420,
          background: "#0D0D0D",
          border: `2px solid ${color}`,
          borderRadius: 24,
          padding: "28px 28px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          boxShadow: `0 0 60px ${color}50, 0 0 120px ${color}20`,
          position: "relative",
        }}>
          {/* Corner decorations */}
          <div style={{ position: "absolute", top: 12, left: 12, width: 20, height: 20, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}`, borderRadius: "4px 0 0 0", display: "flex" }} />
          <div style={{ position: "absolute", top: 12, right: 12, width: 20, height: 20, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}`, borderRadius: "0 4px 0 0", display: "flex" }} />
          <div style={{ position: "absolute", bottom: 12, left: 12, width: 20, height: 20, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}`, borderRadius: "0 0 0 4px", display: "flex" }} />
          <div style={{ position: "absolute", bottom: 12, right: 12, width: 20, height: 20, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}`, borderRadius: "0 0 4px 0", display: "flex" }} />

          {/* EthosIQ badge */}
          <div style={{
            position: "absolute", top: 20, left: 28,
            background: "#4D8EFF",
            borderRadius: 6,
            padding: "3px 10px",
            fontSize: 11,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "0.05em",
            display: "flex",
          }}>
            EthosIQ
          </div>

          {/* Handle top right */}
          {handle && (
            <div style={{
              position: "absolute", top: 24, right: 28,
              fontSize: 11, color: "rgba(255,255,255,0.35)",
              display: "flex",
            }}>
              @{handle}
            </div>
          )}

          {/* Spacer */}
          <div style={{ height: 28, display: "flex" }} />

          {/* Name */}
          <div style={{
            fontSize: 32,
            fontWeight: 800,
            color: color,
            letterSpacing: "-0.5px",
            marginBottom: 16,
            display: "flex",
          }}>
            {name}
          </div>

          {/* Avatar */}
          {avatar ? (
            <img
              src={avatar}
              width={120}
              height={120}
              style={{ borderRadius: "50%", border: `3px solid ${color}`, objectFit: "cover" }}
            />
          ) : (
            <div style={{
              width: 120, height: 120, borderRadius: "50%",
              background: `linear-gradient(135deg, #4D8EFF, #7C3AED)`,
              border: `3px solid ${color}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 48, fontWeight: 800, color: "#fff",
            }}>
              {name[0]?.toUpperCase() || "?"}
            </div>
          )}

          {/* Score */}
          <div style={{
            fontSize: 56,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "-3px",
            marginTop: 16,
            marginBottom: 4,
            display: "flex",
          }}>
            {score.toLocaleString()}
          </div>

          {/* Stars */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{
                width: 20, height: 20,
                background: i <= stars ? color : "#1A1A1A",
                borderRadius: "50%",
                border: `1px solid ${i <= stars ? color : "#333"}`,
                display: "flex",
              }} />
            ))}
          </div>

          {/* Tier */}
          <div style={{
            background: `${color}18`,
            border: `1px solid ${color}40`,
            borderRadius: 99,
            padding: "5px 20px",
            fontSize: 13,
            fontWeight: 800,
            color: color,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            display: "flex",
            marginBottom: 16,
          }}>
            {tier}
          </div>

          {/* Footer */}
          <div style={{
            fontSize: 11, color: "rgba(255,255,255,0.2)",
            display: "flex",
            letterSpacing: "0.06em",
          }}>
            ethosiq.vercel.app
          </div>
        </div>

        {/* Right side text */}
        <div style={{
          position: "absolute",
          right: 80,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 320,
        }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", display: "flex" }}>
            Onchain Reputation
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1.2, display: "flex", flexDirection: "column" }}>
            <span>Your Ethos score</span>
            <span>decides who</span>
            <span style={{ color: "#4D8EFF" }}>trusts you.</span>
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 8, display: "flex" }}>
            ethosiq.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
