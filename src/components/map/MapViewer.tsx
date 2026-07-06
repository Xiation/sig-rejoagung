// map/MapViewer.tsx
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