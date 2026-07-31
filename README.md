# SIG Rejoagung — Web GIS Desa Rejoagung

**Interactive Web GIS Platform for Rejoagung Village 2026** — platform Web GIS *single-page* yang mendigitalisasi hasil analisis spasial Tim Geodesi jadi peta interaktif yang bisa diakses semua pemangku kepentingan Desa Rejoagung (Kabupaten Banyuwangi).

Dikerjakan oleh **Klaster Saintek** bersama **Tim Geodesi & IT KKN-PPM UGM 2026**.

---

## Daftar Isi

- [Latar Belakang & Tujuan](#latar-belakang--tujuan)
- [Tema KKN & Dampak](#tema-kkn--dampak)
- [Target Pengguna](#target-pengguna)
- [Fitur & Modul](#fitur--modul)
- [Arsitektur](#arsitektur)
- [Tech Stack](#tech-stack)
- [Struktur Data](#struktur-data)
- [Struktur Proyek](#struktur-proyek)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Kualitas & Batasan Non-Fungsional](#kualitas--batasan-non-fungsional)
- [Dokumentasi Lanjutan](#dokumentasi-lanjutan)

---

## Latar Belakang & Tujuan

Tujuan proyek ini adalah membangun *Web GIS Dashboard* yang mendigitalisasi hasil analisis spasial Tim Geodesi menjadi peta interaktif yang inklusif dan mudah dipakai — bukan cuma laporan statis di atas kertas/PDF.

Platform ini dirancang jadi **pusat informasi spasial terbuka Desa Rejoagung**, diakses oleh perangkat desa, warga lokal, maupun pihak luar, untuk mendorong aksesibilitas data yang terintegrasi dan transparan.

## Tema KKN & Dampak

Setiap modul dipetakan langsung ke tema inti program KKN-PPM:

| Tema Data | Tema Inti KKN |
|---|---|
| Aset & Fasilitas Umum Desa | Targeted Actions & Poverty Alleviation |
| Potensi Desa & UMKM | Community Economic Development |
| Aksesibilitas Sekolah | Prevention of School Dropouts & Social Issue Mitigation |
| Perubahan Suhu Permukaan (LST) & Kesehatan Vegetasi Kelapa | Environmental Awareness & dukungan analisis faktor risiko stunting berbasis lingkungan |

## Target Pengguna

- **Perangkat Desa** (Kepala Desa / Kepala Dusun) — butuh pemetaan real-time aset infrastruktur, zonasi komoditas, dan visualisasi wilayah dengan akses pendidikan rentan. Platform berfungsi sebagai **instrumen taktis** buat merumuskan kebijakan berbasis data dan menentukan prioritas spasial alokasi anggaran pembangunan desa.
- **Warga & Pihak Eksternal** (warga lokal / calon investor / wisatawan) — butuh akses cepat lewat mobile buat menemukan fasilitas umum, sebaran UMKM, dan potensi lahan wilayah. Platform menumbuhkan **kesadaran spasial** warga sekaligus jadi media promosi digital interaktif buat menarik investasi eksternal.

## Fitur & Modul

Selain **Analytics Dashboard** (ringkasan metrik komposit — aset, pendidikan, potensi lahan, pakai Recharts), platform ini punya 5 modul peta yang bisa di-toggle lewat sidebar:

| Modul | Tipe Data | Deskripsi |
|---|---|---|
| **Aset & Fasum Desa** | Titik (Point) | Marker per kategori (pemerintahan, tempat ibadah, fasilitas pendidikan, dll). Klik marker → modal detail nama aset & kondisi fisik. |
| **Potensi Lahan & SDA** | Titik & Poligon | Zonasi lahan pertanian/perkebunan per Dusun (Sumberagung, Sumberagung Kidul, Sumbergroto, Sumbergroto Kidul) + titik lokasi UMKM. Klik poligon → profil sumber daya & implikasi kebijakan sosial-ekonomi tiap Dusun. |
| **Aksesibilitas Sekolah** | Titik & Poligon | Titik sekolah berwarna per jenjang (TK/SD/SMP/SMA/SMK) + zona *service area* (buffer waktu tempuh 10/30/60 menit) hasil *network analysis*. |
| **Perubahan Suhu Permukaan (LST)** | Raster (GeoTIFF) | Delta *Land Surface Temperature* 2020–2025. Klik peta → nilai suhu titik tersebut. Tombol info khusus membuka modal narasi nilai strategis buat kebijakan pembangunan berwawasan lingkungan & kaitannya (tidak langsung) dengan faktor risiko stunting. |
| **Kesehatan Vegetasi Kelapa** | Raster (GeoTIFF) | Kelas kesehatan kebun kelapa (1–5: Sangat Tidak Sehat s/d Sangat Sehat), warna gradien merah→hijau. Klik area berwarna → detail kelas. |

Interaksi lain: semua info detail (aset/sekolah/potensi/raster) dibuka lewat **InfoModal** — dialog terpusat (bukan popup Leaflet native) yang dioptimalkan buat *scroll* & *tap* di mobile. Tombol **Export Data** di sidebar mengunduh file master data (Excel) langsung.

## Arsitektur

Platform ini diarsitektur sebagai sistem **Zero-Backend, Zero-Database, Client-Side Rendering** — tanpa API route, tanpa server runtime, tanpa biaya hosting bulanan berulang.

- **Data statis di `public/data/`** — semua data spasial (GeoJSON) dan raster (GeoTIFF) di-fetch langsung dari browser via `fetch()`, tanpa lapisan API.
- **Front-End Data Aggregation** — ringkasan statistik, distribusi persentase, dan agregasi lain dihitung *runtime* di browser pakai method Array native (`.filter()`, `.reduce()`, `.map()`), bukan query database.
- **Deterministic Layout Routing** — UI beralih antara tampilan Dashboard Analytics dan kanvas peta *full-screen* lewat state lokal React (`activeModule`), bukan routing halaman terpisah.
- **Next.js Static Export** (`output: "export"`) — build menghasilkan folder `out/` berisi file statis murni, di-serve langsung oleh CDN (tanpa adapter Node/Workers runtime).

## Tech Stack

- **Next.js 16** (App Router, static export)
- **React 19** + **React-Leaflet 5** (peta interaktif berbasis Leaflet.js)
- **Tailwind CSS v4** + **shadcn/ui** — desain mengikuti prinsip Material 3, *light mode* dikunci permanen (kontras tinggi buat keterbacaan di lapangan/luar ruangan, tanpa toggle dark mode)
- **Recharts** — visualisasi grafik di Analytics Dashboard
- **georaster** + **georaster-layer-for-leaflet** + **proj4** — parsing & render layer raster GeoTIFF (LST, kesehatan kelapa)
- **pnpm** — package manager (jangan pakai npm/yarn untuk install; lihat `packageManager` di `package.json`)

## Struktur Data

Semua atribut spasial disajikan sebagai file `.geojson`/`.tif` statis di `public/data/`, di-fetch client-side lewat path `/data/...` (tanpa prefix `public`). Koordinat vektor memakai **WGS 84 (EPSG:4326)**.

Contoh skema data titik aset:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [114.3062171, -8.3892121] },
      "properties": {
        "NAMOBJ": "Kantor Desa Rejoagung",
        "KATEGORI": "Pemerintahan",
        "KONDISI": "Baik",
        "REMARK": "Pusat pelayanan administrasi utama desa"
      }
    }
  ]
}
```

Folder data aktual (bukan nama placeholder di dokumen requirement awal):

```
public/data/
  akses/          # sekolah + service area (buffer waktu tempuh)
  akses4326/
  fasum/          # aset & fasilitas umum
  Fasum4326/
  potensi/        # zonasi lahan/UMKM per dusun
  potensi_SDA_data/
  tif/            # raster GeoTIFF (LST delta, kesehatan kelapa)
  database/       # master data Excel (Export Data)
```

## Struktur Proyek

```
src/
  app/                    # App Router — layout & entry page
  components/
    map/                  # MapBase, InfoModal, MapLegendPanel + layers/ & content/ per modul
    analytics/            # Analytics Dashboard & metric cards
    ui/                    # shadcn/ui primitives + Icon wrapper
    Sidebar.tsx             # Navigasi modul + Export Data
  lib/                    # Util raster (pane, color, query) & setup proj4
  constants/               # Single-source-of-truth data statis (kategori aset, luas tanah, dll)
public/
  data/                    # GeoJSON/GeoTIFF/Excel statis per modul
docs/
  requirements/            # PRD, TRD, SCOPE — dokumen visi & spesifikasi awal
  feature/                  # Dokumentasi implementasi & fix journey per perubahan
  prod/                      # Catatan migrasi tooling & langkah deploy
```

## Getting Started

Prasyarat: **pnpm** (jangan npm/yarn/bun untuk instalasi dependency).

```bash
pnpm install
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000).

Script lain:

```bash
pnpm build   # static export ke folder out/
pnpm start   # serve hasil build (next start)
pnpm lint
```

## Deployment

Static export (`output: "export"`, `images.unoptimized: true` di `next.config.ts`) — cocok buat hosting statis *zero-cost*, tanpa adapter runtime tambahan. Target: **Vercel** atau **Cloudflare Pages** (`wrangler.jsonc` sudah disetel, serve folder `out/`). Langkah lengkap: `docs/prod/deploy-steps.md`.

## Kualitas & Batasan Non-Fungsional

- **Mobile-first:** interaksi utama berbasis *tap*, bukan *hover* — perangkat desa & warga mayoritas akses lewat smartphone.
- **Performa:** total ukuran data spasial statis dijaga tetap ringan (disederhanakan lewat QGIS) demi *load time* cepat di jaringan mobile terbatas.
- **Light mode terkunci:** kontras tinggi demi keterbacaan di lapangan/luar ruangan; tanpa toggle dark mode by design.
- **Zero-maintenance:** tidak ada biaya hosting database bulanan — hanya perpanjangan domain tahunan.

## Dokumentasi Lanjutan

- `docs/requirements/PRD.md`, `TRD.md`, `SCOPE.md` — dokumen visi, spesifikasi teknis, dan batas MVP vs fitur lanjutan (dokumen perencanaan awal proyek; sebagian nama modul/file di sana adalah placeholder, sudah berevolusi seiring implementasi aktual — termasuk penambahan modul raster LST & Kesehatan Vegetasi Kelapa yang tidak ada di scope awal).
- `docs/feature/` — histori implementasi & proses debugging per fitur (modul raster, fix responsivitas, dll).
- `docs/feature/pre_production_todo.md` — daftar tugas polish sebelum rilis production.
- `docs/prod/` — catatan migrasi tooling (npm → pnpm) dan langkah deploy ke Vercel/Cloudflare Pages.
