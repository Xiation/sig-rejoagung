// src/components/map/content/KesehatanKelapaModal.tsx
// Fase 1 (MVP) — nampilin kelas apa adanya, belum ada label semantik (arti kelas belum dikonfirmasi
// tim geodesi). Lihat plan doc, Fase 2, buat rencana pengayaan setelah dikonfirmasi.
"use client";

import Icon from "@/components/ui/Icon";

export default function KesehatanKelapaModal({ data }: { data: Record<string, unknown> }) {
  const kelas = data.value as number;
  const lat = data.lat as number;
  const lng = data.lng as number;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border text-emerald-600 bg-emerald-50 border-emerald-200">
          <Icon name="eco" size={24} />
        </div>
        <div>
          <h3 className="headline-lg text-[var(--on-surface)]">Kelas {kelas}</h3>
          <p className="body-base text-[var(--text-muted)] mt-0.5">Kesehatan Vegetasi Kelapa (2025)</p>
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

      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-2">
        <Icon name="info" size={16} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="micro-copy text-amber-800 leading-relaxed">
          Kelas 0-5 — makna tiap kelas (mana yang sehat/gak sehat) belum dikonfirmasi tim lapangan. Angka ditampilkan apa adanya.
        </p>
      </div>
    </div>
  );
}
