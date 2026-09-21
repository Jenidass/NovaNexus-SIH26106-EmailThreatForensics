import { FileSearch2 } from 'lucide-react';
import type { EvidenceItem } from '../../types/investigation';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { ThreatBadge } from '../ui/ThreatBadge';

const categoryLabel: Record<EvidenceItem['category'], string> = {
  header: 'Header',
  content: 'Content',
  link: 'Link',
  attachment: 'Attachment',
  network: 'Network',
  authentication: 'Authentication',
};

export function EvidenceFindings({ evidence }: { evidence: EvidenceItem[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileSearch2 className="w-4 h-4 text-[var(--nx-cyan)]" />
          <h3 className="text-sm font-semibold text-[var(--nx-text)]">Evidence & Findings</h3>
        </div>
        <span className="text-[11px] text-[var(--nx-text-faint)]">{evidence.length} findings</span>
      </CardHeader>
      <CardBody>
        <ol className="relative border-l border-[var(--nx-border)] ml-1.5 space-y-5">
          {evidence.map((e) => (
            <li key={e.id} className="ml-4">
              <span className="absolute -left-[5px] mt-1.5 w-2.5 h-2.5 rounded-full bg-[var(--nx-cyan)] ring-4 ring-[var(--nx-surface)]" />
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs font-medium text-[var(--nx-text)]">{e.title}</p>
                <ThreatBadge level={e.severity} size="sm" />
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--nx-border-strong)] text-[var(--nx-text-faint)]">
                  {categoryLabel[e.category]}
                </span>
              </div>
              <p className="text-[11px] text-[var(--nx-text-dim)] mt-1 leading-relaxed">{e.description}</p>
            </li>
          ))}
        </ol>
      </CardBody>
    </Card>
  );
}
