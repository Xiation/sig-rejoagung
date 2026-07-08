# Code: PotensiLayer + LandPotentialMetrics Revamp

Berdasarkan `TRD_LandPotential.md` — implementasi dua hal:
1. **`LandPotentialMetrics.tsx`** — dirombak ke Macro Overview (4 section sesuai TRD)
2. **`PotensiLayer.tsx`** — dibangun dari skeleton ke Choropleth + Modal

---

## ⚙️ Pre-requisite: Install shadcn/ui Badge

TRD menyebut `<Badge variant="destructive">` untuk Threat Matrix.
Pastikan Badge sudah tersedia:

```bash
npx shadcn@latest add badge
```

---

## File 1: `src/components/analytics/LandPotentialMetrics.tsx` — [MODIFY]

Ganti seluruh isi file dengan kode di bawah ini.
Arsitektur baru: **Macro Overview** (4 section: Scorecards, Resource Frequency Bar Chart, Threat Matrix, Executive Summary).
**Tidak ada lagi** per-dusun card grid.

```tsx
// src/components/analytics/LandPotentialMetrics.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer,
} from "recharts";

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
            className="border shadow-sm"
            style={{ backgroundColor: stat.bgColor, borderColor: stat.borderColor }}
          >
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
                  className="text-3xl font-bold text-gray-900 leading-none"
                  style={{ color: stat.accentColor }}
                >
                  {stat.value}
                  {stat.unit && (
                    <span className="text-lg font-medium text-gray-500 ml-1">
                      {stat.unit}
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* B. Resource Frequency Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Frekuensi Distribusi Sektor SDA antar Dusun
          </CardTitle>
          <p className="text-xs text-gray-400 mt-0.5">
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
              <Tooltip
                formatter={(value) => [`${value} dari 4 dusun`, "Distribusi"]}
              />
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
      <Card className="border-red-100">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            ⚠️ Matriks Identifikasi Ancaman SDA
          </CardTitle>
          <p className="text-xs text-gray-400 mt-0.5">
            Dikompilasi dari seluruh ancaman lintas 4 dusun — perlu prioritas mitigasi
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {threats.map((threat) => (
              <Badge key={threat} variant="destructive" className="text-xs font-medium">
                {threat}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* D. Executive Policy Summary */}
      <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r-lg">
        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">
          💡 Sintesis Kebijakan Strategis 2026
        </p>
        <p className="text-sm text-emerald-900 leading-relaxed">{executiveSummary}</p>
        <p className="text-xs text-emerald-600 mt-2">
          Untuk analisis mendalam per dusun, gunakan Peta Interaktif → Modul Potensi Lahan
        </p>
      </div>
    </div>
  );
}
```

---

## File 2: `src/components/map/content/LandModalContent.tsx` — [NEW]

Buat folder `src/components/map/content/` terlebih dahulu, lalu buat file ini.
Ini adalah child component khusus untuk menampilkan detail GeoJSON potensi lahan di modal.

