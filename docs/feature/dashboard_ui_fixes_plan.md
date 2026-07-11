# Implementation Plan: Dashboard UI Fixes (Fonts & Icons)

This document outlines the steps to standardize the dashboard typography and replace hardcoded emojis with the `Icon` component for the `AssetMetrics` and `EducationMetrics` components.

## 1. Icon Replacement in `assetsSummary.ts`

Currently, `assetsSummary` uses emojis for the `icon` field. We will update these to match valid Google Material Symbols Outlined names so they can be rendered using the `Icon` component.

**Changes to make in `src/constants/assetsSummary.ts`:**
*   Change `"🏛️"` to `"account_balance"` (Total Aset Terdata)
*   Change `"📐"` to `"square_foot"` (Total Luas Tanah)
*   Change `"🏷️"` to `"category"` (Jumlah Kategori)
*   Change `"⚠️"` to `"warning"` (Belum Diverifikasi)

## 2. Update `AssetMetrics.tsx`

We need to render the `<Icon />` component instead of plain text, and we need to standardize the font used for the large numbers to match the `.display-metric` utility class used in `analyticsDashboard.tsx`.

**Changes to make:**
1.  **Import Icon:** Add `import Icon from "@/components/ui/Icon";` at the top of the file.
2.  **Render Icon:** In the `CardContent`, replace:
    ```tsx
    <span className="text-2xl">{stat.icon}</span>
    ```
    with:
    ```tsx
    <Icon name={stat.icon} size={28} className="text-[var(--on-surface)]" />
    ```
3.  **Standardize Typography:** Replace the `<p>` tag wrapping the big number (`{stat.value}`):
    ```tsx
    <p className="text-3xl font-bold text-gray-900 leading-none">
    ```
    with the Design System class:
    ```tsx
    <p className="display-metric text-[var(--on-surface)]">
    ```

## 3. Update `EducationMetrics.tsx`

The big numbers in the "Key Metrics Row" currently use long, hardcoded Tailwind classes like `text-2xl font-extrabold tracking-tight font-[var(--font-geist-sans)]`. We will standardize these to use the `.display-metric` class so they perfectly match the metrics in other components.

**Changes to make:**
Update the `<p>` tags for the three metrics:
*   **Total Lembaga:** Change to `<p className="display-metric text-[var(--on-surface)]">11</p>`
*   **Cakupan Akses:** Change to `<p className="display-metric text-[var(--primary)]">{coverageIndex}%</p>`
*   **Zona Aman:** Change to `<p className="display-metric text-emerald-600">8</p>`

---

## FAQ: Bagaimana Cara Mengecilkan Ukuran Font?

Jika Anda merasa ukuran font masih terlalu besar, ada 2 cara utama untuk mengecilkannya di dalam arsitektur Tailwind CSS ini:

### 1. Menggunakan Utility Class Bawaan Tailwind
Ubah ukuran font langsung di atribut `className` pada komponen (misal pada `<p className="...">`). Urutan ukurannya dari besar ke kecil:
*   `text-3xl` (30px)
*   `text-2xl` (24px)
*   `text-xl` (20px)
*   `text-lg` (18px)
*   `text-base` (16px) -> *Ukuran normal*
*   `text-sm` (14px)
*   `text-xs` (12px)

### 2. Mengubah Design System Global (Rekomendasi)
Karena proyek ini sudah menggunakan token desain M3 di dalam file `src/app/globals.css`, cara terbaik dan paling seragam untuk mengecilkan *semua* font angka-angka besar di aplikasi adalah dengan mengubah *class* `.display-metric` itu sendiri.

Buka file **`src/app/globals.css`**, cari *class* `.display-metric` (sekitar baris 199), dan ubah nilai `font-size`-nya:

```css
  /* Sebelum */
  .display-metric {
    font-size: 1.875rem; /* text-3xl (30px) */
    ...
  }

  /* Sesudah (Dikecilkan menjadi 24px) */
  .display-metric {
    font-size: 1.5rem;   /* text-2xl (24px) */
    ...
  }
```
Metode ini akan memastikan semua kartu yang menggunakan *class* `.display-metric` mengecil secara otomatis dan seragam.
