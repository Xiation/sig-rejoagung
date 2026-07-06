// src/components/analytics/LandPotentialMetrics.tsx
// extracted from dusun.geojson properties

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// ─── DATA (hardcoded dari dusun.geojson properties) ──────────────────────────

const dusunData = [
  {
    id: "003",
    nama: "Sumberagung",
    potensiEkonomi: "Sangat Tinggi",
    produksiPadi: "6.4 ton/ha",
    ip: "IP 200",
    komoditasPertanian: "Padi Sawah",
    jenisTanaman: "Padi, Jagung, Pisang",
    hortikultura: "Pisang, Pepaya",
    energi: "PLTS Atap, Biogas Ternak",
    ternak: "Sapi, Kambing, Ayam",
    ikan: "Nila, Lele",
    agrowisata: "Wisata Sawah dan Mata Air",
    kerajinan: "Anyaman Bambu, Produk Olahan Kakao",
    rekomendasi: "Intensifikasi SRI, Sambung Samping Kakao, Sertifikasi Organik, PLTS Komunal",
  },
  {
    id: "001",
    nama: "Sumberagung Kidul",
    potensiEkonomi: "Tinggi",
    produksiPadi: "5.8 ton/ha",
    ip: "IP 100",
    komoditasPertanian: "Hortikultura & Peternakan Sapi",
    jenisTanaman: "Cabai, Tomat, Jagung, Ubi Jalar",
    hortikultura: "Cabai Merah, Tomat, Terong, Bawang Merah",
    energi: "Biogas Ternak Sapi, PLTS Atap",
    ternak: "Sapi Potong, Kambing, Domba, Ayam Kampung",
    ikan: "Lele, Gurami",
    agrowisata: "Wisata Kebun dan Peternakan Terpadu",
    kerajinan: "Kerajinan Bambu",
    rekomendasi: "Sistem irigasi tetes, Integrasi tanaman-ternak, Biogas komunal, Sertifikasi GAP hortikultura",
  },
  {
    id: "002",
    nama: "Sumbergroto",
    potensiEkonomi: "Sangat Tinggi",
    produksiPadi: "7.2 ton/ha",
    ip: "IP 300",
    komoditasPertanian: "Padi Sawah Irigasi & Ikan Air Tawar",
    jenisTanaman: "Padi, Melon, Semangka, Edamame, Jagung hibrida",
    hortikultura: "Melon, Semangka, Edamame, Kacang panjang",
    energi: "PLTMH (aliran sungai), PLTS Atap",
    ternak: "Sapi, Itik, Ayam Petelur",
    ikan: "Nila, Lele, Gurami, Udang Galah",
    agrowisata: "Wisata Sawah, Mina Padi, Edukasi Pertanian",
    kerajinan: "Olahan Ikan",
    rekomendasi: "Mina padi massal, PLTMH sungai, Agrowisata Banyuwangi Festival, Ekspor edamame",
  },
  {
    id: "004",
    nama: "Sumbergroto Kidul",
    potensiEkonomi: "Tinggi",
    produksiPadi: "5.5 ton/ha",
    ip: "IP 200",
    komoditasPertanian: "Lahan Basah & Budidaya Perikanan",
    jenisTanaman: "Padi rawa (Inpara 3/8), Pandan wangi, Mendong",
    hortikultura: "Kangkung air, Genjer, Talas",
    energi: "PLTS Atap, Biogas Itik/Ayam",
    ternak: "Itik, Entog, Ayam Kampung",
    ikan: "Nila, Mujair, Udang Galah, Gabus",
    agrowisata: "Ekowisata Lahan Basah, Wisata Riparian",
    kerajinan: "Anyaman Pandan, Tikar Mendong, Kerajinan Bambu",
    rekomendasi: "Varietas Inpara toleran rendaman, Tambak air tawar, Sertifikasi kerajinan pandan ekspor, Konservasi riparian PES",
  },
];

// ─── HELPER ──────────────────────────────────────────────────────────────────

function PotensiBadge({ level }: { level: string }) {
  const isSangatTinggi = level === "Sangat Tinggi";
  return (
    <span
      className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: isSangatTinggi ? "#dcfce7" : "#dbeafe",
        color: isSangatTinggi ? "#15803d" : "#1d4ed8",
      }}
    >
      🌟 Potensi {level}
    </span>
  );
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function LandPotentialMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {dusunData.map((dusun) => (
        <Card key={dusun.id} className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-lg">Dusun {dusun.nama}</CardTitle>
                <CardDescription className="mt-1">
                  {dusun.produksiPadi} · {dusun.ip}
                </CardDescription>
              </div>
              <PotensiBadge level={dusun.potensiEkonomi} />
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 flex-1">
            {/* Zonasi Potensi Utama */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                📦 Zonasi Potensi Utama
              </p>
              <ul className="text-sm text-gray-700 space-y-1 pl-1">
                <li>
                  <span className="text-gray-400">Pertanian:</span>{" "}
                  {dusun.komoditasPertanian}
                </li>
                <li>
                  <span className="text-gray-400">Tanaman:</span>{" "}
                  {dusun.jenisTanaman}
                </li>
                <li>
                  <span className="text-gray-400">Hortikultura:</span>{" "}
                  {dusun.hortikultura}
                </li>
                <li>
                  <span className="text-gray-400">Agrowisata:</span>{" "}
                  {dusun.agrowisata}
                </li>
              </ul>
            </div>

            {/* Energi Terbarukan */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                ⚡ Energi Terbarukan
              </p>
              <p className="text-sm text-gray-700">{dusun.energi}</p>
            </div>

            {/* Peternakan & Perikanan */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                🐟 Peternakan & Perikanan
              </p>
              <p className="text-sm text-gray-700">
                <span className="text-gray-400">Ternak:</span> {dusun.ternak}
              </p>
              <p className="text-sm text-gray-700">
                <span className="text-gray-400">Ikan:</span> {dusun.ikan}
              </p>
            </div>

            {/* Kerajinan Lokal */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                🎨 Kerajinan Lokal
              </p>
              <p className="text-sm text-gray-700">{dusun.kerajinan}</p>
            </div>

            {/* Rekomendasi Kebijakan */}
            <div className="bg-muted/50 p-3 rounded-md border-l-4 border-primary mt-auto">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                💡 Rekomendasi Kebijakan
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{dusun.rekomendasi}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}