# Context & Architecture Document

**Project:** Interactive Web GIS Platform for Rejoagung Village 2026
**Tech Stack:** Next.js (App Router), React-Leaflet, Tailwind CSS v4, shadcn/ui, Recharts.
**Paradigm:** Zero-Backend, Client-Side Rendering (CSR), Component-Driven Architecture.

Dokumen ini adalah pedoman teknis mendalam yang memetakan arsitektur proyek, kegunaan spesifik file dan komponen, struktur data, serta implementasi *Design System* (Material Design 3). Dokumen ini berfungsi sebagai referensi pusat yang menghubungkan:
*   [Product Requirement Document (PRD)](./PRD.md)
*   [Technical Requirement Document (TRD)](./TRD.md)
*   [Design System Guidelines](../DESIGN/DESIGN_SYS.md)

---

## 1. Arsitektur Komponen & UI (Component Architecture)

Aplikasi dibangun menggunakan pola **Bento Shell Layout** (Sidebar Navigasi Tetap + TopAppBar Tetap + Area Konten Dinamis).

### A. Layout Utama (Shell)
*   `src/app/page.tsx`: *Stateful Controller Hub*. Mengelola state `activeModule` (`"dashboard"`, `"aset"`, `"potensi"`, `"sekolah"`). Merender `Sidebar`, `TopAppBar`, dan area konten yang beralih antara `AnalyticsDashboard` atau `MapViewer`.
*   `src/components/Sidebar.tsx`: Lebar tetap 288px (18rem). Berisi menu navigasi dengan pengelompokan (Overview vs Modul Peta).
*   `src/components/layout/TopAppBar.tsx`: Tinggi tetap 64px (4rem). Menampilkan konteks modul yang sedang aktif beserta *badge* status.

### B. Modul Analytics Dashboard (`src/components/analytics/`)
Menggunakan konsep **Composite Bento Grid** untuk meringkas data kualitatif dan kuantitatif.
*   `analyticsDashboard.tsx`: Wrapper utama. Menyusun *Macro Scorecards* di baris pertama (3 kolom) yang dilengkapi dengan *watermark icon* transparan (20% opacity) di pojok kanan bawah kartu.
*   `AssetMetrics.tsx`, `EducationMetrics.tsx`, `LandPotentialMetrics.tsx`: Kartu *Composite Chart* yang merender grafik Recharts (Bar, Pie/Donut). Menggunakan warna *chart* semantik dari M3 (misal `--chart-1` untuk warna utama).
*   `customTooltip.tsx`: Tooltip kustom untuk Recharts agar seragam dengan estetika kartu M3.

### C. Modul Peta & Web GIS (`src/components/map/`)
*   `MapViewer.tsx`: Memuat `MapBase` secara dinamis (`next/dynamic` dengan `ssr: false`) untuk mencegah error *Hydration* dari Leaflet.
*   `MapBase.tsx`: Kanvas utama `MapContainer`. Menentukan *basemap* Esri Satellite dan memaksakan batas *panning* ke poligon desa (Batas Administrasi).
*   **Layer Data (`/layers/`)**: 
    *   `AsetfasumLayer.tsx`, `SekolahLayer.tsx`, `PotensiLayer.tsx`.
    *   Tugas: Fetch file `.geojson`, render ke Leaflet (menggunakan `CircleMarker` atau `GeoJSON` poligon), menangkap *event click*, menyuntikkan koordinat fitur (`_lat`/`_lng`), dan membuka `InfoModal`.
*   **Dialog Detail (`InfoModal.tsx` & `/content/`)**: 
    *   `InfoModal.tsx`: Wrapper modal pintar bergaya M3 (max-w-2xl, backdrop blur) yang membungkus komponen konten.
    *   `AsetfasumModal.tsx`, `SekolahModal.tsx`: Layout spesifik untuk poin lokasi (2 kolom: Profil & Info Spasial).
    *   `PotensiModal.tsx`: Layout data berat (Heavy-data) untuk poligon dusun, menggunakan *Error Container* (Ancaman SDA) dan *Success Container* (Rekomendasi) untuk wawasan *actionable*.

### D. UI Primitives (`src/components/ui/`)
*   `Icon.tsx`: Wrapper untuk ikon **Material Symbols Outlined**. Mendukung ukuran custom, state `filled`, dan modifikasi `style` sebaris (misal untuk menyamakan warna ikon dengan jenjang sekolah).
*   `badge.tsx`, `button.tsx`, `card.tsx`: Komponen dasar M3.

---

## 2. Struktur Data GeoJSON (`public/data/`)

Sistem menggunakan agregasi data sisi klien (Zero-Database). Semua data geospasial disajikan sebagai file statis `.geojson` WGS 84 (EPSG:4326). Data dipisah secara modular:

*   **`akses/` (Modul Aksesibilitas Sekolah):**
    *   `Fasilitas Pendidikan.geojson` (Titik sekolah).
    *   `Service Area 10 Menit.geojson` dsb. (Poligon *Network Analysis*).
*   **`fasum/` (Modul Aset Desa):**
    *   `Pemerintahan.geojson`, `Ibadah.geojson`, `Pendidikan.geojson`.
    *   Properti GeoJSON yang diekspektasikan: `NAMOBJ` (Nama), `REMARK` (Keterangan), `FGSGOV` / `FGSIBD` (Fungsi/Kategori). Jika data *sparse* (kosong), UI akan menampilkan *fallback* kustom.
*   **`potensi/` (Modul Potensi Lahan):**
    *   `Potensi Dusun.geojson`. Memuat data kaya tiap dusun (Jenis Tanah, Komoditas, Produksi Padi, Ancaman, Rekomendasi).

---

## 3. Implementasi Design System (M3)

Aplikasi ini dipandu oleh [DESIGN_SYS.md](../DESIGN/DESIGN_SYS.md).

*   **Semantic Color Tokens (di `globals.css`):**
    *   `--primary` (`#059669`): Warna hijau *brand* Rejoagung.
    *   `--surface-container-low`: Warna *background* utama kanvas.
    *   `--primary-container` & `--on-primary-container`: Untuk state aktif (menu Sidebar).
*   **Typography Utilities:**
    *   `display-metric`: Angka metrik raksasa (`text-3xl font-extrabold`).
    *   `headline-lg`: Judul seksi (`text-xl font-bold`).
    *   `label-caps`: Teks metadata kecil & kapital (`text-[10px] tracking-wider`).
    *   `body-base`, `micro-copy`: Teks pendukung standar.
*   **Interaksi UI:** Modal menggunakan animasi M3 (`animate-in fade-in zoom-in-95`). Komponen tidak bergantung pada *hover* karena mengutamakan sentuhan (Mobile-First/Touch).

---
**Status Dokumen:** *Up-to-date* (Tahap Pre-Production).
