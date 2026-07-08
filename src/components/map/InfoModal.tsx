// src/components/map/InfoModal.tsx
// Phase 4 — Wrapper Pattern Modal
// Berperan sebagai container M3 (max-w-2xl, backdrop, animasi)
// Conditional rendering berdasarkan activeModule → content di folder /content/
// Sumber: docs/feature/modal_dynamic_context.md, docs/DESIGN/DESIGN_SYS.md

"use client";

import Icon from "@/components/ui/Icon";
import AsetfasumModal from "./content/AsetfasumModal";
import SekolahModal from "./content/SekolahModal";
import PotensiModal from "./content/PotensiModal";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Record<string, unknown>;
  activeModule: "aset" | "sekolah" | "potensi";
}

// Map module → label & icon untuk modal header chip
const MODULE_META: Record<string, { label: string; icon: string; chipClass: string }> = {
  aset: {
    label: "Aset & Fasilitas Umum",
    icon: "account_balance",
    chipClass: "bg-[var(--primary-container)] text-[var(--on-primary-container)] border-emerald-200",
  },
  sekolah: {
    label: "Aksesibilitas Pendidikan",
    icon: "school",
    chipClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  potensi: {
    label: "Potensi Lahan & SDA",
    icon: "agriculture",
    chipClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

export default function InfoModal({ isOpen, onClose, data, activeModule }: InfoModalProps) {
  if (!isOpen || !data) return null;

  const meta = MODULE_META[activeModule] ?? MODULE_META["aset"];

  return (
    // ── Backdrop Overlay ────────────────────────────────────────────────────
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* ── Modal Shell (max-w-2xl per DESIGN_SYS.md) ─────────────────────── */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-[var(--outline-variant)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--outline-variant)]/60 shrink-0">
          {/* Module chip */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border label-caps ${meta.chipClass}`}>
            <Icon name={meta.icon} size={14} />
            {meta.label}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--secondary)] hover:bg-[var(--surface-container)] transition-colors"
            aria-label="Tutup modal"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* ── Modal Body (scrollable) ───────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {activeModule === "aset" && <AsetfasumModal data={data} />}
          {activeModule === "sekolah" && <SekolahModal data={data} />}
          {activeModule === "potensi" && <PotensiModal data={data} />}
        </div>

        {/* ── Modal Footer ─────────────────────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-[var(--outline-variant)]/60 shrink-0 flex items-center justify-between gap-3">
          <p className="micro-copy text-[var(--text-muted)]">
            ⓘ Data statis · KKN-PPM UGM 2026
          </p>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--outline-variant)] body-base font-semibold text-[var(--secondary)] hover:bg-[var(--surface-container-low)] transition-colors"
          >
            <Icon name="close" size={16} />
            Tutup Detail
          </button>
        </div>
      </div>
    </div>
  );
}