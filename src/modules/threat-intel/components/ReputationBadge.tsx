import React from "react";
import type { ReputationStatus } from "../types/threatIntel.types";
import { reputationStyles } from "../theme/socTheme";

interface ReputationBadgeProps {
  reputation: ReputationStatus;
  size?: "sm" | "md";
}

export const ReputationBadge: React.FC<ReputationBadgeProps> = ({
  reputation,
  size = "md",
}) => {
  const styles = reputationStyles[reputation];
  const padding = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${styles.bg} ${styles.text} ${styles.border} ${padding}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.text.replace("text-", "bg-")}`} />
      {styles.label}
    </span>
  );
};

export default ReputationBadge;
