# Fix: Layout PotensiModal.tsx — Bento Grid & Token Consistency

**Belum diterapkan ke kode — taro di sini dulu, apply manual sendiri.**

Referensi: `docs/DESIGN/new_colorbase/potensi_design.md`

## Yang Sudah Sesuai (gak diubah)

- **Peternakan & Perikanan pakai tint biru** — ini BENER, bukan bug. `dashboard.md` (sistem warna yang sama) eksplisit nentuin famili **"Livestock/Energy → Slate & Cool Blues"**, dan section ini literally peternakan/perikanan. Dibiarin.
- **Label Caps** buat sub-label — udah konsisten (`label-caps` dipakai di semua tempat).
- **Font header** — `headline-lg` udah pakai `--font-geist-sans` bold, sesuai maksud "Display Header Bold" di dokumen.
- **Ancaman (rose) / Rekomendasi (emerald)** — udah pakai `--error-container`/`--success-container`, sesuai "Urgency Levels" di dokumen.

## Gap yang Difix

### 1. Badge Level Potensi — hex hardcoded + biru gak semantik → token emerald 2-shade

Data aktual (`Potensi_Dusun.geojson`) cuma punya 2 level: **"Sangat Tinggi"** dan **"Tinggi"** — dua-duanya level POSITIF, bukan 2 kategori beda makna. Kode sekarang malah kasih warna beda genus (hijau vs **biru**) pakai hex mentah (`#dcfce7`/`#dbeafe`, dst) — biru di sini gak ada dasar semantiknya (bukan livestock/energy kayak section Peternakan). Dokumen bilang badge ini "Brand Anchor" → emerald. Fix: 1 famili emerald, dibedain intensitas aja (Sangat Tinggi = solid, Tinggi = tint lebih soft), full token — gak ada hex mentah lagi.

File: `src/components/map/content/PotensiModal.tsx`

```diff
         {level && (
-          <span
-            className="inline-block label-caps px-3 py-1.5 rounded-full shrink-0 border mt-1"
-            style={{
-              backgroundColor: isSangatTinggi ? "#dcfce7" : "#dbeafe",
-              color: isSangatTinggi ? "#15803d" : "#1d4ed8",
-              borderColor: isSangatTinggi ? "#bbf7d0" : "#bfdbfe",
-            }}
-          >
+          <span
+            className={`inline-block label-caps px-3 py-1.5 rounded-full shrink-0 border mt-1 ${
+              isSangatTinggi
+                ? "bg-[var(--primary-container)] text-[var(--on-primary-container)] border-emerald-200"
+                : "bg-emerald-50 text-emerald-600 border-emerald-100"
+            }`}
+          >
             ⭐ Potensi {level}
           </span>
         )}
```

### 2. Profil Geografis — dari 1 box linear-list jadi Bento Grid (top-level cards, Slate-50)

Dokumen: *"Macro-Geographic Cluster: ... presented as **top-level cards** with a neutral Slate-50 background"* — jamak, per-kartu, bukan 1 box isinya list ke bawah kayak sekarang. Fix: 6 field (Jenis Tanah, pH Tanah, Topografi, Elevasi, Kualitas Air, Sumber Air) masing-masing jadi kartu kecil sendiri dalam grid 2 kolom.

