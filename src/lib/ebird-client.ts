import type { EBirdChecklistSummary, EBirdChecklistDetail } from "@/types";
import { checklistDetailCache, checklistListCache } from "./checklist-cache";

const EBIRD_BASE = "https://api.ebird.org/v2";
const WINDOW_DAYS = 7;
const MAX_RESULTS = 200;
// Concurrent fetch limit to respect eBird rate limits
const CONCURRENCY = 5;

function getApiKey(): string {
  const key = process.env.EBIRD_API_KEY;
  if (!key) throw new Error("EBIRD_API_KEY environment variable is not set");
  return key;
}

async function ebirdFetch<T>(path: string): Promise<T> {
  const url = `${EBIRD_BASE}${path}`;
  const res = await fetch(url, {
    headers: { "X-eBirdApiToken": getApiKey() },
  });

  if (!res.ok) {
    if (res.status === 404) return [] as unknown as T;
    throw new Error(`eBird API ${res.status}: ${url}`);
  }

  return res.json() as Promise<T>;
}

// Process an array of items with bounded concurrency
async function pMap<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency: number
): Promise<R[]> {
  const results: R[] = [];
  let index = 0;

  async function worker(): Promise<void> {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i]);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

export async function fetchPrefectureChecklistSummaries(
  regionCode: string
): Promise<EBirdChecklistSummary[]> {
  const cacheKey = `list:${regionCode}`;
  const cached = checklistListCache.get(cacheKey);
  if (cached !== null) return cached;

  try {
    const summaries = await ebirdFetch<EBirdChecklistSummary[]>(
      `/product/lists/${regionCode}?maxResults=${MAX_RESULTS}`
    );
    checklistListCache.set(cacheKey, summaries);
    return summaries;
  } catch {
    return [];
  }
}

export async function fetchChecklistDetail(
  subId: string
): Promise<EBirdChecklistDetail | null> {
  const cached = checklistDetailCache.get(subId);
  if (cached !== null) return cached;

  try {
    const detail = await ebirdFetch<EBirdChecklistDetail>(
      `/product/checklist/view/${subId}`
    );
    if (detail && detail.subId) {
      checklistDetailCache.set(subId, detail);
    }
    return detail;
  } catch {
    return null;
  }
}

function isWithinWindow(dateStr: string): boolean {
  // dateStr is "2026-05-02 17:55" format (isoObsDate from list, obsDt from detail)
  const obsDate = new Date(dateStr.replace(" ", "T"));
  if (isNaN(obsDate.getTime())) return true; // can't parse → let through, filter in detail
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - WINDOW_DAYS);
  return obsDate >= cutoff;
}

// Light pre-filter on summaries: only date check (quality fields aren't in the list response)
export function preFilterSummary(s: EBirdChecklistSummary): boolean {
  const dateStr = s.isoObsDate ?? s.obsDt;
  if (dateStr && !isWithinWindow(dateStr)) return false;
  return true;
}

export async function fetchAndFilterPrefecture(regionCode: string): Promise<EBirdChecklistDetail[]> {
  const summaries = await fetchPrefectureChecklistSummaries(regionCode);
  const eligible = summaries.filter(preFilterSummary);

  const details = await pMap(
    eligible,
    async (s) => fetchChecklistDetail(s.subId),
    CONCURRENCY
  );

  return details.filter((d): d is EBirdChecklistDetail => d !== null);
}

export async function fetchAllPrefectures(
  prefectureCodes: string[],
  onProgress?: (code: string, done: number, total: number) => void
): Promise<Map<string, EBirdChecklistDetail[]>> {
  const result = new Map<string, EBirdChecklistDetail[]>();
  let done = 0;

  // Process prefectures in batches to avoid flooding the API
  await pMap(
    prefectureCodes,
    async (code) => {
      const details = await fetchAndFilterPrefecture(code);
      result.set(code, details);
      done++;
      onProgress?.(code, done, prefectureCodes.length);
    },
    3 // process 3 prefectures at a time
  );

  return result;
}
