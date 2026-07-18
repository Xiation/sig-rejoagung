# Web GIS Rejoagung: Comprehensive Design System (M3 Evolution)

This document defines the visual language, layout principles, and component specifications for the **Rejoagung Village GIS Platform (2026)**, following the Material Design 3 (M3) transition.

---

## 1. Visual Foundation (M3 Semantic Tokens)

The system moves away from static color scales to semantic tokens that respond to intent and elevation.

### Color Palette
*   **Primary (`#059669`):** Used for branding, active states, and key data points.
*   **Primary Container:** Used for highlighted cards and active navigation backgrounds.
*   **Surface Container Low:** Default background for the main dashboard canvas to provide subtle contrast.
*   **Surface Container:** Background for primary content cards and data panels.
*   **Outline Variant:** Used for soft dividers and card borders to maintain structure without visual noise.

### Typography (Inter / Geist Sans)
*   **Display Metric:** `text-3xl font-extrabold tracking-tight` (Main numbers).
*   **Headline Large:** `text-xl font-bold` (Section headers).
*   **Label Caps:** `text-[10px] font-bold uppercase tracking-wider` (Metadata & sub-labels).
*   **Body Base:** `text-sm font-medium` (Standard reading text).

---

## 2. Layout Architecture: The Bento Shell

The application utilizes a **Fixed-Shell** layout optimized for high-density spatial analysis.

*   **Sidebar Navigation:** `18rem (288px)` fixed width. Left-aligned.
*   **Top App Bar:** `4rem (64px)` fixed height. Anchored to the top, offset by the sidebar width.
*   **Main Viewport:** Liquid layout using `p-6` global padding and `gap-6` for internal component spacing.

---

## 3. The Composite Bento Grid System

Instead of uniform cards, the dashboard uses a **Composite Bento Grid** that aggregates related data into meaningful clusters.

### A. Macro Scorecard Placement (Row 1)
Macro scorecards are placed at the top of the dashboard to establish the high-level context.
*   **Structure:** 3-column grid (`grid-cols-1 md:grid-cols-3`).
*   **Visual Logic:** 
    *   **Icon:** Top-left (Primary/Surface-container-high).
    *   **Metric:** Center-bottom (Display Metric).
    *   **Trend/Status:** Inline below metric.
    *   **Watermark:** A large, 20% opacity icon positioned in the bottom-right of the card for visual anchoring.

### B. Composite Chart Cards (Middle Grid)
The heart of the dashboard where qualitative charts meet quantitative metrics.
*   **Layout:** Spans 2 or 3 columns in a larger grid (`grid-cols-5` or similar).
*   **Header Section:** Includes an icon, bold title, and inline metric badges (e.g., "Padi: 60%").
*   **Chart Area:** Centered `ResponsiveContainer` (Recharts) using the Primary brand color for data bars.
*   **Metadata Footer:** Key legends and data source labels using `Label Caps`.

---

## 4. Component Placement Rules

### Interactive Map Canvas
*   **Legend Overlay:** Fixed at `bottom-6 left-6`. Uses `Surface Container` with a glassmorphism blur.
*   **Control Cluster:** Fixed at `bottom-6 right-6`. Vertical stack for Zoom In/Out and Location.

### InfoModal (Expanded Dialog)
*   **Size:** `max-w-2xl` (approx. 672px).
*   **Columns:** 2-column grid layout for detailed deep-dives.
    *   **Left Column:** Geographical Profiles (Area, Elevation, Soil Type).
    *   **Right Column:** Inventory & Commodity (Crops, Estimated Yield, Progress Bars).
*   **Insight Blocks:** Placed at the bottom, using `Error/Success Containers` to denote urgency.

---

## 5. Usage & Implementation
*   **Elevation:** Use shadows sparingly (`shadow-sm`). Depth is primarily communicated through color shifts (Surface → Surface Container).
*   **Icons:** Exclusively **Material Symbols Outlined** with a consistent 24px base size.
*   **Empty States:** Use `bg-slate-50` with centered `Label Caps` text for areas without active data.

---
*Document Version: 2.0 (M3 Refinement)*