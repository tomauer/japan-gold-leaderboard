import type {
  EBirdChecklistDetail,
  ChecklistTier,
  ScoredChecklist,
  ObserverScore,
  PrefectureScore,
  LeaderboardApiResponse,
} from "@/types";
import { PREFECTURE_MAP } from "./prefectures";

// eBird Status & Trends eligibility criteria (official)
export function isStatusAndTrendsEligible(checklist: EBirdChecklistDetail): boolean {
  if (!checklist.allObsReported) return false;
  if (checklist.protocolId !== "P21" && checklist.protocolId !== "P22") return false;
  const dur = checklist.durationHrs ?? 0;
  if (dur < 0.05 || dur > 8.0) return false; // 3 minutes–8 hours
  if (checklist.protocolId === "P21") {
    const dist = checklist.effortDistanceKm ?? 0;
    if (dist > 10) return false; // ≤10 km for traveling
  }
  // Must have all required metadata fields
  if (!checklist.obsDt) return false;          // start time
  if (!checklist.durationHrs) return false;    // duration
  if (!checklist.protocolId) return false;     // protocol
  if (!checklist.numObservers) return false;   // observer count
  if (checklist.protocolId === "P21" && checklist.effortDistanceKm === undefined) return false; // distance
  return true;
}

const ANONYMOUS_NAMES = new Set(["Anonymous eBirder"]);

// General quality filter applied to full checklist detail responses
export function passesGeneralFilter(checklist: EBirdChecklistDetail): boolean {
  if (!checklist.allObsReported) return false;
  if (checklist.protocolId !== "P21" && checklist.protocolId !== "P22") return false;
  const dur = checklist.durationHrs ?? 0;
  if (dur < 0.05 || dur > 8.0) return false;
  if (checklist.protocolId === "P21") {
    const dist = checklist.effortDistanceKm ?? 0;
    if (dist > 10) return false;
  }
  if (!checklist.numObservers) return false;
  return true;
}

// Submission method codes that indicate eBird Mobile with GPS tracks
const MOBILE_SUBMISSION_CODES = new Set([
  "eBirdAndroid",
  "eBirdiPhone",
  "eBirdMobile",
  "ebird_android",
  "ebird_iphone",
  "ebird_mobile",
  "EBIRD_ANDROID",
  "EBIRD_IOS",
  "EBIRD_IPHONE",
  "EBIRD_MOBILE",
]);

function usesTracks(checklist: EBirdChecklistDetail): boolean {
  if (!checklist.submissionMethodCode) return false;
  const code = checklist.submissionMethodCode;
  if (MOBILE_SUBMISSION_CODES.has(code)) return true;
  // Fallback: case-insensitive check for common substrings
  const lower = code.toLowerCase();
  return (
    lower.includes("android") ||
    lower.includes("iphone") ||
    lower.includes("ios") ||
    lower.includes("mobile")
  );
}

function hasNoXCounts(checklist: EBirdChecklistDetail): boolean {
  if (!checklist.obs || checklist.obs.length === 0) return false;
  return checklist.obs.every((obs) => {
    const str = obs.howManyStr?.trim();
    if (!str) return false;
    if (str.toUpperCase() === "X") return false;
    return !isNaN(Number(str));
  });
}

export function classifyChecklist(checklist: EBirdChecklistDetail): ChecklistTier {
  const tracks = usesTracks(checklist);
  const noX = hasNoXCounts(checklist);
  const dur = checklist.durationHrs ?? 0;
  const dist = checklist.effortDistanceKm ?? 0;

  // Gold: tracks + no-X + 3min–1hr + 0–2km
  if (
    tracks &&
    noX &&
    dur >= 0.05 &&
    dur <= 1.0 &&
    dist >= 0 &&
    dist <= 2.0
  ) {
    return "gold";
  }

  // Silver: tracks + no-X + 1hr–3hr + 2–4km
  if (
    tracks &&
    noX &&
    dur > 1.0 &&
    dur <= 3.0 &&
    dist > 2.0 &&
    dist <= 4.0
  ) {
    return "silver";
  }

  return null;
}

export function scoreChecklists(
  checklistsByPrefecture: Map<string, EBirdChecklistDetail[]>
): ScoredChecklist[] {
  const scored: ScoredChecklist[] = [];

  for (const [prefecture, checklists] of Array.from(checklistsByPrefecture.entries())) {
    for (const checklist of checklists) {
      if (!passesGeneralFilter(checklist)) continue;
      const tier = classifyChecklist(checklist);
      if (tier) {
        scored.push({ checklist, tier, prefecture });
      }
    }
  }

  return scored;
}

