import { NextResponse } from "next/server";
import { getFootballSnapshot } from "@/lib/footballData";

export const dynamic = "force-dynamic";

// Frontend cache endpoint. Components call this route, and this route decides
// whether to serve the server cache or refresh live scores every 60 seconds.
export async function GET() {
  const snapshot = await getFootballSnapshot();

  return NextResponse.json(snapshot);
}
