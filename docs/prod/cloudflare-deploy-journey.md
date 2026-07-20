# Cloudflare Deploy Journey: Troubleshooting Log

**Konteks:** Ringkasan proses uji coba deploy ke Cloudflare (`pre_production_todo.md` Poin 7) — dari percobaan pertama sampai akhirnya live. Ditulis biar kalau ketemu masalah serupa lagi (atau kontributor lain nyoba deploy ulang dari nol), gak perlu ngulang seluruh proses debug ini.

---

## TL;DR — Konfigurasi Final yang Jalan

**Cloudflare Dashboard (Workers & Pages > project `gis-rejoagung` > Settings > Build):**
- **Framework preset:** `None`
- **Build command:** `pnpm run build`
- **Build output directory:** `out`
- **Deploy command:** `npx wrangler deploy`
- **API Token:** custom token dengan **DUA** permission: `Account > Cloudflare Pages > Edit` **DAN** `Account > Workers Scripts > Edit`

**File di repo:**
- `next.config.ts` — `output: "export"`, `images: { unoptimized: true }`
- `wrangler.jsonc` (baru) — `assets.directory: "./out"`, deploy sebagai **Worker dengan Static Assets** (bukan Pages project — lihat kenapa di bawah)
- `pnpm-workspace.yaml` — `allowBuilds` buat `sharp`, `unrs-resolver`, `esbuild`, `workerd`
- `package.json` — `@types/geojson` sebagai devDependency eksplisit, field `packageManager` (pnpm pinned version)

---

## Kronologi Masalah & Fix

### 1. `[ERR_PNPM_IGNORED_BUILDS]` — install script diblok, fatal di CI
**Penyebab:** pnpm 11.x block eksekusi postinstall script package manapun secara default (proteksi supply-chain). Non-fatal di lokal (`pnpm install` tetep selesai), tapi **fatal** di Cloudflare CI (non-interactive, gak bisa approve manual).
**Fix:** `pnpm approve-builds --all` — hasilnya ke-persist ke `pnpm-workspace.yaml` (**bukan** `package.json`, itu format lama pnpm yang udah gak dibaca versi 11.x).

### 2. Missing `@types/geojson` — phantom dependency
**Penyebab:** `MapBase.tsx` import `from "geojson"`, tapi `@types/geojson` gak pernah di-declare eksplisit di `package.json` — cuma numpang ada karena jadi dependency transitif `@types/leaflet`. npm (hoisting flat) toleran soal ini, pnpm (isolasi strict) enggak.
**Fix:** `pnpm add -D @types/geojson`.

### 3. `[ERR_PNPM_IGNORED_BUILDS]` muncul lagi — kali ini `esbuild`, `workerd`
**Penyebab:** Beda sumber dari sebelumnya — ini transitive dependency dari **Wrangler CLI sendiri**, muncul spesifik pas Deploy command jalan (`npx wrangler ...` install wrangler on-the-fly).
**Fix:** Tambah `esbuild: true` dan `workerd: true` ke `allowBuilds` di `pnpm-workspace.yaml`.

### 4. Salah command: `npx wrangler deploy` vs `npx wrangler pages deploy`
**Penyebab:** `wrangler deploy` (bare) = target Cloudflare **Workers**. `wrangler pages deploy <dir>` = target **Pages**. Beda resource type sama sekali.
**Fix (saat itu):** Pakai `wrangler pages deploy out` karena mikirnya target Pages project. *(Belakangan ternyata ini bukan akar masalahnya — lihat poin 8.)*

### 5. Framework preset `Next.js` diam-diam nge-wire OpenNext adapter (SSR), bentrok sama static export
**Penyebab:** Cloudflare dashboard versi terbaru, preset `Next.js` otomatis pilih adapter `@opennextjs/cloudflare` (mode SSR penuh di Workers) — override Build command manual jadi `pnpm opennextjs-cloudflare build`. Adapter itu nunggu `.next/standalone/` (hasil build mode SSR), yang **gak akan pernah ada** karena `next.config.ts` project ini pakai `output: "export"` (static export, sengaja skip pembuatan server bundle — app ini zero-backend, gak butuh SSR).
**Gejala:** `Error: ENOENT ... .next/standalone/.next/server/pages-manifest.json`.
**Fix:** Framework preset diganti `None`. Build command manual jadi `pnpm run build` (bukan `opennextjs-cloudflare build`).
*(Error ini sempat muncul ulang belakangan — lihat poin 11.)*

### 6. `Missing Pages project name`
**Penyebab:** `wrangler pages deploy` butuh tau mau deploy ke Pages project mana, gak auto-detect dari context build environment.
**Fix:** Tambah flag `--project-name=gis-rejoagung` ke Deploy command.

