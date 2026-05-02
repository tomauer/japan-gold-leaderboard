"use client";

import { MapPin, Users } from "lucide-react";
import { REGION_NAMES_JA } from "@/lib/prefectures";
import type { JapanRegion } from "@/types";
import { DataCard } from "./DataCard";
import { LeaderboardTable } from "./LeaderboardTable";
import { getPrefectureByCode } from "@/lib/prefectures";
import type { LeaderboardApiResponse } from "@/types";

interface PrefectureLeaderboardProps {
  data: LeaderboardApiResponse;
  prefectureCode: string;
}

export function PrefectureLeaderboard({
  data,
  prefectureCode,
}: PrefectureLeaderboardProps) {
  const pref = getPrefectureByCode(prefectureCode);
  const observers = data.byPrefecture[prefectureCode] ?? [];
  const activityEntry = data.prefectureActivity.find(
    (p) => p.code === prefectureCode
  );
  const nationalRank =
    data.prefectureActivity.findIndex((p) => p.code === prefectureCode) + 1;

  if (!pref) {
    return (
      <p className="text-sm" style={{ color: "#6f6e67" }}>
        Prefecture not found: {prefectureCode}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Prefecture header */}
      <div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <h2 className="text-2xl font-light leading-tight" style={{ color: "#2e261f" }}>
            {pref.nameEn}
          </h2>
          <span
            className="text-xl font-light jp-text"
            style={{ color: "#6f6e67" }}
          >
            {pref.nameJa}
          </span>
          {nationalRank > 0 && (
            <span
              className="text-sm rounded-full px-2.5 py-0.5 font-medium"
              style={{ backgroundColor: "#edf3f8", color: "#385b75" }}
            >
              全国{nationalRank}位
            </span>
          )}
        </div>
        <hr className="the-line mt-2" />
        <div
          className="mt-2 flex items-center gap-1.5 text-sm"
          style={{ color: "#6f6e67" }}
        >
          <MapPin size={14} />
          <span>{REGION_NAMES_JA[pref.region as JapanRegion]}地方 · {pref.code}</span>
        </div>
      </div>

      {/* Prefecture stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <DataCard
          label="ゴールド チェックリスト"
          value={activityEntry?.goldCount ?? 0}
          sublabel="今週"
          accent="gold"
        />
        <DataCard
          label="シルバー チェックリスト"
          value={activityEntry?.silverCount ?? 0}
          sublabel="今週"
          accent="blue"
        />
        <DataCard
          label="活動中の観察者"
          value={activityEntry?.uniqueObservers ?? 0}
          sublabel="今週"
          accent="green"
          icon={<Users size={20} />}
        />
        <DataCard
          label="全リスト"
          value={activityEntry?.totalChecklists ?? 0}
          sublabel="対象"
        />
      </div>

      {/* Prefecture leaderboard table */}
      <LeaderboardTable
        data={observers}
        title={`${pref.nameJa}ランキング`}
        subtitle={`${pref.nameJa}の上位${Math.min(observers.length, 25)}人 · 過去${data.windowDays}日間`}
        maxRows={25}
      />

      {observers.length === 0 && (
        <div
          className="rounded-lg border border-[#e5e3dc] bg-white p-8 text-center"
        >
          <p className="text-sm" style={{ color: "#6f6e67" }}>
            今週{pref.nameJa}でゴールドまたはシルバーのチェックリストはありませんでした。
          </p>
        </div>
      )}
    </div>
  );
}
