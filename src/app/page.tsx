// src/app/page.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MapViewer from "@/components/map/MapViewer";
import AnalyticsDashboard from "@/components/analytics/analyticsDashboard";

const MODULE_LABELS: Record<string, { title: string; badge: string; badgeColor: string }> = {
  dashboard: {
    title: "Dashboard Analisis Desa Rejoagung",
    badge: "Ringkasan",
    badgeColor: "bg-violet-50 text-violet-700",
  },
  aset: {
    title: "Pemetaan Aset & Fasilitas Umum Desa",
    badge: "Peta Interaktif",
    badgeColor: "bg-emerald-50 text-emerald-700",
  },
  potensi: {
    title: "Visualisasi Potensi Lahan & Sumber Daya Alam",
    badge: "Peta Interaktif",
    badgeColor: "bg-emerald-50 text-emerald-700",
  },
  sekolah: {
    title: "Analisis Spasial Aksesibilitas Sekolah",
    badge: "Peta Interaktif",
    badgeColor: "bg-emerald-50 text-emerald-700",
  },
};

export default function DashboardGIS() {
  const [activeModule, setActiveModule] = useState("aset");
  const meta = MODULE_LABELS[activeModule] ?? MODULE_LABELS["aset"];

  return (
    <div className="flex h-screen w-screen bg-slate-50">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />

      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        {/* ── Header ── */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 z-10 shrink-0 gap-3">
          <h1 className="font-heading text-slate-900 font-semibold text-[17px] leading-snug tracking-tight flex-1 truncate">
            {meta.title}
          </h1>
          <span
            className={`font-body text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${meta.badgeColor}`}
          >
            {meta.badge}
          </span>
        </header>

        {/* ── Conditional View Area ── */}
        <div className="flex-1 p-5 bg-slate-50 h-full overflow-hidden">
          {activeModule === "dashboard" ? (
            <AnalyticsDashboard />
          ) : (
            <div className="w-full h-full rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-white">
              <MapViewer activeModule={activeModule} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
