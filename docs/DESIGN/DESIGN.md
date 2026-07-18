---
name: Agro-Spatial Intelligence
colors:
  surface: '#ffffff'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#006947'
  on-tertiary: '#ffffff'
  tertiary-container: '#00855b'
  on-tertiary-container: '#f5fff6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  border: '#e2e8f0'
  text-muted: '#64748b'
  chart-sd: '#f43f5e'
  chart-smp: '#3b82f6'
  chart-smk: '#fbbf24'
typography:
  display-metric:
    fontFamily: Geist Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  section-header:
    fontFamily: Geist Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  micro-copy:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin-desktop: 1.5rem
  container-margin-mobile: 1rem
  gutter-grid: 1.5rem
  stack-section: 2rem
  stack-component: 1rem
  sidebar-width: 18rem
---

## Brand & Style

The design system is engineered to bridge the gap between traditional village governance and high-performance spatial analytics. It avoids the cluttered, bureaucratic aesthetic of typical government portals in favor of a **Corporate Modern** style that prioritizes data clarity and functional elegance.

The visual narrative is built on the concept of "Technological Heritage." It uses a clean, professional light-mode foundation to convey transparency and precision, while the "Hijau Rejoagung" (Emerald) accent grounds the digital experience in the village’s agricultural and environmental roots. 

The UI should evoke a sense of **authoritative calm**. It is a tool for decision-makers that feels as reliable as a spreadsheet but as intuitive as a consumer app. High whitespace, crisp typography, and subtle depth are the primary drivers of this sophisticated SaaS-inspired aesthetic.

## Colors

The palette follows a disciplined **80/20 distribution** to ensure long-term usability without visual fatigue.

- **Primary (Hijau Rejoagung):** Used for high-intent actions, active states, and brand-critical indicators.
- **Secondary (Slate 900):** Reserved for primary headings and key metrics to ensure maximum readability without the harshness of pure black.
- **Neutral (Slate 50):** Applied to the application canvas to create a soft contrast against white component surfaces.
- **Data Visualization:** A secondary set of chart colors is provided to differentiate education tiers and assets without competing with the primary brand emerald. Use these consistently across all Recharts or Leaflet marker implementations.

## Typography

This design system utilizes a dual-font approach to balance character and utility. 

- **Geist Sans** is used for headlines and large data readouts. Its geometric precision conveys a modern, technical feel suitable for spatial analytics.
- **Inter** is the workhorse for body text, labels, and UI controls. It is chosen for its exceptional legibility at small sizes (12px–14px) and its neutral, professional tone.

Maintain tight tracking on large headlines to preserve the "SaaS" aesthetic. Use `label-caps` for table headers and legend titles to create clear structural separation from the data itself.

## Layout & Spacing

The system employs a **Fixed Grid for Dashboarding** and a **Fluid Overlay for GIS Mapping**.

- **Dashboard Layout:** A 12-column system that reflows based on data density. Metrics use a 4-column span on desktop, collapsing to 1-column on mobile. Large chart panels should span at least 6 columns.
- **GIS Layout:** The map is the "Base Layer," filling 100% of the viewport height and width. UI panels (Filters, Legends, Metrics) float as absolute-positioned layers on top of this canvas.
- **Spacing Rhythm:** Adhere to a strict 4pt (0.25rem) increment. Use `1.5rem` (24px) as the standard gap between major analytical cards to allow the background canvas to act as a visual separator.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layering** and **Glassmorphism**.

- **Z-Index 0 (Canvas):** `bg-slate-50`.
- **Z-Index 10 (Cards/Panels):** `bg-white` with a `shadow-sm` and a `1px` border in `slate-100`. This creates a crisp, professional lift without the muddiness of heavy shadows.
- **Z-Index 20 (Map Overlays):** Panels sitting directly on the Leaflet map must use `bg-white/90` with a `backdrop-blur-md`. This ensures that spatial context is visible behind the UI controls, reducing the "trapped" feeling of modal-heavy GIS interfaces.
- **Shadow Profile:** Shadows should be highly diffused and low-opacity (e.g., `rgba(15, 23, 42, 0.05)`), tinted slightly with the Slate secondary color to maintain color harmony.

## Shapes

The shape language differentiates between **Structural Containers** and **Interactive Elements**.

- **Cards & Map Canvas:** Use `rounded-xl` (1rem) to soften the large data panels and make the dashboard feel approachable.
- **Buttons & Inputs:** Use `rounded-md` (0.375rem). This sharper radius signals utility and precision, distinguishing interactive tools from static information containers.
- **Sidebar Items:** Use a rounded-right pill shape for active states to create a clear "pointer" effect toward the main content area.

## Components

### Buttons
- **Primary:** `bg-emerald-600` with white text. High-contrast and bold.
- **Secondary:** `bg-white` with `slate-700` text and a `slate-200` border.
- **Active Toggle:** When a map layer is active, the button should adopt an `emerald-50` background with an `emerald-600` border and text.

### GIS Specifics
- **Map Legend:** A floating card at the bottom-right of the map. Use 12px circular color swatches to denote spatial categories.
- **Filter Drawer:** A semi-transparent side panel on mobile, or a floating glass card on desktop.

### Cards (Metric/Analytic)
- **Header:** Contains a `w-5 h-5` Lucide icon in `emerald-600` followed by a `slate-500` title in `label-caps`.
- **Content:** The primary metric should be the visual anchor (`display-metric`). Secondary trends (e.g., "+5% from last year") should be placed immediately below or beside the metric in a smaller, colored font.

### Form Inputs
- Standard inputs should use `bg-white` with a `slate-200` border. On focus, the border transitions to `emerald-600` with a subtle emerald outer glow (ring).