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

**CATATAN:** Service Layer & refactor komponen ke *async fetch* (sebelumnya subpoin di sini) sengaja ditunda ke **Poin 9**, dikerjakan *setelah* web GIS live di production — lihat rasionalnya di sana.

## 3. Perbaikan UI/UX: Konflik InfoModal & TopAppBar
- [x] **Investigasi Isu Overlap:** Root cause ditemukan di `InfoModal.tsx`, bukan di konten `PotensiModal.tsx`: backdrop pakai `fixed inset-0` (full-viewport, gak reserve ruang `TopAppBar`) + `z-[9999]` lebih tinggi dari `TopAppBar` (`z-40`). Pas konten modal berat (terutama `PotensiModal`) mendekati cap `max-h-[90vh]`, top edge modal masuk ke zona 64px milik `TopAppBar` dan tergambar di atasnya.
- [x] **Opsi Resolusi:** **Opsi A (Resize Modal)** — backdrop diganti `top-16` (bukan `inset-0`) supaya area centering otomatis exclude 64px `TopAppBar`, dan `max-h` modal diganti dari `90vh` ke `calc(100vh-6rem)` (pas sama sisa ruang backdrop). Modal gak akan pernah nabrak `TopAppBar` lagi, seberapa berat pun kontennya.

## 4. Optimasi Responsivitas (Mobile & Tablet)
- [x] **Mobile/Tablet Layout:** Root shell (`page.tsx`) sebelumnya pakai inline style fixed (`marginLeft: 18rem`, `left: 18rem`) tanpa breakpoint sama sekali — pecah total di layar <1024px. Diganti Tailwind responsive classes (`ml-0 lg:ml-72`, `left-0 lg:left-72`).
- [x] **Elemen Kritis untuk Responsivitas:**
  - **Sidebar:** Diimplementasi sebagai *hamburger menu + slide-in drawer* (bukan bottom sheet — konsisten sama pola `InfoModal.tsx` yang udah ada: fixed backdrop + `translate-x` animasi). Hamburger button di `TopAppBar.tsx` (`lg:hidden`), state `sidebarOpen` di-lift ke `page.tsx`. Auto-close pas pilih modul di mobile.
  - **Analytics Bento Grid:** Dicek — sudah mobile-first by default (`grid-cols-1 md:grid-cols-3`, `col-span-12 xl:col-span-6` dsb selalu collapse ke 1 kolom di breakpoint terkecil). Gak ada perubahan diperlukan.
  - **Peta & Overlay:** Map view wrapper (`page.tsx`) diganti full-bleed di mobile (`lg:p-6 lg:rounded-xl lg:border`, borderless/padless di bawah `lg:`) sesuai spek TRD mobile ("100vw/100vh"). `InfoModal` sudah scrollable+touch-friendly dari fix poin 3. Leaflet default zoom control (26px) di-enlarge ke 40px via CSS media query (`globals.css`, `max-width:1023px`) buat memenuhi touch-target minimum. Custom Legend/Control Cluster di TRD belum pernah diimplementasi di kode — di luar scope (bukan regresi).

## 5. Penambahan Gambar Kondisional pada InfoModal
- [x] **Aset & Fasum Modal (`AsetfasumModal.tsx`):** Blok gambar (`next/image`, aspect 16:9, `rounded-xl`) dirender setelah header/divider, sebelum grid 2-kolom — lookup dari `ASET_FOTO` (`src/constants/asetFoto.ts`, keyed by `NAMOBJ`).
- [x] **Sekolah Modal (`SekolahModal.tsx`):** Pola sama, lookup dari `detail.foto` (field opsional baru di `SekolahDetail`, `src/constants/sekolahData.ts`).
- [x] **Desain & Layout:** Aspect ratio 16:9 (`aspect-video`), `rounded-xl` konsisten M3. **Tidak ada fallback/skeleton** — kalau data foto gak ada, blok gambar gak dirender sama sekali (bukan "always show something"), modal 100% identik sama sebelum perubahan. Ini re-scope dari draft awal atas keputusan eksplisit user.
**CATATAN:** `ASET_FOTO` & semua entri `SEKOLAH_DATA` masih kosong (belum ada foto asli) — infrastruktur/mekanisme udah siap, tinggal isi path foto + taruh file gambar di `public/images/aset/` atau `public/images/sekolah/` begitu foto tersedia.

