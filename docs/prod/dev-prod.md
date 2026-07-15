# **MIGRATION PLAYBOOK: NPM TO DUAL-ENGINE (PNPM + BUN)**

**Project:** Interactive Web GIS Platform for Rejoagung Village 2026
**Objective:** Safely migrate existing Next.js 15 codebase from `npm` to the `pnpm` (Package Manager) + `bun` (Task Runner) architecture without breaking spatial dependencies.

---

## **1. PHASE 1: THE PURGE (CLEANING NPM TRACES)**

Before introducing the new engines, all remnants of the old `npm` resolution logic must be completely eradicated from the local workspace to prevent dependency conflicts.

Execute these commands in your project root terminal:

### **Mac/Linux:**

```bash
# Remove the old node_modules folder and the npm lockfile
rm -rf node_modules package-lock.json

# (Optional but recommended) Clear Next.js cache to prevent stale build errors
rm -rf .next

```

### **Windows (PowerShell):**

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
Remove-Item -Recurse -Force .next

```

*Crucial Note: Do NOT delete `package.json`. It contains the blueprint of your project.*

---

## **2. PHASE 2: INITIALIZING THE PNPM ENGINE**

With a clean slate, generate the new strict dependency tree using `pnpm`.

```bash
# Install all dependencies listed in package.json using pnpm
pnpm install

```

*Action Verification:* Verify that a new `pnpm-lock.yaml` file has been generated in your root directory. This file is now the single source of truth for your CI/CD pipeline.

---

## **3. PHASE 3: DAILY DEVELOPMENT PROTOCOL (THE RULES)**

Now that the migration is complete, strictly enforce the dual-engine split during development.

### **Rule A: Dependency Management (Strictly `pnpm`)**

Whenever you need to add or remove packages (e.g., adding a new Recharts plugin or Leaflet extension), you must use `pnpm` to keep the lockfile synchronized.

```bash
# DO
pnpm add <package-name>
pnpm remove <package-name>

# DON'T EVER DO THIS AGAIN
npm install <package-name>
bun add <package-name>

```

### **Rule B: Task Execution & Dev Server (Strictly `bun`)**

Leverage Bun's speed to run your local server and execute scripts.

```bash
# Start the local development server instantly
bun run dev

# Run Next.js production build locally for testing
bun run build

# Add new shadcn/ui components
bunx --bun shadcn@latest add <component-name>

```

---

## **4. PHASE 4: CI/CD PIPELINE ADJUSTMENTS (VERCEL / CLOUDFLARE)**

Pushing the new `pnpm-lock.yaml` and the deleted `package-lock.json` to your Git repository will automatically signal Vercel or Cloudflare to switch their internal build engines. However, verify the following settings in your hosting dashboard:

### **Vercel Settings Check:**

1. Navigate to **Project Settings > General > Build & Development Settings**.
2. **Framework Preset:** Ensure it is still set to `Next.js`.
3. Vercel will automatically detect `pnpm-lock.yaml` and run `pnpm install` and `pnpm run build`. You do not need to override the commands manually unless you have custom build scripts.

### **Cloudflare Pages Settings Check:**

1. Navigate to **Settings > Builds & deployments**.
2. **Build command:** Ensure it is explicitly set to `pnpm run build` (or `npx @cloudflare/next-on-pages` if you are using SSR/Edge runtime features instead of static export).
3. **Environment Variables:** If Cloudflare fails to detect `pnpm` automatically, add an environment variable `PNPM_VERSION` and set its value to `9.x` (or your current local pnpm version).