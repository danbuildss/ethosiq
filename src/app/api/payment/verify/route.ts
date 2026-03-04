import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const { txHash, privyUserId, plan } = await req.json();

  if (!txHash || !privyUserId) {
    return NextResponse.json({ error: "txHash and privyUserId required" }, { status: 400 });
  }

  // Verify tx on Base via public RPC
  try {
    const rpcRes = await fetch("https://mainnet.base.org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getTransactionReceipt",
        params: [txHash],
        id: 1,
      }),
    });

    const rpcData = await rpcRes.json();
    const receipt = rpcData?.result;

    if (!receipt) {
      return NextResponse.json({ error: "Transaction not found. It may still be pending." }, { status: 400 });
    }

    if (receipt.status !== "0x1") {
      return NextResponse.json({ error: "Transaction failed on-chain." }, { status: 400 });
    }

    // Get user
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("privy_user_id", privyUserId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Set subscription expiry (30 days for core)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Update user plan + create subscription record
    await Promise.all([
      supabase.from("users").update({ plan: "core" }).eq("id", user.id),
      supabase.from("subscriptions").insert({
        user_id: user.id,
        plan: plan || "core",
        status: "active",
        payment_tx: txHash,
        payment_chain: "base",
        expires_at: expiresAt.toISOString(),
      }),
    ]);

    return NextResponse.json({ success: true, plan: "core", expiresAt: expiresAt.toISOString() });
  } catch {
    return NextResponse.json({ error: "Failed to verify transaction." }, { status: 500 });
  }
}
