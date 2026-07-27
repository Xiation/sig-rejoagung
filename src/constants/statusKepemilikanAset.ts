// src/constants/statusKepemilikanAset.ts
// from: public/data/Database_Aset_Desa_Rejoagung - INVENTARISASI ASET.csv (kolom STATUS KEPEMILIKAN)
// Key HARUS persis sama dengan NAMOBJ di public/data/fasum/*.geojson (Pemerintahan/Ibadah/Pendidikan).
// Dipakai AsetfasumModal.tsx sebagai fallback kalau field GeoJSON (FGSGOV/FGSIBD/FGGPDK) kosong/null
// (saat ini SELALU null di data fasum/ — lihat pre_production_todo.md poin 8).
//
// CATATAN: fasum/Ibadah.geojson punya 37 fitur, CSV cuma 27 entri Fasilitas Keagamaan — ~10 fitur
// GeoJSON (4 "Mushola" tanpa nama + 5 nama baru yang gak ada di CSV) SENGAJA gak dimasukin di sini
// karena gak ada padanan data yang jelas, bukan kelupaan. Fallback "Tidak Terdata" tetap berlaku
// buat fitur-fitur itu — jangan diisi tebakan.

export const STATUS_KEPEMILIKAN_ASET: Record<string, string> = {
  // ── Pemerintahan ──────────────────────────────────────────────────────────
  "Kantor Desa Rejoagung": "Tidak Terdata",

  // ── Pendidikan (key sama persis kayak SEKOLAH_DATA di sekolahData.ts) ──────
  "Pondok Pesantren Al-Falah": "Hak Milik",
  "Pondok Pesantren Darussalam": "Tidak Terdata",
  "Pondok Pesantren Salaf Darussalam": "Kosong",
  "SD Negeri 2 Rejoagung": "Tidak Terdata",
  "SD Negeri 1 Rejoagung": "Tidak Terdata",
  "SMK NU Darussalam": "Hak Milik",
  "SMP AL-Amiriyyah": "Kosong",
  "TK Khadijah 203 Rejoagung": "Hak Wakaf",
  "MTs Unggulan Darussalam": "Tidak Terdata",
  "MI Al-Ma'arif": "Hak Wakaf",
  "Pondok Pesantren Tasmirul Aulad": "Hak Milik",
  "TK Khodjiah 88": "Hak Wakaf",
  "SLB Bina Insani Srono": "Hak Milik",
  "Yayasan Pondok Pesantren Manbaul Ulum": "Hak Milik",

  // ── Keagamaan (key disamain ke NAMOBJ fasum/Ibadah.geojson — beda spasi/hyphen dari CSV) ──
  "Masjid Al-Ikhlas": "Hak Milik",
  "Masjid An-Nur Leba'an": "Hak Milik",
  "Masjid Baitul Jannah": "Hak Wakaf",
  "Masjid At-Taqwa": "Hak Wakaf",
  "Mushola At-Taubat": "Hak Milik",
  "Mushola Baburrohmah": "Hak Milik",
  "Mushola Jabal Nur": "Hak Milik",
  "Mushola Kalingga Murdha": "Hak Milik",
  "Mushola Thoriqul Jannah": "Hak Milik",
  "Mushola Darul Muttaqin": "Hak Milik",
  "Masjid Baitul Muttaqin": "Hak Milik",
  "Mushola Darun Najah": "Hak Wakaf",
  "Mushola An-Nur": "Hak Milik", // CSV: "Mushola An- Nur"
  "Mushola Darul Ulum": "Hak Milik",
  "Masjid Al-Barokah": "Hak Milik", // CSV: "Masjid Al- Barokah"
  "Masjid Baitur Rohim": "Hak Milik",
  "Masjid LDII Rejoagung": "Kosong",
  "Mushola Sumilah": "Hak Milik",
  "Masjid Baitul Murtasyidin": "Hak Milik",
  "Mushola Nurul Hidayah": "Hak Wakaf",
  // CSV nulis "Masjid Nurul Huda", GeoJSON nulis "Mushola Nurul Huda" — beda prefix, sama lokasi
  "Mushola Nurul Huda": "Hak Milik",
  // CSV nulis "Masjid Al- Amien", GeoJSON nulis "Masjid Al-Amin" — varian ejaan, sama lokasi
  "Masjid Al-Amin": "Hak Milik",
  "Mushola Al-Ukhuwah": "Hak Milik", // CSV: "Mushola Al- Ukhuwah"
  "Mushola Al-Hidayah": "Hak Milik", // CSV: "Mushola Al- Hidayah"
  "Masjid Baitul Arifin": "Hak Wakaf",
  "Mushola Al-Bashar": "Tidak Terdata", // CSV: "Mushola Al- Bashar"

  // ── Olahraga (belum ada Olahraga.geojson — disiapin buat kalau layer-nya dibuat) ──
  'RSC Rejoagung Sport Center': "Kosong",
  "Lapangan Rejoagung": "Hak Pakai",
};
