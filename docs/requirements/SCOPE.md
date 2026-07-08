# **Scope Management Document: MVP vs Feature Scope**

## **Project: Interactive Web GIS Platform for Rejoagung Village**
**Decision Criteria:** Time Efficiency (30 Effective Days), Architectural Constraints (Front-End Only), and Field Usability (Village Officials & Local Residents).

---

## **1. MVP Scope (Minimum Viable Product) – Must-Have**
These features are non-negotiable and must be production-ready by Week 4. If any of these features are absent, the product is considered unfit for deployment.

### **M-01: Bounded Base Map Rendering**
- **Description:** Renders a foundational basemap (OpenStreetMap or Esri Satellite) with strictly enforced camera bounds restricted to the administrative perimeter of Rejoagung Village.
- **Rationale:** Prevents village officials and local residents from accidentally panning or scrolling the map out of the target region (e.g., getting lost outside Banyuwangi regency).

### **M-02: Multi-Layer Static Data Ingestion**
- **Description:** The system must natively parse and render 3 distinct spatial data types directly fetched from the `/public/data/` folder:
  - **Village Assets & Public Facilities:** Rendered as **Point Vector Data** using standard Leaflet Markers or custom CircleMarkers.
  - **Village Potential:** Rendered as **Point Vector Data** (for specific MSME locations) AND/OR **Polygon Vector Data** (for agricultural and coconut plantation zoning boundaries).
  - **School Accessibility Analysis:** Rendered as **Polygon Vector Data** (transparent color-coded overlays representing reachability maps: Green for "Good Access", Red for "Needs Attention").

### **M-03: Layer Toggle Sidebar Control**
- **Description:** Utilizes a `shadcn/ui` Sidebar primitive populated with checkboxes or switches to dynamically mount/unmount specific spatial layers on the map canvas.
- **Rationale:** Minimizes visual clutter. Users can isolate single operational issues on demand (e.g., hiding commercial layers to focus entirely on school dropout vulnerabilities).

### **M-04: On-Click Information Display (Mobile-First Pop-up)**
- **Description:** Triggers information boxes using Leaflet's native Pop-up binder on an **On-Click (Tap)** event listener rather than an On-Hover trigger.
- **Mobile-First Rationale:** Since village officials will primarily access the application via smartphones, desktop hover interactions are functionally non-existent. Tap interaction models must be prioritized as the baseline MVP, while hover features are deferred to post-MVP development.

---

## **2. Extended Features – Nice-to-Have (Post-MVP)**
Development on these components may only commence during Week 5, provided all core MVP features are stable, optimized, and entirely bug-free.

### **F-01: On-Hover Styling Highlight (Desktop Only)**
- **Description:** Dynamically thickens polygon borders or alters opacity levels (`resetStyle` execution on mouse-out) when a desktop cursor enters a target perimeter.
- **Note:** Enhances aesthetic values for formal academic or stakeholder presentations but must be suspended if it negatively impacts browser rendering performance.

### **F-02: Marker Clustering for Public Facilities**
- **Description:** Integrates the `leaflet.markercluster` plugin to aggregate dense point groupings into numeric counters that automatically decluster upon zooming in.
- **Note:** Moved to the product backlog because KKN data collections generally yield low point densities, rendering standard markers perfectly readable without grouping algorithms.

### **F-03: Global Statistics Floating Card Panel**
- **Description:** A floating overlays card (`shadcn/ui` card primitive) anchored to a map viewport corner displaying hardcoded aggregates (e.g., *"Total Registered MSMEs: 12"*).
- **Note:** Purely informational and static, making it a low-priority asset compared to the interactive maps canvas.

### **F-04: Global Dark / Light Mode Switcher**
- **Description:** A holistic design theme provider switch integrated via `next-themes`.
- **Note:** Cosmestic value only. High-contrast **Light Mode** must remain the unalterable system default to ensure readability for field officials operating under direct sunlight.

---

## **3. Tactical Decision Matrix**

| Feature | Priority | Technical Complexity | MVP Status | Scheduled Action / Engineering Note |
| :--- | :---: | :---: | :---: | :--- |
| Bounded Base Map | **Must-Have** | Low | **MVP** | Complete early in Week 3. Constrain max bounds. |
| Layer Toggle Sidebar | **Must-Have** | Medium | **MVP** | Bind React component state hooks directly to Leaflet layer layers. |
| On-Click Pop-up (Tap) | **Must-Have** | Low | **MVP** | Use Leaflet's native `layer.bindPopup()` wrapper utilities. |
| On-Hover Visual Effect | **Nice-to-Have** | Medium | **Post-MVP** | Execute only if excess buffer time exists in Week 5. |
| Dark/Light Theme | **Nice-to-Have** | Low | **Post-MVP** | Skip if timeline contracts. Force hardcoded high-contrast light theme. |

---

## **4. Data-to-UI Mapping Rules (Engineering Constraints)**

To accelerate development speed and bypass custom asset rendering overhead, the agent must implement the following tactical logic:
1. **Zero Custom SVG Icons for MVP:** Do not spend time importing or adjusting external icon sets. Use Leaflet's native `L.circleMarker` utility with high-contrast distinct hex fills:
   - **Governance/Public Facilities:** Blue (`#3b82f6`)
   - **Healthcare Facilities:** Red (`#ef4444`)
   - **Educational Facilities:** Emerald Green (`#10b981`)
2. **Standard Functional Property Filters:** Filter arrays natively inside React during rendering cycles by evaluating the `"kategori"` tag value embedded inside the GeoJSON feature properties.

---

## **5. Client-Side Error & Exception Handling**

Because the architecture operates without an API backend layer, the client application must safeguard the UI against file corruption or network latency:
- **Missing File Backstop:** If a static `.geojson` asset fails to load inside `/public/data/`, the system must catch the promise error, display a clean dismissible toast notification (`shadcn/ui` toast), and continue to mount the base map grid without crashing the page viewport.
- **Malformed Attribute Fallback:** If a specific feature object properties object lacks valid `"nama"` or `"kondisi"` tags, the pop-up generator must output a structural fallback text (e.g., *"Data Not Recorded"*) instead of throwing a null pointer runtime exception.

---

## **6. Technical Acceptance Criteria for Production Release**

The deployment build on Vercel/Cloudflare Pages will be authorized if and only if it passes the following diagnostic parameters:
1. **Lighthouse Performance Score:** $\ge 85$ on mobile audit profiles, verified by ensuring static spatial vector bundle files are compressed and pre-fetched.
2. **Hydration Error Audit:** Zero runtime console outputs containing `Hydration failed because the initial UI does not match what was rendered on the server` when mounting map elements.
3. **Touch Targeting Pass:** All interactive marker coordinates must respond seamlessly to mobile touch tap layouts without registration shifts or collision errors with layout sidebar tabs.