# **DESIGN SYSTEM & UI/UX GUIDELINES**

**Project Title:** Interactive Web GIS Platform for Rejoagung Village 2026
**Theme:** Modern Light Mode + "Hijau Rejoagung" (Corporate Public Sector meets Modern SaaS)
**Target Stack:** Tailwind CSS, shadcn/ui, Lucide Icons

---

## **1. BRAND FOUNDATION**

### **Brand Name**

**Web GIS Rejoagung** (Interactive Spatial & Analytics Dashboard)

### **Brand Identity**

A technological bridge connecting Rejoagung's rich agricultural/rural heritage with modern, data-driven governance. The visual identity sheds the outdated "government portal" look, replacing it with a premium, enterprise-grade spatial analytics tool that retains the village's localized identity.

### **Brand Personality**

* **Professional & Trustworthy:** Operates like a precision tool for decision-makers.
* **Welcoming & Accessible:** Does not intimidate non-technical users (village officials, local residents).
* **Progressive & Clean:** Focuses on data clarity without unnecessary visual clutter.

### **Brand Tone**

Informative, objective, structured, and highly legible. The interface communicates through clear visual hierarchy and precise data labeling rather than lengthy text.

---

## **2. COLOR SYSTEM (PALETTE)**

The color system is built on an **80/20 Rule**: 80% breathable neutral space (Slate/White) to reduce eye strain during data analysis, and 20% localized Accent (Emerald/Hijau Rejoagung) to establish brand identity and draw attention to interactive elements.

* **Background (App Canvas):** `bg-slate-50` (`#f8fafc`)
* *Rationale:* A very subtle, cool off-white that prevents the blinding effect of pure white screens while providing contrast for content cards.


* **Surface (Cards & Panels):** `bg-white` (`#ffffff`)
* *Rationale:* Creates a distinct elevation for data containers, separating them cleanly from the background canvas.


* **Text Primary (Headings & Key Metrics):** `text-slate-900` (`#0f172a`)
* *Rationale:* Avoids pure black (`#000`), reducing harsh contrast fatigue while maintaining strict readability for crucial numbers.


* **Text Secondary (Labels, Subtitles, Legends):** `text-slate-500` (`#64748b`)
* *Rationale:* Guides the user's eye away from secondary information so primary data stands out.


* **Accent / Primary Brand (Hijau Rejoagung):** `emerald-600` (`#059669`) / `emerald-500` (`#10b981`)
* *Rationale:* A sophisticated, modern evolution of the classic "Government Green." Used strictly for active sidebar links, primary buttons, progress bars, and critical highlights.


* **Border & Dividers:** `border-slate-200` (`#e2e8f0`)
* *Rationale:* Soft, barely-there lines to structure tables and layout sections without enclosing them in rigid boxes.


* **Highlight / Chart Palette (Recharts):**
* Muted, complementary data colors to prevent clashing with the Emerald accent (e.g., `rose-500` for SD, `blue-500` for SMP, `amber-400` for SMK).



---

## **3. TYPOGRAPHY**

Leveraging the Next.js App Router default optimized fonts to ensure fast loading and absolute crispness on mobile screens.

* **Primary Font Family:** `Inter` or `Geist Sans` (Clean, geometric sans-serif).
* **Hierarchy Scale:**
* **H1 (Module Titles):** `text-2xl font-bold tracking-tight text-slate-900`
* **H2 (Section Headers):** `text-xl font-semibold text-slate-800`
* **Metric Readouts (Big Numbers):** `text-3xl font-extrabold text-slate-900`
* **Body/Standard:** `text-sm font-medium text-slate-700`
* **Micro-copy (Legends, Captions):** `text-xs font-normal text-slate-500`



---

## **4. SPACING & LAYOUT**

Built entirely on Tailwind's strict 4pt grid system to ensure mathematical rhythm across the interface.

* **Global Padding:** `p-4` (Mobile) to `p-6` (Desktop) for the main application wrapper.
* **Component Gaps:** `gap-4` for tight metric clusters, `gap-6` for separating large chart panels in CSS Grids.
* **Vertical Rhythm:** `space-y-4` or `space-y-8` to distinctly separate analytical sections (e.g., Asset Section vs. Education Section).

---

## **5. VISUAL TEXTURE & ELEVATION**

Rejecting the heavy borders of classic web design in favor of depth and elevation.

* **Soft Shadows (Floating Effect):** All cards and floating map panels utilize `shadow-sm` or `shadow-md` alongside a highly transparent border (`border-slate-100`). This makes the data panels appear to float elegantly above the map or background.
* **Corner Radii (Rounding):**
* `rounded-xl` for large structural elements (Cards, Map Canvas wrapper).
* `rounded-md` for interactive elements (Buttons, Input Fields, Dropdowns).


* **Glassmorphism (Map Overlays):** Any UI element that overlays the active Leaflet Map (like the mobile metric drawer or map filter) uses `bg-white/90 backdrop-blur-md` to maintain spatial context beneath the UI.

---

## **6. ICONOGRAPHY**

* **Library:** `Lucide React` (Natively integrated with `shadcn/ui`).
* **Style:**
* Line icons with a consistent `2px` stroke width.
* Sizing standard: `w-5 h-5` for general UI, `w-8 h-8` for prominent dashboard card icons.
* Color: `text-emerald-600` for active/brand icons, `text-slate-400` for neutral/inactive menu items.



---

## **7. COMPONENT SPECIFICATIONS**

### **A. Cards (`shadcn/ui` Card)**

* **Anatomy:**
* `CardHeader`: Contains a small Lucide icon and the metric title (`text-slate-500`).
* `CardContent`: Contains the primary data (Large number, Chart, or Progress Bar).


* **Styling:** `bg-white rounded-xl shadow-sm border border-slate-100`.

### **B. Buttons (`shadcn/ui` Button)**

* **Primary Button:** `bg-emerald-600 text-white hover:bg-emerald-700 rounded-md transition-colors`. Used for primary map actions (e.g., "Tampilkan Rute", "Terapkan Filter").
* **Secondary / Outline Button:** `bg-white text-slate-700 border border-slate-200 hover:bg-slate-50`. Used for toggles and secondary interactions.

### **C. Containers & Layout (Responsive Grid)**

* **Sidebar:** Fixed width (`w-72`), `bg-white border-r border-slate-200`. Clean, text-heavy navigation.
* **Dashboard Grid:** Transitions from `grid-cols-1` (Mobile) $\rightarrow$ `grid-cols-2` (Tablet) $\rightarrow$ `grid-cols-4` (Desktop) for macro statistics, ensuring data is never squished.
* **Map Container:** Uses `h-full w-full rounded-xl overflow-hidden shadow-inner border border-slate-200` to frame the Leaflet canvas sharply within the view area.