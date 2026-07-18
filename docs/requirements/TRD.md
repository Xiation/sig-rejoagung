# **TECHNICAL REQUIREMENT DOCUMENT (TRD)**

**Project Title:** Interactive Web GIS Platform for Rejoagung Village 2026
**Document Version:** 2.2 (Production-Ready Spec - Layout Logic Rectified)
**Target Stack:** Next.js 15 (App Router), React-Leaflet 4, Tailwind CSS, shadcn/ui, Recharts
**Hosting Target:** Vercel / Cloudflare Pages (Static Client-Side Optimization Strategy)

---

## **1. SYSTEM VISION & PARADIGM ARCHITECTURE**

The Interactive Web GIS Platform for Rejoagung Village is architected as a **Zero-Backend, Zero-Database, Client-Side Aggregated Spatial Information System**. It eliminates recurring cloud hosting overheads, ensuring indefinite accessibility over low-bandwidth mobile networks typical for rural deployment.

```
                  +-------------------------------------------------+
                  |               User Browser (Client)             |
                  +-------------------------------------------------+
                                           |
                [App Dynamic Mounting]     | [Fetch API via Static Paths]
                                           v
+------------------------------------+   +----------------------------------+
|      Stateful Controller Hub       |-->|   Data Ingestion Lifecycle       |
|       (src/app/page.tsx)           |   |   (Parallel Promise.all)         |
+------------------------------------+   +----------------------------------+
                 |                                         |
                 | [Prop Injection]                        | [Aggregated Arrays]
                 v                                         v
+------------------------------------+   +----------------------------------+
|    Dashboard Analytics Module      |   |        Map Viewer Canvas         |
| (Summary Cards, Recharts Engines)  |   |   (React-Leaflet Vektor Core)    |
+------------------------------------+   +----------------------------------+

```

### **Core Engineering Principles:**

* **Front-End Data Aggregation Engine:** The browser functions as the query compiler. Statistical summaries, percentage distributions, and complex matrices are calculated at runtime using Native JavaScript Array methods (`.filter()`, `.reduce()`, `.map()`, `.length`) running against cached GeoJSON strings.
* **Deterministic Layout Routing:** The UI switches seamlessly between a multi-column comprehensive dashboard overview and full-screen dynamic geospatial canvases controlled via local React state hooks.
* **Hydrographic Context Binding:** River grids and irrigation networks (`sungai.geojson`) are isolated as immutable, event-free vector `LineString` elements to establish environmental baselines without layout collision hazards.

---

## **2. DATA ARCHITECTURE & GEOJSON INGESTION REGIME**

All geospatial features are ingested as standard `WGS 84 (EPSG:4326)` geographical coordinates (Longitude, Latitude) to eliminate runtime projection transformations.

### **A. Folder Directory Alignment**
the name of the data files are only example and may different to what are actually in the folder, please refer to `docs/requirements/PRD.md` on section 4 regarding `Data Architecture (Static GeoJSON Schema)`

```text
workspace/sig-rejoagung/
├── public/
│   └── data/
│       ├── batas-administrasi.geojson
│       ├── jaringan-jalan.geojson
│       ├── sungai.geojson
│       ├── pemerintahan.geojson
│       ├── tempat-ibadah.geojson
│       ├── fasilitas-pendidikan.geojson
│       ├── potensi-desa.geojson
│       └── akses-sekolah.geojson

```

*Note: Paths inside the application must bypass the `public` prefix and point directly to target root resources (e.g., `/data/pemerintahan.geojson`).*

### **B. Structural Data Contracting & Property Fallbacks**

To prevent runtime `TypeError` faults due to missing spatial properties, strict object parsing strategies must be implemented using fallback values.

#### **Asset/Facility Data Contract Template:**

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [114.3062171, -8.3892121]
      },
      "properties": {
        "NAMOBJ": "Kantor Desa Rejoagung",
        "KATEGORI": "Pemerintahan",
        "KONDISI": "Baik",
        "REMARK": "Pusat pelayanan administrasi utama desa",
        "STATUS_ADM": "Negeri",
        "AKREDITASI": null
      }
    }
  ]
}

