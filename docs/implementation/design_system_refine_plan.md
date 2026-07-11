# Design System Refinement Plan
## Web GIS Desa Rejoagung 2026

**Baseline:** `docs/DESIGN/DESIGN.md` & `docs/DESIGN/COMPONENTS.md`
**Scope:** All component files under `src/components/` and `src/app/`

> [!IMPORTANT]
> This is a **READ-ONLY** plan. Do NOT edit source files directly until this plan is reviewed and approved.

---

## Gap Analysis: Current State vs. Design Spec

Before jumping to code, here is a structured audit of every gap found between the current implementation and the `DESIGN.md` / `COMPONENTS.md` specification.

| # | File | Gap Found | Design Spec Reference |
|---|------|-----------|-----------------------|
| 1 | `globals.css` + `layout.tsx` | **Inter font not imported.** Only `Geist Sans` and `Geist Mono` are loaded. The design spec requires a dual-font system (Geist for headlines, **Inter** for body/labels). | `DESIGN.md` > Typography |
| 2 | `globals.css` | **CSS custom properties use generic shadcn defaults** (greyscale oklch). The `--primary` token is grey (`oklch(0.205 0 0)`), not **Hijau Rejoagung** (`#006948`). Chart colors are also greyscale, not the specified data-vis palette. | `DESIGN.md` > Colors |
| 3 | `globals.css` | **No custom font-family CSS variables** defined for `--font-heading` (Geist) and `--font-body` (Inter) mapped to actual Google Font variables. | `DESIGN.md` > Typography |
| 4 | `Sidebar.tsx` | Uses `bg-muted/20` (generic grey). Spec requires `bg-white` with `border-slate-200`. Active state uses shadcn `variant="default"` (generic black), instead of **`bg-emerald-50 text-emerald-600 border-l-2 border-emerald-600`** pill shape. | `COMPONENTS.md` > Sidebar, `DESIGN.md` > Components > Buttons |
| 5 | `Sidebar.tsx` | Brand title uses `text-primary` (resolves to grey). Should use **Hijau Rejoagung** (`text-emerald-700`) with a proper logo mark or branded badge. | `DESIGN.md` > Brand & Style |
| 6 | `Sidebar.tsx` | No **section divider** between Dashboard and Map Modules. COMPONENTS.md implies a clear visual hierarchy with labeled sections. | `COMPONENTS.md` > Sidebar |
| 7 | `page.tsx` | Header `h1` uses `text-lg font-semibold` — too generic. Spec requires `section-header` style (Geist Sans, 20px, `font-semibold`). Header also missing a **breadcrumb/badge** to indicate which module is active. | `DESIGN.md` > Typography > section-header |
| 8 | `page.tsx` | The main content wrapper uses `bg-muted/30` (grey). Design spec specifies the canvas background is `bg-slate-50` (`#f7f9fb` = `surface-bright`). | `DESIGN.md` > Colors > background |
| 9 | `page.tsx` | Map container uses `shadow-inner bg-muted/50` — generic. Spec: map is a **fluid overlay base**, `rounded-xl`, with `shadow-sm border-slate-100`. | `DESIGN.md` > Elevation & Depth |
| 10 | `page.tsx` | **`<head>` metadata** uses default "Create Next App" title. Must be updated to project-specific SEO metadata. | PRD: Deployment Target |
| 11 | `analyticsDashboard.tsx` | Section headers use `text-gray-900` generic class, and emoji as icon. Spec requires **Lucide icons** in `text-emerald-600` paired with `label-caps` typography. `bg-gray-50` background should be `bg-slate-50`. | `COMPONENTS.md` > Cards > Header |
| 12 | `analyticsDashboard.tsx` | No visual divider treatment — `<hr className="border-gray-200">` is too plain. Should use a spacer with section label or a styled separator. | `DESIGN.md` > Spacing > stack-section |
| 13 | `AssetMetrics.tsx` | KPI Card: metric value uses `text-gray-900` instead of `text-slate-900`. Card `CardTitle` uses `text-base` but spec requires `label-caps` (uppercase, 12px, `tracking-wider`, Inter). | `COMPONENTS.md` > Cards, `DESIGN.md` > Typography |
| 14 | `AssetMetrics.tsx` | Card borders use inline `style={{ borderColor }}` from the constant file (hard-coded hex colors). Should unify to the design token: `border-slate-100` with `shadow-sm shadow-emerald-900/5`. | `COMPONENTS.md` > Cards |
| 15 | `AssetMetrics.tsx` | Recharts tooltips use default styling. Spec says tooltips should use `rounded-xl` and `shadow-md`. | `COMPONENTS.md` > Bar Charts |
| 16 | `EducationMetrics.tsx` | Same card header issue as AssetMetrics — `text-base` CardTitle, not `label-caps`. | `COMPONENTS.md` > Cards |
| 17 | `EducationMetrics.tsx` | Coverage Index card uses a custom green gradient bar. Should align to design token: `bg-emerald-600` fill, `bg-slate-100` track. | `DESIGN.md` > Colors > primary |
| 18 | `EducationMetrics.tsx` | `* data estimasi` badge uses custom inline Amber styles. Should use `<Badge>` with `variant="warning"` as per `COMPONENTS.md` > Badges. | `COMPONENTS.md` > Badges |
| 19 | `LandPotentialMetrics.tsx` | Scorecard cards use custom `style={{ backgroundColor, borderColor }}`. Should be replaced with design tokens. | `DESIGN.md` > Colors |
| 20 | `LandPotentialMetrics.tsx` | Threat badges use `variant="destructive"` (shadcn built-in, renders red). COMPONENTS.md defines a custom destructive variant as `bg-rose-50 text-rose-600`. Needs custom override. | `COMPONENTS.md` > Badges > Destructive |
| 21 | `InfoModal.tsx` | Uses `font-bold text-gray-900` for title — not aligned to `headline-lg` spec. Button not styled with `bg-emerald-600`. No glass/blur overlay around modal. | `DESIGN.md` > Elevation > Z-Index 20 |
| 22 | `MapBase.tsx` | Map container `div` has no explicit background color. When map tiles load slowly, a blank white flash appears. Should have `bg-slate-100` as loading canvas. | `DESIGN.md` > Layout > GIS Layout |

