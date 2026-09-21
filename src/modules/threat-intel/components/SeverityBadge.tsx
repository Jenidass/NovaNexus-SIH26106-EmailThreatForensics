import React from "react";
import { AlertTriangle, ShieldAlert, ShieldQuestion, ShieldCheck, Info } from "lucide-react";
import type { SeverityLevel } from "../types/threatIntel.types";
import { severityStyles } from "../theme/socTheme";

const severityIcon: Record<SeverityLevel, React.ComponentType<{ className?: string }>> = {
  critical: ShieldAlert,
  high: AlertTriangle,
  medium: ShieldQuestion,
  low: ShieldCheck,
  info: Info,
};

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = "md",
  showIcon = true,
}) => {
  const styles = severityStyles[severity];
  const Icon = severityIcon[severity];
  const padding = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${styles.bg} ${styles.text} ${styles.border} ${padding}`}
    >
      {showIcon && <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />}
      {styles.label}
    </span>
  );
};

export default SeverityBadge;
