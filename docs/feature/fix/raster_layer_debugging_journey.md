# Debugging Journey: Raster Layer LST Delta & Kesehatan Kelapa

Dokumen ini nyeritain **seluruh proses debugging** dari modul raster (`LstDeltaLayer.tsx` & `KesehatanKelapaLayer.tsx`) — dari bug pertama ditemuin sampe root cause final ketemu. Ditulis lengkap (termasuk 2 fix yang GAGAL) biar paham alur mikirnya, bukan cuma hasil akhirnya doang.

**TL;DR kalau males baca semua:** ada 2 bug beda yang keliatannya mirip. Bug #1 soal Leaflet *pane* (tempat render). Bug #2 (yang paling susah) soal *cache* internal library `georaster-layer-for-leaflet` yang ke-share diam-diam lintas raster berbeda. Fix final: 1 baris (`caching: false`), tapi butuh 3 iterasi buat nemuin baris itu.

---

## Konteks Awal

Modul `LstDeltaLayer.tsx` (raster Delta LST 2020-2025) & `KesehatanKelapaLayer.tsx` (raster kesehatan vegetasi kelapa) baru aja selesai diimplementasi Fase 1/MVP — render GeoTIFF di Leaflet pakai `georaster` + `georaster-layer-for-leaflet` (client-side parsing, gak ada backend). Lihat `docs/feature/raster_modules_lst_kesehatan_kelapa.md` & `raster_modules_implementation_notes.md` buat detail implementasi awal.

Begitu ditest, muncul serangkaian bug yang gak langsung ketauan akar masalahnya.

---

## Bug Report #1: Layer lama gak ke-remove + raster ilang pas ganti basemap

User laporan 2 gejala:
1. Pindah dari modul LST ke modul Kesehatan Kelapa → raster LST **masih nempel** di peta.
2. Ganti basemap (Satelit/Jalan/Clean) pas lagi di modul LST/Kesehatan → raster-nya **ilang total**.

### Investigasi #1

Dicek kode `LstDeltaLayer.tsx`/`KesehatanKelapaLayer.tsx` — pola imperatif standar:
```ts
useEffect(() => {
  let layer: GeoRasterLayer | undefined;
  fetch("/data/tif/....tif")
    .then(res => res.arrayBuffer())
    .then(buffer => parseGeoraster(buffer))
    .then(geo => {
      layer = new GeoRasterLayer({ georaster: geo, pixelValuesToColorFn: ..., resolution: 256, opacity: 0.75 });
      layer.addTo(map);
    });
  return () => { if (layer) map.removeLayer(layer); };
}, [map]);
```
Logic React-nya (dicek manual) udah bener — gak ada race condition jelas di level `useEffect` cleanup.

**Hipotesis:** `GeoRasterLayer` extend `L.GridLayer`, dan defaultnya numpang di `tilePane` — pane YANG SAMA kayak basemap (`<TileLayer>`). Di `MapBase.tsx`, basemap sengaja di-force-remount tiap ganti (`<TileLayer key={basemap}>`, biar Leaflet re-fetch tile basemap baru). Karena raster numpang di pane yang sama, remount basemap kena imbas ke tile raster juga → raster ilang pas ganti basemap. Soal "gak ke-remove pas ganti modul", dugaan awal: `georaster-layer-for-leaflet` proses render tile-nya async (mungkin worker-based), jadi ada tile yang nempel telat setelah `removeLayer` dipanggil.

### Fix #1: Pane Leaflet khusus buat raster

Bikin `src/lib/rasterPane.ts` — pane baru (`rasterPane`) terpisah dari `tilePane`, z-index 350 (di atas basemap, di bawah boundary desa). Kedua layer file dikasih `pane: RASTER_PANE_NAME` di opsi `GeoRasterLayer`, plus defensive cleanup (`pane.innerHTML = ""` manual di `useEffect` cleanup, jaga-jaga ada tile nempel telat).

`tsc`/`next build` clean. **Tapi belum dites di browser** (gak ada akses browser dari sisi AI).

---

## Bug Report #2: Ganti basemap fix, tapi pindah modul masih bug

User test di browser: masalah "raster ilang pas ganti basemap" **udah kelar** (pane isolation berhasil). Tapi "pindah modul, raster lama tetep ada" **masih kejadian**.

### Investigasi #2

Reconsider: `LstDeltaLayer` & `KesehatanKelapaLayer` sama-sama pakai `RASTER_PANE_NAME` yang **sama** — tapi masing-masing nyimpen referensi layer-nya sendiri-sendiri di closure `useEffect`, gak saling tau satu sama lain. Fix #1 (`pane.innerHTML=""`) ngandelin asumsi "cleanup modul lama pasti kelar duluan sebelum effect modul baru jalan" — asumsi yang gak selalu ke-guarantee kejadian bener, apalagi gabung sama tile-rendering async.

### Fix #2: Tracker "raster aktif" level modul