---

## Proposed Changes — By File

The following sections describe **exactly what to change** in each file, with the final code to implement.

---

### File 1: `src/app/layout.tsx` — Add Inter Font + SEO Metadata

**What changes:**
- Import `Inter` from `next/font/google`.
- Expose it as a CSS variable `--font-inter`.
- Apply it to `<body>` element.
- Update `metadata` object with real project title and description.

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ NEW: Inter for body/label text
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Web GIS Desa Rejoagung 2026",
  description:
    "Platform Informasi Spasial Interaktif untuk pemetaan aset desa, potensi lahan, dan aksesibilitas pendidikan Desa Rejoagung — KKN-PPM UGM 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
```

---

### File 2: `src/app/globals.css` — Align CSS Tokens to Hijau Rejoagung

**What changes:**
- Override `--primary` token to Hijau Rejoagung (`#006948`).
- Override `--background` to `#f7f9fb` (surface-bright from design spec).
- Override `--border` to `#e2e8f0` as per design spec.
- Override `--muted` and `--muted-foreground` to slate equivalents.
- Add font utility classes: `.font-heading` (Geist) and `.font-body` (Inter).
- Add chart color overrides (`--chart-1` → emerald, etc.).

```css
/* src/app/globals.css — inside :root { ... } REPLACE existing vars with these */

:root {
  /* ── Hijau Rejoagung Design Tokens ── */
  --background: #f7f9fb;           /* surface-bright */
  --foreground: #191c1e;           /* on-surface */

  --card: #ffffff;
  --card-foreground: #191c1e;

  --popover: #ffffff;
  --popover-foreground: #191c1e;

  /* PRIMARY → Hijau Rejoagung */
  --primary: #006948;
  --primary-foreground: #ffffff;

  --secondary: #f2f4f6;            /* surface-container-low */
  --secondary-foreground: #191c1e;

  --muted: #eceef0;                /* surface-container */
  --muted-foreground: #64748b;     /* text-muted (slate-500) */

  --accent: #f0fdf4;               /* emerald-50 tint */
  --accent-foreground: #006948;

  --destructive: #ba1a1a;          /* error token */
  --border: #e2e8f0;               /* design spec border */
  --input: #e2e8f0;
  --ring: #006948;                 /* focus ring = primary */

  /* Chart colors — aligned to design spec data visualization */
  --chart-1: #10b981;              /* emerald-500 (primary data) */
  --chart-2: #3b82f6;              /* blue-500 (SMP / secondary) */
  --chart-3: #f43f5e;              /* rose-500 (SD / alerts) */
  --chart-4: #fbbf24;              /* amber-400 (SMK / warning) */
  --chart-5: #8b5cf6;              /* violet-500 (Pesantren) */

  --radius: 0.625rem;

  /* Sidebar tokens */
  --sidebar: #ffffff;
  --sidebar-foreground: #191c1e;
  --sidebar-primary: #006948;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #f0fdf4;
  --sidebar-accent-foreground: #006948;
  --sidebar-border: #e2e8f0;
  --sidebar-ring: #006948;
}

/* ── Typography Utility Classes ── */
@layer utilities {
  .font-heading {
    font-family: var(--font-geist-sans), system-ui, sans-serif;
  }
  .font-body {
    font-family: var(--font-inter), system-ui, sans-serif;
  }
  .label-caps {
    font-family: var(--font-inter), system-ui, sans-serif;
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .display-metric {
    font-family: var(--font-geist-sans), system-ui, sans-serif;
    font-size: 32px;
    font-weight: 800;
    line-height: 40px;
    letter-spacing: -0.02em;
  }
}
```

