import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  text: string;
  bg: string;
  border: string;
  dot?: string;
  className?: string;
}

/** Generic colored pill. Pass Tailwind classes resolved from theme/severity.ts. */
export function Badge({ children, text, bg, border, dot, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide ${text} ${bg} ${border} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />}
      {children}
    </span>
  );
}
