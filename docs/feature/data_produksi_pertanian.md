# Data Produksi Pertanian Desa Rejoagung (Tahun 2026)

Dokumen ini berisi rekapitulasi data hasil produksi komoditas pertanian dan perkebunan Desa Rejoagung dalam satuan **Ton**. Data ini akan digunakan sebagai *Single Source of Truth* (SSOT) untuk pembuatan visualisasi *Bar Chart* pada modul Peta Potensi / Analytics Dashboard (mengacu pada Poin 1 di `pre_production_todo.md`).

NOTE: data tonase dalam bentuk ton per tahun

---

## 1. Tanaman Perkebunan
| Komoditas | Hasil Produksi (Ton) |
| :--- | :--- |
| Durian | 7 |
| Tembakau | 2 |
| Tebu | 1 |
| Kopi | 0.3 |
| Karet | 0.1 |
| Kelapa Sawit | 0.1 |
| Kakao | 0.1 |
| Teh | 0.1 |
| Kina | 0.1 |

---

## 2. Tanaman Pangan
| Komoditas | Hasil Produksi (Ton) |
| :--- | :--- |
| Padi | 2812 |
| Jagung | 882 |
| Kacang Tanah | 32 |
| Ubi Kayu | 26 |
| Ubi Jalar | 16 |
| Talas | 6 |
| Sukun | 6 |
| Pete | 2 |
| Cabe | 2 |

---

## 3. Tanaman Buah
| Komoditas | Hasil Produksi (Ton) |
| :--- | :--- |
| Semangka | 62 |
| Pepaya | 42 |
| Buah Naga | 22 |
| Pisang | 21 |
| Tomat | 12 |
| Mangga Manalagi | 12 |
| Rambutan | 12 |
| Mangga Harumanis | 11 |
| Durian Montong | 8 |
| Alpukat | 7 |
| Mangga Kuweni | 6 |
| Melon | 6 |
| Jambu | 5 |
| Salak | 4 |
| Mangga Alpukat | 2 |
| Nangka | 2 |
| Jeruk Lokal | 1 |
| Durian Baweh | 1 |
| Durian Musangking | 1 |

---

## 4. Tanaman Sayur
| Komoditas | Hasil Produksi (Ton) |
| :--- | :--- |
| Taoge | 97 |
| Sayur Terong | 68 |
| Bawang Merah | 46 |
| Cabe Rawit | 24 |
| Kacang Panjang | 18 |
| Cabe Keriting | 16 |
| Mentimun | 12 |
| Sayur Pare | 9 |
| Brokoli | 8 |
| Cabe Prentul | 8 |
| Bayam | 3 |
| Kangkung | 2 |
| Kol | 2 |

---
**Catatan Implementasi:** Saat merubah data ini menjadi TypeScript object (`.ts`), pastikan untuk mengelompokkannya ke dalam *array of objects* (misal: `[{ komoditas: "Padi", jumlah: 2812, kategori: "Pangan" }]`) agar mudah di-render oleh pustaka grafik *Recharts*.
