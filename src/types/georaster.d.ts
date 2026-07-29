// src/types/georaster.d.ts
// `georaster` & `georaster-layer-for-leaflet` gak nyediain type declaration sendiri (dicek langsung,
// gak ada .d.ts di paket npm-nya) — shim manual ini cuma nyakup bagian yang dipakai di project ini.

declare module "georaster" {
  export interface GeoRaster {
    xmin: number;
    xmax: number;
    ymin: number;
    ymax: number;
    pixelWidth: number;
    pixelHeight: number;
    width: number;
    height: number;
    /** [band][row][col] */
    values: number[][][];
    /** EPSG code, misal 32750 buat UTM zone 50S */
    projection: number;
    noDataValue: number | null;
  }

  export default function parseGeoraster(input: ArrayBuffer | string): Promise<GeoRaster>;
}

declare module "georaster-layer-for-leaflet" {
  import type { GridLayer, GridLayerOptions } from "leaflet";
  import type { GeoRaster } from "georaster";

  export interface GeoRasterLayerOptions extends GridLayerOptions {
    georaster: GeoRaster;
    pixelValuesToColorFn?: (values: number[]) => string | null;
    resolution?: number;
    opacity?: number;
    /**
     * Default `true` di library — tapi cache-nya kesimpen di prototype (`cache: {}`), ke-share
     * lintas SEMUA instance GeoRasterLayer, keyed cuma by coords+resolution (gak bedain raster
     * asalnya). Set `false` kalau ada >1 raster berbeda yang bisa render di koordinat sama.
     */
    caching?: boolean;
  }

  export default class GeoRasterLayer extends GridLayer {
    constructor(options: GeoRasterLayerOptions);
  }
}
