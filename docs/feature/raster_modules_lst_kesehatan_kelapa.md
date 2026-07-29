# Plan: Modul Peta Baru — LST Delta & Kesehatan Kelapa (Raster)

## Context

2 modul baru berbasis raster GeoTIFF, **terpisah** dari 3 modul existing (Aset, Sekolah, Potensi) — total jadi 5 modul di Sidebar:
1. **Perubahan Suhu Permukaan (LST Delta)** — dari `DeltaLST_2020_2025_FIX.tif`
2. **Kesehatan Vegetasi Kelapa** — dari `Kesehatan_Kelapa_2025_FIX.tif`

Ini kelas data baru sama sekali — semua layer existing (Aset/Sekolah/Potensi/Sungai/Jalan) itu **vector** (GeoJSON: point/line/polygon), sementara ini **raster** (grid pixel bernilai). Leaflet/react-leaflet gak punya komponen bawaan buat GeoTIFF, jadi butuh library tambahan & pola implementasi beda dari modul-modul sebelumnya.

### Hasil inspeksi data (sudah dicek langsung isi filenya)
Kedua file **align sempurna** (georeferencing identik — gampang di-overlay/dibandingin):
- 332×356 px, resolusi 10m/pixel, CRS `EPSG:32750` (WGS 84 / UTM zone 50S), origin (201680, 9074520)
- Extent ~3,32km × 3,56km, format GeoTIFF asli (tiled, LZW compressed) — bukan gambar biasa, beneran raster geospasial

**`DeltaLST_2020_2025_FIX.tif`** — 1 band float32, deskripsi GDAL `Delta_LST`. Value **-0,71 s/d +7,48** (asumsi °C, perlu dikonfirmasi satuannya). ~39% pixel `NaN` (no-data, kemungkinan di luar area relevan). Data kontinu (117.544 nilai unik) → butuh color ramp **diverging**, bukan sequential.

**`Kesehatan_Kelapa_2025_FIX.tif`** — 1 band uint8, deskripsi GDAL `Kesehatan`. Cuma **6 nilai unik: 0,1,2,3,4,5** — data terklasifikasi, gak ada NaN. **Arti tiap kelas belum dikonfirmasi** (apakah 0=gak ada kelapa & 1-5=tingkat sehat, atau 0-5 skala penuh, dan arah mana yang "sehat") — lihat Open Questions.

## Pendekatan Teknis: Client-side render (georaster), bukan pre-bake gambar

2 opsi yang dipertimbangkan:
- **A. Pre-bake ke PNG+worldfile** pakai GDAL/rasterio saat data-prep, browser tinggal render `ImageOverlay`. **Ditolak** — environment ini gak punya GDAL/rasterio terinstall, dan nambah system-level tooling di luar `pnpm`/Next.js pipeline gak konsisten sama arsitektur project (Zero-Backend, semua static file langsung di-fetch apa adanya). Juga bikin nilai piksel asli ilang (gak bisa query value pas diklik) kecuali bikin lookup terpisah.
- **B. Parse GeoTIFF langsung di browser** pakai `georaster` + `georaster-layer-for-leaflet` (npm package murni, gak butuh backend/system tool). **Dipilih** — konsisten sama pola fetch statis yang udah ada (`fetch("/data/tif/...")`, sama kayak fetch `.geojson`), dan nilai piksel asli tetap ada di memory buat fitur klik-lihat-detail.

### Dependency baru (npm)
```
georaster
georaster-layer-for-leaflet
proj4
```
`georaster-layer-for-leaflet` extend `L.GridLayer` (Leaflet asli, bukan komponen react-leaflet) — dipasang **imperatif** via `useMap()` + `useEffect()`, pola yang sama kayak `MapBoundsEnforcer` di `MapBase.tsx` (komponen yang return `null` tapi manipulasi map langsung).

**Gotcha yang perlu diantisipasi:** `EPSG:32750` (UTM zone 50S) kemungkinan gak otomatis dikenali `proj4` — aman-nya register manual sebelum dipakai:
```ts
proj4.defs("EPSG:32750", "+proj=utm +zone=50 +south +datum=WGS84 +units=m +no_defs");
```

## Implementasi

### 1. `package.json` — tambah 3 dependency di atas.

### 2. Layer components (pola baru, imperatif)
`src/components/map/layers/LstDeltaLayer.tsx` & `KesehatanKelapaLayer.tsx` — masing-masing:
- `fetch("/data/tif/....tif")` → `arrayBuffer()` → `parseGeoraster()` (dari `georaster`)
- Bikin `new GeoRasterLayer({ georaster, pixelValuesToColorFn, resolution: 256 })`, `layer.addTo(map)` di `useEffect`, `map.removeLayer(layer)` di cleanup
- `pixelValuesToColorFn`: fungsi mapping value→warna. LST pakai diverging ramp (biru↔putih↔merah, pivot ~0), NaN → `null`(transparent). Kesehatan pakai 6 warna diskrit per kelas.
- Klik di peta → query value piksel di titik itu (convert `latlng` klik → index piksel raster, ambil value dari `georaster.values`) → buka `InfoModal` dengan `{ value, lat, lng }` (bukan `feature.properties` kayak layer vector, karena raster gak punya "fitur" diskrit — semua titik punya value).

