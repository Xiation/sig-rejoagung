# Component Documentation: Web GIS Rejoagung 2026

This document outlines the UI component architecture, implementation patterns, and usage guidelines for the Rejoagung Village GIS Platform. All components are built using **React 19**, **Next.js 15**, **Tailwind CSS**, and **shadcn/ui**.

---

## 1. Core Layout Architecture

### Sidebar Navigation (`src/components/Sidebar.tsx`)
The fixed navigation hub for the platform.
- **Usage:** Always present on the left side of the viewport.
- **Props:** 
  - `activeView`: Current state from the controller.
  - `onViewChange`: Function to switch views.
- **Visuals:** Uses `bg-white` with a `border-slate-200`. Active states utilize `bg-emerald-50` and `text-emerald-600`.

### Header (`src/components/Header.tsx`)
Displays context-aware titles and top-level actions.
- **Usage:** Sits at the top of the main content area.
- **Components:** Includes a `Search` input (shadcn/ui) and user profile/notification icons.

---

## 2. shadcn/ui Foundation

The following base components are customized with the **Hijau Rejoagung** design tokens:

### Cards
- **Usage:** Primary container for metrics, charts, and table sections.
- **Implementation:** `<Card className="rounded-xl shadow-sm border-slate-100 shadow-emerald-900/5">`
- **Sections:** `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`.

### Badges
- **Usage:** Status indicators and category labels.
- **Variants:**
  - `Success`: `bg-emerald-50 text-emerald-700` (e.g., Live Data, Active).
  - `Destructive`: `bg-rose-50 text-rose-600` (e.g., Threats, Alerts).
  - `Warning`: `bg-amber-50 text-amber-700` (e.g., Pending, In Progress).

### Sheets & Dialogs
- **Usage:** Micro-deep dives and parcel details.
- **Variants:** 
  - `Sheet`: Right-side slide-out for detailed property info.
  - `Dialog`: Centered overlay for focused analysis.

---

## 3. Data Visualization Components

### Metric Scorecards (`src/components/analytics/LandPotentialMetrics.tsx`)
- **Composition:** Icon (Lucide), Label (Slate-500), Value (Slate-900 Bold), Trend Indicator.
- **Pattern:** Use `grid-cols-1 md:grid-cols-3` for desktop layouts.

### Bar Charts (Recharts)
- **Usage:** Commodity and frequency distributions.
- **Implementation:** Wrapped in `ResponsiveContainer`. Uses `emerald-600` for primary bars and `slate-100` for background grids.
- **Styling:** Tooltips use `rounded-xl` and `shadow-md`.

### Data Tables
- **Usage:** Asset inventory and administrative logs.
- **Features:** Integrated search, badges for condition status, and hover states for rows.

---

## 4. Geospatial Components (Mocked)

### DynamicMapViewer
- **Usage:** Interactive map canvas.
- **Implementation:** Uses `dynamic()` from Next.js with `ssr: false` to prevent hydration mismatch with Leaflet.
- **Interactive Layers:** 
  - `Polygon`: Represents land parcels (e.g., Sawah Lor).
  - `Marker`: Represents assets or facilities.

---

## 5. Usage Guidelines

### Color Application
- **Primary Action:** Use `bg-emerald-600` for buttons.
- **Neutral Text:** Use `text-slate-900` for headings and `text-slate-500` for secondary labels.
- **Dividers:** Use `border-slate-200`.

### Spacing Patterns
- **Container Padding:** `p-6`.
- **Vertical Gap between sections:** `space-y-8`.
- **Card Grid Gap:** `gap-6`.

### Typography
- **Headings:** `Inter` or `Geist Sans`, `font-bold`, `tracking-tight`.
- **Metrics:** `font-extrabold`.
- **Data Labels:** `uppercase`, `text-[10px]`, `tracking-wider`.
