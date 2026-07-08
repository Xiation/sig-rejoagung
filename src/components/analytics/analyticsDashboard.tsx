// src/components/analytics/analyticsDashboard.tsx
"use client";

import { Building2, GraduationCap, Sprout } from "lucide-react";
import AssetMetrics from "./AssetMetrics";
import EducationMetrics from "./EducationMetrics";
import LandPotentialMetrics from "./LandPotentialMetrics";

function SectionHeader({
  icon: Icon,
  title,
  description,
  iconColor = "text-emerald-600",
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  iconColor?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={18} className={iconColor} />
      </div>
      <div>
        <h2 className="font-heading text-slate-900 font-semibold text-lg leading-snug">
          {title}
        </h2>
        <p className="font-body text-slate-500 text-sm mt-0.5">{description}</p>
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-10 pb-16">

        {/* ── Section 1: Aset & Infrastruktur ── */}
        <section>
          <SectionHeader
            icon={Building2}
            title="Aset & Infrastruktur Desa"
            description="Rekapitulasi inventarisasi aset fisik Desa Rejoagung · Tahun 2026"
          />
          <AssetMetrics />
        </section>

        <div className="border-t border-slate-200" />

        {/* ── Section 2: Aksesibilitas Pendidikan ── */}
        <section>
          <SectionHeader
            icon={GraduationCap}
            title="Aksesibilitas Pendidikan"
            description="Distribusi lembaga pendidikan dan analisis jangkauan spasial"
            iconColor="text-blue-600"
          />
          <EducationMetrics />
        </section>

        <div className="border-t border-slate-200" />

        {/* ── Section 3: Potensi Lahan & SDA ── */}
        <section>
          <SectionHeader
            icon={Sprout}
            title="Potensi Lahan & SDA per Dusun"
            description="Profil sumber daya alam dan rekomendasi kebijakan ekonomi 4 dusun"
          />
          <LandPotentialMetrics />
        </section>

        {/* ── Footer ── */}
        <p className="font-body text-xs text-slate-400 text-center pt-2 pb-2 border-t border-slate-100">
          ⓘ Data merupakan hasil inventarisasi dan analisis spasial oleh Tim Geodesi & IT KKN-PPM UGM 2026.
          Data bertanda <strong>* estimasi</strong> bersifat sementara dan akan diperbarui setelah validasi lapangan.
        </p>

      </div>
    </div>
  );
}