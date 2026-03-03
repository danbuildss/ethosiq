import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ethos IQ — AI Reputation Coach for Web3",
  description:
    "Your Ethos score explained. Personalized coaching to build trust, grow credibility, and recover reputation onchain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
