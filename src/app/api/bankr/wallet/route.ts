import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch("https://api.bankr.bot/agent/me", {
      headers: {
        "X-API-Key": process.env.BANKR_API_KEY!,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({
        wallet: null,
        error: "Could not fetch wallet from Bankr"
      });
    }

    const data = await res.json();
    // Find EVM wallet (used on Base)
    const evmWallet = data?.wallets?.find(
      (w: { chain: string; address: string }) =>
        w.chain === "evm" || w.chain === "base" || w.chain === "ethereum"
    );

    return NextResponse.json({
      wallet: evmWallet || null,
      address: evmWallet?.address || null,
    });
  } catch {
    return NextResponse.json({ wallet: null, error: "Failed to fetch wallet" });
  }
}
