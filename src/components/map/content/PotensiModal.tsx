// src/components/map/content/LandModalContent.tsx

interface LandModalContentProps {
  data: {
    dusun?: string;
    "Tingkat Potensi Ekonomi"?: string;
    "Jenis Tanah"?: string;
    "pH Tanah"?: number | string;
    "Topografi"?: string;
    "Elevasi Rata-rata (mdpl)"?: number | string;
    "Kualitas Air"?: string;
    "Komoditas Pertanian"?: string;
    "Jenis Tanaman"?: string;
    "Komoditas Perkebunan"?: string;
    "Horikultura"?: string;
    "Tanaman Obat (TOGA)"?: string;
    "Jenis Hewan Ternak"?: string;
    "Jenis Ikan Ternak"?: string;
    "Sistem Budidaya Ikan"?: string;
    "Energi Terbarukan"?: string;
    "Potensi Agrowisata"?: string;
    "Kerajinan Lokal"?: string;
    "Ancaman SDA"?: string;
    "Rekomendasi"?: string;
    [key: string]: unknown;
  };
}

const NA = "Data tidak spesifik";

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <span className="text-sm text-gray-800">{value ?? NA}</span>
    </div>
  );
}

export default function LandModalContent({ data }: LandModalContentProps) {
  const level = data["Tingkat Potensi Ekonomi"] ?? "";
  const isSangatTinggi = level === "Sangat Tinggi";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Dusun {data.dusun ?? "—"}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">Potensi Lahan & SDA</p>
        </div>
        {level && (
          <span
            className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 mt-1"
            style={{
              backgroundColor: isSangatTinggi ? "#dcfce7" : "#dbeafe",
              color: isSangatTinggi ? "#15803d" : "#1d4ed8",
            }}
          >
            🌟 Potensi {level}
          </span>
        )}
      </div>

      <hr className="border-gray-100" />

      {/* Section 1: Profil Geografis & Tanah */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          🗺️ Profil Geografis & Tanah
        </p>
        <div className="grid grid-cols-2 gap-3">
          <InfoRow label="Jenis Tanah" value={data["Jenis Tanah"]} />
          <InfoRow label="pH Tanah" value={data["pH Tanah"]} />
          <InfoRow label="Topografi" value={data["Topografi"]} />
          <InfoRow label="Elevasi Rata-rata" value={data["Elevasi Rata-rata (mdpl)"] ? `${data["Elevasi Rata-rata (mdpl)"]} mdpl` : undefined} />
          <InfoRow label="Kualitas Air" value={data["Kualitas Air"]} />
          <InfoRow label="Sumber Air" value={data["Sumber Air"] as string} />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Section 2: Inventaris Komoditas */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          📦 Inventaris Komoditas
        </p>

        {/* Pertanian & Kebun */}
        <div className="bg-green-50 rounded-lg p-3 space-y-2">
          <p className="text-xs font-semibold text-green-700">🌾 Pertanian & Kebun</p>
          <InfoRow label="Komoditas Pertanian" value={data["Komoditas Pertanian"]} />
          <InfoRow label="Jenis Tanaman" value={data["Jenis Tanaman"]} />
          <InfoRow label="Komoditas Perkebunan" value={data["Komoditas Perkebunan"]} />
        </div>

        {/* Hortikultura & TOGA */}
        <div className="bg-lime-50 rounded-lg p-3 space-y-2">
          <p className="text-xs font-semibold text-lime-700">🍅 Hortikultura & TOGA</p>
          <InfoRow label="Hortikultura" value={data["Horikultura"]} />
          <InfoRow label="Tanaman Obat (TOGA)" value={data["Tanaman Obat (TOGA)"]} />
        </div>

        {/* Peternakan & Perikanan */}
        <div className="bg-blue-50 rounded-lg p-3 space-y-2">
          <p className="text-xs font-semibold text-blue-700">🐟 Peternakan & Perikanan</p>
          <InfoRow label="Hewan Ternak" value={data["Jenis Hewan Ternak"]} />
          <InfoRow label="Ikan Ternak" value={data["Jenis Ikan Ternak"]} />
          <InfoRow label="Sistem Budidaya" value={data["Sistem Budidaya Ikan"]} />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Section 3: Infrastruktur & Ekonomi */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          ⚡ Infrastruktur & Ekonomi
        </p>
        <div className="space-y-2">
          <InfoRow label="Energi Terbarukan" value={data["Energi Terbarukan"]} />
          <InfoRow label="Potensi Agrowisata" value={data["Potensi Agrowisata"]} />
          <InfoRow label="Kerajinan Lokal" value={data["Kerajinan Lokal"]} />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Section 4: Actionable Insights */}
      <div className="space-y-3">
        {/* Ancaman */}
        <div className="bg-red-50 border border-red-100 rounded-lg p-3">
          <p className="text-xs font-semibold text-red-700 mb-1.5 flex items-center gap-1.5">
            ⚠️ Ancaman SDA
          </p>
          <p className="text-sm text-red-800 leading-relaxed">
            {data["Ancaman SDA"] ?? NA}
          </p>
        </div>

        {/* Rekomendasi */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
          <p className="text-xs font-semibold text-emerald-700 mb-1.5 flex items-center gap-1.5">
            💡 Rekomendasi Kebijakan
          </p>
          <p className="text-sm text-emerald-900 leading-relaxed">
            {data["Rekomendasi"] ?? NA}
          </p>
        </div>
      </div>
    </div>
  );
}
