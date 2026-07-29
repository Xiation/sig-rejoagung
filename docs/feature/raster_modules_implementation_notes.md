# Catatan Implementasi: Modul LST Delta & Kesehatan Kelapa (Fase 1 / MVP)

Companion buat `raster_modules_lst_kesehatan_kelapa.md` (plan) — dokumen ini nyatet APA yang beneran ditulis, KENAPA ditulis kayak gitu, dan APA yang udah/belum diverifikasi. Tujuannya biar sesi berikutnya (atau orang lain) gak perlu baca ulang semua kode buat ngerti keputusan yang diambil.

## Package Manager: pnpm buat dependency, bukan npm/bun

Sesuai konvensi project (`package.json` field `packageManager: "pnpm@..."`) — instalasi dependency baru pakai:
```
pnpm add georaster georaster-layer-for-leaflet proj4
pnpm add -D @types/proj4
```
Bukan `npm install` atau `bun add`. `bun` di project ini perannya cuma task runner (`bun run dev`/`bun run build`), bukan buat nambah dependency — kalau ada, itu bakal bikin 2 lockfile (`pnpm-lock.yaml` vs `bun.lock`) yang bisa saling gak sinkron.

### Gotcha: `ERR_PNPM_IGNORED_BUILDS` (es5-ext)
Pas install, `pnpm` nge-block postinstall script punya `es5-ext` (transitive dependency dari `proj4`) demi keamanan (supply-chain protection bawaan pnpm). Ini kejadian yang SAMA persis kayak pas deploy pertama kali dulu (lihat `docs/prod/cloudflare-deploy-journey.md`) — `sharp`/`esbuild`/`workerd` udah di-allowlist di `pnpm-workspace.yaml`. Fix-nya konsisten: tambah `es5-ext: true` ke `allowBuilds` di `pnpm-workspace.yaml`, terus `pnpm install` ulang. Script `es5-ext`-nya sendiri cuma self-check no-op (dicek isinya duluan sebelum di-allow, gak ada yang mencurigakan).

## Kenapa butuh shim TypeScript manual (`src/types/georaster.d.ts`)

`georaster` & `georaster-layer-for-leaflet` gak nerbitin `.d.ts` sendiri, dan `@types/georaster*` juga gak ada di npm registry (dicek langsung, 404). Jadi ditulis manual, **cuma nyakup bagian yang beneran dipakai** di project ini (`GeoRaster` interface buat metadata raster, `parseGeoraster()`, `GeoRasterLayer` class) — bukan port lengkap semua API library itu, biar gak over-engineer buat hal yang gak dipakai.

`@types/proj4` sebenernya ditandain "deprecated, proj4 nyediain type sendiri" — tapi dicek langsung, file `dist/index.d.ts` yang diklaim proj4 nyediain itu **gak ada** di paket npm yang keinstall (kemungkinan bug di publish package `proj4` versi ini). Jadi `@types/proj4` tetep dipasang meski dikasih warning deprecated, karena kenyataannya emang masih dibutuhin.

## Pendekatan render: `georaster-layer-for-leaflet` (client-side, imperatif)

Karena ini raster (bukan vector kayak layer lain), gak bisa pakai `<GeoJSON>` react-leaflet biasa. `GeoRasterLayer` itu extend `L.GridLayer` (Leaflet asli, bukan komponen React) — dipasang manual pakai `useMap()` + `useEffect()`, pola yang sama kayak `MapBoundsEnforcer` di `MapBase.tsx`.

**Risiko yang sempat dikhawatirin, sekarang udah diverifikasi aman:** `georaster`'s file utama (`main` di `package.json`) itu webpack bundle yang include reference ke Web Worker files — potensi masalah kalau Next.js/Turbopack gak bisa resolve worker chunks itu pas build. Ternyata `georaster` punya field `"browser"` di `package.json` yang nunjuk ke bundle versi browser-specific, dan **`npx next build` (static export) sukses tanpa error** — jadi Turbopack udah nanganin ini dengan benar, gak perlu config tambahan.

## Klik-di-peta → query pixel value

