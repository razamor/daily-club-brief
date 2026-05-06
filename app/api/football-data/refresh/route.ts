import { NextResponse } from "next/server";
import { refreshFootballSnapshot } from "@/lib/footballData";

export const dynamic = "force-dynamic";

// Scheduled refresh endpoint. Vercel Cron calls this route twice per day from
// vercel.json, while local development can hit it manually to warm the cache.
export async function GET() {
  const snapshot = await refreshFootballSnapshot();

  return NextResponse.json({
    ok: true,
    updatedAt: snapshot.updatedAt,
    hasLiveMatches: snapshot.hasLiveMatches,
    servedFromCache: snapshot.servedFromCache
  });
}
