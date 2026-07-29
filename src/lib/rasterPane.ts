// src/lib/rasterPane.ts
// Pane Leaflet khusus buat raster GeoTIFF (LST Delta, Kesehatan Kelapa) — terpisah dari tilePane
// basemap, biar gak kena remount pas basemap di-toggle, dan biar cleanup-nya bisa dibersihin manual
// dengan aman (pane ini eksklusif raster doang, gak ada layer lain yang numpang).
import type { Map as LeafletMap, Layer } from "leaflet";

export const RASTER_PANE_NAME = "rasterPane";
// z-index: di atas tilePane (200, basemap), di bawah overlayPane (400, boundary administrasi &
// layer vector lain) — biar garis batas desa tetep keliatan nutupin raster.
const RASTER_PANE_Z_INDEX = "350";

export function ensureRasterPane(map: LeafletMap): void {
  if (!map.getPane(RASTER_PANE_NAME)) {
    const pane = map.createPane(RASTER_PANE_NAME);
    pane.style.zIndex = RASTER_PANE_Z_INDEX;
  }
}

// Referensi layer raster yang lagi aktif di peta — di luar React state, sengaja modul-level
// (bukan per-komponen). LstDeltaLayer & KesehatanKelapaLayer share 1 pane yang sama, dan urutan
// unmount (modul lama)/mount (modul baru) React ternyata gak selalu ke-guarantee kejadian pas
// gabung sama tile-rendering georaster-layer-for-leaflet yang async/worker-based — jadi "siapa
// yang lagi aktif" gak bisa cuma dipercayakan ke lifecycle masing-masing komponen sendiri-sendiri.
let currentRasterLayer: Layer | null = null;

/**
 * Pasang layer raster baru — otomatis nyopot layer raster sebelumnya (siapapun yang masang)
 * SEBELUM masang yang baru. Pakai ini gantiin `layer.addTo(map)` manual.
 */
export function setActiveRasterLayer(map: LeafletMap, layer: Layer): void {
  if (currentRasterLayer) {
    map.removeLayer(currentRasterLayer);
  }
  currentRasterLayer = layer;
  layer.addTo(map);
}

/**
 * Copot layer raster kalau dia masih yang "aktif". Kalau udah kegantiin duluan sama layer lain
 * (misal modul udah kepindah 2x sebelum fetch pertama kelar), gak ngapa-ngapain — biar gak salah
 * nyopot layer yang harusnya masih ada. Pakai ini gantiin `map.removeLayer(layer)` manual di cleanup.
 */
export function removeIfActiveRasterLayer(map: LeafletMap, layer: Layer): void {
  if (currentRasterLayer === layer) {
    map.removeLayer(layer);
    currentRasterLayer = null;
  }
}
