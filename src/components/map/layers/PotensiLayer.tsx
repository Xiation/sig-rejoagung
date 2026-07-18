// src/components/map/layers/PotensiLayer.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { GeoJSON, Pane } from "react-leaflet";
import type { FeatureCollection, Feature } from "geojson";
import type { Layer, PathOptions, LeafletMouseEvent } from "leaflet";
import InfoModal from "../InfoModal";

// ─── CHOROPLETH COLOR MAP ────────────────────────────────────────────────────
// Warna unik per Dusun — pastel fill, konsisten untuk legend juga

const DUSUN_COLORS: Record<string, string> = {
  Sumberagung: "#86efac",         // Green-300
  "Sumberagung Kidul": "#93c5fd", // Blue-300
  Sumbergroto: "#fde68a",         // Amber-200
  "Sumbergroto Kidul": "#c4b5fd", // Violet-300
};

const DEFAULT_STYLE: PathOptions = {
  fillColor: "#d1d5db",
  color: "#6b7280",
  weight: 2,
  fillOpacity: 0.4,
};

const HOVER_STYLE: PathOptions = {
  weight: 3,
  fillOpacity: 0.65,
};

function getDusunStyle(dusunName: string): PathOptions {
  const fill = DUSUN_COLORS[dusunName] ?? "#d1d5db";
  return {
    fillColor: fill,
    color: "#374151",
    weight: 2,
    fillOpacity: 0.45,
  };
}

// ─── LEGEND COMPONENT ────────────────────────────────────────────────────────

function DusunLegend() {
  return (
    <div
      style={{
        position: "absolute",
        // bottom: "102px",
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
        🗺️ Potensi Lahan per Dusun
      </p>
      {Object.entries(DUSUN_COLORS).map(([name, color]) => (
        <div
          key={name}
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
          <span style={{ fontSize: "12px", color: "#4b5563" }}>{name}</span>
        </div>
      ))}
      <p style={{ fontSize: "10px", color: "#9ca3af", marginTop: "8px" }}>
        Klik poligon untuk detail SDA
      </p>
    </div>
  );
}


// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function PotensiLayer() {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [selectedDusun, setSelectedDusun] = useState<Record<string, unknown> | null>(null);

  // Fetch GeoJSON
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/data/potensi/Potensi_Dusun.geojson");
        if (res.ok) {
          const json: FeatureCollection = await res.json();
          setGeoData(json);
        } else {
          console.error("PotensiLayer: Failed to fetch dusun.geojson", res.status);
        }
      } catch (err) {
        console.error("PotensiLayer: Network error fetching dusun.geojson", err);
      }
    };
    fetchData();
  }, []);

  // Style function — dipanggil per feature
  const styleFeature = useCallback((feature?: Feature): PathOptions => {
    const name = feature?.properties?.dusun ?? "";
    return getDusunStyle(name);
  }, []);

  // onEachFeature — attach event listener
  const onEachFeature = useCallback(
    (feature: Feature, layer: Layer) => {
      const dusunName = feature?.properties?.dusun ?? "Dusun";

      // Hover effect
      layer.on({
        mouseover: (e: LeafletMouseEvent) => {
          const target = e.target;
          target.setStyle({ ...HOVER_STYLE });
          target.bringToFront();
        },
        mouseout: (e: LeafletMouseEvent) => {
          const target = e.target;
          target.setStyle(getDusunStyle(dusunName));
        },
        // Click → buka modal
        click: () => {
          setSelectedDusun(feature.properties as Record<string, unknown>);
        },
      });

      // Tooltip ringan saat hover
      layer.bindTooltip(
        `<strong>${dusunName}</strong><br/><span style="font-size:11px; color:#6b7280">Klik untuk detail SDA</span>`,
        {
          sticky: true,
          direction: "top",
          className: "leaflet-tooltip-custom",
        }
      );
    },
    []
  );

  if (!geoData) return null;

  return (
    <>
      {/* Choropleth Polygon Layer */}
      <Pane name="potensi-polygons" style={{ zIndex: 400 }}>
        <GeoJSON
          key={JSON.stringify(geoData)}
          data={geoData}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      </Pane>

      {/* Legend */}
      <DusunLegend />

      {/* Detail Modal — shared InfoModal wrapper */}
      {selectedDusun && (
        <InfoModal
          data={selectedDusun}
          isOpen={true}
          onClose={() => setSelectedDusun(null)}
          activeModule="potensi"
        />
      )}
    </>
  );
}