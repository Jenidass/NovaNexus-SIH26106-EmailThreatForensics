import { Server, MapPin, Network, ArrowDown } from 'lucide-react';
import type { InfraNode } from '../../types/investigation';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const reputationTone = {
  MALICIOUS: 'red' as const,
  POOR: 'orange' as const,
  NEUTRAL: 'neutral' as const,
  GOOD: 'green' as const,
};

export default function InfrastructureTab({ nodes }: { nodes: InfraNode[] }) {
  return (
    <div className="space-y-5 animate-fadeUp">
      <Card eyebrow="Delivery Path" title="Infrastructure Trace" icon={<Network size={16} />}>
        <div className="space-y-0">
          {nodes.map((node, i) => (
            <div key={node.id}>
              <div className="flex items-start gap-4 rounded-lg border border-base-700 bg-base-800/50 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base-700 text-base-200">
                  <Server size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-base-100">{node.label}</p>
                    <Badge tone={reputationTone[node.reputation]}>{node.reputation}</Badge>
                  </div>
                  <p className="font-mono text-sm text-base-200 break-all">{node.value}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-base-400">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} /> {node.location}
                    </span>
                    {node.asn && <span className="font-mono">{node.asn}</span>}
                    {node.firstSeen && <span>First seen {node.firstSeen}</span>}
                  </div>
                </div>
              </div>
              {i < nodes.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown size={14} className="text-base-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
