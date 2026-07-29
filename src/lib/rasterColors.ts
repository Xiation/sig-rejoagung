// src/lib/rasterColors.ts
// Fungsi warna buat raster LST Delta & Kesehatan Kelapa — dipakai bareng oleh layer (render peta)
// dan legend (biar warna di peta & legend selalu konsisten, gak ada 2 sumber warna beda).
// Palet ini MVP/default (lihat docs/feature/raster_modules_lst_kesehatan_kelapa.md) — belum final.

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
 * Warna kategorikal 6 kelas Kesehatan Kelapa — NETRAL, cuma buat bedain kelas, BUKAN urutan
 * sehat/gak sehat (arti tiap kelas belum dikonfirmasi, lihat Open Questions di plan doc).
 * Sama persis sama preview_kesehatan_kelapa.png yang udah dikirim ke user.
 */
export const KESEHATAN_KELAPA_COLORS: Record<number, string> = {
  0: "#808080",
  1: "#e6194b",
  2: "#f58231",
  3: "#ffe119",
  4: "#3cb44b",
  5: "#4363d8",
};

export function kesehatanKelapaColor(value: number | null | undefined): string | null {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  return KESEHATAN_KELAPA_COLORS[value] ?? null;
}
