# Fix: Konsistensi Warna Analytics Dashboard (Chart, Badge "2026", Icon)

**Belum diterapkan ke kode — user minta ditaro di sini dulu, apply manual sendiri.**

## Masalah

Warna di Analytics Dashboard kebanyakan "pelangi" — tiap kategori/chart pakai hue acak (biru, ungu, oranye, cyan, pink, dst) tanpa pola, kesannya generic/AI slop. Referensi: `docs/DESIGN/new_colorbase/dashboard.md` — sistem 80/20: mayoritas netral (slate), emerald (`#059669`) cuma buat aksen brand/dominant, amber buat warning, rose buat threat/error. Untuk chart multi-kategori, dokumen itu eksplisit kasih 3 famili: **Agricultural → Emerald tones**, **Livestock/Energy → Slate & Cool Blues**, **Zoning/Education → Warm Terracotta & Amber**.

**Dikecualikan (sudah konsisten, JANGAN diubah):** chart "Produksi Pertanian & Perkebunan (Ton/Tahun)" di `LandPotentialMetrics.tsx` (`KATEGORI_COLORS` di `src/constants/produksiPertanian.ts`).

## Catatan Penting Sebelum Apply

`categoryData` di `src/constants/assetsSummary.ts` (dipakai chart "Rekapitulasi per Kategori Aset") **dipakai bareng** sama `AsetfasumModal.tsx` buat nentuin warna marker/badge kategori aset **di peta**. Kalau field `color`/`accentClass` di situ diubah, warna marker peta ikut berubah — bukan cuma chart dashboard.

**Keputusan:** `categoryData` (dan marker peta) **TIDAK disentuh**. Chart dashboard-nya dikasih palet warna lokal terpisah (`CATEGORY_CHART_COLORS` di `AssetMetrics.tsx`), jadi konsisten di dashboard tanpa ganggu warna peta. Kalau kamu justru MAU warna peta ikut berubah juga, bilang aja — tinggal pakai `categoryData[].color` langsung kayak sebelumnya, cuma value warnanya diganti ke palet baru.

`JENJANG_COLORS` di `src/constants/sekolahData.ts` dipakai bareng `SekolahModal.tsx` (chip jenjang di modal detail sekolah) — bukan warna marker peta (marker sekolah pakai warna hardcoded sendiri di `SekolahLayer.tsx`, gak kesentuh). Jadi aman diubah, cuma chip modal ikut berubah warnanya (masih masuk akal, sama-sama bagian "Education").

---

## 1. Macro Scorecard — kartu "Dominasi Topografi" (ungu → netral)

File: `src/constants/macroKpis.ts`

Ungu (`violet`) di kartu topografi gak punya makna semantik (bukan warning/error/success) — turunin ke netral slate, samain pola sama kartu "Dusun Terpetakan" yang udah netral. Kartu "Indeks Pertanaman" (amber) **dibiarin** — itu sudah tepat secara semantik (status "Musim Tanam Aktif" = transient/warning state, sesuai definisi Warning di dashboard.md).

```diff
   {
     id: "topografi",
     label: "Dominasi Topografi",
     value: "Datar",
     unit: "– Landai",
     icon: "terrain",
     watermark: "landscape",
-    iconBg: "bg-violet-50",
-    iconColor: "text-violet-600",
+    iconBg: "bg-[var(--surface-container)]",
+    iconColor: "text-[var(--secondary)]",
     valueColor: "text-[var(--on-surface)]",
   },
```

---

## 2. Badge "2026" di KPI Card Aset — samain semua warna

File: `src/constants/assetsSummary.ts`

Tiap kartu (`Total Aset`, `Total Luas`, `Jumlah Kategori`, `Belum Diverifikasi`) punya `accentColor` beda-beda (biru/emerald/ungu/amber) yang dipakai buat warnain badge "2026". Hapus field ini — badge disamain jadi emerald (brand) di semua kartu.

