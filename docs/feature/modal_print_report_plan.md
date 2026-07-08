# Implementation Plan: Print Report Feature (InfoModal)

Fitur `Print Report` sangat krusial bagi perangkat desa untuk keperluan dokumentasi dan verifikasi aset fisik (PDF/Kertas). Rencana ini menjelaskan cara mengimplementasikan fitur cetak dari `InfoModal` tanpa mencetak elemen antarmuka lain (peta, sidebar).

---

## 1. Konsep Utama (CSS Print Media Query)

Kita akan memanfaatkan media query bawaan browser via Tailwind CSS, yaitu modifier `print:`. 
Ketika `window.print()` dipanggil, browser akan masuk ke mode cetak. Kita harus memastikan:
1. Peta dan Sidebar disembunyikan (`print:hidden`).
2. Modal diposisikan ulang agar mengisi seluruh halaman kertas A4 (`print:w-full`, `print:shadow-none`, dll).
3. Background diatur menjadi putih bersih dan warna teks disesuaikan untuk printer.

---

## 2. Perubahan pada Komponen

### A. Komponen Global (Layout / Page)
Agar fitur print berfungsi dengan bersih, komponen parent (`page.tsx` atau `Sidebar.tsx` dan `MapViewer.tsx`) harus diatur agar tidak ikut tercetak.

**Tindakan di `src/app/page.tsx`:**
Tambahkan class `print:hidden` pada elemen sidebar dan wrapper peta.
*Catatan: Hanya elemen utama yang membungkus aplikasi yang perlu disembunyikan, sedangkan portal modal (jika dirender di luar DOM utama) atau elemen map perlu disembunyikan secara eksplisit.*

### B. Modifikasi `src/components/map/InfoModal.tsx`
Ini adalah komponen yang akan menerima perubahan terbesar.

1. **Header Khusus Cetak (Kop Surat):** 
   Kita bisa menambahkan div khusus yang hanya muncul saat di-print (`hidden print:block`). Isinya berupa header resmi seperti "Laporan Inventarisasi Aset - Desa Rejoagung".
2. **Tombol Cetak (Print Button):**
   Tambahkan tombol di footer modal, sejajar dengan tombol "Tutup".
   Gunakan ikon printer (misalnya dari `lucide-react`).
3. **Tailwind Classes untuk Cetak:**
   - Wrapper latar belakang modal: Hilangkan efek gelap saat diprint (`print:bg-transparent`).
   - Kotak modal: Hapus bayangan dan sudut melengkung, penuhi lebar kertas (`print:shadow-none print:rounded-none print:w-full print:max-w-none print:p-0`).

---

## 3. Mockup Kode (InfoModal.tsx)

```tsx
"use client";
// import ikon printer (opsional, pastikan lucide-react terinstall)
import { Printer } from "lucide-react"; 

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any; 
}

export default function InfoModal({ isOpen, onClose, data }: InfoModalProps) {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 print:bg-transparent print:p-0">
      
      {/* 
        Container Modal 
        Pada layar: Tampil seperti pop-up kartu
        Pada kertas (print): Memenuhi halaman, tanpa bayangan
      */}
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:rounded-none print:w-full print:max-w-none print:p-8">
        
        {/* KOP LAPORAN (Hanya muncul saat diprint) */}
        <div className="hidden print:block text-center border-b-2 border-black pb-4 mb-6">
          <h1 className="text-xl font-bold uppercase">Pemerintah Desa Rejoagung</h1>
          <h2 className="text-lg font-semibold">Laporan Detail Aset & Fasilitas</h2>
          <p className="text-sm text-gray-600">Tahun 2026</p>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 print:text-lg">📋 Detail Fasilitas</h3>
        
        <div className="space-y-3 my-4 border-t border-b py-3 print:border-gray-300">
          <p className="text-sm print:text-base"><strong>Nama Aset:</strong> {data.NAMOBJ || "Tidak ada data"}</p>
          <p className="text-sm print:text-base"><strong>Keterangan:</strong> {data.REMARK || "Tidak ada keterangan"}</p>
        </div>

        {/* Footer Tombol (Sembunyikan saat diprint) */}
        <div className="flex gap-3 mt-6 print:hidden">
          <button 
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Tutup
          </button>
          
          <button 
            onClick={handlePrint}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Printer size={18} />
            Cetak Laporan
          </button>
        </div>
        
      </div>
    </div>
  );
}
```

---

## 4. Efek Samping & Mitigasi
- **Peta Tercetak di Latar Belakang:** Saat jendela modal mencetak, elemen peta Leaflet terkadang masih mencoba merender di latar belakang dan menghabiskan tinta printer (jika user print full color).
- **Solusi:** Di file tempat `<MapContainer>` dipanggil (`MapBase.tsx`), tambahkan class `print:hidden` pada elemen parent utamanya:
  `<div className="h-[100vh] w-full z-0 relative print:hidden">`
