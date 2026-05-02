"use client";

import { useState } from "react";
import { Search, Globe, BarChart3, ChevronRight, X } from "lucide-react";
import { PREFECTURES, REGIONS, REGION_NAMES_JA, getPrefecturesByRegion } from "@/lib/prefectures";
import type { ViewMode, JapanRegion } from "@/types";

interface SidebarProps {
  currentView: ViewMode;
  selectedPrefecture: string | null;
  onSelectView: (view: ViewMode, prefCode?: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  currentView,
  selectedPrefecture,
  onSelectView,
  isOpen,
  onClose,
}: SidebarProps) {
  const [search, setSearch] = useState("");
  const [expandedRegions, setExpandedRegions] = useState<Set<JapanRegion>>(new Set());

  const query = search.toLowerCase().trim();
  const filtered = query
    ? PREFECTURES.filter(
        (p) =>
          p.nameEn.toLowerCase().includes(query) ||
          p.nameJa.includes(query) ||
          p.code.toLowerCase().includes(query)
      )
    : null;

  function toggleRegion(region: JapanRegion) {
    setExpandedRegions((prev) => {
      const next = new Set(prev);
      if (next.has(region)) next.delete(region);
      else next.add(region);
      return next;
    });
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-30 h-full w-56 flex flex-col overflow-hidden transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e5e3dc",
        }}
        aria-label="Navigation"
      >
        {/* Sidebar top — same red-border treatment */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{
            borderTop: "4px solid #b31b1b",
            borderBottom: "1px solid #e5e3dc",
          }}
        >
          <span className="font-bold text-base" style={{ color: "#007c73" }}>
            eBird
          </span>
          <button
            className="lg:hidden rounded p-0.5"
            onClick={onClose}
            aria-label="Close navigation"
            style={{ color: "#6f6e67" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Top-level nav items */}
        <nav className="pt-2">
          <NavLink
            label="全国"
            icon={<Globe size={14} />}
            active={currentView === "national"}
            onClick={() => { onSelectView("national"); onClose(); }}
          />
          <NavLink
            label="都道府県別活動"
            icon={<BarChart3 size={14} />}
            active={currentView === "activity"}
            onClick={() => { onSelectView("activity"); onClose(); }}
          />
        </nav>

        {/* Divider + section label */}
        <div className="px-4 pt-3 pb-1">
          <p
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "#6f6e67" }}
          >
            都道府県
          </p>
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2"
              style={{ color: "#6f6e67" }}
            />
            <input
              type="search"
              placeholder="検索…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded pl-8 pr-3 py-1.5 text-xs outline-none"
              style={{
                backgroundColor: "#faf9f7",
                border: "1px solid #e5e3dc",
                color: "#2e261f",
              }}
            />
          </div>
        </div>

        {/* Prefecture list */}
        <div className="flex-1 overflow-y-auto pb-4">
          {filtered ? (
            <ul>
              {filtered.map((pref) => {
                const active = currentView === "prefecture" && selectedPrefecture === pref.code;
                return (
                  <li key={pref.code}>
                    <PrefButton
                      nameJa={pref.nameJa}
                      nameEn={pref.nameEn}
                      active={active}
                      onClick={() => { onSelectView("prefecture", pref.code); onClose(); }}
                    />
                  </li>
                );
              })}
              {filtered.length === 0 && (
                <p className="px-4 py-2 text-xs" style={{ color: "#6f6e67" }}>
                  &quot;{search}&quot; に一致する結果がありません
                </p>
              )}
            </ul>
          ) : (
            REGIONS.map((region) => {
              const prefs = getPrefecturesByRegion(region);
              const expanded = expandedRegions.has(region);
              const hasActive = prefs.some(
                (p) => currentView === "prefecture" && selectedPrefecture === p.code
              );
              return (
                <div key={region}>
                  <button
                    onClick={() => toggleRegion(region)}
                    className="w-full flex items-center justify-between px-4 py-1.5 text-xs hover:bg-[#faf9f7] transition-colors"
                    style={{
                      color: hasActive ? "#385b75" : "#6f6e67",
                      fontWeight: hasActive ? "600" : "400",
                    }}
                  >
                    <span>{REGION_NAMES_JA[region]}</span>
                    <ChevronRight
                      size={12}
                      className={`transition-transform ${expanded ? "rotate-90" : ""}`}
                    />
                  </button>
                  {expanded && (
                    <ul>
                      {prefs.map((pref) => {
                        const active =
                          currentView === "prefecture" && selectedPrefecture === pref.code;
                        return (
                          <li key={pref.code}>
                            <PrefButton
                              nameJa={pref.nameJa}
                              nameEn={pref.nameEn}
                              active={active}
                              onClick={() => {
                                onSelectView("prefecture", pref.code);
                                onClose();
                              }}
                              indent
                            />
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          className="px-4 py-3 text-xs"
          style={{ borderTop: "1px solid #e5e3dc", color: "#6f6e67" }}
        >
          eBird API v2 · コーネル大学
        </div>
      </aside>
    </>
  );
}

function NavLink({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-[#faf9f7]"
      style={{
        color: active ? "#385b75" : "#2e261f",
        fontWeight: active ? "600" : "400",
        borderLeft: active ? "2px solid #385b75" : "2px solid transparent",
        backgroundColor: active ? "#edf3f8" : "transparent",
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function PrefButton({
  nameJa,
  nameEn,
  active,
  onClick,
  indent,
}: {
  nameJa: string;
  nameEn: string;
  active: boolean;
  onClick: () => void;
  indent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 py-1.5 text-xs transition-colors hover:bg-[#faf9f7]"
      style={{
        paddingLeft: indent ? "1.5rem" : "1rem",
        paddingRight: "1rem",
        color: active ? "#385b75" : "#2e261f",
        fontWeight: active ? "600" : "400",
        borderLeft: active ? "2px solid #385b75" : "2px solid transparent",
        backgroundColor: active ? "#edf3f8" : "transparent",
      }}
    >
      <span className="jp-text">{nameJa}</span>
      <span style={{ color: "#6f6e67" }}>{nameEn}</span>
    </button>
  );
}
