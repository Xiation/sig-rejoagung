// page.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MapViewer from "@/components/map/MapViewer";
import AnalyticsDashboard from "@/components/analytics/analyticsDashboard";
export default function DashboardGIS(){
  const [activeModule, setActiveModule] = useState("aset");
  const getHeaderTitle = () => {
    switch(activeModule){
      case "dashboard":
        return "Dashboard Analisis Desa Rejoagung";
      case "aset":
        return "Pemetaan Persebaran Aset & Fasilitas Umum Desa";
      case "potensi":
        return "Visualisasi Potensi Lahan Perkebunan & Sebaran Sumber Daya Alam";
      case "sekolah":
        return "Analisis Spasial Jangkauan & Aksesibilitas Sekolah";
      default:
        return "Web GIS Desa Rejoagung";
    }
  };

  return (
    <div className="flex h-screen w-screen">
      {/* render sidebar: send state and router function via props */}
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        
        {/* Header */}
        <header className="h-16 border-b bg-background flex items-center px-6 z-10 shadow-sm shrink-0">
          <h1 className="text-lg font-semibold">{getHeaderTitle()}</h1>
        </header>
        
        {/* Conditional view area */}
        <div className="flex-1 p-4 bg-muted/30 h-full overflow-hidden">
          {activeModule === "dashboard" ? (
            <AnalyticsDashboard/>
          ) : (
            <div className="w-full h-full rounded-xl overflow-hidden border shadow-inner bg-muted/50">
              {/* Kirim state modul aktif ke MapViewer */}
              <MapViewer activeModule={activeModule} />
            </div>
          )}
        </div>

        </main>
    </div>
  );
}