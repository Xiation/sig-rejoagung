// src/components/map/content/SekolahModal.tsx
// Phase 4 — Content: Aksesibilitas Sekolah
// Layout: Nama Sekolah (header besar) → grid 2-kolom (kiri: profil utama, kanan: spasial)
// GeoJSON key utama: NAMOBJ (Point) — data lainnya di-hardcode berdasarkan nama karena GeoJSON sparse

"use client";

import Icon from "@/components/ui/Icon";

// ── Hardcoded enrichment data (GeoJSON hanya punya NAMOBJ) ───────────────────
// Data ini melengkapi kekosongan atribut di file GeoJSON
interface SekolahDetail {
  jenjang: string;
  status: "Negeri" | "Swasta";
  akreditasi: string;
  npsn: string;
  alamat: string;
  zonaWaktu: "< 5 Menit" | "5–10 Menit" | "> 10 Menit";
  zonaColor: string;
}

const SEKOLAH_DATA: Record<string, SekolahDetail> = {
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

// Default fallback
const DEFAULT_DETAIL: SekolahDetail = {
  jenjang: "—",
  status: "Swasta",
  akreditasi: "—",
  npsn: "—",
  alamat: "Rejoagung, Srono, Banyuwangi",
  zonaWaktu: "5–10 Menit",
  zonaColor: "#f59e0b",
};

// Jenjang → warna marker
const JENJANG_COLORS: Record<string, string> = {
  TK: "#ec4899",
  SD: "#ef4444",
  "SD/MI": "#ef4444",
  "SMP/MTs": "#3b82f6",
  SMP: "#3b82f6",
  SMK: "#eab308",
  Pesantren: "#8b5cf6",
};

// ── Sub-components ────────────────────────────────────────────────────────────
function InfoField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: string;
}) {
  return (
    <div className="flex flex-col gap-1 p-3 bg-[var(--surface-container-low)] rounded-lg border border-[var(--outline-variant)]/50">
      <div className="flex items-center gap-1.5">
        {icon && <Icon name={icon} size={14} className="text-[var(--text-muted)]" />}
        <span className="label-caps text-[var(--text-muted)]">{label}</span>
      </div>
      <span className="body-base text-[var(--on-surface)] font-semibold leading-snug">
        {value || "—"}
      </span>
    </div>
  );
}

function AkreditasiBadge({ value }: { value: string }) {
  const colors: Record<string, string> = {
    A: "bg-emerald-50 text-emerald-700 border-emerald-200",
    B: "bg-blue-50 text-blue-700 border-blue-200",
    C: "bg-amber-50 text-amber-700 border-amber-200",
  };
  const cls = colors[value] ?? "bg-slate-50 text-slate-500 border-slate-200";
  return (
    <span className={`inline-block label-caps px-2.5 py-1 rounded-full border ${cls}`}>
      {value === "—" ? "Belum Terdata" : `Akreditasi ${value}`}
    </span>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function SekolahModal({ data }: { data: Record<string, unknown> }) {
  const namaSekolah = (data.NAMOBJ as string) ?? "Sekolah Tidak Teridentifikasi";
  const detail = SEKOLAH_DATA[namaSekolah] ?? DEFAULT_DETAIL;

  const markerColor = JENJANG_COLORS[detail.jenjang] ?? "#6b7280";

  const lat = data._lat as number | undefined;
  const lng = data._lng as number | undefined;

  return (
    <div className="p-6 space-y-5">

      {/* ── Header: Nama Sekolah ─────────────────────────────────────────────── */}
      <div className="flex items-start gap-4">
        {/* Jenjang color dot */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 border-white shadow-sm"
          style={{ backgroundColor: markerColor }}
        >
          <Icon name="school" size={24} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="headline-lg text-[var(--on-surface)] leading-snug">{namaSekolah}</h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {/* Status chip */}
            <span className={`label-caps px-2.5 py-1 rounded-full border ${
              detail.status === "Negeri"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-blue-50 text-blue-700 border-blue-200"
            }`}>
              {detail.status}
            </span>
            {/* Jenjang chip */}
            <span className="label-caps px-2.5 py-1 rounded-full border bg-[var(--surface-container)] text-[var(--on-surface-variant)] border-[var(--outline-variant)]">
              {detail.jenjang}
            </span>
            {/* Zona waktu chip */}
            <span
              className="label-caps px-2.5 py-1 rounded-full border"
              style={{
                backgroundColor: detail.zonaColor + "20",
                color: detail.zonaColor,
                borderColor: detail.zonaColor + "40",
              }}
            >
              ⏱ {detail.zonaWaktu}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--outline-variant)]/60" />

      {/* ── Body: Grid 2 Kolom ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Kolom Kiri: Profil Utama */}
        <div className="space-y-3">
          <p className="label-caps text-[var(--text-muted)] px-1">Profil Utama</p>
          <InfoField label="Alamat" value={detail.alamat} icon="place" />
          <InfoField label="NPSN" value={detail.npsn} icon="badge" />
          <div className="p-3 bg-[var(--surface-container-low)] rounded-lg border border-[var(--outline-variant)]/50">
            <div className="flex items-center gap-1.5 mb-2">
              <Icon name="verified" size={14} className="text-[var(--text-muted)]" />
              <span className="label-caps text-[var(--text-muted)]">Akreditasi</span>
            </div>
            <AkreditasiBadge value={detail.akreditasi} />
          </div>
        </div>

        {/* Kolom Kanan: Spasial & Tambahan */}
        <div className="space-y-3">
          <p className="label-caps text-[var(--text-muted)] px-1">Informasi Spasial</p>
          <div className="grid grid-cols-2 gap-2">
            <InfoField
              label="Latitude"
              value={lat !== undefined ? lat.toFixed(6) : "—"}
              icon="location_on"
            />
            <InfoField
              label="Longitude"
              value={lng !== undefined ? lng.toFixed(6) : "—"}
              icon="location_on"
            />
          </div>

          {/* Zona waktu detail box */}
          <div
            className="rounded-lg border p-3"
            style={{
              backgroundColor: detail.zonaColor + "10",
              borderColor: detail.zonaColor + "30",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon name="directions_walk" size={16} style={{ color: detail.zonaColor }} />
              <span className="label-caps" style={{ color: detail.zonaColor }}>
                Zona Jangkauan
              </span>
            </div>
            <p className="body-base font-semibold" style={{ color: detail.zonaColor }}>
              {detail.zonaWaktu}
            </p>
            <p className="micro-copy text-[var(--text-muted)] mt-0.5">
              dari pusat permukiman desa
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
