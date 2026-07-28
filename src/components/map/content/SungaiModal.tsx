// src/components/map/content/SungaiModal.tsx
// Phase 4 — Content: Sungai & Irigasi
// Data sumber (Sungai.geojson) cuma punya NAMOBJ+REMARK yang terisi — field lain (debit, lebar, dll)
// masih "0"/null di template RBI25000, jadi sengaja gak ditampilin biar gak menyesatkan.

"use client";

import Icon from "@/components/ui/Icon";

export default function SungaiModal({ data }: { data: Record<string, unknown> }) {
  const nama = (data.NAMOBJ as string) ?? "Sungai/Irigasi Tidak Teridentifikasi";
  const jenis = (data.REMARK as string) ?? "Sungai";

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border text-sky-600 bg-sky-50 border-sky-200">
          <Icon name="water" size={24} />
        </div>
        <div>
          <h3 className="headline-lg text-[var(--on-surface)]">{nama}</h3>
          <p className="body-base text-[var(--text-muted)] mt-0.5">{jenis}</p>
        </div>
      </div>

      <div className="border-t border-[var(--outline-variant)]/60" />

      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-2">
        <Icon name="info" size={16} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="micro-copy text-amber-800 leading-relaxed">
          Atribut detail (debit, lebar, status pengelolaan, dll) belum terisi di data sumber (template RBI25000) — baru nama dan jenis jalur air yang tersedia.
        </p>
      </div>
    </div>
  );
}
