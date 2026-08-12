// src/constants/assetsSummary.ts
// from: public/data/Database_Aset_Desa_Rejoagung - RINGKASAN.csv
// CATATAN: kolom % di CSV sumber salah hitung (masih pakai pembagi total lama/22, bukan 44) —
// nilai `persen` di bawah ini DIHITUNG ULANG manual (jumlah / 44 * 100), bukan disalin mentah dari CSV.

export const assetsSummary = [
    {
    id: "total-aset",
    label: "Total Aset Terdata",
    value: "44",
    unit: "aset",
    icon: "account_balance",
    bgColor: "#eff6ff",
    borderColor: "#bfdbfe",
  },
  {
    id: "total-luas",
    label: "Total Luas Tanah",
    value: "44,768",
    unit: "m²",
    icon: "square_foot",
    bgColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  {
    id: "jumlah-kategori",
    label: "Jumlah Kategori",
    value: "4",
    unit: "kategori",
    icon: "category",
    bgColor: "#faf5ff",
    borderColor: "#ddd6fe",
  },
  {
    id: "belum-verifikasi",
    label: "Belum Diverifikasi",
    value: "7",
    unit: "aset",
    icon: "warning",
    bgColor: "#fffbeb",
    borderColor: "#fde68a",
  },
];

// nama = satu-satunya taxonomy kategori aset, dipakai bareng oleh AssetMetrics.tsx (chart)
// dan AsetfasumModal.tsx (deriveCategory, lookup icon+accentClass by nama)
export const categoryData = [
    { nama: "Fasilitas Pendidikan", jumlah: 14, luas: "10,118", persen: 31.8, color: "#10b981", icon: "school", accentClass: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { nama: "Fasilitas Keagamaan", jumlah: 27, luas: "24,458", persen: 61.4, color: "#2563eb", icon: "mosque", accentClass: "text-blue-600 bg-blue-50 border-blue-200" },
  { nama: "Olahraga", jumlah: 2, luas: "10,192", persen: 4.5, color: "#8b5cf6", icon: "sports_soccer", accentClass: "text-violet-600 bg-violet-50 border-violet-200" },
  { nama: "Fasilitas Pemerintahan", jumlah: 1, luas: "0", persen: 2.3, color: "#ea580c", icon: "gavel", accentClass: "text-orange-600 bg-orange-50 border-orange-200" },
  // Fallback bucket — belum ada data GeoJSON terpisah, jumlah/luas/persen placeholder sampai data riil masuk
  { nama: "Fasilitas Umum / Sosial", jumlah: 0, luas: "0", persen: 0, color: "#64748b", icon: "location_city", accentClass: "text-slate-600 bg-slate-50 border-slate-200" },
];

export const ownershipData = [
  { status: "Hak Milik", jumlah: 25, persen: 56.8, color: "#059669" },
  { status: "Belum Terverifikasi", jumlah: 6, persen: 13.6, color: "#f59e0b" },
  { status: "Hak Wakaf", jumlah: 8, persen: 18.2, color: "#64748b" },
  { status: "Kosong / Tanpa Dokumen", jumlah: 4, persen: 9.1, color: "#e11d48" },
  { status: "Hak Pakai", jumlah: 1, persen: 2.3, color: "#94a3b8" },
];