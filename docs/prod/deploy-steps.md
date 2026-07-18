# Deploy Steps: Vercel & Cloudflare Pages (Free Tier)

**Project:** Interactive Web GIS Platform for Rejoagung Village 2026
**Prasyarat:** Migrasi tooling npm → pnpm+bun sudah selesai (lihat [`migration-steps.md`](./migration-steps.md)), `pnpm-lock.yaml` sudah ter-commit.

---

## Temuan Pre-Deploy (Kenapa Rekomendasi di Bawah Begini)

Dicek langsung ke source code sebelum nulis doc ini:

| Item | Temuan |
| :--- | :--- |
| `src/app/api/` (API Routes) | **Gak ada.** |
| `middleware.ts` | **Gak ada.** |
| Server Actions / ISR / dynamic server features | **Gak ada** — semua data statis (`.geojson` di `public/data/`), semua komponen `"use client"`. |
| `next/image` usage | Ada, di `AsetfasumModal.tsx` & `SekolahModal.tsx` (fitur foto kondisional dari Poin 5 todo). Datanya (`ASET_FOTO`, `SEKOLAH_DATA.foto`) **masih kosong semua** saat ini, tapi bakal keisi begitu Poin 8 todo (revisi data) jalan. |
| Git remote | `github.com/Xiation/sig-rejoagung`, branch aktif `gis-rjg-V1.1`. |

**Kesimpulan:** App ini gak butuh server runtime sama sekali — cocok banget dipakein Next.js **Static Export** (`output: "export"`), bukan mode SSR/hybrid default. Ini juga literally paradigma yang udah dinyatakan di PRD/TRD project ("Zero-Backend, Zero-Database, Client-Side Rendering"), jadi bukan cuma trik biar gampang deploy — ini arsitektur yang emang seharusnya dipakai.

**Kenapa ini penting buat Cloudflare khususnya:** tanpa static export, deploy Next.js ke Cloudflare Pages butuh adapter tambahan (`@cloudflare/next-on-pages`) yang lebih ribet & ada berbagai compatibility caveat (jalan di Cloudflare Workers runtime, bukan Node biasa). Dengan static export, Cloudflare Pages cukup serve folder `out/` sebagai file statis — simpel, gak ada adapter, gak ada runtime compatibility risk.

**Kenapa `next/image` perlu disetel `unoptimized: true`:** Next Image Optimization API butuh server runtime buat transform gambar on-the-fly — gak jalan di static export sama sekali (build bakal error kalau gak disetel ini). Ini juga konsisten sama yang udah dibahas soal foto aset sebelumnya: format WebP di-compress manual sendiri (bukan andelin runtime optimization), karena Vercel & Cloudflare beda dukungan buat fitur itu. `unoptimized: true` bikin `next/image` jadi cuma `<img>` biasa (masih dapet lazy-load & `sizes`/responsive dari markup-nya), tanpa gantung fitur platform-specific.

---

## Step 1 — Setel Static Export di `next.config.ts`

Buka `next.config.ts`, tambah 2 field:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

---

## Step 2 — Build & Verifikasi Lokal Dulu

```bash
bun run build
```

Verifikasi folder `out/` muncul di root project (bukan cuma `.next/`).

Smoke-test folder statis ini SEBELUM push ke hosting — jalanin static server sederhana:

```bash
npx serve out
```

Buka URL yang muncul (biasanya `http://localhost:3000`), cek:
- Dashboard + Macro Scorecard render.
- Ketiga modul peta (Aset & Fasum, Potensi Lahan, Akses Sekolah) — Leaflet render, marker/polygon kebuka jadi `InfoModal`.
- Gak ada 404 di Network tab buat file `.geojson` di `/data/...`.

Kalau ada yang patah di sini, **jangan lanjut deploy** — benerin dulu (biasanya soal path relatif, cek lagi fetch URL di layer components pakai path absolut `/data/...`, bukan relatif).

---

## Step 3 — Push ke GitHub

```bash
git add next.config.ts
git commit -m "chore: enable static export for Vercel/Cloudflare deploy"
git push origin gis-rjg-V1.1
```

*(Kalau mau deploy dari `main`, merge branch ini ke `main` dulu — tergantung workflow yang lo mau pakai.)*

---

## Step 4A — Deploy ke Vercel (Free / Hobby Plan)

