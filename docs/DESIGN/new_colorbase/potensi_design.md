The Refined Parcel Insights (InfoModal) is designed as a high-density analytical layer that bridges spatial data with actionable field intelligence. Its architecture follows a "Scan-First, Act-Second" philosophy, ensuring that village officials can interpret land potential at a glance.
1. Visual Architecture (The Bento Detail Panel)

The modal rejects a traditional linear list in favor of a Bento Grid layout, which groups related data into distinct visual clusters. This allows the eye to categorize information intuitively:

    Macro-Geographic Cluster: Luas Area, Elevasi, and Tipe Tanah are presented as top-level cards with a neutral Slate-50 background to establish the physical context immediately.
    Lifecycle Inventory Hub: The "Inventaris Komoditas" section uses a high-contrast container to highlight active agricultural production, featuring integrated progress bars for growth tracking.

2. Color System & Semantic Logic

The color system follows the 80/20 "Semantic Breathing" logic defined in the Geospatial Intelligence System:

    Surface Foundation: Pure white (#FFFFFF) body with a Slate-200 border to maintain crispness against the vibrant map canvas.
    Brand Anchors: Emerald-600 is used for the "Selected Parcel" badge and the primary "Tutup Detail" action, reinforcing the Hijau Rejoagung identity.
    Urgency Levels:
        Threats (Rose-50): Applied to the irrigation alert to trigger immediate cognitive attention.
        Optimizations (Emerald-50): Applied to soil conditions to signal stable, positive environments.

3. Typography & Hierarchy

    Display Header: Uses Hanken Grotesk Bold for the parcel name (e.g., "Blok 4A") to anchor the view.
    Technical Metadata: The Parcel ID uses a mono-spaced font style with Slate-500 to communicate GIS precision.
    Data Labels: All sub-labels use Label Caps (uppercase, tracked out) to differentiate metadata from primary values.

4. Interactive Feel

    Elevation: Utilizes shadow-xl to create significant depth, ensuring the modal feels like a floating "SaaS" interface above the map.
    Radius: A consistent rounded-2xl (16px) corner radius softens the technical density, making the tool feel accessible and modern rather than like a rigid government database.
