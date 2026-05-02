import type { EBirdChecklistDetail, EBirdChecklistSummary, LeaderboardApiResponse } from "@/types";

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class TTLCache<T> {
  private store = new Map<string, CacheEntry<T>>();

  constructor(private ttlMs: number) {}

  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data;
  }

  set(key: string, value: T): void {
    this.store.set(key, { data: value, expiresAt: Date.now() + this.ttlMs });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  size(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  // Remove all expired entries
  prune(): number {
    const now = Date.now();
    let pruned = 0;
    for (const [key, entry] of Array.from(this.store.entries())) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
        pruned++;
      }
    }
    return pruned;
  }
}

// Checklist details cached for 7 days — they don't change once submitted
export const checklistDetailCache = new TTLCache<EBirdChecklistDetail>(
  7 * 24 * 60 * 60 * 1000
);

// Prefecture checklist lists cached for 1 hour — refresh frequently
export const checklistListCache = new TTLCache<EBirdChecklistSummary[]>(60 * 60 * 1000);

// Full leaderboard result cached for 1 hour
export const leaderboardCache = new TTLCache<LeaderboardApiResponse>(60 * 60 * 1000);
