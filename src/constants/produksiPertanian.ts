// src/constants/produksiPertanian.ts
// from: docs/feature/data_produksi_pertanian.md

export const produksiPertanian = [
  // Tanaman Perkebunan
  { komoditas: "Durian", jumlah: 7, kategori: "Perkebunan" },
  { komoditas: "Tembakau", jumlah: 2, kategori: "Perkebunan" },
  { komoditas: "Tebu", jumlah: 1, kategori: "Perkebunan" },
  { komoditas: "Kopi", jumlah: 0.3, kategori: "Perkebunan" },
  { komoditas: "Karet", jumlah: 0.1, kategori: "Perkebunan" },
  { komoditas: "Kelapa Sawit", jumlah: 0.1, kategori: "Perkebunan" },
  { komoditas: "Kakao", jumlah: 0.1, kategori: "Perkebunan" },
  { komoditas: "Teh", jumlah: 0.1, kategori: "Perkebunan" },
  { komoditas: "Kina", jumlah: 0.1, kategori: "Perkebunan" },

  // Tanaman Pangan
  { komoditas: "Padi", jumlah: 2812, kategori: "Pangan" },
  { komoditas: "Jagung", jumlah: 882, kategori: "Pangan" },
  { komoditas: "Kacang Tanah", jumlah: 32, kategori: "Pangan" },
  { komoditas: "Ubi Kayu", jumlah: 26, kategori: "Pangan" },
  { komoditas: "Ubi Jalar", jumlah: 16, kategori: "Pangan" },
  { komoditas: "Talas", jumlah: 6, kategori: "Pangan" },
  { komoditas: "Sukun", jumlah: 6, kategori: "Pangan" },
  { komoditas: "Pete", jumlah: 2, kategori: "Pangan" },
  { komoditas: "Cabe", jumlah: 2, kategori: "Pangan" },

  // Tanaman Buah
  { komoditas: "Semangka", jumlah: 62, kategori: "Buah" },
  { komoditas: "Pepaya", jumlah: 42, kategori: "Buah" },
  { komoditas: "Buah Naga", jumlah: 22, kategori: "Buah" },
  { komoditas: "Pisang", jumlah: 21, kategori: "Buah" },
  { komoditas: "Tomat", jumlah: 12, kategori: "Buah" },
  { komoditas: "Mangga Manalagi", jumlah: 12, kategori: "Buah" },
  { komoditas: "Rambutan", jumlah: 12, kategori: "Buah" },
  { komoditas: "Mangga Harumanis", jumlah: 11, kategori: "Buah" },
  { komoditas: "Durian Montong", jumlah: 8, kategori: "Buah" },
  { komoditas: "Alpukat", jumlah: 7, kategori: "Buah" },
  { komoditas: "Mangga Kuweni", jumlah: 6, kategori: "Buah" },
  { komoditas: "Melon", jumlah: 6, kategori: "Buah" },
  { komoditas: "Jambu", jumlah: 5, kategori: "Buah" },
  { komoditas: "Salak", jumlah: 4, kategori: "Buah" },
  { komoditas: "Mangga Alpukat", jumlah: 2, kategori: "Buah" },
  { komoditas: "Nangka", jumlah: 2, kategori: "Buah" },
  { komoditas: "Jeruk Lokal", jumlah: 1, kategori: "Buah" },
  { komoditas: "Durian Baweh", jumlah: 1, kategori: "Buah" },
  { komoditas: "Durian Musangking", jumlah: 1, kategori: "Buah" },

  // Tanaman Sayur
  { komoditas: "Taoge", jumlah: 97, kategori: "Sayur" },
  { komoditas: "Sayur Terong", jumlah: 68, kategori: "Sayur" },
  { komoditas: "Bawang Merah", jumlah: 46, kategori: "Sayur" },
  { komoditas: "Cabe Rawit", jumlah: 24, kategori: "Sayur" },
  { komoditas: "Kacang Panjang", jumlah: 18, kategori: "Sayur" },
  { komoditas: "Cabe Keriting", jumlah: 16, kategori: "Sayur" },
  { komoditas: "Mentimun", jumlah: 12, kategori: "Sayur" },
  { komoditas: "Sayur Pare", jumlah: 9, kategori: "Sayur" },
  { komoditas: "Brokoli", jumlah: 8, kategori: "Sayur" },
  { komoditas: "Cabe Prentul", jumlah: 8, kategori: "Sayur" },
  { komoditas: "Bayam", jumlah: 3, kategori: "Sayur" },
  { komoditas: "Kangkung", jumlah: 2, kategori: "Sayur" },
  { komoditas: "Kol", jumlah: 2, kategori: "Sayur" },
];

export const KATEGORI_LIST = ["Perkebunan", "Pangan", "Buah", "Sayur"] as const;

export const KATEGORI_COLORS: Record<string, string> = {
  Perkebunan: "#b45309",
  Pangan: "#059669",
  Buah: "#f97316",
  Sayur: "#65a30d",
};
