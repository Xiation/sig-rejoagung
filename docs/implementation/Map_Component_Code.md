# Map Component Refactoring — Full Code

Berisi semua kode yang perlu dibuat/diubah sesuai implementation plan.
Salin kode dari masing-masing section ke file yang sesuai.

---

## 1. `src/components/map/MapViewer.tsx` — [MODIFY]

> Hanya ubah target import dari `MapComponent` ke `MapBase`.

```tsx
// src/components/map/MapViewer.tsx
"use client";

import dynamic from "next/dynamic";

interface MapViewerProps {
  activeModule: string;
}

const DynamicMap = dynamic(() => import("./MapBase"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-50">
      <p className="text-gray-500 font-semibold animate-pulse">Memuat Peta Desa Rejoagung...</p>
    </div>
  ),
});

export default function MapViewer({ activeModule }: MapViewerProps) {
  return <DynamicMap activeModule={activeModule} />;
}
```

---

## 2. `src/components/map/MapBase.tsx` — [NEW]

> Kanvas utama pengganti MapComponent. Mengelola basemap, batas desa, dan injeksi layer.

```tsx
// src/components/map/MapBase.tsx
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import AsetLayer from "./layers/AsetLayer";
import SekolahLayer from "./layers/SekolahLayer";
import PotensiLayer from "./layers/PotensiLayer";

interface MapBaseProps {
  activeModule: string;
}

// Helper: Kunci kamera peta ke batas administrasi desa
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

export default function MapBase({ activeModule }: MapBaseProps) {
  const [boundaryData, setBoundaryData] = useState<any>(null);
  const centerPosition: [number, number] = [-8.3892121, 114.3062171];

  // Fetch batas administrasi satu kali saat mount
  useEffect(() => {
    const fetchBoundary = async () => {
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
    fetchBoundary();
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
```

---

## 3. `src/components/map/layers/AsetLayer.tsx` — [NEW]

> Modul Aset & Fasilitas Umum. Mengelola fetch, styling CircleMarker, dan InfoModal.

```tsx
// src/components/map/layers/AsetLayer.tsx
"use client";

import { useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";
import L from "leaflet";
import InfoModal from "../InfoModal";
import type { Feature } from "geojson";
import type { Layer } from "leaflet";

// Styling CircleMarker berdasarkan kategori aset (sesuai TRD Section 4.A)
function getMarkerStyle(source: string): L.CircleMarkerOptions {
  if (source.includes("pemerintah")) {
    return {
      radius: 10,
      fillColor: "#ea580c", // Orange — Pemerintahan
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    };
  }
  if (source.includes("tempat")) {
    return {
      radius: 8,
      fillColor: "#2563eb", // Blue — Tempat Ibadah
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    };
  }
  if (source.includes("pendidikan")) {
    return {
      radius: 8,
      fillColor: "#10b981", // Emerald Green — Fasilitas Pendidikan
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    };
  }
  // Fallback
  return { radius: 7, fillColor: "#6b7280", color: "#ffffff", weight: 2, fillOpacity: 0.8 };
}

export default function AsetLayer() {
  const [geoData, setGeoData] = useState<any>(null);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const targetFiles = [
    "/data/Fasum4326/pemerintah.geojson",
    "/data/Fasum4326/tempat%20ibadah.geojson",
    "/data/Fasum4326/fasilitas%20pendidikan.geojson",
  ];

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
          if (data && data.features) {
            // Inject _source tag untuk membedakan kategori saat render
            const tagged = data.features.map((f: any) => ({
              ...f,
              properties: {
                ...f.properties,
                _source: targetFiles[index],
              },
            }));
            mergedFeatures = mergedFeatures.concat(tagged);
          }
        });

        setGeoData({ type: "FeatureCollection", features: mergedFeatures });
      } catch (error) {
        console.error("AsetLayer: Error fetching data:", error);
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
```

---

## 4. `src/components/map/layers/SekolahLayer.tsx` — [NEW]

> Modul Aksesibilitas Sekolah. Render polygon buffer jangkauan + titik sekolah.

