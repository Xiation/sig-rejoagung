# Fix Journey: Responsivity, UI & UX (Modal, Map Controls, Dashboard)

Dokumen ini nyeritain proses lengkap benerin sekumpulan masalah UX & responsivity yang dilaporin user sekaligus dalam 1 pesan panjang — dari peta (modal, toggle, legend, zoom control) sampe dashboard analytics. Ditulis lengkap termasuk bagian yang **gagal di percobaan pertama** biar keliatan proses debugging-nya, bukan cuma hasil akhir.

**TL;DR:** 8 masalah dilaporin sekaligus. 5 langsung kelar di ronde 1. 3 sisanya (modal scroll, legend overlap, judul kepotong) ternyata fix ronde 1-nya kurang dalam — root cause-nya baru bener-bener ketemu di ronde 2 setelah user re-test.

---

## Laporan Awal User (verbatim, dirangkum jadi 8 poin)

1. Modal detail gak bisa discroll — scroll mousewheel (laptop)/drag (mobile) di modal malah nge-zoom/geser peta di belakangnya.
2. Legend di kanan-atas nimpa tombol toggle Jaringan Jalan & Sungai Irigasi.
3. Legend perlu ukuran responsive.
4. Tombol zoom in/out peta tenggelam/gak keliatan di mobile.
5. Toggle & legend nabrak header di mobile, makin parah di landscape.
6. Dashboard: judul "Aksesibilitas Pendidikan" kepotong di mobile.
7. Dashboard: label zona "Waktu Tempuh" (jumlah sekolah) bocor keluar container.
8. Dashboard: teks "Total X ton" (Produksi Pertanian) gak center.

---

## RONDE 1

### 1. Modal gak bisa discroll (fix awal — cuma benerin sebagian)

**Investigasi:** `InfoModal` dipanggil dari dalam `AsetLayer`/`SungaiLayer`/dll — komponen yang notabene child React di dalam `<MapContainer>`. Walau CSS-nya `position: fixed` (visually keliatan "di atas" peta), `position:fixed` cuma ngubah POSISI VISUAL — DOM tree-nya tetep sama, modal tetep **descendant** dari container Leaflet. Event wheel bubbling ngikutin DOM tree, bukan urutan visual/z-index — makanya scroll mousewheel di modal malah kena tangkep listener zoom Leaflet.

**Fix diterapin:** tambah `onWheel`/`onTouchMove` dengan `e.stopPropagation()` di backdrop modal.

**Hasil:** wheel (desktop) kelar. Touch-drag (mobile) — lihat Ronde 2.

### 2 & 3. Legend nimpa toggle + perlu responsive (fix awal — belum cukup)

**Investigasi:** `MapControls` (toggle basemap+overlay) di-set `left:16, right:16` — stretch full-width. Di layar medium, 3 pill (basemap+jalan+sungai) muat 1 baris tanpa wrap, nyampe deket kanan — nabrak `MapLegendPanel` (legend, komponen baru yang diekstrak dari 4 file duplikat: `AsetfasumLayer.tsx`, `PotensiLayer.tsx`, `LstDeltaLayer.tsx`, `KesehatanKelapaLayer.tsx`) yang independen nempel `top:16, right:16`.

**Fix diterapin:** `MapControls` di-cap `maxWidth: min(70vw, 420px)`.

**Hasil:** masih overlap — lihat Ronde 2.

### 4 & 5. Zoom control tenggelam + nabrak header

**Root cause #4:** zoom control (`ZoomControl position="bottomleft"`) gak punya margin aman dari edge layar — di landscape mobile, `safe-area-inset-left` (notch/home-indicator geser ke samping) jadi signifikan dan belum diperhitungkan.

**Root cause #5:** root layout (`page.tsx`) pakai `h-screen` (`100vh`). Di mobile, address bar browser yang muncul/ilang bikin `100vh` gak akurat secara dinamis — viewport "keliatan" lebih tinggi dari yang sebenernya ke-visible pas toolbar lagi nongol, nyebabin elemen yang posisinya dihitung relatif ke situ keliatan nabrak header pas transisi toolbar. Landscape lebih parah karena tinggi absolut viewport-nya udah mepet dari awal.