## 6. Revisi Data Geospasial (GeoJSON)
- [x] **Update Data Spasial:** Penyesuaian dan penggantian file-file `.geojson` sudah dilakukan (data lapangan terbaru).
- [x] **Lokasi Pembaruan:** File di `public/data/akses/`, `public/data/fasum/`, dan `public/data/potensi/` sudah diperbarui ke versi mutakhir.

## 7. Uji Coba Deploy ke Vercel/Cloudflare
**Rasional:** Sebelum lanjut revisi data detail (Poin 8), validasi dulu build/deploy pipeline hasil migrasi pnpm+bun (`docs/prod/migration-steps.md`) beneran jalan di hosting nyata — biar kalau ada masalah deployment, ketauan lebih awal, gak numpuk sama kerjaan revisi data.

- [x] **Push hasil migrasi pnpm+bun ke remote:** `pnpm-lock.yaml`, `package.json` (field `packageManager`), `.gitignore` sudah ke-commit & ke-push. `package-lock.json` sudah gak ada di repo.
- [x] **Pilih target awal:** Cloudflare (via Workers Static Assets — bukan Pages, lihat `docs/prod/cloudflare-deploy-journey.md` buat kronologi lengkap kenapa pivot dari Pages ke Workers).
- [x] **Connect repo & verifikasi build di platform:** Build sukses di Cloudflare CI (`pnpm install` + `pnpm run build` + `wrangler deploy`), bukan cuma lokal.
- [x] **Smoke-test hasil deploy live:** Deploy sukses, live di `gis-rejoagung.<account>.workers.dev`. Custom domain (`sig-rejoagung.com`, beli di Hostinger, lagi proses nameserver ke Cloudflare) itu polish terpisah — gak menghalangi deploy core-nya, boleh nyusul kapan aja.
- [x] **Catat hasil:** Semua troubleshooting (11 masalah, dari `ERR_PNPM_IGNORED_BUILDS` sampe token permission & Worker-vs-Pages mismatch) didokumentasikan lengkap di `docs/prod/cloudflare-deploy-journey.md`.

## 8. Revisi Data Detail Modal, Aset, & Foto (Dampak Domino Revisi Spasial + Data Baru dari Temen)
- [x] **Sinkronisasi `assetsSummary.ts` dari `Database_Aset_Desa_Rejoagung - RINGKASAN.csv`:** Data direvisi lagi oleh temen — total aset naik dari 22 → **44**, total luas 21.854 → **44.768 m²**. `src/constants/assetsSummary.ts` udah diupdate penuh (`assetsSummary`, `categoryData`, `ownershipData`) pakai angka terbaru.
  - **Ditemukan bug perhitungan di CSV sumber:** kolom `%` di `RINGKASAN.csv` masih pakai pembagi total LAMA (22), bukan total baru (44) — keliatan dari `Fasilitas Keagamaan` yang tertulis `122.7%` (mustahil, harusnya maks 100%). Semua nilai `persen` di `assetsSummary.ts` **dihitung ulang manual** (`jumlah / 44 * 100`), bukan disalin mentah dari CSV. Detail hitungan ada di comment header file.
  - Angka final: Pendidikan 14 aset/31.8%, Keagamaan 27 aset/61.4%, Olahraga 2 aset/4.5%, Pemerintahan 1 aset/2.3%. Ownership: Hak Milik 25/56.8%, Wakaf 8/18.2%, Pakai 1/2.3%, Kosong 4/9.1%, Belum Verifikasi 6/13.6%. Belum Diverifikasi (macro stat) 7 aset.
