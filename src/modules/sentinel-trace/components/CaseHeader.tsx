import { ShieldAlert, Fingerprint, Gauge, Percent } from 'lucide-react';
import type { CaseSummary } from '../types/investigation';
import { severityStyles } from '../lib/severity';
import Badge from './ui/Badge';

interface CaseHeaderProps {
  summary: CaseSummary;
}

function Stat({
  icon,
  label,
  value,
  valueClass = '',
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 border-l border-base-700 first:border-l-0">
      <span className="text-base-500">{icon}</span>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-base-400">{label}</p>
        <p className={`text-sm font-semibold font-mono ${valueClass || 'text-base-100'}`}>{value}</p>
      </div>
    </div>
  );
}

export default function CaseHeader({ summary }: CaseHeaderProps) {
  const style = severityStyles[summary.severity];

  return (
    <div className="rounded-xl border border-base-700 bg-base-850/80 backdrop-blur-sm overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className={`relative flex h-2.5 w-2.5`}>
            <span className={`absolute inline-flex h-full w-full rounded-full ${style.dot} opacity-75 animate-blink`} />
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${style.dot}`} />
          </span>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-base-400">Investigation Results</p>
            <h1 className="text-lg sm:text-xl font-bold text-base-100 font-mono">{summary.caseId}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Badge tone="neutral">{summary.status.replace('_', ' ')}</Badge>
          <Badge
            tone={
              summary.severity === 'CRITICAL'
                ? 'red'
                : summary.severity === 'HIGH'
                ? 'orange'
                : summary.severity === 'SUSPICIOUS'
                ? 'amber'
                : 'green'
            }
            className={`${style.glow}`}
          >
            <ShieldAlert size={12} />
            {style.label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-base-700">
        <Stat icon={<Fingerprint size={16} />} label="Threat Classification" value={summary.threat} valueClass="text-signal-red" />
        <Stat icon={<Gauge size={16} />} label="Threat Score" value={`${summary.threatScore} / 100`} valueClass={style.text} />
        <Stat icon={<Percent size={16} />} label="Confidence" value={`${summary.confidence}%`} />
        <Stat
          icon={<ShieldAlert size={16} />}
          label="Severity"
          value={style.label.toUpperCase()}
          valueClass={style.text}
        />
      </div>
    </div>
  );
}
