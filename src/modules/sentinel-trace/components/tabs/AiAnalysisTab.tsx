import { Sparkles, Info } from 'lucide-react';
import type { AiFinding } from '../../types/investigation';
import Card from '../ui/Card';

export default function AiAnalysisTab({ findings }: { findings: AiFinding[] }) {
  return (
    <div className="space-y-5 animate-fadeUp">
      <Card eyebrow="Model-Assisted Review" title="AI Analysis" icon={<Sparkles size={16} />}>
        <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-base-700 bg-base-800/40 p-3.5">
          <Info size={14} className="text-base-400 mt-0.5 shrink-0" />
          <p className="text-xs text-base-400 leading-relaxed">
            These narrative findings are illustrative, fictional demo output meant to show how model-assisted
            summaries would appear alongside deterministic signals elsewhere in this case.
          </p>
        </div>

        <div className="space-y-3">
          {findings.map((f) => (
            <div key={f.id} className="rounded-lg border border-base-700 bg-base-800/50 p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-sm font-medium text-base-100">{f.summary}</p>
                <span className="shrink-0 font-mono text-xs text-signal-teal">{f.confidence}%</span>
              </div>
              <div className="h-1 rounded-full bg-base-700 overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-signal-teal transition-all duration-700"
                  style={{ width: `${f.confidence}%` }}
                />
              </div>
              <p className="text-xs text-base-400 leading-relaxed">{f.detail}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
