// src/lib/rasterColors.ts
// Fungsi warna buat raster LST Delta & Kesehatan Kelapa — dipakai bareng oleh layer (render peta)
// dan legend (biar warna di peta & legend selalu konsisten, gak ada 2 sumber warna beda).
// Palet Kesehatan Kelapa (1-5) sudah CONFIRMED tim lapangan. Palet LST Delta masih default/MVP.

/** Interpolasi linear antar 2 warna RGB */
function lerpColor(a: [number, number, number], b: [number, number, number], t: number): string {
  const clamped = Math.max(0, Math.min(1, t));
  const r = Math.round(a[0] + (b[0] - a[0]) * clamped);
  const g = Math.round(a[1] + (b[1] - a[1]) * clamped);
  const bl = Math.round(a[2] + (b[2] - a[2]) * clamped);
  return `rgb(${r},${g},${bl})`;
}

const LST_BLUE: [number, number, number] = [33, 102, 172];
const LST_WHITE: [number, number, number] = [247, 247, 247];
const LST_RED: [number, number, number] = [178, 24, 43];

/**
 * Warna diverging: biru (turun) -> putih (~0) -> merah (naik), pivot di 0.
 * `null`/`NaN` -> return null (transparent, no-data).
 */
export function lstDeltaColor(value: number | null | undefined, min: number, max: number): string | null {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  if (value <= 0) {
    const t = min < 0 ? (value - min) / (0 - min) : 0;
    return lerpColor(LST_BLUE, LST_WHITE, t);
  }
  const t = max > 0 ? value / max : 0;
  return lerpColor(LST_WHITE, LST_RED, t);
}

/** Rentang data DeltaLST_2020_2025_FIX.tif (dicek langsung dari file, lihat tif_data_preview.md) */
export const LST_MIN = -0.71;
export const LST_MAX = 7.48;

/**
 * Kelas kesehatan kelapa — CONFIRMED tim lapangan: cuma kelas 1-5 yang dipakai (skala sehat
 * naik seiring angka), kelas 0 BUKAN bagian skala kesehatan (= bukan area kelapa/tidak
 * terklasifikasi, lihat komentar kesehatanKelapaColor di bawah).
 */
export const KESEHATAN_KELAPA_LABELS: Record<number, string> = {
  1: "Sangat Tidak Sehat",
  2: "Tidak Sehat",
  3: "Cukup Sehat",
  4: "Sehat",
  5: "Sangat Sehat",
};

/** Warna gradient kesehatan (merah=sangat tidak sehat -> hijau=sangat sehat), cuma kelas 1-5. */
export const KESEHATAN_KELAPA_COLORS: Record<number, string> = {
  1: "#dc2626", 
  2: "#f97316", 
  3: "#eab308", 
  4: "#84cc16", 
  5: "#16a34a", 
};


export function kesehatanKelapaColor(value: number | null | undefined): string | null {
  if (value === null || value === undefined || Number.isNaN(value) || value === 0) return null;
  return KESEHATAN_KELAPA_COLORS[value] ?? null;
}
