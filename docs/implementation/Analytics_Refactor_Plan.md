# Implementation Plan: Analytics Dashboard Refactoring (Refined)
**Berdasarkan:** `docs/TRD_Dashboard.md` v1.1 + Jawaban Open Questions  
**Tanggal:** 2026-07-06  
**Status:** Siap Dieksekusi

---

## Keputusan Final dari Open Questions

| Pertanyaan | Keputusan |
|---|---|
| Data Strategy | **Semua hardcoded** — zero-backend |
| shadcn/ui Table | **Tidak digunakan** — diganti CSS Grid List (Table belum diinstall) |
| Data Akreditasi | **Dummy data sementara** — akan diupdate saat data asli tersedia |
| Coverage Index | **Dihitung manual & dummy** — ditandai jelas sebagai estimasi |
| Data Distribusi Pendidikan | **Dihitung manual dari `sekolah.geojson`** (N=8 feature) |
| Data Dusun | **Diekstrak dari `dusun.geojson` properties** |

---

## Inventaris Data yang Sudah Ada

### Dari `sekolah.geojson` (8 features, dihitung manual):
| Jenjang | Nama | Jumlah |
|---|---|---|
| TK | TK Khadijah 203 Rejoagung | 1 |
| SD | SD Negeri 1 Rejoagung, SD Negeri 2 Rejoagung | 2 |
| SMP | SMP AL-Amiriyyah | 1 |
| SMK | SMK NU Darussalam | 1 |
| Pesantren | Ponpes Darussalam, Ponpes Salaf Darussalam, Ponpes Manbaul Ulum | 3 |
| **TOTAL** | | **8** |

### Dari `dusun.geojson` (4 features, key properties yang akan digunakan):
| Dusun | Produksi Padi | Potensi Ekonomi | Energi Terbarukan |
|---|---|---|---|
| Sumberagung | 6.4 ton/ha, IP 200 | Sangat Tinggi | PLTS Atap, Biogas Ternak |
| Sumberagung Kidul | 5.8 ton/ha, IP 100 | Tinggi | Biogas Ternak Sapi, PLTS Atap |
| Sumbergroto | 7.2 ton/ha, IP 300 | Sangat Tinggi | PLTMH (aliran sungai), PLTS atap |
| Sumbergroto Kidul | 5.5 ton/ha, IP 200 | Tinggi | PLTS atap, Biogas itik/ayam |

---

## Target Struktur Folder

```text
src/
├── constants/
│   └── assetsSummary.ts            ← [NEW] Single source of truth data aset
└── components/analytics/
    ├── analyticsDashboard.tsx      ← [MODIFY] Slim-down jadi layout-only wrapper
    ├── AssetMetrics.tsx            ← [NEW] KPI cards + 2 Recharts charts
    ├── EducationMetrics.tsx        ← [NEW] 5 cards pendidikan
    └── LandPotentialMetrics.tsx    ← [NEW] 4 dusun profile cards
```

---

## Rencana Per File

---

### File 1: `src/constants/assetsSummary.ts` — [NEW]

Ekstrak data hardcoded dari `analyticsDashboard.tsx` (baris 9-89) ke sini.

**Konten:**
```ts
// Data dari Rekapitulasi_aset.csv Desa Rejoagung 2026

export const summaryStats = [
  { id: "total-aset", label: "Total Aset Terdata", value: "22", unit: "aset", 
    icon: "🏛️", accentColor: "#1d4ed8", bgColor: "#eff6ff", borderColor: "#bfdbfe" },
  { id: "total-luas", label: "Total Luas Tanah", value: "21,854", unit: "m²", 
    icon: "📐", accentColor: "#059669", bgColor: "#f0fdf4", borderColor: "#bbf7d0" },
  { id: "jumlah-kategori", label: "Jumlah Kategori", value: "4", unit: "kategori", 
    icon: "🏷️", accentColor: "#7c3aed", bgColor: "#faf5ff", borderColor: "#ddd6fe" },
  { id: "belum-verifikasi", label: "Belum Diverifikasi", value: "8", unit: "aset", 
    icon: "⚠️", accentColor: "#d97706", bgColor: "#fffbeb", borderColor: "#fde68a" },
];

export const categoryData = [
  { nama: "Fasilitas Pendidikan", jumlah: 10, luas: "5,371", persen: 45.5, color: "#10b981" },
  { nama: "Fasilitas Keagamaan", jumlah: 9, luas: "6,291", persen: 40.9, color: "#2563eb" },
  { nama: "Olahraga", jumlah: 2, luas: "10,192", persen: 9.1, color: "#8b5cf6" },
  { nama: "Fasilitas Pemerintahan", jumlah: 1, luas: "0", persen: 4.5, color: "#ea580c" },
];

export const ownershipData = [
  { status: "Hak Milik", jumlah: 9, persen: 40.9, color: "#10b981" },
  { status: "Belum Terverifikasi", jumlah: 5, persen: 22.7, color: "#f59e0b" },
  { status: "Hak Wakaf", jumlah: 4, persen: 18.2, color: "#3b82f6" },
  { status: "Kosong / Tanpa Dokumen", jumlah: 3, persen: 13.6, color: "#ef4444" },
  { status: "Hak Pakai", jumlah: 1, persen: 4.5, color: "#8b5cf6" },
];
```

