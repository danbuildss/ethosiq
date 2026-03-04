import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch("https://api.bankr.bot/agent/info", {
      headers: {
        "X-API-Key": process.env.BANKR_API_KEY!,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      // Fallback: return hardcoded wallet for now
      return NextResponse.json({
        wallet: null,
        error: "Could not fetch wallet from Bankr"
      });
    }

    const data = await res.json();
    // Bankr returns wallet info — extract the Base/EVM wallet address
    const wallet = data?.wallets?.find((w: { chain: string }) => w.chain === "base" || w.chain === "ethereum")
      || data?.wallet
      || data?.address
      || null;

    return NextResponse.json({ wallet, raw: data });
  } catch {
    return NextResponse.json({ wallet: null, error: "Failed to fetch wallet" });
  }
}
