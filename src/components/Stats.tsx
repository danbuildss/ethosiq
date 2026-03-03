const stats = [
  { label: "Wallets Analyzed", value: "—" },
  { label: "Avg. Score Improvement", value: "—" },
  { label: "ETH Vouched Tracked", value: "—" },
];

export default function Stats() {
  return (
    <section className="border-y border-gray-200 bg-gray-50 px-6 py-16">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-gradient font-serif text-4xl font-bold md:text-5xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm font-medium tracking-wide text-gray-500 uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
