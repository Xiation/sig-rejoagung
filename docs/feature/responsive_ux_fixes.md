# Fix: Responsivity & UX — Modal Scroll, Map Controls, Dashboard

Ringkasan semua isu yang dilaporin user (UX + responsivity) beserta root cause & fix-nya. **Ada 2 ronde** — ronde 1 sempet gak nyelesein 3 masalah (masih dilaporin ulang user), root cause di-analisis ulang lebih dalam di ronde 2 (section bertanda "RONDE 2 REVISI").

## 1. Modal detail gak bisa discroll — malah peta yang gerak

**Gejala:** scroll mousewheel (desktop) atau swipe (mobile) di modal detail malah nge-zoom/pan peta di belakangnya, bukan scroll konten modal.

**Root cause (wheel, desktop):** `InfoModal` di-render sebagai children React di dalam `<MapContainer>` (dipanggil dari `AsetLayer`/`SungaiLayer`/dll). Walau CSS-nya `position: fixed` (visually keliatan "di atas" peta), dia tetep **descendant DOM** dari container Leaflet — `position:fixed` cuma ngubah POSISI VISUAL, bukan posisi di DOM tree. Event wheel bubbling ngikutin DOM tree, bukan urutan visual/z-index, jadi event dari modal nembus ke listener zoom yang nempel di container peta.

**Fix ronde 1 (cuma benerin wheel):** tambah `onWheel`/`onTouchMove` dengan `stopPropagation()` di backdrop modal.

**RONDE 2 REVISI — touch-drag masih gak bisa discroll:** fix ronde 1 `stopPropagation()` di `onTouchMove` **gak ngaruh buat touch**, beda mekanisme dari wheel. Leaflet nyetel CSS `touch-action: none` di container-nya buat nangkep gesture pan/zoom manual — ini keputusan di level BROWSER (gesture recognition), diputusin SEBELUM event JS `touchmove` sempet kepegang sama sekali. `stopPropagation()` di JS event handler gak ada gunanya buat masalah level-CSS ini. Karena modal tetep descendant DOM dari container yang `touch-action:none`, browser nolak native scroll di situ, titik.

**Fix final:** `InfoModal.tsx` di-render pakai **`createPortal(..., document.body)`** dari `react-dom` — modal keluar total dari DOM tree Leaflet, jadi bukan descendant sama sekali. Ini sekaligus nyelesein masalah wheel (poin sebelumnya) DAN touch-drag, dari akarnya — bukan cuma nutupin gejala.

## 2. Legend nimpa toggle Jaringan Jalan/Sungai Irigasi

**Root cause:** `MapControls` (toggle basemap+overlay, di `MapBase.tsx`) di-set `left:16, right:16` — artinya **stretch full-width** antara 2 titik itu. Di layar medium (tablet/laptop sempit), 3 pill (basemap+jalan+sungai) muat 1 baris tanpa wrap, nyampe deket sisi kanan — nabrak `MapLegendPanel` (legend fasum/potensi/raster) yang independen nempel `top:16, right:16`.

**Fix ronde 1 (masih overlap):** `MapControls` di-cap `maxWidth: min(70vw, 420px)`. **Ternyata masih ketiban** — MapControls & MapLegendPanel dua-duanya ngitung lebar sendiri-sendiri secara independen (gak saling tau), jadi di lebar layar tertentu (medium, ~500-600px) kombinasi maxWidth MapControls + width Legend masih bisa overlap secara matematis (dihitung ulang manual: pada viewport ~500px, `min(70vw,420px)`=350px buat MapControls + `min(220px,60vw)`=220px buat Legend = 570px, lebih dari 500px viewport — overlap ~70px).

**RONDE 2 REVISI — reserve ruang yang saling terkait, bukan independen:**
- `MapLegendPanel.tsx`: width diubah dari `min/max` independen jadi **1 formula pasti**: `width: clamp(140px, 42%, 200px)` — max ketat 200px.
- `MapBase.tsx` (`MapControls`): `maxWidth: calc(100% - 240px)` — reserve PERSIS 240px (200px lebar max Legend + ~12px offset kanan Legend + ~28px gap aman), jadi MapControls **gak akan pernah** bisa masuk ke zona Legend, dijamin matematis di ukuran layar manapun (bukan tebakan lagi).
- **Catatan penting:** dipake `%` bukan `vw` — `vw` selalu relatif ke viewport PENUH, padahal di desktop pas sidebar kebuka, container peta yang sebenarnya lebih SEMPIT dari viewport (dikurangin lebar sidebar 288px). `%` resolve ke containing block yang bener (div `relative` punya `MapBase`), jadi perhitungan tetep akurat baik sidebar kebuka maupun ketutup.

## 3. Legend perlu responsive size

**Fix:** dibuat 1 komponen shared `src/components/map/MapLegendPanel.tsx` (sebelumnya 4 file — `AsetfasumLayer.tsx`, `PotensiLayer.tsx`, `LstDeltaLayer.tsx`, `KesehatanKelapaLayer.tsx` — masing-masing punya style legend yang DUPLIKAT persis). Sekarang 1 sumber, `minWidth: min(180px, 45vw)` / `maxWidth: min(220px, 60vw)` — otomatis menyempit di layar sempit, gak pernah lebih dari 60% lebar layar.

## 4. Toggle/legend nabrak header (mobile & landscape)

