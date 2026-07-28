# Plan: Basemap Toggle (Satelit / Jalan / Clean) — MapBase.tsx

## Context

`MapBase.tsx` sekarang cuma punya 1 basemap: Esri World Imagery (satelit), hardcoded di `<TileLayer>` (baris 61-66). User mau bisa ganti-ganti basemap — brainstorm dipersempit ke 3 pilihan:

1. **Satelit** — Esri World Imagery (yang udah ada, dipertahanin).
2. **Jalan** — OpenStreetMap standar (`tile.openstreetmap.org`), buat baca nama jalan/lokasi jelas.
3. **Clean** — CartoDB Positron (`basemaps.cartocdn.com/light_all`), basemap abu-abu minimal, cocok pas mau fokus ke data overlay (marker/polygon) tanpa keramaian visual OSM.

UI toggle: **custom floating button** (bukan `<LayersControl>` bawaan Leaflet yang kotak-putih generic) — biar konsisten sama gaya card lain di app (`FasumLegend` di `AsetfasumLayer.tsx`: rounded-xl, backdrop-blur, shadow).

**Konflik posisi yang perlu diantisipasi:** `FasumLegend` (muncul pas `activeModule === "aset"`) udah nempatin pojok **kanan-atas** (`top: 16px, right: 16px`). Basemap toggle harus di pojok lain biar gak numpuk — rekomendasi **kiri-atas** (`top: 16px, left: 16px`).

## Implementasi

### 1. State basemap — di `MapBase.tsx`
```ts
type BasemapKey = "satelit" | "jalan" | "clean";
const [basemap, setBasemap] = useState<BasemapKey>("satelit");
```
State lokal di `MapBase` (bukan di-lift ke `MapViewer`/parent) — basemap independen dari `activeModule`, gak perlu persist lintas module switch dalam sesi ini (reset ke "satelit" tiap remount `MapBase` udah cukup, `MapBase` sendiri gak remount pas ganti `activeModule` karena itu cuma swap children di dalam `<MapContainer>` yang sama).

### 2. Config basemap (const, di luar komponen biar gak re-create tiap render)
```ts
const BASEMAPS: Record<BasemapKey, { label: string; icon: string; url: string; attribution: string; maxZoom: number }> = {
  satelit: {
    label: "Satelit",
    icon: "satellite_alt",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19,
  },
  jalan: {
    label: "Jalan",
    icon: "map",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  clean: {
    label: "Clean",
    icon: "layers",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  },
};
```

### 3. `<TileLayer>` jadi dinamis
Ganti TileLayer statis (baris 61-66) — pakai `key={basemap}` biar React force-remount TileLayer pas ganti basemap (Leaflet TileLayer gak selalu re-fetch bersih kalau cuma prop `url` berubah tanpa remount):
```tsx
<TileLayer
  key={basemap}
  attribution={BASEMAPS[basemap].attribution}
  url={BASEMAPS[basemap].url}
  maxZoom={BASEMAPS[basemap].maxZoom}
/>
```

### 4. Komponen `BasemapToggle` — floating button, pojok kiri-atas
```tsx
function BasemapToggle({ value, onChange }: { value: BasemapKey; onChange: (b: BasemapKey) => void }) {
  return (
    <div style={{ position: "absolute", top: 16, left: 16, zIndex: 1000, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", borderRadius: 12, padding: 4, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", display: "flex", gap: 2 }}>
      {(Object.keys(BASEMAPS) as BasemapKey[]).map((key) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "6px 10px", borderRadius: 8, border: "none", cursor: "pointer",
            background: value === key ? "#2563eb" : "transparent",
            color: value === key ? "#ffffff" : "#374151",
            fontSize: 12, fontWeight: 600,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{BASEMAPS[key].icon}</span>
          {BASEMAPS[key].label}
        </button>
      ))}
    </div>
  );
}
```
Render di dalam `<div className="h-[100vh] w-full z-0 relative">` (sibling dari `<MapContainer>`, sama polanya kayak `FasumLegend` yang absolute-positioned relatif ke parent container peta) — bukan di dalam `<MapContainer>`, biar gak ke-drag/zoom bareng peta.

### 5. Panggil `<BasemapToggle />` di JSX
Komponen `BasemapToggle` (poin 4) baru sebatas **didefinisikan** — belum ada yang manggil/render, jadi belum muncul di layar. Taro pemanggilannya sebagai sibling `<MapContainer>`, di dalam `<div className="h-[100vh] w-full z-0 relative">` yang sama:
```tsx
return (
  <div className="h-[100vh] w-full z-0 relative">
    <BasemapToggle value={basemap} onChange={setBasemap} />

    <MapContainer ...>
      {/* TileLayer, MapBoundsEnforcer, GeoJSON batas, layer per modul — semua tetep sama */}
    </MapContainer>
  </div>
);
```
Boleh ditaro sebelum atau sesudah `<MapContainer>` — dua-duanya sama aja karena posisinya `position: absolute` relatif ke div pembungkus (`relative`), bukan relatif ke `MapContainer`.

