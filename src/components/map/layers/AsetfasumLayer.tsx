// src/components/map/AsetfasumLayer.tsx
"use client";
import { useEffect, useState } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import type { Feature } from "geojson";
import type { Layer } from "leaflet";
import L from "leaflet";
import InfoModal from "../InfoModal";
import { OLAHRAGA_ASET } from "@/constants/olahragaAset";
import { categoryData } from "@/constants/assetsSummary";

// function getMarkerStyle(source: string): L.CircleMarkerOptions {
//   if (source.includes("Pemerintahan")) {
//     return {
//       radius: 10,
//       fillColor: FASUM_COLORS.pemerintah,
//       color: "#ffffff",
//       weight: 2,
//       opacity: 1,
//       fillOpacity: 0.9,
//     };
//   } if (source.includes("Ibadah")) {
//     return {
//       radius: 8,
//       fillColor: FASUM_COLORS["tempat ibadah"],
//       color: "#ffffff",
//       weight: 2,
//       opacity: 1,
//       fillOpacity: 0.9,
//     };
//   }
//   if (source.includes("Pendidikan")) {
//     return {
//       radius: 8,
//       fillColor: FASUM_COLORS.pendidikan,
//       color: "#ffffff",
//       weight: 2,
//       opacity: 1,
//       fillOpacity: 0.9,
//     };
//   }
//   if (source.includes("Olahraga")) {
//     return {
//       radius: 8,
//       fillColor: FASUM_COLORS.olahraga,
//       color: "#ffffff",
//       weight: 2,
//       opacity: 1,
//       fillOpacity: 0.9,
//     };
//   }
//   // fallback 
//   return { radius: 7, fillColor: "#6b7280", color: "#ffffff", weight: 2, fillOpacity: 0.8 };
// }
function getCategoryIcon(source: string): string {
  if (source.includes("Pemerintahan")) return categoryData.find((c) => c.nama === "Fasilitas Pemerintahan")!.icon;
  if (source.includes("Ibadah")) return categoryData.find((c) => c.nama === "Fasilitas Keagamaan")!.icon;
  if (source.includes("Pendidikan")) return categoryData.find((c) => c.nama === "Fasilitas Pendidikan")!.icon;
  if (source.includes("Olahraga")) return categoryData.find((c) => c.nama === "Olahraga")!.icon;
  return categoryData.find((c) => c.nama === "Fasilitas Umum / Sosial")!.icon;
}

function getMarkerColor(source: string): string {
  if (source.includes("Pemerintahan")) return FASUM_COLORS.pemerintah;
  if (source.includes("Ibadah")) return FASUM_COLORS["tempat ibadah"];
  if (source.includes("Pendidikan")) return FASUM_COLORS.pendidikan;
  if (source.includes("Olahraga")) return FASUM_COLORS.olahraga;
  return "#6b7280"; // fallback, sama kayak default lama
}

function getMarkerIcon(source: string): L.DivIcon {
  const color = getMarkerColor(source);
  const iconName = getCategoryIcon(source);
  return L.divIcon({
    className: "", // kosongin — biar gak kena default style .leaflet-div-icon (bg putih + border bawaan Leaflet)
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:2px solid #fff;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,0.3);">
             <span class="material-symbols-outlined" style="font-size:16px;color:#fff;line-height:1;">${iconName}</span>
           </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

const FASUM_COLORS: Record<string, string> = {
  pemerintah: "#ea580c",   // Orange — Pemerintahan
  "tempat ibadah": "#2563eb",   // Blue — Tempat Ibadah
  pendidikan: "#10b981",   // Emerald Green — Pendidikan
  olahraga: "#facc15",   // Yellow — Olahraga
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
    "/data/fasum/Pemerintahan.geojson",
    "/data/fasum/Ibadah.geojson",
    "/data/fasum/Pendidikan.geojson",
    // placeholder for olahraga
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
                const manualOlahragaFeatures = OLAHRAGA_ASET.map((a) => ({
                  type: "Feature",
                  properties: {
                    NAMOBJ: a.namaFasilitas,
                    ALAMAT: a.alamat,
                    _source: "Olahraga",
                  },
                  geometry: {
                    type: "Point",
                    coordinates: [a.koordinat.lng, a.koordinat.lat],
                  }
                }));
                setGeoData({ type: "FeatureCollection", features: [...mergedFeatures, ...manualOlahragaFeatures] });
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
          const icon = getMarkerIcon(feature.properties?._source ?? "");
          return L.marker(latlng, { icon });
        }}
        onEachFeature={(feature: Feature, layer: Layer) => {
          layer.on({
            click: () => {
              // Inject coordinates from geometry for display in modal
              const coords = (feature.geometry as any)?.coordinates;
              setSelectedAsset({
                ...feature.properties,
                _lat: coords ? coords[1] : undefined,
                _lng: coords ? coords[0] : undefined,
              });
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
          activeModule="aset"
        />
      )}
    </>
  );
}