// src/components/map/content/AsetfasumModal.tsx
// Phase 4 — Content: Aset & Fasilitas Umum Desa
// Layout: Nama Fasilitas (header besar) → grid 2-kolom (kiri: status+kategori, kanan: fungsi+koordinat)
// GeoJSON keys: NAMOBJ, REMARK, FGSGOV (pemerintah), FGSIBD (ibadah), KATPDK/JLPDDK (pendidikan), _source

"use client";

import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { categoryData } from "@/constants/assetsSummary";
import { ASET_FOTO } from "@/constants/asetFoto";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Lookup icon+accentClass from the shared category config (single source with AssetMetrics chart) */
function getCategoryVisual(nama: string): { icon: string; accentClass: string } {
  const found = categoryData.find((c) => c.nama === nama);
  return {
    icon: found?.icon ?? "location_city",
    accentClass: found?.accentClass ?? "text-slate-600 bg-slate-50 border-slate-200",
  };
}

/** Derive category & function from _source path and properties */
function deriveCategory(data: Record<string, unknown>): {
  kategori: string;
  fungsi: string;
  icon: string;
  accentClass: string;
} {
  const source = (data._source as string) ?? "";

  if (source.includes("Pemerintahan")) {
    return {
      kategori: "Fasilitas Pemerintahan",
      fungsi: "Pelayanan administrasi dan pemerintahan desa",
      ...getCategoryVisual("Fasilitas Pemerintahan"),
    };
  }
  if (source.includes("olahraga")) {
    return {
      kategori: "Olahraga",
      fungsi: "Sarana kegiatan olahraga dan kebugaran masyarakat",
      ...getCategoryVisual("Olahraga"),
    };
  }
  if (source.includes("Tempat") || source.includes("Ibadah")) {
    return {
      kategori: "Fasilitas Keagamaan",
      fungsi: "Sarana peribadatan dan kegiatan keagamaan masyarakat",
      ...getCategoryVisual("Fasilitas Keagamaan"),
    };
  }
  if (source.includes("Pendidikan")) {
    const jenjang = (data.JLPDDK as string) ?? "";
    const fungsiDetail = jenjang
      ? `Pendidikan formal jenjang ${jenjang}`
      : "Sarana pendidikan dan kegiatan belajar mengajar";
    return {
      kategori: "Fasilitas Pendidikan",
      fungsi: fungsiDetail,
      ...getCategoryVisual("Fasilitas Pendidikan"),
    };
  }
  return {
    kategori: "Fasilitas Umum / Sosial",
    fungsi: "Sarana layanan publik desa",
    ...getCategoryVisual("Fasilitas Umum / Sosial"),
  };
}

/** Format coordinate to 6 decimal places */
function formatCoord(val: unknown): string {
  if (val === null || val === undefined) return "—";
  const n = typeof val === "string" ? parseFloat(val) : Number(val);
  return isNaN(n) ? "—" : n.toFixed(6);
}

// ── Info Field ────────────────────────────────────────────────────────────────
function InfoField({ label, value, icon }: { label: string; value: string; icon?: string }) {
  return (
    <div className="flex flex-col gap-1 p-3 bg-[var(--surface-container-low)] rounded-lg border border-[var(--outline-variant)]/50">
      <div className="flex items-center gap-1.5">
        {icon && <Icon name={icon} size={14} className="text-[var(--text-muted)]" />}
        <span className="label-caps text-[var(--text-muted)]">{label}</span>
      </div>
      <span className="body-base text-[var(--on-surface)] font-semibold leading-snug">{value || "—"}</span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AsetfasumModal({ data }: { data: Record<string, unknown> }) {
  const { kategori, fungsi, icon, accentClass } = deriveCategory(data);

  // Coordinates are stored in GeoJSON geometry, passed via _lat/_lng injected from layer
  const lat = data._lat as number | undefined;
  const lng = data._lng as number | undefined;

  const namaFasilitas = (data.NAMOBJ as string) ?? "Fasilitas Tidak Teridentifikasi";
  const keterangan = (data.REMARK as string) ?? null;
  const statusKepemilikan = (data.FGSGOV as string) ?? (data.FGSIBD as string) ?? (data.FGGPDK as string) ?? null;
  const fotoUrl = ASET_FOTO[namaFasilitas];

  return (
    <div className="p-6 space-y-5">

      {/* ── Header: Nama Fasilitas ──────────────────────────────────────────── */}
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${accentClass}`}>
          <Icon name={icon} size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="headline-lg text-[var(--on-surface)] leading-snug">{namaFasilitas}</h3>
          {keterangan && (
            <p className="body-base text-[var(--text-muted)] mt-1 leading-relaxed">{keterangan}</p>
          )}
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────────────────────── */}
      <div className="border-t border-[var(--outline-variant)]/60" />

      {/* ── Foto Kondisi (kondisional — hanya render kalau ASET_FOTO punya entry) ── */}
      {fotoUrl && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[var(--outline-variant)]">
          <Image
            src={fotoUrl}
            alt={namaFasilitas}
            fill
            sizes="(max-width: 640px) 100vw, 640px"
            className="object-cover"
          />
        </div>
      )}

      {/* ── Body: Grid 2 Kolom ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* Kolom Kiri */}
        <div className="space-y-3">
          <p className="label-caps text-[var(--text-muted)] px-1">Profil Fasilitas</p>
          <InfoField
            label="Kategori"
            value={kategori}
            icon="category"
          />
          <InfoField
            label="Status Kepemilikan"
            value={statusKepemilikan ?? "Tidak Terdata"}
            icon="verified_user"
          />
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-3">
          <p className="label-caps text-[var(--text-muted)] px-1">Informasi Spasial</p>
          <InfoField
            label="Fungsi"
            value={fungsi}
            icon="info"
          />
          <div className="grid grid-cols-2 gap-2">
            <InfoField
              label="Latitude"
              value={lat !== undefined ? formatCoord(lat) : "—"}
              icon="location_on"
            />
            <InfoField
              label="Longitude"
              value={lng !== undefined ? formatCoord(lng) : "—"}
              icon="location_on"
            />
          </div>
        </div>
      </div>

      {/* ── Note (if data is sparse) ─────────────────────────────────────────── */}
      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-2">
        <Icon name="info" size={16} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="micro-copy text-amber-800 leading-relaxed">
          Data aset bersumber dari inventarisasi lapangan KKN-PPM UGM 2026. Beberapa atribut detail masih dalam proses validasi.
        </p>
      </div>

    </div>
  );
}
