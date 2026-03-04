import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface CoachingRequest {
  score: number;
  tier: string;
  reviews: { positive: number; neutral: number; negative: number };
  vouchesReceived: number;
  vouchesGiven: number;
  mutualVouches: number;
  xpTotal: number;
  influenceFactor: number;
  walletAddress?: string;
}

async function pollJob(jobId: string, maxAttempts = 15): Promise<string | null> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const res = await fetch(`https://api.bankr.bot/agent/job/${jobId}`, {
      headers: { "X-API-Key": process.env.BANKR_API_KEY! },
    });
    const data = await res.json();
    if (data.status === "completed") return data.response;
    if (data.status === "failed" || data.status === "cancelled") return null;
  }
  return null;
}

export async function POST(req: NextRequest) {
  const body: CoachingRequest = await req.json();
  const { score, tier, reviews, vouchesReceived, vouchesGiven, mutualVouches, xpTotal, influenceFactor } = body;

  const totalReviews = reviews.positive + reviews.neutral + reviews.negative;
  const positiveRate = totalReviews > 0 ? Math.round((reviews.positive / totalReviews) * 100) : 0;

  const prompt = `You are an Ethos Network reputation coach. Analyze this user's onchain credibility profile and give ONE specific, actionable coaching recommendation in 1-2 sentences. Be direct and specific — no generic advice.

Profile data:
- Credibility Score: ${score} (${tier} tier)
- Reviews received: ${totalReviews} total, ${positiveRate}% positive (${reviews.positive} positive, ${reviews.negative} negative, ${reviews.neutral} neutral)
- Vouches received: ${vouchesReceived}
- Vouches given: ${mutualVouches} mutual (3,3)
- XP: ${xpTotal}
- Influence factor: ${influenceFactor}

Give ONE specific action they should take TODAY to improve their score. Reference their actual numbers. Keep it under 40 words.`;

  try {
    const submitRes = await fetch("https://api.bankr.bot/agent/prompt", {
      method: "POST",
      headers: {
        "X-API-Key": process.env.BANKR_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!submitRes.ok) throw new Error("Failed to submit prompt");

    const { jobId } = await submitRes.json();
    const response = await pollJob(jobId);

    if (!response) throw new Error("No response from agent");

    return NextResponse.json({ coaching: response });
  } catch {
    // Fallback to rule-based coaching
    let fallback = "";
    if (score < 800) fallback = `Your score of ${score} is critically low. Focus on getting vouches from credible wallets — even small amounts build trust quickly.`;
    else if (reviews.negative > reviews.positive) fallback = `With ${reviews.negative} negative reviews outweighing your ${reviews.positive} positive ones, reach out to trusted collaborators for honest positive reviews this week.`;
    else if (vouchesReceived < 3) fallback = `You only have ${vouchesReceived} vouches. Identify 3 credible builders in your network and ask them to vouch for you — this is the fastest way to move your score.`;
    else if (vouchesGiven === 0) fallback = `You haven't vouched for anyone yet. Vouch for 2-3 trusted builders to start mutual credibility chains — (3,3) vouches boost both scores.`;
    else if (score < 1600) fallback = `You're in the Known tier at ${score}. One more positive review from a high-credibility wallet could push you into Reputable.`;
    else fallback = `Strong profile at ${score}. Maintain it by staying active — review builders and keep your vouches healthy.`;

    return NextResponse.json({ coaching: fallback, fallback: true });
  }
}
