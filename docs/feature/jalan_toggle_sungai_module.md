# Plan: Jaringan Jalan (Toggle Overlay) + Sungai/Irigasi (Modul Peta Baru)

## Context

2 dataset baru di `public/data/fasum/` belum dipakai di kode: `Jaringan Jalan.geojson` (85 fitur, `MultiLineString`, jalur jalan desa) dan `Sungai.geojson` (2 fitur, `MultiLineString`, jalur sungai/irigasi). User mau 2 perlakuan beda:
1. **Jaringan Jalan → toggle overlay** (nyalain/matiin, kayak `BasemapToggle`) — bukan modul peta baru, cuma visual overlay yang bisa ada di module manapun.
2. **Sungai/Irigasi → modul peta baru** (sejajar Aset/Sekolah/Potensi di Sidebar) — punya layer + modal detail sendiri kayak 3 modul yang ada.

**Kesimpulan: KEDUANYA memungkinkan**, pola yang dibutuhin udah ada semua di codebase, tinggal direplikasi:
- Toggle overlay independen dari `activeModule` → persis pola `BasemapToggle` + render `<GeoJSON>` boundary administrasi langsung di `MapBase.tsx` (bukan lewat layer-per-modul).
- Modul peta baru → persis pola `PotensiLayer.tsx` (fetch GeoJSON → `<GeoJSON>` dengan `style`+`onEachFeature` → klik buka `InfoModal`), dan `PotensiModal.tsx` (baca `data.properties` jadi UI card).

## Cek Data (penting sebelum desain modal)

**`Jaringan Jalan.geojson`** — 85 fitur, properti per fitur: `REMARK` (cuma 2 nilai: `"Jalan Lain"` / `"Jalan Lokal"`), `SHAPE_Leng`, `Kecepatan`. **Gak ada `NAMOBJ`** (jalan-jalan ini gak punya nama individual) — konsisten sama niat user: ini overlay visual doang, bukan sesuatu yang perlu di-klik buat detail per fitur.

**`Sungai.geojson`** — cuma **2 fitur**: `Irigasi Pekalen Sampeyan`, `Kali Bomo` (`NAMOBJ`, `REMARK: "Sungai"`). Sisa properti (`ADATGL`, `DMAX`, `FNGAIR`, `JNSSNG`, `KLSSNG`, `LTKSGI`, `NAMWS`, `STATUS`, `UKRSGI`, `WMAX`, `DBTMXS`, `NAMDAS`) **semuanya `0.0` atau `null`** — kolom template standar RBI25000 yang emang belum diisi surveyor, bukan data asli. Modal detail nanti **cuma bisa nampilin `NAMOBJ` + `REMARK`** secara jujur — kalau maksa nampilin field lain, isinya "0" semua yang menyesatkan (keliatan kayak ada data padahal kosong).

## Part A — Jaringan Jalan: Toggle Overlay

### Implementasi di `MapBase.tsx`
1. State baru: `const [showJalan, setShowJalan] = useState(false)` (default mati — overlay opsional, gak nutupin peta by default).
2. Fetch sekali di `useEffect` (pola sama kayak `boundaryData`): `fetch("/data/fasum/Jaringan Jalan.geojson")`.
3. Render kondisional di dalam `<MapContainer>`, mirip boundary:
   ```tsx
   {showJalan && jalanData && (
     <GeoJSON
       data={jalanData}
       style={{ color: "#78716c", weight: 1.5, opacity: 0.8 }}
       interactive={false}
     />
   )}
   ```
   Warna dipilih netral (`#78716c`, stone-500) — cukup 1 warna aja tanpa perlu conditional per-basemap kayak boundary (garis jalan sifatnya overlay tambahan, bukan elemen navigasi kritis yang WAJIB selalu kebaca jelas di semua basemap — beda kelas kepentingan sama boundary desa). `interactive={false}` karena gak ada modal/klik buat overlay ini.
4. **Toggle button** — komponen kecil terpisah dari `BasemapToggle` (basemap itu pilihan eksklusif 1-dari-3, jaringan jalan itu on/off independen, gabungin ke 1 segmented control berpotensi bikin bingung maknanya). Taro deket `BasemapToggle` (area kiri-atas), posisi di bawahnya biar gak numpuk:
   ```tsx
   function JalanToggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
     return (
       <button
         onClick={onToggle}
         style={{ position: "absolute", top: 70, left: 54, zIndex: 1000, /* styling senada BasemapToggle */ }}
       >
         <span className="material-symbols-outlined">route</span>
         Jaringan Jalan
       </button>
     );
   }
   ```
   (posisi persis nanti disesuaikan pas implementasi — cek dulu posisi final `BasemapToggle` kamu di file asli biar gak numpuk)

**Gak perlu:** modal, layer file terpisah, entry Sidebar — ini murni overlay visual di `MapBase.tsx`, konsisten sama cara boundary administrasi udah diimplementasi.

## Part B — Sungai/Irigasi: Modul Peta Baru

