# **TECHNICAL REQUIREMENT DOCUMENT (TRD): ANALYTICS DASHBOARD SUB-SYSTEM**

**Project Title:** Interactive Web GIS Platform for Rejoagung Village 2026
**Sub-System:** Client-Side Analytics Dashboard (`src/components/analytics/`)
**Document Version:** 1.1 (Component Specification - Land Potential Integrated)
**Target Stack:** Next.js 15, Tailwind CSS, shadcn/ui (Cards, Tables), Recharts

---

## **1. COMPONENT ARCHITECTURE & FILE STRUCTURE**

To enforce Separation of Concerns (SoC) and prevent monolithic component bloat, the analytics dashboard strictly follows a parent-child modular architecture.

**Directory Tree:**

```text
src/components/analytics/
├── AnalyticsDashboard.tsx      # Parent Wrapper (Layout & Routing Hub)
├── AssetMetrics.tsx            # Child: Infrastructure & Asset Analytics
├── EducationMetrics.tsx        # Child: Educational Accessibility Analytics
└── LandPotentialMetrics.tsx    # Child: Dusun Economic Profile Grids

```

---

## **2. PARENT COMPONENT: `AnalyticsDashboard.tsx**`

**Responsibility:** Acts as the main structural container. It does not fetch data or render charts directly. It manages the vertical scrolling layout, responsive padding, and semantic HTML sectioning.

**UI/UX Implementation:**

* **Wrapper Container:** `<div className="w-full h-full overflow-y-auto space-y-8 p-4 md:p-6 pb-12">`
* **Sectioning:** Each child component is wrapped inside a standard `<section>` tag preceded by a distinct section title (e.g., `<h2 className="text-xl font-bold text-primary">`).
* **Dividers:** Sections are separated using `<hr className="border-border" />` to maintain visual hierarchy.

---

## **3. CHILD COMPONENT A: `AssetMetrics.tsx**`

**Responsibility:** Displays macro infrastructure metrics utilizing hardcoded TypeScript constants to ensure zero-parsing errors and immediate rendering.

**Data Source:** `src/constants/assetsSummary.ts`

**Component Layout (CSS Grid):**

1. **Macro Indicator Cards (Top Row):**
* *Grid Setup:* `grid grid-cols-2 lg:grid-cols-4 gap-4`
* *Cards:* Total Assets (22), Total Area (21,854 m²), Total Categories (4), Unverified Assets (8).
* *UI:* Utilizes `shadcn/ui` `<Card>` with large text (`text-3xl font-bold`).


2. **Chart Section (Bottom Row):**
* *Grid Setup:* `grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6`
* *Panel 1 (Recharts Pie/Donut Chart):* Displays "Rekapitulasi Per Status Kepemilikan" (Hak Milik 40.9%, Hak Wakaf 18.2%, etc.).
* *Panel 2 (Recharts Bar Chart):* Displays "Rekapitulasi Per Kategori Aset" mapping the categories (Olahraga, Pemerintahan, Keagamaan, Pendidikan) on the X-axis against absolute counts on the Y-axis.
* *Responsiveness:* Charts MUST be wrapped inside Recharts' `<ResponsiveContainer height="{300}" width="100%">` to prevent layout overflow on mobile.



---

## **4. CHILD COMPONENT B: `EducationMetrics.tsx**`

**Responsibility:** Visualizes the spatial vulnerability and distribution of educational facilities.

**Data Source:** Aggregated dynamically from `fasilitas-pendidikan.geojson` and `akses-sekolah.geojson`, or via a secondary constant file due to the static small scale ($N=8$).

**Component Layout (CSS Grid & Flexbox):**

* **Card 1 (Macro Statistics Block):**
* A full-width `shadcn/ui` `<Card>` displaying a high-contrast numeric read-out: **"8 Sekolah Terdata"**.