**Penting soal urutan definisi:** `type BasemapKey` harus didefinisikan di **module scope** (luar fungsi `MapBase`, di atas `BasemapToggle`) — bukan di dalam `MapBase`. `BasemapToggle` dan `BASEMAPS` sama-sama didefinisikan di module scope juga (di luar `MapBase`), jadi mereka butuh `BasemapKey` udah ada duluan di scope yang sama. Kalau `BasemapKey` didefinisikan di dalam `MapBase`, TypeScript gak bisa nemuin dia dari `BasemapToggle`/`BASEMAPS` (beda scope) — bakal error compile.

### 6. Pemakaian icon Material Symbols
Sama kayak plan icon marker sebelumnya — font `material-symbols-outlined` udah global, tinggal pake `<span className="material-symbols-outlined">`. Icon yang dipilih: `satellite_alt` (satelit), `map` (jalan), `layers` (clean) — semua icon standar Material Symbols, gak perlu icon baru di luar set yang biasa dipake.

### 7. Cara ganti font & posisi tombol
Dua-duanya diatur lewat inline `style` object di `BasemapToggle` — gak ada abstraksi/props tambahan, tinggal edit value-nya langsung.

**Ganti font:** teks tombol (`fontSize: 12, fontWeight: 600` di `style` `<button>`) sekarang **gak punya `fontFamily` eksplisit** — jadi ikut font default browser/global (bukan otomatis ikut font app). Kalau mau konsisten sama font yang dipake komponen lain (misal `EducationMetrics.tsx` pake `font-[var(--font-geist-sans)]`, cek `layout.tsx` buat font default app), tambahin `fontFamily: "var(--font-geist-sans)"` ke style object `<button>`:
```tsx
style={{
  display: "flex", alignItems: "center", gap: 4,
  padding: "6px 10px", borderRadius: 8, border: "none", cursor: "pointer",
  background: value === key ? "#2563eb" : "transparent",
  color: value === key ? "#ffffff" : "#374151",
  fontSize: 12, fontWeight: 600,
  fontFamily: "var(--font-geist-sans)", // ← baris baru
}}
```
Kalau mau font lain di luar yang udah dipake app (custom), perlu di-load dulu (Google Font/local font via `next/font`, biasanya didaftarin di `layout.tsx`) baru bisa dipanggil namanya di sini.

**Ganti posisi:** diatur di `style` object div pembungkus toggle (yang punya `position: "absolute", top: 16, left: 16`). Ganti angka `top`/`left`, atau swap ke properti lain (`bottom`/`right`) kalau mau pindah ke pojok berbeda:
```tsx
// contoh: pindah ke kanan-bawah
style={{ position: "absolute", bottom: 16, right: 16, zIndex: 1000, ... }}
```
Inget batasan dari poin Context di atas — kalau taro di **kanan-atas**, bakal numpuk sama `FasumLegend` pas modul Aset aktif. Posisi aman lainnya: kiri-bawah, atau kanan-atas tapi digeser turun (`top: 80` misalnya) di bawah `FasumLegend`.

## Yang TIDAK berubah
- `MapViewer.tsx` — gak perlu diubah sama sekali, basemap state full di-encapsulate di `MapBase.tsx`.
- Logic `MapBoundsEnforcer`, fetch `boundaryData`, layer injection per `activeModule` — semua sama persis.

## Verifikasi
1. `npx tsc --noEmit` — clean.
2. `bun run dev`, buka peta — toggle 3 tombol muncul pojok kiri-atas, gak numpuk sama `FasumLegend` (kanan-atas) pas buka modul Aset.
3. Klik tiap tombol — basemap ganti (citra satelit ↔ jalan OSM ↔ abu-abu Positron), tombol aktif keliatan highlighted (biru).
4. Ganti basemap lalu ganti `activeModule` (aset/sekolah/potensi) — basemap yang dipilih tetap konsisten (gak balik ke default), karena `MapBase` gak remount pas ganti module.
5. Cek attribution text di pojok bawah peta ikut berubah sesuai basemap aktif (Leaflet otomatis render `attribution` prop `TileLayer`).

## Status
Belum dieksekusi — dokumen plan aja, nunggu go-ahead terpisah buat mulai coding.
