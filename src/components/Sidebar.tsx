"use client";

import { Button, Card } from "@/components/components";

// Definisikan tipe data props biar TypeScript ga ngamuk
interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

export default function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  return (
    <aside className="w-72 border-r bg-muted/20 p-6 flex flex-col h-full shrink-0">
      {/* Header Sidebar */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Web GIS Desa</h1>
        <p className="text-sm text-muted-foreground">Desa Rejoagung</p>
      </div>

      {/* Menu Navigasi (Toggle Layer) */}
      <div className="flex flex-col gap-3 flex-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Modul Peta
        </h2>

        {/* Tombol 1: Dashboard */}
        <Button 
          variant={activeModule === "dashboard" ? "default" : "ghost"} 
          className="justify-start gap-2"
          onClick={() => setActiveModule("dashboard")}
        >
          📊 Dashboard Analisis
        </Button>

        {/*
          Tombol-tombol berikutnya untuk modul-modul lain.
          Gunakan pola yang sama seperti tombol dashboard di atas.
        */}
        
        {/* Tombol 2: Aset & Fasum */}
        <Button 
          variant={activeModule === "aset" ? "default" : "ghost"} 
          className="justify-start gap-2"
          onClick={() => setActiveModule("aset")}
        >
          📍 Aset & Fasum Desa
        </Button>

        {/* Tombol 3: Potensi Lahan */}
        <Button 
          variant={activeModule === "potensi" ? "default" : "ghost"} 
          className="justify-start gap-2"
          onClick={() => setActiveModule("potensi")}
        >
          🌴 Potensi Lahan & Sumber Daya Alam
        </Button>

        {/* Tombol 4: Akses Sekolah */}
        <Button 
          variant={activeModule === "sekolah" ? "default" : "ghost"} 
          className="justify-start gap-2"
          onClick={() => setActiveModule("sekolah")}
        >
          🏫 Aksesibilitas Sekolah
        </Button>
      </div>

      {/* Footer Sidebar */}
      <div className="mt-auto pt-6 border-t">
        <p className="text-xs text-center text-muted-foreground">
          KKN-PPM UGM 2026<br/>Klaster Saintek
        </p>
      </div>
    </aside>
  );
}