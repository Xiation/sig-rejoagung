The Pro-Level Bento Parcel Insights layout is engineered for high-density geospatial analysis, moving away from traditional linear lists toward a structured, "at-a-glance" grid system. This architecture ensures that field officers and decision-makers can interpret complex land data in milliseconds.
Document Brief: Bento Parcel Insights Architecture
1. Layout Philosophy: The "Bento" Grid

The layout utilizes a non-uniform grid to categorize information by functional priority. This reduces cognitive load by grouping related metrics into distinct visual containers.

    Macro-Metric Row (Top): A three-column layout for fundamental physical geography (Area, Elevation, Soil Type). These use a neutral Surface-Container-Low background to establish the baseline context.
    Production Hub (Center): A full-width specialized container for agricultural inventory. It combines qualitative status (e.g., "Masa Tanam") with quantitative growth tracking (Progress Bars).
    Insight Layer (Bottom): A two-column semantic grid reserved for "Actionable Intelligence," separating threats from optimizations.

2. Visual Hierarchy & Typography

    Anchoring: The parcel name (e.g., "Blok 4A - Sawah Lor") is the primary anchor, using Headline Large (Bold) to provide immediate orientation.
    Metadata Specification: Technical IDs and sub-labels use Label Caps (uppercase, tracked out) to distinguish system data from user-readable content.
    Primary Metrics: Large, high-contrast numbers for "Luas Area" and "Elevasi" ensure that key dimensions remain the focal point within their respective cards.

3. Semantic Color Logic (80/20 Rule)

The system applies the 80/20 "Semantic Breathing" logic to maintain professional clarity:

    80% Neutrality: Backgrounds and structural elements use Slate-50 and White to prevent visual fatigue during prolonged map analysis.
    20% Intentional Accent:
        Actionable Threats (Rose): High-saturation alerts for critical issues like "Low Irrigation."
        System Health (Emerald): Positive reinforcement for "Optimal Conditions" and the primary "Generate Report" action.
        Status Indicators (Amber): Used for "Masa Tanam" to signal a transient, active state.

4. Elevation & Spatial Separators

    Floating Surface: The entire modal utilizes shadow-xl and rounded-2xl corners to appear as a precise analytical layer floating above the complex spatial map data.
    Soft Boundaries: Instead of heavy borders, the layout uses Outline Variant (subtle Slate dividers) to separate sections, maintaining an open and modern "SaaS" aesthetic.