**Fix:**
- `globals.css`, rule `.leaflet-bottom.leaflet-left` — `margin-bottom`/`margin-left` ditambah `env(safe-area-inset-bottom)`/`env(safe-area-inset-left)`.
- `page.tsx` root: `h-screen` → **`h-dvh`** (dynamic viewport height, unit CSS modern yang dihitung ulang otomatis ngikutin toolbar browser, didukung native Tailwind v4).
- `MapControls` & `MapLegendPanel`: `top`/`left`/`right` pakai `max(0.75rem, env(safe-area-inset-*))`.

**Hasil:** kelar, gak dilaporin ulang di ronde 2.

### 6. Judul "Aksesibilitas Pendidikan" kepotong (fix awal — belum cukup)

**Root cause:** header card (`EducationMetrics.tsx`) = icon + judul + badge `"{totalLembaga} lembaga"` dalam 1 baris `flex`. Di mobile (~375px, dikurangin padding dashboard+card = ~287px tersisa), badge (~90px) + icon (~44px) nyisain ruang sempit banget buat judul → `truncate` motong jadi "Aksesibilitas Pendi…".

**Fix diterapin:** badge dipersingkat di mobile — teks "lembaga" disembunyiin (`hidden sm:inline`), cuma nyisain angka. Nambah ~60px.

**Hasil:** masih dikit kepotong — lihat Ronde 2.

### 7. Label zona "Waktu Tempuh" bocor

**Root cause:** section "Waktu Tempuh" ada di kolom kanan `grid-cols-2` (kolom kiri: bar chart jenjang). Di mobile, kolom itu cuma dapet ~140-160px — isinya butuh minimal ~170px+ (dot + label zona lebar tetap `w-20`/80px + progress bar + teks "X sekolah") → overflow horizontal.

**Fix:** grid diubah `grid-cols-1 sm:grid-cols-2` — stack vertikal di mobile (bar chart di atas, Waktu Tempuh di bawah, dapet full lebar card), sejajar 2 kolom lagi dari `sm` (640px). Divider ikut nyesuain (`divide-y` pas stack, `divide-x` pas sejajar).

**Hasil:** kelar, gak dilaporin ulang.

### 8. "Total X ton" gak center

**Root cause:** row header "Produksi Pertanian & Perkebunan" (`LandPotentialMetrics.tsx`) = icon + label panjang + badge `ml-auto` dalam 1 baris tanpa `flex-wrap` — di mobile kombinasi label panjang + badge gampang overflow/gak rapi.

**Fix:** row diubah `flex-col sm:flex-row` — icon+label 1 baris, badge "Total X ton" turun ke baris sendiri dengan `self-center` (mobile) / balik ke kanan (`sm:ml-auto`) pas layar cukup lebar.

**Hasil:** kelar, gak dilaporin ulang.

---

## User Re-Test: 3 dari 8 Masalah Masih Ada

> "legend panel masih nimpa, modal masih ga bisa discroll (ketika komponen modal didrag ke bawah itu ga kescroll), terus tulisan aksesibilitas pendidikan masih sedikit terpotong"

Detail baru dari user yang jadi kunci: **"didrag ke bawah"** — spesifik soal TOUCH-DRAG, bukan wheel. Ini clue penting buat root cause ronde 2.

## RONDE 2 — Root Cause yang Lebih Dalam

### 1. Modal scroll — touch-action, bukan soal bubbling

`stopPropagation()` di `onTouchMove` (fix ronde 1) **gak ada gunanya buat touch**, beda mekanisme total dari wheel. Leaflet nyetel CSS `touch-action: none` di container-nya buat nangkep gesture pan/zoom manual sendiri — ini keputusan **level browser** (gesture recognition), diputusin SEBELUM event JS `touchmove` sempet kepegang sama sekali. `stopPropagation()` di JS handler gak relevan buat masalah yang keputusannya udah diambil browser sebelum JS jalan. Karena modal tetep descendant DOM dari container yang `touch-action:none`, browser nolak native scroll di situ — titik, gak peduli JS-nya ngapain.

