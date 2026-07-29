// src/components/map/MapLegendPanel.tsx
// Wrapper posisi+style buat legend floating di peta (pojok kanan-atas) — 1 sumber dipake
// FasumLegend/DusunLegend/LstLegend/KesehatanLegend, biar konsisten & responsive di semua modul
// (ukuran menyempit otomatis di layar sempit, aman dari notch/camera-cutout via safe-area-inset).
"use client";

import type { CSSProperties, ReactNode } from "react";

export default function MapLegendPanel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "max(0.75rem, env(safe-area-inset-top))",
        right: "max(0.75rem, env(safe-area-inset-right))",
        zIndex: 1000,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
        borderRadius: 12,
        padding: "10px 12px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        pointerEvents: "none",
        // width fixed (bukan cuma min/max independen) — biar MapControls di MapBase.tsx bisa
        // reserve ruang yang PASTI cukup (200px + gap), gak overlap di ukuran layar manapun.
        // Pakai % (bukan vw) — % resolve ke lebar container peta yang sebenarnya (bisa lebih
        // sempit dari viewport kalau sidebar lagi kebuka di desktop), vw selalu relatif viewport
        // penuh jadi bisa salah hitung pas sidebar makan sebagian lebar layar.
        width: "clamp(140px, 42%, 200px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
