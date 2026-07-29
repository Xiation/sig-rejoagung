// src/component/map/layers/SekolahLayer.tsx
"use client";
import { useEffect, useState } from "react";
import { GeoJSON, Pane } from "react-leaflet";
import type { Feature } from "geojson";
import type { Layer } from "leaflet";
import L from "leaflet";
import InfoModal from "../InfoModal";
import style from "styled-jsx/style";
import MapLegendPanel from "../MapLegendPanel";

function getSekolahMarkerStyle(namobj: string): L.CircleMarkerOptions {
    const name = namobj.toUpperCase() ?? "";
    if (name.includes("TK") || name.includes("KHADIJAH")) {
        return {
            radius: 8, 
            fillColor: "#ec4899",
            color: "#fff",
            weight: 2,
            fillOpacity: 0.9,
        }; // pink for TK
    }
    if (name.includes("SD") || name.includes("DASAR")) {
        return {
            radius: 8,
            fillColor: "#ef4444",
            color: "#fff",
            weight: 2,
            fillOpacity: 0.9,
        }; // red for SD
    }
    if (name.includes("SMP") || name.includes ("MENENGAH PERTAMA")) {
        return {
            radius: 8, fillColor: "#3b82f6", color: "#fff", weight: 2, fillOpacity: 0.9
        } // blue for SMP
    }
    if (name.includes("SMA") || name.includes("MENENGAH ATAS")) {
        return { radius: 8, fillColor: "#10b981", color: "#fff", weight: 2, fillOpacity: 0.9 }; // Green — SMA
    }
    if (name.includes("SMK") || name.includes("KEJURUAN")) {
        return { radius: 8, fillColor: "#eab308", color: "#fff", weight: 2, fillOpacity: 0.9 }; // Yellow — SMK
    }
    // Fallback (Pesantren, dll)
    return { radius: 8, fillColor: "#8b5cf6", color: "#fff", weight: 2, fillOpacity: 0.9 }; // Purple
}

function getBufferStyle(source: string): L.PathOptions {
      if (source.includes("60")) {                                           
        return { fillColor: "#ef4444", color: "#ef4444", weight: 1,          
  fillOpacity: 0.20 }; // Red                                                
      }
      if (source.includes("30")) {
        return { fillColor: "#eab308", color: "#eab308", weight: 1,          
  fillOpacity: 0.25 }; // Yellow
      }
      if (source.includes("10")) {
        return { fillColor: "#22c55e", color: "#22c55e", weight: 1,          
  fillOpacity: 0.30 }; // Green
      }
      return { fillColor: "#6b7280", fillOpacity: 0.2 };
}

// function getBufferStyle(source: string): L.PathOptions {
//       if (source.includes("15")) {                                           
//         return { fillColor: "#ef4444", color: "#ef4444", weight: 1,          
//   fillOpacity: 0.20 }; // Red                                                
//       }
//       if (source.includes("10")) {
//         return { fillColor: "#eab308", color: "#eab308", weight: 1,          
//   fillOpacity: 0.25 }; // Yellow
//       }
//       if (source.includes("5")) {
//         return { fillColor: "#22c55e", color: "#22c55e", weight: 1,          
//   fillOpacity: 0.30 }; // Green
//       }
//       return { fillColor: "#6b7280", fillOpacity: 0.2 };
//     }

function SekolahLegend() {
    return (
      <MapLegendPanel>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#374151",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "8px",
          }}
        >
          Sekolah
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
            <span style={{ width: "12px", height: "12px", backgroundColor: "#ec4899", display: "inline-block", marginRight: "8px" }}></span>
            TK
          </li>
          <li style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
            <span style={{ width: "12px", height: "12px", backgroundColor: "#ef4444", display: "inline-block", marginRight: "8px" }}></span>
            SD
          </li>
          <li style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
            <span style={{ width: "12px", height: "12px", backgroundColor: "#3b82f6", display: "inline-block", marginRight: "8px" }}></span>
            SMP
          </li>
          <li style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
            <span style={{ width: "12px", height: "12px", backgroundColor: "#10b981", display: "inline-block", marginRight: "8px" }}></span>
            SMA
          </li>
          <li style={{ display: "flex", alignItems: "center" }}>
            <span style={{ width: "12px", height: "12px", backgroundColor: "#eab308", display: "inline-block", marginRight: "8px" }}></span>
            SMK
          </li>
        </ul>
        <p style={{ fontSize: "10px", color: "#9ca3af", marginTop: "8px" }}>
        Klik marker untuk detail sekolah
      </p>
      </MapLegendPanel>
    );
  }