```diff
 export const assetsSummary = [
     {
     id: "total-aset",
     label: "Total Aset Terdata",
     value: "44",
     unit: "aset",
     icon: "account_balance",
-    accentColor: "#1d4ed8",
     bgColor: "#eff6ff",
     borderColor: "#bfdbfe",
   },
   {
     id: "total-luas",
     label: "Total Luas Tanah",
     value: "44,768",
     unit: "m²",
     icon: "square_foot",
-    accentColor: "#059669",
     bgColor: "#f0fdf4",
     borderColor: "#bbf7d0",
   },
   {
     id: "jumlah-kategori",
     label: "Jumlah Kategori",
     value: "4",
     unit: "kategori",
     icon: "category",
-    accentColor: "#7c3aed",
     bgColor: "#faf5ff",
     borderColor: "#ddd6fe",
   },
   {
     id: "belum-verifikasi",
     label: "Belum Diverifikasi",
     value: "7",
     unit: "aset",
     icon: "warning",
-    accentColor: "#d97706",
     bgColor: "#fffbeb",
     borderColor: "#fde68a",
   },
 ];
```

*(`bgColor`/`borderColor` di atas udah gak kepake dari sebelumnya — pre-existing dead code, dibiarin apa adanya, gak termasuk scope fix ini.)*

File: `src/components/analytics/AssetMetrics.tsx` — badge JSX, ganti inline style per-card jadi kelas statis emerald:

```diff
               <div className="flex items-center justify-between">
                 <Icon name={stat.icon} size={28} className="text-[var(--on-surface)]" />
-                <span
-                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
-                  style={{
-                    backgroundColor: stat.accentColor + "20",
-                    color: stat.accentColor,
-                  }}
-                >
+                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--primary-container)] text-[var(--primary)]">
                   2026
                 </span>
               </div>
```

---

## 3. Chart "Distribusi Status Kepemilikan" (donut) — mapping semantik

File: `src/constants/assetsSummary.ts`

5 status di-mapping ke makna semantiknya: Hak Milik = kondisi baik → emerald (success). Belum Terverifikasi = transient → amber (warning, dipertahanin). Kosong/Tanpa Dokumen = risiko → rose (threat/error). Hak Wakaf & Hak Pakai gak punya makna warning/error → netral slate (2 shade beda biar tetep kebeda di chart).

```diff
 export const ownershipData = [
-    { status: "Hak Milik", jumlah: 25, persen: 56.8, color: "#10b981" },
-  { status: "Belum Terverifikasi", jumlah: 6, persen: 13.6, color: "#f59e0b" },
-  { status: "Hak Wakaf", jumlah: 8, persen: 18.2, color: "#3b82f6" },
-  { status: "Kosong / Tanpa Dokumen", jumlah: 4, persen: 9.1, color: "#ef4444" },
-  { status: "Hak Pakai", jumlah: 1, persen: 2.3, color: "#8b5cf6" },
+    { status: "Hak Milik", jumlah: 25, persen: 56.8, color: "#059669" },
+  { status: "Belum Terverifikasi", jumlah: 6, persen: 13.6, color: "#f59e0b" },
+  { status: "Hak Wakaf", jumlah: 8, persen: 18.2, color: "#64748b" },
+  { status: "Kosong / Tanpa Dokumen", jumlah: 4, persen: 9.1, color: "#e11d48" },
+  { status: "Hak Pakai", jumlah: 1, persen: 2.3, color: "#94a3b8" },
 ];
```

---

## 4. Chart "Rekapitulasi per Kategori Aset" (bar) — palet lokal, gak sentuh warna peta

File: `src/components/analytics/AssetMetrics.tsx`

Tambah palet lokal (1 emerald aksen + gradasi slate) — dipakai buat `<Cell fill>` chart ini doang, **gak** ganti `categoryData[].color` (biar marker peta gak ikut berubah, lihat catatan di atas).