`src/lib/rasterPane.ts` ditambah state module-level (bukan per-komponen):
```ts
let currentRasterLayer: Layer | null = null;

export function setActiveRasterLayer(map: LeafletMap, layer: Layer): void {
  if (currentRasterLayer) map.removeLayer(currentRasterLayer);
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
Prinsip: sebelum masang layer baru, WAJIB copot dulu apapun yang sebelumnya aktif — gak peduli siapa yang masang, gak peduli urutan mount/unmount React. Drop defensive `innerHTML=""` yang blind (berisiko nge-wipe layer baru kalau urutannya kebalik).

`tsc`/`next build` clean.

---

## Bug Report #3: "Masih dengan masalah yang sama"

User test lagi — **masih gagal**. Di titik ini udah 2 fix dicoba dan gagal dua-duanya.

### Systematic Debugging: berhenti nebak, invoke skill

Ini pelanggaran "Iron Law" debugging: udah 2x nebak-fix-berdasarkan-teori tanpa bukti konkret. Invoke skill `superpowers:systematic-debugging` — intinya: **NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST**, dan kalau udah ≥2 fix gagal, harus balik ke Phase 1 (gather evidence), bukan nebak fix ke-3.

Karena AI gak punya akses browser, evidence harus digali lewat **instrumentasi** — nambah `console.log` di titik-titik kritis (`setActiveRasterLayer`, `removeIfActiveRasterLayer`, mount/unmount tiap layer component), minta user reproduce, terus kasih hasil log mentahnya.

### Evidence yang didapet

User kasih log lengkap. Ringkasnya (real log, disingkat):
```
[KesehatanKelapaLayer] MOUNT effect start
[KesehatanKelapaLayer] fetch+parse resolved. cancelled? false
[rasterPane] setActiveRasterLayer called. currentRasterLayer before: null
[rasterPane] new layer added. hasLayer: true
[rasterPane] pane children count after add: 8   <- tile ke-render, "leaflet-tile-loaded"

[KesehatanKelapaLayer] UNMOUNT cleanup. layer was: NewClass {...}
[rasterPane] removeIfActiveRasterLayer called. isMatch: true
[rasterPane] removed & cleared currentRasterLayer
[rasterPane] pane children count after cleanup: 0   <- BENERAN KOSONG