---

### File 3: `src/components/Sidebar.tsx` — Full Redesign

**What changes:**
- Background: `bg-white border-r border-slate-200` (from spec).
- Brand title: `font-heading text-emerald-700 font-bold`.
- Add proper section dividers with `label-caps`.
- Active nav item: `bg-emerald-50 text-emerald-700 font-semibold border-l-2 border-emerald-600 rounded-r-full` (pill shape from spec).
- Inactive nav item: `text-slate-600 hover:bg-slate-50 rounded-lg`.
- Use `lucide-react` icons instead of emoji.
- Footer: proper attribution with branding.

```tsx
// src/components/Sidebar.tsx
"use client";

import { LayoutDashboard, MapPin, Leaf, School } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard Analisis",
    icon: LayoutDashboard,
    group: "overview",
  },
  {
    id: "aset",
    label: "Aset & Fasum Desa",
    icon: MapPin,
    group: "map",
  },
  {
    id: "potensi",
    label: "Potensi Lahan & SDA",
    icon: Leaf,
    group: "map",
  },
  {
    id: "sekolah",
    label: "Aksesibilitas Sekolah",
    icon: School,
    group: "map",
  },
];

export default function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
      {/* ── Brand Header ── */}
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5 mb-0.5">
          {/* Brand mark */}
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold">R</span>
          </div>
          <div>
            <h1 className="font-heading text-slate-900 font-bold text-base leading-tight">
              Web GIS Desa
            </h1>
            <p className="font-body text-emerald-600 text-xs font-semibold">
              Rejoagung 2026
            </p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex flex-col flex-1 px-3 py-4 gap-1 overflow-y-auto">
        {/* Overview Section */}
        <p className="label-caps text-slate-400 px-3 mb-1">Overview</p>
        {NAV_ITEMS.filter((i) => i.group === "overview").map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={cn(
                "flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-emerald-50 text-emerald-700 border-l-2 border-emerald-600 rounded-r-lg pl-[10px]"
                  : "text-slate-600 hover:bg-slate-50 rounded-lg hover:text-slate-900"
              )}
            >
              <Icon
                size={16}
                className={isActive ? "text-emerald-600" : "text-slate-400"}
              />
              {item.label}
            </button>
          );
        })}

        {/* Map Modules Section */}
        <p className="label-caps text-slate-400 px-3 mt-4 mb-1">Modul Peta</p>
        {NAV_ITEMS.filter((i) => i.group === "map").map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={cn(
                "flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-emerald-50 text-emerald-700 border-l-2 border-emerald-600 rounded-r-lg pl-[10px]"
                  : "text-slate-600 hover:bg-slate-50 rounded-lg hover:text-slate-900"
              )}
            >
              <Icon
                size={16}
                className={isActive ? "text-emerald-600" : "text-slate-400"}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="px-6 py-4 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="font-body text-xs text-slate-500 font-medium">Data Aktif 2026</p>
        </div>
        <p className="font-body text-[10px] text-slate-400 leading-relaxed">
          Tim Geodesi & IT<br />KKN-PPM UGM 2026 · Klaster Saintek
        </p>
      </div>
    </aside>
  );
}
```

