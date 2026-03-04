import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const { code, privyUserId } = await req.json();

  if (!code || !privyUserId) {
    return NextResponse.json({ error: "code and privyUserId required" }, { status: 400 });
  }

  // Find trial code
  const { data: trialCode, error: codeError } = await supabase
    .from("trial_codes")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .is("used_by", null)
    .single();

  if (codeError || !trialCode) {
    return NextResponse.json({ error: "Invalid or already used code" }, { status: 400 });
  }

  // Check expiry
  if (new Date(trialCode.expires_at) < new Date()) {
    return NextResponse.json({ error: "This code has expired" }, { status: 400 });
  }

  // Get user
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, plan")
    .eq("privy_user_id", privyUserId)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: "User not found. Please connect your wallet first." }, { status: 404 });
  }

  if (user.plan === "core") {
    return NextResponse.json({ error: "You already have Core Coaching." }, { status: 400 });
  }

  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 7);

  // Mark code as used + upgrade user to trial
  await Promise.all([
    supabase.from("trial_codes").update({ used_by: user.id, used_at: new Date().toISOString() }).eq("id", trialCode.id),
    supabase.from("users").update({ plan: "trial", trial_activated_at: new Date().toISOString(), trial_expires_at: trialEnd.toISOString() }).eq("id", user.id),
    supabase.from("subscriptions").insert({ user_id: user.id, plan: "trial", status: "active", expires_at: trialEnd.toISOString() }),
  ]);

  return NextResponse.json({ success: true, trialExpiresAt: trialEnd.toISOString() });
}
