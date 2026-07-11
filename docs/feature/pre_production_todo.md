# Pre-Production To-Do List

Dokumen ini berisi daftar tugas penyempurnaan ( *polish* ) dan penambahan fitur terakhir sebelum Web GIS Desa Rejoagung dirilis secara resmi ke *production*.

## 1. Penambahan Data & Visualisasi Produksi Pertanian
- [ ] **Rekap Data Produksi:** Kumpulkan dan masukkan data hasil produksi (dalam satuan **ton**) untuk komoditas:
  - Tanaman Perkebunan
  - Tanaman Pangan
  - Buah-buahan
  - Sayur-sayuran
- [ ] **Visualisasi Grafik Batang:** Integrasikan komponen visualisasi (*Bar Chart*) untuk menampilkan data produksi tersebut ke dalam modul *Analytics Dashboard*, tepatnya diletakkan di dalam file `src/components/analytics/LandPotentialMetrics.tsx`.

## 2. Sentralisasi Data (Single Source of Truth)
- [ ] **Migrasi Data Hardcoded:** Ekstrak semua data yang saat ini masih *hardcoded* di dalam komponen UI (seperti data pengayaan `SekolahModal`, konstanta di `EducationMetrics`, dll) ke dalam bentuk file *Single Source of Truth* terpisah.
- [ ] **Migrasi Macro KPIs:** Pindahkan `MACRO_KPIS` dari `src/components/analytics/analyticsDashboard.tsx` ke folder SSOT (`src/constants/`).
- [ ] **Migrasi Data Sekolah (Master Data):** Pindahkan dan satukan `SEKOLAH_DATA` (dari `SekolahModal`) dan data dari `EducationMetrics` ke dalam satu struktur Master Data terpusat (`src/constants/`).
- [ ] **Konsolidasi Logika Kategori Aset:** Satukan fungsi `deriveCategory` di `AsetfasumModal.tsx` dengan `categoryData` di `assetsSummary.ts` agar menggunakan satu konfigurasi kategori global (berisi nama, ikon, dan warna tema).
- [ ] **Konsolidasi Warna Sekolah:** Satukan konfigurasi warna jenjang sekolah (`JENJANG_COLORS` di `SekolahModal` dan warna grafik di `tierData` pada `EducationMetrics`) menjadi satu konfigurasi global.
- [ ] **Migrasi Data Land Potential Metrics:** Pindahkan konstanta `resourceFrequency`, `threats`, dan `executiveSummary` dari `src/components/analytics/LandPotentialMetrics.tsx` ke folder SSOT.
- [ ] **Format Penyimpanan (TS Objects):** Simpan data statis dalam bentuk file `.ts` murni (TypeScript Objects) di folder `src/constants/` agar tetap memiliki *type-safety* dan dimuat tanpa harus *parsing* JSON manual.
- [ ] **Pembuatan Service Layer (Jembatan API):** Buat folder khusus (misal: `src/services/api.ts`) yang berisi fungsi-fungsi *asynchronous* (`async function`) yang bertugas mengembalikan (*return*) data dari `src/constants/` (simulasi proses *fetch* data).
- [ ] **Future-Proofing Komponen:** Ubah komponen UI agar memanggil fungsi dari *Service Layer* secara *asynchronous* (misal pakai `useEffect` atau server components). Ini mempersiapkan transisi mulus di mana gaya penulisan *fetch* data sudah terbentuk, sehingga siap jika nanti website migrasi menjadi *full-stack* dengan *backend* sungguhan.

## 3. Perbaikan UI/UX: Konflik InfoModal & TopAppBar
- [ ] **Investigasi Isu Overlap:** Atasi masalah di mana `PotensiModal` (karena kontennya sangat padat) memanjang ke atas hingga menabrak `TopAppBar`.
- [ ] **Opsi Resolusi (Pilih salah satu/kombinasi):**
  - **Opsi A (Resize Modal):** Mengecilkan sedikit ukuran modal (misalnya menyesuaikan `max-h` atau padding) agar tidak menabrak bar atas.
  - **Opsi B (Hide TopBar):** Menghilangkan/menyembunyikan `TopAppBar` secara dinamis ketika pengguna masuk ke dalam "Interactive Map Mode" agar ruang layar (*screen estate*) untuk peta dan modal menjadi lebih luas.

## 4. Optimasi Responsivitas (Mobile & Tablet)
- [ ] **Mobile/Tablet Layout:** Rombak dan sesuaikan layout utama web GIS yang saat ini masih terlalu *desktop-centric*.
- [ ] **Elemen Kritis untuk Responsivitas:**
  - **Sidebar:** Buat sistem *hamburger menu* atau *bottom sheet* untuk layar kecil (karena saat ini lebarnya tetap 18rem).
  - **Analytics Bento Grid:** Pastikan semua *card* KPI dan grafik Recharts runtuh (*collapse*) menjadi 1 kolom (`grid-cols-1`) di layar *mobile*.
  - **Peta & Overlay:** Pastikan `InfoModal`, *Legend*, dan kontrol zoom Leaflet tetap proporsional, bisa di-*scroll*, dan mudah ditutup menggunakan jari (layar sentuh).

## 5. Penambahan Placeholder Gambar pada InfoModal
- [ ] **Aset & Fasum Modal (`AsetfasumModal.tsx`):** Tambahkan elemen *placeholder* gambar di bagian atas atau di dalam *grid* modal untuk menampilkan foto kondisi nyata dari fasilitas desa (misal: foto balai desa, posyandu, dll).
- [ ] **Sekolah Modal (`SekolahModal.tsx`):** Tambahkan juga elemen *placeholder* gambar serupa untuk merepresentasikan kondisi fisik bangunan sekolah.
- [ ] **Desain & Layout:** Pastikan *placeholder* ini memiliki aspek rasio yang pas (contoh: 16:9), desain yang menyatu dengan *style* M3, dan *fallback* visual jika foto tidak tersedia (misal: *skeleton loader* atau ilustrasi *default*).
**CATATAN** Gambar hanya diletakkan pada aset yang emang terdapat fotonya saja

## 6. Revisi Data Geospasial (GeoJSON)
- [ ] **Update Data Spasial:** Lakukan penyesuaian dan penggantian pada file-file `.geojson` akibat adanya perubahan terbaru pada data geospasial lapangan.
- [ ] **Lokasi Pembaruan:** Pastikan file di dalam direktori `public/data/akses/`, `public/data/fasum/`, dan `public/data/potensi/` seluruhnya terbarui ke versi mutakhir.
