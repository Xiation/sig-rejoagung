# Pre-Production To-Do List

Dokumen ini berisi daftar tugas penyempurnaan ( *polish* ) dan penambahan fitur terakhir sebelum Web GIS Desa Rejoagung dirilis secara resmi ke *production*.

## 1. Penambahan Data & Visualisasi Produksi Pertanian
- [ ] **Rekap Data Produksi:** Kumpulkan dan masukkan data hasil produksi (dalam satuan **ton**) untuk komoditas:
  - Tanaman Perkebunan
  - Tanaman Pangan
  - Buah-buahan
  - Sayur-sayuran
- [ ] **Visualisasi Grafik Batang:** Buat komponen visualisasi (*Bar Chart*) untuk menampilkan data produksi tersebut (bisa diletakkan di komponen Analytics atau di dalam `PotensiModal` tapi kayaknya ga mungkin di potensi modal).

## 2. Sentralisasi Data (Single Source of Truth)
- [ ] **Migrasi Data Hardcoded:** Ekstrak semua data yang saat ini masih *hardcoded* di dalam komponen UI (seperti data pengayaan `SekolahModal`, konstanta di `EducationMetrics`, dll) ke dalam bentuk file *Single Source of Truth* terpisah.
- [ ] **Format Penyimpanan:** Tentukan format penyimpanan (misalnya file `.json` di folder `public/data/` atau `.ts` terpusat di `src/constants/`).
- [ ] **Kemudahan Update:** Pastikan struktur data dibuat sedemikian rupa sehingga jika ada data lapangan KKN yang baru lengkap, pembaruan hanya perlu dilakukan di satu file sumber tersebut tanpa menyentuh kode komponen React.

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
