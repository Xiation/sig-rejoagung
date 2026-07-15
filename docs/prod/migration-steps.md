# Migration Steps: npm → pnpm + bun

**Project:** Interactive Web GIS Platform for Rejoagung Village 2026
**Refines:** [`dev-prod.md`](./dev-prod.md) — dokumen ini nambal beberapa gap yang ketemu pas ngecek environment nyata sebelum eksekusi.

---

## Temuan Pre-Migration (Environment Check)

Dicek di mesin dev sebelum nulis dokumen ini:

| Item | Status |
| :--- | :--- |
| `pnpm` | **Belum terpasang** — playbook sumber asumsi udah ada, nyatanya belum. |
| `bun` | Sudah terpasang (`1.3.14`). |
| `package-lock.json` | **Ter-track di git** — playbook sumber cuma `rm -rf` lokal, gak cukup, perlu `git rm`. |
| File config CI (`vercel.json`, `wrangler.toml`, GitHub Actions) | Gak ada — pengaturan build 100% di dashboard hosting. |
| `.gitignore` | Udah antisipasi `.pnpm-debug.log*`, belum ada `bun.lock`/`bun.lockb`. |
| Node / npm | `v24.18.0` / `11.16.0` — kompatibel, gak ada isu versi. |

---

## Step 1 — Pre-flight Check

Sebelum mulai, pastikan working tree bersih (migrasi tooling gak boleh nyampur sama kerjaan fitur yang belum di-commit).

```bash
git status
# Kalau ada perubahan pending: commit atau stash dulu
```

---

## Step 2 — Install pnpm via Corepack

**Jangan** `npm install -g pnpm` (nambah dependency global yang gak ke-pin versinya). Pakai Corepack (udah dibundel Node ≥16.9, dan Node 24 di mesin ini pasti punya):

```bash
corepack enable
corepack use pnpm@latest
```

`corepack use` otomatis nulis field `"packageManager": "pnpm@x.y.z"` ke `package.json` — mengunci versi persis biar reproducible di semua mesin/CI, bukan cuma "pnpm versi terbaru pas itu".

Bun gak perlu diinstall ulang (udah ada).

---

## Step 3 — Purge npm Traces

### Mac/Linux

```bash
rm -rf node_modules .next
git rm package-lock.json
```

### Windows (PowerShell)

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
git rm package-lock.json
```

**Kenapa `git rm`, bukan `rm` biasa:** `package-lock.json` di-track git di repo ini. `rm -rf` doang bakal muncul lagi tiap `git status` sebagai "deleted: package-lock.json" sampai di-stage manual — `git rm` sekali jalan hapus dari disk *dan* index.

*Catatan:* Jangan hapus `package.json` — itu blueprint project, cuma manager-nya yang ganti.

---

## Step 4 — Install via pnpm

```bash
pnpm install
```

Verifikasi `pnpm-lock.yaml` muncul di root. File ini sekarang single source of truth dependency tree.

---

## Step 5 — Update `.gitignore`

Tambah 2 baris (defense-in-depth — playbook eksplisit larang pakai `bun add`/`bun install` buat dependency management di Step 6, tapi gitignore harus tetep antisipasi kalau kepencet):

```gitignore
bun.lock
bun.lockb
```

---

## Step 6 — Daily Development Protocol

### Rule A: Dependency Management — Strictly `pnpm`

```bash
# DO
pnpm add <package-name>
pnpm remove <package-name>

# JANGAN PERNAH
npm install <package-name>
bun add <package-name>
```

### Rule B: Task Execution & Dev Server — Strictly `bun`

```bash
bun run dev
bun run build
bunx --bun shadcn@latest add <component-name>
```

**Kenapa kombinasi ini aman:** `bun run <script>` cuma jalanin script yang didefinisikan di `package.json` (`next dev`, `next build`, dst) — dia gak butuh lockfile sendiri buat itu. `node_modules` yang di-resolve tetap hasil `pnpm install` di Step 4. Jadi walau 2 tool dipakai, **lockfile tetap cuma satu**: `pnpm-lock.yaml`.

---

## Step 7 — Verifikasi Lokal (Bukan Cuma Build Success)

```bash
bun run dev
```
Buka dashboard + ketiga modul peta (Aset & Fasum, Potensi Lahan, Akses Sekolah), klik minimal 1 marker/polygon di tiap modul, pastikan Leaflet render normal dan `InfoModal` kebuka dengan benar.

```bash
bun run build
```
Pastikan production build sukses tanpa error.

**Kenapa runtime-check penting, bukan cuma `build` sukses:** isu paling umum migrasi ke pnpm adalah *phantom dependency* — package yang jalan di npm karena hoisting flat, tapi gagal di runtime di bawah pnpm karena struktur `node_modules`-nya lebih strict/isolated. `next build` yang sukses gak otomatis jamin ini aman, terutama buat dependency chain kayak `react-leaflet` → `leaflet`, atau primitive dari `shadcn`/`radix-ui`. Kalau ada yang patah, biasanya keliatan pas runtime (map gak render, komponen UI error), bukan pas build.

---

## Step 8 — CI/CD Dashboard Checklist

Gak ada file config CI di repo ini — semua diatur manual di dashboard hosting.

### Vercel

1. **Project Settings > General > Build & Development Settings**.
2. **Framework Preset** tetap `Next.js`.
3. Vercel otomatis detect `pnpm-lock.yaml` dan jalanin `pnpm install` + `pnpm run build` — gak perlu override command manual kecuali ada custom build script.

### Cloudflare Pages

1. **Settings > Builds & deployments**.
2. **Build command** eksplisit di-set ke `pnpm run build` (atau `npx @cloudflare/next-on-pages` kalau pakai SSR/Edge runtime, bukan static export).
3. Kalau Cloudflare gagal auto-detect pnpm: tambah environment variable `PNPM_VERSION`, isi versi pnpm lokal (cek via `pnpm -v` setelah Step 2).

---

## Step 9 — Commit Checklist

**Masuk commit:**
- `pnpm-lock.yaml` (baru)
- `package.json` (field `packageManager` baru dari Step 2)
- `.gitignore` (update dari Step 5)

**Keluar dari git:**
- `package-lock.json` (dihapus di Step 3)

---

## Rollback Plan

Kalau migrasi bermasalah dan perlu balik ke npm:

```bash
git checkout package-lock.json   # restore dari history
rm -f pnpm-lock.yaml
rm -rf node_modules
npm install
```

Terakhir, buka `package.json` dan hapus field `"packageManager"` yang ditambahkan Corepack di Step 2.
