# Fix: Raster Layer — Gak Ke-remove Pas Ganti Modul & Ilang Pas Ganti Basemap

## Context

2 bug dikonfirmasi user di `LstDeltaLayer.tsx` & `KesehatanKelapaLayer.tsx` (modul raster LST Delta & Kesehatan Kelapa, Fase 1/MVP):
1. **Layer lama gak ke-remove pas ganti modul** — pindah dari modul LST ke Kesehatan Kelapa, raster LST masih nempel di peta.
2. **Raster ilang pas ganti style basemap** (Satelit/Jalan/Clean) — raster LST/Kesehatan hilang begitu basemap di-toggle.

**Root cause (2 bug ini 1 akar masalah yang sama):** `GeoRasterLayer` (dari `georaster-layer-for-leaflet`) extend `L.GridLayer`, dan defaultnya nempatin diri di **pane yang sama kayak basemap (`tilePane`)** kalau gak dispesifikin manual. Ini bikin 2 masalah:
- `<TileLayer key={basemap}>` di `MapBase.tsx` sengaja di-force-remount tiap basemap ganti (`key={basemap}`) — karena raster numpang di pane yang sama, remount basemap ikut "kena imbas" ke tile raster yang nempel di pane itu → raster ilang.
- Removal (`map.removeLayer(layer)`) di cleanup `useEffect` udah bener secara logic React (dicek ulang, gak ada race condition di kode React-nya) — tapi `georaster-layer-for-leaflet` kemungkinan besar masih ngirim tile hasil render (proses async/worker-based per-tile) SETELAH `removeLayer` dipanggil, nempelin tile "telat" itu ke pane bareng, kesannya kayak "gak ke-remove".

## Fix: Pane Leaflet khusus raster + defensive cleanup

### 1. `src/lib/rasterPane.ts` (baru)
```ts
// src/lib/rasterPane.ts
// Pane Leaflet khusus buat raster GeoTIFF (LST Delta, Kesehatan Kelapa) — terpisah dari tilePane
// basemap, biar gak kena remount pas basemap di-toggle, dan biar cleanup-nya bisa dibersihin manual
// dengan aman (pane ini eksklusif raster doang, gak ada layer lain yang numpang).
import type { Map as LeafletMap } from "leaflet";

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
```

### 2. `LstDeltaLayer.tsx` & `KesehatanKelapaLayer.tsx` — perubahan identik di keduanya
```ts
import { ensureRasterPane, RASTER_PANE_NAME } from "@/lib/rasterPane";

// ...di dalam useEffect (fetch+render):
useEffect(() => {
  ensureRasterPane(map); // ← baris baru
  let layer: GeoRasterLayer | undefined;
  let cancelled = false;

  fetch("/data/tif/....tif")
    .then((res) => res.arrayBuffer())
    .then((buffer) => parseGeoraster(buffer))
    .then((geo) => {
      if (cancelled) return;
      setGeoraster(geo);
      layer = new GeoRasterLayer({
        georaster: geo,
        pixelValuesToColorFn: (values) => ...,
        resolution: 256,
        opacity: 0.75,
        pane: RASTER_PANE_NAME, // ← baris baru
      });
      layer.addTo(map);
    })
    .catch((err) => console.error(...));

  return () => {
    cancelled = true;
    if (layer) map.removeLayer(layer);
    // Defense-in-depth: georaster-layer-for-leaflet kadang masih nyelesein render tile
    // (async/worker-based) SETELAH removeLayer dipanggil — bersihin manual pane-nya biar
    // gak ada sisa visual pas modul/basemap ganti. Aman karena pane ini eksklusif raster.
    const pane = map.getPane(RASTER_PANE_NAME);
    if (pane) pane.innerHTML = "";
  };
}, [map]);
```
Sisa kode (state, effect klik-query pixel, modal, legend) gak berubah — cuma nambah pane isolation + defensive cleanup.

### Kenapa gak perlu ubah type shim (`src/types/georaster.d.ts`)
`GeoRasterLayerOptions extends GridLayerOptions` — `pane?: string` udah include otomatis dari `L.GridLayerOptions`/`L.LayerOptions` bawaan `@types/leaflet`.

## Verifikasi
1. `npx tsc --noEmit` — **clean** ✓ (udah dijalanin).
2. `npx next build` — **sukses** ✓ (udah dijalanin).
3. **Manual di browser** (belum bisa dites di sini, gak ada akses browser):
   - Buka modul LST → raster muncul. Pindah ke modul Kesehatan Kelapa → raster LST **hilang total**, raster Kesehatan Kelapa muncul gantiin.
   - Di modul LST/Kesehatan, ganti basemap (Satelit ↔ Jalan ↔ Clean) → raster **tetap kelihatan**, gak ilang.
   - Boundary administrasi (garis desa) tetep keliatan nutupin/di atas raster (cek z-index pane bener — 350, di antara tilePane 200 dan overlayPane 400).

