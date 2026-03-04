import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// POST — upsert user on login
export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const { privyUserId, walletAddress, email, twitterHandle, twitterId } = await req.json();

  if (!privyUserId) {
    return NextResponse.json({ error: "privyUserId required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("users")
    .upsert({
      privy_user_id: privyUserId,
      wallet_address: walletAddress || null,
      email: email || null,
      twitter_handle: twitterHandle || null,
      twitter_id: twitterId || null,
      last_seen_at: new Date().toISOString(),
    }, { onConflict: "privy_user_id" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ user: data });
}

// GET — get user plan/status
export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const privyUserId = req.nextUrl.searchParams.get("privyUserId");

  if (!privyUserId) {
    return NextResponse.json({ error: "privyUserId required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("*, subscriptions(*)")
    .eq("privy_user_id", privyUserId)
    .single();

  if (error) return NextResponse.json({ plan: "free" });
  return NextResponse.json({ user: data, plan: data.plan });
}
