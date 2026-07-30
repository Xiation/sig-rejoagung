// src/components/map/content/LstAnalysisInfoModal.tsx
// Modal statis (bukan berbasis klik-titik) — dibuka lewat tombol di LstLegend, isinya narasi
// nilai strategis analisis LST buat kebijakan pembangunan & kaitannya sama stunting.
"use client";

import { createPortal } from "react-dom";
import Icon from "@/components/ui/Icon";

interface LstAnalysisInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LstAnalysisInfoModal({ isOpen, onClose }: LstAnalysisInfoModalProps) {
  if (!isOpen) return null;

  // createPortal ke document.body — alasan sama kayak InfoModal.tsx (lihat komentar di sana):
  // modal ini dipanggil dari dalam <MapContainer>, tanpa portal dia jadi descendant DOM Leaflet
  // dan gak bisa di-scroll pakai touch (touch-action: none Leaflet override native scroll).
  return createPortal(
    <div
      className="fixed top-16 inset-x-0 bottom-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[calc(100vh-6rem)] flex flex-col relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-[var(--outline-variant)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--outline-variant)]/60 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border label-caps bg-rose-50 text-rose-700 border-rose-200">
            <Icon name="thermostat" size={14} />
            Perubahan Suhu Permukaan
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <section>
            <h3 className="body-base font-bold text-[var(--on-surface)] mb-2">
              Nilai Strategis untuk Kebijakan Pembangunan
            </h3>
            <p className="body-base text-[var(--secondary)] leading-relaxed">
              Hasil pemetaan LST ini memiliki nilai strategis sebagai dasar dalam penyusunan kebijakan
              pembangunan yang berwawasan lingkungan. Informasi persebaran suhu permukaan dapat
              dimanfaatkan untuk menentukan wilayah prioritas penghijauan, pengembangan ruang terbuka
              hijau, pelestarian lahan pertanian, serta mengevaluasi perubahan penggunaan lahan selama
              periode 2020–2025. Dengan demikian, pemerintah desa dapat merancang langkah-langkah
              adaptasi terhadap perubahan iklim sekaligus menjaga kualitas lingkungan dan produktivitas
              sektor pertanian.
            </p>
          </section>

          <section>
            <h3 className="body-base font-bold text-[var(--on-surface)] mb-2">
              Kaitan dengan Fenomena Stunting
            </h3>
            <p className="body-base text-[var(--secondary)] leading-relaxed">
              Dalam kaitannya dengan fenomena stunting, data LST tidak digunakan sebagai penyebab
              langsung, melainkan sebagai indikator perubahan kondisi lingkungan yang dapat memengaruhi
              berbagai faktor risiko. Peningkatan suhu permukaan dapat mengindikasikan berkurangnya
              tutupan vegetasi, menurunnya ketersediaan air, serta menurunnya produktivitas lahan
              pertanian yang berdampak pada ketahanan pangan masyarakat. Selain itu, kondisi lingkungan
              yang kurang baik juga berpotensi meningkatkan risiko penyakit infeksi akibat sanitasi dan
              akses air bersih yang tidak memadai. Oleh karena itu, data LST dapat dimanfaatkan sebagai
              variabel pendukung dalam analisis spasial untuk mengidentifikasi wilayah yang lebih rentan
              terhadap faktor-faktor risiko stunting, sehingga membantu pemerintah desa dalam menetapkan
              prioritas intervensi secara lebih tepat sasaran.
            </p>
          </section>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-[var(--outline-variant)]/60 shrink-0 flex items-center justify-between gap-3">
          <p className="micro-copy text-[var(--text-muted)]">
            ⓘ Analisis kebijakan · KKN-PPM UGM 2026
          </p>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--outline-variant)] body-base font-semibold text-[var(--secondary)] hover:bg-[var(--surface-container-low)] transition-colors"
          >
            <Icon name="close" size={16} />
            Tutup
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