## File yang diubah
**Baru:** `src/lib/rasterPane.ts`
**Diubah:** `src/components/map/layers/LstDeltaLayer.tsx`, `src/components/map/layers/KesehatanKelapaLayer.tsx`

## Status
Kode selesai, `tsc`/`next build` clean. Verifikasi visual/interaktif di browser masih perlu dilakuin manual.

---

## Update: Bug lanjutan — pindah antar 2 modul raster, raster lama nempel

Setelah fix di atas diterapkan, user nemu bug baru: pindah dari modul LST ke Kesehatan Kelapa, **data query (klik peta) udah bener** ikut modul aktif, tapi **raster yang kelihatan di peta masih raster lama (LST)** — raster baru gak ke-render, sampe raster lama beneran ke-replace secara visual.

### Root cause
`LstDeltaLayer` & `KesehatanKelapaLayer` **share 1 pane yang sama** (`RASTER_PANE_NAME`), tapi masing-masing komponen nyimpen referensi layer-nya sendiri-sendiri di closure `useEffect`, gak saling tau satu sama lain. Fix sebelumnya (`pane.innerHTML = ""` di cleanup) ngandelin asumsi "cleanup modul lama pasti kelar duluan sebelum effect modul baru jalan" — asumsi ini gak selalu ke-guarantee kejadian bener pas gabung sama tile-rendering `georaster-layer-for-leaflet` yang async/worker-based (tile bisa nempel telat setelah cleanup jalan). Selain itu, pendekatan `innerHTML=""` blind (gak cek "ini beneran punya gue?") berisiko malah nge-wipe raster BARU kalau ternyata urutannya kebalik.

### Fix: tracker "raster layer aktif" di level modul (bukan per-komponen)
`src/lib/rasterPane.ts` ditambah:
```ts
import type { Map as LeafletMap, Layer } from "leaflet";

let currentRasterLayer: Layer | null = null;

export function setActiveRasterLayer(map: LeafletMap, layer: Layer): void {
  if (currentRasterLayer) {
    map.removeLayer(currentRasterLayer);
  }
  currentRasterLayer = layer;
  layer.addTo(map);
}

export function removeIfActiveRasterLayer(map: LeafletMap, layer: Layer): void {
  if (currentRasterLayer === layer) {
    map.removeLayer(layer);
    currentRasterLayer = null;
  }
}
```
Prinsipnya: **sebelum masang layer raster baru, WAJIB copot dulu apapun yang sebelumnya aktif** — gak peduli siapa yang masang (LST atau Kesehatan), gak peduli urutan mount/unmount React. Ini mindahin jaminan "cuma 1 raster aktif" dari "hope timing-nya bener" jadi "dipaksa secara eksplisit tiap kali ada layer baru mau dipasang".

Di kedua layer file, ganti:
- `layer.addTo(map)` → `setActiveRasterLayer(map, layer)`
- `if (layer) map.removeLayer(layer)` (+ blind `pane.innerHTML=""`) → `if (layer) removeIfActiveRasterLayer(map, layer)`

`removeIfActiveRasterLayer` sengaja CEK DULU (`currentRasterLayer === layer`) sebelum nyopot — kalau layer yang mau dicopot udah bukan yang aktif lagi (skenario: modul dipindah 2x cepet sebelum fetch pertama kelar), gak ngapa-ngapain, biar gak salah nyopot layer yang harusnya masih ada.

### Verifikasi
1. `npx tsc --noEmit` — **clean** ✓.
2. `npx next build` — **sukses** ✓.
3. **Manual di browser (belum dites, gak ada akses browser di sini):** pindah modul LST → Kesehatan Kelapa berkali-kali, gantian cepet — pastikan cuma 1 raster kelihatan setiap saat, sesuai modul yang lagi aktif, gak pernah numpuk atau nempel raster lama.

### File yang diubah (update ini)
`src/lib/rasterPane.ts`, `src/components/map/layers/LstDeltaLayer.tsx`, `src/components/map/layers/KesehatanKelapaLayer.tsx`

---

## Update ke-2: Bug ternyata masih ada — DOM/layer bener, tapi WARNA raster masih kepake raster lama

Fix di atas ternyata **belum nyelesein masalah**. User laporan ulang: legend nunjukkin modul yang bener (misal "Kesehatan Kelapa"), tapi warna raster yang ke-render **masih pola LST** (diverging biru-merah), dan sebaliknya kalau urutan modulnya dibalik.

