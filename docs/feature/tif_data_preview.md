# Preview Isi Data: DeltaLST & Kesehatan Kelapa

Gambar preview di-generate manual dari raw pixel value (gak ada GDAL/matplotlib di environment ini, jadi warnanya digambar manual pakai PIL, resolusi asli 332×356px di-upscale 3x biar keliatan). **Ini cuma buat kamu ngeliat POLA SPASIAL datanya** — warna final buat production belum diputusin, nunggu jawaban Open Questions di `raster_modules_lst_kesehatan_kelapa.md`.

## `preview_delta_lst.png` — DeltaLST_2020_2025_FIX.tif

Skema warna: **biru = turun/dingin, putih = ~0 (gak berubah), merah = naik/panas**, abu-abu = no-data (NaN).

- Rentang value asli: **-0,71 s/d +7,48** (asumsi °C)
- 45.919 dari 118.192 pixel (38,9%) itu **NaN** (area abu-abu di gambar)
- Mayoritas area yang ada datanya condong ke arah **positif/merah** (naik/lebih panas) — konsisten sama nama file "Delta" 2020→2025 kalau emang tren umumnya pemanasan permukaan.

## `preview_kesehatan_kelapa.png` — Kesehatan_Kelapa_2025_FIX.tif

Skema warna preview ini **cuma buat bedain 6 kelas, BUKAN urutan sehat↔gak sehat** (karena arti tiap kelas belum kamu konfirmasi):
- Kelas 0 → abu-abu
- Kelas 1 → merah
- Kelas 2 → oranye
- Kelas 3 → kuning
- Kelas 4 → hijau
- Kelas 5 → biru

Jumlah pixel per kelas:
| Kelas | Jumlah pixel | % dari total |
|---|---|---|
| 0 | 46.737 | 39,5% |
| 1 | 2.938 | 2,5% |
| 2 | 10.676 | 9,0% |
| 3 | 12.324 | 10,4% |
| 4 | 12.670 | 10,7% |
| 5 | 32.847 | 27,8% |

**Temuan yang mungkin bantu jawab Open Question #1:** jumlah pixel kelas 0 (46.737) **hampir persis sama** sama jumlah pixel NaN di DeltaLST (45.919) — beda cuma ~818 pixel (0,7% dari total). Ini indikasi kuat kelas 0 = **"bukan area kelapa / di luar mask analisis"**, bukan "kesehatan level 0/paling parah" — soalnya 2 raster ini kemungkinan besar pakai mask area yang sama pas diproses. Kalau bener gitu, kelas 1-5 yang beneran representasi tingkat kesehatan (1=kemungkinan paling rendah — cuma 2,5% pixel, wajar kalau itu kategori "parah/langka" — 5=kemungkinan paling tinggi — 27,8% pixel, wajar kalau mayoritas vegetasi kelapa dalam kondisi baik). **Ini masih hipotesis dari pola angka, bukan fakta dikonfirmasi** — tolong cek ke sumber data/temen yang proses citra buat mastiin.

## File
- `docs/feature/preview_delta_lst.png`
- `docs/feature/preview_kesehatan_kelapa.png`