---

### File 2: `src/components/analytics/AssetMetrics.tsx` — [NEW]

**Harus `"use client";`** (Recharts).  
Import data dari `@/constants/assetsSummary`.

**Layout:**

**Row 1 — 4 KPI Cards** `grid grid-cols-2 lg:grid-cols-4 gap-4`  
Menggunakan `shadcn/ui <Card>` dengan `text-3xl font-bold`.  
Data dari `summaryStats`.

**Row 2 — 2 Chart Panels** `grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6`

- **Panel Kiri — `<PieChart>` (Donut): Status Kepemilikan**
  ```tsx
  <ResponsiveContainer width="100%" height={280}>
    <PieChart>
      <Pie data={ownershipData} dataKey="jumlah" nameKey="status"
           cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3}>
        {ownershipData.map((entry, index) => (
          <Cell key={index} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip formatter={(value) => [`${value} aset`]} />
      <Legend wrapperStyle={{ flexWrap: "wrap", fontSize: "12px" }} />
    </PieChart>
  </ResponsiveContainer>
  ```

- **Panel Kanan — `<BarChart>`: Distribusi Kategori**
  ```tsx
  <ResponsiveContainer width="100%" height={280}>
    <BarChart data={categoryData} margin={{ top: 5, right: 10, bottom: 40, left: 0 }}>
      <XAxis dataKey="nama" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" />
      <YAxis tick={{ fontSize: 12 }} />
      <Tooltip formatter={(value) => [`${value} aset`]} />
      <Bar dataKey="jumlah" radius={[4, 4, 0, 0]}>
        {categoryData.map((entry, index) => (
          <Cell key={index} fill={entry.color} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
  ```

**Empty State Safeguard:**
```tsx
if (categoryData.length === 0) return (
  <div className="flex h-40 items-center justify-center text-muted-foreground">
    Data tidak tersedia
  </div>
);
```

---

### File 3: `src/components/analytics/EducationMetrics.tsx` — [NEW]

**Harus `"use client";`** (Recharts).

**Data hardcoded (dihitung manual dari `sekolah.geojson` + dummy untuk akreditasi & coverage):**

```ts
// Distribusi jenjang (dihitung dari NAMOBJ di sekolah.geojson)
const tierData = [
  { jenjang: "TK", jumlah: 1, color: "#ec4899" },
  { jenjang: "SD", jumlah: 2, color: "#ef4444" },
  { jenjang: "SMP", jumlah: 1, color: "#3b82f6" },
  { jenjang: "SMK", jumlah: 1, color: "#eab308" },
  { jenjang: "Pesantren", jumlah: 3, color: "#8b5cf6" },
];

// Akreditasi — DUMMY (tandai dengan catatan "* estimasi")
const akreditasiData = [
  { status: "Akreditasi A (Unggul)", jumlah: 2, color: "#10b981" },
  { status: "Akreditasi B (Baik Sekali)", jumlah: 3, color: "#3b82f6" },
  { status: "Akreditasi C (Baik)", jumlah: 1, color: "#f59e0b" },
  { status: "Belum Terakreditasi", jumlah: 2, color: "#9ca3af" },
];

// Travel time — berdasarkan hasil network analysis
const travelTimeData = [
  { sekolah: "SMK NU Darussalam", zona: "< 5 Menit" },
  { sekolah: "Ponpes Salaf Darussalam", zona: "< 5 Menit" },
  { sekolah: "SMP AL-Amiriyyah", zona: "< 5 Menit" },
  { sekolah: "Ponpes Darussalam", zona: "5–10 Menit" },
  { sekolah: "SD Negeri 1 Rejoagung", zona: "5–10 Menit" },
  { sekolah: "SD Negeri 2 Rejoagung", zona: "5–10 Menit" },
  { sekolah: "TK Khadijah 203 Rejoagung", zona: "5–10 Menit" },
  { sekolah: "Ponpes Manbaul Ulum", zona: "> 10 Menit" },
];

// Coverage Index — DUMMY ESTIMASI
const coverageIndex = 73; // persen pemukiman dalam zona aman (< 10 menit)
```

**5 Cards Layout:**

