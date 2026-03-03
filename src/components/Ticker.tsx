const items = [
  { name: "vitalik.eth", value: "+2,840 ★", type: "score" },
  { name: "Top vouches", value: "↑ This week", type: "label" },
  { name: "danbuildss", value: "1,491 ≡ analyzed", type: "analysis" },
  { name: "whateverman✨", value: "+53 ★", type: "score" },
  { name: "beans.eth", value: "+2,266 ★", type: "score" },
  { name: "Top contributions", value: "Epoch reward →", type: "label" },
  { name: "saifmr.eth", value: "3 positive reviews", type: "review" },
  { name: "airev.eth", value: "0.489e vouched", type: "vouch" },
  { name: "0x4f2a…9D25", value: "+820 ★", type: "score" },
  { name: "majdi | Σ:", value: "0.12e vouched", type: "vouch" },
  { name: "serpin.taxt", value: "+1,538 ★", type: "score" },
  { name: "Base", value: "98.5% positive →", type: "label" },
  { name: "abstract.eth", value: "89.3% positive", type: "review" },
  { name: "rabby wallet", value: "31 positive reviews", type: "review" },
];

export default function Ticker() {
  const doubled = [...items, ...items];

  return (
    <div
      className="overflow-hidden py-2.5"
      style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="ticker-inner items-center gap-0">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center shrink-0">
            <span
              className="text-[13px] font-medium"
              style={{ color: item.type === "label" ? "var(--blue)" : "rgba(255,255,255,0.55)" }}
            >
              {item.name}
            </span>
            <span
              className="text-[13px] ml-1.5"
              style={{
                color:
                  item.type === "review" ? "var(--green)" :
                  item.type === "vouch"  ? "var(--blue)"  :
                  item.type === "label"  ? "rgba(255,255,255,0.4)" :
                  "rgba(255,255,255,0.7)",
              }}
            >
              {item.value}
            </span>
            <span
              className="mx-5 text-[13px] select-none"
              style={{ color: "rgba(255,255,255,0.12)" }}
            >
              •
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
