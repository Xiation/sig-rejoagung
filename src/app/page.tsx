// src/app/page.tsx
// Phase 2 — Bento Shell Main Viewport
// Layout: Fixed Sidebar (18rem) + Fixed TopAppBar (4rem) + Liquid main content
// Sumber: docs/DESIGN/DESIGN_SYS.md Bab 2

"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopAppBar from "@/components/layout/TopAppBar";
import dynamic from "next/dynamic";
import AnalyticsDashboard from "@/components/analytics/analyticsDashboard";

// Dynamic import for Leaflet — prevents SSR hydration mismatch
const MapViewer = dynamic(() => import("@/components/map/MapViewer"), {
  ssr: false,
});

// ── Module metadata ──────────────────────────────────────────────────────────
const MODULE_META: Record<
  string,
  { title: string; badge: string; badgeVariant: "primary" | "map" | "default" }
> = {
  dashboard: {
    title: "Analytics Dashboard",
    badge: "Ringkasan",
    badgeVariant: "primary",
  },
  aset: {
    title: "Pemetaan Aset & Fasilitas Umum Desa",
    badge: "Peta Interaktif",
    badgeVariant: "map",
  },
  potensi: {
    title: "Visualisasi Potensi Lahan & Sumber Daya Alam",
    badge: "Peta Interaktif",
    badgeVariant: "map",
  },
  sekolah: {
    title: "Analisis Spasial Aksesibilitas Sekolah",
    badge: "Peta Interaktif",
    badgeVariant: "map",
  },
};

export default function DashboardGIS() {
  const [activeModule, setActiveModule] = useState<string>("aset");
  const meta = MODULE_META[activeModule] ?? MODULE_META["aset"];
  const isMapView = activeModule !== "dashboard";

  return (
    // Root shell: full-screen, row layout
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--surface-container-low)]">

      {/* ── Fixed Sidebar (288px) ── */}
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />

      {/* ── Main Viewport — offset by sidebar ── */}
      <div className="flex flex-col flex-1 h-full" style={{ marginLeft: "18rem" }}>

        {/* ── Fixed TopAppBar (64px) ── */}
        <TopAppBar
          title={meta.title}
          badge={meta.badge}
          badgeVariant={meta.badgeVariant}
        />

        {/* ── Scrollable / Fluid Content Area ── */}
        {/* mt-16 = offset TopAppBar height; p-6 = DESIGN_SYS global padding */}
        <main className="flex-1 mt-16 overflow-hidden">
          {isMapView ? (
            // Map view: full-bleed, padded container with rounded card
            <div className="w-full h-full p-6">
              <div className="w-full h-full rounded-xl overflow-hidden border border-[var(--outline-variant)] shadow-sm bg-white">
                <MapViewer activeModule={activeModule} />
              </div>
            </div>
          ) : (
            // Dashboard view: scrollable, full-width
            <div className="w-full h-full overflow-y-auto">
              <AnalyticsDashboard />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
