import React from "react";
import { OctagonAlert, RotateCw } from "lucide-react";
import { surfaceCard } from "../../theme/socTheme";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Threat intelligence lookup failed",
  description = "The analysis engine did not return a result. This is usually transient — retry the lookup, or check the ingestion service status.",
  onRetry,
}) => {
  return (
    <div
      className={`${surfaceCard} flex flex-col items-center justify-center gap-3 border-rose-900/40 bg-rose-950/10 px-6 py-16 text-center`}
      role="alert"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-rose-800/50 bg-rose-500/10">
        <OctagonAlert className="h-6 w-6 text-rose-400" />
      </div>
      <h3 className="text-sm font-semibold text-rose-300">{title}</h3>
      <p className="max-w-sm text-sm text-slate-500">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 rounded-lg border border-rose-800/50 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-300 transition-colors hover:bg-rose-500/20"
        >
          <RotateCw className="h-3.5 w-3.5" />
          Retry analysis
        </button>
      )}
    </div>
  );
};

export default ErrorState;
