interface SkeletonProps {
  className?: string;
}

/** Shimmering placeholder block used while dashboard data is loading. */
export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-slate-800/60 bg-[length:200%_100%] ${className}`}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-800/80 bg-[#0B1120]/80 p-5">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-7 w-16" />
      <Skeleton className="mt-3 h-3 w-32" />
    </div>
  );
}

export function ChartCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-800/80 bg-[#0B1120]/80 p-5">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-2 h-3 w-56" />
      <Skeleton className="mt-6 h-56 w-full rounded-lg" />
    </div>
  );
}

export function TableCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-800/80 bg-[#0B1120]/80 p-5">
      <Skeleton className="h-4 w-48" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