```tsx
// src/components/map/layers/SekolahLayer.tsx
"use client";

import { useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";
import L from "leaflet";
import InfoModal from "../InfoModal";
import type { Feature } from "geojson";
import type { Layer } from "leaflet";

// Warna marker titik sekolah berdasarkan jenjang (sesuai TRD Section 4.B)
function getSekolahMarkerStyle(namobj: string): L.CircleMarkerOptions {
  const nama = namobj?.toUpperCase() ?? "";
  if (nama.includes("TK") || nama.includes("KHADIJAH")) {
    return { radius: 8, fillColor: "#ec4899", color: "#fff", weight: 2, fillOpacity: 0.9 }; // Pink — TK
  }
  if (nama.includes("SD") || nama.includes("DASAR")) {
    return { radius: 8, fillColor: "#ef4444", color: "#fff", weight: 2, fillOpacity: 0.9 }; // Red — SD
  }
  if (nama.includes("SMP") || nama.includes("MENENGAH PERTAMA")) {
    return { radius: 8, fillColor: "#3b82f6", color: "#fff", weight: 2, fillOpacity: 0.9 }; // Blue — SMP
  }
  if (nama.includes("SMA") || nama.includes("MENENGAH ATAS")) {
    return { radius: 8, fillColor: "#10b981", color: "#fff", weight: 2, fillOpacity: 0.9 }; // Green — SMA
  }
  if (nama.includes("SMK") || nama.includes("KEJURUAN")) {
    return { radius: 8, fillColor: "#eab308", color: "#fff", weight: 2, fillOpacity: 0.9 }; // Yellow — SMK
  }
  // Fallback (Pesantren, dll)
  return { radius: 8, fillColor: "#8b5cf6", color: "#fff", weight: 2, fillOpacity: 0.9 }; // Purple
}

// Style untuk polygon buffer jangkauan
function getBufferStyle(source: string): L.PathOptions {
  if (source.includes("5")) {
    return { fillColor: "#22c55e", color: "#22c55e", weight: 1, fillOpacity: 0.30 }; // Green — 5 menit
  }
  if (source.includes("10")) {
    return { fillColor: "#eab308", color: "#eab308", weight: 1, fillOpacity: 0.25 }; // Yellow — 10 menit
  }
  if (source.includes("15")) {
    return { fillColor: "#ef4444", color: "#ef4444", weight: 1, fillOpacity: 0.20 }; // Red — 15 menit
  }
  return { fillColor: "#6b7280", fillOpacity: 0.2 };
}

export default function SekolahLayer() {
  const [sekolahData, setSekolahData] = useState<any>(null);
  const [bufferData, setBufferData] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sekolahFile = "/data/akses4326/sekolah.geojson";

  // Urutan render: 15 → 10 → 5 menit (bawah ke atas, area terluar dulu)
  const bufferFiles = [
    "/data/akses4326/service%20area%2015%20menit.geojson",
    "/data/akses4326/sevice%20area%2010%20menit.geojson",   // typo "sevice" sesuai nama file asli
    "/data/akses4326/service%20area%205%20menit.geojson",
  ];

  useEffect(() => {
    const fetchSekolahData = async () => {
      try {
        // Fetch titik sekolah
        const sekolahRes = await fetch(sekolahFile);
        if (sekolahRes.ok) {
          setSekolahData(await sekolahRes.json());
        }

        // Fetch semua polygon buffer
        const bufferPromises = bufferFiles.map((file) =>
          fetch(file)
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null)
        );
        const bufferResponses = await Promise.all(bufferPromises);

        // Tag _source ke setiap buffer result
        const taggedBuffers = bufferResponses
          .map((data, index) => {
            if (!data) return null;
            return { ...data, _source: bufferFiles[index] };
          })
          .filter(Boolean);

        setBufferData(taggedBuffers);
      } catch (error) {
        console.error("SekolahLayer: Error fetching data:", error);
      }
    };

    fetchSekolahData();
  }, []);

  return (
    <>
      {/* Render polygon buffer LEBIH DULU (z-index lebih rendah) */}
      {bufferData.map((data, index) => (
        <GeoJSON
          key={`buffer-${index}`}
          data={data}
          style={getBufferStyle(data._source)}
          interactive={false}
        />
      ))}

      {/* Render titik sekolah DI ATAS polygon buffer */}
      {sekolahData && (
        <GeoJSON
          key="sekolah-points"
          data={sekolahData}
          pointToLayer={(feature, latlng) => {
            const style = getSekolahMarkerStyle(feature.properties?.NAMOBJ ?? "");
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
```

---

## 5. `src/components/map/layers/PotensiLayer.tsx` — [NEW]

> Placeholder skeleton — data `potensi-desa.geojson` belum tersedia dari tim Geodesi.

```tsx
// src/components/map/layers/PotensiLayer.tsx
"use client";

// Komponen ini adalah placeholder sementara karena data GeoJSON dari tim
// Geodesi untuk modul Potensi Lahan & SDA belum tersedia.
// Tambahkan implementasi di sini setelah file potensi-desa.geojson diterima.

export default function PotensiLayer() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(8px)",
        borderRadius: "12px",
        padding: "12px 20px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        fontSize: "14px",
        color: "#374151",
        pointerEvents: "none",
      }}
    >
      🌾 Data Potensi Lahan & SDA sedang disiapkan oleh Tim Geodesi.
    </div>
  );
}
```

---

## Checklist Implementasi

Salin dan terapkan file-file di atas dalam urutan berikut:

- [ ] Buat folder baru: `src/components/map/layers/`
- [ ] Buat `src/components/map/MapBase.tsx`
- [ ] Buat `src/components/map/layers/AsetLayer.tsx`
- [ ] Buat `src/components/map/layers/SekolahLayer.tsx`
- [ ] Buat `src/components/map/layers/PotensiLayer.tsx`
- [ ] Edit `src/components/map/MapViewer.tsx` (ganti import ke `MapBase`)
- [ ] Jalankan dev server dan verifikasi semua modul
- [ ] Hapus `src/components/map/MapComponent.tsx` setelah verifikasi berhasil
