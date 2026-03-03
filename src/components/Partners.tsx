const partners = [
  { name: "Ethos Network", icon: "≡" },
  { name: "Bankr",         icon: "₿" },
  { name: "Base",          icon: "◈" },
  { name: "Privy",         icon: "⬡" },
  { name: "Claude AI",     icon: "✦" },
];

export default function Partners() {
  return (
    <section
      className="px-5 py-8"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div className="mx-auto max-w-5xl">
        <p
          className="mb-6 text-center text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-3)" }}
        >
          Powered By
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {partners.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
              style={{ color: "rgba(255,255,255,0.22)" }}
            >
              <span className="text-xl font-bold">{p.icon}</span>
              <span className="text-[13px] font-semibold tracking-wide">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