```diff
 import {
     assetsSummary, categoryData, ownershipData
 } from "@/constants/assetsSummary";
 import Icon from "@/components/ui/Icon";
 
+// Palet lokal khusus chart dashboard — TIDAK ganti categoryData[].color (dipakai bareng
+// AsetfasumModal.tsx buat warna marker/badge kategori di peta), biar peta gak ikut berubah.
+const CATEGORY_CHART_COLORS = ["#059669", "#475569", "#94a3b8", "#64748b", "#cbd5e1"];
+
 export default function AssetMetrics(){
```

```diff
                   <Bar dataKey="jumlah" radius={[4, 4, 0, 0]}>
                     {categoryData.map((entry, index) => (
-                      <Cell key={index} fill={entry.color} />
+                      <Cell key={index} fill={CATEGORY_CHART_COLORS[index % CATEGORY_CHART_COLORS.length]} />
                     ))}
                   </Bar>
```

---

## 5. Header "Aksesibilitas Pendidikan" (icon + badge biru → samain pola LandPotentialMetrics)

File: `src/components/analytics/EducationMetrics.tsx`

`LandPotentialMetrics.tsx` udah pakai pola header netral+emerald (`bg-[var(--surface-container)]` icon box, `bg-[var(--primary-container)]` badge). `EducationMetrics.tsx` masih biru sendiri — disamain.

```diff
       <div className="px-5 py-4 border-b border-[var(--outline-variant)]/60 flex items-center gap-2 sm:gap-3">
-        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100 shrink-0">
-          <Icon name="school" size={18} className="text-blue-600" />
+        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[var(--surface-container)] rounded-lg flex items-center justify-center border border-[var(--outline-variant)] shrink-0">
+          <Icon name="school" size={18} className="text-[var(--primary)]" />
         </div>
         <div className="flex-1 min-w-0">
           <p className="section-header text-[var(--on-surface)] truncate">Aksesibilitas Pendidikan</p>
         </div>
-        <span className="shrink-0 label-caps px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
+        <span className="shrink-0 label-caps px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[var(--primary-container)] text-[var(--on-primary-container)] border border-emerald-200">
           {totalLembaga}<span className="hidden sm:inline"> lembaga</span>
         </span>
       </div>
```

---

## 6. Chart "Per Jenjang" (bar) — rainbow → gradasi Warm Terracotta & Amber

File: `src/constants/sekolahData.ts`

`dashboard.md` eksplisit nyebut famili warna buat Education: **Warm Terracotta & Amber**. 6 jenjang di-mapping jadi 1 gradasi (bukan 6 hue acak: pink/merah/biru/kuning/ungu/cyan), urutannya ngikutin `JENJANG_ORDER` (TK→SLB) biar keliatan gradasi di chart.

```diff
 export const JENJANG_COLORS: Record<string, string> = {
-  TK: "#ec4899",
-  SD: "#ef4444",
-  "SD/MI": "#ef4444",
-  "SMP/MTs": "#3b82f6",
-  SMP: "#3b82f6",
-  SMK: "#eab308",
-  Pesantren: "#8b5cf6",
-  SLB: "#06b6d4",
+  TK: "#9a3412",
+  SD: "#c2410c",
+  "SD/MI": "#c2410c",
+  "SMP/MTs": "#ea580c",
+  SMP: "#ea580c",
+  SMK: "#f97316",
+  Pesantren: "#fb923c",
+  SLB: "#fdba74",
 };
```

*(Chip jenjang di `SekolahModal.tsx` ikut kebawa warna baru ini — masih relevan, sama-sama modul Education, bukan warna peta.)*

## 7. Chart "Waktu Tempuh" (zona) — "merah" → "rose" (align token)

File: `src/components/analytics/EducationMetrics.tsx`

Zona `< 10 Menit`/`10–30 Menit` udah semantik (hijau=aman, amber=waspada), dipertahanin. `30–60 Menit` pakai `#ef4444` ("red" generik) — diganti ke rose (`#e11d48`) biar konsisten sama token "Threat" yang dipakai di chart ownership (poin 3).

