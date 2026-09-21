import { FileSearch } from "lucide-react";
import type {
  AsyncState,
  DashboardSnapshot,
} from "../../types/threat.types";
import { SEVERITY_META, STATUS_META } from "../../theme/severity";
import { Card, CardHeader } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { TableCardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { formatRelativeTime, truncate } from "../../utils/format";

interface RecentInvestigationsTableProps {
  state: AsyncState<DashboardSnapshot>;
  onRetry?: () => void;
  limit?: number;
}

export function RecentInvestigationsTable({
  state,
  onRetry,
  limit = 7,
}: RecentInvestigationsTableProps) {
  if (state.status === "loading") {
    return <TableCardSkeleton />;
  }

  if (state.status === "error") {
    return (
      <Card>
        <CardHeader
          title="Recent Investigations"
          subtitle="Latest flagged cases"
          icon={<FileSearch className="h-4 w-4" />}
        />
        <ErrorState
          message={state.error ?? undefined}
          onRetry={onRetry}
        />
      </Card>
    );
  }

  const rows = (state.data?.investigations ?? []).slice(0, limit);

  return (
    <Card noPadding>
      <div className="p-5 pb-0">
        <CardHeader
          title="Recent Investigations"
          subtitle="Latest flagged cases across all mailboxes"
          icon={<FileSearch className="h-4 w-4" />}
          action={
            <span className="cursor-pointer text-xs font-medium text-cyan-400 transition-colors hover:text-cyan-300">
              View all
            </span>
          }
        />
      </div>

      {state.status === "empty" || rows.length === 0 ? (
        <div className="px-5 pb-5">
          <EmptyState
            title="No investigations yet"
            description="Flagged cases will appear here as soon as the engine detects a threat."
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-y border-slate-800/80 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-5 py-2.5 font-medium">Case</th>
                <th className="px-3 py-2.5 font-medium">Sender</th>
                <th className="px-3 py-2.5 font-medium">Category</th>
                <th className="px-3 py-2.5 font-medium">Severity</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
                <th className="px-3 py-2.5 font-medium">Confidence</th>
                <th className="px-5 py-2.5 text-right font-medium">
                  Detected
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((inv) => {
                /*
                 * Backend currently uses severity values such as:
                 * critical, high, medium, low
                 *
                 * The backend also uses statuses such as:
                 * completed, analyzing
                 *
                 * The frontend theme may not have every backend status.
                 * Therefore we provide safe fallbacks so one unexpected
                 * value cannot crash the entire dashboard.
                 */

                const sev =
                  SEVERITY_META[inv.severity] ??
                  SEVERITY_META.info;

                const status =
                  STATUS_META[inv.status] ?? {
                    label: inv.status
                      ? inv.status.replace(/_/g, " ")
                      : "Unknown",
                    text: "text-slate-300",
                    bg: "bg-slate-800/50",
                    border: "border-slate-700",
                  };

                return (
                  <tr
                    key={inv.id}
                    className="border-b border-slate-800/50 text-sm transition-colors last:border-0 hover:bg-slate-800/20"
                  >
                    <td className="px-5 py-3">
                      <div className="font-mono text-xs text-cyan-400">
                        {inv.caseRef}
                      </div>

                      <div
                        className="mt-0.5 max-w-[240px] truncate text-xs text-slate-400"
                        title={inv.subject}
                      >
                        {truncate(inv.subject, 44)}
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <div
                        className="max-w-[180px] truncate text-xs text-slate-300"
                        title={inv.sender}
                      >
                        {inv.senderDomain}
                      </div>
                    </td>

                    <td className="px-3 py-3 text-xs text-slate-400">
                      {inv.category}
                    </td>

                    <td className="px-3 py-3">
                      <Badge
                        text={sev.text}
                        bg={sev.bg}
                        border={sev.border}
                        dot={sev.dot}
                      >
                        {sev.label}
                      </Badge>
                    </td>

                    <td className="px-3 py-3">
                      <Badge
                        text={status.text}
                        bg={status.bg}
                        border={status.border}
                      >
                        {status.label}
                      </Badge>
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className={`h-full rounded-full ${sev.dot}`}
                            style={{
                              width: `${inv.confidenceScore}%`,
                            }}
                          />
                        </div>

                        <span className="font-mono text-xs text-slate-400">
                          {inv.confidenceScore}%
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3 text-right text-xs text-slate-500">
                      {formatRelativeTime(
                        inv.detectedAt,
                        new Date("2026-08-28T05:35:00Z")
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}