# Update: Kelas Kesehatan Kelapa CONFIRMED — Palet Warna & Label Semantik

Bukan bug fix — ini nindaklanjutin **Open Question #1** yang sempet nge-block Fase 2 modul raster Kesehatan Kelapa (lihat `docs/feature/raster_modules_lst_kesehatan_kelapa.md`). Ditulis di sini biar jelas konteks: apa yang tadinya gak diketahui, apa yang confirmed, dan apa dampaknya ke kode.

## Konteks: Apa yang Tadinya Gak Diketahui

Pas raster `Kesehatan_Kelapa_2025_FIX.tif` pertama kali dicek isinya (lihat `docs/feature/tif_data_preview.md`), ketemu **6 nilai unik: 0, 1, 2, 3, 4, 5** — tapi arti tiap kelas gak diketahui: apakah 0 itu "kesehatan level paling parah" atau "bukan area kelapa sama sekali", dan arah mana yang nunjukin "sehat" (1→5 makin sehat, atau kebalik).

**Hipotesis awal** (dari analisis pola angka, BUKAN fakta dikonfirmasi) — jumlah pixel kelas 0 (46.737) hampir persis sama jumlah pixel `NaN` di raster LST Delta (45.919, beda cuma ~0,7%). Karena 2 raster ini kemungkinan pakai mask area yang sama pas diproses, ini indikasi kuat kelas 0 = "bukan area kelapa/di luar mask" — BUKAN "kesehatan level 0". Hipotesis ini ditulis jujur sebagai dugaan, gak langsung diterapkan ke kode/palet warna final.

**Keputusan waktu itu (Fase 1/MVP):** daripada nunggu konfirmasi yang gak jelas kapan, modul raster Kesehatan Kelapa dibangun dulu (fetch, render, klik→query pixel value) pakai **palet warna netral** (6 warna kategorikal random, cuma buat bedain kelas visual — BUKAN gradient sehat/gak sehat) dan modal nampilin **"Kelas N" mentah** tanpa label semantik, plus disclaimer "makna kelas belum dikonfirmasi tim lapangan". Analisis detail (kayak yang ada di `PotensiModal`) sengaja ditunda ke "Fase 2", nunggu konfirmasi ini.

## Konfirmasi dari Tim Lapangan

User dapet klarifikasi: **cuma kelas 1-5 yang dipakai** (kelas 0 BUKAN bagian skala kesehatan), dengan urutan:

| Kelas | Arti |
|---|---|
| 1 | Sangat Tidak Sehat |
| 2 | Tidak Sehat |
| 3 | Cukup Sehat |
| 4 | Sehat |
| 5 | Sangat Sehat |

Ini **mengkonfirmasi hipotesis awal** — kelas 0 emang bukan bagian skala kesehatan, sama kayak dugaan dari analisis jumlah pixel di atas.

## Perubahan Kode

### 1. `src/lib/rasterColors.ts` — palet & label
- `KESEHATAN_KELAPA_COLORS`: dari 6 warna kategorikal netral (`{0: abu-abu, 1: merah, 2: oranye, 3: kuning, 4: hijau, 5: biru}`, cuma buat bedain visual) diganti jadi **5 warna gradient kesehatan asli** — merah (`#dc2626`, sangat tidak sehat) → oranye → kuning → lime → hijau (`#16a34a`, sangat sehat). Kelas 0 **dihapus dari palet** (gak ada lagi entry buat itu).
- `KESEHATAN_KELAPA_LABELS` (baru): `Record<number, string>` — nama tiap kelas 1-5, dipakai bareng di legend & modal (1 sumber, konsisten).
- `kesehatanKelapaColor(value)`: sekarang return `null` (transparent) buat kelas 0 — diperlakukan **sama kayak `NaN`** (no-data), bukan digambar abu-abu solid lagi. Konsekuensi visual: area yang bukan kebun kelapa sekarang transparan, basemap/boundary desa keliatan nembus di situ — secara semantik lebih jujur ("gak ada data kesehatan buat ditampilin di sini") dibanding sebelumnya yang digambar abu-abu solid (kesannya kayak "ada data, kelas 0").

