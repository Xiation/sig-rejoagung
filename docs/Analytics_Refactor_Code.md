# Analytics Dashboard Refactoring — Full Code

Kode lengkap untuk semua file sesuai `Analytics_Refactor_Plan.md`.
Implementasi dalam urutan: constants → AssetMetrics → EducationMetrics → LandPotentialMetrics → analyticsDashboard (slim-down).

---

## ⚙️ Pre-requisite: Install shadcn/ui Table Component

Sebelum mengisi kode, install komponen `Table` dari shadcn/ui terlebih dahulu dengan perintah berikut di terminal (dari root folder project):

```bash
npx shadcn@latest add table
```

Setelah berhasil, file `src/components/ui/table.tsx` akan muncul otomatis.
Verifikasi dengan mengecek apakah file tersebut ada sebelum melanjutkan ke Step 3.

---

## Step 1: `src/constants/assetsSummary.ts` — [NEW]

Buat folder `src/constants/` terlebih dahulu, lalu buat file ini.

```ts
// src/constants/assetsSummary.ts
// Single source of truth untuk data Aset Desa Rejoagung 2026
// Bersumber dari: Rekapitulasi_aset.csv (Tim KKN-PPM UGM 2026)

export const summaryStats = [
  {
    id: "total-aset",
    label: "Total Aset Terdata",
    value: "22",
    unit: "aset",
    icon: "🏛️",
    accentColor: "#1d4ed8",
    bgColor: "#eff6ff",
    borderColor: "#bfdbfe",
  },
  {
    id: "total-luas",
    label: "Total Luas Tanah",
    value: "21,854",
    unit: "m²",
    icon: "📐",
    accentColor: "#059669",
    bgColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  {
    id: "jumlah-kategori",
    label: "Jumlah Kategori",
    value: "4",
    unit: "kategori",
    icon: "🏷️",
    accentColor: "#7c3aed",
    bgColor: "#faf5ff",
    borderColor: "#ddd6fe",
  },
  {
    id: "belum-verifikasi",
    label: "Belum Diverifikasi",
    value: "8",
    unit: "aset",
    icon: "⚠️",
    accentColor: "#d97706",
    bgColor: "#fffbeb",
    borderColor: "#fde68a",
  },
];

export const categoryData = [
  { nama: "Fasilitas Pendidikan", jumlah: 10, luas: "5,371", persen: 45.5, color: "#10b981" },
  { nama: "Fasilitas Keagamaan", jumlah: 9, luas: "6,291", persen: 40.9, color: "#2563eb" },
  { nama: "Olahraga", jumlah: 2, luas: "10,192", persen: 9.1, color: "#8b5cf6" },
  { nama: "Fasilitas Pemerintahan", jumlah: 1, luas: "0", persen: 4.5, color: "#ea580c" },
];

export const ownershipData = [
  { status: "Hak Milik", jumlah: 9, persen: 40.9, color: "#10b981" },
  { status: "Belum Terverifikasi", jumlah: 5, persen: 22.7, color: "#f59e0b" },
  { status: "Hak Wakaf", jumlah: 4, persen: 18.2, color: "#3b82f6" },
  { status: "Kosong / Tanpa Dokumen", jumlah: 3, persen: 13.6, color: "#ef4444" },
  { status: "Hak Pakai", jumlah: 1, persen: 4.5, color: "#8b5cf6" },
];
```

---

## Step 2: `src/components/analytics/AssetMetrics.tsx` — [NEW]

