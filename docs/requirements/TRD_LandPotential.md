# **TECHNICAL REQUIREMENT DOCUMENT (TRD): LAND POTENTIAL & NATURAL RESOURCE MODULE**

**Project Title:** Interactive Web GIS Platform for Rejoagung Village 2026
**Document Scope:** Exclusive Specification for Module 3 (Land Potential & SDA) - Map and Analytics
**Target Stack:** Next.js 15, React-Leaflet 4, Tailwind CSS, shadcn/ui (Sheet/Dialog, Cards, Badges), Recharts

---

## **1. MODULE ARCHITECTURE & UX PARADIGM**

The Land Potential module implements a strict **Macro-Micro Information Split**:

1. **Macro Overview (Dashboard Analytics):** Aggregates village-level metrics. Employs a Minimum Viable Product (MVP) data strategy to bypass missing quantitative data (e.g., exact tonnage, area) by utilizing frequency mapping and textual synthesis.
2. **Micro Deep-Dive (Map Interface):** Utilizes the map canvas for spatial discovery. Granular GeoJSON properties are offloaded into an interactive, side-sliding Sheet/Modal component to maintain a clean UI while providing exhaustive agricultural and economic details.

---

## **2. DASHBOARD ANALYTICS COMPONENT (`LandPotentialMetrics.tsx`)**

**Responsibility:** Displays the aggregated "Rapor Desa" (Village Report Card) for natural resources.

**Component Layout & Specifications:**

### **A. Macro Scorecards (Quick Numeric Indicators)**

A 3-column CSS Grid (`grid-cols-1 md:grid-cols-3`) replacing missing spatial quantifiers with derived data constants:

* **Card 1 (Total Dusun Terpetakan):** Static read-out `4`.
* **Card 2 (Rata-rata Indeks Pertanaman):** Displays `IP 200` (Averaged from the 4 properties).
* **Card 3 (Dominasi Topografi):** Displays `Datar - Landai`.

### **B. Resource Frequency Chart (Recharts Bar Chart)**

* **Implementation:** `<BarChart>` via Recharts wrapped in `<ResponsiveContainer height="{300}">`.
* **Data Logic:** Replaces the tonnage chart. It counts and maps the frequency of specific keywords across the 4 Dusuns (e.g., Y-axis: Total Dusuns, X-axis: "PLTS Atap", "Sapi", "Nila", "Padi").
* **UI/UX:** Highlights which sectors or infrastructures are most widely distributed across the village.

### **C. Threat Identification Matrix (Tag Cloud / Warning List)**

* **Implementation:** A dedicated `<Card>` utilizing flexbox wrapping (`flex flex-wrap gap-2`).
* **Data Logic:** Replaces the Donut Chart. Extracts strings from `properties["Ancaman SDA"]` and splits them into distinct visual tags.
* **UI/UX:** Utilizes `shadcn/ui` `<Badge variant="destructive">` to display elements like `Kekeringan`, `Alih Fungsi Lahan`, and `Pencemaran Sungai`.

### **D. Executive Policy Summary**

* **Implementation:** A full-width highlighted information block (`bg-emerald-50 border-l-4 border-emerald-600 p-4`).
* **Data Logic:** A statically hardcoded textual synthesis representing the overarching village strategy for the year.
* **Content:** *"Fokus strategis 2026: Optimalisasi Potensi Desa Rejoagung difokuskan pada intensifikasi pertanian lahan basah dan hortikultura, didukung oleh transisi menuju energi terbarukan komunal (PLTS & Biogas), serta hilirisasi produk kerajinan lokal dan ekowisata berkelanjutan."*

---

## **3. GEOSPATIAL MAP & MICRO DEEP-DIVE INTERFACE**

**Responsibility:** Handles spatial rendering and detailed data extraction upon user interaction.

### **A. Geospatial Map Canvas Rules (`dusun.geojson`)**

* **Geometry:** Ingests `"MultiPolygon"` features.
* **Rendering:** Renders 4 distinct Choropleth zones using pastel fill colors (`fillOpacity: 0.4`, `weight: 2`).
* **Interactivity:** Attaches an `onClick` event listener to each polygon layer that sets the active Dusun state and triggers the `<Sheet>` component.

### **B. Pop-up Modal Anatomy (`shadcn/ui` Side Sheet or Dialog)**
This section will take file `InfoModal.tsx` as the reference to display "potensi lahan" metrics and file `/public/data/potensi_SDA_data/dusun.geojson` as the GeoJSON fetched data 

Triggering a polygon opens a comprehensive overlay (sliding from the right or expanding center) to display localized details without cluttering the map.

* **Header Section:**
* Dusun Name (e.g., **Sumberagung**) rendered as an `<H2>`.
* Economic Potential Badge (e.g., `🌟 Potensi Sangat Tinggi`).


* **Section 1: Profil Geografis & Tanah (2-Column Grid)**
* Displays technical metrics for agricultural planning: `Jenis Tanah`, `pH Tanah`, `Topografi`, `Elevasi`, and `Kualitas Air`.


* **Section 2: Inventaris Komoditas (Bulleted Lists)**
* Structured into logical sub-categories using flexbox spacing:
* 🌾 **Pertanian & Kebun:** `Komoditas Pertanian`, `Jenis Tanaman`, `Komoditas Perkebunan`.
* 🍅 **Hortikultura & TOGA:** `Hortikultura`, `Tanaman Obat`.
* 🐟 **Peternakan & Perikanan:** `Jenis Hewan Ternak`, `Jenis Ikan Ternak`, `Sistem Budidaya Ikan`.




* **Section 3: Infrastruktur & Ekonomi**
* Displays `Energi Terbarukan`, `Potensi Agrowisata`, and `Kerajinan Lokal`.


* **Section 4: Actionable Insights (Highlight Boxes)**
* **Red/Orange Alert Box:** Displays `Ancaman SDA` with a warning icon (`LucideAlertTriangle`).
* **Green Success Box:** Displays `Rekomendasi` (Policy Recommendations) with an info icon (`LucideLightbulb`), guiding localized village interventions.
 
**IMPORTANT NOTE**: with the consideration above, `InfoModal.tsx` will have different condition information to display and this consideration above will only work IF the active module is "potensi lahan" 

we can implement dynamic context binding to separate the content of the spatial information into smaller sub-component

Component structure: 
```
src/components/map/
├── InfoModalWrapper.tsx       # Parent: Ngatur open/close state & layout pop-up
├── content/
│   ├── AssetModalContent.tsx  # Child khusus untuk Modul Aset & Fasum
│   ├── SchoolModalContent.tsx # Child khusus untuk Modul Akses Sekolah
│   └── LandModalContent.tsx   # Child khusus untuk Modul Potensi Lahan & SDA
```

---

## **4. TECHNICAL CONSTRAINTS**

1. **State Management:** The active polygon properties must be stored in a local React state (e.g., `const [selectedDusun, setSelectedDusun] = useState<GeoJSONProperties null |>(null)`) to feed the Modal component dynamically.
2. **No-Data Fallback:** The Modal must handle potentially empty string values from the GeoJSON gracefully by rendering `"Data tidak spesifik"` rather than throwing a structural layout error.