# Fix: Responsivity & UX — Modal Scroll, Map Controls, Dashboard

Ringkasan semua isu yang dilaporin user (UX + responsivity) beserta root cause & fix-nya.

## 1. Modal detail gak bisa discroll — malah peta yang gerak

**Gejala:** scroll mousewheel (desktop) atau swipe (mobile) di modal detail malah nge-zoom/pan peta di belakangnya, bukan scroll konten modal.

**Root cause:** `InfoModal` di-render sebagai children React di dalam `<MapContainer>` (dipanggil dari `AsetLayer`/`SungaiLayer`/dll). Walau CSS-nya `position: fixed` (visually keliatan "di atas" peta), dia tetep **descendant DOM** dari container Leaflet — `position:fixed` cuma ngubah POSISI VISUAL, bukan posisi di DOM tree. Event wheel/touch bubbling ngikutin DOM tree, bukan urutan visual/z-index, jadi event dari modal nembus ke listener zoom/pan yang nempel di container peta.

**Fix:** `src/components/map/InfoModal.tsx` — tambah `onWheel`/`onTouchMove` dengan `stopPropagation()` di backdrop modal. `stopPropagation()` gak nge-block scroll BAWAAN modal sendiri (`overflow-y-auto` masih jalan normal), cuma nyetop event-nya nembus ke ancestor (Leaflet container).

## 2. Legend nimpa toggle Jaringan Jalan/Sungai Irigasi

**Root cause:** `MapControls` (toggle basemap+overlay, di `MapBase.tsx`) di-set `left:16, right:16` — artinya **stretch full-width** antara 2 titik itu. Di layar medium (tablet/laptop sempit), 3 pill (basemap+jalan+sungai) muat 1 baris tanpa wrap, nyampe deket sisi kanan — nabrak `MapLegendPanel` (legend fasum/potensi/raster) yang independen nempel `top:16, right:16`.

**Fix:** `MapControls` di-cap `maxWidth: min(70vw, 420px)` (gak lagi stretch sampe `right:16`) — jaminan struktural gak akan pernah nyampe ke pojok kanan tempat legend nempel, di ukuran layar manapun.

## 3. Legend perlu responsive size

**Fix:** dibuat 1 komponen shared `src/components/map/MapLegendPanel.tsx` (sebelumnya 4 file — `AsetfasumLayer.tsx`, `PotensiLayer.tsx`, `LstDeltaLayer.tsx`, `KesehatanKelapaLayer.tsx` — masing-masing punya style legend yang DUPLIKAT persis). Sekarang 1 sumber, `minWidth: min(180px, 45vw)` / `maxWidth: min(220px, 60vw)` — otomatis menyempit di layar sempit, gak pernah lebih dari 60% lebar layar.

## 4. Toggle/legend nabrak header (mobile & landscape)

**Root cause:** root layout (`page.tsx`) pakai `h-screen` (`100vh`). Di mobile, address bar browser yang muncul/ilang bikin `100vh` gak akurat secara dinamis — viewport "keliatan" lebih tinggi dari yang sebenernya kevisible pas toolbar lagi nongol, nyebabin elemen yang posisinya dihitung relatif ke situ (termasuk offset dari header) keliatan salah/nabrak pas transisi toolbar. Landscape lebih parah karena tinggi absolut viewport udah mepet dari awal, jadi proporsi errornya lebih signifikan.

**Fix:** `page.tsx` root `h-screen` → **`h-dvh`** (`100dvh`, dynamic viewport height — unit CSS modern yang dihitung ulang otomatis ngikutin toolbar browser, native didukung Tailwind v4). Sekalian semua panel floating (`MapControls`, `MapLegendPanel`) dikasih `top`/`left`/`right` pakai `max(0.75rem, env(safe-area-inset-*))` — aman dari notch/camera-cutout di HP landscape juga.

## 5. Zoom control tenggelam di mobile landscape

**Fix:** `globals.css`, rule `.leaflet-bottom.leaflet-left` — `margin-bottom`/`margin-left` ditambah `env(safe-area-inset-bottom)`/`env(safe-area-inset-left)`. Di landscape, `safe-area-inset-left` jadi signifikan (notch/home-indicator geser ke samping), jadi tanpa ini kontrol bisa ketutup.

## 6. Dashboard — "Aksesibilitas Pendidikan" kepotong di mobile

**Root cause:** header card (`EducationMetrics.tsx`) = icon + judul + badge "`{totalLembaga} lembaga`" dalam 1 baris `flex`. Di mobile (~375px, dikurangin padding dashboard+card = ~287px tersisa), badge lebar (~90px buat "14 lembaga") + icon (~44px) nyisain ruang sempit banget buat judul → `truncate` motong jadi "Aksesibilitas Pendi…".

**Fix:** badge dipersingkat di mobile — teks "lembaga" disembunyiin (`hidden sm:inline`), cuma nyisain angka (`14`). Nambah ~60px ruang buat judul.

## 7. Dashboard — label zona "Waktu Tempuh" bocor ke samping

**Root cause:** section "Waktu Tempuh" ada di kolom kanan `grid-cols-2` (kolom kiri: bar chart jenjang). Di mobile, kolom itu cuma dapet ~140-160px — sementara isinya butuh minimal ~170px+ (dot + label zona lebar tetap `w-20`/80px + progress bar + teks "X sekolah") → overflow horizontal.

**Fix:** grid diubah `grid-cols-1 sm:grid-cols-2` — stack vertikal (bar chart di atas, Waktu Tempuh di bawah) di mobile, dapet full lebar card (~280-330px, cukup lega). Sejajar 2 kolom lagi mulai breakpoint `sm` (640px). Divider ikut nyesuain (`divide-y` pas stack, `divide-x` pas sejajar).

## 8. Dashboard — "Total X ton" gak center

**Root cause:** row header section "Produksi Pertanian & Perkebunan" (`LandPotentialMetrics.tsx`) = icon + label panjang + badge "Total X ton" (`ml-auto`, dorong ke kanan) dalam 1 baris tanpa `flex-wrap`. Di mobile, kombinasi label panjang + badge gampang overflow/keliatan gak rapi.

**Fix:** row diubah jadi `flex-col sm:flex-row` — icon+label jadi 1 baris sendiri, badge "Total X ton" turun ke baris sendiri di bawahnya dengan `self-center` (mobile) / balik ke posisi kanan (`sm:ml-auto`) pas layar udah cukup lebar buat 1 baris.

## Verifikasi
1. `npx tsc --noEmit` — clean.
2. `npx next build` — sukses.
3. **Manual di browser (belum dites — gak ada akses browser di sisi AI):** cek semua 8 poin di atas, khususnya di device/orientasi yang disebut user (laptop mousewheel, mobile portrait & landscape).

## File yang diubah
**Baru:** `src/components/map/MapLegendPanel.tsx`
**Diubah:** `src/components/map/InfoModal.tsx`, `src/components/map/MapBase.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/components/map/layers/AsetfasumLayer.tsx`, `src/components/map/layers/PotensiLayer.tsx`, `src/components/map/layers/LstDeltaLayer.tsx`, `src/components/map/layers/KesehatanKelapaLayer.tsx`, `src/components/analytics/EducationMetrics.tsx`, `src/components/analytics/LandPotentialMetrics.tsx`

## Status
Kode selesai, `tsc`/`next build` clean. Verifikasi visual di browser (semua device/orientasi) masih perlu dilakuin manual.
