import React from "react";
import { SearchX } from "lucide-react";
import { surfaceCard } from "../../theme/socTheme";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No threat intelligence to display",
  description = "Select a scanned email from the inbox queue to view its threat score, IOC breakdown and geolocation trace.",
  actionLabel,
  onAction,
}) => {
  return (
    <div className={`${surfaceCard} flex flex-col items-center justify-center gap-3 px-6 py-16 text-center`}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-700 bg-slate-800/60">
        <SearchX className="h-6 w-6 text-slate-500" />
      </div>
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      <p className="max-w-sm text-sm text-slate-500">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 rounded-lg border border-cyan-700/50 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition-colors hover:bg-cyan-500/20"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