```tsx
// src/components/map/content/LandModalContent.tsx

interface LandModalContentProps {
  data: {
    dusun?: string;
    "Tingkat Potensi Ekonomi"?: string;
    "Jenis Tanah"?: string;
    "pH Tanah"?: number | string;
    "Topografi"?: string;
    "Elevasi Rata-rata (mdpl)"?: number | string;
    "Kualitas Air"?: string;
    "Komoditas Pertanian"?: string;
    "Jenis Tanaman"?: string;
    "Komoditas Perkebunan"?: string;
    "Horikultura"?: string;
    "Tanaman Obat (TOGA)"?: string;
    "Jenis Hewan Ternak"?: string;
    "Jenis Ikan Ternak"?: string;
    "Sistem Budidaya Ikan"?: string;
    "Energi Terbarukan"?: string;
    "Potensi Agrowisata"?: string;
    "Kerajinan Lokal"?: string;
    "Ancaman SDA"?: string;
    "Rekomendasi"?: string;
    [key: string]: unknown;
  };
}

const NA = "Data tidak spesifik";

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <span className="text-sm text-gray-800">{value ?? NA}</span>
    </div>
  );
}

export default function LandModalContent({ data }: LandModalContentProps) {
  const level = data["Tingkat Potensi Ekonomi"] ?? "";
  const isSangatTinggi = level === "Sangat Tinggi";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Dusun {data.dusun ?? "—"}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">Potensi Lahan & SDA</p>
        </div>
        {level && (
          <span
            className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 mt-1"
            style={{
              backgroundColor: isSangatTinggi ? "#dcfce7" : "#dbeafe",
              color: isSangatTinggi ? "#15803d" : "#1d4ed8",
            }}
          >
            🌟 Potensi {level}
          </span>
        )}
      </div>

      <hr className="border-gray-100" />

      {/* Section 1: Profil Geografis & Tanah */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          🗺️ Profil Geografis & Tanah
        </p>
        <div className="grid grid-cols-2 gap-3">
          <InfoRow label="Jenis Tanah" value={data["Jenis Tanah"]} />
          <InfoRow label="pH Tanah" value={data["pH Tanah"]} />
          <InfoRow label="Topografi" value={data["Topografi"]} />
          <InfoRow label="Elevasi Rata-rata" value={data["Elevasi Rata-rata (mdpl)"] ? `${data["Elevasi Rata-rata (mdpl)"]} mdpl` : undefined} />
          <InfoRow label="Kualitas Air" value={data["Kualitas Air"]} />
          <InfoRow label="Sumber Air" value={data["Sumber Air"] as string} />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Section 2: Inventaris Komoditas */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          📦 Inventaris Komoditas
        </p>

        {/* Pertanian & Kebun */}
        <div className="bg-green-50 rounded-lg p-3 space-y-2">
          <p className="text-xs font-semibold text-green-700">🌾 Pertanian & Kebun</p>
          <InfoRow label="Komoditas Pertanian" value={data["Komoditas Pertanian"]} />
          <InfoRow label="Jenis Tanaman" value={data["Jenis Tanaman"]} />
          <InfoRow label="Komoditas Perkebunan" value={data["Komoditas Perkebunan"]} />
        </div>

        {/* Hortikultura & TOGA */}
        <div className="bg-lime-50 rounded-lg p-3 space-y-2">
          <p className="text-xs font-semibold text-lime-700">🍅 Hortikultura & TOGA</p>
          <InfoRow label="Hortikultura" value={data["Horikultura"]} />
          <InfoRow label="Tanaman Obat (TOGA)" value={data["Tanaman Obat (TOGA)"]} />
        </div>

        {/* Peternakan & Perikanan */}
        <div className="bg-blue-50 rounded-lg p-3 space-y-2">
          <p className="text-xs font-semibold text-blue-700">🐟 Peternakan & Perikanan</p>
          <InfoRow label="Hewan Ternak" value={data["Jenis Hewan Ternak"]} />
          <InfoRow label="Ikan Ternak" value={data["Jenis Ikan Ternak"]} />
          <InfoRow label="Sistem Budidaya" value={data["Sistem Budidaya Ikan"]} />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Section 3: Infrastruktur & Ekonomi */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          ⚡ Infrastruktur & Ekonomi
        </p>
        <div className="space-y-2">
          <InfoRow label="Energi Terbarukan" value={data["Energi Terbarukan"]} />
          <InfoRow label="Potensi Agrowisata" value={data["Potensi Agrowisata"]} />
          <InfoRow label="Kerajinan Lokal" value={data["Kerajinan Lokal"]} />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Section 4: Actionable Insights */}
      <div className="space-y-3">
        {/* Ancaman */}
        <div className="bg-red-50 border border-red-100 rounded-lg p-3">
          <p className="text-xs font-semibold text-red-700 mb-1.5 flex items-center gap-1.5">
            ⚠️ Ancaman SDA
          </p>
          <p className="text-sm text-red-800 leading-relaxed">
            {data["Ancaman SDA"] ?? NA}
          </p>
        </div>

        {/* Rekomendasi */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
          <p className="text-xs font-semibold text-emerald-700 mb-1.5 flex items-center gap-1.5">
            💡 Rekomendasi Kebijakan
          </p>
          <p className="text-sm text-emerald-900 leading-relaxed">
            {data["Rekomendasi"] ?? NA}
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## File 3: `src/components/map/layers/PotensiLayer.tsx` — [MODIFY]

Ganti seluruh isi file placeholder dengan implementasi penuh di bawah ini.

```tsx
// src/components/map/layers/PotensiLayer.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { GeoJSON, Pane } from "react-leaflet";
import type { FeatureCollection, Feature } from "geojson";
import type { Layer, PathOptions, LeafletMouseEvent } from "leaflet";
import LandModalContent from "../content/LandModalContent";

// ─── CHOROPLETH COLOR MAP ────────────────────────────────────────────────────
// Warna unik per Dusun — pastel fill, konsisten untuk legend juga

const DUSUN_COLORS: Record<string, string> = {
  Sumberagung: "#86efac",         // Green-300
  "Sumberagung Kidul": "#93c5fd", // Blue-300
  Sumbergroto: "#fde68a",         // Amber-200
  "Sumbergroto Kidul": "#c4b5fd", // Violet-300
};

const DEFAULT_STYLE: PathOptions = {
  fillColor: "#d1d5db",
  color: "#6b7280",
  weight: 2,
  fillOpacity: 0.4,
};

const HOVER_STYLE: PathOptions = {
  weight: 3,
  fillOpacity: 0.65,
};

function getDusunStyle(dusunName: string): PathOptions {
  const fill = DUSUN_COLORS[dusunName] ?? "#d1d5db";
  return {
    fillColor: fill,
    color: "#374151",
    weight: 2,
    fillOpacity: 0.45,
  };
}

// ─── LEGEND COMPONENT ────────────────────────────────────────────────────────

