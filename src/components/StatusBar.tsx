"use client";

import { RefreshCw } from "lucide-react";

interface StatusBarProps {
  lastUpdated: string | null;
  isLoading: boolean;
  cacheHit: boolean;
  onRefresh: () => void;
}

export function StatusBar({ lastUpdated, isLoading, cacheHit, onRefresh }: StatusBarProps) {
  const formattedDate = lastUpdated
    ? new Intl.DateTimeFormat("en-JP", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Tokyo",
      }).format(new Date(lastUpdated))
    : null;

  return (
    <div className="flex items-center gap-3 flex-shrink-0">
      {formattedDate && (
        <span className="text-xs hidden md:block" style={{ color: "#b4cfe1" }}>
          更新: {formattedDate} JST{cacheHit ? " · キャッシュ済" : ""}
        </span>
      )}
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50"
        style={{
          backgroundColor: "rgba(255,255,255,0.15)",
          color: "#ffffff",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <RefreshCw size={11} className={isLoading ? "animate-spin" : ""} aria-hidden />
        {isLoading ? "読み込み中…" : "更新"}
      </button>
    </div>
  );
}
