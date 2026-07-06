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