```

---

## **3. RESPONSIVE LAYOUT ENGINE (ADAPTIVE INTERFACE SPEC)**

The system employs a strict conditional fluid viewport control engine built on Tailwind CSS adaptive viewport grid systems.

### **A. Desktop View (The Stateful Controller Layout - Resolution > 1024px)**

The viewport layout inside `src/app/page.tsx` implements a 2-column structure governed by conditional rendering hooks:

```
+-----------------------------------------------------------------------------------+
|  SIDEBAR (W-72)  |  MAIN HEADER (H-16)                                            |
|                  |  [Dynamic: Active Module / Dashboard Analytics Title]          |
|------------------+----------------------------------------------------------------|
| 📊 Dashboard     |                                                                |
|    Analytics     |  CONDITIONAL VIEW AREA (FLEX-1)                                |
|                  |                                                                |
|  MAP MODULES     |  IF "Dashboard Analytics": Renders Summary Cards & Recharts    |
| 📍 Peta Aset &   |  IF "Peta ...": Renders Full-Screen Leaflet Canvas Layout      |
|    Fasum         |                                                                |
| 🌴 Peta Potensi  |                                                                |
|    Lahan & SDA   |                                                                |
| 🏫 Peta Akses    |                                                                |
|    Sekolah       |                                                                |
+-----------------------------------------------------------------------------------+

```

* **Left Component:** Sidebar interface (`w-72`, `flex-shrink-0`) allocated for global module navigation, branding assets, and layer toggling controls.
* **Right Component:** Main Area (`flex-1`, viewport `h-screen`, vertical `overflow-hidden`) containing a structured dynamic headliner bar (`h-16`) and the main **Conditional View Area**.
* **State A (`currentView === "dashboard"`):** Renders the `DashboardAnalytics` module containing comprehensive statistical cards and Recharts visualization engines. The map canvas is unmounted.
* **State B (`currentView === "aset" | "potensi" | "sekolah"`):** Renders the full-screen `MapViewer` canvas layout container. The static metrics charts are unmounted.


* **Rationale:** Maximizes screen real estate to provide an isolated, high-focus view for either detailed statistics or interactive spatial map analysis during presentation sessions.

### **B. Mobile Viewport Framework (The Field Operation Layout - Resolution < 1024px)**

* **Layout Structure:** Mobile-first, canvas-first responsive viewport approach.
* **Base Layer:** Full-screen rendering container expanding to absolute viewport dimensions (`100vw`/`100vh`).
* **Collapsible Sheet Overlays:** The sidebar collapses completely into a native mobile sheet triggered via a header hamburger toggle.
* **Conditional Metrics Overlay:**
* **Dashboard Mode:** Stacks analytics cards and Recharts panels vertically inside a responsive scrollable block.
* **Map Modes:** Interactive points and polygons trigger a custom **InfoModal** (Expanded Dialog) wrapper (`max-w-2xl` with a stylized M3 translucent backdrop). It replaces native Leaflet popups to provide readable, 2-column detailed data views optimized for touch interactions.



---

## **4. DETAILED SPECIFICATIONS: MODULE & ANALYTIC BLOCKS**

### **A. Module 1: Assets & Public Facilities (Fasum)**

Designed to serve as a tactical dashboard tool for infrastructure budget planning and structural management.

#### **Geospatial Map Canvas Rules:**

* **Batas Administrasi Layer:** Rendered as an isolated boundary block utilizing explicit vector styling parameters: `weight: 3`, `color: "#4b5563"`, `fillColor: "transparent"`, `fillOpacity: 0`.
* **River Vektor Path Rendering:** `LineString` elements from `sungai.geojson` map automatically with deep water configurations: `color: "#06b6d4"`, `weight: 2`, `opacity: 0.6`, `interactive: false`.
* **Asset Points Rendering:** Point layers map to distinct high-contrast configurations based on their functional classifications:
* Office Centers $\rightarrow$ Orange Circle Markers (`radius: 10`, `fillColor: "#ea580c"`).
* Places of Worship $\rightarrow$ Blue Circle Markers (`radius: 7`, `fillColor: "#2563eb"`).



#### **Dashboard Component Metrics:**

* **Card 1 (Village Area Metric):** Compiles properties from the administrative polygon layer to compute total hectares (`feature.properties.LUAS`).
* **Card 2 (Fasum Density Grid):** Integrates a dynamic Tailwind CSS layout rendering quantitative totals next to inline proportional bars or progress meters showing the distribution ratios between Government Offices, Places of Worship, and Educational Buildings.

---

### **B. Module 2: School Accessibility & Education**

Engineered to map vulnerabilities in educational access across the village perimeter.

#### **Geospatial Map Canvas Rules:**

* **Stratified Marker Color Codes:** Point coordinate layers render distinct colors mapping to the specific educational tier:
* Kindergarten (TK) $\rightarrow$ Pink (`#ec4899`)
* Elementary School (SD) $\rightarrow$ Red (`#ef4444`)
* Junior High School (SMP) $\rightarrow$ Blue (`#3b82f6`)
* Senior High School (SMA) $\rightarrow$ Green (`#10b981`)
* Vocational School (SMK) $\rightarrow$ Yellow (`#eab308`)