Layer vector (Aset/Sekolah/Potensi/Sungai) punya `feature.properties` yang bisa langsung dipakai pas diklik. Raster gak punya "fitur" diskrit — semua titik di dalam extent punya value. Jadi query-nya manual (`src/lib/rasterQuery.ts`):
1. Tangkep event klik map (`map.on("click", ...)`, bukan event di layer-nya sendiri — `GeoRasterLayer` gak expose event klik per-pixel).
2. Convert `latlng` klik (WGS84) → koordinat native raster (`EPSG:32750`, UTM zone 50S) pakai `proj4`.
3. Hitung index piksel dari koordinat itu (`col`/`row`), ambil value dari `georaster.values[0][row][col]`.
4. Kalau di luar extent atau `NaN` (no-data) → gak buka modal sama sekali (bukan nampilin modal isinya "N/A").

`proj4.defs("EPSG:32750", ...)` di-register manual di `src/lib/proj4Setup.ts` (di-import sebagai side-effect di kedua layer) — jaga-jaga karena UTM zone 50S selatan gak pasti otomatis dikenali `proj4` tanpa didaftarin eksplisit.

## Warna: default/placeholder, SAMA PERSIS kayak preview yang udah dikirim

`src/lib/rasterColors.ts` — palet warnanya identik sama yang dipakai generate `preview_delta_lst.png`/`preview_kesehatan_kelapa.png` (yang udah dikirim ke user sebelumnya), biar apa yang keliatan di preview = apa yang keliatan di app beneran. Kesehatan Kelapa masih pakai warna kategorikal netral (BUKAN gradient sehat→gak sehat) karena arti kelasnya belum dikonfirmasi (lihat Open Questions di plan doc) — ini tetep sesuai scope Fase 1/MVP yang disepakati.

## Verifikasi yang UDAH dilakuin
1. `npx tsc --noEmit` — clean, gak ada error.
2. `npx next build` (static export mode, `output: "export"`) — sukses, gak ada error compile/bundling.
3. Cek folder `out/data/tif/` — kedua file `.tif` ke-copy dengan benar ke static export output (fetch runtime bakal jalan normal).

## Verifikasi yang BELUM dilakuin (gak ada akses browser di environment ini)
1. **Belum dites visual** — apakah raster beneran ke-render di peta dengan warna yang bener, align sama boundary desa.
2. **Belum dites klik interaktif** — apakah query pixel value jalan bener pas diklik beneran (koordinat, reprojection, modal muncul dengan angka yang masuk akal).
3. **Belum dites di dev server** (`bun run dev`) — cuma `next build` doang yang udah jalan. Build sukses gak 100% jamin dev-server experience identik (walau kemungkinan besar sama).

**Tolong cek manual 3 poin di atas sebelum dianggap kelar** — sesuai prinsip di CLAUDE.md, klaim "selesai" harus dibuktiin, bukan diasumsikan dari build sukses doang.

## File yang dibuat/diubah
**Baru:**
- `src/types/georaster.d.ts`
- `src/lib/proj4Setup.ts`
- `src/lib/rasterColors.ts`
- `src/lib/rasterQuery.ts`
- `src/components/map/layers/LstDeltaLayer.tsx`
- `src/components/map/layers/KesehatanKelapaLayer.tsx`
- `src/components/map/content/LstDeltaModal.tsx`
- `src/components/map/content/KesehatanKelapaModal.tsx`

**Diubah:**
- `package.json` (3 dependency baru + `@types/proj4`)
- `pnpm-workspace.yaml` (allowlist `es5-ext`)
- `src/components/Sidebar.tsx` (2 nav item baru)
- `src/app/page.tsx` (2 `MODULE_META` baru)
- `src/components/map/InfoModal.tsx` (extend union type, `MODULE_META`, render branch)
- `src/components/map/MapBase.tsx` (layer injection)

## Status
Fase 1 (MVP) — **kode selesai, verifikasi build sukses**. Verifikasi visual/interaktif di browser masih perlu dilakuin manual sebelum dianggap production-ready.
