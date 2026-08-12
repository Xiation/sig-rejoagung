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
  TK: "#9a3412",
  SD: "#c2410c",
  "SD/MI": "#c2410c",
  "SMP/MTs": "#ea580c",
  SMP: "#ea580c",
  SMK: "#f97316",
  Pesantren: "#fb923c",
  SLB: "#fdba74",
};

// Coverage Index — dihitung ulang pakai angka luas ring Service Area terbaru dari temen geodesi.
//
// RUMUS: Coverage Index (%) = (luas ring Service Area / luas Rejoagung) × 100
//
// Data (revisi terbaru):
//   - Ring 10 menit (kumulatif) = 584.532,125 m²
//   - Ring 30 menit (kumulatif, udah termasuk ring 10 menit) = 3.005.024,902 m²
//   - Ring 60 menit (kumulatif, udah termasuk ring 30 & 10 menit) = 5.690.995,069 m²
//   - Luas Rejoagung = 7.138.317,647 m²
//     (CATATAN: beda dari angka 140.668.610,04 m² yang sempat dipakai sesi sebelumnya — angka baru ini
//     kebetulan cocok sama field "luas" mentah di Batas Administrasi.geojson, ~7,14 km², lebih masuk akal
//     buat luas 1 desa. Anggap ini angka final dari temen geodesi kecuali dikoreksi lagi.)
//
// Hasil:
//   - Ring 10 menit ÷ luas Rejoagung = 584.532,125 / 7.138.317,647 = 8,19%
//   - Ring 30 menit ÷ luas Rejoagung = 3.005.024,902 / 7.138.317,647 = 42,10%  ← dipakai di bawah (UI label "< 30 menit")
//   - Ring 60 menit ÷ luas Rejoagung = 5.690.995,069 / 7.138.317,647 = 79,72%
//
// BELUM DIKONFIRMASI: apakah 3 angka ring di atas udah hasil gabungan (union) isochrone 14 sekolah, atau
// masih sample dari sebagian sekolah kayak revisi sebelumnya (yang cuma dari 1/14 sekolah). Kalau ternyata
// masih sample sebagian, angka di bawah masih undercount — perlu dicek ulang ke temen geodesi.
export const COVERAGE_INDEX_ESTIMASI = 42.1;