### 2. `src/components/map/layers/KesehatanKelapaLayer.tsx` — legend & klik
- Legend: tiap swatch warna sekarang nampilin nama kelas (`"Sangat Sehat"`, dst) — bukan `"Kelas N"` mentah lagi. Disclaimer "makna kelas belum dikonfirmasi" di footer legend dihapus (udah gak relevan).
- Klik handler: area kelas 0 sekarang **gak buka modal** — disamain perlakuannya kayak klik di luar extent raster atau area `NaN` (gak ada data relevan, gak ada feedback modal). Konsisten sama gimana LST Delta udah nanganin `NaN` dari awal.

### 3. `src/components/map/content/KesehatanKelapaModal.tsx` — tampilan modal
- Judul modal: dari `"Kelas 3"` jadi `"Cukup Sehat"` (nama semantik) + subtitle `"... · Kelas 3/5"` (angka tetep ada, sebagai konteks tambahan bukan judul utama).
- Warna ikon di header modal ikutin warna kelas (bukan warna emerald statis).
- Box disclaimer amber "makna kelas belum dikonfirmasi" **dihapus total** — udah gak relevan, datanya CONFIRMED.

### 4. Dokumentasi
- `docs/feature/raster_modules_lst_kesehatan_kelapa.md` — Open Question #1 diupdate dari "belum bisa dijawab" jadi CONFIRMED, dengan tabel kelas. Open Question #3 (palet warna final) juga diupdate — Kesehatan Kelapa CONFIRMED, LST masih default/MVP.
- `docs/feature/raster_layer_pane_fix.md` — ditambah "Update ke-3" (versi ringkas dari dokumen ini, di file yang udah nyimpen histori perubahan raster sebelumnya).

## Yang MASIH Belum Dikerjain (Fase 2 lanjutan, di luar scope update ini)

Update ini nyelesein bagian **label semantik & warna** dari rencana "Fase 2" (lihat `raster_modules_lst_kesehatan_kelapa.md`, section "MVP vs Fase Lanjutan"). Yang BELUM dikerjain (masih nunggu keputusan lanjut, bukan bagian scope update ini):
- Analisis detail di modal kayak `PotensiModal` (insight, rekomendasi, perbandingan antar area).
- Statistik ringkasan di level modul (misal: distribusi kelas kesehatan se-desa, berapa % area "sehat" vs "tidak sehat").

## Verifikasi
1. `npx tsc --noEmit` — **clean** ✓.
2. `npx next build` — **sukses** ✓.
3. **Manual di browser (belum dites, gak ada akses browser di sisi AI):**
   - Buka modul Kesehatan Kelapa — warna raster sekarang gradient merah→hijau (bukan 6 warna acak kayak sebelumnya).
   - Area yang dulunya abu-abu (kelas 0) sekarang **transparan** — basemap/boundary desa keliatan nembus.
   - Klik di area transparan (kelas 0) → **gak ada modal muncul**.
   - Klik di area berwarna (kelas 1-5) → modal muncul, judul nunjukkin nama kelas ("Sangat Sehat" dst), bukan "Kelas N" doang.
   - Legend di pojok kanan-atas nunjukkin nama kelas, bukan angka mentah.

## File yang Diubah
`src/lib/rasterColors.ts`, `src/components/map/layers/KesehatanKelapaLayer.tsx`, `src/components/map/content/KesehatanKelapaModal.tsx`, `docs/feature/raster_modules_lst_kesehatan_kelapa.md`, `docs/feature/raster_layer_pane_fix.md`

## Status
Kode selesai, `tsc`/`next build` clean. Verifikasi visual di browser masih perlu dilakuin manual.
