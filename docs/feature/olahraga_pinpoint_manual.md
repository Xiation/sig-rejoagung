# Plan: Pinpoint Manual Fasilitas Olahraga di AsetfasumLayer.tsx

## Context

`public/data/fasum/` cuma punya `Pemerintahan.geojson` (1 fitur), `Ibadah.geojson` (37 fitur), `Pendidikan.geojson` (14 fitur) — **belum ada `Olahraga.geojson`**, jadi 2 aset kategori Olahraga (`RSC Rejoagung Sport Center`, `Lapangan Rejoagung`) gak pernah muncul di peta.

User udah nulis sendiri `src/constants/olahragaAset.ts` (gaya sendiri, bukan sesuai draft awal plan ini):
```ts
export interface OlahragaTitik {
    namaFasilitas: string;
    alamat: string;
    koordinat: { lat: number; lng: number };
    luasTanah: number | null;
}
export const OLAHRAGA_ASET: OlahragaTitik[] = [
    { namaFasilitas: "(RSC) Rejoagung Sport Center", alamat: "...", koordinat: { lat: -8.386578222828776, lng: 114.29964314279374 }, luasTanah: 2234 },
    { namaFasilitas: "Lapangan Rejoagung", alamat: "...", koordinat: { lat: -8.39385251488808, lng: 114.31367960376035 }, luasTanah: 7958 },
];
```
Import `OLAHRAGA_ASET` **udah ditaro** di `AsetfasumLayer.tsx` baris 9, tapi belum dipakai di logic manapun.

**3 hal yang beda dari draft awal, ngaruh ke integrasi:**
1. **`koordinat` nested** (`{ lat, lng }`), bukan flat `lat`/`lng` — pengaruh ke cara akses pas bikin synthetic Feature.
2. **`luasTanah` udah dibawa langsung** di `OLAHRAGA_ASET` — gak perlu lagi mengandalkan `LUAS_TANAH_ASET` lookup buat 2 aset ini kalau nilainya mau dijamin 1 sumber (hindari 2 tempat nyimpen angka sama yang bisa divergen).
3. **Key mismatch nama:** `namaFasilitas` user pakai `"(RSC) Rejoagung Sport Center"` (kurung), sementara `STATUS_KEPEMILIKAN_ASET` & `LUAS_TANAH_ASET` (dari sesi sebelumnya) masih pakai key `'"RSC" Rejoagung Sport Center'` (tanda kutip, ikut ejaan CSV asli). Kalau `NAMOBJ` synthetic feature diisi `a.namaFasilitas` (perlu, karena itu jadi judul di modal), lookup `STATUS_KEPEMILIKAN_ASET[NAMOBJ]` bakal **miss** → status kepemilikan RSC jatuh ke fallback "Tidak Terdata" walau datanya sebenernya ada.
   - **Keputusan plan:** samain key di `statusKepemilikanAset.ts` & `luasTanahAset.ts` ke ejaan `olahragaAset.ts` (kurung), karena file itu yang user tulis manual/sengaja — anggap itu ejaan kanonik buat 2 aset ini. Cuma 1 baris key per file, gak ubah value.

**Bug lama yang masih perlu difix:** `AsetfasumModal.tsx` baris 42, `deriveCategory` cek `source.includes("olahraga")` — huruf kecil, gak match `_source` capitalized (`"/data/fasum/Olahraga.geojson"`) yang bakal dipasang. `getMarkerStyle` di layer (baris 41) udah benar pakai `"Olahraga"` capital.

## Implementasi

### 1. `src/constants/olahragaAset.ts` — sudah selesai (user)
Gak perlu diapa-apain lagi.

### 2. Samain key di 2 constants file lama
- `src/constants/statusKepemilikanAset.ts`: key `'"RSC" Rejoagung Sport Center'` → `"(RSC) Rejoagung Sport Center"` (cuma ganti string key, value `"Kosong"` tetap).
- `src/constants/luasTanahAset.ts`: key `'"RSC" Rejoagung Sport Center'` → `"(RSC) Rejoagung Sport Center"` (value `2234` tetap — sekarang redundan sama `OLAHRAGA_ASET[0].luasTanah` tapi dibiarin biar `AsetfasumModal.tsx` gak perlu cek 2 sumber beda buat aset yang beda kategori. Bisa dibersihin belakangan kalau mau, di luar scope sekarang).
- `"Lapangan Rejoagung"` gak perlu diubah — udah sama persis di semua file.

### 3. `src/components/map/layers/AsetfasumLayer.tsx`
Di `fetchAsetData`, setelah `mergedFeatures` kebentuk dari 3 fetch GeoJSON asli, concat 2 fitur sintetis dari `OLAHRAGA_ASET` (pakai `koordinat.lat`/`koordinat.lng` — bukan flat):
```ts
const manualOlahraga = OLAHRAGA_ASET.map((a) => ({
  type: "Feature",
  properties: { NAMOBJ: a.namaFasilitas, _source: "/data/fasum/Olahraga.geojson" },
  geometry: { type: "Point", coordinates: [a.koordinat.lng, a.koordinat.lat] },
}));
mergedFeatures = mergedFeatures.concat(manualOlahraga);
```
`onEachFeature`/`pointToLayer` yang udah ada gak perlu diubah — `NAMOBJ`/`_source`/`_lat`/`_lng` yang di-inject ke `selectedAsset` sama persis format fitur GeoJSON asli, jadi `AsetfasumModal.tsx` (lookup `STATUS_KEPEMILIKAN_ASET`/`LUAS_TANAH_ASET` by NAMOBJ) langsung jalan asal key udah disamain (poin 2). Field `alamat` di `OLAHRAGA_ASET` gak dipakai di sini — `AsetfasumModal.tsx` saat ini emang gak punya slot buat alamat, di luar scope task ini (gak nambah UI baru tanpa diminta).

### 4. `src/components/map/content/AsetfasumModal.tsx` — fix bug
Baris 42: `if (source.includes("olahraga"))` → `if (source.includes("Olahraga"))`.

## Verifikasi
1. `npx tsc --noEmit` — pastikan clean.
2. `bun run dev` (atau `npm run dev`), buka modul Aset & Fasum, cek 2 marker kuning (`#facc15`) muncul di lokasi RSC Sport Center & Lapangan Rejoagung.
3. Klik masing-masing marker → `AsetfasumModal` kebuka, cek: judul modal `(RSC) Rejoagung Sport Center` / `Lapangan Rejoagung`, kategori "Olahraga" (ikon benar, bukan fallback generic "Fasilitas Umum / Sosial"), Status Kepemilikan (Kosong / Hak Pakai) tampil (bukan "Tidak Terdata" — bukti key alignment poin 2 berhasil), Luas Tanah (2.234 m² / 7.958 m²) tampil benar.

## Status
Belum dieksekusi — dokumen plan aja, nunggu go-ahead terpisah buat mulai coding.
