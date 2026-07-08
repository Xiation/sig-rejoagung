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
      fillColor: FASUM_COLORS.pemerintah,
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    };
  } if (source.includes("tempat")) {
    return {
      radius: 8,
      fillColor: FASUM_COLORS["tempat ibadah"],
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    };
  }
  if (source.includes("pendidikan")) {
    return {
      radius: 8,
      fillColor: FASUM_COLORS.pendidikan,
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    };
  }
  // fallback 
  return { radius: 7, fillColor: "#6b7280", color: "#ffffff", weight: 2, fillOpacity: 0.8 };
}

const FASUM_COLORS: Record<string, string> = {
  pemerintah: "#ea580c",   // Orange — Pemerintahan
  "tempat ibadah": "#2563eb",   // Blue — Tempat Ibadah
  pendidikan: "#10b981",   // Emerald Green — Pendidikan
};

function FasumLegend(){
  return (
    <div style={{
      position: "absolute",
      top: "16px",
        right: "16px",
        zIndex: 1000,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
        borderRadius: "12px",
        padding: "12px 16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        pointerEvents: "none",
        minWidth: "180px",
    }}
    >
      <p
      style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "#374151",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "8px",
        }}>
        Fasilitas Umum
      </p>
      {Object.entries(FASUM_COLORS).map(([key, color]) => (
        <div
          key={key}
          style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}
        >
          <span
            style={{
              display: "inline-block",
              width: "14px",
              height: "14px",
              borderRadius: "3px",
              backgroundColor: color,
              border: "1px solid #9ca3af",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: "12px", color: "#4b5563" }}>{key}</span>
        </div>
      ))}
      <p style={{ fontSize: "10px", color: "#9ca3af", marginTop: "8px" }}>
        Klik poligon untuk detail SDA
      </p>
    </div>
  );
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

      {/* legend */}
      <FasumLegend />
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