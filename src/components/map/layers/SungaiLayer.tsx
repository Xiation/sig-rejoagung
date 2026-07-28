// src/components/map/layers/SungaiLayer.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { GeoJSON } from "react-leaflet";
import type { FeatureCollection, Feature } from "geojson";
import type { Layer, PathOptions } from "leaflet";
import InfoModal from "../InfoModal";

export default function SungaiLayer() {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/data/fasum/Sungai.geojson")
      .then((res) => res.json())
      .then(setGeoData)
      .catch((err) => console.error("SungaiLayer: gagal fetch", err));
  }, []);

  const styleFeature = useCallback(
    (): PathOptions => ({
      color: "#0ea5e9", // sky-500 — biru air, beda dari warna jalan/boundary
      weight: 3,
      opacity: 0.85,
    }),
    []
  );

  const onEachFeature = useCallback((feature: Feature, layer: Layer) => {
    layer.on({
      click: () => setSelected(feature.properties as Record<string, unknown>),
    });
  }, []);

  if (!geoData) return null;

  return (
    <>
      <GeoJSON key={JSON.stringify(geoData)} data={geoData} style={styleFeature} onEachFeature={onEachFeature} />
      {selected && (
        <InfoModal data={selected} isOpen={true} onClose={() => setSelected(null)} activeModule="sungai" />
      )}
    </>
  );
}
