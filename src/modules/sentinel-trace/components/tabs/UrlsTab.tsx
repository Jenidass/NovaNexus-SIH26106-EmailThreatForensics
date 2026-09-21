import { Link2, ArrowRight } from 'lucide-react';
import type { SuspiciousUrl } from '../../types/investigation';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import ExpandableSection from '../ui/ExpandableSection';

const verdictTone = {
  MALICIOUS: 'red' as const,
  SUSPICIOUS: 'amber' as const,
  CLEAN: 'green' as const,
};

export default function UrlsTab({ urls }: { urls: SuspiciousUrl[] }) {
  return (
    <div className="space-y-5 animate-fadeUp">
      <Card eyebrow="Link Analysis" title="URLs Found in Message" icon={<Link2 size={16} />}>
        <div className="space-y-3">
          {urls.map((u) => (
            <ExpandableSection
              key={u.id}
              defaultOpen={u.verdict === 'MALICIOUS'}
              title={u.displayText}
              subtitle={u.url}
              leftAccessory={
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-base-700 font-mono text-xs font-bold text-base-200">
                  {u.riskScore}
                </div>
              }
              rightAccessory={<Badge tone={verdictTone[u.verdict]}>{u.verdict}</Badge>}
            >
              <div className="space-y-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-base-400 mb-1.5">
                    Full URL
                  </p>
                  <p className="font-mono text-xs text-base-200 break-all bg-base-950 rounded-md p-3 border border-base-700">
                    {u.url}
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-base-400 mb-2">
                    Redirect Chain
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {u.redirectChain.map((hop, i) => (
                      <span key={hop} className="flex items-center gap-2">
                        <span className="font-mono text-xs text-base-300 bg-base-800 border border-base-600 rounded px-2 py-1">
                          {hop}
                        </span>
                        {i < u.redirectChain.length - 1 && (
                          <ArrowRight size={12} className="text-base-500" />
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-base-400 mb-2">
                    Risk Reasons
                  </p>
                  <ul className="space-y-1.5">
                    {u.reasons.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-xs text-base-300">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-signal-red shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ExpandableSection>
          ))}
        </div>
      </Card>
    </div>
  );
}
