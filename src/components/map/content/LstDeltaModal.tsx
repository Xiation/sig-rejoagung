// src/components/map/content/LstDeltaModal.tsx
// Fase 1 (MVP) — nampilin raw value hasil query klik, belum ada analisis (lihat plan doc, Fase 2).
"use client";

import Icon from "@/components/ui/Icon";
import { LST_MIN, LST_MAX } from "@/lib/rasterColors";

export default function LstDeltaModal({ data }: { data: Record<string, unknown> }) {
  const value = data.value as number;
  const lat = data.lat as number;
  const lng = data.lng as number;
  const naik = value >= 0;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${naik ? "text-rose-600 bg-rose-50 border-rose-200" : "text-blue-600 bg-blue-50 border-blue-200"}`}>
          <Icon name="thermostat" size={24} />
        </div>
        <div>
          <h3 className="headline-lg text-[var(--on-surface)]">
            {naik ? "+" : ""}{value.toFixed(2)}°C
          </h3>
          <p className="body-base text-[var(--text-muted)] mt-0.5">Perubahan Suhu Permukaan (2020–2025)</p>
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
          Rentang data keseluruhan: {LST_MIN}°C s/d +{LST_MAX}°C. Nilai positif = suhu naik, negatif = suhu turun (2020→2025).
        </p>
      </div>
    </div>
  );
}
