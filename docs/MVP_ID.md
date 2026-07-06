
# **Dokumen Manajemen Lingkup: MVP vs Feature Scope**

**Project:** Web GIS Interaktif Desa Rejoagung

**Kriteria Pengambilan Keputusan:** Efisiensi waktu (30 Hari Efektif), Batasan Infrastruktur (*Front-End Only*), dan Kegunaan Lapangan (Perangkat Desa & Warga).

## **1. Cakupan MVP (Minimum Viable Product) – *Must-Have***

Fitur-fitur di bawah ini adalah **harga mati** yang harus jalan di Minggu 4. Jika salah satu fitur ini absen, produk dianggap belum siap rilis.

### **M-01: Render Peta Dasar Terbatas (*Bounded Base Map*)**

- **Deskripsi:** Nampilin peta dasar (*OpenStreetMap* atau *Esri Satellite*) yang dikunci (*bounds restricted*) hanya di koordinat Desa Rejoagung.
- **Alasan:** Biar perangkat desa atau warga nggak tersesat nge-*scroll* peta sampai ke luar Banyuwangi atau ke luar pulau.

### **M-02: Multi-Layer Static Data Ingestion (Sesuai Karakteristik GeoJSON)**

- **Deskripsi:** Sistem harus bisa membaca dan merender 3 jenis struktur data spasial yang berbeda dari folder `/public/data/`:
    1. **Aset Desa & Fasum:** Dirender sebagai **Data Vektor Point** (Menggunakan *Marker* bawaan Leaflet).
    2. **Potensi Desa:** Dirender sebagai **Data Vektor Point** (untuk lokasi spesifik UMKM) ATAU **Polygon** (untuk zonasi area perkebunan kelapa/pertanian).
    3. **Aksesibilitas Sekolah:** Dirender sebagai **Data Vektor Polygon** (Hasil *network analysis* jangkauan area berupa poligon transparan dengan warna merah/hijau).

### **M-03: Layer Toggle Sidebar Control (Navigasi Utama)**

- **Deskripsi:** Menggunakan komponen `Sidebar` dari shadcn/ui berupa *checkbox* atau *radio button* untuk menyalakan/mematikan (*toggle*) masing-masing *layer* data di atas peta (Aset, Potensi, Akses Sekolah).
- **Alasan:** Supaya peta tidak bertumpuk berantakan. User bisa fokus melihat satu isu saja (misal: hanya ingin melihat area rawan putus sekolah).

### **M-04: On-Click Information Display (Pop-up Responsif HP)**

- **Deskripsi:** Menampilkan informasi detail objek berupa jendala *Pop-up* bawaan Leaflet ketika *marker* atau poligon **DI-KLIK** (bukan di-hover).
- **Alasan Mobile-First:** Perangkat desa bakal lebih banyak akses web ini via HP. Di layar sentuh HP, **tidak ada fungsi *hover*** (kursor melayang). Jadi, interaksi berbasis **Klik/Sentuh (*Tap*)** wajib dijadikan MVP utama, sementara *hover* diturunkan skalanya jadi fitur opsional.

## **2. Cakupan Fitur Tambahan – *Nice-to-Have (Post-MVP)***

Fitur-fitur ini baru boleh lu sentuh di Minggu 5 **HANYA JIKA** semua fungsi MVP di atas sudah 100% stabil dan bebas *bug*.

### **F-01: On-Hover Styling Highlight (Desktop Only)**

- **Deskripsi:** Ketika kursor laptop melewati (*hover*) sebuah poligon potensi atau jangkauan sekolah, batas poligon akan menebal atau berubah warna sedikit (*highlighting effect*), lalu kembali normal saat kursor pergi (*resetStyle*).
- **Catatan:** Keren buat presentasi di depan dosen/perangkat desa via laptop, tapi abaikan dulu kalau mengganggu performa rendering.

### **F-02: Marker Clustering (Optimasi Visual Aset)**

- **Deskripsi:** Menggunakan pustaka tambahan `leaflet.markercluster` biar kalau ada puluhan titik fasum yang berdekatan, mereka otomatis menggumpal jadi satu lingkaran angka (misal: Angka "5", kalau di-zoom baru pecah jadi 5 marker).
- **Catatan:** Masuk *backlog* karena data titik KKN biasanya tidak sampai ratusan, jadi tanpa klasterisasi pun peta masih relatif bersih.

### **F-03: Global Statistics Floating Card Panel**

- **Deskripsi:** Menampilkan *floating panel* kecil (pake `shadcn/ui card`) di pojok peta yang menampilkan statistik total angka, contoh: *"Total UMKM Terdata: 12"*, atau *"Persentase Wilayah Akses Sekolah Rendah: 15%"*.
- **Catatan:** Data infografis ini sifatnya statis, jadi nilainya opsional dibanding visualisasi petanya sendiri.

### **F-04: Dark / Light Mode Switcher**

- **Deskripsi:** Fitur pengubah tema visual keseluruhan *dashboard* lewat shadcn/ui theme provider.
- **Catatan:** Kosmetik murni. Gunakan tema *Light Mode* yang kontras tinggi sebagai *default* agar perangkat desa gampang baca peta di siang hari.

## **3. Matriks Keputusan Taktis (Rangkuman Catatan SE Lu)**

| **Fitur** | **Prioritas** | **Kompleksitas Teknis** | **Status** | **Tindakan** |
| --- | --- | --- | --- | --- |
| **Peta Terkunci & Base Map** | **Must-Have** | Rendah | MVP | Selesaikan di awal Minggu 3. |
| **Layer Toggle Sidebar** | **Must-Have** | Sedang | MVP | Integrasikan `useState` React dengan layer Leaflet. |
| **Pop-up On-Click (Tap)** | **Must-Have** | Rendah | MVP | Gunakan fungsi `layer.bindPopup()` bawaan Leaflet. |
| **On-Hover Visual Effect** | *Nice-to-Have* | Sedang | Post-MVP | Kerjakan hanya jika waktu sisa di Minggu 5. |
| **Dark/Light Mode Theme** | *Nice-to-Have* | Rendah | Post-MVP | Skip jika *timeline* mepet. |