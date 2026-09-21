import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

/** Shown inside a panel when the data request fails. */
export function ErrorState({
  message = "Unable to load this data. The detection service may be unreachable.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-rose-900/60 bg-rose-500/5 py-12 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium text-rose-300">Something went wrong</p>
      <p className="max-w-xs text-xs text-slate-500">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Retry
        </button>
      )}
    </div>
  );
}
