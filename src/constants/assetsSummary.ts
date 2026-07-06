// src/constants/assetsSummary.ts
// from: Rekapitulasi_aset.csv

export const assetsSummary = [
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
    { nama: "Fasilitas Pendidikan", jumlah: 11, luas: "5,371", persen: 45.5, color: "#10b981" },
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