// src/constants/macroKpis.ts
// from: src/components/analytics/analyticsDashboard.tsx (MACRO_KPIS)

export const MACRO_KPIS = [
  {
    id: "dusun",
    label: "Dusun Terpetakan",
    value: "4",
    unit: "dusun",
    icon: "home_work",
    watermark: "map",
    iconBg: "bg-[var(--surface-container)]",
    iconColor: "text-[var(--primary)]",
    valueColor: "text-[var(--on-surface)]",
  },
  {
    id: "ip",
    label: "Indeks Pertanaman",
    value: "IP 200",
    unit: "",
    trend: "Musim Tanam Aktif",
    trendColor: "text-amber-700 bg-amber-50 border-amber-200",
    icon: "agriculture",
    watermark: "grass",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    valueColor: "text-amber-700",
  },
  {
    id: "topografi",
    label: "Dominasi Topografi",
    value: "Datar",
    unit: "– Landai",
    icon: "terrain",
    watermark: "landscape",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    valueColor: "text-[var(--on-surface)]",
  },
];