**Fix final:** `InfoModal.tsx` di-render pakai **`createPortal(..., document.body)`** dari `react-dom`. Modal keluar total dari DOM tree Leaflet — bukan descendant sama sekali, jadi 2 masalah (wheel bubbling DAN touch-action inheritance) otomatis gak relevan lagi. Bukan nutupin gejala, tapi ngilangin penyebabnya.

**Langkah fix (ringkas):**
1. Import `createPortal` dari `react-dom` di `InfoModal.tsx`.
2. Bungkus return JSX modal (backdrop + shell) pakai `createPortal(<div>...</div>, document.body)` — target portal-nya `document.body`, bukan lagi child di dalam tree `<MapContainer>`.
3. Hapus `onWheel`/`onTouchMove` + `stopPropagation()` di backdrop (fix ronde 1) — udah gak perlu, portal ngilangin masalah dari akarnya (bukan descendant Leaflet lagi), bukan cuma nutup gejala.
4. Verifikasi: `npx tsc --noEmit` clean, lalu tes manual — scroll wheel (desktop) & touch-drag (mobile) di modal jalan normal, peta di belakang gak ikut ke-zoom/geser.

### 2 & 3. Legend overlap — reservasi ruang independen ternyata gak cukup

`MapControls` (maxWidth `min(70vw,420px)`) dan `MapLegendPanel` (width `min(180px,45vw)` s/d `min(220px,60vw)`) itu **2 komponen independen** yang masing-masing ngitung lebar sendiri **tanpa saling tau**. Dihitung ulang manual: di viewport ~500px, MapControls bisa sampe 350px + Legend bisa sampe 220px = 570px, LEBIH dari 500px viewport — overlap ~70px. Bug-nya bukan di logic masing-masing, tapi di gak adanya KOORDINASI antar keduanya.

**Fix final:**
- `MapLegendPanel.tsx`: width jadi 1 formula pasti — `clamp(140px, 42%, 200px)`, max ketat 200px.
- `MapBase.tsx` (`MapControls`): `maxWidth: calc(100% - 240px)` — reserve PERSIS 240px (200px max Legend + ~12px offset + ~28px gap aman). MapControls **gak akan pernah bisa** masuk ke zona Legend, dijamin matematis, bukan tebakan lagi.
- **Bonus fix yang ketemu pas ngerjain ini:** ganti `vw` → `%` di kedua komponen. `vw` selalu relatif ke viewport PENUH — di desktop pas sidebar kebuka, container peta yang sebenarnya lebih SEMPIT dari viewport (dikurangin 288px lebar sidebar), jadi perhitungan `vw` bisa salah di kondisi itu spesifik. `%` resolve ke containing block yang bener (div `relative` milik `MapBase`), akurat di kondisi manapun.

### 6. Judul masih kepotong — trim lebih dalam

Ronde 1 udah nghemat ~60px (badge dipersingkat), tapi ternyata belum cukup. Trim tambahan: `gap-3`→`gap-2 sm:gap-3` (hemat 4px), icon box `w-8 h-8`→`w-7 h-7 sm:w-8 sm:h-8` (hemat 4px), badge padding `px-2.5 py-1`→`px-2 py-0.5 sm:px-2.5 sm:py-1` (hemat ~8px). Total tambahan ~16px, gabung ronde 1 jadi ~76px ekstra buat judul.

---

## Hasil Akhir

User konfirmasi: **semua 8 poin udah aman setelah ronde 2**, dites langsung di browser.

---

## RONDE 3 — Bug ketemu belakangan (bukan dari refactor, warisan lama)

User notice: legend modul **Aset & Fasum** (`AsetfasumLayer.tsx`) footer-nya nulis **"Klik poligon untuk detail SDA"** — padahal teks itu cuma relevan buat modul **Potensi Lahan** (`PotensiLayer.tsx`, yang beneran render poligon dusun & isinya SDA).

