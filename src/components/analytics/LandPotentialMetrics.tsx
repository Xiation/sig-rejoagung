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
import { useState } from "react"
import { produksiPertanian, KATEGORI_LIST, KATEGORI_COLORS } from "@/constants/produksiPertanian";
import { resourceFrequency, threats, executiveSummary } from "@/constants/landPotential";


// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function LandPotentialMetrics() {
const [activeKategori, setActiveKategori] = useState<string>(KATEGORI_LIST[3]);
const produksiKategori = produksiPertanian
                        .filter((item) => item.kategori === activeKategori)
                        .sort((a, b) => b.jumlah - a.jumlah);
const totalTonaseKategori = produksiKategori.reduce((sum, item) => sum + item.jumlah, 0);

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

      {/* ── Produksi Pertanian & Perkebunan ──────────────────────────────── */}
      <div className="border-t border-[var(--outline-variant)]/60 p-5">
        <div className="flex items-center gap-2 mb-1">
          <Icon name="grass" size={16} className="text-[var(--primary)]" />
          <p className="label-caps text-[var(--text-muted)]">
            Produksi Pertanian & Perkebunan (Ton/Tahun)
          </p>
          <span className="ml-auto label-caps px-2.5 py-1 rounded-full bg-[var(--surface-container)] text-[var(--on-surface)] border border-[var(--outline-variant)]">
            Total {totalTonaseKategori.toLocaleString("id-ID")} ton
          </span>
        </div>
        <p className="micro-copy text-[var(--text-muted)] mb-3">
          Rekapitulasi hasil produksi per komoditas — pilih kategori untuk melihat rincian
        </p>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 mb-4">
          {KATEGORI_LIST.map((kategori) => (
            <button
              key={kategori}
              type="button"
              onClick={() => setActiveKategori(kategori)}
              className={`label-caps px-3 py-1.5 rounded-full border transition-colors ${
                activeKategori === kategori
                  ? "bg-emerald-50 border-emerald-600 text-emerald-600"
                  : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              {kategori}
            </button>
          ))}
        </div>

        {/* Scrollable horizontal bar chart — semua item tampil, tidak di-top-N-kan */}
        <div className="max-h-72 overflow-y-auto">
          <ResponsiveContainer width="100%" height={Math.max(produksiKategori.length * 32, 120)}>
            <BarChart
              data={produksiKategori}
              layout="vertical"
              margin={{ top: 4, right: 24, bottom: 4, left: 8 }}
            >
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="komoditas"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                width={110}
              />
              <Tooltip content={<CustomTooltip unit="ton" />} />
              <Bar dataKey="jumlah" radius={[0, 4, 4, 0]} maxBarSize={18}>
                {produksiKategori.map((entry) => (
                  <Cell key={entry.komoditas} fill={KATEGORI_COLORS[activeKategori]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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