---

### File 4: `src/app/page.tsx` — Header & Layout Tokens

**What changes:**
- Header: Use `bg-white border-slate-200` (not `bg-background`). Add a **module badge** showing which data module is active.
- Header `h1`: Apply `font-heading` class, `text-slate-900`.
- Main canvas: Replace `bg-muted/30` → `bg-slate-50`.
- Map container: Replace `bg-muted/50 shadow-inner` → `bg-white shadow-sm border-slate-100`.

```tsx
// src/app/page.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MapViewer from "@/components/map/MapViewer";
import AnalyticsDashboard from "@/components/analytics/analyticsDashboard";

const MODULE_LABELS: Record<string, { title: string; badge: string; badgeColor: string }> = {
  dashboard: {
    title: "Dashboard Analisis Desa Rejoagung",
    badge: "Ringkasan",
    badgeColor: "bg-violet-50 text-violet-700",
  },
  aset: {
    title: "Pemetaan Aset & Fasilitas Umum Desa",
    badge: "Peta Interaktif",
    badgeColor: "bg-emerald-50 text-emerald-700",
  },
  potensi: {
    title: "Visualisasi Potensi Lahan & Sumber Daya Alam",
    badge: "Peta Interaktif",
    badgeColor: "bg-emerald-50 text-emerald-700",
  },
  sekolah: {
    title: "Analisis Spasial Aksesibilitas Sekolah",
    badge: "Peta Interaktif",
    badgeColor: "bg-emerald-50 text-emerald-700",
  },
};

export default function DashboardGIS() {
  const [activeModule, setActiveModule] = useState("aset");
  const meta = MODULE_LABELS[activeModule] ?? MODULE_LABELS["aset"];

  return (
    <div className="flex h-screen w-screen bg-slate-50">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />

      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        {/* ── Header ── */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 z-10 shrink-0 gap-3">
          <h1 className="font-heading text-slate-900 font-semibold text-[17px] leading-snug tracking-tight flex-1 truncate">
            {meta.title}
          </h1>
          <span
            className={`font-body text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${meta.badgeColor}`}
          >
            {meta.badge}
          </span>
        </header>

        {/* ── Conditional View Area ── */}
        <div className="flex-1 p-5 bg-slate-50 h-full overflow-hidden">
          {activeModule === "dashboard" ? (
            <AnalyticsDashboard />
          ) : (
            <div className="w-full h-full rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-white">
              <MapViewer activeModule={activeModule} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
```

---

### File 5: `src/components/analytics/analyticsDashboard.tsx` — Section Headers

**What changes:**
- Background: `bg-slate-50` (not `bg-gray-50`).
- Section headers: Replace emoji + `text-gray-900` with **Lucide icons + `font-heading`** style.
- `<hr>` separators: More elegant — combine spacing with a section gap.
- Footer: `font-body text-slate-400`.

