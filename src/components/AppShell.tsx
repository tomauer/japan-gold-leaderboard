"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { NationalLeaderboard } from "./NationalLeaderboard";
import { PrefectureLeaderboard } from "./PrefectureLeaderboard";
import { PrefectureActivityLeaderboard } from "./PrefectureActivityLeaderboard";
import type { LeaderboardApiResponse, ViewMode } from "@/types";

interface AppShellProps {
  initialData: LeaderboardApiResponse;
}

export function AppShell({ initialData }: AppShellProps) {
  const [view, setView] = useState<ViewMode>("national");
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleSelectView(newView: ViewMode, prefCode?: string) {
    setView(newView);
    if (prefCode) setSelectedPrefecture(prefCode);
  }

  const formattedDate = initialData.lastUpdated
    ? new Intl.DateTimeFormat("ja-JP", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Tokyo",
      }).format(new Date(initialData.lastUpdated))
    : null;

  const mainContent = () => {
    if (view === "national") return <NationalLeaderboard data={initialData} />;
    if (view === "prefecture" && selectedPrefecture)
      return <PrefectureLeaderboard data={initialData} prefectureCode={selectedPrefecture} />;
    if (view === "activity")
      return (
        <PrefectureActivityLeaderboard
          data={initialData}
          onSelectPrefecture={(code) => handleSelectView("prefecture", code)}
        />
      );
    return <NationalLeaderboard data={initialData} />;
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Fixed sidebar */}
      <Sidebar
        currentView={view}
        selectedPrefecture={selectedPrefecture}
        onSelectView={handleSelectView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main column, offset for sidebar */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-56">

        {/* eBird-style top nav */}
        <header
          className="flex items-center justify-between px-6 py-3"
          style={{
            backgroundColor: "#ffffff",
            borderTop: "4px solid #b31b1b",
            borderBottom: "1px solid rgba(111,110,103,0.25)",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1 rounded"
              onClick={() => setSidebarOpen(true)}
              aria-label="ナビゲーションを開く"
              style={{ color: "#6f6e67" }}
            >
              <Menu size={20} />
            </button>
            <span
              className="font-bold text-xl tracking-tight select-none"
              style={{ color: "#007c73" }}
            >
              eBird
            </span>
            <span className="text-sm hidden sm:block" style={{ color: "#6f6e67" }}>
              日本 ゴールドリーダーボード
            </span>
          </div>

          {/* Tier legend */}
          <div className="hidden sm:flex items-center gap-4 text-xs" style={{ color: "#6f6e67" }}>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#FFBC10" }} />
              ゴールド: 1時間以内 · 2km以内
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#40718f" }} />
              シルバー: 1〜3時間 · 2〜4km
            </span>
          </div>
        </header>

        {/* Region banner */}
        <div style={{ backgroundColor: "#385b75" }}>
          <div className="px-8 py-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: "#b4cfe1" }}>
                日本 · Japan
              </p>
              <h1
                className="font-light leading-none"
                style={{ color: "#ffffff", fontSize: "3.25rem" }}
              >
                ゴールドリーダーボード
              </h1>
              <p className="mt-2 text-sm" style={{ color: "#b4cfe1" }}>
                {initialData.challengePeriod}の高品質チェックリスト · 全47都道府県
              </p>
            </div>
            {formattedDate && (
              <span className="text-xs hidden md:block flex-shrink-0" style={{ color: "#b4cfe1" }}>
                更新: {formattedDate} JST
              </span>
            )}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 px-8 py-6 max-w-5xl w-full">
          {mainContent()}
        </main>

        {/* Footer */}
        <footer
          className="px-8 py-4 text-xs"
          style={{
            color: "#6f6e67",
            borderTop: "1px solid #e5e3dc",
          }}
        >
          データ提供:{" "}
          <a
            href="https://ebird.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#385b75]"
          >
            eBird
          </a>{" "}
          · コーネル大学鳥類学研究室 · {initialData.challengePeriod} · JP-01〜JP-47
        </footer>
      </div>
    </div>
  );
}
