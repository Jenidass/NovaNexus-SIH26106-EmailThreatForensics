import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
}

/** Shown inside a panel when the query succeeded but returned no records. */
export function EmptyState({
  title = "Nothing to show yet",
  description = "No records match the current filters. Once new activity is detected it will appear here.",
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-800 py-12 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/60 text-slate-500">
        {icon ?? <Inbox className="h-5 w-5" />}
      </div>
      <p className="text-sm font-medium text-slate-300">{title}</p>
      <p className="max-w-xs text-xs text-slate-500">{description}</p>
    </div>
  );
}
