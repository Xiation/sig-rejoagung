// src/constants/sekolahData.ts
// from: src/components/map/content/SekolahModal.tsx (SEKOLAH_DATA, DEFAULT_DETAIL, JENJANG_COLORS)
// alamat: from public/data/Database_Aset_Desa_Rejoagung - ASET PENDIDIKAN.csv
// Master Data Sekolah — GeoJSON hanya punya NAMOBJ, data ini melengkapi kekosongan atribut

export interface SekolahDetail {
  jenjang: string;
  status: "Negeri" | "Swasta";
  akreditasi: string;
  npsn: string;
  alamat: string;
  zonaWaktu: "< 10 Menit" | "10–30 Menit" | "30–60 Menit";
  zonaColor: string;
  /** Path foto kondisi bangunan (public/images/sekolah/...). Kosongkan kalau belum ada foto. */
  foto?: string;
}

// Key HARUS persis sama dengan NAMOBJ di public/data/akses/Fasilitas_Pendidikan.geojson (14 fitur).
export const SEKOLAH_DATA: Record<string, SekolahDetail> = {
  "SMK NU Darussalam": {
    jenjang: "SMK",
    status: "Swasta",
    akreditasi: "B",
    npsn: "69889031",
    alamat: "Sumberagung, Rejoagung, Srono, Banyuwangi Regency, East Java 68471",
    zonaWaktu: "10–30 Menit",
    zonaColor: "#f59e0b",
  },
  "Pondok Pesantren Salaf Darussalam": {
    jenjang: "Pesantren",
    status: "Swasta",
    akreditasi: "—",
    npsn: "—",
    alamat: "Sumberagung, Rejoagung, Srono, Banyuwangi Regency, East Java 68471",
    zonaWaktu: "10–30 Menit",
    zonaColor: "#f59e0b",
  },
  // Rename dari "SMP Al Amiriyyah" — samain persis ke NAMOBJ GeoJSON
  "SMP AL-Amiriyyah": {
    jenjang: "SMP",
    status: "Swasta",
    akreditasi: "A",
    npsn: "70012285",
    alamat: "Sumberagung, Rejoagung, Srono, Banyuwangi Regency, East Java 68471",
    zonaWaktu: "10–30 Menit",
    zonaColor: "#f59e0b",
  },
  "Pondok Pesantren Darussalam": {
    jenjang: "Pesantren",
    status: "Swasta",
    akreditasi: "—",
    npsn: "—",
    alamat: "Sumberagung, Rejoagung, Srono, Banyuwangi Regency, East Java 68471",
    zonaWaktu: "10–30 Menit",
    zonaColor: "#f59e0b",
  },
  // Rename dari "SDN 1 Rejoagung Srono"
  "SD Negeri 1 Rejoagung": {
    jenjang: "SD",
    status: "Negeri",
    akreditasi: "A",
    npsn: "20525484",
    alamat: "Sumberagung, Rejoagung, Kec. Srono, Kabupaten Banyuwangi, Jawa Timur 68471",
    zonaWaktu: "10–30 Menit",
    zonaColor: "#f59e0b",
  },
  // Rename dari "SD N 2 Rejoagung"
  "SD Negeri 2 Rejoagung": {
    jenjang: "SD",
    status: "Negeri",
    akreditasi: "B",
    npsn: "20526390",
    alamat: "Sumberagung, Rejoagung, Kec. Srono, Kabupaten Banyuwangi, Jawa Timur 68471",
    zonaWaktu: "< 10 Menit",
    zonaColor: "#10b981",
  },
  "TK Khadijah 203 Rejoagung": {
    jenjang: "TK",
    status: "Swasta",
    akreditasi: "B",
    npsn: "20569565",
    alamat: "Sumberagung, Rejoagung, Kec. Srono, Kabupaten Banyuwangi, Jawa Timur 68471",
    zonaWaktu: "< 10 Menit",
    zonaColor: "#10b981",
  },
  // Rename dari "Ponpes manbaul alam" — GeoJSON pakai nama resmi lengkap
  // CATATAN: alamat CSV nunjuk ke Kec. Muncar (bukan Kec. Srono kayak sekolah lain) — dicek apa adanya dari sumber, gak diubah sepihak
  "Yayasan Pondok Pesantren Manbaul Ulum": {
    jenjang: "Pesantren",
    status: "Swasta",
    akreditasi: "—",
    npsn: " 20584049",
    alamat: "Jln. KH. Askandar No.01 Berasan, Wringinputih, Dusun Krajan, Wringin Putih, Kec. Muncar, Kabupaten Banyuwangi, Jawa Timur 68472",
    zonaWaktu: "< 10 Menit",
    zonaColor: "#10b981",
  },
  "MTs Unggulan Darussalam": {
    jenjang: "SMP/MTs",
    status: "Swasta",
    akreditasi: "A",
    npsn: "20584121",
    alamat: "Sumberagung, Rejoagung, Srono, Banyuwangi Regency, East Java 68471",
    zonaWaktu: "10–30 Menit",
    zonaColor: "#f59e0b",
  },
  // BARU — belum ada NPSN/akreditasi real, placeholder sampai data tersedia. Alamat dari ASET PENDIDIKAN.csv.
  "Pondok Pesantren Tasmirul Aulad": {
    jenjang: "Pesantren",
    status: "Swasta",
    akreditasi: "—",
    npsn: "—",
    alamat: "J862+874, Krajan, Bagorejo, Kec. Srono, Kabupaten Banyuwangi, Jawa Timur 68471",
    zonaWaktu: "< 10 Menit",
    zonaColor: "#10b981",
  },
  // Rename dari "MI Al Ma'arif Rejoagung"
  "MI Al-Ma'arif": {
    jenjang: "SD/MI",
    status: "Swasta",
    akreditasi: "B",
    npsn: "60716102",
    alamat: "Jl. K. Sidik Sumberagung, RT.01/RW.02, Krajan, Rejoagung, Kec. Srono, Kabupaten Banyuwangi, Jawa Timur 68471",
    zonaWaktu: "< 10 Menit",
    zonaColor: "#10b981",
  },
  // Rename dari "Pondok Pesantren Al Falah Rejoagung"
  "Pondok Pesantren Al-Falah": {
    jenjang: "Pesantren",
    status: "Swasta",
    akreditasi: "—",
    npsn: "—",
    alamat: "Jl. K. Sidik, Sumberagung, Rejoagung, Kec. Srono, Kabupaten Banyuwangi, Jawa Timur 68471",
    zonaWaktu: "10–30 Menit",
    zonaColor: "#f59e0b",
  },
  // BARU — placeholder NPSN/akreditasi, belum ada data real. Alamat dari ASET PENDIDIKAN.csv (key tetep "Khodjiah" nyamain typo di GeoJSON NAMOBJ, CSV-nya sendiri nulis "Khodijah")
  "TK Khodjiah 88": {
    jenjang: "TK",
    status: "Swasta",
    akreditasi: "—",
    npsn: "—",
    alamat: "J853+G8V, Krajan, Bagorejo, Kec. Srono, Kabupaten Banyuwangi, Jawa Timur 68471",
    zonaWaktu: "< 10 Menit",
    zonaColor: "#10b981",
  },
  // BARU — jenjang SLB (Sekolah Luar Biasa), tier baru, placeholder NPSN/akreditasi
  // CATATAN: alamat CSV nunjuk "Kabupaten Jombang" — kemungkinan besar typo sumber (Jombang gak nempel sama Banyuwangi), dicek apa adanya, gak diubah sepihak
  "SLB Bina Insani Srono": {
    jenjang: "SLB",
    status: "Swasta",
    akreditasi: "C",
    npsn: "69896481",
    alamat: "J78V+QVW, Komis Wetan, Rejoagung, Kec. Srono, Kabupaten Jombang, Jawa Timur 68471",
    zonaWaktu: "10–30 Menit",
    zonaColor: "#f59e0b",
  },
};