```tsx
// src/components/analytics/AssetMetrics.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { summaryStats, categoryData, ownershipData } from "@/constants/assetsSummary";

export default function AssetMetrics() {
  return (
    <div className="space-y-6">
      {/* Row 1 — 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat) => (
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
                <p className="text-3xl font-bold text-gray-900 leading-none">
                  {stat.value}
                  <span className="text-base font-medium text-gray-500 ml-1">
                    {stat.unit}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Row 2 — 2 Chart Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel Kiri — Donut Chart: Status Kepemilikan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribusi Status Kepemilikan</CardTitle>
          </CardHeader>
          <CardContent>
            {ownershipData.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                Data tidak tersedia
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={ownershipData}
                    dataKey="jumlah"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {ownershipData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} aset`, "Jumlah"]} />
                  <Legend
                    wrapperStyle={{ flexWrap: "wrap", fontSize: "12px" }}
                    formatter={(value) => (
                      <span className="text-xs text-gray-600">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Panel Kanan — Bar Chart: Distribusi Kategori */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rekapitulasi per Kategori Aset</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                Data tidak tersedia
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={categoryData}
                  margin={{ top: 5, right: 10, bottom: 50, left: 0 }}
                >
                  <XAxis
                    dataKey="nama"
                    tick={{ fontSize: 11 }}
                    angle={-20}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip formatter={(value) => [`${value} aset`, "Jumlah"]} />
                  <Bar dataKey="jumlah" radius={[4, 4, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## Step 3: `src/components/analytics/EducationMetrics.tsx` — [NEW]

> **Pastikan `npx shadcn@latest add table` sudah dijalankan sebelum ini!**

```tsx
// src/components/analytics/EducationMetrics.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer,
  PieChart, Pie, Legend,
} from "recharts";

// ─── DATA (hardcoded) ────────────────────────────────────────────────────────

// Dihitung manual dari sekolah.geojson (8 features)
const tierData = [
  { jenjang: "TK", jumlah: 1, color: "#ec4899" },
  { jenjang: "SD", jumlah: 2, color: "#ef4444" },
  { jenjang: "SMP", jumlah: 1, color: "#3b82f6" },
  { jenjang: "SMK", jumlah: 1, color: "#eab308" },
  { jenjang: "Pesantren", jumlah: 3, color: "#8b5cf6" },
];

// DUMMY — akan diupdate ketika data akreditasi asli tersedia
const akreditasiData = [
  { status: "A (Unggul)", jumlah: 2, color: "#10b981" },
  { status: "B (Baik Sekali)", jumlah: 3, color: "#3b82f6" },
  { status: "C (Baik)", jumlah: 1, color: "#f59e0b" },
  { status: "Belum Terakreditasi", jumlah: 2, color: "#9ca3af" },
];

// Berdasarkan hasil network analysis service area
const travelTimeData = [
  { sekolah: "SMK NU Darussalam", zona: "< 5 Menit" },
  { sekolah: "Ponpes Salaf Darussalam", zona: "< 5 Menit" },
  { sekolah: "SMP AL-Amiriyyah", zona: "< 5 Menit" },
  { sekolah: "Ponpes Darussalam", zona: "5–10 Menit" },
  { sekolah: "SD Negeri 1 Rejoagung", zona: "5–10 Menit" },
  { sekolah: "SD Negeri 2 Rejoagung", zona: "5–10 Menit" },
  { sekolah: "TK Khadijah 203 Rejoagung", zona: "5–10 Menit" },
  { sekolah: "Ponpes Manbaul Ulum", zona: "> 10 Menit" },
];

// DUMMY — estimasi berdasarkan service area coverage
const coverageIndex = 73;

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function EducationMetrics() {
  return (
    <div className="space-y-6">
      {/* Card 1 — Makro: Total Sekolah */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-6 flex items-center gap-6">
          <span className="text-5xl">🏫</span>
          <div>
            <p className="text-5xl font-bold text-gray-900">8</p>
            <p className="text-lg text-gray-600 mt-1">
              Lembaga Pendidikan Terdata di Desa Rejoagung
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Termasuk SD, SMP, SMK, TK, dan Pondok Pesantren · Tahun 2026
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Row — 2 Chart Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 2 — Bar Chart: Distribusi Jenjang */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribusi per Jenjang Pendidikan</CardTitle>
          </CardHeader>
          <CardContent>
            {tierData.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                Data tidak tersedia
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={tierData} margin={{ top: 5, right: 10, bottom: 10, left: 0 }}>
                  <XAxis dataKey="jenjang" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip formatter={(value) => [`${value} lembaga`, "Jumlah"]} />
                  <Bar dataKey="jumlah" radius={[4, 4, 0, 0]}>
                    {tierData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Card 3 — Pie Chart: Distribusi Akreditasi */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              Distribusi Akreditasi
              <span className="text-xs font-normal text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                * data estimasi
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {akreditasiData.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                Data tidak tersedia
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={akreditasiData}
                    dataKey="jumlah"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {akreditasiData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} lembaga`, "Jumlah"]} />
                  <Legend
                    wrapperStyle={{ flexWrap: "wrap", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Card 4 — Travel Time Matrix Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Matriks Waktu Tempuh ke Sekolah</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Lembaga</TableHead>
                <TableHead>Zona Waktu Tempuh</TableHead>
                <TableHead>Indikator</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {travelTimeData.map((row) => {
                const zona = row.zona;
                const color =
                  zona === "< 5 Menit"
                    ? { bg: "#dcfce7", text: "#15803d", dot: "#22c55e" }
                    : zona === "5–10 Menit"
                    ? { bg: "#fef9c3", text: "#854d0e", dot: "#eab308" }
                    : { bg: "#fee2e2", text: "#b91c1c", dot: "#ef4444" };
                return (
                  <TableRow key={row.sekolah}>
                    <TableCell className="font-medium">{row.sekolah}</TableCell>
                    <TableCell>{row.zona}</TableCell>
                    <TableCell>
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full"
                        style={{ backgroundColor: color.bg, color: color.text }}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: color.dot }}
                        />
                        {zona === "< 5 Menit"
                          ? "Akses Baik"
                          : zona === "5–10 Menit"
                          ? "Akses Sedang"
                          : "Perlu Perhatian"}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Card 5 — Accessibility Coverage Index */}
      <Card className="border-l-4 border-l-emerald-500">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Indeks Cakupan Aksesibilitas
            <span className="text-xs font-normal text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              * estimasi
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-end gap-3">
            <p className="text-5xl font-bold text-emerald-600">{coverageIndex}%</p>
            <p className="text-sm text-gray-500 pb-2 leading-snug">
              Estimasi pemukiman dalam<br />
              <strong>zona aman (&lt; 10 menit)</strong> ke sekolah terdekat
            </p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-700"
              style={{
                width: `${coverageIndex}%`,
                background: "linear-gradient(to right, #10b981, #22c55e)",
              }}
            />
          </div>
          <p className="text-xs text-gray-400">
            Dihitung berdasarkan hasil Network Analysis Service Area (5 & 10 Menit) dari Tim Geodesi KKN-PPM UGM 2026.
            Nilai akan diperbarui setelah validasi lapangan selesai.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Step 4: `src/components/analytics/LandPotentialMetrics.tsx` — [NEW]

```tsx
// src/components/analytics/LandPotentialMetrics.tsx
// Data diekstrak dari properties dusun.geojson (4 features)

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// ─── DATA (hardcoded dari dusun.geojson properties) ──────────────────────────

const dusunData = [
  {
    id: "003",
    nama: "Sumberagung",
    potensiEkonomi: "Sangat Tinggi",
    produksiPadi: "6.4 ton/ha",
    ip: "IP 200",
    komoditasPertanian: "Padi Sawah",
    jenisTanaman: "Padi, Jagung, Pisang",
    hortikultura: "Pisang, Pepaya",
    energi: "PLTS Atap, Biogas Ternak",
    ternak: "Sapi, Kambing, Ayam",
    ikan: "Nila, Lele",
    agrowisata: "Wisata Sawah dan Mata Air",
    kerajinan: "Anyaman Bambu, Produk Olahan Kakao",
    rekomendasi: "Intensifikasi SRI, Sambung Samping Kakao, Sertifikasi Organik, PLTS Komunal",
  },
  {
    id: "001",
    nama: "Sumberagung Kidul",
    potensiEkonomi: "Tinggi",
    produksiPadi: "5.8 ton/ha",
    ip: "IP 100",
    komoditasPertanian: "Hortikultura & Peternakan Sapi",
    jenisTanaman: "Cabai, Tomat, Jagung, Ubi Jalar",
    hortikultura: "Cabai Merah, Tomat, Terong, Bawang Merah",
    energi: "Biogas Ternak Sapi, PLTS Atap",
    ternak: "Sapi Potong, Kambing, Domba, Ayam Kampung",
    ikan: "Lele, Gurami",
    agrowisata: "Wisata Kebun dan Peternakan Terpadu",
    kerajinan: "Kerajinan Bambu",
    rekomendasi: "Sistem irigasi tetes, Integrasi tanaman-ternak, Biogas komunal, Sertifikasi GAP hortikultura",
  },
  {
    id: "002",
    nama: "Sumbergroto",
    potensiEkonomi: "Sangat Tinggi",
    produksiPadi: "7.2 ton/ha",
    ip: "IP 300",
    komoditasPertanian: "Padi Sawah Irigasi & Ikan Air Tawar",
    jenisTanaman: "Padi, Melon, Semangka, Edamame, Jagung hibrida",
    hortikultura: "Melon, Semangka, Edamame, Kacang panjang",
    energi: "PLTMH (aliran sungai), PLTS Atap",
    ternak: "Sapi, Itik, Ayam Petelur",
    ikan: "Nila, Lele, Gurami, Udang Galah",
    agrowisata: "Wisata Sawah, Mina Padi, Edukasi Pertanian",
    kerajinan: "Olahan Ikan",
    rekomendasi: "Mina padi massal, PLTMH sungai, Agrowisata Banyuwangi Festival, Ekspor edamame",
  },
  {
    id: "004",
    nama: "Sumbergroto Kidul",
    potensiEkonomi: "Tinggi",
    produksiPadi: "5.5 ton/ha",
    ip: "IP 200",
    komoditasPertanian: "Lahan Basah & Budidaya Perikanan",
    jenisTanaman: "Padi rawa (Inpara 3/8), Pandan wangi, Mendong",
    hortikultura: "Kangkung air, Genjer, Talas",
    energi: "PLTS Atap, Biogas Itik/Ayam",
    ternak: "Itik, Entog, Ayam Kampung",
    ikan: "Nila, Mujair, Udang Galah, Gabus",
    agrowisata: "Ekowisata Lahan Basah, Wisata Riparian",
    kerajinan: "Anyaman Pandan, Tikar Mendong, Kerajinan Bambu",
    rekomendasi: "Varietas Inpara toleran rendaman, Tambak air tawar, Sertifikasi kerajinan pandan ekspor, Konservasi riparian PES",
  },
];

// ─── HELPER ──────────────────────────────────────────────────────────────────

function PotensiBadge({ level }: { level: string }) {
  const isSangatTinggi = level === "Sangat Tinggi";
  return (
    <span
      className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: isSangatTinggi ? "#dcfce7" : "#dbeafe",
        color: isSangatTinggi ? "#15803d" : "#1d4ed8",
      }}
    >
      🌟 Potensi {level}
    </span>
  );
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function LandPotentialMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {dusunData.map((dusun) => (
        <Card key={dusun.id} className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-lg">Dusun {dusun.nama}</CardTitle>
                <CardDescription className="mt-1">
                  {dusun.produksiPadi} · {dusun.ip}
                </CardDescription>
              </div>
              <PotensiBadge level={dusun.potensiEkonomi} />
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 flex-1">
            {/* Zonasi Potensi Utama */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                📦 Zonasi Potensi Utama
              </p>
              <ul className="text-sm text-gray-700 space-y-1 pl-1">
                <li>
                  <span className="text-gray-400">Pertanian:</span>{" "}
                  {dusun.komoditasPertanian}
                </li>
                <li>
                  <span className="text-gray-400">Tanaman:</span>{" "}
                  {dusun.jenisTanaman}
                </li>
                <li>
                  <span className="text-gray-400">Hortikultura:</span>{" "}
                  {dusun.hortikultura}
                </li>
                <li>
                  <span className="text-gray-400">Agrowisata:</span>{" "}
                  {dusun.agrowisata}
                </li>
              </ul>
            </div>

            {/* Energi Terbarukan */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                ⚡ Energi Terbarukan
              </p>
              <p className="text-sm text-gray-700">{dusun.energi}</p>
            </div>

            {/* Peternakan & Perikanan */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                🐟 Peternakan & Perikanan
              </p>
              <p className="text-sm text-gray-700">
                <span className="text-gray-400">Ternak:</span> {dusun.ternak}
              </p>
              <p className="text-sm text-gray-700">
                <span className="text-gray-400">Ikan:</span> {dusun.ikan}
              </p>
            </div>

            {/* Kerajinan Lokal */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                🎨 Kerajinan Lokal
              </p>
              <p className="text-sm text-gray-700">{dusun.kerajinan}</p>
            </div>

            {/* Rekomendasi Kebijakan */}
            <div className="bg-muted/50 p-3 rounded-md border-l-4 border-primary mt-auto">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                💡 Rekomendasi Kebijakan
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{dusun.rekomendasi}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

---

## Step 5: `src/components/analytics/analyticsDashboard.tsx` — [MODIFY]

Hapus seluruh isi file yang lama, ganti dengan yang ini:

```tsx
// src/components/analytics/analyticsDashboard.tsx
"use client";

import AssetMetrics from "./AssetMetrics";
import EducationMetrics from "./EducationMetrics";
import LandPotentialMetrics from "./LandPotentialMetrics";

export default function AnalyticsDashboard() {
  return (
    <div className="w-full h-full overflow-y-auto space-y-10 p-4 md:p-6 pb-12 bg-gray-50">

      {/* Section 1: Aset & Infrastruktur */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">🏛️ Aset & Infrastruktur Desa</h2>
          <p className="text-sm text-gray-500 mt-1">
            Rekapitulasi inventarisasi aset fisik Desa Rejoagung · Tahun 2026
          </p>
        </div>
        <AssetMetrics />
      </section>

      <hr className="border-gray-200" />

      {/* Section 2: Aksesibilitas Pendidikan */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">🏫 Aksesibilitas Pendidikan</h2>
          <p className="text-sm text-gray-500 mt-1">
            Distribusi lembaga pendidikan dan analisis jangkauan spasial
          </p>
        </div>
        <EducationMetrics />
      </section>

      <hr className="border-gray-200" />

      {/* Section 3: Potensi Lahan & SDA */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">🌾 Potensi Lahan & SDA per Dusun</h2>
          <p className="text-sm text-gray-500 mt-1">
            Profil sumber daya alam dan rekomendasi kebijakan ekonomi 4 dusun
          </p>
        </div>
        <LandPotentialMetrics />
      </section>

      {/* Footer */}
      <p className="text-xs text-gray-400 text-center pt-4 pb-2">
        ⓘ Data merupakan hasil inventarisasi dan analisis spasial oleh Tim Geodesi & IT KKN-PPM UGM 2026.
        Data bertanda <strong>* estimasi</strong> bersifat sementara dan akan diperbarui setelah validasi lapangan.
      </p>

    </div>
  );
}
```

---

## Checklist Final Implementasi

**Pre-requisite:**
- [ ] Jalankan: `npx shadcn@latest add table`
- [ ] Verifikasi file `src/components/ui/table.tsx` muncul

**Urutan pembuatan file:**
- [ ] **Step 1:** Buat folder `src/constants/` → buat `assetsSummary.ts`
- [ ] **Step 2:** Buat `src/components/analytics/AssetMetrics.tsx`
- [ ] **Step 3:** Buat `src/components/analytics/EducationMetrics.tsx`
- [ ] **Step 4:** Buat `src/components/analytics/LandPotentialMetrics.tsx`
- [ ] **Step 5:** Replace isi `src/components/analytics/analyticsDashboard.tsx`

**Verifikasi:**
- [ ] Jalankan `npm run dev`
- [ ] Buka Dashboard Analytics di Sidebar
- [ ] Section 1: 4 KPI cards + 2 Recharts muncul
- [ ] Section 2: Macro card + 2 charts + table + coverage index muncul
- [ ] Section 3: 4 dusun cards (2x2 grid) muncul dengan rekomendasi kebijakan
- [ ] Console bebas dari error hydration
