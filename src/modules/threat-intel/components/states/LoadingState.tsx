import React from "react";
import { Loader2 } from "lucide-react";
import { surfaceCard } from "../../theme/socTheme";

const SkeletonBlock: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-slate-800/70 ${className}`} />
);

export const LoadingState: React.FC = () => {
  return (
    <div className="space-y-6" role="status" aria-live="polite" aria-busy="true">
      <div className="flex items-center gap-2 text-sm text-cyan-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        Running threat correlation &amp; geolocation lookup…
      </div>

      <div className={`${surfaceCard} p-5`}>
        <SkeletonBlock className="mb-4 h-4 w-40" />
        <SkeletonBlock className="mb-2 h-8 w-24" />
        <SkeletonBlock className="h-3 w-64" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`${surfaceCard} p-4`}>
            <SkeletonBlock className="mb-3 h-3 w-20" />
            <SkeletonBlock className="mb-2 h-5 w-32" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
        ))}
      </div>

      <div className={`${surfaceCard} h-72 p-4`}>
        <SkeletonBlock className="mb-4 h-4 w-48" />
        <SkeletonBlock className="h-52 w-full" />
      </div>
    </div>
  );
};

export default LoadingState;
