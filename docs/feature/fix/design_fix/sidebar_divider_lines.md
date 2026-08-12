# Fix: Hapus Garis Tipis di Sidebar (Brand Header & Footer)

**Belum diterapkan ke kode — user minta ditaro di sini dulu, apply manual sendiri.**

## Masalah

Di `src/components/Sidebar.tsx` ada 2 garis pembatas tipis (`border-b`/`border-t`, warna `[var(--outline-variant)]/40`) yang keliatan "AI slop" (generic/gak perlu):
1. Di bawah brand header ("Desa Rejoagung" / "GIS Platform 2026").
2. Di atas footer (tombol Export Data + status indicator).

## Fix

File: `src/components/Sidebar.tsx`

### 1. Brand Header (baris ~81)

```diff
  {/* ── Brand Header ── */}
- <div className="px-6 py-5 border-b border-[var(--outline-variant)]/40">
+ <div className="px-6 py-5">
```

### 2. Footer (baris ~154)

```diff
  {/* ── Footer — Export Data + Status ── */}
- <div className="p-4 border-t border-[var(--outline-variant)]/40 space-y-3">
+ <div className="p-4 space-y-3">
```

## Verifikasi
- `npx tsc --noEmit` — cek clean setelah apply.
- Visual: buka sidebar, pastikan gak ada garis tipis lagi di bawah header & di atas footer, spacing (`py-5`/`p-4`) tetep sama gak berubah.
