# Analytics Dashboard — Full Code

Kode lengkap untuk `src/components/analytics/analytics.tsx`.
Data di-hardcode langsung dari `Rekapitulasi_aset.csv` (zero-backend approach).
Tidak menggunakan Recharts — visualisasi menggunakan progress bar Tailwind CSS.

---

## `src/components/analytics/analytics.tsx` — [MODIFY]

```tsx
// src/components/analytics/analytics.tsx
"use client";

// ============================================================
// DATA LAYER — Hardcoded dari Rekapitulasi_aset.csv (2026)
// Tahun 2026 — data bersumber dari INVENTARISASI ASET Desa Rejoagung
// ============================================================

const summaryStats = [
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

const categoryData = [
  {
    nama: "Fasilitas Pendidikan",
    jumlah: 10,
    luas: "5,371",
    persen: 45.5,
    color: "#10b981", // Emerald — konsisten dengan AsetLayer CircleMarker
  },
  {
    nama: "Fasilitas Keagamaan",
    jumlah: 9,
    luas: "6,291",
    persen: 40.9,
    color: "#2563eb", // Blue — konsisten dengan AsetLayer CircleMarker
  },
  {
    nama: "Olahraga",
    jumlah: 2,
    luas: "10,192",
    persen: 9.1,
    color: "#8b5cf6", // Purple
  },
  {
    nama: "Fasilitas Pemerintahan",
    jumlah: 1,
    luas: "0",
    persen: 4.5,
    color: "#ea580c", // Orange — konsisten dengan AsetLayer CircleMarker
  },
];

const ownershipData = [
  { status: "Hak Milik", jumlah: 9, persen: 40.9, color: "#10b981" },
  { status: "Belum Terverifikasi", jumlah: 5, persen: 22.7, color: "#f59e0b" },
  { status: "Hak Wakaf", jumlah: 4, persen: 18.2, color: "#3b82f6" },
  { status: "Kosong / Tanpa Dokumen", jumlah: 3, persen: 13.6, color: "#ef4444" },
  { status: "Hak Pakai", jumlah: 1, persen: 4.5, color: "#8b5cf6" },
];

// ============================================================
// SUB-COMPONENTS
// ============================================================

// Kartu KPI kecil — baris pertama (4 kartu)
function StatCard({
  label,
  value,
  unit,
  icon,
  accentColor,
  bgColor,
  borderColor,
}: (typeof summaryStats)[0]) {
  return (
    <div
      className="rounded-xl border p-5 flex flex-col gap-3 shadow-sm"
      style={{ backgroundColor: bgColor, borderColor: borderColor }}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: accentColor + "20", color: accentColor }}
        >
          2026
        </span>
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 leading-none">
          {value}
          <span className="text-base font-medium text-gray-500 ml-1">{unit}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

// Baris item distribusi kategori dengan progress bar
function CategoryRow({
  nama,
  jumlah,
  luas,
  persen,
  color,
}: (typeof categoryData)[0]) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-gray-700 font-medium">{nama}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-500">
          <span>{luas} m²</span>
          <span
            className="font-bold w-10 text-right"
            style={{ color: color }}
          >
            {jumlah}
          </span>
        </div>
      </div>
      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${persen}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs text-gray-400 text-right">{persen}% dari total</p>
    </div>
  );
}

// Baris item distribusi kepemilikan
function OwnershipRow({
  status,
  jumlah,
  persen,
  color,
}: (typeof ownershipData)[0]) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm text-gray-700">{status}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-24 bg-gray-100 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full"
            style={{ width: `${persen}%`, backgroundColor: color }}
          />
        </div>
        <span className="text-sm font-semibold text-gray-600 w-6 text-right">
          {jumlah}
        </span>
        <span className="text-xs text-gray-400 w-12 text-right">{persen}%</span>
      </div>
    </div>
  );
}

// ============================================================
// MAIN EXPORT
// ============================================================

export default function AnalyticsDashboard() {
  return (
    <div className="p-6 overflow-y-auto h-full bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard Aset Desa Rejoagung
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Rekapitulasi Inventarisasi Aset Tahun 2026 · Sumber: Tim KKN-PPM UGM
        </p>
      </div>

      {/* Baris 1: 4 Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryStats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Baris 2: 2 Detail Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card E — Distribusi Kategori */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">
              Distribusi per Kategori Aset
            </h2>
            <span className="text-xs text-gray-400">Total: 22 aset</span>
          </div>
          <div className="flex flex-col gap-4">
            {categoryData.map((cat) => (
              <CategoryRow key={cat.nama} {...cat} />
            ))}
          </div>
        </div>

        {/* Card F — Status Kepemilikan */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">
              Status Kepemilikan Aset
            </h2>
            <span className="text-xs text-gray-400">Total: 22 aset</span>
          </div>
          {/* Donut-style summary */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {ownershipData.map((o) => (
              <span
                key={o.status}
                className="text-xs px-2 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: o.color + "20",
                  color: o.color,
                }}
              >
                {o.status}: {o.jumlah}
              </span>
            ))}
          </div>
          <div className="flex flex-col">
            {ownershipData.map((o) => (
              <OwnershipRow key={o.status} {...o} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-400 text-center mt-6">
        ⓘ Data merupakan hasil inventarisasi lapangan oleh Tim Geodesi &amp; IT KKN-PPM UGM 2026.
        Beberapa aset masih dalam proses verifikasi dokumen kepemilikan.
      </p>
    </div>
  );
}
```

---

## Checklist Implementasi

- [ ] Salin seluruh kode di atas ke `src/components/analytics/analytics.tsx`
- [ ] Pastikan komponen ini di-import dan di-render di `page.tsx` ketika `currentView === "dashboard"`
- [ ] Jalankan dev server dan navigasi ke Dashboard Analytics
- [ ] Verifikasi 4 KPI cards, progress bar kategori, dan status kepemilikan tampil benar
