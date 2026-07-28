// MapBase.tsx
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, CircleMarker, Polygon, useMap } from "react-leaflet";
import InfoModal from "./InfoModal";
import type { Feature } from "geojson";
import type { Layer } from "leaflet";
import L from "leaflet";
import AsetLayer from "./layers/AsetfasumLayer";
import SekolahLayer from "./layers/SekolahLayer";
import PotensiLayer from "./layers/PotensiLayer";

interface MapBaseProps {
  activeModule: string;
}

function MapBoundsEnforcer({ boundsData }: { boundsData: any }) {
  const map = useMap();
  useEffect(() => {
    if (boundsData) {
      const layer = L.geoJSON(boundsData);
      const bounds = layer.getBounds().pad(0.25);
      map.setMaxBounds(bounds);
      map.fitBounds(bounds);
    }
  }, [boundsData, map]);
  return null;
}

const BOUNDARY_COLOR: Record<BasemapKey, string> = {
  satelit: "#f8fafc", // Light color for satellite basemap
  jalan: "#1f2937",   // Dark color for street basemap
  clean: "#374151",   // Medium color for clean basemap
}

const BOUNDARY_HALO_COLOR: Record<BasemapKey, string> = {
  satelit: "#000000", // Dark halo for satellite basemap
  jalan: "#ffffff",   // Light halo for street basemap
  clean: "#ffffff",   // Light halo for clean basemap
}

type BasemapKey = "satelit" | "jalan" | "clean";
const BASEMAPS: Record<BasemapKey, { label: string; icon: string; url: string; attribution: string; 
  maxZoom: number }> = {
    satelit: {
      label: "Satelit",
      icon: "satellite_alt",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 19,
    },
    jalan: {
      label: "Jalan",
      icon: "map",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    },
    clean: {
      label: "Clean",
      icon: "layers_clear",
      url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 20,
    },
};

function BasemapToggle({ value, onChange }: { value: BasemapKey; onChange: (b: BasemapKey) => void }) {
  return (
    <div style={{ position: "absolute", top: 24, left: 54, zIndex: 1000, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", borderRadius: 12, padding: 4, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", display: "flex", gap: 2 }}>
      {(Object.keys(BASEMAPS) as BasemapKey[]).map((key) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "6px 10px", borderRadius: 8, border: "none", cursor: "pointer",
            background: value === key ? "#2563eb" : "transparent",
            color: value === key ? "#ffffff" : "#374151",
            fontSize: 12, fontWeight: 600,
            fontFamily: "var(--font-geist-sans)", 
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{BASEMAPS[key].icon}</span>
          {BASEMAPS[key].label}
        </button>
      ))}
    </div>
  );
}

export default function MapBase({ activeModule }: MapBaseProps){
  // default point (RejoAgung)
  const centerPosition: [number, number] = [-8.3892121,114.3062171];
  // State untuk menyimpan data batas wilayah
  const [boundaryData, setBoundaryData] = useState<any>(null);
  const [basemap, setBasemap] = useState<BasemapKey>("satelit");

  useEffect(() => {
    const fetchBoundData = async () => {
      try {
        const res = await fetch("/data/fasum/Batas Administrasi.geojson");
        if (res.ok) {
          const data = await res.json();
          setBoundaryData(data);
        }
      } catch (error) {
        console.error("Error fetching boundary data:", error);
      }
    };
    fetchBoundData();
  }, []);

  return (
    <div className="h-[100vh] w-full z-0 relative">
      <BasemapToggle value={basemap} onChange={setBasemap} />
      <MapContainer
        center={centerPosition}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full"
        minZoom={10}
      >
        <TileLayer
          key={basemap}
          attribution={BASEMAPS[basemap].attribution}
          url={BASEMAPS[basemap].url}
          maxZoom={BASEMAPS[basemap].maxZoom}
        />

        {/* Batas Administrasi Desa — Base layer global */}
        {boundaryData && <MapBoundsEnforcer boundsData={boundaryData} />}
        {boundaryData && (
          <GeoJSON
            data={boundaryData}
            style={{
              weight: 6,
              color: BOUNDARY_HALO_COLOR[basemap], // Use the halo color based on the selected basemap
              opacity: 0.7,
              fillColor: "transparent",
              fillOpacity: 0,
            }}
            interactive={false}
          />
        )}
        {boundaryData && (
          <GeoJSON
            data={boundaryData}
            style={{
              weight: 3,
              color: BOUNDARY_COLOR[basemap], // Use the color based on the selected basemap
              fillColor: "transparent",
              fillOpacity: 0,
            }}
            interactive={false}
          />
        )}

        {/* ================================== */}
        {/* Layer Injection Berdasarkan Modul  */}
        {/* ================================== */}
        {activeModule === "aset" && <AsetLayer />}
        {activeModule === "sekolah" && <SekolahLayer />}
        {activeModule === "potensi" && <PotensiLayer />}
      </MapContainer>
    </div>
  );
}