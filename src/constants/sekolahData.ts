// src/constants/sekolahData.ts
// from: src/components/map/content/SekolahModal.tsx (SEKOLAH_DATA, DEFAULT_DETAIL, JENJANG_COLORS)
// Master Data Sekolah — GeoJSON hanya punya NAMOBJ, data ini melengkapi kekosongan atribut

export interface SekolahDetail {
  jenjang: string;
  status: "Negeri" | "Swasta";
  akreditasi: string;
  npsn: string;
  alamat: string;
  zonaWaktu: "< 5 Menit" | "5–10 Menit" | "> 10 Menit";
  zonaColor: string;
  /** Path foto kondisi bangunan (public/images/sekolah/...). Kosongkan kalau belum ada foto. */
  foto?: string;
}

export const SEKOLAH_DATA: Record<string, SekolahDetail> = {
  "SMK NU Darussalam": {
    jenjang: "SMK",
    status: "Swasta",
    akreditasi: "A",
    npsn: "20557844",
    alamat: "Jl. KH. Dewantara, Rejoagung, Srono, Banyuwangi",
    zonaWaktu: "< 5 Menit",
    zonaColor: "#10b981",
  },
  "SMP Al Amiriyyah": {
    jenjang: "SMP",
    status: "Swasta",
    akreditasi: "B",
    npsn: "20534512",
    alamat: "Rejoagung, Srono, Banyuwangi, Jawa Timur",
    zonaWaktu: "< 5 Menit",
    zonaColor: "#10b981",
  },
  "Pondok Pesantren Salaf Darussalam": {
    jenjang: "Pesantren",
    status: "Swasta",
    akreditasi: "—",
    npsn: "—",
    alamat: "Rejoagung, Srono, Banyuwangi",
    zonaWaktu: "< 5 Menit",
    zonaColor: "#10b981",
  },
  "SDN 1 Rejoagung Srono": {
    jenjang: "SD",
    status: "Negeri",
    akreditasi: "A",
    npsn: "20536279",
    alamat: "Jl. Mastrip, Rejoagung, Srono, Banyuwangi",
    zonaWaktu: "5–10 Menit",
    zonaColor: "#f59e0b",
  },
  "SD N 2 Rejoagung": {
    jenjang: "SD",
    status: "Negeri",
    akreditasi: "B",
    npsn: "20536280",
    alamat: "Rejoagung, Srono, Banyuwangi, Jawa Timur",
    zonaWaktu: "5–10 Menit",
    zonaColor: "#f59e0b",
  },
  "TK Khadijah 203 Rejoagung": {
    jenjang: "TK",
    status: "Swasta",
    akreditasi: "B",
    npsn: "20562291",
    alamat: "Rejoagung, Srono, Banyuwangi",
    zonaWaktu: "5–10 Menit",
    zonaColor: "#f59e0b",
  },
  "MTs Unggulan Darussalam": {
    jenjang: "SMP/MTs",
    status: "Swasta",
    akreditasi: "A",
    npsn: "20584121",
    alamat: "Ponpes Darussalam, Rejoagung, Srono, Banyuwangi",
    zonaWaktu: "5–10 Menit",
    zonaColor: "#f59e0b",
  },
  "Pondok Pesantren Darussalam": {
    jenjang: "Pesantren",
    status: "Swasta",
    akreditasi: "—",
    npsn: "—",
    alamat: "Rejoagung, Srono, Banyuwangi",
    zonaWaktu: "5–10 Menit",
    zonaColor: "#f59e0b",
  },
  "Pondok Pesantren Al Falah Rejoagung": {
    jenjang: "Pesantren",
    status: "Swasta",
    akreditasi: "—",
    npsn: "—",
    alamat: "Rejoagung, Srono, Banyuwangi",
    zonaWaktu: "> 10 Menit",
    zonaColor: "#ef4444",
  },
  "MI Al Ma'arif Rejoagung": {
    jenjang: "SD/MI",
    status: "Swasta",
    akreditasi: "B",
    npsn: "60716102",
    alamat: "Rejoagung, Srono, Banyuwangi",
    zonaWaktu: "> 10 Menit",
    zonaColor: "#ef4444",
  },
  "Ponpes manbaul alam": {
    jenjang: "Pesantren",
    status: "Swasta",
    akreditasi: "—",
    npsn: "—",
    alamat: "Rejoagung, Srono, Banyuwangi",
    zonaWaktu: "> 10 Menit",
    zonaColor: "#ef4444",
  },
};

export const DEFAULT_DETAIL: SekolahDetail = {
  jenjang: "—",
  status: "Swasta",
  akreditasi: "—",
  npsn: "—",
  alamat: "Rejoagung, Srono, Banyuwangi",
  zonaWaktu: "5–10 Menit",
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
};

// Placeholder/estimasi — belum ada hasil kalkulasi Network Analysis riil, lihat label UI "* estimasi"
export const COVERAGE_INDEX_ESTIMASI = 68.4;