[LstDeltaLayer] MOUNT effect start
[LstDeltaLayer] fetch+parse resolved. cancelled? false
[rasterPane] setActiveRasterLayer called. currentRasterLayer before: null   <- BENER, null
[rasterPane] new layer added. hasLayer: true
[rasterPane] pane children count after add: 8
```
**Kesimpulan dari log ini: SEMUA logic React/Leaflet-nya kebukti bener.** Pane count 8→0→8, `currentRasterLayer` transisi null→A→null→B dengan benar, `hasLayer()` semua match, tile ke-mark `leaflet-tile-loaded`. Fix #2 (tracker) beneran berhasil nyopot & masang layer dengan benar di level DOM/Leaflet.

**Tapi user tetep bilang visualnya masih salah.** Ini artinya bug-nya BUKAN di layer add/remove — harus ada penjelasan lain.

### 1 bukti lagi: cek legend vs warna raster

Ditanya spesifik: pas raster "salah" muncul, legend di pojok nunjuk modul apa, dan warnanya kayak apa?

**Jawaban user: legend nunjuk modul yang BENER (misal "Kesehatan Kelapa"), tapi warna raster-nya masih pola modul SEBELUMNYA (LST).**

Ini kunci penting: komponen React (legend, teks) ke-update bener sesuai modul aktif. Layer Leaflet-nya (dibuktikan log) juga ke-add/remove bener. Satu-satunya penjelasan tersisa: **konten piksel yang digambar di canvas tile-nya sendiri yang stale** — bukan soal ada-gaknya layer, tapi soal APA yang digambar di layer itu.

### Root cause SEBENARNYA — baca source code library

Cek langsung source `node_modules/georaster-layer-for-leaflet/src/georaster-layer-for-leaflet.ts`:
```ts
const GeoRasterLayer = L.GridLayer.extend({
  options: { ..., caching: true, ... },
  cache: {},                              // ← didefinisikan di level PROTOTYPE
  initialize: function (options) {
    // ...
    this._cache = { innerTile: {}, tile: {} };   // beda nama (underscore) — INI yang di-reset per-instance
    // this.cache (tanpa underscore) TIDAK PERNAH di-reset per-instance
  },
  createTile: function (coords, done) {
    // ...
    const key = `${coordsKey}:${resolution}`;    // ← cache key CUMA koordinat tile + resolution
    if (this.options.caching && this.cache[key]) {
      done(undefined, this.cache[key]);           // reuse tile YANG UDAH ADA, apapun raster asalnya
      return this.cache[key];
    }
    this.drawTile({ tile, coords, context, done, resolution });   // baru digambar kalau cache miss
  },
});
```

**Penjelasan teknis (JS/Leaflet gotcha klasik):** `L.Class.extend({ cache: {}, ... })` — properti `cache: {}` di object literal itu jadi properti **prototype**, bukan instance. Karena `initialize()` cuma nyentuh `this._cache` (properti beda, pake underscore), `this.cache` yang dibaca `createTile` **selalu resolve ke object prototype yang sama**, buat SEMUA instance `GeoRasterLayer` — termasuk lintas `LstDeltaLayer` dan `KesehatanKelapaLayer`, karena dua-duanya `import GeoRasterLayer from "georaster-layer-for-leaflet"` — **class yang SAMA persis**.

Cache key-nya cuma `"${x}/${y}/${z}:${resolution}"` — gak ada info raster/instance mana yang minta. Karena kedua modul kita pakai `resolution: 256` yang sama, dan user liat area peta yang sama (koordinat tile sama), pas Kesehatan Kelapa minta tile buat koordinat yang **PERNAH** dirender LST, dia ketemu cache HIT — dapet tile LST yang udah jadi, `drawTile` (yang manggil `pixelValuesToColorFn` punya Kesehatan) **gak pernah dipanggil sama sekali**.

Ini persis jelasin kenapa DOM/layer management-nya kebukti sempurna di log (Leaflet emang beneran nambahin layer object baru, container baru, semua bukti "layer baru ada") — tapi ISI VISUAL canvas-nya nyangkut dari raster sebelumnya, karena `createTile` short-circuit balik ke cache sebelum sempet gambar ulang.

### Fix #3 (final): Matiin caching library-nya

```ts
layer = new GeoRasterLayer({
  georaster: geo,
  pixelValuesToColorFn: (values) => lstDeltaColor(values[0], LST_MIN, LST_MAX),
  resolution: 256,
  opacity: 0.75,
  pane: RASTER_PANE_NAME,
  caching: false,   // ← fix final
});
```
`caching: false` bikin kondisi `if (this.options.caching && this.cache[key])` di source library **selalu `false`** — `createTile` **selalu** panggil `drawTile` (gambar ulang pakai `pixelValuesToColorFn` yang bener), gak pernah baca cache yang ke-share itu.

Type shim `src/types/georaster.d.ts` ditambah field `caching?: boolean` di `GeoRasterLayerOptions` (belum ada sebelumnya — TypeScript nolak opsi ini sebelum shim-nya diupdate).

Diagnostic `console.log` yang dipasang buat gather evidence **dibersihin semua** — itu instrumentasi debugging sementara, bukan bagian dari kode final.

### Verifikasi final
1. `npx tsc --noEmit` — clean.
2. `npx next build` — sukses.
3. **User konfirmasi langsung di browser: AMAN.** Warna raster udah selalu ikut modul yang aktif, gak nyangkut lagi.

---

## Ringkasan: 3 Bug, 3 Root Cause Beda

| # | Gejala | Root Cause | Fix |
|---|---|---|---|
| 1 | Raster ilang pas ganti basemap | Raster numpang di `tilePane` yang sama kayak basemap — kena imbas remount `<TileLayer key={basemap}>` | Pane Leaflet khusus (`rasterPane`, z-index 350) |
| 2 | Layer lama masih nempel pas ganti modul (versi awal) | 2 komponen raster gak saling tau, cleanup ngandelin timing React yang gak ke-guarantee | Tracker "layer aktif" level modul (`setActiveRasterLayer`/`removeIfActiveRasterLayer`) |
| 3 | Layer/DOM kebukti bener via log, tapi warna raster masih raster lama | `georaster-layer-for-leaflet` cache tile di properti **prototype**, ke-share lintas semua instance, key-nya gak bedain raster asalnya | `caching: false` di opsi `GeoRasterLayer` |

**Pelajaran penting:** bug #3 gak akan ketemu kalau cuma modif kode sendiri terus-terusan — harus baca source code LIBRARY PIHAK KETIGA buat nemuin akar masalahnya. Juga bukti pentingnya systematic debugging: setelah 2 fix gagal, berhenti nebak, kumpulin evidence konkret (log + screenshot legend) dulu sebelum nyoba fix lagi — evidence itu yang langsung ngarahin ke root cause bener, bukan tebakan ke-3 yang mungkin salah lagi.

## File yang kena dampak sepanjang debugging ini
- **Baru:** `src/lib/rasterPane.ts`, `src/types/georaster.d.ts` (field `caching` ditambah belakangan)
- **Diubah (berkali-kali, iteratif):** `src/components/map/layers/LstDeltaLayer.tsx`, `src/components/map/layers/KesehatanKelapaLayer.tsx`

## Dokumen terkait
- `docs/feature/raster_modules_lst_kesehatan_kelapa.md` — plan awal implementasi Fase 1/MVP
- `docs/feature/raster_modules_implementation_notes.md` — catatan implementasi awal (pnpm, type shim, dll)
- `docs/feature/raster_layer_pane_fix.md` — versi lebih teknis/ringkas dari fix #1 & #2 (dokumen ini nyeritain versi lengkap + fix #3)
