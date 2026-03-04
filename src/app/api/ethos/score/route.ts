import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractSocials(user: any, profileData: any) {
  // Try direct fields first
  let twitter = user.twitterHandle || user.twitter || null;
  let farcaster = user.farcasterHandle || user.farcaster || null;
  let discord = user.discordHandle || user.discord || null;

  // Ethos username is usually the Twitter handle
  if (!twitter && user.username) twitter = user.username;

  // Try links array (Ethos v1 format)
  const accounts: { service?: string; type?: string; handle?: string; username?: string; name?: string }[] =
    profileData?.accounts ||
    profileData?.linkedAccounts ||
    profileData?.socials ||
    user.links?.accounts ||
    [];

  if (Array.isArray(accounts)) {
    for (const acc of accounts) {
      const service = (acc.service || acc.type || "").toLowerCase();
      const handle = acc.handle || acc.username || acc.name || "";
      if (service.includes("twitter") || service.includes("x")) twitter = twitter || handle;
      if (service.includes("farcaster")) farcaster = farcaster || handle;
      if (service.includes("discord")) discord = discord || handle;
    }
  }

  // Try links object (key-value format)
  const linksObj = profileData?.links || user.links || {};
  if (typeof linksObj === "object" && !Array.isArray(linksObj)) {
    if (!twitter && linksObj.twitter) twitter = typeof linksObj.twitter === "string" ? linksObj.twitter : linksObj.twitter?.handle || linksObj.twitter?.username;
    if (!farcaster && linksObj.farcaster) farcaster = typeof linksObj.farcaster === "string" ? linksObj.farcaster : linksObj.farcaster?.handle || linksObj.farcaster?.username;
    if (!discord && linksObj.discord) discord = typeof linksObj.discord === "string" ? linksObj.discord : linksObj.discord?.handle || linksObj.discord?.username;
  }

  // Strip @ prefix if present
  if (twitter?.startsWith("@")) twitter = twitter.slice(1);
  if (farcaster?.startsWith("@")) farcaster = farcaster.slice(1);
  if (discord?.startsWith("@")) discord = discord.slice(1);

  return { twitter, farcaster, discord };
}

async function fetchEthosScore(address: string) {
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

  // Fetch full profile for linked accounts / social data
  let profileData = null;
  if (user.profileId) {
    try {
      const profileRes = await fetch(
        `https://api.ethos.network/api/v1/profiles/${user.profileId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Ethos-Client": "ethos-iq@1.0.0",
          },
        }
      );
      if (profileRes.ok) {
        const raw = await profileRes.json();
        // Handle both {data: ...} and direct object responses
        profileData = raw?.data || raw;
      }
    } catch { /* non-fatal */ }
  }

  const socials = extractSocials(user, profileData);

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
    twitterHandle: socials.twitter,
    discordHandle: socials.discord,
    farcasterHandle: socials.farcaster,
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  if (!address) return NextResponse.json({ error: "Address is required" }, { status: 400 });
  try {
    return await fetchEthosScore(address);
  } catch {
    return NextResponse.json({ error: "Failed to fetch Ethos data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { address } = await req.json();
  if (!address) return NextResponse.json({ error: "Address is required" }, { status: 400 });
  try {
    return await fetchEthosScore(address);
  } catch {
    return NextResponse.json({ error: "Failed to fetch Ethos data" }, { status: 500 });
  }
}
