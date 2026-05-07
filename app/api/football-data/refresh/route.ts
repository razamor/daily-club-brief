import { NextResponse } from "next/server";
import { refreshFootballSnapshot } from "@/lib/footballData";

export const dynamic = "force-dynamic";

// Scheduled refresh endpoint. Vercel Cron calls this route twice per day from
// vercel.json, while local development can hit it manually to warm the cache.
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET is not configured on the server." },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized refresh request." },
      { status: 401 }
    );
  }

  const snapshot = await refreshFootballSnapshot();

  return NextResponse.json({
    ok: true,
    updatedAt: snapshot.updatedAt,
    hasLiveMatches: snapshot.hasLiveMatches,
    servedFromCache: snapshot.servedFromCache
  });
}