**Root cause:** root layout (`page.tsx`) pakai `h-screen` (`100vh`). Di mobile, address bar browser yang muncul/ilang bikin `100vh` gak akurat secara dinamis — viewport "keliatan" lebih tinggi dari yang sebenernya kevisible pas toolbar lagi nongol, nyebabin elemen yang posisinya dihitung relatif ke situ (termasuk offset dari header) keliatan salah/nabrak pas transisi toolbar. Landscape lebih parah karena tinggi absolut viewport udah mepet dari awal, jadi proporsi errornya lebih signifikan.

**Fix:** `page.tsx` root `h-screen` → **`h-dvh`** (`100dvh`, dynamic viewport height — unit CSS modern yang dihitung ulang otomatis ngikutin toolbar browser, native didukung Tailwind v4). Sekalian semua panel floating (`MapControls`, `MapLegendPanel`) dikasih `top`/`left`/`right` pakai `max(0.75rem, env(safe-area-inset-*))` — aman dari notch/camera-cutout di HP landscape juga.

## 5. Zoom control tenggelam di mobile landscape

**Fix:** `globals.css`, rule `.leaflet-bottom.leaflet-left` — `margin-bottom`/`margin-left` ditambah `env(safe-area-inset-bottom)`/`env(safe-area-inset-left)`. Di landscape, `safe-area-inset-left` jadi signifikan (notch/home-indicator geser ke samping), jadi tanpa ini kontrol bisa ketutup.

## 6. Dashboard — "Aksesibilitas Pendidikan" kepotong di mobile

**Root cause:** header card (`EducationMetrics.tsx`) = icon + judul + badge "`{totalLembaga} lembaga`" dalam 1 baris `flex`. Di mobile (~375px, dikurangin padding dashboard+card = ~287px tersisa), badge lebar (~90px buat "14 lembaga") + icon (~44px) nyisain ruang sempit banget buat judul → `truncate` motong jadi "Aksesibilitas Pendi…".

**Fix ronde 1:** badge dipersingkat di mobile — teks "lembaga" disembunyiin (`hidden sm:inline`), cuma nyisain angka (`14`). Nambah ~60px ruang buat judul.

**RONDE 2 REVISI — masih dikit kepotong:** trim tambahan (ronde 1 belum cukup) — gap header `gap-3` → `gap-2 sm:gap-3` (hemat 4px), icon box `w-8 h-8` → `w-7 h-7 sm:w-8 sm:h-8` (hemat 4px), badge padding `px-2.5 py-1` → `px-2 py-0.5 sm:px-2.5 sm:py-1` (hemat ~8px). Total tambahan ~16px, digabung sama ronde 1 (~60px) jadi ~76px ekstra ruang buat judul.

## 7. Dashboard — label zona "Waktu Tempuh" bocor ke samping

**Root cause:** section "Waktu Tempuh" ada di kolom kanan `grid-cols-2` (kolom kiri: bar chart jenjang). Di mobile, kolom itu cuma dapet ~140-160px — sementara isinya butuh minimal ~170px+ (dot + label zona lebar tetap `w-20`/80px + progress bar + teks "X sekolah") → overflow horizontal.

**Fix:** grid diubah `grid-cols-1 sm:grid-cols-2` — stack vertikal (bar chart di atas, Waktu Tempuh di bawah) di mobile, dapet full lebar card (~280-330px, cukup lega). Sejajar 2 kolom lagi mulai breakpoint `sm` (640px). Divider ikut nyesuain (`divide-y` pas stack, `divide-x` pas sejajar).

## 8. Dashboard — "Total X ton" gak center

**Root cause:** row header section "Produksi Pertanian & Perkebunan" (`LandPotentialMetrics.tsx`) = icon + label panjang + badge "Total X ton" (`ml-auto`, dorong ke kanan) dalam 1 baris tanpa `flex-wrap`. Di mobile, kombinasi label panjang + badge gampang overflow/keliatan gak rapi.

**Fix:** row diubah jadi `flex-col sm:flex-row` — icon+label jadi 1 baris sendiri, badge "Total X ton" turun ke baris sendiri di bawahnya dengan `self-center` (mobile) / balik ke posisi kanan (`sm:ml-auto`) pas layar udah cukup lebar buat 1 baris.

## Verifikasi
1. `npx tsc --noEmit` — clean (dicek ulang setelah ronde 2 juga).
2. `npx next build` — sukses (dicek ulang setelah ronde 2 juga).
3. **Manual di browser (belum dites — gak ada akses browser di sisi AI):** cek semua 8 poin di atas, khususnya di device/orientasi yang disebut user (laptop mousewheel, mobile portrait & landscape). Prioritas cek ulang: poin 1 (touch-drag modal), 2 (legend di berbagai lebar layar termasuk pas sidebar kebuka/ketutup), 6 (judul gak kepotong sama sekali).

## File yang diubah (kumulatif, ronde 1 + 2)
**Baru:** `src/components/map/MapLegendPanel.tsx`
**Diubah:** `src/components/map/InfoModal.tsx` (ronde 2: `createPortal`), `src/components/map/MapBase.tsx` (ronde 2: reserve space `%`), `src/app/page.tsx`, `src/app/globals.css`, `src/components/map/layers/AsetfasumLayer.tsx`, `src/components/map/layers/PotensiLayer.tsx`, `src/components/map/layers/LstDeltaLayer.tsx`, `src/components/map/layers/KesehatanKelapaLayer.tsx`, `src/components/analytics/EducationMetrics.tsx` (ronde 2: trim tambahan), `src/components/analytics/LandPotentialMetrics.tsx`

## Status
Kode selesai, `tsc`/`next build` clean. Verifikasi visual di browser (semua device/orientasi) masih perlu dilakuin manual.