export function buildLeaderboard(
  scored: ScoredChecklist[]
): Pick<LeaderboardApiResponse, "national" | "byPrefecture" | "prefectureActivity"> {
  const observerMap = new Map<string, ObserverScore>();
  const prefectureMap = new Map<string, PrefectureScore>();

  for (const { checklist, tier, prefecture } of scored) {
    const { userDisplayName, locName } = checklist;
    if (ANONYMOUS_NAMES.has(userDisplayName)) continue;
    // Public eBird API does not return userId; use displayName as the aggregation key
    const userId = checklist.userId ?? userDisplayName;

    // Build observer entry
    let obs = observerMap.get(userId);
    if (!obs) {
      obs = {
        userId,
        displayName: userDisplayName,
        goldCount: 0,
        silverCount: 0,
        totalScore: 0,
        topLocations: [],
        prefectureBreakdown: {},
      };
      observerMap.set(userId, obs);
    }

    if (tier === "gold") {
      obs.goldCount++;
      obs.totalScore += 2;
    } else {
      obs.silverCount++;
      obs.totalScore += 1;
    }

    if (locName && !obs.topLocations.includes(locName)) {
      obs.topLocations.push(locName);
    }

    if (!obs.prefectureBreakdown[prefecture]) {
      obs.prefectureBreakdown[prefecture] = { gold: 0, silver: 0 };
    }
    if (tier === "gold") obs.prefectureBreakdown[prefecture].gold++;
    else obs.prefectureBreakdown[prefecture].silver++;

    // Build prefecture activity entry
    const prefData = PREFECTURE_MAP.get(prefecture);
    if (!prefData) continue;

    let prefEntry = prefectureMap.get(prefecture);
    if (!prefEntry) {
      prefEntry = {
        code: prefecture,
        nameEn: prefData.nameEn,
        nameJa: prefData.nameJa,
        region: prefData.region,
        goldCount: 0,
        silverCount: 0,
        totalChecklists: 0,
        uniqueObservers: 0,
      };
      prefectureMap.set(prefecture, prefEntry);
    }

    prefEntry.totalChecklists++;
    if (tier === "gold") prefEntry.goldCount++;
    else prefEntry.silverCount++;
  }

  // Tally unique observers per prefecture
  const prefObservers = new Map<string, Set<string>>();
  for (const { checklist, prefecture } of scored) {
    if (ANONYMOUS_NAMES.has(checklist.userDisplayName)) continue;
    if (!prefObservers.has(prefecture)) {
      prefObservers.set(prefecture, new Set());
    }
    prefObservers.get(prefecture)!.add(checklist.userId ?? checklist.userDisplayName);
  }
  for (const [code, observers] of Array.from(prefObservers.entries())) {
    const entry = prefectureMap.get(code);
    if (entry) entry.uniqueObservers = observers.size;
  }

  // Rank national leaderboard: gold desc, then silver desc
  const national = Array.from(observerMap.values()).sort((a, b) => {
    if (b.goldCount !== a.goldCount) return b.goldCount - a.goldCount;
    return b.silverCount - a.silverCount;
  });

  // Prefecture leaderboards: same ranking but scoped
  const byPrefecture: Record<string, ObserverScore[]> = {};
  const prefObserverScores = new Map<string, Map<string, ObserverScore>>();

  for (const { checklist, tier, prefecture } of scored) {
    if (ANONYMOUS_NAMES.has(checklist.userDisplayName)) continue;
    const observerKey = checklist.userId ?? checklist.userDisplayName;
    if (!prefObserverScores.has(prefecture)) {
      prefObserverScores.set(prefecture, new Map());
    }
    const prefMap = prefObserverScores.get(prefecture)!;

    let entry = prefMap.get(observerKey);
    if (!entry) {
      entry = {
        userId: observerKey,
        displayName: checklist.userDisplayName,
        goldCount: 0,
        silverCount: 0,
        totalScore: 0,
        topLocations: [],
        prefectureBreakdown: {},
      };
      prefMap.set(observerKey, entry);
    }

    if (tier === "gold") {
      entry.goldCount++;
      entry.totalScore += 2;
    } else {
      entry.silverCount++;
      entry.totalScore += 1;
    }
    if (checklist.locName && !entry.topLocations.includes(checklist.locName)) {
      entry.topLocations.push(checklist.locName);
    }
  }

  for (const [code, prefMap] of Array.from(prefObserverScores.entries())) {
    byPrefecture[code] = Array.from(prefMap.values()).sort(
      (a: ObserverScore, b: ObserverScore) => {
        if (b.goldCount !== a.goldCount) return b.goldCount - a.goldCount;
        return b.silverCount - a.silverCount;
      }
    );
  }

  // Prefecture activity: gold desc, then silver desc
  const prefectureActivity = Array.from(prefectureMap.values()).sort((a, b) => {
    if (b.goldCount !== a.goldCount) return b.goldCount - a.goldCount;
    return b.silverCount - a.silverCount;
  });

  return { national, byPrefecture, prefectureActivity };
}
