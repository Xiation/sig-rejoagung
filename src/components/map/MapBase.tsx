// MapBase.tsx
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, CircleMarker, Polygon, useMap, ZoomControl } from "react-leaflet";
import InfoModal from "./InfoModal";
import type { Feature } from "geojson";
import type { Layer } from "leaflet";
import L from "leaflet";
import AsetLayer from "./layers/AsetfasumLayer";
import SekolahLayer from "./layers/SekolahLayer";
import PotensiLayer from "./layers/PotensiLayer";
import SungaiLayer from "./layers/SungaiLayer";
import LstDeltaLayer from "./layers/LstDeltaLayer";
import KesehatanKelapaLayer from "./layers/KesehatanKelapaLayer";

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
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    },
};

function OverlayButton({
  active, onClick, icon, label,
}: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 4,
        padding: "6px 10px", borderRadius: 8, border: "none", cursor: "pointer",
        background: active ? "#2563eb" : "transparent",
        color: active ? "#ffffff" : "#374151",
        fontSize: 12, fontWeight: 600,
        fontFamily: "var(--font-geist-sans)",
        whiteSpace: "nowrap",
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

// Semua toggle map (basemap + overlay) digabung 1 container flex-wrap — sejajar di layar lebar,
// otomatis turun baris di layar sempit biar gak overflow horizontal (responsivity).
function MapControls({
  basemap, onBasemapChange, showJalan, onToggleJalan, showSungai, onToggleSungai,
}: {
  basemap: BasemapKey; onBasemapChange: (b: BasemapKey) => void;
  showJalan: boolean; onToggleJalan: () => void;
  showSungai: boolean; onToggleSungai: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        // safe-area-aware — biar gak nabrak notch/camera-cutout pas landscape di HP
        top: "max(0.75rem, env(safe-area-inset-top))",
        left: "max(0.75rem, env(safe-area-inset-left))",
        zIndex: 1000,
        display: "flex", flexWrap: "wrap", gap: 8,
        // Reserve ruang buat MapLegendPanel (width clamp(140px,42%,200px) + right-offset ~12px +
        // gap ~28px = ~240px worst-case) — angka ini HARUS selaras sama MapLegendPanel.tsx kalau
        // salah satu diubah, biar gak overlap lagi di layar manapun. Pakai % (bukan vw) — resolve
        // ke lebar container peta yang sebenarnya, bukan viewport penuh (beda kalau sidebar kebuka).
        maxWidth: "calc(100% - 240px)",
      }}
    >
      {/* Basemap — pilihan eksklusif, dikelompokkan 1 pill */}
      <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", borderRadius: 12, padding: 4, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", display: "flex", gap: 2 }}>
        {(Object.keys(BASEMAPS) as BasemapKey[]).map((key) => (
          <OverlayButton
            key={key}
            active={basemap === key}
            onClick={() => onBasemapChange(key)}
            icon={BASEMAPS[key].icon}
            label={BASEMAPS[key].label}
          />
        ))}
      </div>

      {/* Overlay — toggle independen, masing-masing pill sendiri */}
      <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", borderRadius: 12, padding: 4, boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
        <OverlayButton active={showJalan} onClick={onToggleJalan} icon="route" label="Jaringan Jalan" />
      </div>
      <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", borderRadius: 12, padding: 4, boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
        <OverlayButton active={showSungai} onClick={onToggleSungai} icon="water" label="Sungai & Irigasi" />
      </div>
    </div>
  );
}

export default function MapBase({ activeModule }: MapBaseProps){
  // default point (RejoAgung)
  const centerPosition: [number, number] = [-8.3892121,114.3062171];
  // State untuk menyimpan data batas wilayah
  const [boundaryData, setBoundaryData] = useState<any>(null);
  const [basemap, setBasemap] = useState<BasemapKey>("satelit");
  // Overlay Jaringan Jalan — toggle independen dari activeModule, mati by default
  const [jalanData, setJalanData] = useState<any>(null);
  const [showJalan, setShowJalan] = useState(false);
  // Overlay Sungai & Irigasi — toggle juga, tapi tetap interactive (klik → modal)
  const [showSungai, setShowSungai] = useState(false);

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

    const fetchJalanData = async () => {
      try {
        const res = await fetch("/data/fasum/Jaringan Jalan.geojson");
        if (res.ok) {
          const data = await res.json();
          setJalanData(data);
        }
      } catch (error) {
        console.error("Error fetching jaringan jalan data:", error);
      }
    };
    fetchJalanData();
  }, []);

  return (
    <div className="h-full w-full z-0 relative">
      <MapControls
        basemap={basemap}
        onBasemapChange={setBasemap}
        showJalan={showJalan}
        onToggleJalan={() => setShowJalan((prev) => !prev)}
        showSungai={showSungai}
        onToggleSungai={() => setShowSungai((prev) => !prev)}
      />
      <MapContainer
        center={centerPosition}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full"
        minZoom={10}
        zoomControl={false}
      >
        {/* Zoom control (+/-) dipindah ke bottom-left — top-left sekarang dipake MapControls */}
        <ZoomControl position="bottomleft" />
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

        {/* Overlay Jaringan Jalan — toggle, independen dari activeModule */}
        {showJalan && jalanData && (
          <GeoJSON
            data={jalanData}
            style={{ color: "#f97316", weight: 2, opacity: 0.9 }}
            interactive={false}
          />
        )}

        {/* Overlay Sungai & Irigasi — toggle, independen dari activeModule, tetap interactive (klik → modal) */}
        {showSungai && <SungaiLayer />}

        {/* ================================== */}
        {/* Layer Injection Berdasarkan Modul  */}
        {/* ================================== */}
        {activeModule === "aset" && <AsetLayer />}
        {activeModule === "sekolah" && <SekolahLayer />}
        {activeModule === "potensi" && <PotensiLayer />}
        {activeModule === "lst" && <LstDeltaLayer />}
        {activeModule === "kesehatan-kelapa" && <KesehatanKelapaLayer />}
      </MapContainer>
    </div>
  );
}