import { NextResponse } from "next/server";
import { PREFECTURES } from "@/lib/prefectures";
import { fetchAllPrefectures } from "@/lib/ebird-client";
import { scoreChecklists, buildLeaderboard, isStatusAndTrendsEligible } from "@/lib/filtering";
import { leaderboardCache } from "@/lib/checklist-cache";
import type { EBirdChecklistDetail, LeaderboardApiResponse } from "@/types";

export const dynamic = "force-dynamic";
// Allow up to 5 minutes for the full dataset fetch
export const maxDuration = 300;

const CACHE_KEY = "leaderboard:full";

export async function GET(request: Request): Promise<NextResponse> {
  const apiKey = process.env.EBIRD_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server configuration error: EBIRD_API_KEY not set" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("refresh") === "1";

  // Return cached leaderboard if available (skip if force-refresh requested)
  if (!forceRefresh) {
    const cached = leaderboardCache.get(CACHE_KEY);
    if (cached !== null) {
      return NextResponse.json({ ...(cached as LeaderboardApiResponse), cacheHit: true });
    }
  }

  const prefectureCodes = PREFECTURES.map((p) => p.code);

  let checklistsByPrefecture: Map<string, EBirdChecklistDetail[]>;
  try {
    checklistsByPrefecture = await fetchAllPrefectures(prefectureCodes);
  } catch (err) {
    console.error("Failed to fetch eBird data:", err);
    return NextResponse.json(
      { error: "Failed to fetch data from eBird API" },
      { status: 502 }
    );
  }

  const scored = scoreChecklists(checklistsByPrefecture);
  const { national, byPrefecture, prefectureActivity } = buildLeaderboard(scored);

  const allDetails = Array.from(checklistsByPrefecture.values()).flat();
  const totalChecklists = allDetails.length;
  const stCount = allDetails.filter(isStatusAndTrendsEligible).length;

  const response: LeaderboardApiResponse = {
    national,
    byPrefecture,
    prefectureActivity,
    lastUpdated: new Date().toISOString(),
    windowDays: 7,
    totalChecklistsProcessed: totalChecklists,
    totalGoldChecklists: scored.filter((s) => s.tier === "gold").length,
    totalSilverChecklists: scored.filter((s) => s.tier === "silver").length,
    totalStatusAndTrendsChecklists: stCount,
    cacheHit: false,
  };

  leaderboardCache.set(CACHE_KEY, response);

  return NextResponse.json(response);
}
