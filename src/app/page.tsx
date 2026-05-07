import { AppShell } from "@/components/AppShell";
import { PREFECTURES } from "@/lib/prefectures";
import { fetchAllPrefectures } from "@/lib/ebird-client";
import { scoreChecklists, buildLeaderboard, isStatusAndTrendsEligible } from "@/lib/filtering";
import type { LeaderboardApiResponse } from "@/types";

export default async function HomePage() {
  const data = await fetchLeaderboardData();
  return <AppShell initialData={data} />;
}

async function fetchLeaderboardData(): Promise<LeaderboardApiResponse> {
  const prefectureCodes = PREFECTURES.map((p) => p.code);
  const checklistsByPrefecture = await fetchAllPrefectures(prefectureCodes);

  const scored = scoreChecklists(checklistsByPrefecture);
  const { national, byPrefecture, prefectureActivity } = buildLeaderboard(scored);

  const allDetails = Array.from(checklistsByPrefecture.values()).flat();
  const stCount = allDetails.filter(isStatusAndTrendsEligible).length;

  return {
    national,
    byPrefecture,
    prefectureActivity,
    lastUpdated: new Date().toISOString(),
    challengePeriod: "5/9〜5/17",
    totalChecklistsProcessed: allDetails.length,
    totalGoldChecklists: scored.filter((s) => s.tier === "gold").length,
    totalSilverChecklists: scored.filter((s) => s.tier === "silver").length,
    totalStatusAndTrendsChecklists: stCount,
    cacheHit: false,
  };
}
