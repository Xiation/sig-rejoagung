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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const meta = MODULE_META[activeModule] ?? MODULE_META["aset"];
  const isMapView = activeModule !== "dashboard";

  return (
    // Root shell: full-screen, row layout
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--surface-container-low)]">

      {/* ── Sidebar — fixed 288px di desktop (lg:), slide-in drawer di mobile/tablet ── */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main Viewport — offset by sidebar cuma di desktop (lg:) ── */}
      <div className="flex flex-col flex-1 h-full ml-0 lg:ml-72">

        {/* ── Fixed TopAppBar (64px) ── */}
        <TopAppBar
          title={meta.title}
          badge={meta.badge}
          badgeVariant={meta.badgeVariant}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* ── Scrollable / Fluid Content Area ── */}
        {/* mt-16 = offset TopAppBar height; p-6 = DESIGN_SYS global padding (desktop only, map full-bleed di mobile) */}
        <main className="flex-1 mt-16 overflow-hidden">
          {isMapView ? (
            // Map view: full-bleed di mobile/tablet, padded+rounded card di desktop (lg:)
            <div className="w-full h-full lg:p-6">
              <div className="w-full h-full lg:rounded-xl overflow-hidden lg:border border-[var(--outline-variant)] lg:shadow-sm bg-white">
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
