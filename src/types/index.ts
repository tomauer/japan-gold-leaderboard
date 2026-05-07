// eBird API v2 response types

export interface EBirdChecklistSummary {
  subId: string;
  subID?: string; // alternate casing from API
  userDisplayName: string;
  userId?: string; // not present in public API responses
  numSpecies: number;
  obsDt: string; // "2 May 2026" format in list endpoint
  isoObsDate?: string; // "2026-05-02 17:55" format — use this for date math
  obsTime?: string;
  // These fields are only in the detail response, NOT in the list summary:
  protocolId?: string;
  allObsReported?: boolean;
  durationHrs?: number;
  numObservers?: number;
  effortDistanceKm?: number;
  effortDistanceEnteredUnit?: string;
  locId?: string;
  locName?: string;
  subnational1Code?: string;
  lat?: number;
  lng?: number;
  checklistId?: string;
  loc?: {
    locId: string;
    name: string;
    locName: string;
    lat: number;
    lng: number;
    subnational1Code: string;
    subnational2Code?: string;
  };
}

export interface EBirdObservation {
  speciesCode: string;
  howManyStr: string;
  present?: boolean;
}

export interface EBirdChecklistDetail extends EBirdChecklistSummary {
  obs: EBirdObservation[];
  submissionMethodCode?: string;
  submissionMethodVersion?: string;
  projId?: string;
  creationDt?: string;
  lastEditedDt?: string;
}

// Tier classification

export type ChecklistTier = "gold" | "silver" | null;

export interface ScoredChecklist {
  checklist: EBirdChecklistDetail;
  tier: ChecklistTier;
  prefecture: string;
}

// Leaderboard aggregations

export interface ObserverScore {
  userId: string; // userDisplayName used as key when API doesn't return userId
  displayName: string;
  goldCount: number;
  silverCount: number;
  totalScore: number; // gold*2 + silver*1
  topLocations: string[];
  prefectureBreakdown: Record<string, { gold: number; silver: number }>;
}

export interface PrefectureScore {
  code: string;
  nameEn: string;
  nameJa: string;
  region: JapanRegion;
  goldCount: number;
  silverCount: number;
  totalChecklists: number;
  uniqueObservers: number;
}

export type JapanRegion =
  | "Hokkaido"
  | "Tohoku"
  | "Kanto"
  | "Chubu"
  | "Kinki"
  | "Chugoku"
  | "Shikoku"
  | "Kyushu"
  | "Okinawa";

export interface Prefecture {
  code: string; // e.g. "JP-13"
  nameEn: string;
  nameJa: string;
  region: JapanRegion;
}

// API response shapes

export interface LeaderboardApiResponse {
  national: ObserverScore[];
  byPrefecture: Record<string, ObserverScore[]>;
  prefectureActivity: PrefectureScore[];
  lastUpdated: string;
  challengePeriod: string;
  totalChecklistsProcessed: number;
  totalGoldChecklists: number;
  totalSilverChecklists: number;
  totalStatusAndTrendsChecklists: number;
  cacheHit: boolean;
}

export interface FetchProgressEvent {
  prefecture: string;
  fetched: number;
  total: number;
}

// UI state

export type ViewMode = "national" | "prefecture" | "activity";

export interface AppState {
  view: ViewMode;
  selectedPrefecture: string | null; // JP-XX code
}