- [x] **Sumber data lengkap ditemukan:** File yang bener adalah `public/data/Database_Aset_Desa_Rejoagung - INVENTARISASI ASET.csv` (44 baris, cocok persis sama `RINGKASAN.csv` — luas Pendidikan sum manual = 10.118 m², sama persis). File `public/data/database/INVENTARISASI_ASET.csv` yang lama (22 baris) **outdated, bukan sumber acuan lagi**.
- [x] **Cross-check GeoJSON `fasum/` vs CSV — investigasi selesai, ketemu 4 gap data (bukan bug kode):**
  1. **Olahraga: 0 fitur di GeoJSON vs 2 di CSV** (RSC Sport Center, Lapangan Rejoagung). Gak ada `Olahraga.geojson` sama sekali di `public/data/fasum/` — 2 aset ini gak bakal muncul di peta sampai layer-nya dibuat. `deriveCategory` udah siap nangkep kategori ini begitu datanya ada.
  2. **Ibadah.geojson kelebihan 10 fitur** (37) dibanding CSV Fasilitas Keagamaan (27): 5 masjid/mushola bernama belum ada di CSV (`Al-Hikmah`, `Miftakhul Huda`, `Sunan Ampel`, `Miftahul Qulub`, `Nur Akbar`), **4 fitur "Mushola" tanpa nama** (placeholder generik), dan **1 duplikat** (`Masjid Al-Amin` muncul 2x).
  3. **Pendidikan.geojson: jumlah cocok (14=14), tapi ~8 nama beda format** vs CSV (`SDN 1 Rejoagung Srono` vs `SD Negeri 1 Rejoagung`, `Al Falah Rejoagung` vs `Al-Falah`, `Khodijah` vs `Khodjiah` typo, dsb — daftar lengkap ada di riwayat chat).
  4. ~~`statusKepemilikan` gak pernah nyampe ke map~~ **[x] FIXED:** field `FGSGOV`/`FGSIBD` di GeoJSON emang selalu `null`, tapi sekarang ada fallback statis `STATUS_KEPEMILIKAN_ASET` (`src/constants/statusKepemilikanAset.ts`, sumber `INVENTARISASI ASET.csv` kolom STATUS KEPEMILIKAN) yang di-lookup by `NAMOBJ` di `AsetfasumModal.tsx`. Cakupan: Pemerintahan (1/1), Pendidikan (14/14, key nyamain `sekolahData.ts`), Keagamaan (~33 dari 37 fitur GeoJSON — 4 "Mushola" tanpa nama + duplikat Al-Amin sengaja gak dipetain karena ambigu), Olahraga (2, disiapin buat pas `Olahraga.geojson` dibuat).
  - **Butuh tindak lanjut dari tim survei lapangan** (bukan kerjaan kode): bikin `Olahraga.geojson`, klarifikasi 4 mushola tanpa nama + duplikat Al-Amin, isi `FGSGOV`/`FGSIBD` kalau mau data ownership live dari GeoJSON (bukan fallback statis).
- [x] **Recheck mapping properti `AsetfasumModal.tsx`:** `deriveCategory` logic (match `_source` = nama file `Pemerintahan.geojson`/`Ibadah.geojson`/`Pendidikan.geojson`) **udah benar, gak perlu diubah** — konsisten sama data `fasum/` yang ada sekarang.
- [x] **Recheck `SEKOLAH_DATA`:** Dicek langsung ke `public/data/akses/Fasilitas_Pendidikan.geojson` (14 fitur, sumber `NAMOBJ` resmi). Hasil:
  - **6 key di-rename** (institusi sama, format nama beda): `SMP Al Amiriyyah`→`SMP AL-Amiriyyah`, `SDN 1 Rejoagung Srono`→`SD Negeri 1 Rejoagung`, `SD N 2 Rejoagung`→`SD Negeri 2 Rejoagung`, `Pondok Pesantren Al Falah Rejoagung`→`Pondok Pesantren Al-Falah`, `MI Al Ma'arif Rejoagung`→`MI Al-Ma'arif`, `Ponpes manbaul alam`→`Yayasan Pondok Pesantren Manbaul Ulum`.
  - **3 sekolah baru ditambahin** (belum ada di data lama): `Pondok Pesantren Tasmirul Aulad`, `TK Khodjiah 88`, `SLB Bina Insani Srono`. Field enrichment (NPSN/akreditasi/alamat/zona waktu) buat 3 ini **masih placeholder `"—"`** — belum ada sumber data real, perlu diisi kalau info-nya udah ada.
  - **Jenjang baru "SLB"** ditambahin ke `JENJANG_COLORS` (`sekolahData.ts`) & `JENJANG_ORDER` (`EducationMetrics.tsx`) — sebelumnya cuma TK/SD/SMP/SMK/Pesantren.
  - Total lembaga otomatis naik dari 11 → **14**, ngikut turunan `EducationMetrics.tsx` (gak perlu edit manual, semua derived dari `SEKOLAH_DATA`).
