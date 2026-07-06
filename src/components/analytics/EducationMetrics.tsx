// src/components/analytics/EducationMetrics.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer,
  PieChart, Pie, Legend,
} from "recharts";

// ─── DATA (hardcoded) ────────────────────────────────────────────────────────

// Dihitung manual dari sekolah.geojson (8 features)
const tierData = [
  { jenjang: "TK", jumlah: 1, color: "#ec4899" },
  { jenjang: "SD", jumlah: 2, color: "#ef4444" },
  { jenjang: "SMP", jumlah: 1, color: "#3b82f6" },
  { jenjang: "SMK", jumlah: 1, color: "#eab308" },
  { jenjang: "Pesantren", jumlah: 3, color: "#8b5cf6" },
];

// DUMMY — akan diupdate ketika data akreditasi asli tersedia
const akreditasiData = [
  { status: "A (Unggul)", jumlah: 2, color: "#10b981" },
  { status: "B (Baik Sekali)", jumlah: 3, color: "#3b82f6" },
  { status: "C (Baik)", jumlah: 1, color: "#f59e0b" },
  { status: "Belum Terakreditasi", jumlah: 2, color: "#9ca3af" },
];

// Berdasarkan hasil network analysis service area
const travelTimeData = [
  { sekolah: "SMK NU Darussalam", zona: "< 5 Menit" },
  { sekolah: "Ponpes Salaf Darussalam", zona: "< 5 Menit" },
  { sekolah: "SMP AL-Amiriyyah", zona: "< 5 Menit" },
  { sekolah: "Ponpes Darussalam", zona: "5–10 Menit" },
  { sekolah: "SD Negeri 1 Rejoagung", zona: "5–10 Menit" },
  { sekolah: "SD Negeri 2 Rejoagung", zona: "5–10 Menit" },
  { sekolah: "TK Khadijah 203 Rejoagung", zona: "5–10 Menit" },
  { sekolah: "Ponpes Manbaul Ulum", zona: "> 10 Menit" },
];

// DUMMY — estimasi berdasarkan service area coverage
const coverageIndex = 73;

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function EducationMetrics() {
  return (
    <div className="space-y-6">
      {/* Card 1 — Makro: Total Sekolah */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-6 flex items-center gap-6">
          <span className="text-5xl">🏫</span>
          <div>
            <p className="text-5xl font-bold text-gray-900">8</p>
            <p className="text-lg text-gray-600 mt-1">
              Lembaga Pendidikan Terdata di Desa Rejoagung
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Termasuk SD, SMP, SMK, TK, dan Pondok Pesantren · Tahun 2026
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Row — 2 Chart Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 2 — Bar Chart: Distribusi Jenjang */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribusi per Jenjang Pendidikan</CardTitle>
          </CardHeader>
          <CardContent>
            {tierData.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                Data tidak tersedia
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={tierData} margin={{ top: 5, right: 10, bottom: 10, left: 0 }}>
                  <XAxis dataKey="jenjang" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip formatter={(value) => [`${value} lembaga`, "Jumlah"]} />
                  <Bar dataKey="jumlah" radius={[4, 4, 0, 0]}>
                    {tierData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Card 3 — Pie Chart: Distribusi Akreditasi */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              Distribusi Akreditasi
              <span className="text-xs font-normal text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                * data estimasi
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {akreditasiData.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                Data tidak tersedia
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={akreditasiData}
                    dataKey="jumlah"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {akreditasiData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} lembaga`, "Jumlah"]} />
                  <Legend
                    wrapperStyle={{ flexWrap: "wrap", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Card 4 — Travel Time Matrix Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Matriks Waktu Tempuh ke Sekolah</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Lembaga</TableHead>
                <TableHead>Zona Waktu Tempuh</TableHead>
                <TableHead>Indikator</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {travelTimeData.map((row) => {
                const zona = row.zona;
                const color =
                  zona === "< 5 Menit"
                    ? { bg: "#dcfce7", text: "#15803d", dot: "#22c55e" }
                    : zona === "5–10 Menit"
                    ? { bg: "#fef9c3", text: "#854d0e", dot: "#eab308" }
                    : { bg: "#fee2e2", text: "#b91c1c", dot: "#ef4444" };
                return (
                  <TableRow key={row.sekolah}>
                    <TableCell className="font-medium">{row.sekolah}</TableCell>
                    <TableCell>{row.zona}</TableCell>
                    <TableCell>
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full"
                        style={{ backgroundColor: color.bg, color: color.text }}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: color.dot }}
                        />
                        {zona === "< 5 Menit"
                          ? "Akses Baik"
                          : zona === "5–10 Menit"
                          ? "Akses Sedang"
                          : "Perlu Perhatian"}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Card 5 — Accessibility Coverage Index */}
      <Card className="border-l-4 border-l-emerald-500">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Indeks Cakupan Aksesibilitas
            <span className="text-xs font-normal text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              * estimasi
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-end gap-3">
            <p className="text-5xl font-bold text-emerald-600">{coverageIndex}%</p>
            <p className="text-sm text-gray-500 pb-2 leading-snug">
              Estimasi pemukiman dalam<br />
              <strong>zona aman (&lt; 10 menit)</strong> ke sekolah terdekat
            </p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-700"
              style={{
                width: `${coverageIndex}%`,
                background: "linear-gradient(to right, #10b981, #22c55e)",
              }}
            />
          </div>
          <p className="text-xs text-gray-400">
            Dihitung berdasarkan hasil Network Analysis Service Area (5 & 10 Menit) dari Tim Geodesi KKN-PPM UGM 2026.
            Nilai akan diperbarui setelah validasi lapangan selesai.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}