```diff
 const ZONA_ORDER: Array<{ label: string; color: string }> = [
   { label: "< 10 Menit", color: "#10b981" },
   { label: "10–30 Menit", color: "#f59e0b" },
-  { label: "30–60 Menit", color: "#ef4444" },
+  { label: "30–60 Menit", color: "#e11d48" },
 ];
```

---

## 8. Chart "Frekuensi Distribusi Sektor SDA antar Dusun" (bar) — rainbow → 3 famili domain

File: `src/constants/landPotential.ts`

8 sektor beda domain, di-mapping ke 3 famili sesuai `dashboard.md`: **Agricultural (Padi, Kakao) → Emerald**, **Livestock (Sapi) & Energy/Aquaculture (PLTS, Biogas, Nila, Udang Galah) → Slate & Cool Blues**, sisanya (Agrowisata, gak masuk kategori manapun di dokumen) → netral slate.

```diff
 export const resourceFrequency = [
-  { nama: "PLTS Atap", jumlah: 4, color: "#f59e0b" },
-  { nama: "Padi", jumlah: 4, color: "#10b981" },
-  { nama: "Sapi", jumlah: 2, color: "#ef4444" },
-  { nama: "Nila", jumlah: 3, color: "#3b82f6" },
-  { nama: "Biogas", jumlah: 3, color: "#8b5cf6" },
-  { nama: "Kakao", jumlah: 2, color: "#92400e" },
-  { nama: "Udang Galah", jumlah: 2, color: "#0891b2" },
-  { nama: "Agrowisata", jumlah: 4, color: "#16a34a" },
+  { nama: "PLTS Atap", jumlah: 4, color: "#0ea5e9" },
+  { nama: "Padi", jumlah: 4, color: "#059669" },
+  { nama: "Sapi", jumlah: 2, color: "#64748b" },
+  { nama: "Nila", jumlah: 3, color: "#0284c7" },
+  { nama: "Biogas", jumlah: 3, color: "#38bdf8" },
+  { nama: "Kakao", jumlah: 2, color: "#10b981" },
+  { nama: "Udang Galah", jumlah: 2, color: "#0369a1" },
+  { nama: "Agrowisata", jumlah: 4, color: "#94a3b8" },
 ];
```

---

## Ringkasan Palet Final

| Famili | Hex | Dipakai di |
|---|---|---|
| Emerald (brand/success/agri) | `#059669`, `#10b981` | Badge "2026", donut Hak Milik, bar Padi/Kakao, header icon Education |
| Amber (warning) | `#f59e0b` | Donut Belum Terverifikasi, zona 10–30 menit, kartu IP (gak berubah) |
| Rose (threat/error) | `#e11d48` | Donut Kosong/Tanpa Dokumen, zona 30–60 menit |
| Slate (netral) | `#475569`/`#64748b`/`#94a3b8`/`#cbd5e1` | Kategori aset (chart lokal), donut Hak Wakaf/Hak Pakai, kartu Topografi, Sapi/Agrowisata |
| Cool Blue (energy/aquaculture) | `#0ea5e9`/`#0284c7`/`#38bdf8`/`#0369a1` | PLTS/Biogas/Nila/Udang Galah |
| Warm Terracotta→Amber (education ramp) | `#9a3412` → `#fdba74` | Chart "Per Jenjang" (6 shade) |

**Gak diubah:** `KATEGORI_COLORS` (Produksi Pertanian & Perkebunan), `categoryData[].color`/`accentClass` (warna marker peta Aset & Fasum), warna marker `SekolahLayer.tsx`, semantic Badge "Matriks Ancaman SDA" (rose, udah bener).

## Verifikasi (setelah apply manual)
1. `npx tsc --noEmit` — pastiin clean.
2. Visual: buka Analytics Dashboard, cek semua chart di atas gak lagi "pelangi", badge "2026" sama di 4 kartu aset, header Education netral+emerald samain LandPotential.
3. Cek peta modul **Aset & Fasum** — pastiin warna marker/legend **gak berubah** (karena `categoryData` sengaja gak disentuh).