1. Buka [vercel.com](https://vercel.com), **Sign Up / Log In pakai akun GitHub** (`Xiation`).
2. **Add New... > Project**.
3. Pilih repo `Xiation/sig-rejoagung`, klik **Import**.
4. **Framework Preset:** otomatis kedeteksi `Next.js` — biarin default.
5. **Build & Output Settings:** biarin default juga (Vercel otomatis detect `pnpm-lock.yaml` → jalanin `pnpm install` + `pnpm run build`, dan otomatis serve folder `out/` karena `output: "export"` di config).
6. **Environment Variables:** kosongin — project ini gak punya env var (zero-backend, gak ada API key).
7. Klik **Deploy**. Tunggu build selesai (~1-3 menit).
8. Dapet URL gratis format `sig-rejoagung.vercel.app` (atau custom subdomain, bisa diganti di **Project Settings > Domains**).

**Catatan penting soal Vercel Hobby (Free) plan:** plan gratisnya secara *Terms of Service* diperuntukkan buat **penggunaan personal/non-komersial**. Web GIS desa ini semi-institusional (proyek KKN-PPM UGM buat pemerintah desa) — kemungkinan besar masih aman (non-profit, non-komersial), tapi worth diketahui kalau suatu saat Vercel mempermasalahkan. Cloudflare Pages Free (Step 4B) gak punya pembatasan sejenis ini.

---

## Step 4B — Deploy ke Cloudflare Pages (Free Plan)

1. Buka [dash.cloudflare.com](https://dash.cloudflare.com), **Sign Up / Log In**.
2. Sidebar **Workers & Pages > Create > Pages > Connect to Git**.
3. Authorize akses ke GitHub, pilih repo `Xiation/sig-rejoagung`.
4. **Set up builds and deployments:**
   - **Framework preset:** pilih `Next.js (Static HTML Export)` kalau ada opsinya, atau `None` kalau gak ketemu (isi manual di bawah).
   - **Build command:** `pnpm run build`
   - **Build output directory:** `out`
5. **Environment Variables (Advanced):** kalau Cloudflare gagal auto-detect pnpm, tambah:
   - `PNPM_VERSION` = versi pnpm lokal lo (cek `pnpm -v`).
6. Klik **Save and Deploy**. Tunggu build selesai.
7. Dapet URL gratis format `sig-rejoagung.pages.dev` (custom domain bisa diikat gratis juga di **Custom domains**).

Cloudflare Pages Free plan: unlimited bandwidth & request, gak ada pembatasan komersial/non-komersial — lebih lega buat project institusional kayak ini.

---

## Step 5 — Smoke-Test Kedua Deploy (Wajib, Bukan Opsional)

Ikutin checklist yang sama kayak `pre_production_todo.md` Poin 7:

- [ ] Buka URL Vercel (`*.vercel.app`) — dashboard + 3 modul peta, klik minimal 1 marker/polygon tiap modul.
- [ ] Buka URL Cloudflare (`*.pages.dev`) — ulangi checklist yang sama.
- [ ] Cek Network tab di kedua deploy — pastikan semua fetch `.geojson` return `200`, bukan `404`.
- [ ] Cek Lighthouse score (DevTools > Lighthouse) di salah satu deploy — TRD/PRD nyebut target `≥85` di mobile profile.
- [ ] Catat hasil (mana yang mulus, mana yang ada masalah) balik ke `pre_production_todo.md` Poin 7.

---

## Rollback / Redeploy

Kedua platform auto-redeploy tiap `git push` ke branch yang di-connect — gak perlu langkah manual buat update. Kalau deploy baru rusak:

- **Vercel:** Project > Deployments > pilih deployment lama yang sehat > **Promote to Production**.
- **Cloudflare Pages:** Workers & Pages > project > Deployments > pilih deployment lama > **Rollback to this deployment**.

Kalau mau matiin static export (balik ke mode SSR default Next.js) — hapus `output: "export"` dan `images.unoptimized` dari `next.config.ts`. Vercel tetap jalan normal (native SSR support). Cloudflare Pages di mode ini **butuh** `@cloudflare/next-on-pages` adapter — di luar scope doc ini, cuma relevan kalau nanti app butuh fitur server-side beneran (API routes, dst — lihat Poin 9 todo soal Service Layer).
