"use client";

import { Users, Medal, BarChart3, TrendingUp } from "lucide-react";
import { DataCard } from "./DataCard";
import { LeaderboardTable } from "./LeaderboardTable";
import { InfoPopover } from "./InfoPopover";
import type { LeaderboardApiResponse } from "@/types";

interface NationalLeaderboardProps {
  data: LeaderboardApiResponse;
}

export function NationalLeaderboard({ data }: NationalLeaderboardProps) {
  const topGold = data.national[0]?.goldCount ?? 0;
  const topSilver = data.national[0]?.silverCount ?? 0;
  const uniqueObservers = new Set(data.national.map((o) => o.userId)).size;
  const stTotal = data.totalStatusAndTrendsChecklists ?? 0;
  const goldPlusSilver = data.totalGoldChecklists + data.totalSilverChecklists;
  const stPct =
    data.totalChecklistsProcessed > 0
      ? Math.round((stTotal / data.totalChecklistsProcessed) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div>
        <h2 className="text-2xl font-semibold leading-tight" style={{ color: "#2e261f" }}>
          全国リーダーボード
        </h2>
        <p className="mt-1 text-sm" style={{ color: "#6f6e67" }}>
          全47都道府県のトップ観察者 — {data.challengePeriod}
        </p>
        <hr style={{ borderColor: "#e5e3dc", marginTop: "0.75rem" }} />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <DataCard
          label="ゴールド チェックリスト"
          value={data.totalGoldChecklists}
          sublabel="今週"
          accent="gold"
          icon={<Medal size={20} />}
        />
        <DataCard
          label="シルバー チェックリスト"
          value={data.totalSilverChecklists}
          sublabel="今週"
          accent="blue"
          icon={<Medal size={20} />}
        />
        <DataCard
          label="活動中の観察者"
          value={uniqueObservers}
          sublabel="対象リストあり"
          accent="green"
          icon={<Users size={20} />}
        />
        <DataCard
          label="リスト数"
          value={data.totalChecklistsProcessed.toLocaleString()}
          sublabel="日本全国"
          icon={<BarChart3 size={20} />}
        />
      </div>

      {/* Status & Trends eligible summary */}
      <div
        className="rounded-lg p-5"
        style={{ backgroundColor: "#edf3f8", border: "1px solid #b4cfe1" }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Label + info icon */}
          <div className="flex items-center gap-2">
            <TrendingUp size={16} style={{ color: "#385B75" }} />
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#385b75" }}
            >
              eBird Status &amp; Trends 対象
            </span>
            <InfoPopover label="S&T対象基準を表示">
              <p className="font-semibold mb-2 text-sm">S&amp;T 対象基準</p>
              <ul className="space-y-1.5 text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>
                <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0">✓</span>完全なチェックリスト</li>
                <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0">✓</span>移動またはポイントカウントプロトコル</li>
                <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0">✓</span>移動の場合: 10km以内</li>
                <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0">✓</span>継続時間: 3分〜8時間</li>
                <li className="flex gap-2"><span className="mt-0.5 flex-shrink-0">✓</span>開始時刻・継続時間・プロトコル・観察者数・移動距離が必要</li>
              </ul>
            </InfoPopover>
          </div>

          {/* Stats */}
          <div className="flex gap-6 flex-shrink-0">
            <div className="text-center">
              <p className="text-3xl font-semibold leading-none" style={{ color: "#2E261F" }}>
                {stTotal.toLocaleString()}
              </p>
              <p className="text-xs mt-1" style={{ color: "#6D6762" }}>S&amp;T対象</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-semibold leading-none" style={{ color: "#2E261F" }}>
                {stPct}%
              </p>
              <p className="text-xs mt-1" style={{ color: "#6D6762" }}>全リスト中</p>
            </div>
            {goldPlusSilver > 0 && (
              <div className="text-center">
                <p className="text-3xl font-semibold leading-none" style={{ color: "#2E261F" }}>
                  {Math.round((goldPlusSilver / Math.max(stTotal, 1)) * 100)}%
                </p>
                <p className="text-xs mt-1" style={{ color: "#6D6762" }}>Gold/Silverも含む</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main leaderboard */}
      <LeaderboardTable
        data={data.national}
        showPrefectureColumn
        title="全国ランキング"
        subtitle={`ゴールド優先、次いでシルバーで順位付け · 上位${Math.min(data.national.length, 25)}人（全${data.national.length}人中）`}
        maxRows={25}
      />

      {/* Top observer spotlight */}
      {data.national.length > 0 && (
        <div
          className="rounded-lg p-5"
          style={{ backgroundColor: "#385b75", color: "white" }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#b4cfe1" }}>
            今週のトップバーダー
          </p>
          <p className="text-xl font-semibold">{data.national[0].displayName}</p>
          <p className="text-sm mt-1" style={{ color: "#b4cfe1" }}>
            ゴールド {topGold} · シルバー {topSilver} · {data.national[0].topLocations[0] ?? "各地"}
          </p>
        </div>
      )}
    </div>
  );
}