- [ ] **Isi Foto Asli:** Lengkapi `ASET_FOTO` (`src/constants/asetFoto.ts`) dan field `foto` per entry di `SEKOLAH_DATA`, untuk aset/sekolah yang emang punya foto kondisi (infrastruktur render sudah siap dari Poin 5). Kolom `DOKUMENTASI` di `INVENTARISASI_ASET.csv` kosong semua saat ini — kalau temen nanti isi link/nama file foto di situ, itu jadi sumber buat `ASET_FOTO`.
- [x] **Ganti Sistem Zona Waktu Tempuh:** 5/10/15 menit → **10/30/60 menit** (dikonfirmasi dari nama file `akses/Service_Area_10/30/60_Menit.geojson`, udah direname duluan pas Poin 6). Isi 3 GeoJSON itu dicek — properti `"type": "within"` konfirmasi ini isochrone kumulatif ("dalam X menit dari sekolah").
  - `SekolahDetail.zonaWaktu` union type + value 14 entry di `sekolahData.ts`: `< 5 Menit`→`< 10 Menit`, `5–10 Menit`→`10–30 Menit`, `> 10 Menit`→**`30–60 Menit`** (bukan `> 30 Menit` open-ended — dibetulin lagi setelah cek isi file, karena ring 60 menit-nya beneran ada datanya, jadi dibatesin presisi pakai boundary asli, bukan didiemin open-ended kayak pola lama).
  - `ZONA_ORDER` di `EducationMetrics.tsx` + filter `zonaAman` (`!== "30–60 Menit"`). Label teks `"sekolah ≤ 30 mnt"` & `"< 30 menit"` (Coverage Index) tetep akurat, gak perlu diubah lagi (makna "bukan zona terjauh" gak berubah).
  - `SekolahLayer.tsx` udah fetch nama file baru duluan (gak perlu diubah).
  - **CATATAN PENTING (dicek ulang, terkonfirmasi):** ketiga file `Service_Area_10/30/60_Menit.geojson` masing-masing **cuma punya 1 feature — buat "SMK NU Darussalam" doang** (dicek jumlah + isi feature langsung). Ini 1 hasil network analysis dari 1 titik origin, **bukan** dataset reachability buat 14 sekolah. Kemungkinan fungsi aslinya buat layer ring overlay di peta (TRD: "Network Analysis Multi-Tier Overlays"), terpisah dari field `SEKOLAH_DATA.zonaWaktu` yang dipake chart dashboard.
  - Threshold angka (10/30/60 menit) **valid & udah bener** diganti. Tapi assignment **per-sekolah** (sekolah mana masuk zona mana) di `SEKOLAH_DATA` **masih murni manual/asumsi lama** — dari dulu emang gak pernah dihitung dari GeoJSON ini (cakupan datanya cuma 1 sekolah, gak bisa dipake validasi 13 sekolah lain). Kalau butuh akurasi spasial penuh per sekolah, perlu network analysis baru dari 14 titik origin, bukan cuma relabel — task terpisah, di luar scope constants-edit ini.
- [ ] **Sisa Angka Turunan yang Masih Perlu Dicek Manual:** Total lembaga, cakupan akses (`COVERAGE_INDEX_ESTIMASI`), jumlah sekolah zona aman — turunan otomatis dari `SEKOLAH_DATA` via `EducationMetrics.tsx`, ikut update begitu `SEKOLAH_DATA` direvisi, tapi tetap validasi manual sekali. Cek juga constants lain (`landPotential.ts`, `produksiPertanian.ts`) kalau-kalau data potensi/produksi ikut kena dampak revisi.
- [x] **Tambah Caption "Service Area":** Panel kanan (Waktu Tempuh chart) di `EducationMetrics.tsx` sekarang ada micro-copy "Representasi Service Area (Network Analysis) akses ke sekolah terdekat" di bawah label "Waktu Tempuh".

## 9. Service Layer & Async Data Fetching (Post-Production)
**Rasional:** Demi mengejar target rilis production, tahap ini sengaja dipisah dari Poin 2 dan dikerjakan *setelah* web GIS live serta Poin 6, 7, & 8 (revisi data spasial + uji deploy + detail modal) selesai. Trade-off yang diambil: potensi bug seputar *data fetching* (loading state, race condition, dll) baru ditangani pasca-launch, bukan menahan rilis production demi penyempurnaan arsitektur *fetch* yang belum genuinely dibutuhkan (masih zero-backend).

- [ ] **Pembuatan Service Layer (Jembatan API):** Buat folder khusus (misal: `src/services/api.ts`) yang berisi fungsi-fungsi *asynchronous* (`async function`) yang bertugas mengembalikan (*return*) data dari `src/constants/` (simulasi proses *fetch* data).
- [ ] **Future-Proofing Komponen:** Ubah komponen UI agar memanggil fungsi dari *Service Layer* secara *asynchronous* (misal pakai `useEffect` atau server components). Ini mempersiapkan transisi mulus di mana gaya penulisan *fetch* data sudah terbentuk, sehingga siap jika nanti website migrasi menjadi *full-stack* dengan *backend* sungguhan.
