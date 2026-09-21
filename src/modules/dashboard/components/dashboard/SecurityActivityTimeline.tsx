import {
  Activity,
  Bell,
  CheckCircle2,
  MapPin,
  ScanSearch,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import type { ActivityEvent, ActivityEventType, AsyncState, DashboardSnapshot } from "../../types/threat.types";
import { SEVERITY_META } from "../../theme/severity";
import { Card, CardHeader } from "../ui/Card";
import { ChartCardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { formatRelativeTime } from "../../utils/format";

interface SecurityActivityTimelineProps {
  state: AsyncState<DashboardSnapshot>;
  onRetry?: () => void;
  limit?: number;
}

const ICON_BY_TYPE: Record<ActivityEventType, React.ReactNode> = {
  detection: <ShieldAlert className="h-3.5 w-3.5" />,
  escalation: <Bell className="h-3.5 w-3.5" />,
  resolution: <CheckCircle2 className="h-3.5 w-3.5" />,
  forensic_scan: <ScanSearch className="h-3.5 w-3.5" />,
  geo_flag: <MapPin className="h-3.5 w-3.5" />,
  system: <Terminal className="h-3.5 w-3.5" />,
};

function EventDot({ event }: { event: ActivityEvent }) {
  const meta = event.severity ? SEVERITY_META[event.severity] : SEVERITY_META.info;
  return (
    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${meta.border} ${meta.bg} ${meta.text}`}>
      {ICON_BY_TYPE[event.type]}
    </div>
  );
}

export function SecurityActivityTimeline({ state, onRetry, limit = 6 }: SecurityActivityTimelineProps) {
  if (state.status === "loading") return <ChartCardSkeleton />;

  if (state.status === "error") {
    return (
      <Card>
        <CardHeader title="Security Activity" subtitle="Live event stream" icon={<Activity className="h-4 w-4" />} />
        <ErrorState message={state.error ?? undefined} onRetry={onRetry} />
      </Card>
    );
  }

  const events = (state.data?.activity ?? []).slice(0, limit);

  return (
    <Card>
      <CardHeader title="Security Activity" subtitle="Live event stream across all modules" icon={<Activity className="h-4 w-4" />} />
      {state.status === "empty" || events.length === 0 ? (
        <EmptyState title="No recent activity" description="System and analyst actions will stream here in real time." />
      ) : (
        <ol className="relative space-y-5 pl-1">
          <div className="absolute bottom-2 left-[13px] top-2 w-px bg-slate-800" aria-hidden />
          {events.map((event) => (
            <li key={event.id} className="relative flex gap-3">
              <EventDot event={event} />
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-slate-200">{event.title}</p>
                  <span className="shrink-0 whitespace-nowrap text-[11px] text-slate-500">
                    {formatRelativeTime(event.timestamp, new Date("2026-08-28T05:35:00Z"))}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{event.description}</p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-600">{event.actor}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
