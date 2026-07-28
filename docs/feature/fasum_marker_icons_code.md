# Kode Final: Icon Custom per Kategori Marker — AsetfasumLayer.tsx

Companion buat `fasum_marker_icons.md` (plan). Ini kode konkret siap copy-paste manual ke `src/components/map/layers/AsetfasumLayer.tsx` — gak diedit langsung sesuai request.

Referensi baris nomor ngacu ke isi file `AsetfasumLayer.tsx` **saat dokumen ini ditulis** (208 baris total).

---

## 1. Tambah import `categoryData` (setelah baris 9)

```ts
import { OLAHRAGA_ASET } from "@/constants/olahragaAset";
import { categoryData } from "@/constants/assetsSummary";
```

## 2. Ganti seluruh `getMarkerStyle` (baris 11-53) jadi 2 fungsi baru

Hapus fungsi `getMarkerStyle` lama, ganti dengan:

```ts
function getCategoryIcon(source: string): string {
  if (source.includes("Pemerintahan")) return categoryData.find((c) => c.nama === "Fasilitas Pemerintahan")!.icon;
  if (source.includes("Ibadah")) return categoryData.find((c) => c.nama === "Fasilitas Keagamaan")!.icon;
  if (source.includes("Pendidikan")) return categoryData.find((c) => c.nama === "Fasilitas Pendidikan")!.icon;
  if (source.includes("Olahraga")) return categoryData.find((c) => c.nama === "Olahraga")!.icon;
  return categoryData.find((c) => c.nama === "Fasilitas Umum / Sosial")!.icon;
}

function getMarkerColor(source: string): string {
  if (source.includes("Pemerintahan")) return FASUM_COLORS.pemerintah;
  if (source.includes("Ibadah")) return FASUM_COLORS["tempat ibadah"];
  if (source.includes("Pendidikan")) return FASUM_COLORS.pendidikan;
  if (source.includes("Olahraga")) return FASUM_COLORS.olahraga;
  return "#6b7280"; // fallback, sama kayak default lama
}

function getMarkerIcon(source: string): L.DivIcon {
  const color = getMarkerColor(source);
  const iconName = getCategoryIcon(source);
  return L.divIcon({
    className: "", // kosongin — biar gak kena default style .leaflet-div-icon (bg putih + border bawaan Leaflet)
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:2px solid #fff;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,0.3);">
             <span class="material-symbols-outlined" style="font-size:16px;color:#fff;line-height:1;">${iconName}</span>
           </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}
```

Catatan: `FASUM_COLORS` (const, baris 55-60 di file lama) **tetep dipake apa adanya**, gak diubah — cuma dipindah referensinya dari `getMarkerStyle` ke `getMarkerColor`.

`categoryData.find(...)!` pakai non-null assertion (`!`) karena kelima kategori itu memang selalu ada di `categoryData` (fixed list, bukan data dinamis) — aman dipakai di sini.

## 3. Ganti `pointToLayer` (baris 176-179)

Dari:
```tsx
pointToLayer={(feature, latlng) => {
  const style = getMarkerStyle(feature.properties?._source ?? "");
  return L.circleMarker(latlng, style);
}}
```

Jadi:
```tsx
pointToLayer={(feature, latlng) => {
  const icon = getMarkerIcon(feature.properties?._source ?? "");
  return L.marker(latlng, { icon });
}}
```

## 4. Yang TIDAK berubah
- `FASUM_COLORS` const — sama persis.
- `FasumLegend` — sama persis (masih pakai swatch warna, icon di legend itu opsional/polish terpisah, lihat plan poin 4).
- `onEachFeature` (click handler) — sama persis, `L.marker` juga support `.on("click", ...)`.
- Semua logic fetch/merge GeoJSON + `OLAHRAGA_ASET` — sama persis.

## 5. Checklist setelah ditempel manual
- [ ] `npx tsc --noEmit` bersih (`L.DivIcon` udah include di type `leaflet` yang udah di-import `import L from "leaflet"`).
- [ ] Jalanin `bun run dev` / `npm run dev`, cek 4 icon beda per kategori muncul di peta (gavel/mosque/school/sports_soccer).
- [ ] Gak ada kotak putih aneh di belakang marker (defense check `className: ""` di `L.divIcon`).
- [ ] Klik marker tetap buka `AsetfasumModal` normal.
