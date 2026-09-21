import { ArrowRight, Zap, ShieldCheck, CircleDot } from 'lucide-react';
import type { Recommendation } from '../../types/investigation';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const priorityMeta = {
  IMMEDIATE: { tone: 'red' as const, icon: Zap },
  RECOMMENDED: { tone: 'amber' as const, icon: ShieldCheck },
  OPTIONAL: { tone: 'neutral' as const, icon: CircleDot },
};

export default function Recommendations({ items }: { items: Recommendation[] }) {
  return (
    <Card eyebrow="06 · Response Guidance" title="Recommendations">
      <ol className="space-y-3">
        {items.map((rec, i) => {
          const meta = priorityMeta[rec.priority];
          const Icon = meta.icon;
          return (
            <li key={rec.id} className="flex gap-3 group">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-base-600 font-mono text-[11px] text-base-400">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1 pb-3 border-b border-base-700/60 group-last:border-b-0 group-last:pb-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-base-100">{rec.action}</p>
                  <Badge tone={meta.tone}>
                    <Icon size={10} />
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-xs text-base-400 mt-1 leading-relaxed flex items-start gap-1">
                  <ArrowRight size={12} className="mt-0.5 shrink-0 text-base-500" />
                  {rec.detail}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