function DusunLegend() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "32px",
        left: "16px",
        zIndex: 1000,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
        borderRadius: "12px",
        padding: "12px 16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        pointerEvents: "none",
        minWidth: "180px",
      }}
    >
      <p
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "#374151",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "8px",
        }}
      >
        🗺️ Potensi Lahan per Dusun
      </p>
      {Object.entries(DUSUN_COLORS).map(([name, color]) => (
        <div
          key={name}
          style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}
        >
          <span
            style={{
              display: "inline-block",
              width: "14px",
              height: "14px",
              borderRadius: "3px",
              backgroundColor: color,
              border: "1px solid #9ca3af",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: "12px", color: "#4b5563" }}>{name}</span>
        </div>
      ))}
      <p style={{ fontSize: "10px", color: "#9ca3af", marginTop: "8px" }}>
        Klik poligon untuk detail SDA
      </p>
    </div>
  );
}

// ─── MODAL WRAPPER ───────────────────────────────────────────────────────────

function LandModal({
  data,
  onClose,
}: {
  data: Record<string, unknown> | null;
  onClose: () => void;
}) {
  if (!data) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto relative animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 pt-4 pb-3 flex items-center justify-between rounded-t-2xl sm:rounded-t-xl z-10">
          <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto sm:hidden" />
          <p className="hidden sm:block text-xs text-gray-400 font-medium uppercase tracking-wide">
            Detail Potensi Dusun
          </p>
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-700 transition-colors text-xl leading-none"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <LandModalContent data={data as Parameters<typeof LandModalContent>[0]["data"]} />
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-3">
          <button
            onClick={onClose}
            className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
          >
            Tutup Detail
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function PotensiLayer() {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [selectedDusun, setSelectedDusun] = useState<Record<string, unknown> | null>(null);

  // Fetch GeoJSON
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/data/potensi_SDA_data/dusun.geojson");
        if (res.ok) {
          const json: FeatureCollection = await res.json();
          setGeoData(json);
        } else {
          console.error("PotensiLayer: Failed to fetch dusun.geojson", res.status);
        }
      } catch (err) {
        console.error("PotensiLayer: Network error fetching dusun.geojson", err);
      }
    };
    fetchData();
  }, []);

  // Style function — dipanggil per feature
  const styleFeature = useCallback((feature?: Feature): PathOptions => {
    const name = feature?.properties?.dusun ?? "";
    return getDusunStyle(name);
  }, []);

  // onEachFeature — attach event listener
  const onEachFeature = useCallback(
    (feature: Feature, layer: Layer) => {
      const dusunName = feature?.properties?.dusun ?? "Dusun";

      // Hover effect
      layer.on({
        mouseover: (e: LeafletMouseEvent) => {
          const target = e.target;
          target.setStyle({ ...HOVER_STYLE });
          target.bringToFront();
        },
        mouseout: (e: LeafletMouseEvent) => {
          const target = e.target;
          target.setStyle(getDusunStyle(dusunName));
        },
        // Click → buka modal
        click: () => {
          setSelectedDusun(feature.properties as Record<string, unknown>);
        },
      });

      // Tooltip ringan saat hover
      layer.bindTooltip(
        `<strong>${dusunName}</strong><br/><span style="font-size:11px; color:#6b7280">Klik untuk detail SDA</span>`,
        {
          sticky: true,
          direction: "top",
          className: "leaflet-tooltip-custom",
        }
      );
    },
    []
  );

  if (!geoData) return null;

  return (
    <>
      {/* Choropleth Polygon Layer */}
      <Pane name="potensi-polygons" style={{ zIndex: 400 }}>
        <GeoJSON
          key={JSON.stringify(geoData)}
          data={geoData}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      </Pane>

      {/* Legend */}
      <DusunLegend />

      {/* Detail Modal */}
      <LandModal
        data={selectedDusun}
        onClose={() => setSelectedDusun(null)}
      />
    </>
  );
}
```

---

## Checklist Implementasi

**Pre-requisite:**
- [ ] Jalankan `npx shadcn@latest add badge` (untuk `<Badge>` di `LandPotentialMetrics`)
- [ ] Pastikan `src/components/map/content/` folder belum ada (akan kita buat baru)

**Urutan implementasi:**
- [ ] **Step 1:** Buat folder `src/components/map/content/`
- [ ] **Step 2:** Buat file `src/components/map/content/LandModalContent.tsx` (kode File 2 di atas)
- [ ] **Step 3:** Ganti isi `src/components/analytics/LandPotentialMetrics.tsx` (kode File 1)
- [ ] **Step 4:** Ganti isi `src/components/map/layers/PotensiLayer.tsx` (kode File 3)

**Verifikasi:**
- [ ] Dashboard Analytics → Section Potensi Lahan: 3 scorecard + bar chart + threat badges + executive summary tampil
- [ ] Peta → Modul Potensi Lahan: 4 poligon choropleth berwarna berbeda muncul
- [ ] Hover poligon: efek darken + tooltip nama dusun muncul
- [ ] Klik poligon: modal slide-up muncul dengan detail lengkap (tanah, komoditas, ancaman, rekomendasi)
- [ ] Klik Tutup: modal menutup, peta kembali normal
- [ ] Console bebas error hydration
