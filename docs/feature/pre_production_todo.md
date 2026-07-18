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

- [ ] **Push hasil migrasi pnpm+bun ke remote:** Pastikan `pnpm-lock.yaml`, `package.json` (field `packageManager`), dan `.gitignore` (update `bun.lock`/`bun.lockb`) dari `docs/prod/migration-steps.md` Step 9 udah ke-commit & ke-push. `package-lock.json` harus udah gak ada di repo (dihapus via `git rm` di Step 3).
- [ ] **Pilih target awal:** Vercel *atau* Cloudflare Pages dulu (boleh dua-duanya belakangan) — ikutin checklist `migration-steps.md` Step 8: Framework Preset tetap `Next.js`, build command eksplisit `pnpm run build` kalau di Cloudflare.
- [ ] **Connect repo & verifikasi build di platform:** Bukan cuma build lokal — pastikan Vercel/Cloudflare beneran sukses `pnpm install` + `pnpm run build` di environment mereka sendiri.
- [ ] **Smoke-test hasil deploy live:** Buka URL production, cek dashboard + ketiga modul peta (Aset & Fasum, Potensi Lahan, Akses Sekolah), klik minimal 1 marker/polygon tiap modul. Perhatikan khusus: path fetch GeoJSON (`/data/...`) dan foto (`/images/...`) resolve dengan benar di production (base path production kadang beda dari lokal).
- [ ] **Catat hasil:** Sukses/gagal + error kalau ada, balik ke dokumen ini, sebelum lanjut ke Poin 8.

## 8. Revisi Data Detail Modal, Aset, & Foto (Dampak Domino Revisi Spasial + Data Baru dari Temen)
- [ ] **Sinkronisasi Data Aset dari `public/data/database/`:** Temen udah revisi `INVENTARISASI_ASET.csv` & `Rekapitulasi_aset.csv` (sumber asli `src/constants/assetsSummary.ts`, lihat comment `// from: Rekapitulasi_aset.csv` di file itu). **Ditemukan 1 discrepancy konkret** (dicek langsung isi CSV vs code sesi ini): `categoryData` kategori **"Fasilitas Pendidikan"** di `assetsSummary.ts` masih `jumlah: 11`, padahal `Rekapitulasi_aset.csv` baris 15 & hitungan manual `INVENTARISASI_ASET.csv` (10 baris berkategori Fasilitas Pendidikan dari 22 total aset) sama-sama bilang **10**. Field `luas` (5,371 m²) & `persen` (45.5%) kategori itu sudah benar, cuma `jumlah` yang stale — fix jadi `10`.
  - Field lain sudah tervalidasi cocok 100% dan **gak perlu diubah**: `assetsSummary` macro stats (total-aset 22, total-luas 21,854 m², jumlah-kategori 4, belum-verifikasi 8), seluruh `ownershipData` (Hak Milik 9, Hak Wakaf 4, Hak Pakai 1, Kosong 3, Belum Terverifikasi 5 — kolom `STATUS KEPEMILIKAN` bernilai `-` di CSV terkonfirmasi merepresentasikan "Belum Terverifikasi").
