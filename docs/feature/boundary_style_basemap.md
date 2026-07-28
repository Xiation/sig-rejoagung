# Brainstorm: Style Boundary Batas Administrasi Desa — Menyesuaikan Basemap

## Context

`MapBase.tsx` sekarang render batas administrasi Desa Rejoagung (GeoJSON `Batas Administrasi.geojson`) pakai style statis:
```tsx
<GeoJSON
  data={boundaryData}
  style={{
    weight: 3,
    color: "#f8fafc", // putih
    fillColor: "transparent",
    fillOpacity: 0,
  }}
  interactive={false}
/>
```
Putih cocok di atas basemap **Satelit** (citra Esri, umumnya gelap/bervariasi). Tapi sejak basemap toggle ditambah (`docs/feature/basemap_toggle.md`) — basemap **Jalan** (OSM) dan **Clean** (Stadia Maps `alidade_smooth`) sama-sama cenderung **terang/putih-based** — garis boundary putih jadi nyaris invisible di 2 basemap itu.

## Opsi yang Dipertimbangkan

### Opsi A — Mask area luar Rejoagung jadi abu-abu
Ide: bikin overlay abu-abu semi-transparan nutupin semua area DI LUAR polygon Rejoagung (teknik "spotlight mask" — 1 polygon gede dengan "lubang" persis bentuk boundary desa).

**Kenapa gak direkomendasikan (untuk sekarang):**
- `MapBoundsEnforcer` (`MapBase.tsx`) udah manggil `map.setMaxBounds()` + `minZoom={13}` berdasarkan bounding box `Batas Administrasi.geojson` — user **udah gak bisa pan jauh ke luar** wilayah desa. Area "luar" yang secara teknis masih keliatan cuma sisa sudut bounding box (kotak pembungkus, bukan bentuk asli polygon) — dampak visual masking kemungkinan gak sebesar yang dibayangkan, karena sebagian besar "luar" udah gak accessible dari awal.
- Implementasi butuh polygon dengan hole (exterior ring = viewport/world besar, interior ring = boundary desa) — perlu library kayak `turf.js` (`turf.mask()`) atau construct manual, rawan salah winding-order GeoJSON (ring searah jarum jam vs berlawanan nentuin mana "lubang" mana "isi").
- Kompleksitas tambahan (dependency baru / logic geometri) buat payoff yang kemungkinan kecil.

### Opsi B — Ganti ke warna mencolok statis (merah/kuning)
Ide: 1 warna tetap yang kontras di semua basemap, ganti dari putih ke misal merah (`#ef4444`) atau kuning.

**Concern:**
- Kuning (`#facc15`) udah dipake buat warna marker kategori **Olahraga** (`FASUM_COLORS.olahraga` di `AsetfasumLayer.tsx`) — kalau boundary juga kuning, berpotensi bikin bingung ("ini garis batas desa atau ada row of olahraga markers?").
- Merah polos berisiko nyaris nyampur sama warna jalan raya di basemap OSM (yang emang sering pakai merah/oranye buat jalan utama) — kontras kurang optimal justru di basemap yang paling butuh kontras jelas.
- Tapi ini opsi PALING SIMPEL — 1 baris ganti value `color`, gak ada logic tambahan.

### Opsi C — Warna boundary ikut basemap aktif (rekomendasi)
Ide: karena state `basemap` (`"satelit" | "jalan" | "clean"`) udah ada di `MapBase.tsx`, tinggal bikin `color` boundary jadi conditional:
```tsx
const BOUNDARY_COLOR: Record<BasemapKey, string> = {
  satelit: "#f8fafc", // putih — kontras di citra satelit gelap/bervariasi
  jalan: "#1e293b",   // navy gelap — kontras di basemap OSM terang
  clean: "#1e293b",   // sama, basemap Clean juga terang
};

<GeoJSON
  data={boundaryData}
  style={{
    weight: 3,
    color: BOUNDARY_COLOR[basemap],
    fillColor: "transparent",
    fillOpacity: 0,
  }}
  interactive={false}
/>
```
**Kenapa ini yang direkomendasikan:**
- Biaya implementasi kecil — cuma nambah 1 lookup object + ganti 1 value, gak ada dependency/library baru.
- Langsung nyasar akar masalah yang di-describe (putih cocok satelit, gak cocok basemap lain) — gak perlu nyari 1 warna universal yang harus menang di 3 basemap berbeda sekaligus.
- `GeoJSON` component react-leaflet re-render otomatis pas prop `style` berubah (gak perlu `key` trick kayak `TileLayer`).

### Opsi D — Tambahan opsional: teknik "casing" (garis dobel)
Bisa dikombinasi ke Opsi C (atau B) buat extra safety margin — render 2 layer boundary bertumpuk: garis putih/gelap tebal di bawah (halo), garis warna aksen tipis di atas. Trik kartografi standar biar tetep kebaca di basemap apapun tanpa perlu tau warna basemap-nya duluan. Contoh (pakai 2 `<GeoJSON>` bertumpuk, atau 1 `<Polyline>` dengan `weight` lebih tebal di bawahnya):
```tsx
{/* Halo/casing — digambar duluan, di bawah */}
<GeoJSON data={boundaryData} style={{ weight: 6, color: "#ffffff", opacity: 0.6, fillOpacity: 0 }} interactive={false} />
{/* Garis utama — di atas halo */}
<GeoJSON data={boundaryData} style={{ weight: 3, color: BOUNDARY_COLOR[basemap], fillOpacity: 0 }} interactive={false} />
```
Opsional — cuma kalau Opsi C ternyata masih kurang kontras di kondisi tertentu (misal saat basemap Jalan area yang padat garis jalan berwarna gelap juga).

