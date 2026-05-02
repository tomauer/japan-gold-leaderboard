"use client";

import { MapPin } from "lucide-react";
import type { ObserverScore } from "@/types";
import { getPrefectureByCode } from "@/lib/prefectures";

interface LeaderboardTableProps {
  data: ObserverScore[];
  showPrefectureColumn?: boolean;
  maxRows?: number;
  title: string;
  subtitle?: string;
}

export function LeaderboardTable({
  data,
  showPrefectureColumn = false,
  maxRows = 25,
  title,
  subtitle,
}: LeaderboardTableProps) {
  const rows = data.slice(0, maxRows);
  const maxGold = Math.max(...rows.map((r) => r.goldCount), 1);
  const maxSilver = Math.max(...rows.map((r) => r.silverCount), 1);

  if (rows.length === 0) {
    return (
      <div
        className="rounded-lg p-8 text-center"
        style={{ border: "1px solid #e5e3dc" }}
      >
        <p className="text-sm" style={{ color: "#6f6e67" }}>
          この期間の対象チェックリストがありません。
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Table header */}
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <h3
            className="font-semibold text-lg leading-tight"
            style={{ color: "#2e261f" }}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs mt-0.5" style={{ color: "#6f6e67" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Column headers */}
      <div
        className="grid items-center gap-3 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
        style={{
          color: "#6f6e67",
          backgroundColor: "#faf9f7",
          borderTop: "1px solid #e5e3dc",
          borderBottom: "1px solid #e5e3dc",
          gridTemplateColumns: showPrefectureColumn
            ? "2.5rem 1fr 8rem 10rem 6rem"
            : "2.5rem 1fr 10rem 6rem",
        }}
      >
        <span className="text-right">#</span>
        <span>観察者</span>
        {showPrefectureColumn && <span>都道府県</span>}
        <span>ゴールド</span>
        <span>シルバー</span>
      </div>

      {/* Rows */}
      <ul role="list">
        {rows.map((observer, idx) => {
          const rank = idx + 1;
          const goldPct = Math.max(4, (observer.goldCount / maxGold) * 100);
          const silverPct = Math.max(4, (observer.silverCount / maxSilver) * 100);
          const topPrefCodes = Object.keys(observer.prefectureBreakdown).slice(0, 3);

          return (
            <li
              key={observer.userId}
              className="grid items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[#faf9f7]"
              style={{
                borderBottom: "1px solid #e5e3dc",
                gridTemplateColumns: showPrefectureColumn
                  ? "2.5rem 1fr 8rem 10rem 6rem"
                  : "2.5rem 1fr 10rem 6rem",
              }}
            >
              {/* Rank */}
              <span
                className="text-sm font-medium text-right"
                style={{ color: rank <= 3 ? "#2e261f" : "#6f6e67" }}
              >
                {rank}.
              </span>

              {/* Observer name + location */}
              <div className="min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: "#40718f" }}
                  title={observer.displayName}
                >
                  {observer.displayName}
                </p>
                {observer.topLocations[0] && (
                  <p
                    className="flex items-center gap-1 truncate text-xs mt-0.5"
                    style={{ color: "#6f6e67" }}
                    title={observer.topLocations[0]}
                  >
                    <MapPin size={10} aria-hidden />
                    {observer.topLocations[0]}
                  </p>
                )}
              </div>

              {/* Prefecture chips */}
              {showPrefectureColumn && (
                <div className="flex flex-wrap gap-1">
                  {topPrefCodes.map((code) => {
                    const pref = getPrefectureByCode(code);
                    if (!pref) return null;
                    return (
                      <span
                        key={code}
                        className="inline-block rounded px-1 py-0.5 text-[10px] jp-text"
                        style={{ backgroundColor: "#edf3f8", color: "#385b75" }}
                        title={pref.nameEn}
                      >
                        {pref.nameJa}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Gold bar */}
              <div className="flex items-center">
                <div
                  className="w-full h-5 rounded-sm overflow-hidden"
                  style={{ backgroundColor: "#edf3f8" }}
                >
                  <div
                    className="h-full flex items-center justify-end pr-1.5 rounded-sm"
                    style={{
                      width: `${goldPct}%`,
                      backgroundColor: "#FFBC10",
                      minWidth: observer.goldCount > 0 ? "1.75rem" : "0",
                    }}
                  >
                    {observer.goldCount > 0 && (
                      <span
                        className="text-[11px] font-semibold leading-none"
                        style={{ color: "#2e261f" }}
                      >
                        {observer.goldCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Silver bar */}
              <div className="flex items-center">
                <div
                  className="w-full h-5 rounded-sm overflow-hidden"
                  style={{ backgroundColor: "#edf3f8" }}
                >
                  <div
                    className="h-full flex items-center justify-end pr-1.5 rounded-sm"
                    style={{
                      width: `${silverPct}%`,
                      backgroundColor: "#40718f",
                      minWidth: observer.silverCount > 0 ? "1.75rem" : "0",
                    }}
                  >
                    {observer.silverCount > 0 && (
                      <span
                        className="text-[11px] font-semibold leading-none text-white"
                      >
                        {observer.silverCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {data.length > maxRows && (
        <p className="px-4 py-2 text-xs" style={{ color: "#6f6e67", borderTop: "1px solid #e5e3dc" }}>
          他{data.length - maxRows}人は非表示
        </p>
      )}
    </div>
  );
}
