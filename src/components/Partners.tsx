import Image from "next/image";

const partners = [
  { name: "Ethos", logo: "/logos/ethos.svg" },
  { name: "Bankr", logo: "/logos/bankr.svg" },
  { name: "Base", logo: "/logos/base.svg" },
  { name: "Privy", logo: "/logos/privy.svg" },
  { name: "Claude", logo: "/logos/claude.svg" },
];

export default function Partners() {
  return (
    <section className="border-y border-white/5 bg-dark-surface px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <p className="mb-8 text-center text-sm font-medium tracking-widest text-gray-500 uppercase">
          Powered By
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center gap-2 text-gray-500 transition-colors hover:text-gray-300"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={100}
                height={32}
                className="h-8 w-auto opacity-50 grayscale transition-all hover:opacity-80 hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
