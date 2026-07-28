# Plan: Icon Custom per Kategori Marker di AsetfasumLayer.tsx

## Context

Sekarang `AsetfasumLayer.tsx` (`pointToLayer`, baris 176-179) render semua fasilitas pake `L.circleMarker` — cuma titik warna polos (`getMarkerStyle`, baris 11-53), gak ada icon yang bedain jenis fasilitas. User mau tiap kategori (Pemerintahan/Ibadah/Pendidikan/Olahraga) punya icon pinpoint sendiri.

**Leaflet gak support icon di `circleMarker`** (dia emang didesain buat titik polos/data viz, bukan marker berlabel). Solusinya ganti ke `L.marker` + `L.divIcon` (custom HTML per marker — bisa render icon).

**Reuse penting — jangan bikin mapping icon baru:** `categoryData` (`src/constants/assetsSummary.ts`, baris 51-58) udah punya icon Material Symbols per kategori, ini sumber yang sama dipake `AsetfasumModal.tsx` (`getCategoryVisual`) buat header modal:
- Fasilitas Pendidikan → `school`
- Fasilitas Keagamaan → `mosque`
- Olahraga → `sports_soccer`
- Fasilitas Pemerintahan → `gavel`
- Fasilitas Umum / Sosial (fallback) → `location_city`

Icon-nya dirender pakai font **Material Symbols Outlined** (`src/components/ui/Icon.tsx`, class `material-symbols-outlined` + nama icon sebagai text ligature) — font ini udah di-load global (DESIGN_SYS.md Bab 5: "Icons: Exclusively Material Symbols Outlined"), jadi bisa langsung dipake di HTML string `divIcon` tanpa import tambahan.

**Ketemu 1 inkonsistensi warna (FYI, gak diubah di plan ini):** `FASUM_COLORS.olahraga` di layer ini `#facc15` (kuning), tapi `categoryData` buat "Olahraga" pake `#8b5cf6` (ungu). Dua sumber warna beda buat kategori sama. Plan ini **pertahanin warna existing `FASUM_COLORS`** (surgical, gak nyenggol hal di luar scope "tambah icon") — kalau mau disatuin nanti, itu keputusan terpisah.

**Bug yang HARUS dihindari:** jangan reuse logic `deriveCategory` di `AsetfasumModal.tsx` (ada bug `source.includes("olahraga")` lowercase, belum difix). Icon mapping baru di layer ini pakai branching yang sama kayak `getMarkerStyle` yang udah ada (`"Pemerintahan"`, `"Ibadah"`, `"Pendidikan"`, `"Olahraga"` — capitalized, konsisten sama `_source` string asli & sintetis olahraga manual).

## Implementasi

### 1. Icon per kategori — reuse `categoryData`, jangan hardcode ulang
Bikin helper kecil di `AsetfasumLayer.tsx`, resolve icon name lewat `_source` string (branching sama kayak `getMarkerStyle`), lookup nama icon dari `categoryData` by `nama` field:
```ts
import { categoryData } from "@/constants/assetsSummary";

function getCategoryIcon(source: string): string {
  if (source.includes("Pemerintahan")) return categoryData.find(c => c.nama === "Fasilitas Pemerintahan")!.icon;
  if (source.includes("Ibadah")) return categoryData.find(c => c.nama === "Fasilitas Keagamaan")!.icon;
  if (source.includes("Pendidikan")) return categoryData.find(c => c.nama === "Fasilitas Pendidikan")!.icon;
  if (source.includes("Olahraga")) return categoryData.find(c => c.nama === "Olahraga")!.icon;
  return categoryData.find(c => c.nama === "Fasilitas Umum / Sosial")!.icon;
}
```

### 2. Ganti `getMarkerStyle` (circleMarker options) → `getMarkerIcon` (L.DivIcon)
Warna background tetap dari `FASUM_COLORS` (gak diubah), radius lama jadi diameter lingkaran di HTML:
```ts
function getMarkerIcon(source: string): L.DivIcon {
  const color = /* branching sama seperti getMarkerStyle, ambil dari FASUM_COLORS */;
  const iconName = getCategoryIcon(source);
  return L.divIcon({
    className: "", // penting — kosongin biar gak kena default style .leaflet-div-icon (border putih + bg putih bawaan Leaflet)
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:2px solid #fff;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,0.3);">
             <span class="material-symbols-outlined" style="font-size:16px;color:#fff;">${iconName}</span>
           </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}
```

### 3. `pointToLayer` — `L.circleMarker` → `L.marker`
```tsx
pointToLayer={(feature, latlng) => {
  const icon = getMarkerIcon(feature.properties?._source ?? "");
  return L.marker(latlng, { icon });
}}
```
`onEachFeature` (click handler, baris 180-193) **gak perlu diubah** — `L.marker` juga punya `.on("click", ...)` sama persis kayak `circleMarker`, dan logic-nya generic terhadap tipe layer.

### 4. Legend (`FasumLegend`, baris 62-113) — opsional
Bisa sekalian tambah icon kecil di samping tiap swatch warna biar konsisten sama marker baru di peta. Bukan keharusan buat task ini (legend masih valid/jelas tanpa icon), tapi kalau mau polish sekalian, tinggal ganti `<span>` swatch jadi mini circle+icon sama kayak poin 2.

## Verifikasi
1. `npx tsc --noEmit` — pastikan clean (`L.DivIcon` type dari `leaflet` package, udah ke-`import L from "leaflet"` di file ini).
2. `bun run dev` / `npm run dev`, buka modul Aset & Fasum — cek tiap kategori markernya beda icon: Pemerintahan (gavel), Ibadah (mosque), Pendidikan (school), Olahraga (sports_soccer, termasuk 2 titik manual RSC & Lapangan Rejoagung).
3. Cek gak ada kotak putih aneh di belakang marker (efek default `.leaflet-div-icon` Leaflet kalau `className` gak dikosongin).
4. Klik marker tetap buka `AsetfasumModal` normal (fungsionalitas klik gak berubah).
5. Zoom in/out — pastikan icon gak pecah/blur (pakai font, bukan raster image, jadi harusnya tetep tajam di semua zoom level).

## Status
Belum dieksekusi — dokumen plan aja, nunggu go-ahead terpisah buat mulai coding.
