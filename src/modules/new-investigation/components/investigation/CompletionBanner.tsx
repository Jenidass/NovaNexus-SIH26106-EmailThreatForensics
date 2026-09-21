import { CheckCircle2, Download, RotateCcw } from 'lucide-react';
import type { InvestigationResult } from '../../types/investigation';
import { Button } from '../ui/Button';
import { ThreatBadge } from '../ui/ThreatBadge';

interface Props {
  result: InvestigationResult;
  onNewInvestigation: () => void;
}

export function CompletionBanner({ result, onNewInvestigation }: Props) {
  return (
    <div className="rounded-[var(--nx-radius)] border border-[var(--nx-border)] bg-gradient-to-r from-[var(--nx-surface)] to-[var(--nx-bg-elevated)] p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--nx-clean)]/10 border border-[var(--nx-clean)]/30 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-[var(--nx-clean)]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-semibold text-[var(--nx-text)]">Investigation Complete</h2>
              <ThreatBadge level={result.threatScore.level} size="sm" />
            </div>
            <p className="text-xs text-[var(--nx-text-dim)] mt-1">{result.verdict}</p>
            <p className="text-[11px] text-[var(--nx-text-faint)] mt-1">
              {result.fileName} · completed {new Date(result.completedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={<Download className="w-3.5 h-3.5" />}>
            Export Report
          </Button>
          <Button variant="primary" icon={<RotateCcw className="w-3.5 h-3.5" />} onClick={onNewInvestigation}>
            New Investigation
          </Button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--nx-border)] flex items-start gap-2">
        <span className="text-[10px] uppercase tracking-wide text-[var(--nx-text-faint)] flex-shrink-0 pt-0.5">Recommended action</span>
        <p className="text-xs text-[var(--nx-text-dim)]">{result.recommendedAction}</p>
      </div>
    </div>
  );
}
