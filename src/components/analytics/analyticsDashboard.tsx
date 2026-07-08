// src/components/analytics/analyticsDashboard.tsx
// Phase 3 — Composite Bento Grid
// Layout: Welcome → Macro Scorecards (3 col) → Composite Grid (Aset 6 + Edu 6) → LandPotential full
// Sumber: docs/DESIGN/DESIGN_SYS.md Bab 3

"use client";

import Icon from "@/components/ui/Icon";
import AssetMetrics from "./AssetMetrics";
import EducationMetrics from "./EducationMetrics";
import LandPotentialMetrics from "./LandPotentialMetrics";

// ── Macro KPI Data (Village-level context cards) ──────────────────────────────
const MACRO_KPIS = [
  {
    id: "dusun",
    label: "Dusun Terpetakan",
    value: "4",
    unit: "dusun",
    icon: "home_work",
    watermark: "map",
    iconBg: "bg-[var(--surface-container)]",
    iconColor: "text-[var(--primary)]",
    valueColor: "text-[var(--on-surface)]",
  },
  {
    id: "ip",
    label: "Indeks Pertanaman",
    value: "IP 200",
    unit: "",
    trend: "Musim Tanam Aktif",
    trendColor: "text-amber-700 bg-amber-50 border-amber-200",
    icon: "agriculture",
    watermark: "grass",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    valueColor: "text-amber-700",
  },
  {
    id: "topografi",
    label: "Dominasi Topografi",
    value: "Datar",
    unit: "– Landai",
    icon: "terrain",
    watermark: "landscape",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    valueColor: "text-[var(--on-surface)]",
  },
];

// ── Macro Scorecard Component ─────────────────────────────────────────────────
// DESIGN_SYS.md Bab 3.A: Icon top-left, Display Metric center-bottom, Watermark at 8% opacity
function MacroScorecard({
  label,
  value,
  unit,
  trend,
  trendColor,
  icon,
  watermark,
  iconBg,
  iconColor,
  valueColor,
}: (typeof MACRO_KPIS)[number]) {
  return (
    <div className="relative bg-white rounded-xl border border-[var(--outline-variant)] shadow-sm p-5 overflow-hidden flex flex-col justify-between min-h-[130px]">
      {/* Top: icon + label */}
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center border border-[var(--outline-variant)] shrink-0`}>
          <Icon name={icon} size={18} className={iconColor} />
        </div>
        <span className="label-caps text-[var(--text-muted)]">{label}</span>
      </div>

      {/* Bottom: value + trend */}
      <div className="mt-3">
        <p className={`display-metric ${valueColor}`}>
          {value}
          {unit && (
            <span className="text-base font-normal text-[var(--text-muted)] ml-1.5">
              {unit}
            </span>
          )}
        </p>
        {trend && (
          <span className={`inline-block mt-1.5 label-caps px-2 py-0.5 rounded-full border ${trendColor}`}>
            {trend}
          </span>
        )}
      </div>

      {/* Watermark icon — DESIGN_SYS.md: 20% opacity, bottom-right */}
      <div className="absolute -right-2 -bottom-2 pointer-events-none select-none opacity-[0.07]">
        <Icon name={watermark} size={80} className="text-[var(--on-surface)]" />
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function AnalyticsDashboard() {
  return (
    <div className="w-full h-full overflow-y-auto bg-[var(--surface-container-low)]">
      <div className="max-w-7xl mx-auto p-6 pb-16 space-y-8">

        {/* ── Welcome / Context Block ─────────────────────────────────────── */}
        <div>
          <h3 className="headline-lg text-[var(--on-surface)] mb-1">
            Ikhtisar Wilayah
          </h3>
          <p className="body-base text-[var(--secondary)] max-w-3xl">
            Pemantauan data spasial dan metrik utama Desa Rejoagung untuk mendukung pengambilan keputusan strategis · KKN-PPM UGM 2026.
          </p>
        </div>

        {/* ── Macro Scorecard Row — DESIGN_SYS.md Bab 3.A ───────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MACRO_KPIS.map((kpi) => (
            <MacroScorecard key={kpi.id} {...kpi} />
          ))}
        </div>

        {/* ── Composite Bento Grid: Aset & Education side-by-side ─────────── */}
        {/* DESIGN_SYS.md Bab 3.B: Composite Chart Cards spanning 6 cols each */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-6">
            <AssetMetrics />
          </div>
          <div className="col-span-12 xl:col-span-6">
            <EducationMetrics />
          </div>
        </div>

        {/* ── Land Potential — Full Width ──────────────────────────────────── */}
        <LandPotentialMetrics />

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <div className="border-t border-[var(--outline-variant)] pt-4">
          <p className="micro-copy text-[var(--text-muted)] text-center">
            ⓘ Data merupakan hasil inventarisasi dan analisis spasial oleh Tim Geodesi & IT KKN-PPM UGM 2026.
            Data bertanda <strong>* estimasi</strong> bersifat sementara dan akan diperbarui setelah validasi lapangan.
          </p>
        </div>

      </div>
    </div>
  );
}