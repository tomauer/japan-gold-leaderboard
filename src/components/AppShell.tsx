"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu, AlertTriangle } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { StatusBar } from "./StatusBar";
import { NationalLeaderboard } from "./NationalLeaderboard";
import { PrefectureLeaderboard } from "./PrefectureLeaderboard";
import { PrefectureActivityLeaderboard } from "./PrefectureActivityLeaderboard";
import type { LeaderboardApiResponse, ViewMode } from "@/types";

export function AppShell() {
  const [view, setView] = useState<ViewMode>("national");
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [data, setData] = useState<LeaderboardApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = forceRefresh ? "/api/leaderboard?refresh=1" : "/api/leaderboard";
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      const json = await res.json() as LeaderboardApiResponse;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function handleSelectView(newView: ViewMode, prefCode?: string) {
    setView(newView);
    if (prefCode) setSelectedPrefecture(prefCode);
  }

  const mainContent = () => {
    if (isLoading && !data) return <LoadingState />;
    if (error && !data) return <ErrorState message={error} onRetry={fetchData} />;
    if (!data) return null;

    if (view === "national") return <NationalLeaderboard data={data} />;
    if (view === "prefecture" && selectedPrefecture)
      return <PrefectureLeaderboard data={data} prefectureCode={selectedPrefecture} />;
    if (view === "activity")
      return (
        <PrefectureActivityLeaderboard
          data={data}
          onSelectPrefecture={(code) => handleSelectView("prefecture", code)}
        />
      );
    return <NationalLeaderboard data={data} />;
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

        {/* eBird-style top nav: white + 4px red top border */}
        <header
          className="flex items-center justify-between px-6 py-3"
          style={{
            backgroundColor: "#ffffff",
            borderTop: "4px solid #b31b1b",
            borderBottom: "1px solid rgba(111,110,103,0.25)",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <button
              className="lg:hidden p-1 rounded"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              style={{ color: "#6f6e67" }}
            >
              <Menu size={20} />
            </button>
            {/* eBird wordmark */}
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

        {/* Region banner — #385b75 like eBird's PageHeading */}
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
                過去{data?.windowDays ?? 7}日間の高品質チェックリスト · 全47都道府県
              </p>
            </div>
            <StatusBar
              lastUpdated={data?.lastUpdated ?? null}
              isLoading={isLoading}
              cacheHit={data?.cacheHit ?? false}
              onRefresh={() => fetchData(true)}
            />
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
          · コーネル大学鳥類学研究室 · 過去{data?.windowDays ?? 7}日間 · JP-01〜JP-47
        </footer>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div
        className="h-10 w-10 rounded-full border-4 animate-spin"
        style={{ borderColor: "#e5e3dc", borderTopColor: "#385b75" }}
      />
      <div className="text-center">
        <p className="font-medium" style={{ color: "#2e261f" }}>eBirdデータを取得中…</p>
        <p className="text-sm mt-1" style={{ color: "#6f6e67" }}>
          全47都道府県をスキャン中 — 初回読み込みに少々時間がかかる場合があります
        </p>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      className="rounded-lg border p-6 flex flex-col items-center gap-3 text-center mt-4"
      style={{ borderColor: "#b31b1b", backgroundColor: "#fff8f7" }}
    >
      <AlertTriangle size={28} style={{ color: "#b31b1b" }} />
      <div>
        <p className="font-semibold" style={{ color: "#2e261f" }}>リーダーボードデータを読み込めませんでした</p>
        <p className="text-sm mt-1" style={{ color: "#6f6e67" }}>{message}</p>
        {message.includes("EBIRD_API_KEY") && (
          <p className="text-sm mt-2" style={{ color: "#6f6e67" }}>
            <code className="bg-[#f4f3f1] px-1 rounded">.env.local</code> にAPIキーを追加してサーバーを再起動してください。
          </p>
        )}
      </div>
      <button
        onClick={onRetry}
        className="mt-1 rounded px-4 py-2 text-sm font-medium text-white"
        style={{ backgroundColor: "#385b75" }}
      >
        再試行
      </button>
    </div>
  );
}