## Rekomendasi
**Opsi C** sebagai basis (murah, tepat sasaran, minim risiko), tambah **Opsi D** kalau abis dicoba visual di 3 basemap ternyata masih ada spot yang kurang kontras. **Opsi A** (masking) di-park dulu — bukan gak mungkin, tapi ROI-nya kurang jelas selama `maxBounds` udah membatasi pan ke luar desa.

## Keputusan
**Opsi C dipilih.** Warna `jalan`/`clean` pakai `#1e293b` (navy gelap) dulu buat keduanya (bisa direvisi belakangan kalau abis dicoba visual ternyata kurang pas / butuh dibedain per basemap).

## Implementasi (siap diterapkan manual ke `MapBase.tsx`)

### 1. Tambah lookup warna (module scope, deket `BASEMAPS`)
```ts
const BOUNDARY_COLOR: Record<BasemapKey, string> = {
  satelit: "#f8fafc", // putih — kontras di citra satelit gelap/bervariasi
  jalan: "#1e293b",   // navy gelap — kontras di basemap OSM terang
  clean: "#1e293b",   // sama, basemap Clean juga terang
};
```

### 2. Ganti `style` di `<GeoJSON>` boundary (di dalam `MapBase`, bagian render batas administrasi)
Dari:
```tsx
<GeoJSON
  data={boundaryData}
  style={{
    weight: 3,
    color: "#f8fafc",
    fillColor: "transparent",
    fillOpacity: 0,
  }}
  interactive={false}
/>
```
Jadi:
```tsx
<GeoJSON
  data={boundaryData}
  style={{
    weight: 3,
    color: BOUNDARY_COLOR[basemap],
    fillColor: "transparent",
    fillOpacity: 0,
  }}
  interactive={false}
/>
```
Gak perlu `key` prop kayak `TileLayer` — `GeoJSON` react-leaflet re-render style otomatis pas prop `style` berubah tiap `basemap` state ganti.

## Status
~~Diputuskan (Opsi C) — kode siap ditempel manual, belum diterapkan ke `MapBase.tsx`.~~ **Opsi C udah diterapkan manual oleh user.** Sekarang ditambah **Opsi D** (casing) di atasnya — lihat section di bawah.

## Kombinasi C + D — Tambah Casing di Atas Opsi C

Opsi D butuh 1 tambahan: warna **halo** (garis bantu di bawah garis utama). Prinsipnya halo harus **kebalikan kontras** dari warna garis utama per basemap — biar si garis utama "keluar" dari background apapun di belakangnya, bukan cuma andelin 1 warna doang:

```ts
const BOUNDARY_HALO_COLOR: Record<BasemapKey, string> = {
  satelit: "#0f172a", // gelap — halo di belakang garis putih, nge-pop di citra satelit yang bisa terang di beberapa spot
  jalan: "#ffffff",   // putih — halo di belakang garis navy, nge-pop di jalan/label gelap OSM
  clean: "#ffffff",   // sama alasannya kayak jalan
};
```

**Render 2 `<GeoJSON>` bertumpuk** — urutan penting: yang duluan di JSX digambar duluan (di bawah), yang belakangan nimpa di atas. Jadi **halo duluan, garis utama belakangan**:

```tsx
{/* Halo/casing — digambar duluan, di BAWAH garis utama */}
{boundaryData && (
  <GeoJSON
    data={boundaryData}
    style={{
      weight: 6,
      color: BOUNDARY_HALO_COLOR[basemap],
      opacity: 0.7,
      fillOpacity: 0,
    }}
    interactive={false}
  />
)}

{/* Garis utama — di ATAS halo (style sama kayak Opsi C, gak berubah) */}
{boundaryData && (
  <GeoJSON
    data={boundaryData}
    style={{
      weight: 3,
      color: BOUNDARY_COLOR[basemap],
      fillColor: "transparent",
      fillOpacity: 0,
    }}
    interactive={false}
  />
)}
```

Catatan:
- `weight: 6` (halo) vs `weight: 3` (garis utama) — halo harus lebih tebal biar keliatan "ngelilingin" garis utama, bukan numpuk pas.
- `opacity: 0.7` di halo (bukan 1) — biar halo-nya nge-blend dikit, gak keliatan kayak garis dobel yang kaku/norak.
- Boleh pake `<GeoJSON>` 2x kayak di atas (paling gampang, reuse `style` object yang sama-sama udah ada), atau gabung jadi 1 komponen custom kalau nanti kerasa berulang — untuk sekarang duplikasi 2 `<GeoJSON>` udah cukup simpel, gak perlu abstraksi tambahan.
- `interactive={false}` di kedua layer — biar halo gak nyerobot event klik yang harusnya buat garis utama/layer lain.

## Status
Opsi C+D — kode siap ditempel manual (halo belum diterapkan, garis utama Opsi C udah).