export const DEFAULT_DETAIL: SekolahDetail = {
  jenjang: "—",
  status: "Swasta",
  akreditasi: "—",
  npsn: "—",
  alamat: "Rejoagung, Srono, Banyuwangi",
  zonaWaktu: "10–30 Menit",
  zonaColor: "#f59e0b",
};

// Jenjang → warna marker (satu-satunya sumber, dipakai SekolahModal & EducationMetrics)
export const JENJANG_COLORS: Record<string, string> = {
  TK: "#ec4899",
  SD: "#ef4444",
  "SD/MI": "#ef4444",
  "SMP/MTs": "#3b82f6",
  SMP: "#3b82f6",
  SMK: "#eab308",
  Pesantren: "#8b5cf6",
  SLB: "#06b6d4",
};

// Placeholder/estimasi — belum ada hasil kalkulasi Network Analysis riil, lihat label UI "* estimasi"
//
// RUMUS YANG PERNAH DICOBA (belum diterapkan ke angka di bawah, masih didiskusikan ke temen geodesi):
//   Coverage Index (%) = (luas ring Service Area / luas Rejoagung) × 100
//
// Data yang dipakai pas nyoba hitung:
//   - Ring 10 menit (public/data/akses/Service_Area_10_Menit.geojson) → area: 47.424,10 m²
//   - Ring 30 menit (public/data/akses/Service_Area_30_Menit.geojson) → area: 876.029,93 m² (kumulatif, udah termasuk ring 10 menit)
//   - Band 10–30 menit eksklusif = 876.029,93 − 47.424,10 = 828.605,83 m²
//   - Luas Rejoagung = 140.668.610,04 m² (revisi dari temen, sumber: data geodesi)
//
// Hasil percobaan:
//   - Band 10–30 menit ÷ luas Rejoagung   = 828.605,83 / 140.668.610,04 = 0,589%
//   - Ring 30 menit (kumulatif) ÷ luas Rejoagung = 876.029,93 / 140.668.610,04 = 0,623%
//
// CATATAN PENTING — kenapa hasil di atas BELUM dipakai ganti angka di bawah:
//   1. Ring Service Area yang ada cuma dari 1 dari 14 sekolah (SMK NU Darussalam) — 13 sekolah lain
//      belum punya isochrone, jadi hasil di atas pasti undercount parah, bukan cakupan desa beneran.
//   2. Pembagi "luas Rejoagung" itu luas administratif desa penuh (sawah/hutan/lahan kosong ikut
//      kehitung), bukan luas pemukiman padat penduduk — rasio jadi keliatan kecil banget (<1%),
//      berpotensi lebih menyesatkan daripada angka 68.4 di bawah (yang minimal jujur dilabel "estimasi").
//   3. Perlu masukan temen geodesi soal: (a) pembagi yang lebih tepat (luas pemukiman, bukan luas desa
//      penuh), (b) isochrone lengkap buat 14 sekolah biar gak cuma sample 1 titik.
export const COVERAGE_INDEX_ESTIMASI = 68.4;
