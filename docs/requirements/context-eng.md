# Context & Architecture Document

**Project:** Interactive Web GIS Platform for Rejoagung Village 2026
**Tech Stack:** Next.js (App Router), React-Leaflet, Tailwind CSS v4, shadcn/ui, Recharts.
**Paradigm:** Zero-Backend, Client-Side Rendering (CSR), Component-Driven Architecture.

This document is an in-depth technical guideline mapping the project architecture, specific file and component functionalities, data structures, and the implementation of the *Design System* (Material Design 3). This document acts as a central reference connecting:
*   [Product Requirement Document (PRD)](./PRD.md)
*   [Technical Requirement Document (TRD)](./TRD.md)
*   [Design System Guidelines](../DESIGN/DESIGN_SYS.md)

---

## 1. Component & UI Architecture

The application is built using a **Bento Shell Layout** (Fixed Sidebar Nav + Fixed TopAppBar + Dynamic Content Area).

### A. Main Layout (Shell)
*   `src/app/page.tsx`: *Stateful Controller Hub*. Manages the `activeModule` state (`"dashboard"`, `"aset"`, `"potensi"`, `"sekolah"`). Renders the `Sidebar`, `TopAppBar`, and the content area which toggles between `AnalyticsDashboard` and `MapViewer`.
*   `src/components/Sidebar.tsx`: Fixed 288px (18rem) width. Contains the navigation menu categorized into Overview and Map Modules.
*   `src/components/layout/TopAppBar.tsx`: Fixed 64px (4rem) height. Displays the active module's context and status badge.

### B. Analytics Dashboard Module (`src/components/analytics/`)
Employs the **Composite Bento Grid** concept to summarize qualitative and quantitative data.
*   `analyticsDashboard.tsx`: Main wrapper. Arranges *Macro Scorecards* on the first row (3 columns), outfitted with a transparent *watermark icon* (20% opacity) in the bottom-right corner of each card.
*   `AssetMetrics.tsx`, `EducationMetrics.tsx`, `LandPotentialMetrics.tsx`: *Composite Chart* cards rendering Recharts graphs (Bar, Pie/Donut). Utilizes M3 semantic chart colors (e.g., `--chart-1` for primary data).
*   `customTooltip.tsx`: Custom tooltip for Recharts to unify with the M3 card aesthetic.

### C. Map & Web GIS Module (`src/components/map/`)
*   `MapViewer.tsx`: Dynamically imports `MapBase` (`next/dynamic` with `ssr: false`) to prevent Leaflet Hydration errors.
*   `MapBase.tsx`: The primary `MapContainer` canvas. Sets the Esri Satellite basemap and enforces panning bounds to the village polygon (Administrative Boundary).
*   **Data Layers (`/layers/`)**: 
    *   `AsetfasumLayer.tsx`, `SekolahLayer.tsx`, `PotensiLayer.tsx`.
    *   Role: Fetches `.geojson` files, renders them on Leaflet (using `CircleMarker` or polygon `GeoJSON`), captures *click events*, injects feature coordinates (`_lat`/`_lng`), and triggers `InfoModal`.
*   **Detail Dialogs (`InfoModal.tsx` & `/content/`)**: 
    *   `InfoModal.tsx`: M3-styled smart modal wrapper (max-w-2xl, backdrop blur) that encapsulates content components.
    *   `AsetfasumModal.tsx`, `SekolahModal.tsx`: Point location specific layouts (2 columns: Profile & Spatial Info).
    *   `PotensiModal.tsx`: Heavy-data layout for sub-district polygons, utilizing *Error Containers* (Resource Threats) and *Success Containers* (Recommendations) for actionable insights.

### D. UI Primitives (`src/components/ui/`)
*   `Icon.tsx`: Wrapper for **Material Symbols Outlined** icons. Supports custom sizes, `filled` state, and inline `style` modifications (e.g., matching icon colors to school levels).
*   `badge.tsx`, `button.tsx`, `card.tsx`: Base M3 components.

---

## 2. GeoJSON Data Structure (`public/data/`)

The system uses client-side data aggregation (Zero-Database). All geospatial data is served as static WGS 84 (EPSG:4326) `.geojson` files. Data is modularized into folders:

*   **`akses/` (School Accessibility Module):**
    *   `Fasilitas Pendidikan.geojson` (School points).
    *   `Service Area 10 Menit.geojson` etc. (*Network Analysis* Polygons).
*   **`fasum/` (Village Assets Module):**
    *   `Pemerintahan.geojson`, `Ibadah.geojson`, `Pendidikan.geojson`.
    *   Expected properties: `NAMOBJ` (Name), `REMARK` (Description), `FGSGOV` / `FGSIBD` (Category). If data is *sparse*, the UI renders custom fallbacks.
*   **`potensi/` (Land Potential Module):**
    *   `Potensi Dusun.geojson`. Contains rich data per sub-district (Soil Type, Commodities, Rice Yield, Threats, Recommendations).

---

## 3. Design System Implementation (M3)

This application is strictly guided by [DESIGN_SYS.md](../DESIGN/DESIGN_SYS.md).

*   **Semantic Color Tokens (in `globals.css`):**
    *   `--primary` (`#059669`): The Rejoagung brand emerald green.
    *   `--surface-container-low`: The main canvas background.
    *   `--primary-container` & `--on-primary-container`: Used for active states (Sidebar menu).
*   **Typography Utilities:**
    *   `display-metric`: Giant metric numbers (`text-3xl font-extrabold`).
    *   `headline-lg`: Section titles (`text-xl font-bold`).
    *   `label-caps`: Small, capitalized metadata text (`text-[10px] tracking-wider`).
    *   `body-base`, `micro-copy`: Standard supporting text.
*   **UI Interaction:** Modals use M3 animations (`animate-in fade-in zoom-in-95`). Components do not rely on *hover* states, prioritizing touch accessibility (Mobile-First).

---
**Document Status:** *Up-to-date* (Pre-Production Phase).
