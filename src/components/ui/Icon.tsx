// src/components/ui/Icon.tsx
// Wrapper standar untuk Material Symbols Outlined (M3 Icon System)
// Sumber: docs/DESIGN/DESIGN_SYS.md Bab 5 — "Icons: Exclusively Material Symbols Outlined, 24px base"

interface IconProps {
  /** Nama ikon Material Symbols (snake_case). Contoh: "map", "bar_chart", "school" */
  name: string;
  /** Ukuran ikon dalam px. Default: 24 */
  size?: number;
  /** Jika true, gunakan FILL=1 (ikon penuh — untuk state aktif/selected) */
  filled?: boolean;
  /** Kelas Tailwind tambahan */
  className?: string;
  /** Inline style tambahan */
  style?: React.CSSProperties;
  /** aria-hidden untuk ikon dekoratif */
  "aria-hidden"?: boolean | "true" | "false";
}

export default function Icon({
  name,
  size = 24,
  filled = false,
  className = "",
  style,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  return (
    <span
      className={[
        "material-symbols-outlined",
        filled ? "filled" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ fontSize: `${size}px`, ...style }}
      aria-hidden={ariaHidden}
    >
      {name}
    </span>
  );
}
