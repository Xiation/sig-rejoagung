// src/components/analytics/EducationMetrics.tsx
// Phase 3 — Composite Card: header + key metrics + embedded bar chart + coverage bar
// DESIGN_SYS.md Bab 3.B

"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer,
} from "recharts";
import { Badge } from "../ui/badge";
import Icon from "@/components/ui/Icon";
import CustomTooltip from "./customTooltip";
import { SEKOLAH_DATA, JENJANG_COLORS, COVERAGE_INDEX_ESTIMASI } from "@/constants/sekolahData";

// ─── DERIVED DATA (dari SEKOLAH_DATA master, src/constants/sekolahData.ts) ────
const SEKOLAH_LIST = Object.values(SEKOLAH_DATA);
const totalLembaga = SEKOLAH_LIST.length;
const coverageIndex = COVERAGE_INDEX_ESTIMASI;

// Bucket varian jenjang (SD/MI → SD, SMP/MTs → SMP) ke 5 kategori chart
function bucketJenjang(jenjang: string): string {
  if (jenjang.includes("SD")) return "SD";
  if (jenjang.includes("SMP")) return "SMP";
  return jenjang; // TK, SMK, Pesantren sudah kanonik
}

const JENJANG_ORDER = ["TK", "SD", "SMP", "SMK", "Pesantren"];
const tierCounts = SEKOLAH_LIST.reduce<Record<string, number>>((acc, s) => {
  const tier = bucketJenjang(s.jenjang);
  acc[tier] = (acc[tier] ?? 0) + 1;
  return acc;
}, {});
const tierData = JENJANG_ORDER.map((jenjang) => ({
  jenjang,
  jumlah: tierCounts[jenjang] ?? 0,
  color: JENJANG_COLORS[jenjang] ?? "#6b7280",
}));

const ZONA_ORDER: Array<{ label: string; color: string }> = [
  { label: "< 5 Menit", color: "#10b981" },
  { label: "5–10 Menit", color: "#f59e0b" },
  { label: "> 10 Menit", color: "#ef4444" },
];
const zonaCounts = SEKOLAH_LIST.reduce<Record<string, number>>((acc, s) => {
  acc[s.zonaWaktu] = (acc[s.zonaWaktu] ?? 0) + 1;
  return acc;
}, {});
const zonaStats = ZONA_ORDER.map((z) => ({ label: z.label, count: zonaCounts[z.label] ?? 0, color: z.color }));
const zonaAman = SEKOLAH_LIST.filter((s) => s.zonaWaktu !== "> 10 Menit").length;

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function EducationMetrics() {
  return (
    <div className="bg-white rounded-xl border border-[var(--outline-variant)] shadow-sm flex flex-col h-full">

      {/* ── Composite Header ──────────────────────────────────────────────── */}
      <div className="px-5 py-4 border-b border-[var(--outline-variant)]/60 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100 shrink-0">
          <Icon name="school" size={18} className="text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="section-header text-[var(--on-surface)] truncate">Aksesibilitas Pendidikan</p>
        </div>
        <span className="shrink-0 label-caps px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
          {totalLembaga} lembaga
        </span>
      </div>

      {/* ── Key Metrics Row ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-px bg-[var(--outline-variant)]/30 border-b border-[var(--outline-variant)]/60">
        {/* Total Sekolah */}
        <div className="bg-white px-4 py-3 col-span-1">
          <p className="micro-copy text-[var(--text-muted)]">Total Lembaga</p>
          <p className="text-2xl font-extrabold tracking-tight text-[var(--on-surface)] font-[var(--font-geist-sans)]">{totalLembaga}</p>
        </div>
        {/* Coverage */}
        <div className="bg-white px-4 py-3 col-span-1">
          <p className="micro-copy text-[var(--text-muted)]">Cakupan Akses</p>
          <p className="text-2xl font-extrabold tracking-tight text-[var(--primary)] font-[var(--font-geist-sans)]">{coverageIndex}%</p>
        </div>
        {/* Zona aman */}
        <div className="bg-white px-4 py-3 col-span-1">
          <p className="micro-copy text-[var(--text-muted)]">Zona Aman</p>
          <p className="text-2xl font-extrabold tracking-tight text-emerald-600 font-[var(--font-geist-sans)]">{zonaAman}</p>
          <p className="micro-copy text-[var(--text-muted)]">sekolah ≤ 10 mnt</p>
        </div>
      </div>

      {/* ── Chart + Coverage Bar ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 divide-x divide-[var(--outline-variant)]/40 flex-1">

        {/* Left: Bar Chart — Distribusi Jenjang */}
        <div className="p-4 flex flex-col">
          <p className="label-caps text-[var(--text-muted)] mb-2">Per Jenjang</p>
          <div className="flex-1 min-h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tierData} margin={{ top: 4, right: 4, bottom: 16, left: -24 }}>
                <XAxis
                  dataKey="jenjang"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip unit="lembaga" />} />
                <Bar dataKey="jumlah" radius={[4, 4, 0, 0]} maxBarSize={28}>
                  {tierData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Zona Waktu Tempuh */}
        <div className="p-4 flex flex-col gap-2">
          <p className="label-caps text-[var(--text-muted)] mb-1">Waktu Tempuh</p>
          {/* Zona summary */}
          <div className="space-y-2">
            {zonaStats.map((z) => (
              <div key={z.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: z.color }} />
                <div className="flex-1 bg-[var(--surface-container-low)] rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${(z.count / totalLembaga) * 100}%`, background: z.color }}
                  />
                </div>
                <span className="micro-copy text-[var(--text-muted)] shrink-0">{z.count} sekolah</span>
              </div>
            ))}
          </div>

          {/* Coverage progress bar */}
          <div className="mt-3 pt-3 border-t border-[var(--outline-variant)]/50">
            <div className="flex justify-between mb-1">
              <p className="micro-copy text-[var(--text-muted)]">Coverage Index</p>
              <Badge className="bg-amber-50 text-amber-700 border border-amber-200 label-caps">
                * estimasi
              </Badge>
            </div>
            <div className="w-full bg-[var(--surface-container)] rounded-full h-2">
              <div
                className="h-2 rounded-full bg-[var(--primary)] transition-all duration-700"
                style={{ width: `${coverageIndex}%` }}
              />
            </div>
            <p className="micro-copy text-[var(--text-muted)] mt-1">
              {coverageIndex}% pemukiman dalam zona &lt; 10 menit
            </p>
          </div>
        </div>
      </div>

      {/* ── Metadata Footer ──────────────────────────────────────────────────── */}
      <div className="px-5 py-3 border-t border-[var(--outline-variant)]/60">
        <p className="micro-copy text-[var(--text-muted)]">
          Sumber: Network Analysis Service Area · Sekolah.geojson · KKN-PPM UGM 2026
        </p>
      </div>

    </div>
  );
}