// src/components/map/content/PotensiModal.tsx
// Phase 4 — Content: Potensi Lahan & SDA (Modal heavy-data per DESIGN_SYS.md)
// Layout: Header → 2-col (Geo Profile kiri | Inventory kanan) → Actionable Insights bawah

"use client";

import Icon from "@/components/ui/Icon";

// ── Types ─────────────────────────────────────────────────────────────────────
interface PotensiData {
  dusun?: string;
  "Tingkat Potensi Ekonomi"?: string;
  "Jenis Tanah"?: string;
  "pH Tanah"?: number | string;
  "Topografi"?: string;
  "Elevasi Rata-rata (mdpl)"?: number | string;
  "Kualitas Air"?: string;
  "Sumber Air"?: string;
  "Komoditas Pertanian"?: string;
  "Jenis Tanaman"?: string;
  "Produksi Padi (ton/ha)"?: number | string;
  "IP Padi"?: string;
  "Komoditas Perkebunan"?: string;
  "Horikultura"?: string;
  "Tanaman Obat (TOGA)"?: string;
  "Jenis Hewan Ternak"?: string;
  "Jenis Ikan Ternak"?: string;
  "Sistem Budidaya Ikan"?: string;
  "Energi Terbarukan"?: string;
  "Potensi Agrowisata"?: string;
  "Kerajinan Lokal"?: string;
  "Ancaman SDA"?: string;
  "Rekomendasi"?: string;
  [key: string]: unknown;
}

const NA = "Data tidak spesifik";

// ── Sub-components ────────────────────────────────────────────────────────────
function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | number | null;
  icon?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1">
        {icon && <Icon name={icon} size={12} className="text-[var(--text-muted)]" />}
        <span className="label-caps text-[var(--text-muted)]">{label}</span>
      </div>
      <span className="body-base text-[var(--on-surface)] font-semibold">{value ?? NA}</span>
    </div>
  );
}

