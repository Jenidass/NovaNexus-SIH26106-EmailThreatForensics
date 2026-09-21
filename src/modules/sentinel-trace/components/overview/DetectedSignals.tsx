import { AlertTriangle, XOctagon, CheckCircle2 } from 'lucide-react';
import type { DetectedSignal } from '../../types/investigation';
import { signalStatusStyles } from '../../lib/severity';
import Card from '../ui/Card';
import Tooltip from '../ui/Tooltip';

const statusIcon = {
  PASS: CheckCircle2,
  WARN: AlertTriangle,
  FAIL: XOctagon,
};

export default function DetectedSignals({ signals }: { signals: DetectedSignal[] }) {
  return (
    <Card eyebrow="04 · Indicators" title="Detected Signals">
      <ul className="space-y-2.5">
        {signals.map((signal) => {
          const style = signalStatusStyles[signal.status];
          const Icon = statusIcon[signal.status];
          return (
            <li
              key={signal.id}
              className={`flex items-start gap-3 rounded-lg border ${style.border} ${style.bg} px-3.5 py-3`}
            >
              <Icon size={16} className={`mt-0.5 shrink-0 ${style.text}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm font-medium text-base-100">{signal.label}</span>
                  <Tooltip content={signal.description} />
                  <span className="font-mono text-[10px] uppercase tracking-wide text-base-400 ml-auto sm:ml-1">
                    {signal.category}
                  </span>
                </div>
                <p className="text-xs text-base-400 mt-1 leading-relaxed">{signal.description}</p>
              </div>
              <span className={`shrink-0 font-mono text-xs font-semibold ${style.text}`}>
                +{signal.weight}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
