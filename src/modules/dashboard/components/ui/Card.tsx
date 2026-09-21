import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Remove default padding when a child needs edge-to-edge layout (charts, tables) */
  noPadding?: boolean;
}

/**
 * Base panel used everywhere in Nova Nexus: navy surface, subtle 1px border,
 * soft inner highlight. Keep this the single card primitive so every module
 * (Dashboard, GeoLocation, Forensics...) looks identical.
 */
export function Card({ children, className = "", noPadding = false, ...rest }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-800/80 bg-[#0B1120]/80 backdrop-blur-sm shadow-[0_0_0_1px_rgba(148,163,184,0.03)] ${
        noPadding ? "" : "p-5"
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, icon, action }: CardHeaderProps) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-start gap-2.5">
        {icon && (
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-slate-100">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
