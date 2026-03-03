export default function Footer() {
  return (
    <footer
      className="px-5 py-12"
      style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 text-white mb-3">
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                <rect width="18" height="2.25" rx="1.125" fill="currentColor" />
                <rect y="5.75" width="18" height="2.25" rx="1.125" fill="currentColor" />
                <rect y="11.5" width="18" height="2.25" rx="1.125" fill="currentColor" />
              </svg>
              <span className="text-[15px] font-bold">
                Ethos <span style={{ color: "var(--blue)" }}>IQ</span>
              </span>
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-3)" }}>
              AI-powered reputation coaching for web3. Built on Base.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 text-[11px] font-semibold tracking-widest uppercase" style={{ color: "var(--text-3)" }}>
              Product
            </h4>
            <ul className="space-y-2.5">
              {["Features", "Pricing", "FAQ"].map(item => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-[13px] transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="mb-4 text-[11px] font-semibold tracking-widest uppercase" style={{ color: "var(--text-3)" }}>
              Ecosystem
            </h4>
            <ul className="space-y-2.5">
              {["Ethos Network", "Bankr", "Base"].map(item => (
                <li key={item}>
                  <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-[11px] font-semibold tracking-widest uppercase" style={{ color: "var(--text-3)" }}>
              Legal
            </h4>
            <ul className="space-y-2.5">
              {["Terms of Service", "Privacy Policy"].map(item => (
                <li key={item}>
                  <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-8 text-center text-[12px]"
          style={{ borderTop: "1px solid var(--border)", color: "var(--text-3)" }}
        >
          &copy; {new Date().getFullYear()} Ethos IQ. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
