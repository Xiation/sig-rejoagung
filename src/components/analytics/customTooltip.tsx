// src/components/analytics/customTooltip.tsx
// Shared Recharts custom tooltip — dipakai oleh semua analytics child components

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number | string; name?: string }>;
  label?: string;
  unit?: string; // opsional: override satuan (default: payload[0].name)
}

export default function CustomTooltip({ active, payload, label, unit }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const value = payload[0].value;
  const displayUnit = unit ?? payload[0].name ?? "";

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 px-3 py-2 pointer-events-none">
      {label && (
        <p className="label-caps text-slate-400 mb-1">{label}</p>
      )}
      <p className="font-heading text-slate-900 font-bold text-sm">
        {value}
        {displayUnit && (
          <span className="font-body font-normal text-slate-500 ml-1 text-xs">
            {displayUnit}
          </span>
        )}
      </p>
    </div>
  );
}