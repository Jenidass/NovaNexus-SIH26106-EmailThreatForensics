import { Link2, Paperclip, ArrowRight } from 'lucide-react';
import type { SuspiciousAttachment, SuspiciousLink } from '../../types/investigation';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { ThreatBadge } from '../ui/ThreatBadge';
import { EmptyState } from '../ui/StatePanels';

interface Props {
  links: SuspiciousLink[];
  attachments: SuspiciousAttachment[];
}

export function SuspiciousLinksCard({ links, attachments }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-[var(--nx-cyan)]" />
          <h3 className="text-sm font-semibold text-[var(--nx-text)]">Suspicious Links & Attachments</h3>
        </div>
      </CardHeader>
      <CardBody className="space-y-3">
        {links.length === 0 && attachments.length === 0 && (
          <EmptyState icon={<Link2 className="w-5 h-5" />} title="Nothing suspicious found" description="No risky links or attachments were detected in this message." />
        )}

        {links.map((l) => (
          <div key={l.id} className="rounded-[var(--nx-radius-sm)] border border-[var(--nx-border)] bg-[var(--nx-bg-elevated)] p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-[var(--nx-text)] font-medium truncate">{l.displayText}</p>
                <p className="text-[11px] text-[var(--nx-text-dim)] nx-mono truncate mt-0.5">{l.url}</p>
                {l.redirectsTo && (
                  <p className="text-[11px] text-[var(--nx-text-faint)] nx-mono truncate mt-0.5 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 flex-shrink-0" /> {l.redirectsTo}
                  </p>
                )}
              </div>
              <ThreatBadge level={l.riskLevel} size="sm" />
            </div>
            <p className="text-[11px] text-[var(--nx-text-dim)] mt-2">{l.reason}</p>
          </div>
        ))}

        {attachments.map((a) => (
          <div key={a.id} className="rounded-[var(--nx-radius-sm)] border border-[var(--nx-border)] bg-[var(--nx-bg-elevated)] p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 min-w-0">
                <Paperclip className="w-3.5 h-3.5 text-[var(--nx-text-faint)] mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-[var(--nx-text)] font-medium truncate">{a.fileName}</p>
                  <p className="text-[11px] text-[var(--nx-text-faint)] mt-0.5">{a.fileType} · {a.sizeKb} KB</p>
                </div>
              </div>
              <ThreatBadge level={a.riskLevel} size="sm" />
            </div>
            <p className="text-[11px] text-[var(--nx-text-dim)] mt-2">{a.reason}</p>
            <p className="text-[10px] text-[var(--nx-text-faint)] nx-mono mt-1 truncate">SHA-256: {a.hash}</p>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
