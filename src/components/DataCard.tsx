"use client";

import type { ReactNode } from "react";

interface DataCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: ReactNode;
  accent?: "gold" | "green" | "blue" | "default";
}

const ACCENT: Record<string, { bg: string; border: string }> = {
  gold:    { bg: "#fffbe5", border: "#FFBC10" },
  green:   { bg: "#f3fcf3", border: "#296239" },
  blue:    { bg: "#edf3f8", border: "#385b75" },
  default: { bg: "#ffffff", border: "#e5e3dc" },
};

export function DataCard({ label, value, sublabel, icon, accent = "default" }: DataCardProps) {
  const { bg, border } = ACCENT[accent] ?? ACCENT.default;
  return (
    <div
      className="rounded-lg px-4 py-3"
      style={{ backgroundColor: bg, border: `1px solid ${border}` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p
            className="text-[10px] font-semibold uppercase tracking-widest mb-1"
            style={{ color: "#6f6e67" }}
          >
            {label}
          </p>
          <p className="text-2xl font-semibold leading-tight" style={{ color: "#2e261f" }}>
            {value}
          </p>
          {sublabel && (
            <p className="text-xs mt-0.5" style={{ color: "#6f6e67" }}>{sublabel}</p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 mt-1" style={{ color: "#6f6e67" }}>{icon}</div>
        )}
      </div>
    </div>
  );
}
