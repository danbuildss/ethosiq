"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body
        style={{
          background: "#0A0A0A",
          color: "#fff",
          fontFamily: "Inter, system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          margin: 0,
          textAlign: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Something went wrong</h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>{error?.message || "An unexpected error occurred."}</p>
        <button
          onClick={reset}
          style={{
            background: "#0052FF",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