### 3. Modal content components — **scope MVP, minimalis**
`src/components/map/content/LstDeltaModal.tsx` & `KesehatanKelapaModal.tsx` — buat MVP ini **cuma nampilin raw value hasil query klik**, gak ada analisis/insight:
- LST: "Delta LST di titik ini: +2.3°C" (satuan °C udah confirmed) + rentang data keseluruhan (-0,71 s/d +7,48°C) buat konteks.
- Kesehatan: "Kelas: 3" apa adanya — **belum dikasih label semantik** ("Sehat"/"Kurang Sehat"/dll) karena arti tiap kelas belum dikonfirmasi ke anak geodesi (Open Question #1). Jangan nebak label, biarin angka polos + catatan kecil "makna kelas menyusul setelah dikonfirmasi tim lapangan".

**Analisis detail (perbandingan, insight, rekomendasi, dsb — kayak `PotensiModal`) sengaja DI LUAR scope MVP ini**, nunggu Open Question #1 kejawab. Lihat section "MVP vs Fase Lanjutan" di bawah.

### 4. Legend per modul
Komponen kecil (pola sama `FasumLegend`/`DusunLegend`) — LST pakai gradient bar kontinu (min→max °C), Kesehatan pakai 6 swatch diskrit + label kelas.

### 5. `Sidebar.tsx` — 2 nav item baru (group `"map"`)
```ts
{ id: "lst", label: "Perubahan Suhu Permukaan", icon: "thermostat", group: "map" },
{ id: "kesehatan-kelapa", label: "Kesehatan Vegetasi Kelapa", icon: "eco", group: "map" },
```

### 6. `page.tsx` — `MODULE_META` buat `lst` & `kesehatan-kelapa` (title, badge "Peta Interaktif").

### 7. `InfoModal.tsx` — extend union type `activeModule`, `MODULE_META` (label/icon/chipClass), render branch buat 2 modal baru.

### 8. `MapBase.tsx` — layer injection:
```tsx
{activeModule === "lst" && <LstDeltaLayer />}
{activeModule === "kesehatan-kelapa" && <KesehatanKelapaLayer />}
```

## MVP vs Fase Lanjutan

User belum sempat komunikasi ke anak geodesi soal arti kelas Kesehatan Kelapa — daripada nunggu, scope dipersempit jadi 2 fase:

**Fase 1 — MVP (plan ini, dieksekusi sekarang):**
- Raster ke-render di peta (LST & Kesehatan), align sama boundary desa, warna pakai palet default/placeholder (poin 3 di bawah).
- Klik → modal muncul, isinya **raw value/kelas apa adanya**, gak ada label semantik atau analisis.
- Legend simpel (gradient bar buat LST, swatch kelas 0-5 polos buat Kesehatan — bukan label "sehat/gak sehat").

**Fase 2 — Nanti, setelah Open Question #1 kejawab:**
- Modal Kesehatan Kelapa diperkaya jadi analisis detail (kayak `PotensiModal`) — label semantik per kelas, insight, mungkin perbandingan antar area.
- Palet warna final disesuaikan (kalau ternyata 0=no-data & 1-5=gradasi sehat, baru pantes pakai red→green health gradient; kalau strukturnya beda, palet nyesuaiin).
- Kemungkinan nambah statistik ringkasan di level modul (rata-rata delta LST desa, distribusi kelas kesehatan, dll) — di luar scope raw-value-per-klik.

## Status Open Questions
1. **Arti kelas `Kesehatan_Kelapa` 0-5** — **belum bisa dijawab** (belum dikomunikasikan ke anak geodesi). Gak nge-block Fase 1 (MVP jalan tanpa perlu tau ini), tapi jadi syarat mulai Fase 2.
2. **Satuan `DeltaLST`** — **CONFIRMED: Celsius (°C)**.
3. **Palet warna final** — **pakai default dulu buat MVP** (diverging blue-white-red buat LST, 6 warna kategorikal netral buat Kesehatan — persis kayak preview yang udah dikirim di `tif_data_preview.md`). Direvisi di Fase 2 kalau perlu.

## Verifikasi
1. `pnpm add georaster georaster-layer-for-leaflet proj4` — pastikan gak ada conflict versi.
2. `npx tsc --noEmit` — clean (cek juga apa `georaster`/`georaster-layer-for-leaflet` punya type declaration bawaan atau perlu `@types/` terpisah / `declare module` manual).
3. `bun run dev` — buka modul LST & Kesehatan Kelapa, raster muncul align sama boundary desa, warna kebaca jelas di semua basemap.
4. Klik di titik dalam raster → modal muncul dengan value yang masuk akal (dalam rentang -0,71 s/d 7,48 buat LST; 0-5 buat Kesehatan).
5. Klik di area `NaN` (LST) → gak nge-crash, kasih fallback jujur ("Data tidak tersedia di titik ini") bukan value ngasal.
6. `npx next build` (static export) — pastikan build sukses, raster fetch jalan normal di production (bukan cuma dev server).

## Status
Fase 1 (MVP) — **kode udah ditulis & `tsc`/`next build` udah diverifikasi clean**. Detail lengkap (file yang dibuat/diubah, keputusan teknis pas eksekusi, gotcha yang ketemu) ada di `raster_modules_implementation_notes.md`. **Belum dites visual/interaktif di browser** — itu langkah verifikasi manual yang masih perlu dilakuin sebelum dianggap kelar beneran.
