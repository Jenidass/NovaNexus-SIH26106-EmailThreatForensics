import { CheckCircle2, CircleDashed, Loader2, ScanSearch } from 'lucide-react';
import type { AnalysisStep } from '../../types/investigation';
import { ProgressBar } from '../ui/ProgressBar';

interface ProcessingViewProps {
  steps: AnalysisStep[];
  fileName: string;
}

export function ProcessingView({ steps, fileName }: ProcessingViewProps) {
  const done = steps.filter((s) => s.status === 'done').length;
  const pct = Math.round((done / steps.length) * 100);
  const active = steps.find((s) => s.status === 'running');

  return (
    <div className="rounded-[var(--nx-radius)] border border-[var(--nx-border)] bg-[var(--nx-bg-elevated)] overflow-hidden">
      <div className="relative px-6 pt-8 pb-6 text-center border-b border-[var(--nx-border)]">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--nx-cyan)]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--nx-cyan)] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ScanSearch className="w-6 h-6 text-[var(--nx-cyan)]" />
          </div>
        </div>
        <h3 className="text-sm font-semibold text-[var(--nx-text)]">Analyzing {fileName}</h3>
        <p className="text-xs text-[var(--nx-text-dim)] mt-1">{active ? active.detail : 'Finalizing investigation...'}</p>

        <div className="max-w-xs mx-auto mt-5">
          <ProgressBar value={pct} />
          <p className="text-[11px] text-[var(--nx-text-faint)] mt-2">{pct}% complete · {done} of {steps.length} checks done</p>
        </div>
      </div>

      <div className="p-3 nx-scrollbar max-h-72 overflow-y-auto">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--nx-radius-sm)]">
            <div className="flex-shrink-0">
              {step.status === 'done' && <CheckCircle2 className="w-4 h-4 text-[var(--nx-clean)]" />}
              {step.status === 'running' && <Loader2 className="w-4 h-4 text-[var(--nx-cyan)] animate-spin" />}
              {step.status === 'pending' && <CircleDashed className="w-4 h-4 text-[var(--nx-text-faint)]" />}
              {step.status === 'failed' && <CircleDashed className="w-4 h-4 text-[var(--nx-critical)]" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium ${step.status === 'pending' ? 'text-[var(--nx-text-faint)]' : 'text-[var(--nx-text)]'}`}>
                {String(i + 1).padStart(2, '0')} · {step.label}
              </p>
              {step.status !== 'pending' && (
                <p className="text-[11px] text-[var(--nx-text-faint)] mt-0.5">{step.detail}</p>
              )}
            </div>
            {step.status === 'done' && step.durationMs != null && (
              <span className="text-[10px] text-[var(--nx-text-faint)] nx-mono flex-shrink-0">{step.durationMs}ms</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
