"use client";

import { MapPin, Trophy, TrendingUp } from "lucide-react";
import { REGION_NAMES_JA } from "@/lib/prefectures";
import type { JapanRegion } from "@/types";
import { MedalBadge } from "./MedalBadge";
import type { LeaderboardApiResponse, PrefectureScore } from "@/types";

interface PrefectureActivityLeaderboardProps {
  data: LeaderboardApiResponse;
  onSelectPrefecture: (code: string) => void;
}

const REGION_COLORS: Record<string, { bg: string; text: string }> = {
  Hokkaido: { bg: "#B4CFE1", text: "#2e261f" },
  Tohoku: { bg: "#CFEBBF", text: "#2e261f" },
  Kanto: { bg: "#FFDD00", text: "#2e261f" },
  Chubu: { bg: "#D9EB6F", text: "#2e261f" },
  Kinki: { bg: "#FFA380", text: "#2e261f" },
  Chugoku: { bg: "#e5e3dc", text: "#2e261f" },
  Shikoku: { bg: "#b4cfe1", text: "#2e261f" },
  Kyushu: { bg: "#FF9417", text: "#2e261f" },
  Okinawa: { bg: "#69A0C2", text: "#ffffff" },
};

function RegionChip({ region }: { region: string }) {
  const style = REGION_COLORS[region] ?? { bg: "#e5e3dc", text: "#2e261f" };
  return (
    <span
      className="inline-block rounded px-1.5 py-0.5 text-[10px] font-medium"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {REGION_NAMES_JA[region as JapanRegion] ?? region}
    </span>
  );
}

function PrefectureRow({
  entry,
  rank,
  onClick,
}: {
  entry: PrefectureScore;
  rank: number;
  onClick: () => void;
}) {
  const topScore = rank <= 3;

  return (
    <li>
      <button
        onClick={onClick}
        className="w-full text-left grid items-center gap-3 px-5 py-3 transition-colors hover:bg-[#edf3f8] focus-visible:outline-2 focus-visible:outline-[#385b75]"
        style={{
          borderBottom: "1px solid #e5e3dc",
          gridTemplateColumns: "2.5rem 1fr 6rem 7rem 7rem 5rem",
        }}
        aria-label={`${entry.nameJa}のリーダーボードを表示`}
      >
        {/* Rank */}
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-${topScore ? "bold" : "normal"}`}
          style={{
            backgroundColor: topScore
              ? rank === 1 ? "#FFBC10" : rank === 2 ? "#D0DDDB" : "#FF9417"
              : "#faf9f7",
            color: "#2e261f",
          }}
        >
          {rank}
        </span>

        {/* Prefecture name */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm truncate" style={{ color: "#2e261f" }}>
              {entry.nameEn}
            </span>
            <span className="text-sm jp-text" style={{ color: "#6f6e67" }}>
              {entry.nameJa}
            </span>
          </div>
          <RegionChip region={entry.region} />
        </div>

        {/* Observers */}
        <div className="flex items-center gap-1 text-xs" style={{ color: "#6f6e67" }}>
          <MapPin size={11} aria-hidden />
          {entry.uniqueObservers}人
        </div>

        {/* Gold */}
        <div className="flex justify-center">
          <MedalBadge tier="gold" count={entry.goldCount} size="sm" />
        </div>

        {/* Silver */}
        <div className="flex justify-center">
          <MedalBadge tier="silver" count={entry.silverCount} size="sm" />
        </div>

        {/* View link */}
        <div className="flex justify-end">
          <span className="text-xs underline" style={{ color: "#385b75" }}>
            詳細 →
          </span>
        </div>
      </button>
    </li>
  );
}

export function PrefectureActivityLeaderboard({
  data,
  onSelectPrefecture,
}: PrefectureActivityLeaderboardProps) {
  const entries = data.prefectureActivity;
  const totalGoldAcross = entries.reduce((s, e) => s + e.goldCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-light leading-tight" style={{ color: "#2e261f" }}>
          都道府県別活動
        </h2>
        <hr className="the-line mt-2" />
        <p className="mt-2 text-sm" style={{ color: "#6f6e67" }}>
          今週最も活動的な都道府県は？ゴールドチェックリスト数による順位。
        </p>
      </div>

      {/* Summary bar */}
      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#F5F3E9", border: "1px solid #e5e3dc" }}>
        <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid #e5e3dc" }}>
          <Trophy size={16} style={{ color: "#FFBC10" }} />
          <span className="text-sm font-medium" style={{ color: "#2e261f" }}>
            47都道府県中{entries.filter((e) => e.goldCount > 0).length}都道府県でゴールド活動あり
          </span>
        </div>

        {/* Horizontal bar chart for top 10 */}
        {totalGoldAcross > 0 && (
          <div className="px-5 py-4 space-y-2">
            {entries.slice(0, 10).map((entry) => (
              <div key={entry.code} className="flex items-center gap-3">
                <button
                  onClick={() => onSelectPrefecture(entry.code)}
                  className="w-24 flex-shrink-0 text-right text-xs truncate hover:underline"
                  style={{ color: "#385b75" }}
                >
                  {entry.nameEn}
                </button>
                <div className="flex-1 rounded-full overflow-hidden h-3" style={{ backgroundColor: "#e5e3dc" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(2, (entry.goldCount / (entries[0]?.goldCount || 1)) * 100)}%`,
                      backgroundColor: "#FFBC10",
                    }}
                  />
                </div>
                <span className="w-6 text-right text-xs font-semibold" style={{ color: "#2e261f" }}>
                  {entry.goldCount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full table */}
      <div className="overflow-hidden rounded-lg border border-[#e5e3dc] bg-white shadow-sm">
        {/* Column headers */}
        <div
          className="grid items-center gap-3 px-5 py-2 text-xs font-medium uppercase tracking-wider"
          style={{
            color: "#6f6e67",
            backgroundColor: "#faf9f7",
            borderBottom: "1px solid #e5e3dc",
            gridTemplateColumns: "2.5rem 1fr 6rem 7rem 7rem 5rem",
          }}
        >
          <span>順位</span>
          <span>都道府県</span>
          <span>観察者</span>
          <span className="text-center">ゴールド</span>
          <span className="text-center">シルバー</span>
          <span />
        </div>

        <ul role="list">
          {entries.map((entry, idx) => (
            <PrefectureRow
              key={entry.code}
              entry={entry}
              rank={idx + 1}
              onClick={() => onSelectPrefecture(entry.code)}
            />
          ))}
        </ul>

        {entries.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm" style={{ color: "#6f6e67" }}>
              今週の都道府県活動データがありません。
            </p>
          </div>
        )}

        {entries.length < 47 && (
          <div
            className="flex items-center justify-center gap-1.5 py-3 text-xs"
            style={{ color: "#6f6e67", borderTop: "1px solid #e5e3dc" }}
          >
            <TrendingUp size={13} />
            今週対象チェックリストなし: {47 - entries.length}都道府県
          </div>
        )}
      </div>
    </div>
  );
}
