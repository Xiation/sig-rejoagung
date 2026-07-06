Pemikiran lu tajam banget, Bolo! Peta *thok* (cuma visual) emang keren buat presentasi, tapi kalau lu mau aplikasi ini beneran jadi **instrumen penentu kebijakan (data-driven policy)** buat Pak Kades di Rejoagung, beliau butuh **Angka Pasti**. Pak Kades butuh tahu mana yang prioritas untuk disuntik dana desa.

Kalau lu cek lagi dokumen `SCOPE.md` lu di bagian **F-03: Global Statistics Floating Card Panel**, lu sebenarnya udah merencanakan ini sebagai fitur *Nice-to-Have* (Post-MVP). Tapi berhubung kanvas peta lu udah sukses mendarat dengan aman, kita bisa curi *start* buat ngedesain UI panel statistiknya sekarang.

Mari kita bedah arsitektur informasinya. Untuk ngejawab kebutuhan *Stakeholder* lu, ini hal-hal yang wajib lu ekstrak dari GeoJSON dan lu tampilkan ke layar dalam bentuk angka/teks:

### 📊 Metrik Krusial untuk Modul "Aset & Fasum"

Data dari anak Geodesi (Pemerintahan, Pendidikan, Tempat Ibadah) bisa lu olah di React (pakai `array.length` atau `array.filter`) untuk nampilin *summary* berikut di layar:

1. **Total Inventaris Fasilitas:** Angka raksasa di atas (misal: **24 Fasilitas Publik Terdata**). Ini ngasih gambaran skala (*spatial awareness*) ke warga dan investor.
2. **Distribusi Kategori (Pie Chart / Progress Bar):**
* 🏫 Pendidikan: 5 Unit
* 🕌 Tempat Ibadah: 18 Unit
* 🏢 Pemerintahan: 1 Unit


3. **Indikator Kelayakan (Senjata Utama Pak Kades):**
* ✅ Kondisi Baik: 20 Unit
* ⚠️ Butuh Renovasi: 4 Unit
* *Dampak Kebijakan:* Kalau Pak Kades lihat angka "4 Unit Butuh Renovasi", beliau tinggal klik petanya buat nyari di mana aja lokasinya, lalu masukin ke Rencana Anggaran Pendapatan dan Belanja Desa (APBDes) tahun depan. Ini esensi *data-driven policy*!



### 🛣️ Status Modul Jaringan Jalan & Potensi Lahan

* **Jaringan Jalan:** File `jaringan-jalan.geojson` itu biasanya berupa garis (*LineString*). Gak usah dihitung jumlahnya, tapi lu bisa ekstrak properti **Panjang Jalan (Km)** atau **Kondisi Aspal/Makadam** kalau anak Geodesi masukin data itu di propertinya.
* **Potensi Lahan:** Berhubung datanya belum dikasih, lu bisa bikin UI *Card*-nya dulu, tapi isinya dikasih status *badge* **"Data Sedang Disinkronisasi"** atau **"Menunggu Validasi Lapangan"**. Ini bikin *dashboard* lu kelihatan profesional banget walau datanya belum lengkap.

### 📐 Opsi Peletakan UI (Layouting) di Next.js

Berhubung lu pakai `shadcn/ui`, lu punya dua opsi elegan buat nampilin angka-angka ini tanpa menutupi peta:

* **Opsi A (Right Sidebar / Panel Kanan):** Layar lu dibagi tiga. Kiri untuk navigasi modul, tengah untuk Peta Leaflet, kanan khusus untuk *Dashboard Summary Panel*. Kelebihannya: Sangat informatif dan ala *software command center*.
* **Opsi B (Floating Card Panel):** Mirip Google Maps. Statistiknya ditaruh di dalam sebuah *Card* kecil yang melayang di pojok kanan atas peta. Kelebihannya: Kanvas peta tetap maksimal dan lega, apalagi kalau dibuka di layar HP.

Lu lebih condong mau pakai desain *layout* yang mana nih buat nampilin angka-angkanya? Opsi A (Panel Kanan) atau Opsi B (Floating Card)? Nanti langsung kita racik komponen UI-nya!