```diff
         {/* Kiri: Geographical Profile */}
         <div className="space-y-4">
           <p className="label-caps text-[var(--text-muted)]">Profil Geografis</p>
-          <div className="bg-[var(--surface-container-low)] rounded-xl border border-[var(--outline-variant)]/50 p-4 space-y-3">
-            <InfoRow label="Jenis Tanah" value={d["Jenis Tanah"]} icon="landscape" />
-            <InfoRow label="pH Tanah" value={d["pH Tanah"]} icon="science" />
-            <InfoRow label="Topografi" value={d["Topografi"]} icon="terrain" />
-            <InfoRow
-              label="Elevasi Rata-rata"
-              value={d["Elevasi Rata-rata (mdpl)"] ? `${d["Elevasi Rata-rata (mdpl)"]} mdpl` : undefined}
-              icon="altitude"
-            />
-            <InfoRow label="Kualitas Air" value={d["Kualitas Air"]} icon="water_drop" />
-            <InfoRow label="Sumber Air" value={d["Sumber Air"]} icon="waves" />
-          </div>
+          <div className="grid grid-cols-2 gap-3">
+            <div className="bg-[var(--surface-container-low)] rounded-2xl border border-[var(--outline-variant)]/50 p-3">
+              <InfoRow label="Jenis Tanah" value={d["Jenis Tanah"]} icon="landscape" />
+            </div>
+            <div className="bg-[var(--surface-container-low)] rounded-2xl border border-[var(--outline-variant)]/50 p-3">
+              <InfoRow label="pH Tanah" value={d["pH Tanah"]} icon="science" />
+            </div>
+            <div className="bg-[var(--surface-container-low)] rounded-2xl border border-[var(--outline-variant)]/50 p-3">
+              <InfoRow label="Topografi" value={d["Topografi"]} icon="terrain" />
+            </div>
+            <div className="bg-[var(--surface-container-low)] rounded-2xl border border-[var(--outline-variant)]/50 p-3">
+              <InfoRow
+                label="Elevasi Rata-rata"
+                value={d["Elevasi Rata-rata (mdpl)"] ? `${d["Elevasi Rata-rata (mdpl)"]} mdpl` : undefined}
+                icon="altitude"
+              />
+            </div>
+            <div className="bg-[var(--surface-container-low)] rounded-2xl border border-[var(--outline-variant)]/50 p-3">
+              <InfoRow label="Kualitas Air" value={d["Kualitas Air"]} icon="water_drop" />
+            </div>
+            <div className="bg-[var(--surface-container-low)] rounded-2xl border border-[var(--outline-variant)]/50 p-3">
+              <InfoRow label="Sumber Air" value={d["Sumber Air"]} icon="waves" />
+            </div>
+          </div>
         </div>
```

### 3. Radius konsistensi — `rounded-xl` → `rounded-2xl` di semua kartu konten

Dokumen: *"A consistent **rounded-2xl** (16px) corner radius"*. Shell modal (`InfoModal.tsx`) udah `rounded-2xl`, tapi kartu-kartu di dalam `PotensiModal.tsx` masih `rounded-xl` (12px) — beda radius antara shell & isi. Disamain ke `rounded-2xl`. (Icon box kecil `w-12 h-12` di header dibiarin `rounded-xl` — itu chip ikon, bukan "kartu konten" yang dimaksud dokumen.)

`SectionBlock` (dipakai 3x: Pertanian & Kebun, Peternakan & Perikanan, Infrastruktur & Ekonomi):
```diff
   return (
-    <div className={`rounded-xl border p-4 space-y-3 ${bgClass}`}>
+    <div className={`rounded-2xl border p-4 space-y-3 ${bgClass}`}>
```

Ancaman & Rekomendasi:
```diff
-        <div className="bg-[var(--error-container)] border border-rose-200 rounded-xl p-4">
+        <div className="bg-[var(--error-container)] border border-rose-200 rounded-2xl p-4">
```
```diff
-        <div className="bg-[var(--success-container)] border border-emerald-200 rounded-xl p-4">
+        <div className="bg-[var(--success-container)] border border-emerald-200 rounded-2xl p-4">
```

(Poin 2 di atas udah pakai `rounded-2xl` langsung buat kartu Profil Geografis, gak perlu diff terpisah.)

## Verifikasi (setelah apply manual)
1. `npx tsc --noEmit` — clean.
2. Buka modul Potensi Lahan, klik poligon dusun apapun → cek: badge level cuma 1 famili warna (emerald, beda intensitas doang), Profil Geografis keliatan sebagai 6 kartu kecil bento (bukan list panjang ke bawah), semua kartu konten radius-nya samaan (rounded-2xl), Peternakan & Perikanan tetep biru (itu emang bener).
