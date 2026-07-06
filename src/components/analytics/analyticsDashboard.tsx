// src/components/analytics/analyticsDashboard.tsx
"use client";

import AssetMetrics from "./AssetMetrics";
import EducationMetrics from "./EducationMetrics";
import LandPotentialMetrics from "./LandPotentialMetrics";

export default function AnalyticsDashboard() {
  return (
    <div className="w-full h-full overflow-y-auto space-y-10 p-4 md:p-6 pb-12 bg-gray-50">

      {/* Section 1: Aset & Infrastruktur */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">🏛️ Aset & Infrastruktur Desa</h2>
          <p className="text-sm text-gray-500 mt-1">
            Rekapitulasi inventarisasi aset fisik Desa Rejoagung · Tahun 2026
          </p>
        </div>
        <AssetMetrics />
      </section>

      <hr className="border-gray-200" />

      {/* Section 2: Aksesibilitas Pendidikan */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">🏫 Aksesibilitas Pendidikan</h2>
          <p className="text-sm text-gray-500 mt-1">
            Distribusi lembaga pendidikan dan analisis jangkauan spasial
          </p>
        </div>
        <EducationMetrics />
      </section>

      <hr className="border-gray-200" />

      {/* Section 3: Potensi Lahan & SDA */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">🌾 Potensi Lahan & SDA per Dusun</h2>
          <p className="text-sm text-gray-500 mt-1">
            Profil sumber daya alam dan rekomendasi kebijakan ekonomi 4 dusun
          </p>
        </div>
        <LandPotentialMetrics />
      </section>

      {/* Footer */}
      <p className="text-xs text-gray-400 text-center pt-4 pb-2">
        ⓘ Data merupakan hasil inventarisasi dan analisis spasial oleh Tim Geodesi & IT KKN-PPM UGM 2026.
        Data bertanda <strong>* estimasi</strong> bersifat sementara dan akan diperbarui setelah validasi lapangan.
      </p>

    </div>
  );
}