### 7. `Authentication error [code: 10000]` — berulang beberapa kali
**Penyebab:** API Token yang dipake gak punya permission scope yang cukup buat operasi Pages API, walau akun-nya sendiri Super Administrator (izin akun ≠ izin token — token API punya scope sendiri, terpisah).
**Percobaan yang GAGAL:**
- Custom token dengan cuma `Cloudflare Pages: Edit` — gagal.
- Pake token bawaan `"gis-rejoagung Build Token"` (auto-provisioned Cloudflare) apa adanya — gagal.
**Yang AKHIRNYA jalan:** Tambah permission `Workers Scripts: Edit` **bareng** `Cloudflare Pages: Edit` di token yang sama. Auth langsung sukses setelah ini.
**Pelajaran:** `wrangler pages deploy` di versi baru butuh **dua-duanya** — Pages sekarang jalan di atas infrastruktur Workers yang sama, token cuma-Pages aja gak cukup.

### 8. `The Pages project "gis-rejoagung" does not exist`
**Penyebab (baru ketauan di sini):** Resource "gis-rejoagung" di akun Cloudflare ternyata ke-provision sebagai **Worker**, bukan **Pages project** — jejak dari poin 5, waktu Framework preset masih `Next.js` dan OpenNext auto-migrate sempat bikin `wrangler.jsonc` dengan `"name": "gis-rejoagung"` sebagai nama Worker. Ganti Framework preset ke `None` gak nge-reset resource type yang udah kebentuk di akun.
**Keputusan:** Daripada maksa bikin Pages project baru (nama beda, mulai dari nol), pivot ke **Workers Static Assets** — fitur native Cloudflare buat serve static file langsung dari Worker, gak butuh Pages project sama sekali, gak butuh OpenNext/SSR adapter.
**Fix:** Bikin `wrangler.jsonc`:
```jsonc
{
  "name": "gis-rejoagung",
  "compatibility_date": "2026-07-18",
  "assets": { "directory": "./out" }
}
```
Deploy command balik ke `npx wrangler deploy` (bare — sekarang bener, karena target-nya emang Worker).

### 9. Typo: `npx wranger deploy`
**Penyebab:** Salah ketik, kurang huruf `l` di `wrangler`. `npm error 404 'wranger@*' is not in this registry`.
**Fix:** Ketik ulang bener `npx wrangler deploy`.

### 10. Cabang kepisah — commit `wrangler.jsonc` sempat nyangkut di branch `main`
**Penyebab (di sisi asisten, bukan Cloudflare):** Waktu commit dokumentasi sebelumnya, local branch ternyata udah pindah ke `main` tanpa disadari, commit nyangkut di situ, bukan di `gis-rjg-V1.1` yang dipake buat deploy.
**Fix:** `git push origin main` (biar `main` bersih), `git checkout gis-rjg-V1.1`, `git merge main --ff-only` (fast-forward, gak ada conflict), push ulang.

### 11. OpenNext auto-config trap muncul lagi (regresi)
**Penyebab:** Kemungkinan besar Cloudflare nge-retry/build dari commit lama (sebelum `wrangler.jsonc` ke-push), bukan dari commit terbaru — entah karena tombol "Retry deployment" retry commit lama, atau ada delay propagasi.
**Fix:** Pastikan trigger deployment BARU dari commit terbaru (`550e552` atau sesudahnya, yang udah punya `wrangler.jsonc`), bukan retry deployment lama. Kalau ragu commit mana yang ke-build, cek SHA di tab Deployments Cloudflare, bandingin sama `git log`.

---

## Pelajaran Umum

1. **Cloudflare dashboard "Framework preset" itu bukan sekadar label** — preset `Next.js` aktif nge-install & nge-wire adapter tambahan (`@opennextjs/cloudflare`) yang override command manual. Buat static export murni, selalu pilih `None`.
2. **pnpm 11.x pindahin banyak config** dari `package.json` ke `pnpm-workspace.yaml` (termasuk build-script approval) — dokumentasi/tutorial lama sering masih nyebut format `package.json`, jangan percaya buta.
3. **API Token Cloudflare permission-nya granular dan gak selalu intuitif** — buat deploy Pages-via-Workers-pipeline, butuh permission Pages DAN Workers Scripts sekaligus.
4. **Sekali resource ke-provision dengan tipe tertentu (Worker vs Pages) di Cloudflare, gak otomatis berubah** cuma dengan ganti setting dashboard — kalau kejadian mismatch kayak ini, kadang lebih cepet pivot ke tipe resource yang udah kebentuk daripada maksa balik ke rencana awal.
5. **Selalu pastikan commit yang di-build itu commit terbaru** — retry deployment lama gampang disalahartikan sebagai "udah nyoba fix-nya tapi masih gagal", padahal fix-nya belum ke-include di build itu.
