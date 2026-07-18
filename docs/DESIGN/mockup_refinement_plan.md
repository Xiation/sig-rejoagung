# Comprehensive Mockup Refinement Plan (Aligned with DESIGN_SYS.md & MVP Scope)

Berdasarkan dokumen pedoman desain terbaru (`docs/DESIGN/DESIGN_SYS.md`), analisis *mockup* HTML, dan batasan ketat dari **PRD, SCOPE, dan TRD (Zero-Backend/Static GIS)**, berikut adalah rancangan eksekusi perombakan komponen.

Perombakan ini akan mengimplementasikan **Material Design 3 (M3) Semantic Tokens** dan **Composite Bento Grid System** sesuai panduan `DESIGN_SYS.md`, dengan membuang fungsi-fungsi *out-of-scope* (seperti profil dinamis, *search bar*, dan edit data).

---

## 🔍 Gap Analysis & Target Architecture

| Aspek | Kondisi Saat Ini | Target Baru (Sesuai `DESIGN_SYS.md`) |
| :--- | :--- | :--- |
| **Ikonografi** | Lucide React | **Material Symbols Outlined** (24px base size). |
| **Sistem Warna** | Tailwind statis (`slate-*`) | **M3 Semantic Tokens** (Primary `#059669`, `surface-container-low`, `outline-variant`). |
| **Layout "Bento Shell"** | Sidebar sederhana | Sidebar (288px) + **Fixed TopAppBar** (64px). Area konten utama dengan `p-6` dan `gap-6`. *Fitur Out-of-Scope di Header dihapus.* |
| **Typography** | Font custom CSS | Pendekatan *Utility-first* Tailwind (contoh: Display Metric = `text-3xl font-extrabold tracking-tight`). |
| **Analytics Grid** | Modular terpisah | **Composite Bento Grid**. Baris atas: Macro Scorecard (dengan ornamen *watermark*). Baris tengah: Composite Chart Cards. |
| **Info Modal (Peta)**| Dialog tengah kecil | **Expanded Dialog (`max-w-2xl`)**. Berisi 2 kolom data komprehensif, *Insight Blocks* di bawah. *Hanya Read-Only.* |
| **UI Peta (GIS)** | Peta polos | Ada **Control Cluster** kustom di Kanan-Bawah & **Legend Overlay** bergaya *glassmorphism* di Kiri-Bawah. |

---

## 📋 Execution Plan (Tahapan Implementasi 4 Fase)

### Phase 1: Foundation & Semantic Tokens (`DESIGN_SYS.md` Bab 1)
*Fokus: Mengintegrasikan aset global dan melengkapi `tailwind.config.ts`.*
1. **Material Symbols**: 
   - Inject link Google Fonts untuk Material Symbols ke `src/app/layout.tsx`.
   - Buat komponen `src/components/ui/Icon.tsx` (wrapper) untuk menstandarisasi ikon.
2. **Tailwind Config & Global CSS**:
   - Update `tailwind.config.ts` & `globals.css` untuk memasukkan variabel warna semantik (M3) sesuai `DESIGN_SYS.md`:
     - Primary: `#059669`
     - Backgrounds: `surface-container-low`, `surface-container`, `surface-variant`.
     - Borders: `outline-variant`.
     - Status: `primary-container`, `error-container`.
3. **Typography Reset**:
   - Pastikan utilitas CSS lama dihapus/disesuaikan agar mengacu pada panduan Tailwind bawaan yang direkomendasikan di `DESIGN_SYS.md` (seperti `text-3xl`, `text-[10px] uppercase`).

### Phase 2: The Bento Shell Redesign (`DESIGN_SYS.md` Bab 2)
*Fokus: Membangun ulang kerangka navigasi aplikasi.*
1. **`src/components/layout/Sidebar.tsx`**:
   - Terapkan fixed width `18rem (288px)`.
   - Update styling navigasi aktif (Primary Container).
   - *Footer* statis: Tombol Export Data (Fitur Help/Logout Out-of-Scope dihapus).
2. **`src/components/layout/TopAppBar.tsx` (Baru - Minimalis)**:
   - Buat *fixed header* (`h-16 / 64px`) sejajar di kanan sidebar.
   - **Isi**: Hanya judul halaman. Fungsi search dinamis & avatar dihapus sesuai aturan MVP.
3. **`src/app/page.tsx` (Main Viewport)**:
   - Atur ulang kontainer `main` agar terhindar dari Sidebar dan TopAppBar (`ml-[18rem]` dan `mt-16`), dengan global padding `p-6` dan warna latar `bg-surface-container-low`.

### Phase 3: Composite Bento Grid Restructuring (`DESIGN_SYS.md` Bab 3)
*Fokus: Merombak komponen metrik.*
1. **Macro Scorecards (Row 1)**: 
   - Rombak "Ikhtisar Wilayah".
   - Buat 3 kartu makro: Icon di kiri atas, nilai besar (*Display Metric*) di tengah-bawah, dan *watermark icon* ber-opacity 20% di sudut kanan bawah.
2. **Composite Chart Cards (Middle Grid)**:
   - Rombak isi `src/components/analytics/`.
   - Gabungkan statistik dan Chart dalam satu *card* besar menggunakan *Header Section*, *Chart Area* (Primary color bar), dan *Metadata Footer* (`Label Caps`).
3. **Empty States & Status**:
   - Terapkan standar *Empty State* dengan `bg-slate-50` dan teks `Label Caps` di tengah.

### Phase 4: Map Controls & Expanded Dialog (`DESIGN_SYS.md` Bab 4)
*Fokus: UI Mengambang Peta dan Kedalaman Info Modal (Read-Only).*
1. **Map Floating Controls (`src/components/map/MapViewer.tsx`)**:
   - **Legend Overlay**: Tambahkan kartu legenda di `bottom-6 left-6` (`bg-surface-container` dengan *backdrop-blur*).
   - **Control Cluster**: UI tombol kustom (+, -, My Location) disusun vertikal di `bottom-6 right-6`.
2. **InfoModal Redesign (`src/components/map/InfoModal.tsx`)**:
   - Perbesar *overlay dialog* menjadi `max-w-2xl` (~672px).
   - Struktur dialog 2 Kolom (*Read-Only*):
     - Kiri: *Geographical Profiles*.
     - Kanan: *Inventory & Commodity* (termasuk *progress bar*).
     - Bawah: *Insight Blocks* menggunakan `Error/Success Containers`.
     - (Catatan: Fitur *Edit Data* dihapus untuk menjaga keamanan MVP statis).

---

**Status Kesiapan:**
Dokumen ini telah 100% selaras dengan visi visual `DESIGN_SYS.md` sekaligus tetap patuh pada batasan arsitektur statis/zero-backend yang ada di dokumentasi spesifikasi (TRD/SCOPE).
