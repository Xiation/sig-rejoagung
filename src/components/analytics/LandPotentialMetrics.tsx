// src/components/analytics/LandPotentialMetrics.tsx
// Phase 3 — Full-width Composite Card: header + resource chart + threat matrix + policy
// MacroStats telah dipindah ke analyticsDashboard.tsx (promoted to Macro Scorecard Row)
// DESIGN_SYS.md Bab 3.B

"use client";

import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer,
} from "recharts";
import Icon from "@/components/ui/Icon";
import CustomTooltip from "./customTooltip";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const resourceFrequency = [
  { nama: "PLTS Atap", jumlah: 4, color: "#f59e0b" },
  { nama: "Padi", jumlah: 4, color: "#10b981" },
  { nama: "Sapi", jumlah: 2, color: "#ef4444" },
  { nama: "Nila", jumlah: 3, color: "#3b82f6" },
  { nama: "Biogas", jumlah: 3, color: "#8b5cf6" },
  { nama: "Kakao", jumlah: 2, color: "#92400e" },
  { nama: "Udang Galah", jumlah: 2, color: "#0891b2" },
  { nama: "Agrowisata", jumlah: 4, color: "#16a34a" },
];

const threats = [
  "Alih Fungsi Lahan",
  "Degradasi Mata Air",
  "Kekeringan Musim Kemarau",
  "Fluktuasi Harga Cabai",
  "Pencemaran Sungai",
  "Perubahan Iklim",
  "Konversi Lahan",
  "Banjir / Genangan",
  "Pencemaran Riparian",
  "Alih Fungsi Lahan Basah",
];

const executiveSummary =
  "Fokus strategis 2026: Optimalisasi Potensi Desa Rejoagung difokuskan pada intensifikasi pertanian lahan basah dan hortikultura, didukung oleh transisi menuju energi terbarukan komunal (PLTS & Biogas), serta hilirisasi produk kerajinan lokal dan ekowisata berkelanjutan.";

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function LandPotentialMetrics() {
  return (
    <div className="bg-white rounded-xl border border-[var(--outline-variant)] shadow-sm flex flex-col">

      {/* ── Composite Header ──────────────────────────────────────────────── */}
      <div className="px-5 py-4 border-b border-[var(--outline-variant)]/60 flex items-center gap-3">
        <div className="w-8 h-8 bg-[var(--surface-container)] rounded-lg flex items-center justify-center border border-[var(--outline-variant)] shrink-0">
          <Icon name="agriculture" size={18} className="text-[var(--primary)]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="section-header text-[var(--on-surface)]">Potensi Lahan & SDA per Dusun</p>
        </div>
        <span className="shrink-0 label-caps px-2.5 py-1 rounded-full bg-[var(--primary-container)] text-[var(--on-primary-container)] border border-emerald-200">
          4 dusun
        </span>
      </div>

      {/* ── Two-Column Body: Chart + Threats ──────────────────────────────── */}
      {/* DESIGN_SYS.md: large chart panel 8 cols + threats 4 cols */}
      <div className="grid grid-cols-12 gap-0 divide-x divide-[var(--outline-variant)]/40">

        {/* Left: Resource Frequency Bar Chart — 8 cols */}
        <div className="col-span-12 lg:col-span-8 p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <p className="label-caps text-[var(--text-muted)]">
              Frekuensi Distribusi Sektor SDA antar Dusun
            </p>
          </div>
          <p className="micro-copy text-[var(--text-muted)] mb-3">
            Menunjukkan seberapa banyak dusun yang memiliki sektor/komoditas tertentu (maks. 4)
          </p>
          <div className="flex-1" style={{ minHeight: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={resourceFrequency}
                margin={{ top: 4, right: 12, bottom: 32, left: -8 }}
              >
                <XAxis
                  dataKey="nama"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  domain={[0, 4]}
                  tickCount={5}
                />
                <Tooltip content={<CustomTooltip unit="dusun" />} />
                <Bar dataKey="jumlah" radius={[4, 4, 0, 0]} maxBarSize={36}>
                  {resourceFrequency.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Threat Matrix — 4 cols */}
        <div className="col-span-12 lg:col-span-4 p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="warning" size={16} className="text-[var(--destructive)]" />
            <p className="label-caps text-[var(--text-muted)]">Matriks Ancaman SDA</p>
          </div>
          <p className="micro-copy text-[var(--text-muted)] mb-3">
            Dikompilasi dari 4 dusun — perlu prioritas mitigasi
          </p>
          <div className="flex flex-wrap gap-2">
            {threats.map((threat) => (
              <Badge
                key={threat}
                className="bg-rose-50 text-rose-600 border border-rose-100 body-base font-medium hover:bg-rose-100 transition-colors"
              >
                {threat}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* ── Executive Policy Summary ──────────────────────────────────────── */}
      <div className="border-t border-[var(--outline-variant)]/60">
        <div className="flex items-start gap-4 p-5 bg-emerald-50/60">
          {/* Icon mark */}
          <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
            <Icon name="gavel" size={20} className="text-[var(--primary)]" />
          </div>
          <div>
            <p className="label-caps text-[var(--primary)] mb-1.5">
              Sintesis Kebijakan Strategis 2026
            </p>
            <p className="body-base text-emerald-900 leading-relaxed max-w-4xl">
              {executiveSummary}
            </p>
            <p className="micro-copy text-[var(--primary)] mt-2">
              Untuk analisis mendalam per dusun, gunakan Peta Interaktif → Modul Potensi Lahan
            </p>
          </div>
        </div>
      </div>

      {/* ── Metadata Footer ───────────────────────────────────────────────── */}
      <div className="px-5 py-3 border-t border-[var(--outline-variant)]/60">
        <p className="micro-copy text-[var(--text-muted)]">
          Sumber: Dusun.geojson · Analisis Potensi SDA Desa Rejoagung · KKN-PPM UGM 2026
        </p>
      </div>

    </div>
  );
}