### Systematic debugging: gather evidence dulu sebelum nebak fix ke-3
Karena udah 2 fix gagal, sebelum nyoba fix lagi, ditambahin `console.log` instrumentasi di `rasterPane.ts` + kedua layer file (nge-log tiap add/remove layer, `hasLayer`, jumlah children pane) — user reproduce & kasih hasil log-nya.

**Hasil trace:** SEMUA logic React/Leaflet-nya kebukti bener — pane children count 8→0→8, `currentRasterLayer` transisi null→A→null→B dengan benar, `map.hasLayer()` semua match, tile ke-mark `leaflet-tile-loaded`. Add/remove layer 100% berfungsi sesuai desain.

Karena DOM-nya kebukti bener tapi visualnya masih salah, minta 1 bukti lagi: **legend nunjuk modul yang bener, tapi warna raster masih pola modul sebelumnya** — ini ngarah ke kesimpulan: bug-nya bukan di layer management, tapi di **konten piksel canvas yang stale**.

### Root cause SEBENARNYA — ketemu di source code `georaster-layer-for-leaflet`
```ts
// node_modules/georaster-layer-for-leaflet/src/georaster-layer-for-leaflet.ts
const GeoRasterLayer = L.GridLayer.extend({
  options: { ..., caching: true, ... },
  cache: {},  // ← BUG: didefinisikan di level PROTOTYPE, bukan di-reset per-instance
  initialize: function (options) {
    // ...
    this._cache = { innerTile: {}, tile: {} };  // beda properti (underscore) — INI yang di-reset per-instance
    // `this.cache` (tanpa underscore) TETEP resolve ke object prototype yang sama buat SEMUA instance
  },
  createTile: function (coords, done) {
    // ...
    const key = `${coordsKey}:${resolution}`;  // ← cache key CUMA coords+resolution
    if (this.options.caching && this.cache[key]) {
      done(undefined, this.cache[key]);  // reuse tile YANG UDAH DI-RENDER, gak peduli raster asalnya
      return this.cache[key];
    }
    // ...
  },
});
```
`cache: {}` itu properti object literal yang dikasih ke `L.Class.extend()` — di JS/Leaflet ini jadi properti **prototype**, bukan instance. `initialize()` cuma reset `this._cache` (beda nama, pake underscore) — `this.cache` (yang dipakai `createTile`) **gak pernah di-reset per-instance**, jadi tetap nunjuk ke 1 object yang SAMA buat SEMUA `GeoRasterLayer`, termasuk lintas `LstDeltaLayer` dan `KesehatanKelapaLayer` (dua-duanya import class yang sama).

Karena cache key cuma `coords:resolution` (gak ada info raster asalnya), dan kedua modul kita pakai `resolution: 256` yang sama serta sering render tile coordinate yang sama (user liat area yang sama di peta) — begitu Kesehatan Kelapa minta tile buat koordinat yang PERNAH di-render LST, dia dapet tile **LST yang udah jadi**, bukan gambar ulang pakai `pixelValuesToColorFn` punya Kesehatan.

Ini kenapa DOM-nya (container, canvas element, `hasLayer`) semua kebukti bener — Leaflet-nya emang beneran nambahin layer baru — tapi ISI canvas-nya nyangkut dari raster lama.

### Fix
Set `caching: false` di opsi `GeoRasterLayer` construction (di kedua layer file) — ini bikin baris `if (this.options.caching && this.cache[key])` selalu `false`, jadi `createTile` SELALU render ulang lewat `drawTile` (pakai `pixelValuesToColorFn` yang bener sesuai raster aktif), gak pernah baca dari cache yang ke-share itu.

Type shim `src/types/georaster.d.ts` ditambah field `caching?: boolean` di `GeoRasterLayerOptions` (belum ada sebelumnya, TypeScript nolak sebelum ditambahin).

Diagnostic `console.log` yang ditambahin buat gather evidence udah **dibersihin** (dev-only debugging, bukan bagian dari fix final).

### Verifikasi
1. `npx tsc --noEmit` — **clean** ✓.
2. `npx next build` — **sukses** ✓.
3. **Manual di browser (belum dites):** pindah modul LST ↔ Kesehatan Kelapa berkali-kali — warna raster harus SELALU ikut modul yang lagi aktif (diverging biru-merah buat LST, 6 warna kategorikal buat Kesehatan), gak pernah nyangkut warna modul sebelumnya.

### File yang diubah (update ke-2)
`src/types/georaster.d.ts`, `src/lib/rasterPane.ts` (bersihin logging), `src/components/map/layers/LstDeltaLayer.tsx`, `src/components/map/layers/KesehatanKelapaLayer.tsx`
