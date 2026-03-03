const stats = [
  { label: "Wallets Analyzed",      value: "—",   sub: "Since launch" },
  { label: "Avg. Score Improvement", value: "—",   sub: "Per coaching cycle" },
  { label: "ETH Vouched Tracked",   value: "—",   sub: "Across all users" },
];

export default function Stats() {
  return (
    <section
      className="px-5 py-16"
      style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="text-center py-4"
            style={{
              borderRight: i < 2 ? "1px solid var(--border)" : undefined,
            }}
          >
            <p
              className="text-5xl font-bold"
              style={{ color: "var(--blue)" }}
            >
              {s.value}
            </p>
            <p className="mt-2 text-[13px] font-semibold text-white tracking-wide">{s.label}</p>
            <p className="mt-1 text-[12px]" style={{ color: "var(--text-3)" }}>{s.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