```tsx
// src/components/analytics/analyticsDashboard.tsx
"use client";

import { Building2, GraduationCap, Sprout } from "lucide-react";
import AssetMetrics from "./AssetMetrics";
import EducationMetrics from "./EducationMetrics";
import LandPotentialMetrics from "./LandPotentialMetrics";

function SectionHeader({
  icon: Icon,
  title,
  description,
  iconColor = "text-emerald-600",
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  iconColor?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={18} className={iconColor} />
      </div>
      <div>
        <h2 className="font-heading text-slate-900 font-semibold text-lg leading-snug">
          {title}
        </h2>
        <p className="font-body text-slate-500 text-sm mt-0.5">{description}</p>
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-10 pb-16">

        {/* ── Section 1: Aset & Infrastruktur ── */}
        <section>
          <SectionHeader
            icon={Building2}
            title="Aset & Infrastruktur Desa"
            description="Rekapitulasi inventarisasi aset fisik Desa Rejoagung · Tahun 2026"
          />
          <AssetMetrics />
        </section>

        <div className="border-t border-slate-200" />

        {/* ── Section 2: Aksesibilitas Pendidikan ── */}
        <section>
          <SectionHeader
            icon={GraduationCap}
            title="Aksesibilitas Pendidikan"
            description="Distribusi lembaga pendidikan dan analisis jangkauan spasial"
            iconColor="text-blue-600"
          />
          <EducationMetrics />
        </section>

        <div className="border-t border-slate-200" />

        {/* ── Section 3: Potensi Lahan & SDA ── */}
        <section>
          <SectionHeader
            icon={Sprout}
            title="Potensi Lahan & SDA per Dusun"
            description="Profil sumber daya alam dan rekomendasi kebijakan ekonomi 4 dusun"
          />
          <LandPotentialMetrics />
        </section>

        {/* ── Footer ── */}
        <p className="font-body text-xs text-slate-400 text-center pt-2 pb-2 border-t border-slate-100">
          ⓘ Data merupakan hasil inventarisasi dan analisis spasial oleh Tim Geodesi & IT KKN-PPM UGM 2026.
          Data bertanda <strong>* estimasi</strong> bersifat sementara dan akan diperbarui setelah validasi lapangan.
        </p>

      </div>
    </div>
  );
}
```

---

### File 6: `src/components/analytics/AssetMetrics.tsx` — Card & Chart Tokens

**What changes:**
- KPI Card: Replace inline `style={{ backgroundColor, borderColor }}` with design token classes: `bg-white border-slate-100 shadow-sm shadow-emerald-900/5`.
- `CardTitle`: Change from `text-base` → `label-caps` class.
- Metric value: Change from `text-gray-900` → `text-slate-900 font-heading`.
- Emoji icon → Proper color-coded icon div (or retain accent color dot).
- Recharts tooltip: Add custom tooltip with `rounded-xl shadow-md`.

**Key class changes in KPI Card:**
```tsx
// BEFORE
<Card className="border shadow-sm" style={{ backgroundColor: stat.bgColor, borderColor: stat.borderColor }}>
  <CardContent className="p-5 flex flex-col gap-3">
    <p className="text-3xl font-bold text-gray-900 leading-none">

// AFTER
<Card className="bg-white border border-slate-100 shadow-sm shadow-emerald-900/5 rounded-xl">
  <CardContent className="p-5 flex flex-col gap-3">
    <p className="display-metric text-slate-900 leading-none">
```

**CardTitle key change:**
```tsx
// BEFORE
<CardTitle className="text-base">Distribusi Status Kepemilikan</CardTitle>

// AFTER  
<CardTitle className="label-caps text-slate-500">Distribusi Status Kepemilikan</CardTitle>
```

**Custom Recharts Tooltip (add to AssetMetrics, EducationMetrics, LandPotentialMetrics):**
```tsx
// Add this component above the export default
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-slate-100 px-3 py-2">
        <p className="label-caps text-slate-400 mb-1">{label}</p>
        <p className="font-heading text-slate-900 font-bold text-sm">
          {payload[0].value} {payload[0].name}
        </p>
      </div>
    );
  }
  return null;
};
// Then use: <Tooltip content={<CustomTooltip />} />
```

---

### File 7: `src/components/analytics/EducationMetrics.tsx` — Badge & Coverage Bar

**Key changes:**
- `* data estimasi` badge: Replace custom amber `<span>` with `<Badge>` component.
- Coverage Index progress bar: `bg-emerald-600` (not gradient) on `bg-slate-100` track.
- CardTitle: → `label-caps`.
- Metric `68.4%`: → `display-metric` class.

**Badge change:**
```tsx
// BEFORE
<span className="text-xs font-normal text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
  * data estimasi
</span>

// AFTER (uses COMPONENTS.md Warning variant)
<Badge className="bg-amber-50 text-amber-700 border border-amber-200 font-body text-[10px] font-semibold">
  * estimasi
</Badge>
```

