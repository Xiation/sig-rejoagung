# **Product Requirement Document (PRD)**

## **Project: Platform Web GIS Interaktif Desa Rejoagung 2026**

**Author:** Klaster Saintek

**Collaborator:** Tim Geodesi & IT KKN-PPM UGM

**Tech Stack:** Next.js (Client-Side Rendering), Leaflet.js (`react-leaflet`), Static GeoJSON, Tailwind CSS, shadcn/ui.

**Deployment Target:** Vercel / Cloudflare Pages (Zero-Cost Hosting).

## **1. Analisis & Tujuan Produk (Product Vision)**

Membangun platform *Web GIS Dashboard* satu halaman (*single-page application*) yang mendigitalisasi hasil analisis spasial tim Geodesi menjadi peta interaktif yang inklusif dan mudah dipahami.

Platform ini dirancang sebagai **pusat informasi spasial terbuka Desa Rejoagung** yang dapat diakses oleh semua pihak (perangkat desa, masyarakat lokal, maupun pihak eksternal) guna menghadirkan akses data yang transparan dan terintegrasi.

### **Penyelarasan Tema KKN (Core Themes Mapping):**

- **Aset Desa & Fasum** → Tema: Pensasaran & Pengentasan Kemiskinan.
- **Potensi & UMKM Desa** → Tema: Peningkatan Ekonomi Masyarakat.
- **Aksesibilitas Sekolah** → Tema: Pencegahan Anak Putus Sekolah & Isu Sosial.

## **2. Pengguna Sistem & Dampak (User Personas & Impact)**

Platform ini dirancang untuk mengakomodasi kebutuhan seluruh elemen *stakeholder* Desa Rejoagung dengan pembagian fokus sebagai berikut:

- **User 1: Perangkat Desa Rejoagung (Kepala Desa / Kepala Dusun)**
    - **Kebutuhan:** Pemetaan riil aset desa, zonasi komoditas, dan visualisasi wilayah rawan akses pendidikan.
    - **Dampak Proker:** Menjadi **instrumen taktis** dalam merumuskan kebijakan berbasis data (*data-driven policy*) serta menentukan prioritas alokasi pembangunan desa secara presisi.
- **User 2: Masyarakat Umum & Pihak Eksternal (Warga Desa / Investor / Wisatawan)**
    - **Kebutuhan:** Akses cepat terhadap letak fasilitas umum, sebaran UMKM, dan potensi keunggulan lahan desa melalui jaringan internet.
    - **Dampak Proker:** Membangun **kesadaran spasial (*spatial awareness*)** warga terhadap kondisi lingkungannya, sekaligus menjadi media promosi digital yang interaktif bagi pihak luar.

## **3. Kebutuhan Fungsional (Functional Requirements)**

Platform ini mengadopsi sistem *Component-Driven* di React. Seluruh visualisasi dibagi menjadi **3 Modul Layer Utama** yang dapat dikontrol secara dinamis melalui UI *Sidebar*.

### **Matriks Fitur Web GIS**

| **ID Fitur** | **Komponen UI (shadcn/ui)** | **Deskripsi Fungsional** | **Sumber Data (Geodesi)** | **Target Tema KKN** |
| --- | --- | --- | --- | --- |
| **F-01** | `Layout & Sidebar` | Navigasi utama di sisi kiri untuk memilih modul peta, dilengkapi *toggle* pencahayaan (*Dark/Light Mode*). | - | Fondasi Sistem |
| **F-02** | `Map Viewer (Leaflet)` | *Canvas* peta dasar (*OpenStreetMap/Esri Satellite*) dengan fitur *zoom in/out* dan *bounds restriction* khusus area Desa Rejoagung. | - | Fondasi Sistem |
| **F-03** | `Module: Aset & Fasum` | Nampilin *custom marker* aset desa berdasarkan kategori (Pemerintahan, Pendidikan, Kesehatan, Keagamaan). Jika diklik, muncul *pop-up* informasi nama dan kondisi aset. | **Data Vektor (Point)** (`aset-desa.geojson`) | Pengentasan Kemiskinan |
| **F-04** | `Module: Potensi Desa` | Visualisasi wilayah sebaran sektor unggulan (Pertanian, Perkebunan Kelapa, UMKM, Wisata). Menampilkan statistik ringkas produksi di *card panel*. | **Data Vektor (Point/Polygon)** (`potensi-desa.geojson`) | Pengembangan Ekonomi |
| **F-05** | `Module: Akses Sekolah` | Menampilkan poligon radius jangkauan (*network analysis*) sekolah. Membedakan wilayah dengan aksesibilitas "Baik" (Hijau) dan "Perlu Perhatian" (Merah). | **Data Vektor (Polygon)** (`akses-sekolah.geojson`) | Pencegahan Anak Putus Sekolah |

## **4. Arsitektur Data (Static GeoJSON Schema)**

Karena sistem ini tidak menggunakan *database*, data spasial akan disimpan langsung sebagai file `.geojson` statis di dalam folder `/public/data/`.

### **Contoh Skema Data Komponen `aset-desa.geojson`:**

JSON

```
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [114.2435, -8.3124]
      },
      "properties": {
        "id": "fasum-001",
        "nama": "SDN 1 Rejoagung",
        "kategori": "Pendidikan",
        "fungsi": "Sekolah Dasar",
        "kondisi": "Baik",
        "keterangan": "Akses jalan utama beraspal"
      }
    }
  ]
}
```

## **5. Kebutuhan Non-Fungsional (Non-Functional Requirements)**

- **Kinerja (Performance):** Ukuran total file GeoJSON gabungan harus di bawah **5MB** melalui optimasi/simplifikasi geometri koordinat di QGIS agar *loading* di *browser* HP perangkat desa tidak lelet.
- **Aksesibilitas (Responsive Design):** UI *Sidebar* wajib menggunakan jenis *collapsible* (bisa disembunyikan) menggunakan komponen `shadcn/ui` agar peta tetap terlihat luas saat dibuka lewat HP/Tablet.
- **Batasan Teknis (Next.js SSR Bypass):** Seluruh modul peta *wajib* dipanggil menggunakan *Dynamic Import* dengan parameter `{ ssr: false }` untuk menghindari *error* `window is not defined`.
- **Kemandirian Sistem (Sustainability):** Web bersifat *zero-maintenance*. Tidak ada biaya *database* bulanan, cukup memperpanjang nama *domain* tahunan yang sudah dialokasikan.

## **6. Rencana Rilis & Alokasi Waktu (30-Day Sprint)**

- **Minggu 2:** Inisiasi repositori Next.js, instalasi Tailwind CSS + shadcn/ui, dan penyusunan struktur folder `/public/data/`.
- **Minggu 3:** Implementasi `react-leaflet`, *bypassing* SSR, dan pembuatan komponen *Sidebar Filter Layout*.
- **Minggu 4:** Pengisian (*Ingestion*) data GeoJSON asli dari anak Geodesi ke folder proyek dan koding *logic pop-up/interactivity*.
- **Minggu 5:** Tes performa menggunakan sinyal seluler di desa, *bug fixing*, dan *deployment* ke Vercel/Cloudflare.
- **Minggu 6:** Serah terima platform, dokumentasi panduan, dan sosialisasi ke perangkat desa Rejoagung.