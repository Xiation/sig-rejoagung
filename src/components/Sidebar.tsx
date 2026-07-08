"use client";

import { LayoutDashboard, MapPin, Leaf, School } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard Analisis",
    icon: LayoutDashboard,
    group: "overview",
  },
  {
    id: "aset",
    label: "Aset & Fasum Desa",
    icon: MapPin,
    group: "map",
  },
  {
    id: "potensi",
    label: "Potensi Lahan & SDA",
    icon: Leaf,
    group: "map",
  },
  {
    id: "sekolah",
    label: "Aksesibilitas Sekolah",
    icon: School,
    group: "map",
  },
];

export default function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
      {/* ── Brand Header ── */}
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5 mb-0.5">
          {/* Brand mark */}
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold">R</span>
          </div>
          <div>
            <h1 className="font-heading text-slate-900 font-bold text-base leading-tight">
              Web GIS Desa
            </h1>
            <p className="font-body text-emerald-600 text-xs font-semibold">
              Rejoagung 2026
            </p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex flex-col flex-1 px-3 py-4 gap-1 overflow-y-auto">
        {/* Overview Section */}
        <p className="label-caps text-slate-400 px-3 mb-1">Overview</p>
        {NAV_ITEMS.filter((i) => i.group === "overview").map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={cn(
                "flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-emerald-50 text-emerald-700 border-l-2 border-emerald-600 rounded-r-lg pl-[10px]"
                  : "text-slate-600 hover:bg-slate-50 rounded-lg hover:text-slate-900"
              )}
            >
              <Icon
                size={16}
                className={isActive ? "text-emerald-600" : "text-slate-400"}
              />
              {item.label}
            </button>
          );
        })}

        {/* Map Modules Section */}
        <p className="label-caps text-slate-400 px-3 mt-4 mb-1">Modul Peta</p>
        {NAV_ITEMS.filter((i) => i.group === "map").map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={cn(
                "flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-emerald-50 text-emerald-700 border-l-2 border-emerald-600 rounded-r-lg pl-[10px]"
                  : "text-slate-600 hover:bg-slate-50 rounded-lg hover:text-slate-900"
              )}
            >
              <Icon
                size={16}
                className={isActive ? "text-emerald-600" : "text-slate-400"}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="px-6 py-4 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="font-body text-xs text-slate-500 font-medium">Data Aktif 2026</p>
        </div>
        <p className="font-body text-[10px] text-slate-400 leading-relaxed">
          Tim Geodesi & IT<br />KKN-PPM UGM 2026 · Klaster Saintek
        </p>
      </div>
    </aside>
  );
}