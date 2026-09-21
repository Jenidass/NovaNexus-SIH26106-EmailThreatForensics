import { UserRound, BadgeCheck, ShieldOff } from 'lucide-react';
import type { SenderInfo } from '../../types/investigation';
import { Card, CardBody, CardHeader } from '../ui/Card';

export function SenderInfoCard({ sender }: { sender: SenderInfo }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserRound className="w-4 h-4 text-[var(--nx-cyan)]" />
          <h3 className="text-sm font-semibold text-[var(--nx-text)]">Sender Information</h3>
        </div>
        {sender.spoofed ? (
          <span className="flex items-center gap-1 text-[11px] text-[var(--nx-critical)]"><ShieldOff className="w-3.5 h-3.5" /> Spoofing detected</span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] text-[var(--nx-clean)]"><BadgeCheck className="w-3.5 h-3.5" /> No spoofing signs</span>
        )}
      </CardHeader>
      <CardBody className="grid grid-cols-2 gap-x-4 gap-y-3">
        <Field label="Display name" value={sender.displayName} />
        <Field label="Email address" value={sender.address} mono />
        <Field label="Domain" value={sender.domain} mono />
        <Field label="Domain age" value={`${sender.domainAgeDays} days`} />
        <Field label="Organization" value={sender.organization ?? 'Unknown'} />
        <Field label="Prior abuse reports" value={String(sender.previousReports)} />
      </CardBody>
    </Card>
  );
}

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wide text-[var(--nx-text-faint)]">{label}</p>
      <p className={`text-xs text-[var(--nx-text)] mt-0.5 truncate ${mono ? 'nx-mono' : ''}`}>{value}</p>
    </div>
  );
}
