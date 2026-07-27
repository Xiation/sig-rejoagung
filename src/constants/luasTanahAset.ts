// src/constants/luasTanahAset.ts
// from: public/data/Database_Aset_Desa_Rejoagung - INVENTARISASI ASET.csv (kolom LUAS TANAH (m²))
// Key HARUS persis sama dengan NAMOBJ di public/data/fasum/*.geojson — samain persis
// sama key di statusKepemilikanAset.ts (sumber & aturan matching NAMOBJ yang sama).
// null = kolom CSV isinya "-" (belum ada data), bukan 0 m².

export const LUAS_TANAH_ASET: Record<string, number | null> = {
  // ── Pemerintahan ──────────────────────────────────────────────────────────
  "Kantor Desa Rejoagung": null,

  // ── Pendidikan ──────────────────────────────────────────────────────────
  "Pondok Pesantren Al-Falah": 387,
  "Pondok Pesantren Darussalam": null,
  "Pondok Pesantren Salaf Darussalam": null,
  "SD Negeri 2 Rejoagung": null,
  "SD Negeri 1 Rejoagung": null,
  "SMK NU Darussalam": 435,
  "SMP AL-Amiriyyah": 1831,
  "TK Khadijah 203 Rejoagung": 254,
  "MTs Unggulan Darussalam": null,
  "MI Al-Ma'arif": 2464,
  "Pondok Pesantren Tasmirul Aulad": 1180,
  "TK Khodjiah 88": 2464,
  "SLB Bina Insani Srono": 720,
  "Yayasan Pondok Pesantren Manbaul Ulum": 383,

  // ── Keagamaan ──────────────────────────────────────────────────────────
  "Masjid Al-Ikhlas": 512,
  "Masjid An-Nur Leba'an": 313,
  "Masjid Baitul Jannah": 390,
  "Masjid At-Taqwa": 211,
  "Mushola At-Taubat": 690,
  "Mushola Baburrohmah": 839,
  "Mushola Jabal Nur": 1646,
  "Mushola Kalingga Murdha": 844,
  "Mushola Thoriqul Jannah": 846,
  "Mushola Darul Muttaqin": 1130,
  "Masjid Baitul Muttaqin": 928,
  "Mushola Darun Najah": 248,
  "Mushola An-Nur": 1360,
  "Mushola Darul Ulum": 2430,
  "Masjid Al-Barokah": 1915,
  "Masjid Baitur Rohim": 1912,
  "Masjid LDII Rejoagung": 744,
  "Mushola Sumilah": 475,
  "Masjid Baitul Murtasyidin": 251,
  "Mushola At-Taqwa": 407,
  "Mushola Nurul Hidayah": 239,
  "Mushola Nurul Huda": 722, // CSV: "Masjid Nurul Huda"
  "Masjid Al-Amin": 1407, // CSV: "Masjid Al- Amien"
  "Mushola Al-Ukhuwah": 329,
  "Mushola Al-Hidayah": 1108,
  "Masjid Baitul Arifin": 2562,
  "Mushola Al-Bashar": null,

  // ── Olahraga ──────────────────────────────────────────────────────────
  'RSC Rejoagung Sport Center': 2234,
  "Lapangan Rejoagung": 7958,
};
