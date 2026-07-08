"use client";

// src/components/Sidebar.tsx
// Phase 2 — Bento Shell: Fixed 288px sidebar, M3 semantic tokens, Material Symbols icons
// Sumber: docs/DESIGN/DESIGN_SYS.md Bab 2

import { cn } from "@/lib/utils";
import Icon from "@/components/ui/Icon";

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Analytics Dashboard",
    icon: "dashboard",
    group: "overview",
  },
  {
    id: "aset",
    label: "Aset & Fasum Desa",
    icon: "account_balance",
    group: "map",
  },
  {
    id: "potensi",
    label: "Potensi Lahan & SDA",
    icon: "agriculture",
    group: "map",
  },
  {
    id: "sekolah",
    label: "Aksesibilitas Sekolah",
    icon: "school",
    group: "map",
  },
];

export default function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  return (
    <aside
      className="fixed left-0 top-0 h-full w-72 bg-white border-r border-[var(--outline-variant)] flex flex-col z-50 shadow-sm"
      style={{ width: "18rem" }}
    >
      {/* ── Brand Header ── */}
      <div className="px-6 py-5 border-b border-[var(--outline-variant)]/40">
        <div className="flex items-center gap-3">
          {/* Logo mark: icon dalam kotak abu-abu — sesuai mockup */}
          <div className="w-10 h-10 rounded-lg bg-[var(--surface-container-low)] border border-[var(--outline-variant)] flex items-center justify-center shrink-0">
            <Icon name="map" size={20} filled className="text-[var(--primary)]" />
          </div>
          <div>
            <h1 className="font-heading text-[var(--on-surface)] font-bold text-base leading-tight">
              Desa Rejoagung
            </h1>
            <p className="micro-copy text-[var(--secondary)] mt-0.5">
              GIS Platform 2026
            </p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {/* Section: Overview */}
        <p className="label-caps text-[var(--text-muted)] px-3 mb-2">Overview</p>
        {NAV_ITEMS.filter((i) => i.group === "overview").map((item) => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={cn(
                "flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg body-base font-semibold transition-colors duration-150",
                isActive
                  ? "bg-[var(--primary-container)] text-[var(--on-primary-container)] border-r-4 border-[var(--primary)]"
                  : "text-[var(--secondary)] hover:bg-[var(--surface-container-high)]"
              )}
            >
              <Icon
                name={item.icon}
                size={20}
                filled={isActive}
                className={isActive ? "text-[var(--on-primary-container)]" : "text-[var(--secondary)]"}
              />
              {item.label}
            </button>
          );
        })}

        {/* Section: Modul Peta */}
        <p className="label-caps text-[var(--text-muted)] px-3 mt-5 mb-2">Modul Peta</p>
        {NAV_ITEMS.filter((i) => i.group === "map").map((item) => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={cn(
                "flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg body-base font-semibold transition-colors duration-150",
                isActive
                  ? "bg-[var(--primary-container)] text-[var(--on-primary-container)] border-r-4 border-[var(--primary)]"
                  : "text-[var(--secondary)] hover:bg-[var(--surface-container-high)]"
              )}
            >
              <Icon
                name={item.icon}
                size={20}
                filled={isActive}
                className={isActive ? "text-[var(--on-primary-container)]" : "text-[var(--secondary)]"}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* ── Footer — Export Data + Status ── */}
      <div className="p-4 border-t border-[var(--outline-variant)]/40 space-y-3">
        {/* Export Data Button (statis — sesuai scope MVP) */}
        <button
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-[var(--outline-variant)] text-[var(--secondary)] rounded-lg body-base font-semibold hover:bg-[var(--surface-container-low)] transition-colors shadow-sm"
          onClick={() => {}}
          aria-label="Export Data GeoJSON"
        >
          <Icon name="download" size={18} className="text-[var(--secondary)]" />
          Export Data
        </button>

        {/* Status indicator */}
        <div className="flex items-center gap-2 px-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <p className="micro-copy text-[var(--text-muted)]">
            Data Aktif · Tim Geodesi KKN-PPM UGM 2026
          </p>
        </div>
      </div>
    </aside>
  );
}