// Zona service area — warna cocok sama getBufferStyle() di atas (10/30/60 menit)
const SERVICE_AREA_ZONES = [
  { label: "≤ 10 Menit", color: "#22c55e" },
  { label: "10–30 Menit", color: "#eab308" },
  { label: "30–60 Menit", color: "#ef4444" },
];

function ServiceAreaLegend() {
  return (
    // MapLegendPanel defaultnya top-right (dipakai SekolahLegend) — di-override ke bottom-right
    // di sini biar 2 legend gak numpuk, sambil tetep dapet width/safe-area responsive bawaan.
    <MapLegendPanel style={{ top: "auto", bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
      <p
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "#374151",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "8px",
        }}
      >
        Service Area
      </p>
      {SERVICE_AREA_ZONES.map((zone) => (
        <div key={zone.label} style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "3px",
              backgroundColor: zone.color,
              opacity: 0.6,
              border: `1px solid ${zone.color}`,
              display: "inline-block",
              marginRight: "8px",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: "12px", color: "#4b5563" }}>{zone.label}</span>
        </div>
      ))}
      <p style={{ fontSize: "10px", color: "#9ca3af", marginTop: "8px" }}>
        Radius jangkauan akses sekolah terdekat
      </p>
    </MapLegendPanel>
  );
}



export default function sekolahLayer(){
    const [sekolahData, setSekolahData] = useState<any>(null);
    const [bufferData, setBufferData] = useState<any[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // const sekolahFile = "/data/akses4326/sekolah.geojson";
    const sekolahFile = "/data/akses/Fasilitas_Pendidikan.geojson";
    const bufferFiles = [
        "/data/akses/Service_Area_10_Menit.geojson",
        "/data/akses/Service_Area_30_Menit.geojson",
        "/data/akses/Service_Area_60_Menit.geojson"
    ];
    useEffect(() => {
        const fetchSekolahData = async () => {
            try {
                const sekolahResponse = await fetch(sekolahFile);
                if (sekolahResponse.ok) {
                    setSekolahData(await sekolahResponse.json());
                }
                const bufferPromises = bufferFiles.map((file) =>
                    fetch(file)
                        .then((res) => (res.ok ? res.json() : null))
                        .catch(() => null)
                );
                const bufferResponses = await Promise.all(bufferPromises)
                const taggedBufferData = bufferResponses
                    .map((data, index) => {
                        if (!data) return null;
                        return {...data, _source: bufferFiles[index] };
                })
                    .filter(Boolean);
                setBufferData(taggedBufferData);
            } catch (error) {
                console.error("Error fetching sekolah data:", error);
            }
        }
        fetchSekolahData();
    }, [])

return (                                                                 
      <>                                                                     
        {/* Buffer polygon - pane default, z-index rendah */}                
        {bufferData.map((data, index) => (                                   
          <GeoJSON                                                           
            key={`buffer-${index}`}                                          
            data={data}                                                      
            style={getBufferStyle(data._source)}                             
            interactive={false}                                              
          />                                                                 
        ))}                                                                  
                                                                             
        {/* Titik sekolah - custom pane dengan z-index lebih tinggi */}      
        <Pane name="school-markers-pane" style={{ zIndex: 650 }}>            
          {sekolahData && (                                                  
            <GeoJSON                                                         
              key="sekolah-points"                                           
              data={sekolahData}                                             
              pointToLayer={(feature, latlng) => {                           
                const style = getSekolahMarkerStyle(feature.properties?.     
  NAMOBJ ?? "");                                                             
                return L.circleMarker(latlng, style);                        
              }}                                                             
              onEachFeature={(feature: Feature, layer: Layer) => {           
                layer.on({                                                   
                  click: () => {                                             
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
          )}                                                                 
        </Pane>

        {/* legend */}
        <SekolahLegend />
        <ServiceAreaLegend />

      {isModalOpen && selectedAsset && (
        <InfoModal
          data={selectedAsset}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          activeModule="sekolah"
        />
      )}
    </>
  );
}