**Coverage Bar change:**
```tsx
// BEFORE
style={{ width: `${coverageIndex}%`, background: "linear-gradient(to right, #10b981, #22c55e)" }}

// AFTER
className="h-3 rounded-full bg-emerald-600 transition-all duration-700"
style={{ width: `${coverageIndex}%` }}
```

---

### File 8: `src/components/analytics/LandPotentialMetrics.tsx` — Scorecard Tokens

**Key changes:**
- Scorecard cards: Remove `style={{ backgroundColor, borderColor }}`, use `bg-white border-slate-100 shadow-sm`.
- Accentuate metric value with a left-border color accent per card, using Tailwind classes.
- Threat `<Badge>`: Ensure it uses `COMPONENTS.md` destructive style: `bg-rose-50 text-rose-600 border border-rose-100`.
- Executive Summary block: Already well-designed, just change `text-emerald-900` body font to use `font-body` class.

**Scorecard card change:**
```tsx
// BEFORE  
<Card className="border shadow-sm" style={{ backgroundColor: stat.bgColor, borderColor: stat.borderColor }}>

// AFTER: Each scorecard gets a left-border accent via its accentColor token
<Card className="bg-white border border-slate-100 shadow-sm shadow-emerald-900/5 rounded-xl overflow-hidden">
  {/* Add colored top-border line */}
  <div className="h-1 w-full" style={{ backgroundColor: stat.accentColor }} />
```

---

### File 9: `src/components/map/InfoModal.tsx` — Glassmorphism Overlay

**Key changes:**
- Backdrop: `bg-black/50` → `bg-slate-900/60 backdrop-blur-sm` (glassmorphism spec).
- Modal card: Add `shadow-2xl` and `rounded-xl` (spec: `rounded-xl` for data panels).
- Title: `font-heading text-slate-900`.
- Close/Action button: `bg-emerald-600 hover:bg-emerald-700 text-white rounded-md`.

```tsx
// BEFORE (backdrop)
<div className="fixed inset-0 bg-black/50 z-[9999] ...">

// AFTER
<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] ...">

// BEFORE (title)
<h3 className="text-xl font-bold text-gray-900 mb-2">📋 Detail Fasilitas</h3>

// AFTER
<h3 className="font-heading text-xl font-bold text-slate-900 mb-2">Detail Fasilitas</h3>

// BEFORE (button)
<button className="w-full bg-primary text-white py-2 rounded-lg ...">

// AFTER
<button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md font-body font-semibold text-sm transition-colors ...">
```

---

## Implementation Order & Checklist

Implement in this sequence to minimize cascading issues:

- [ ] **Step 1:** `layout.tsx` — Add Inter font + fix metadata
- [ ] **Step 2:** `globals.css` — Inject Hijau Rejoagung CSS tokens + typography utilities
- [ ] **Step 3:** `Sidebar.tsx` — Full nav redesign with Lucide icons
- [ ] **Step 4:** `page.tsx` — Header badge + layout background tokens
- [ ] **Step 5:** `analyticsDashboard.tsx` — Section headers with Lucide
- [ ] **Step 6:** `AssetMetrics.tsx` — Card tokens + custom Recharts tooltip
- [ ] **Step 7:** `EducationMetrics.tsx` — Badge + coverage bar + label-caps
- [ ] **Step 8:** `LandPotentialMetrics.tsx` — Scorecard top-border accent + badge fix
- [ ] **Step 9:** `InfoModal.tsx` — Glassmorphism + emerald button

> [!NOTE]
> `lucide-react` is already a dependency of `shadcn/ui`. No additional installation needed.

> [!TIP]
> Start with Steps 1–2 (globals) first, because CSS token changes will automatically cascade to all `shadcn/ui` components (Card, Badge, etc.) across the entire app.

> [!WARNING]
> After `globals.css` changes, the shadcn `Button` component's `variant="default"` will now render **Hijau Rejoagung** emerald instead of black. Review all existing `<Button>` usages to ensure they still look correct.
