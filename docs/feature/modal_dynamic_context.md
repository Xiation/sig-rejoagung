# InfoModal Architecture & Content Strategy

*Catatan: Dokumen ini sebelumnya berisi rencana fitur "Print Report". Fitur tersebut telah dibatalkan karena dinilai kurang relevan. Dokumen ini sekarang berfokus pada arsitektur hierarki konten untuk InfoModal.*

---

## 1. Arsitektur Modal (Wrapper Pattern)

Komponen `src/components/map/InfoModal.tsx` tidak lagi merender detail data secara *hardcode*, melainkan akan bertransformasi menjadi **Wrapper/Container Modal**. 

**Tanggung jawab `InfoModal.tsx` (Wrapper):**
- Mengelola state visibilitas (`isOpen`, `onClose`).
- Menyediakan *layout shell* standar M3 (`max-w-2xl`, *backdrop overlay*, dan animasi transisi).
- Menyediakan tombol *Close* (Tutup Detail) statis di bagian bawah.
- Melakukan **Conditional Rendering** dengan membaca `activeModule` (aset / sekolah / potensi) untuk memanggil komponen anak yang sesuai dari folder `content/`.

---

## 2. Pemisahan Komponen Konten (`src/components/map/content/`)

Setiap modul peta akan memiliki komponen *content* modalnya masing-masing dengan layout yang dirancang khusus untuk memaksimalkan keterbacaan tipe data tersebut.

### A. `AsetfasumModal.tsx` (Modul Aset & Fasum Desa)
Ditujukan untuk menampilkan detail fasilitas umum atau sosial.
* **Header (Full Width):** Nama Fasilitas (`NAMOBJ`) dalam teks berukuran besar, disertai ikon kategori.
* **Body (Grid 2 Kolom):**
  - **Kolom Kiri:**
    - Keterangan / Status Kepemilikan.
    - Kategori (Fasilitas Umum / Sosial / Pendidikan).
  - **Kolom Kanan:**
    - Fungsi Spesifik Fasilitas.
    - Koordinat (Latitude & Longitude).

### B. `SekolahModal.tsx` (Modul Aksesibilitas Sekolah)
Ditujukan untuk detail institusi pendidikan.
* **Header (Full Width):** Nama Sekolah.
* **Body (Grid 2 Kolom / Terstruktur):**
  - **Kolom Kiri (Profil Utama):** Alamat Sekolah, Akreditasi Sekolah, NPSN.
  - **Kolom Kanan (Spasial & Ekstra):** Koordinat (Latitude & Longitude).
  - **💡 Saran Informasi Tambahan:** 
    - **Status & Jenjang:** Sangat disarankan untuk menambahkan informasi apakah sekolah tersebut **Negeri/Swasta** serta **Jenjangnya (SD/SMP/SMA)**.
    - **Jumlah Siswa / Guru (Opsional):** Jika KKN mendata kapasitas, angka ini sangat bagus untuk mendukung data aksesibilitas.

### C. `PotensiModal.tsx` (Modul Potensi Lahan & SDA)
Satu-satunya modal yang secara ketat mengikuti layout *heavy-data* dari `DESIGN_SYS.md`.
* **Header (Full Width):** Nama Area / Dusun.
* **Body (Grid 2 Kolom):**
  - **Kolom Kiri (Geographical Profiles):** Luas Area (*Area*), Elevasi, Jenis Tanah (*Soil Type*).
  - **Kolom Kanan (Inventory & Commodity):** Komoditas Utama (*Crops*), Estimasi Hasil Panen (*Estimated Yield*), dan *Progress Bars* persentase masa tanam.
* **Footer (Insights):** Blok peringatan / *Actionable Insights* menggunakan token warna *Error/Success Containers*.

---

## 3. Langkah Eksekusi (Next Steps)

1. Membuat folder `src/components/map/content/`.
2. Membuat 3 file kerangka komponen (`AsetfasumModal.tsx`, `SekolahModal.tsx`, `PotensiModal.tsx`).
3. Membersihkan `InfoModal.tsx` saat ini agar menjadi murni *wrapper* yang melakukan *switch-case* berdasarkan prop `activeModule`.
