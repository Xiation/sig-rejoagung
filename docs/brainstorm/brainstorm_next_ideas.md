# Brainstorm: Ide Lanjutan (belum di-plan, sekadar catatan)

Dicatat malam ini biar gak ilang — belum dibahas detail, belum ada keputusan teknis apapun. Lanjut bahas pas sesi berikutnya.

## 1. Master data / list data per jenis fasilitas umum desa
- Detail kecil tambahan — belum jelas bentuknya kayak apa (list terpisah di luar modal? tab baru? section baru di dashboard?).
- Kemungkinan overlap sama `assetsSummary.ts`/`categoryData` yang udah ada — perlu dicek dulu apa ini extend dari situ atau data/view baru sama sekali.

## 2. Modal Potensi Lahan — jauh lebih detail (analisis)
- `PotensiModal.tsx` sekarang udah lumayan lengkap (profil geografis, inventaris komoditas, ancaman/rekomendasi) — user mau "informasi analisis lebih detail", belum spesifik analisis kayak apa (perbandingan antar dusun? trend/grafik dalam modal? skor komposit?).
- Perlu digali lagi: analisis berbasis data apa yang mau ditambah, dan sumber datanya dari mana (`Potensi_Dusun.geojson` udah cukup atau butuh data baru).

## 3. Link Google Maps di modal (khusus modul Fasum & Aksesibilitas Sekolah)
- Tiap fasilitas/sekolah punya `_lat`/`_lng` (Fasum) atau alamat (`SEKOLAH_DATA.alamat`) — cukup buat generate link `https://www.google.com/maps?q={lat},{lng}` atau search-by-address.
- Kemungkinan paling gampang dieksekusi dari 3 ide ini — tinggal tambah 1 link/button di `AsetfasumModal.tsx` & `SekolahModal.tsx`, gak butuh data baru.
- Perlu putusin: pakai koordinat (lebih presisi, tapi Fasum manual kayak Olahraga toggle belum tentu punya `_lat`/`_lng` konsisten) atau alamat teks (lebih universal tapi kurang presisi buat titik tanpa alamat jelas).

## 4. Raster layer — Land Surface Temperature & kesehatan tanaman kelapa
- Beda kelas dari 3 ide di atas — ini raster (citra/analisis spasial), bukan vector GeoJSON kayak layer yang udah ada (Aset, Sungai, Jalan, dll). Butuh pendekatan render beda di Leaflet (`ImageOverlay`/tile raster, bukan `<GeoJSON>`).
- Land Surface Temperature (LST) & kesehatan tanaman kelapa (kemungkinan indeks vegetasi kayak NDVI) — belum jelas sumber datanya dari mana (citra satelit apa, siapa yang proses, format file apa: GeoTIFF? PNG georeferenced?).
- Paling kompleks dari semua ide sejauh ini — perlu digali proses/pipeline datanya dulu sebelum bisa mikir implementasi di kode.

## Status
Ide mentah — belum di-plan, belum ada keputusan desain/teknis. Lanjut bahas besok, pecah jadi plan per-item pas mulai dikerjain.
