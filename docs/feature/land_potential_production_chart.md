# Spec: Grafik Produksi Pertanian & Perkebunan (LandPotentialMetrics.tsx)

Terkait `pre_production_todo.md` poin 1. Dokumen ini adalah **proposal kode**, belum di-paste ke `src/components/analytics/LandPotentialMetrics.tsx`. Review dulu, baru wiring ke komponen di sesi terpisah.

Data sumber sudah jadi file nyata: `src/constants/produksiPertanian.ts` (50 komoditas, 4 kategori: Perkebunan/Pangan/Buah/Sayur, satuan ton/tahun).

## Keputusan Desain
- **Tab switcher per kategori** — 4 pill button, klik ganti dataset chart. Menghindari 1 chart raksasa berisi 50 bar dengan skala nilai timpang (0.1 ton s/d 2812 ton).
- **Semua item ditampilkan penuh** (tidak top-N) — container `max-h-72 overflow-y-auto`, tinggi `ResponsiveContainer` dihitung dinamis (`items.length * 32px`) supaya chart “meluber” ke bawah dan bisa di-scroll, bukan dipotong.
- **Horizontal bar chart** (`layout="vertical"` di Recharts) — lebih terbaca untuk nama komoditas panjang dibanding label X-axis diputar.
- **Warna per kategori** (bukan per bar) — 1 warna solid saat kategori aktif, dari `KATEGORI_COLORS` di file constants.
- **Reuse existing:** `CustomTooltip` (unit="ton"), `Icon`, typography utilities (`label-caps`, `micro-copy`), divider pattern (`border-t border-[var(--outline-variant)]/60`) yang sudah dipakai di file ini.
- **Posisi penyisipan:** section baru full-width, setelah div two-column body (resourceFrequency chart + threat matrix, baris ~63-129 di file saat ini) dan sebelum div Executive Policy Summary.

## 1. Tambahan Import

```tsx
import { useState } from "react";
import { produksiPertanian, KATEGORI_LIST, KATEGORI_COLORS } from "@/constants/produksiPertanian";
```

`BarChart`, `Bar`, `XAxis`, `YAxis`, `Tooltip`, `Cell`, `ResponsiveContainer` sudah ter-import di file — tinggal reuse langsung.

## 2. Tambahan State & Derived Data (dalam function component, sebelum `return`)

```tsx
const [activeKategori, setActiveKategori] = useState<string>("Perkebunan");

const produksiKategori = produksiPertanian
  .filter((item) => item.kategori === activeKategori)
  .sort((a, b) => b.jumlah - a.jumlah);

const totalTonaseKategori = produksiKategori.reduce((sum, item) => sum + item.jumlah, 0);
```

## 3. Section JSX (sisip setelah two-column body, sebelum Executive Policy Summary)

```tsx
{/* ── Produksi Pertanian & Perkebunan ──────────────────────────────── */}
<div className="border-t border-[var(--outline-variant)]/60 p-5">
  <div className="flex items-center gap-2 mb-1">
    <Icon name="grass" size={16} className="text-[var(--primary)]" />
    <p className="label-caps text-[var(--text-muted)]">
      Produksi Pertanian & Perkebunan (Ton/Tahun)
    </p>
    <span className="ml-auto label-caps px-2.5 py-1 rounded-full bg-[var(--surface-container)] text-[var(--on-surface)] border border-[var(--outline-variant)]">
      Total {totalTonaseKategori.toLocaleString("id-ID")} ton
    </span>
  </div>
  <p className="micro-copy text-[var(--text-muted)] mb-3">
    Rekapitulasi hasil produksi per komoditas — pilih kategori untuk melihat rincian
  </p>

  {/* Tab switcher */}
  <div className="flex flex-wrap gap-2 mb-4">
    {KATEGORI_LIST.map((kategori) => (
      <button
        key={kategori}
        type="button"
        onClick={() => setActiveKategori(kategori)}
        className={`label-caps px-3 py-1.5 rounded-full border transition-colors ${
          activeKategori === kategori
            ? "bg-emerald-50 border-emerald-600 text-emerald-600"
            : "bg-white border-slate-200 text-slate-700"
        }`}
      >
        {kategori}
      </button>
    ))}
  </div>

  {/* Scrollable horizontal bar chart — semua item tampil, tidak di-top-N-kan */}
  <div className="max-h-72 overflow-y-auto">
    <ResponsiveContainer width="100%" height={Math.max(produksiKategori.length * 32, 120)}>
      <BarChart
        data={produksiKategori}
        layout="vertical"
        margin={{ top: 4, right: 24, bottom: 4, left: 8 }}
      >
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="komoditas"
          tick={{ fontSize: 11, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
          width={110}
        />
        <Tooltip content={<CustomTooltip unit="ton" />} />
        <Bar dataKey="jumlah" radius={[0, 4, 4, 0]} maxBarSize={18}>
          {produksiKategori.map((entry) => (
            <Cell key={entry.komoditas} fill={KATEGORI_COLORS[activeKategori]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
```

## Catatan Wiring
- `ResponsiveContainer height` diset angka eksplisit (bukan `"100%"`) supaya chart boleh lebih tinggi dari parent `max-h-72` — itu yang bikin `overflow-y-auto` bekerja (scroll), bukan chart ke-squeeze.
- `YAxis width={110}` perlu disesuaikan manual kalau ada nama komoditas yang kepotong (mis. "Mangga Harumanis", "Durian Musangking") — cek visual setelah wiring.
- Default tab `"Perkebunan"` mengikuti urutan kategori di `data_produksi_pertanian.md`. Bisa diganti default ke `"Pangan"` kalau mau langsung highlight Padi (komoditas terbesar).
