// MapComponent.tsx
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, CircleMarker, Polygon, useMap } from "react-leaflet";
import InfoModal from "./InfoModal";
import type { Feature } from "geojson";
import type { Layer } from "leaflet";
import L from "leaflet";

interface MapComponentProps {
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

export default function MapComponent({ activeModule }: MapComponentProps){
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);

  // default point (RejoAgung)
  const centerPosition: [number, number] = [-8.3892121,114.3062171];

  // State untuk menyimpan data batas wilayah
  const [boundaryData, setBoundaryData] = useState<any>(null);

  useEffect(() => {
    const fetchBoundData = async () => {
      try {
        const res = await fetch("/data/Fasum4326/batas%20administrasi.geojson");
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

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        setGeoData(null);
        let targetFiles: string[] = [];
        if (activeModule === "aset") {
          targetFiles = [
            "/data/Fasum4326/pemerintah.geojson",
            "/data/Fasum4326/tempat%20ibadah.geojson"
          ];
        } else if (activeModule === "potensi") {
          targetFiles = []; // Kosongkan dulu, nanti kita bisa load beberapa file sekaligus
          // targetFiles = [
          //   "public/data/potensi-lahan.geojson",
          // ];
        } else if (activeModule === "sekolah") {
          targetFiles = []; // Kosongkan dulu, nanti kita bisa load beberapa file sekaligus
          // targetFiles = [
          //   "public/data/sekolah.geojson",
          // ];
        }
        if (targetFiles.length === 0) return;

        const fetchPromises = targetFiles.map((file) => 
          fetch(file).then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to fetch ${file}: ${res.statusText}`);
            }
            return res.json();
          }).catch(() => null)
        );
        const responses = await Promise.all(fetchPromises);

        let mergedGeoData: any[] = [];
        responses.forEach((data,index) => {
          if (data && data.features) {
            const tagged = data.features.map((feature: any) => ({
              ...feature,
              properties: {
                ...feature.properties,_source:targetFiles[index]
              }
            }));
            mergedGeoData = mergedGeoData.concat(tagged);
          }
        });
        setGeoData({
          type: "FeatureCollection",
          features: mergedGeoData,
        })
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
      }
    };
    fetchGeoData();
  }, [activeModule]);

  return (
    <div className="h-[100vh] w-full z-0 relative">
      <MapContainer 
        center={centerPosition} 
        zoom={15} 
        scrollWheelZoom={true}
        className="h-full w-full"
        minZoom={13}
      >
        {/* Peta Dasar */}
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"

        />

        {/* Boundary enforcer */}
        {boundaryData && <MapBoundsEnforcer boundsData= {boundaryData} />}
        {boundaryData && (
          <GeoJSON
            data={boundaryData}
            style={{
              weight: 3,
              color: "#ffffff",
              fillColor: "transparent",
              fillOpacity: 0 
            }}
            interactive={false} // Biar nggak bisa di-klik
          />
        )}

        {/* ========================================== */}
        {/* CONDITIONAL RENDERING DUMMY DATA           */}
        {/* ========================================== */}

        {/* DUMMY DATA TEST */}
        {activeModule === "aset" && (
          <CircleMarker
          center={[-8.3892121, 114.3062171]} 
          radius={12}
          fillColor="#f59e0b" // Warna oranye mencolok
          color="#ffffff" 
          weight={3} 
          fillOpacity={1}
          >
          {/* Popup bawaan React-Leaflet kalau markernya diklik */}
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-lg">🥟 Gara Gara Dimsum</h3>
              <p className="text-sm text-gray-600">Titik POC Dummy Data</p>
              <p className="text-xs text-blue-500 mt-1">Koordinat: -8.389, 114.306</p>
            </div>
          </Popup>
        </CircleMarker>
      )}
          
        {/* DUMMY DATA TEST - wilayah pantai bomo */}
        <Polygon
          positions={[
            [-8.370835096750927, 114.34670793998971], // Kiri Atas (Barat Laut)
            [-8.377687583807923, 114.34566512879805], // Kiri Bawah (Barat Daya)
            [-8.37834946105637, 114.34973836339125],  // Kanan Bawah (Tenggara)
            [-8.371594251583588, 114.35133205531609], // Kanan Atas (Timur Laut)
          ]}
          pathOptions={{
            fillColor: "#3b82f6", // Warna area (biru terang)
            fillOpacity: 0.4,     // Transparansi area (0 sampai 1)
            color: "#1d4ed8",     // Warna garis pinggir (border)
            weight: 2             // Ketebalan garis pinggir
          }}>
          {/* Popup ini bakal muncul kalau area poligonnya di-klik */}
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-lg">🌊 Zonasi Pantai Bomo</h3>
              <p className="text-sm text-gray-600">Visualisasi POC Area Poligon</p>
            </div>
          </Popup>
        </Polygon>

        {/* 2. Render GeoJSON cuma kalau datanya udah ke-load */}
        {geoData && (
          <GeoJSON 
            key={activeModule}
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
                }
              });
            }}
          />
        )}
      </MapContainer>
      {isModalOpen && selectedAsset && (
        <InfoModal
          data={selectedAsset}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}