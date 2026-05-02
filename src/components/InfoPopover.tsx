"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { Info } from "lucide-react";

interface InfoPopoverProps {
  children: ReactNode;
  label?: string;
}

export function InfoPopover({ children, label = "Show information" }: InfoPopoverProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className="rounded-full p-0.5 transition-colors"
        style={{ color: open ? "#385B75" : "#AAC4C4" }}
      >
        <Info size={14} aria-hidden />
      </button>

      {open && (
        <div
          role="tooltip"
          className="absolute left-0 top-full z-50 mt-2 w-72 rounded-lg p-4 text-sm shadow-lg"
          style={{
            backgroundColor: "#2E261F",
            color: "white",
            // keep within viewport on small screens
            maxWidth: "min(18rem, calc(100vw - 2rem))",
          }}
        >
          {/* Arrow */}
          <div
            className="absolute -top-1.5 left-2 h-3 w-3 rotate-45"
            style={{ backgroundColor: "#2E261F" }}
            aria-hidden
          />
          {children}
        </div>
      )}
    </div>
  );
}