* **Card 2 (Distribution Pie Chart):**
* *Implementation:* `<PieChart>` via Recharts.
* *Data Mapping:* Inner ring for Status (Negeri vs. Swasta) and outer ring for Accreditation Status (A, B, C, Belum Terakreditasi).


* **Card 3 (Tier Distribution Bar Chart):**
* *Implementation:* `<BarChart>` via Recharts.
* *Data Mapping:* X-axis maps the educational tiers (TK, SD, SMP, SMA, SMK). Y-axis maps the frequency. Uses color-coding identical to the Map Markers (`TK: #ec4899`, `SD: #ef4444`, `SMP: #3b82f6`, `SMA: #10b981`, `SMK: #eab308`).


* **Card 4 (Travel Time Matrix Table):**
* *Implementation:* `shadcn/ui` `<Table>` or a CSS Grid List.
* *Structure:* 3 Columns/Sections mapping schools strictly to their network analysis buffer zones (`< 5 Menit`, `5 - 10 Menit`, `> 15 Menit`).


* **Card 5 (Accessibility Coverage Index):**
* *Implementation:* A highlighted metric card displaying the mathematical percentage of safe residential coverage (e.g., **"78% Pemukiman dalam Zona Aman"**).



---

## **5. CHILD COMPONENT C: `LandPotentialMetrics.tsx**`

**Responsibility:** Functions as a dynamic "Dusun Profiler" grid, translating spatial resource data directly from the GeoJSON properties into socioeconomic policy implications.

**Data Source Integration (`dusun.geojson`):**

* The module strictly ingests `dusun.geojson`.


* The `MultiPolygon` geometry is utilized as it natively handles both the boundary delineations and the inner area fills (Choropleth mapping) within the Map Canvas, making standalone `MultiLineString` boundary files functionally obsolete.


* The component dynamically maps the highly detailed `"properties"` object to populate the analytic UI.



**Component Layout (CSS Grid):**

* **Grid Setup:** `grid grid-cols-1 md:grid-cols-2 gap-6` (Displays 4 cards, 2 per row on desktop, stacked on mobile).
* **Card Anatomy (`shadcn/ui`):**
* `CardHeader`: Displays the specific territory name extracted from `properties.dusun` (e.g., **Sumberagung**, **Sumbergroto**).


* `CardContent`: Divided into structured textual sections using Tailwind flexbox spacing (`space-y-4`) mapped directly from the GeoJSON attributes:


1. **Zonasi Potensi Utama (Resource Keys):** Rendered as unordered lists with contextual emojis, extracting data strings from `properties["Komoditas Pertanian"]` and `properties["Jenis Tanaman"]`.


2. **Potensi Energi & Infrastruktur:** Extracts data from `properties["Energi Terbarukan"]` to highlight sustainable infrastructures.


3. **Indikator Dampak (Policy Implication):** Extracts the `properties["Rekomendasi"]` string, rendered inside a muted informational block (`bg-muted/50 p-3 rounded-md text-sm border-l-4 border-primary`) detailing the actionable economic strategy.

---

## **6. TECHNICAL CONSTRAINTS & SAFEGUARDS**

1. **Recharts Hydration Fix:** Because Recharts manipulates DOM elements heavily, rendering charts server-side in Next.js 15 causes layout shifts and hydration errors.
* **Safeguard:** All files utilizing Recharts (`AssetMetrics.tsx`, `EducationMetrics.tsx`) must declare `"use client";` at the absolute top of the file.


2. **Responsive Text Overlap Avoidance:** In Recharts Bar/Pie components, `tick` font sizes must be restricted (`fontSize={12}`) and `Legend` wrappers must use adaptive wrapping (`wrapperStyle={{ flexWrap: "wrap" }}`) to prevent overlap on screen widths $< 400px$.
3. **Empty State Fallbacks:** If the array feeding a chart or table evaluates to a length of $0$, the component must abort chart rendering and return a fallback UI block: `<div className="flex h-40 items-center justify-center text-muted-foreground">Data tidak tersedia</div>`.