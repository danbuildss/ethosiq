import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/*
 * SQL MIGRATION — run in Supabase SQL editor before deploying:
 *
 * ALTER TABLE users
 *   ADD COLUMN IF NOT EXISTS checkin_streak integer DEFAULT 0,
 *   ADD COLUMN IF NOT EXISTS last_checkin_at timestamptz,
 *   ADD COLUMN IF NOT EXISTS iq_points integer DEFAULT 0,
 *   ADD COLUMN IF NOT EXISTS longest_streak integer DEFAULT 0;
 *
 * See also: /supabase/migration-streak.sql
 */

const POINTS_PER_CHECKIN = 10;
const STREAK_BONUS_THRESHOLD = 7; // 7-day streak = bonus
const STREAK_BONUS_POINTS = 25;

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const { privyUserId } = await req.json();

  if (!privyUserId) {
    return NextResponse.json({ error: "privyUserId required" }, { status: 400 });
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("id, checkin_streak, last_checkin_at, iq_points, longest_streak")
    .eq("privy_user_id", privyUserId)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const now = new Date();
  const lastCheckin = user.last_checkin_at ? new Date(user.last_checkin_at) : null;

  // Check if already claimed today (UTC day)
  if (lastCheckin) {
    const lastDay = lastCheckin.toISOString().split("T")[0];
    const today = now.toISOString().split("T")[0];
    if (lastDay === today) {
      return NextResponse.json({
        alreadyClaimed: true,
        streak: user.checkin_streak,
        iqPoints: user.iq_points,
        message: "Already claimed today. Come back tomorrow!",
      });
    }
  }

  // Calculate new streak
  let newStreak = 1;
  if (lastCheckin) {
    const hoursSince = (now.getTime() - lastCheckin.getTime()) / (1000 * 60 * 60);
    if (hoursSince <= 48) {
      // Within 48h = streak continues (allows for timezone flexibility)
      newStreak = (user.checkin_streak || 0) + 1;
    }
    // else streak resets to 1
  }

  // Calculate points
  let pointsEarned = POINTS_PER_CHECKIN;
  let bonusMessage = "";
  if (newStreak % STREAK_BONUS_THRESHOLD === 0) {
    pointsEarned += STREAK_BONUS_POINTS;
    bonusMessage = `${STREAK_BONUS_THRESHOLD}-day streak bonus! +${STREAK_BONUS_POINTS} extra IQ points.`;
  }

  const newIqPoints = (user.iq_points || 0) + pointsEarned;
  const newLongestStreak = Math.max(user.longest_streak || 0, newStreak);

  await supabase
    .from("users")
    .update({
      checkin_streak: newStreak,
      last_checkin_at: now.toISOString(),
      iq_points: newIqPoints,
      longest_streak: newLongestStreak,
    })
    .eq("id", user.id);

  return NextResponse.json({
    success: true,
    streak: newStreak,
    iqPoints: newIqPoints,
    pointsEarned,
    bonusMessage,
    longestStreak: newLongestStreak,
  });
}

export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(req.url);
  const privyUserId = searchParams.get("privyUserId");

  if (!privyUserId) {
    return NextResponse.json({ error: "privyUserId required" }, { status: 400 });
  }

  const { data: user } = await supabase
    .from("users")
    .select("checkin_streak, last_checkin_at, iq_points, longest_streak")
    .eq("privy_user_id", privyUserId)
    .single();

  if (!user) return NextResponse.json({ streak: 0, iqPoints: 0 });

  const now = new Date();
  const lastCheckin = user.last_checkin_at ? new Date(user.last_checkin_at) : null;
  const today = now.toISOString().split("T")[0];
  const lastDay = lastCheckin?.toISOString().split("T")[0];
  const claimedToday = lastDay === today;

  return NextResponse.json({
    streak: user.checkin_streak || 0,
    iqPoints: user.iq_points || 0,
    longestStreak: user.longest_streak || 0,
    claimedToday,
    lastCheckin: user.last_checkin_at,
  });
}
