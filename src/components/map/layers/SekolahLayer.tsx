// src/component/map/layers/SekolahLayer.tsx
"use client";
import { useEffect, useState } from "react";
import { GeoJSON, Pane } from "react-leaflet";
import type { Feature } from "geojson";
import type { Layer } from "leaflet";
import L from "leaflet";
import InfoModal from "../InfoModal";

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
            fillColor: "ef4444",
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
      if (source.includes("15")) {                                           
        return { fillColor: "#ef4444", color: "#ef4444", weight: 1,          
  fillOpacity: 0.20 }; // Red                                                
      }
      if (source.includes("10")) {
        return { fillColor: "#eab308", color: "#eab308", weight: 1,          
  fillOpacity: 0.25 }; // Yellow
      }
      if (source.includes("5")) {
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
      <div
        style={{
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
        Klik poligon untuk detail SDA
      </p>
      </div>
    );
  }


export default function sekolahLayer(){
    const [sekolahData, setSekolahData] = useState<any>(null);
    const [bufferData, setBufferData] = useState<any[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // const sekolahFile = "/data/akses4326/sekolah.geojson";
    const sekolahFile = "/data/akses4326/pendidikan.geojson";
    const bufferFiles = [
        "/data/akses4326/service_area_5_menit.geojson",
        "/data/akses4326/service_area_10_menit.geojson",
        "/data/akses4326/service_area_15_menit.geojson"
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
                    setSelectedAsset(feature.properties);                    
                    setIsModalOpen(true);                                    
                  },                                                         
                });                                                          
              }}                                                             
            />                                                               
          )}                                                                 
        </Pane>

        {/* legend */}
        <SekolahLegend />

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