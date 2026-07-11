# Arsitektur Map Component & Isolasi Modul Spasial

Berdasarkan dokumen PRD, TRD, dan SCOPE, aplikasi Web GIS Desa Rejoagung wajib menerapkan **Component-Driven Architecture**. Karena setiap modul memiliki karakteristik render spasial yang sangat berbeda (Point vs Polygon, Marker vs CircleMarker, serta logika fetch yang berbeda-beda), maka *logic* peta harus dipecah menjadi *Sub-Components* (Layers) yang modular.

Hal ini mencegah `MapComponent.tsx` menjadi *spaghetti code* raksasa yang sulit dikelola.

---

## 1. Struktur Folder (Refactoring Plan)

Struktur komponen peta akan dipecah menjadi seperti ini:

```text
src/components/map/
├── MapViewer.tsx        (Dynamic import wrapper - menghindari error SSR 'window is not defined')
├── MapBase.tsx          (Komponen utama penganti MapComponent: memuat <MapContainer>, Basemap, dan Batas Desa)
├── InfoModal.tsx        (Komponen UI Overlay untuk detail data)
└── layers/              (Folder baru untuk modul-modul spesifik)
    ├── AsetLayer.tsx    (Modul 1: Fetch Fasum & Aset, render CircleMarker warna-warni)
    ├── PotensiLayer.tsx (Modul 2: Fetch Potensi Lahan, render Polygons Choropleth)
    └── SekolahLayer.tsx (Modul 3: Fetch Data Sekolah + Polygon Network Analysis)
```

---

## 2. Pembagian Tanggung Jawab (Separation of Concerns)

### A. `MapBase.tsx` (Pondasi Peta)
Berperan sebagai kanvas utama. Bertanggung jawab murni pada hal-hal global yang tidak berubah saat user berpindah menu:
- Menjalankan `<MapContainer>` dengan default *center* dan pembatasan *zoom*.
- Memuat `<TileLayer>` (mode satelit Esri World Imagery).
- Memuat `batas administrasi.geojson` **satu kali** saat komponen di-mount.
- Mengeksekusi *helper* kamera (`map.setMaxBounds`) agar pergerakan map terkunci hanya di wilayah desa (Sesuai parameter *MVP M-01*).
- Me-render *garis* batas desa statis tanpa *fill*.
- Menggunakan *Conditional Rendering* untuk meng-inject sub-komponen layer berdasarkan *state* `activeModule`.

```tsx
// Ilustrasi di MapBase.tsx
<MapContainer>
  <TileLayer url="...Esri..." />
  <BatasDesaLayer />
  
  {/* Layer Injections */}
  {activeModule === "aset" && <AsetLayer />}
  {activeModule === "potensi" && <PotensiLayer />}
  {activeModule === "sekolah" && <SekolahLayer />}
</MapContainer>
```

### B. `layers/*Layer.tsx` (Modul Independen)
Setiap file di dalam folder `layers/` diisolasi dan bertanggung jawab mandiri untuk:
- Mengambil (*fetch*) file GeoJSON yang **hanya dibutuhkan oleh modul tersebut**.
- Mengelola state `geoData` lokalnya sendiri.
- Mengelola state interaksi klik (`selectedAsset` dan `isModalOpen`) beserta `<InfoModal>` nya masing-masing.
- Memegang logika *styling* khusus modul tersebut (contoh: fungsi `getMarkerStyle` untuk menentukan warna Point).

---

## 3. Alur Kerja (Workflow) Komponen

**Contoh Interaksi di Modul Aset & Fasum (`AsetLayer.tsx`)**
1. Saat user klik tombol "Aset & Fasum" di Sidebar, `page.tsx` mengubah state `activeModule` menjadi `"aset"`.
2. Komponen `MapBase.tsx` mendeteksi ini dan me-render `<AsetLayer />`.
3. Begitu di-mount, `useEffect` di dalam `<AsetLayer />` mulai men-fetch `pemerintah.geojson` dan `tempat ibadah.geojson`.
4. (Penting) Saat data di-merge, setiap fitur ditambahkan label asal file (`_source`) ke dalam `properties`-nya.
5. Leaflet me-render data menggunakan properti `<GeoJSON pointToLayer={...} />`.
6. Logika *styling* membaca *tag* `_source` dan mengubah titik default menjadi `CircleMarker` berwarna Oranye (Pemerintahan) atau Biru (Ibadah).
7. User melakukan klik (Tap) pada titik tersebut. Event `onEachFeature` memicu pembaruan state lokal di `AsetLayer`, yang akhirnya membuka `<InfoModal />` dengan properti yang tepat.