1. **Card 1 (Makro):** Full-width card — "8 Sekolah Terdata di Desa Rejoagung"
2. **Card 2 (Bar Chart Jenjang):** `<BarChart>` dengan warna per jenjang
3. **Card 3 (Pie Chart Akreditasi):** `<PieChart>` distribusi akreditasi + catatan `* data estimasi`
4. **Card 4 (Travel Time List):** CSS Grid List 3 kolom (< 5 Menit | 5-10 Menit | > 10 Menit) — **BUKAN `<Table>` dari shadcn** karena belum diinstall
5. **Card 5 (Coverage Index):** Progress bar besar + persentase prominan + label `* estimasi`

---

### File 4: `src/components/analytics/LandPotentialMetrics.tsx` — [NEW]

**Tidak perlu `"use client";`**.  
Data langsung di-hardcode dari properties `dusun.geojson` yang sudah dibaca.

**4 Dusun Card Layout** `grid grid-cols-1 md:grid-cols-2 gap-6`:

Setiap card menggunakan `shadcn/ui <Card>` dengan anatomi:

```
<Card>
  <CardHeader>
    <Badge>Tingkat Potensi Ekonomi</Badge>
    <CardTitle>Sumberagung</CardTitle>
    <CardDescription>Produksi Padi: 6.4 ton/ha · IP: 200</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    📦 Zonasi Potensi Utama
       → Komoditas Pertanian: Padi Sawah
       → Jenis Tanaman: Padi, Jagung, Pisang
       → Hortikultura: Pisang, Pepaya
    
    ⚡ Energi Terbarukan
       → PLTS Atap, Biogas Ternak
    
    🐟 Peternakan & Perikanan
       → Sapi, Kambing, Ayam | Nila, Lele
    
    💡 Rekomendasi Kebijakan
    [blok muted border-l-4]
       "Intensifikasi SRI, Sambung Samping Kakao, ..."
  </CardContent>
</Card>
```

**Data per Dusun dari `dusun.geojson`:**

| Field GeoJSON | Digunakan Di |
|---|---|
| `dusun` | CardTitle |
| `Tingkat Potensi Ekonomi` | Badge warna (Sangat Tinggi=green, Tinggi=blue) |
| `Produksi Padi (ton/ha)` + `IP Padi` | CardDescription |
| `Komoditas Pertanian`, `Jenis Tanaman`, `Horikultura` | Blok "Zonasi Potensi" |
| `Energi Terbarukan` | Blok "Energi" |
| `Jenis Hewan Ternak`, `Jenis Ikan Ternak` | Blok "Peternakan & Perikanan" |
| `Rekomendasi` | Blok muted border-l-4 |

---

### File 5: `src/components/analytics/analyticsDashboard.tsx` — [MODIFY]

Slim-down: **hapus semua data dan sub-komponen lama**, ganti menjadi layout-only wrapper.

```tsx
"use client";
import AssetMetrics from "./AssetMetrics";
import EducationMetrics from "./EducationMetrics";
import LandPotentialMetrics from "./LandPotentialMetrics";

export default function AnalyticsDashboard() {
  return (
    <div className="w-full h-full overflow-y-auto space-y-8 p-4 md:p-6 pb-12">
      
      <section>
        <h2 className="text-xl font-bold text-primary mb-4">🏛️ Aset & Infrastruktur Desa</h2>
        <AssetMetrics />
      </section>

      <hr className="border-border" />

      <section>
        <h2 className="text-xl font-bold text-primary mb-4">🏫 Aksesibilitas Pendidikan</h2>
        <EducationMetrics />
      </section>

      <hr className="border-border" />

      <section>
        <h2 className="text-xl font-bold text-primary mb-4">🌾 Potensi Lahan & SDA per Dusun</h2>
        <LandPotentialMetrics />
      </section>

    </div>
  );
}
```

---

## Urutan Eksekusi (Checklist)

> [!IMPORTANT]
> Ikuti urutan ini untuk menghindari import error!

- [ ] **Step 1:** Buat folder `src/constants/` dan file `assetsSummary.ts`
- [ ] **Step 2:** Buat `AssetMetrics.tsx` (import dari constants + Recharts)
- [ ] **Step 3:** Buat `EducationMetrics.tsx` (data hardcoded + Recharts + CSS grid list)
- [ ] **Step 4:** Buat `LandPotentialMetrics.tsx` (data dari dusun.geojson → hardcoded)
- [ ] **Step 5:** Modifikasi `analyticsDashboard.tsx` (slim-down ke layout-only)
- [ ] **Step 6:** Jalankan dev server, buka Dashboard Analytics, verifikasi semua section

---

## Catatan untuk Data Dummy

> [!NOTE]
> Komponen `EducationMetrics.tsx` mengandung beberapa **dummy/estimasi data** yang harus ditandai secara visual di UI dengan label `* estimasi` atau `* data sementara` agar tidak menyesatkan pengguna:
> - Data Akreditasi (belum ada data asli)
> - Coverage Index 73% (estimasi berdasarkan service area)
>
> Ketika data asli tersedia, cukup update nilai di konstanta yang sudah ada.
