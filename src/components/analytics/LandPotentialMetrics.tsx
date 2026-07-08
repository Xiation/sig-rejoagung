// src/components/analytics/LandPotentialMetrics.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./customTooltip";

// ─── DATA ────────────────────────────────────────────────────────────────────
// Hardcoded — diekstrak dari dusun.geojson (4 features)

// A. Macro Scorecards
const macroStats = [
  {
    id: "dusun",
    label: "Dusun Terpetakan",
    value: "4",
    unit: "dusun",
    icon: "🗺️",
    accentColor: "#16a34a",
    bgColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  {
    id: "ip",
    label: "Rata-rata Indeks Pertanaman",
    value: "IP 200",
    unit: "",
    icon: "🌾",
    accentColor: "#d97706",
    bgColor: "#fffbeb",
    borderColor: "#fde68a",
  },
  {
    id: "topografi",
    label: "Dominasi Topografi",
    value: "Datar",
    unit: "– Landai",
    icon: "⛰️",
    accentColor: "#7c3aed",
    bgColor: "#faf5ff",
    borderColor: "#ddd6fe",
  },
];

// B. Resource Frequency Chart
// Menghitung seberapa banyak dusun yang memiliki setiap sektor/infrastruktur
const resourceFrequency = [
  { nama: "PLTS Atap", jumlah: 4, color: "#f59e0b" },       // Semua 4 dusun
  { nama: "Padi", jumlah: 4, color: "#10b981" },             // Semua 4 dusun
  { nama: "Sapi", jumlah: 2, color: "#ef4444" },             // Sumberagung + Sumberagung Kidul
  { nama: "Nila", jumlah: 3, color: "#3b82f6" },             // 3 dusun
  { nama: "Biogas", jumlah: 3, color: "#8b5cf6" },           // 3 dusun
  { nama: "Kakao", jumlah: 2, color: "#92400e" },            // Sumberagung + Sumberagung Kidul
  { nama: "Udang Galah", jumlah: 2, color: "#0891b2" },      // Sumbergroto + Sumbergroto Kidul
  { nama: "Agrowisata", jumlah: 4, color: "#16a34a" },       // Semua 4 dusun
];

// C. Threat Identification — diekstrak dari "Ancaman SDA" tiap dusun
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

// D. Executive Policy Summary — hardcoded synthesis
const executiveSummary =
  "Fokus strategis 2026: Optimalisasi Potensi Desa Rejoagung difokuskan pada intensifikasi pertanian lahan basah dan hortikultura, didukung oleh transisi menuju energi terbarukan komunal (PLTS & Biogas), serta hilirisasi produk kerajinan lokal dan ekowisata berkelanjutan.";

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function LandPotentialMetrics() {
  return (
    <div className="space-y-6">
      {/* A. Macro Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {macroStats.map((stat) => (
          <Card
            key={stat.id}
            className="bg-white border border-slate-100 shadow-sm shadow-emerald-900/5 rounded-xl overflow-hidden"
          >
            {/* Colored top-border accent */}
            <div className="h-1 w-full" style={{ backgroundColor: stat.accentColor }} />
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{stat.icon}</span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: stat.accentColor + "20",
                    color: stat.accentColor,
                  }}
                >
                  2026
                </span>
              </div>
              <div>
                <p
                  className="display-metric leading-none"
                  style={{ color: stat.accentColor }}
                >
                  {stat.value}
                  {stat.unit && (
                    <span className="font-body text-lg font-medium text-slate-400 ml-1">
                      {stat.unit}
                    </span>
                  )}
                </p>
                <p className="font-body text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* B. Resource Frequency Bar Chart */}
      <Card className="bg-white border border-slate-100 shadow-sm shadow-emerald-900/5 rounded-xl">
        <CardHeader>
          <CardTitle className="label-caps text-slate-500">
            Frekuensi Distribusi Sektor SDA antar Dusun
          </CardTitle>
          <p className="font-body text-xs text-slate-400 mt-0.5">
            Menunjukkan seberapa banyak dusun yang memiliki sektor/komoditas tertentu (maks. 4)
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={resourceFrequency}
              margin={{ top: 5, right: 10, bottom: 40, left: 0 }}
            >
              <XAxis
                dataKey="nama"
                tick={{ fontSize: 11 }}
                angle={-25}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                allowDecimals={false}
                domain={[0, 4]}
                tickCount={5}
                label={{
                  value: "Jumlah Dusun",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 11, fill: "#9ca3af" },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="jumlah" radius={[4, 4, 0, 0]}>
                {resourceFrequency.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* C. Threat Identification Matrix */}
      <Card className="bg-white border border-slate-100 shadow-sm shadow-emerald-900/5 rounded-xl border-rose-100">
        <CardHeader>
          <CardTitle className="label-caps text-slate-500 flex items-center gap-2">
            ⚠️ Matriks Identifikasi Ancaman SDA
          </CardTitle>
          <p className="font-body text-xs text-slate-400 mt-0.5">
            Dikompilasi dari seluruh ancaman lintas 4 dusun — perlu prioritas mitigasi
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {threats.map((threat) => (
              <Badge
                key={threat}
                className="bg-rose-50 text-rose-600 border border-rose-100 font-body text-xs font-medium hover:bg-rose-100"
              >
                {threat}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* D. Executive Policy Summary */}
      <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r-lg">
        <p className="label-caps text-emerald-700 mb-2">
          💡 Sintesis Kebijakan Strategis 2026
        </p>
        <p className="font-body text-sm text-emerald-900 leading-relaxed">{executiveSummary}</p>
        <p className="font-body text-xs text-emerald-600 mt-2">
          Untuk analisis mendalam per dusun, gunakan Peta Interaktif → Modul Potensi Lahan
        </p>
      </div>
    </div>
  );
}