**Root cause:** ini **copy-paste lama**, bukan bug baru dari refactor `MapLegendPanel` (ronde 1/2 di atas) — pas `FasumLegend` di `AsetfasumLayer.tsx` awalnya dibikin, teks footer-nya kecontek/disalin dari `DusunLegend` (`PotensiLayer.tsx`) apa adanya, tanpa disesuaikan. Modul Aset & Fasum sebenernya render **marker titik** (`L.marker` + `getMarkerIcon`, lihat `AsetfasumLayer.tsx`), BUKAN poligon, dan kontennya "Aset & Fasilitas Umum" — bukan "SDA". Refactor `MapLegendPanel` (ronde 1) cuma misahin STYLE/POSISI legend ke komponen shared, isi teks tiap legend (`children`) tetep apa adanya dari component masing-masing — jadi bug lama ini ikut kebawa gak berubah, gak ke-notice sampe user liat langsung.

**Fix:** `AsetfasumLayer.tsx` — teks footer `FasumLegend` diganti dari `"Klik poligon untuk detail SDA"` jadi **`"Klik marker untuk detail fasilitas"`** — sesuai interaksi & konten modul yang sebenarnya. `PotensiLayer.tsx` (`DusunLegend`) gak diubah — teksnya emang udah bener buat modul itu.

**Verifikasi:** `npx tsc --noEmit` clean. Belum dites visual (gak ada akses browser).

**Pelajaran:** refactor buat DRY (`MapLegendPanel`) itu bagus buat nyegah bug BARU nge-duplikat 4x, tapi gak otomatis nyaring bug LAMA yang udah nempel di konten yang di-refactor — konten (`children`) tetep tanggung jawab masing-masing pemanggil, cuma wrapper posisi/style-nya yang disatuin.

## Ringkasan Tabel

| # | Masalah | Ronde 1 cukup? | Root cause final |
|---|---|---|---|
| 1 | Modal gak bisa discroll | ❌ (cuma wheel) | Touch: `touch-action` CSS-level, bukan soal event bubbling → `createPortal` |
| 2 | Legend nimpa toggle | ❌ | Dua komponen reserve ruang independen tanpa koordinasi → reservasi matematis pasti |
| 3 | Legend perlu responsive | ❌ | (sama kayak #2, ke-fix bareng) |
| 4 | Zoom control tenggelam | ✅ | `env(safe-area-inset-*)` |
| 5 | Nabrak header mobile/landscape | ✅ | `h-screen`→`h-dvh` |
| 6 | Judul kepotong | ❌ (kurang dalam) | Trim tambahan (gap/icon/badge) |
| 7 | Label zona bocor | ✅ | Grid `1 col` di mobile |
| 8 | "Total ton" gak center | ✅ | Row `flex-col` di mobile |

**Pelajaran:** 3 dari 8 fix ronde 1 SECARA LOGIKA udah bener arahnya (nyentuh komponen yang tepat), tapi kurang teliti ngitung MARGIN/dampak nyata di kondisi ekstrem (viewport sempit, gesture touch spesifik) — beda kelas masalah dari bug raster kemarin (`docs/feature/fix/raster_layer_debugging_journey.md`) yang root cause-nya beneran salah total di awal. Di sini arahnya udah bener, cuma butuh presisi lebih (reservasi ruang matematis, bukan estimasi; portal DOM, bukan cuma stopPropagation).

## File yang Berubah (kumulatif ronde 1 + 2)
**Baru:** `src/components/map/MapLegendPanel.tsx`
**Diubah:** `src/components/map/InfoModal.tsx`, `src/components/map/MapBase.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/components/map/layers/AsetfasumLayer.tsx`, `src/components/map/layers/PotensiLayer.tsx`, `src/components/map/layers/LstDeltaLayer.tsx`, `src/components/map/layers/KesehatanKelapaLayer.tsx`, `src/components/analytics/EducationMetrics.tsx`, `src/components/analytics/LandPotentialMetrics.tsx`

## Verifikasi
- `npx tsc --noEmit` — clean (ronde 1 & 2).
- `npx next build` — sukses (ronde 1 & 2).
- **Manual di browser — user udah konfirmasi AMAN** (laptop mousewheel, mobile portrait & landscape, semua 8 poin).

## Dokumen terkait
- `docs/feature/responsive_ux_fixes.md` (versi kerja/working notes) udah di-merge ke sini — dihapus, isinya sepenuhnya kecover di dokumen ini (dokumen ini superset-nya, sama + narasi RONDE 3).
