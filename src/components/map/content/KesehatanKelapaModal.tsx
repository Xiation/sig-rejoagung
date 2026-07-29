// src/components/map/content/KesehatanKelapaModal.tsx
// Label semantik kelas 1-5 CONFIRMED tim lapangan (lihat rasterColors.ts, KESEHATAN_KELAPA_LABELS).
"use client";

import Icon from "@/components/ui/Icon";
import { KESEHATAN_KELAPA_LABELS, KESEHATAN_KELAPA_COLORS } from "@/lib/rasterColors";

export default function KesehatanKelapaModal({ data }: { data: Record<string, unknown> }) {
  const kelas = data.value as number;
  const lat = data.lat as number;
  const lng = data.lng as number;
  const label = KESEHATAN_KELAPA_LABELS[kelas] ?? `Kelas ${kelas}`;
  const color = KESEHATAN_KELAPA_COLORS[kelas] ?? "#6b7280";

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border" style={{ color, backgroundColor: `${color}1a`, borderColor: `${color}4d` }}>
          <Icon name="eco" size={24} />
        </div>
        <div>
          <h3 className="headline-lg text-[var(--on-surface)]">{label}</h3>
          <p className="body-base text-[var(--text-muted)] mt-0.5">Kesehatan Vegetasi Kelapa (2025) · Kelas {kelas}/5</p>
        </div>
      </div>

      <div className="border-t border-[var(--outline-variant)]/60" />

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 p-3 bg-[var(--surface-container-low)] rounded-lg border border-[var(--outline-variant)]/50">
          <span className="label-caps text-[var(--text-muted)]">Latitude</span>
          <span className="body-base text-[var(--on-surface)] font-semibold">{lat.toFixed(6)}</span>
        </div>
        <div className="flex flex-col gap-1 p-3 bg-[var(--surface-container-low)] rounded-lg border border-[var(--outline-variant)]/50">
          <span className="label-caps text-[var(--text-muted)]">Longitude</span>
          <span className="body-base text-[var(--on-surface)] font-semibold">{lng.toFixed(6)}</span>
        </div>
      </div>
    </div>
  );
}
