// src/lib/rasterQuery.ts
// Query raw pixel value dari georaster di titik lat/lng tertentu — dipakai pas user klik raster
// di peta (LstDeltaLayer.tsx / KesehatanKelapaLayer.tsx), buat nampilin value di InfoModal.

import type { GeoRaster } from "georaster";
import proj4 from "./proj4Setup";

/**
 * Convert lat/lng (WGS84) -> pixel value raster (native CRS raster, misal EPSG:32750).
 * Return null kalau titik di luar extent raster, atau pixel-nya no-data (NaN).
 */
export function getPixelValueAtLatLng(georaster: GeoRaster, lat: number, lng: number): number | null {
  const [x, y] = proj4("EPSG:4326", `EPSG:${georaster.projection}`, [lng, lat]);

  const col = Math.floor((x - georaster.xmin) / georaster.pixelWidth);
  const row = Math.floor((georaster.ymax - y) / georaster.pixelHeight);

  if (row < 0 || row >= georaster.height || col < 0 || col >= georaster.width) return null;

  const value = georaster.values[0]?.[row]?.[col];
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  return value;
}
