// src/components/layout/TopAppBar.tsx
// Phase 2 — Bento Shell: Fixed 64px header, context-aware title + badge
// Sumber: docs/DESIGN/DESIGN_SYS.md Bab 2
// ⚠️ Minimalis (static-safe): Hanya judul halaman aktif. Tidak ada search/profile/logout (out-of-scope MVP).

"use client";

import Icon from "@/components/ui/Icon";

interface TopAppBarProps {
  title: string;
  badge?: string;
  badgeVariant?: "primary" | "map" | "default";
}

const BADGE_STYLES: Record<string, string> = {
  primary: "bg-violet-50 text-violet-700 border border-violet-100",
  map: "bg-[var(--primary-container)] text-[var(--on-primary-container)] border border-emerald-200",
  default: "bg-[var(--surface-container)] text-[var(--on-surface-variant)] border border-[var(--outline-variant)]",
};

const ICON_MAP: Record<string, string> = {
  "Ringkasan": "bar_chart",
  "Peta Interaktif": "map",
};

export default function TopAppBar({ title, badge, badgeVariant = "default" }: TopAppBarProps) {
  const iconName = badge ? (ICON_MAP[badge] ?? "info") : "info";

  return (
    <header
      className="fixed top-0 right-0 z-40 h-16 bg-white/90 backdrop-blur-md border-b border-[var(--outline-variant)] shadow-sm flex items-center px-6 gap-4"
      style={{ left: "18rem" }}
    >
      {/* Context icon */}
      <div className="w-8 h-8 rounded-lg bg-[var(--surface-container-low)] border border-[var(--outline-variant)] flex items-center justify-center shrink-0">
        <Icon name={iconName} size={18} className="text-[var(--primary)]" />
      </div>

      {/* Page title */}
      <h2 className="section-header text-[var(--on-surface)] flex-1 truncate">
        {title}
      </h2>

      {/* Module badge */}
      {badge && (
        <span className={`label-caps px-3 py-1.5 rounded-full shrink-0 ${BADGE_STYLES[badgeVariant]}`}>
          {badge}
        </span>
      )}
    </header>
  );
}
