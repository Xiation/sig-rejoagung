// src/components/map/layers/LstDeltaLayer.tsx
// Fase 1 (MVP) — render raster DeltaLST_2020_2025_FIX.tif, klik peta nampilin raw value di modal.
// Lihat docs/feature/raster_modules_lst_kesehatan_kelapa.md buat rasional pendekatan teknisnya.
"use client";

import "@/lib/proj4Setup";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";
import parseGeoraster, { type GeoRaster } from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import InfoModal from "../InfoModal";
import { lstDeltaColor, LST_MIN, LST_MAX } from "@/lib/rasterColors";
import { getPixelValueAtLatLng } from "@/lib/rasterQuery";
import { ensureRasterPane, RASTER_PANE_NAME, setActiveRasterLayer, removeIfActiveRasterLayer } from "@/lib/rasterPane";

function LstLegend() {
  return (
    <div
      style={{
        position: "absolute", top: 16, right: 16, zIndex: 1000,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)",
        borderRadius: 12, padding: "12px 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        minWidth: 180,
      }}
    >
      <p style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
        Delta LST 2020–2025
      </p>
      <div style={{ height: 10, borderRadius: 4, background: "linear-gradient(to right, rgb(33,102,172), rgb(247,247,247), rgb(178,24,43))", marginBottom: 4 }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#6b7280" }}>
        <span>{LST_MIN}°C</span>
        <span>0°C</span>
        <span>+{LST_MAX}°C</span>
      </div>
      <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 8 }}>Klik peta untuk lihat nilai titik</p>
    </div>
  );
}

export default function LstDeltaLayer() {
  const map = useMap();
  const [georaster, setGeoraster] = useState<GeoRaster | null>(null);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);

  // Fetch + render raster
  useEffect(() => {
    ensureRasterPane(map);
    let layer: GeoRasterLayer | undefined;
    let cancelled = false;

    fetch("/data/tif/DeltaLST_2020_2025_FIX.tif")
      .then((res) => res.arrayBuffer())
      .then((buffer) => parseGeoraster(buffer))
      .then((geo) => {
        if (cancelled) return;
        setGeoraster(geo);
        layer = new GeoRasterLayer({
          georaster: geo,
          pixelValuesToColorFn: (values) => lstDeltaColor(values[0], LST_MIN, LST_MAX),
          resolution: 256,
          opacity: 0.75,
          pane: RASTER_PANE_NAME,
          // georaster-layer-for-leaflet nyimpen cache tile di properti PROTOTYPE (`cache: {}`,
          // bukan di-reset per-instance) — ke-share lintas SEMUA GeoRasterLayer, termasuk lintas
          // LST & Kesehatan Kelapa. Cache key cuma coords+resolution, gak bedain raster asalnya,
          // jadi tile lama ke-reuse mentah-mentah pas raster lain diminta di koordinat sama.
          // Matiin caching-nya biar tiap raster selalu digambar ulang sesuai datanya sendiri.
          caching: false,
        });
        setActiveRasterLayer(map, layer);
      })
      .catch((err) => console.error("LstDeltaLayer: gagal load raster", err));

    return () => {
      cancelled = true;
      if (layer) removeIfActiveRasterLayer(map, layer);
    };
  }, [map]);

  // Klik peta -> query pixel value -> buka modal
  useEffect(() => {
    if (!georaster) return;
    const handleClick = (e: LeafletMouseEvent) => {
      const value = getPixelValueAtLatLng(georaster, e.latlng.lat, e.latlng.lng);
      if (value === null) return; // di luar extent raster / no-data — gak buka modal
      setSelected({ value, lat: e.latlng.lat, lng: e.latlng.lng });
    };
    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [georaster, map]);

  return (
    <>
      <LstLegend />
      {selected && (
        <InfoModal data={selected} isOpen={true} onClose={() => setSelected(null)} activeModule="lst" />
      )}
    </>
  );
}
