// src/components/map/layers/KesehatanKelapaLayer.tsx
// Fase 1 (MVP) — render raster Kesehatan_Kelapa_2025_FIX.tif, klik peta nampilin raw kelas di modal.
// Lihat docs/feature/raster_modules_lst_kesehatan_kelapa.md buat rasional pendekatan teknisnya.
"use client";

import "@/lib/proj4Setup";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";
import parseGeoraster, { type GeoRaster } from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import InfoModal from "../InfoModal";
import { kesehatanKelapaColor, KESEHATAN_KELAPA_COLORS } from "@/lib/rasterColors";
import { getPixelValueAtLatLng } from "@/lib/rasterQuery";
import { ensureRasterPane, RASTER_PANE_NAME, setActiveRasterLayer, removeIfActiveRasterLayer } from "@/lib/rasterPane";
import MapLegendPanel from "../MapLegendPanel";

function KesehatanLegend() {
  return (
    <MapLegendPanel>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
        Kesehatan Kelapa (kelas)
      </p>
      {Object.entries(KESEHATAN_KELAPA_COLORS).map(([k, color]) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
          <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 3, backgroundColor: color, border: "1px solid #9ca3af", flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "#4b5563" }}>Kelas {k}</span>
        </div>
      ))}
      <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 8 }}>Klik peta untuk lihat nilai titik · makna kelas belum dikonfirmasi</p>
    </MapLegendPanel>
  );
}

export default function KesehatanKelapaLayer() {
  const map = useMap();
  const [georaster, setGeoraster] = useState<GeoRaster | null>(null);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);

  // Fetch + render raster
  useEffect(() => {
    ensureRasterPane(map);
    let layer: GeoRasterLayer | undefined;
    let cancelled = false;

    fetch("/data/tif/Kesehatan_Kelapa_2025_FIX.tif")
      .then((res) => res.arrayBuffer())
      .then((buffer) => parseGeoraster(buffer))
      .then((geo) => {
        if (cancelled) return;
        setGeoraster(geo);
        layer = new GeoRasterLayer({
          georaster: geo,
          pixelValuesToColorFn: (values) => kesehatanKelapaColor(values[0]),
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
      .catch((err) => console.error("KesehatanKelapaLayer: gagal load raster", err));

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
      if (value === null) return; // di luar extent raster — gak buka modal
      setSelected({ value, lat: e.latlng.lat, lng: e.latlng.lng });
    };
    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [georaster, map]);

  return (
    <>
      <KesehatanLegend />
      {selected && (
        <InfoModal data={selected} isOpen={true} onClose={() => setSelected(null)} activeModule="kesehatan-kelapa" />
      )}
    </>
  );
}
