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
      const bounds = layer.getBounds();
      map.setMaxBounds(bounds);
      map.fitBounds(bounds);
    }
  }, [boundsData, map]);
  return null;
}

export default function MapBase({ activeModule }: MapBaseProps){
  // default point (RejoAgung)
  const centerPosition: [number, number] = [-8.3892121,114.3062171];
  // State untuk menyimpan data batas wilayah
  const [boundaryData, setBoundaryData] = useState<any>(null);

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
      <MapContainer
        center={centerPosition}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full"
        minZoom={13}
      >
        {/* Basemap — Esri World Imagery (Satellite) */}
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />

        {/* Batas Administrasi Desa — Base layer global */}
        {boundaryData && <MapBoundsEnforcer boundsData={boundaryData} />}
        {boundaryData && (
          <GeoJSON
            data={boundaryData}
            style={{
              weight: 3,
              color: "#f8fafc",
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