* **Network Analysis Multi-Tier Overlays:** Renders concentric reachability buffer zones (`akses-sekolah.geojson`) beneath point layers:
* 5-Minute Zone $\rightarrow$ Green (`#22c55e`, `fillOpacity: 0.3`)
* 10-Minute Zone $\rightarrow$ Yellow (`#eab308`, `fillOpacity: 0.25`)
* 15-Minute Zone $\rightarrow$ Red (`#ef4444`, `fillOpacity: 0.2`)



#### **Dashboard Component Metrics:**

* **Card 1 (Macro Statistics Block):** A large numeric read-out displaying the baseline inventory count (Total: 8 Sekolah).
* **Card 2 (Recharts Pie/Donut Chart):** Maps dynamic private versus public distribution ratios, alongside internal institutional accreditation distributions (A, B, C).
* **Card 3 (Recharts Bar Chart):** Renders a vertical representation mapping school frequencies across tiers (TK vs. SD vs. SMP vs. SMA vs. SMK).
* **Card 4 (Travel Time Matrix Table):** A clean tabular framework organizing school lists into rows matched to their calculated travel buffers.
* **Card 5 (Accessibility Coverage Index):** Renders a calculated spatial indicator value showing the percentage of local residential clusters within the safe 5-10 minute transit buffers.

---

### **C. Module 3: Land Potential & Natural Resource Analytics**

Maps localized geographic properties to targeted economic policies across the 4 key village sub-districts (Dusun).

#### **Geospatial Map Canvas Rules:**

* **Choropleth Sub-District Mapping:** Divides the vector space into 4 large spatial zones using distinct pastel colors (`fillOpacity: 0.4`, `weight: 2`, `color: "#ffffff"`).
* **On-Click Interactive Trigger Hooks:** Attaches click event listeners directly to the individual polygons to open `InfoModal.tsx` displaying the complete localized asset keys.

#### **Dashboard Component Metrics (Dynamic Dusun Profiler Panel):**

* **Simultaneous Matrix Display Grid:** The Dashboard view bypasses interactive map clicks, rendering a permanent 4-column profile grid that maps data values to localized economic policy adjustments:

| **Target Cluster / Dusun** | **Geospatial Natural Resource Profiles** | **Socio-Economic Policy Implications** |
| --- | --- | --- |
| **Sumberagung** | Intensive wet-field rice paddies, coffee & cacao estates, traditional irrigation networks. | Post-harvest processing optimization & supply chain integration for estate crops. |
| **Sumberagung Kidul** | Crop cultivation (Chili, Tomato), livestock farming, biomass & biogas potentials. | Circular economy integration: processing agricultural wastes into local biofuel alternatives. |
| **Sumbergroto** | Highly fertile agricultural zones, freshwater aquaculture, active river pathways. | Integrated food security programs combined with eco-tourism infrastructure investment. |
| **Sumbergroto Kidul** | Flood-tolerant rice strains, freshwater fish ponds, wild pandan harvests, conservation zones. | Flood mitigation structures coupled with sustainable home-industry textile development. |

---

## **5. TECHNICAL PERFORMANCE & SAFETY SAFEGUARDS**

To ensure zero-maintenance operations post-deployment, the client-side execution container must strictly observe the following parameters:

* **Dynamic SSR Bypass:** Map elements must be initialized using Next.js lazy-loading components configured with zero server-side compilation options to completely prevent `window is not defined` runtime errors:
```tsx
const DynamicMapCanvas = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => <MapLoadingSkeleton />
});

```


* **Map Reactivity Key Binding:** The Leaflet `<GeoJSON/>` rendering container must incorporate an active state key (`key={activeModule}`) to force layer cleanup and initialization whenever user navigation options change.
* **Graceful Fetch Error Catching:** File fetching operations must be wrapped in `try/catch` blocks. Missing components or invalid file properties must display contextual fallbacks (e.g., `"Data Not Mapped"`) without halting the browser script thread.
* **Lighthouse Optimization Blueprint:** Static `.geojson` files must be simplified down to absolute coordinate paths in QGIS, maintaining a collective project asset footprint under **5MB** to guarantee fast initial loads on basic smartphones.