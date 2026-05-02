"use client";

import { Medal } from "lucide-react";

interface MedalBadgeProps {
  tier: "gold" | "silver";
  count: number;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { icon: 14, text: "text-xs", px: "px-2 py-0.5", gap: "gap-1" },
  md: { icon: 16, text: "text-sm", px: "px-2.5 py-1", gap: "gap-1.5" },
  lg: { icon: 20, text: "text-base", px: "px-3 py-1.5", gap: "gap-2" },
};

export function MedalBadge({ tier, count, size = "md" }: MedalBadgeProps) {
  const s = SIZES[size];

  if (tier === "gold") {
    return (
      <span
        className={`inline-flex items-center ${s.gap} ${s.px} rounded-full font-semibold ${s.text}`}
        style={{
          backgroundColor: "#FFBC10",
          color: "#2E261F",
          border: "1px solid #FF9417",
        }}
      >
        <Medal size={s.icon} aria-hidden />
        <span>{count}</span>
        <span className="font-normal opacity-75">ゴールド</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center ${s.gap} ${s.px} rounded-full font-semibold ${s.text}`}
      style={{
        backgroundColor: "#D0DDDB",
        color: "#2E261F",
        border: "1px solid #AAC4C4",
      }}
    >
      <Medal size={s.icon} aria-hidden />
      <span>{count}</span>
      <span className="font-normal opacity-75">シルバー</span>
    </span>
  );
}
