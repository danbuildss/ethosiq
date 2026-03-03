import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { profileId } = await req.json();

  if (!profileId) {
    return NextResponse.json(
      { error: "profileId is required" },
      { status: 400 }
    );
  }

  try {
    const [vouchesGiven, vouchesReceived, mostCredible, mutual] =
      await Promise.all([
        fetch("https://api.ethos.network/api/v1/vouches", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Ethos-Client": "ethos-iq@1.0.0",
          },
          body: JSON.stringify({
            authorProfileIds: [profileId],
            archived: false,
            limit: 50,
            offset: 0,
          }),
        }).then((r) => r.json()),

        fetch("https://api.ethos.network/api/v1/vouches", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Ethos-Client": "ethos-iq@1.0.0",
          },
          body: JSON.stringify({
            subjectProfileIds: [profileId],
            archived: false,
            limit: 50,
            offset: 0,
          }),
        }).then((r) => r.json()),

        fetch(
          "https://api.ethos.network/api/v1/vouches/most-credible-vouchers",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Ethos-Client": "ethos-iq@1.0.0",
            },
            body: JSON.stringify({
              userkey: `profileId:${profileId}`,
              limit: 10,
            }),
          }
        ).then((r) => r.json()),

        fetch("https://api.ethos.network/api/v1/vouches/mutual", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Ethos-Client": "ethos-iq@1.0.0",
          },
          body: JSON.stringify({
            userkey: `profileId:${profileId}`,
          }),
        }).then((r) => r.json()),
      ]);

    return NextResponse.json({
      given: vouchesGiven,
      received: vouchesReceived,
      mostCredible,
      mutual,
    });
  } catch (error) {
    console.error("Ethos vouches fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch vouch data" },
      { status: 500 }
    );
  }
}
