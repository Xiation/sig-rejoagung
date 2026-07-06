// src/components/map/AsetfasumLayer.tsx
"use client";
import { useEffect, useState } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import type { Feature } from "geojson";
import type { Layer } from "leaflet";
import L from "leaflet";
import InfoModal from "../InfoModal";

function getMarkerStyle(source: string): L.CircleMarkerOptions {
  if (source.includes("pemerintah")) {
    return {
      radius: 10,
      fillColor: "#ea580c",   // Orange — Pemerintahan
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    };
  } if (source.includes("tempat")) {
    return {
      radius: 8,
      fillColor: "#2563eb",   // Blue — Tempat Ibadah
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    };
  }
  if (source.includes("pendidikan")) {
    return {
      radius: 8,
      fillColor: "#10b981",   // Emerald Green — Pendidikan
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    };
  }
  // fallback 
  return { radius: 7, fillColor: "#6b7280", color: "#ffffff", weight: 2, fillOpacity: 0.8 };
}

export default function AsetLayer() {
    const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [geoData, setGeoData] = useState<any>(null);

    const targetFiles = [
    "/data/Fasum4326/pemerintah.geojson",
    "/data/Fasum4326/tempat%20ibadah.geojson",
    "/data/Fasum4326/fasilitas%20pendidikan.geojson",
    ]

    useEffect(() => {
        const fetchAsetData = async () => {
            try {
                const fetchPromises = targetFiles.map((file) => 
                    fetch(file)
                     .then((res) => {
                        if (!res.ok) throw new Error(`Failed to fetch ${file}`);
                        return res.json();
                     })
                     .catch(() => null)
                );
                const responses = await Promise.all(fetchPromises);
                let mergedFeatures: any[] = [];
                responses.forEach((data, index) => {
                    const tagged = data.features.map((feature: any) => ({
                        ...feature,
                        properties: {
                            ...feature.properties,
                            _source: targetFiles[index],
                        },
                    }));
                    mergedFeatures = mergedFeatures.concat(tagged);
                });
                setGeoData({ type: "FeatureCollection", features: mergedFeatures });
            } catch (error) {
                console.error("Error fetching asset data:", error);
            }
        };
        fetchAsetData();
    }, []);
if (!geoData) return null;

return (
    <>
      <GeoJSON
        key="aset-layer"
        data={geoData}
        pointToLayer={(feature, latlng) => {
          const style = getMarkerStyle(feature.properties?._source ?? "");
          return L.circleMarker(latlng, style);
        }}
        onEachFeature={(feature: Feature, layer: Layer) => {
          layer.on({
            click: () => {
              setSelectedAsset(feature.properties);
              setIsModalOpen(true);
            },
          });
        }}
      />

      {isModalOpen && selectedAsset && (
        <InfoModal
          data={selectedAsset}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}