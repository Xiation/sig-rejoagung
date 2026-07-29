// src/lib/proj4Setup.ts
// Registrasi EPSG:32750 (WGS 84 / UTM zone 50S) — CRS asli raster LST Delta & Kesehatan Kelapa.
// Import file ini (side-effect) sebelum parse/render raster manapun yang pakai CRS ini, biar proj4
// bisa reproject ke WGS84 pas render di Leaflet & pas query pixel value dari klik peta.

import proj4 from "proj4";

proj4.defs("EPSG:32750", "+proj=utm +zone=50 +south +datum=WGS84 +units=m +no_defs");

export default proj4;
