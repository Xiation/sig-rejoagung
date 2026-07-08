// src/components/analytics/AssetMetrics.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
    Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
    assetsSummary, categoryData, ownershipData
} from "@/constants/assetsSummary";
import CustomTooltip from "./customTooltip";

export default function AssetMetrics(){
    return (
    <div className="space-y-6">
      {/* Row 1 — 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {assetsSummary.map((stat) => (
          <Card
            key={stat.id}
            className="bg-white border border-slate-100 shadow-sm shadow-emerald-900/5 rounded-xl overflow-hidden"
          >
            {/* Colored top-border accent */}
            <div className="h-1 w-full" style={{ backgroundColor: stat.accentColor }} />
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{stat.icon}</span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: stat.accentColor + "20",
                    color: stat.accentColor,
                  }}
                >
                  2026
                </span>
              </div>
              <div>
                <p className="display-metric text-slate-900 leading-none">
                  {stat.value}
                  <span className="text-base font-medium text-slate-400 ml-1">
                    {stat.unit}
                  </span>
                </p>
                <p className="font-body text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Row 2 — 2 Chart Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel Kiri — Donut Chart: Status Kepemilikan */}
        <Card className="bg-white border border-slate-100 shadow-sm shadow-emerald-900/5 rounded-xl">
          <CardHeader>
            <CardTitle className="label-caps text-slate-500">Distribusi Status Kepemilikan</CardTitle>
          </CardHeader>
          <CardContent>
            {ownershipData.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                Data tidak tersedia
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={ownershipData}
                    dataKey="jumlah"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {ownershipData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ flexWrap: "wrap", fontSize: "12px" }}
                    formatter={(value) => (
                      <span className="font-body text-xs text-slate-500">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Panel Kanan — Bar Chart: Distribusi Kategori */}
        <Card className="bg-white border border-slate-100 shadow-sm shadow-emerald-900/5 rounded-xl">
          <CardHeader>
            <CardTitle className="label-caps text-slate-500">Rekapitulasi per Kategori Aset</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                Data tidak tersedia
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={categoryData}
                  margin={{ top: 5, right: 10, bottom: 50, left: 0 }}
                >
                  <XAxis
                    dataKey="nama"
                    tick={{ fontSize: 11 }}
                    angle={-20}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="jumlah" radius={[4, 4, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}