### 1. `src/components/map/layers/SungaiLayer.tsx` (baru)
Replikasi `PotensiLayer.tsx`, disesuaikan buat garis (bukan poligon):
```tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { GeoJSON } from "react-leaflet";
import type { FeatureCollection, Feature } from "geojson";
import type { Layer, PathOptions } from "leaflet";
import InfoModal from "../InfoModal";

export default function SungaiLayer() {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/data/fasum/Sungai.geojson")
      .then((res) => res.json())
      .then(setGeoData)
      .catch((err) => console.error("SungaiLayer: gagal fetch", err));
  }, []);

  const styleFeature = useCallback((): PathOptions => ({
    color: "#0ea5e9", // sky-500 — biru air, beda dari warna jalan/boundary
    weight: 3,
    opacity: 0.85,
  }), []);

  const onEachFeature = useCallback((feature: Feature, layer: Layer) => {
    layer.on({ click: () => setSelected(feature.properties as Record<string, unknown>) });
  }, []);

  if (!geoData) return null;

  return (
    <>
      <GeoJSON key={JSON.stringify(geoData)} data={geoData} style={styleFeature} onEachFeature={onEachFeature} />
      {selected && (
        <InfoModal data={selected} isOpen={true} onClose={() => setSelected(null)} activeModule="sungai" />
      )}
    </>
  );
}
```
Gak perlu legend kompleks kayak `DusunLegend`/`FasumLegend` — cuma 1 kategori visual (garis biru sungai), beda sama Aset/Potensi yang emang multi-kategori/multi-warna.

### 2. `src/components/map/content/SungaiModal.tsx` (baru)
Minimalis — sesuai kejujuran data (cuma `NAMOBJ`+`REMARK` yang beneran ada):
```tsx
"use client";
import Icon from "@/components/ui/Icon";

export default function SungaiModal({ data }: { data: Record<string, unknown> }) {
  const nama = (data.NAMOBJ as string) ?? "Sungai/Irigasi Tidak Teridentifikasi";
  const jenis = (data.REMARK as string) ?? "Sungai";

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border text-sky-600 bg-sky-50 border-sky-200">
          <Icon name="water" size={24} />
        </div>
        <div>
          <h3 className="headline-lg text-[var(--on-surface)]">{nama}</h3>
          <p className="body-base text-[var(--text-muted)] mt-0.5">{jenis}</p>
        </div>
      </div>
      <div className="border-t border-[var(--outline-variant)]/60" />
      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-2">
        <Icon name="info" size={16} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="micro-copy text-amber-800 leading-relaxed">
          Atribut detail (debit, lebar, status pengelolaan, dll) belum terisi di data sumber (template RBI25000) — baru nama dan jenis jalur air yang tersedia.
        </p>
      </div>
    </div>
  );
}
```

### 3. `InfoModal.tsx` — daftarin modul baru
- Union type `activeModule`: `"aset" | "sekolah" | "potensi"` → tambah `"sungai"`.
- Import `SungaiModal`, tambah `{activeModule === "sungai" && <SungaiModal data={data} />}`.
- `MODULE_META` tambah entry:
  ```ts
  sungai: {
    label: "Sungai & Irigasi",
    icon: "water",
    chipClass: "bg-sky-50 text-sky-700 border-sky-200",
  },
  ```

### 4. `Sidebar.tsx` — nav item baru
Tambah ke `NAV_ITEMS` (group `"map"`, sejajar Aset/Potensi/Sekolah):
```ts
{ id: "sungai", label: "Sungai & Irigasi", icon: "water", group: "map" },
```

### 5. `page.tsx` — wiring modul
- `MODULE_META` tambah `sungai: { title: "Pemetaan Jaringan Sungai & Irigasi", badge: "Peta Interaktif", badgeVariant: "map" }`.
- Gak perlu ubah routing lain — `activeModule` string generik udah otomatis ke-pass ke `MapViewer`→`MapBase`.

### 6. `MapBase.tsx` — layer injection
Tambah 1 baris di blok layer injection (sejajar Aset/Sekolah/Potensi):
```tsx
{activeModule === "sungai" && <SungaiLayer />}
```

## Verifikasi
1. `npx tsc --noEmit` — clean.
2. `bun run dev` — cek toggle Jaringan Jalan: nyala/mati garis jalan di semua module (gak terikat `activeModule`), warna kebaca jelas di 3 basemap.
3. Buka Sidebar → klik "Sungai & Irigasi" → modul aktif, 2 garis biru (Irigasi Pekalen Sampeyan, Kali Bomo) muncul di peta.
4. Klik salah satu garis sungai → modal kebuka, nama+jenis tampil, catatan data-belum-lengkap tampil (bukan field kosong/nol yang menyesatkan).
5. Cek `InfoModal` header chip buat modul sungai (label "Sungai & Irigasi", ikon `water`, warna sky) tampil bener.

## Status
**Dieksekusi.** Semua 6 langkah diterapkan: `Sidebar.tsx`, `page.tsx`, `SungaiModal.tsx` (baru), `SungaiLayer.tsx` (baru), `InfoModal.tsx`, `MapBase.tsx` (`JalanToggle` + layer injection `sungai`). `npx tsc --noEmit` clean. Belum ditest visual di browser — cek manual sebelum commit.