function SectionBlock({
  icon,
  title,
  bgClass,
  titleClass,
  children,
}: {
  icon: string;
  title: string;
  bgClass: string;
  titleClass: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border p-4 space-y-3 ${bgClass}`}>
      <div className="flex items-center gap-2">
        <Icon name={icon} size={16} className={titleClass} />
        <p className={`label-caps ${titleClass}`}>{title}</p>
      </div>
      {children}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PotensiModal({ data }: { data: Record<string, unknown> }) {
  const d = data as PotensiData;

  const level = d["Tingkat Potensi Ekonomi"] ?? "";
  const isSangatTinggi = level === "Sangat Tinggi";

  return (
    <div className="p-6 space-y-5">

      {/* ── Header: Nama Dusun + Potensi Badge ──────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 bg-[var(--primary-container)] rounded-xl flex items-center justify-center shrink-0 border border-emerald-200">
            <Icon name="agriculture" size={24} className="text-[var(--on-primary-container)]" />
          </div>
          <div>
            <h3 className="headline-lg text-[var(--on-surface)]">Dusun {d.dusun ?? "—"}</h3>
            <p className="body-base text-[var(--text-muted)] mt-0.5">Potensi Lahan & SDA</p>
          </div>
        </div>
        {level && (
          <span
            className="inline-block label-caps px-3 py-1.5 rounded-full shrink-0 border mt-1"
            style={{
              backgroundColor: isSangatTinggi ? "#dcfce7" : "#dbeafe",
              color: isSangatTinggi ? "#15803d" : "#1d4ed8",
              borderColor: isSangatTinggi ? "#bbf7d0" : "#bfdbfe",
            }}
          >
            ⭐ Potensi {level}
          </span>
        )}
      </div>

      <div className="border-t border-[var(--outline-variant)]/60" />

      {/* ── Body: 2 Kolom per DESIGN_SYS.md ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Kiri: Geographical Profile */}
        <div className="space-y-4">
          <p className="label-caps text-[var(--text-muted)]">Profil Geografis</p>
          <div className="bg-[var(--surface-container-low)] rounded-xl border border-[var(--outline-variant)]/50 p-4 space-y-3">
            <InfoRow label="Jenis Tanah" value={d["Jenis Tanah"]} icon="landscape" />
            <InfoRow label="pH Tanah" value={d["pH Tanah"]} icon="science" />
            <InfoRow label="Topografi" value={d["Topografi"]} icon="terrain" />
            <InfoRow
              label="Elevasi Rata-rata"
              value={d["Elevasi Rata-rata (mdpl)"] ? `${d["Elevasi Rata-rata (mdpl)"]} mdpl` : undefined}
              icon="altitude"
            />
            <InfoRow label="Kualitas Air" value={d["Kualitas Air"]} icon="water_drop" />
            <InfoRow label="Sumber Air" value={d["Sumber Air"]} icon="waves" />
          </div>
        </div>

        {/* Kanan: Inventory & Commodity */}
        <div className="space-y-4">
          <p className="label-caps text-[var(--text-muted)]">Inventaris Komoditas</p>

          <SectionBlock
            icon="grain"
            title="Pertanian & Kebun"
            bgClass="bg-emerald-50/60 border-emerald-100"
            titleClass="text-emerald-700"
          >
            <InfoRow label="Komoditas Pertanian" value={d["Komoditas Pertanian"]} />
            <InfoRow label="Jenis Tanaman" value={d["Jenis Tanaman"]} />
            {d["Produksi Padi (ton/ha)"] && (
              <div>
                <span className="label-caps text-emerald-600">Produksi Padi</span>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1 bg-white rounded-full h-2 border border-emerald-100">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{
                        width: `${Math.min(
                          (Number(d["Produksi Padi (ton/ha)"]) / 8) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="micro-copy text-emerald-700 font-semibold shrink-0">
                    {d["Produksi Padi (ton/ha)"]} ton/ha
                  </span>
                </div>
              </div>
            )}
            <InfoRow label="Komoditas Perkebunan" value={d["Komoditas Perkebunan"]} />
          </SectionBlock>

          <SectionBlock
            icon="set_meal"
            title="Peternakan & Perikanan"
            bgClass="bg-blue-50/60 border-blue-100"
            titleClass="text-blue-700"
          >
            <InfoRow label="Hewan Ternak" value={d["Jenis Hewan Ternak"]} />
            <InfoRow label="Ikan Ternak" value={d["Jenis Ikan Ternak"]} />
            <InfoRow label="Sistem Budidaya" value={d["Sistem Budidaya Ikan"]} />
          </SectionBlock>
        </div>
      </div>

      {/* ── Infrastruktur & Ekonomi ─────────────────────────────────────────── */}
      <SectionBlock
        icon="bolt"
        title="Infrastruktur & Ekonomi"
        bgClass="bg-[var(--surface-container-low)] border-[var(--outline-variant)]/60"
        titleClass="text-[var(--secondary)]"
      >
        <div className="grid grid-cols-3 gap-3">
          <InfoRow label="Energi Terbarukan" value={d["Energi Terbarukan"]} icon="solar_power" />
          <InfoRow label="Agrowisata" value={d["Potensi Agrowisata"]} icon="park" />
          <InfoRow label="Kerajinan Lokal" value={d["Kerajinan Lokal"]} icon="handyman" />
        </div>
      </SectionBlock>

      {/* ── Actionable Insights (DESIGN_SYS.md: Error/Success Containers) ─────── */}
      <div className="space-y-3">
        {/* Ancaman — Error Container */}
        <div className="bg-[var(--error-container)] border border-rose-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="warning" size={16} className="text-[var(--on-error-container)]" />
            <p className="label-caps text-[var(--on-error-container)]">Ancaman SDA</p>
          </div>
          <p className="body-base text-[var(--on-error-container)] leading-relaxed">
            {d["Ancaman SDA"] ?? NA}
          </p>
        </div>

        {/* Rekomendasi — Success Container */}
        <div className="bg-[var(--success-container)] border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="lightbulb" size={16} className="text-[var(--on-success-container)]" />
            <p className="label-caps text-[var(--on-success-container)]">Rekomendasi Kebijakan</p>
          </div>
          <p className="body-base text-[var(--on-success-container)] leading-relaxed">
            {d["Rekomendasi"] ?? NA}
          </p>
        </div>
      </div>

    </div>
  );
}