- [ ] **Cross-check GeoJSON `fasum/` vs CSV:** `AsetfasumModal.tsx` & `AssetMetrics.tsx` gak baca CSV di `public/data/database/` sama sekali — datanya dari live GeoJSON `public/data/fasum/*.geojson` (properti `_source`, `NAMOBJ`, dst). Verifikasi jumlah & kategori fitur di GeoJSON `fasum/` cocok sama 22 aset / 4 kategori di CSV revisi (terutama kategori Fasilitas Pendidikan yang barusan ketauan beda) — CSV ini "ledger" sumber, GeoJSON yang harus disamain ke situ.
- [ ] **Recheck `SEKOLAH_DATA`:** Daftar sekolah kemungkinan berubah (tambah/hapus/ganti nama) menyusul revisi spasial poin 6. Verifikasi key `NAMOBJ` di `src/constants/sekolahData.ts` masih match GeoJSON `akses/`, update `alamat`/`akreditasi`/`npsn`/`jenjang` sesuai kondisi terbaru. *(Catatan: gak ketemu CSV sekolah terpisah di `public/data/database/` sesi ini — cuma ada data aset. Kalau temen juga revisi data sekolah, taro filenya di situ juga biar konsisten.)*
- [ ] **Recheck mapping properti `AsetfasumModal.tsx`:** Pastikan logic `deriveCategory` (key `_source`) dan `statusKepemilikan` (`FGSGOV`/`FGSIBD`/`FGGPDK`) masih konsisten sama struktur data `fasum/` yang baru.
- [ ] **Isi Foto Asli:** Lengkapi `ASET_FOTO` (`src/constants/asetFoto.ts`) dan field `foto` per entry di `SEKOLAH_DATA`, untuk aset/sekolah yang emang punya foto kondisi (infrastruktur render sudah siap dari Poin 5). Kolom `DOKUMENTASI` di `INVENTARISASI_ASET.csv` kosong semua saat ini — kalau temen nanti isi link/nama file foto di situ, itu jadi sumber buat `ASET_FOTO`.
- [ ] **Ganti Sistem Zona Waktu Tempuh:** 5/10/15 menit → **10/30/60 menit**. Berdampak ke:
  - `SekolahDetail.zonaWaktu` (union type + value tiap entry) di `src/constants/sekolahData.ts`.
  - `ZONA_ORDER` const di `src/components/analytics/EducationMetrics.tsx`.
  - Nama file GeoJSON `akses/Service Area X Menit.geojson` kalau ikut direname di Poin 6.
  - Styling layer zona reachability buffer di peta (`SekolahLayer.tsx` / `akses-sekolah`), kalau ada hardcode label 5/10/15 menit di tempat lain.
- [ ] **Sisa Angka Turunan yang Masih Perlu Dicek Manual:** Total lembaga, cakupan akses (`COVERAGE_INDEX_ESTIMASI`), jumlah sekolah zona aman — turunan otomatis dari `SEKOLAH_DATA` via `EducationMetrics.tsx`, ikut update begitu `SEKOLAH_DATA` direvisi, tapi tetap validasi manual sekali. Cek juga constants lain (`landPotential.ts`, `produksiPertanian.ts`) kalau-kalau data potensi/produksi ikut kena dampak revisi.
- [ ] **Tambah Caption "Service Area":** Panel kanan (Waktu Tempuh chart) di `EducationMetrics.tsx` saat ini gak ada keterangan bahwa itu representasi *Service Area* akses pendidikan — tambah label/caption kecil di situ.

## 9. Service Layer & Async Data Fetching (Post-Production)
**Rasional:** Demi mengejar target rilis production, tahap ini sengaja dipisah dari Poin 2 dan dikerjakan *setelah* web GIS live serta Poin 6, 7, & 8 (revisi data spasial + uji deploy + detail modal) selesai. Trade-off yang diambil: potensi bug seputar *data fetching* (loading state, race condition, dll) baru ditangani pasca-launch, bukan menahan rilis production demi penyempurnaan arsitektur *fetch* yang belum genuinely dibutuhkan (masih zero-backend).

- [ ] **Pembuatan Service Layer (Jembatan API):** Buat folder khusus (misal: `src/services/api.ts`) yang berisi fungsi-fungsi *asynchronous* (`async function`) yang bertugas mengembalikan (*return*) data dari `src/constants/` (simulasi proses *fetch* data).
- [ ] **Future-Proofing Komponen:** Ubah komponen UI agar memanggil fungsi dari *Service Layer* secara *asynchronous* (misal pakai `useEffect` atau server components). Ini mempersiapkan transisi mulus di mana gaya penulisan *fetch* data sudah terbentuk, sehingga siap jika nanti website migrasi menjadi *full-stack* dengan *backend* sungguhan.
