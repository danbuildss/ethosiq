import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { address } = await req.json();

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  try {
    const userRes = await fetch(
      "https://api.ethos.network/api/v2/users/by/address",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Ethos-Client": "ethos-iq@1.0.0",
        },
        body: JSON.stringify({ addresses: [address] }),
      }
    );

    if (!userRes.ok) {
      const text = await userRes.text();
      return NextResponse.json(
        { error: "Ethos API error", details: text },
        { status: userRes.status }
      );
    }

    const users = await userRes.json();

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: "No Ethos profile found for this address" },
        { status: 404 }
      );
    }

    const user = users[0];

    return NextResponse.json({
      profileId: user.profileId,
      displayName: user.displayName,
      username: user.username,
      avatarUrl: user.avatarUrl,
      description: user.description,
      score: user.score,
      status: user.status,
      xpTotal: user.xpTotal,
      influenceFactor: user.influenceFactor,
      influenceFactorPercentile: user.influenceFactorPercentile,
      stats: user.stats,
      links: user.links,
    });
  } catch (error) {
    console.error("Ethos score fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Ethos data" },
      { status: 500 }
    );
  }
}
