import { KeyRound, ShieldCheck, ShieldX, ShieldQuestion } from 'lucide-react';
import type { AuthCheck } from '../../types/investigation';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Tooltip from '../ui/Tooltip';

const resultMeta = {
  PASS: { icon: ShieldCheck, tone: 'green' as const, text: 'text-signal-green' },
  FAIL: { icon: ShieldX, tone: 'red' as const, text: 'text-signal-red' },
  NEUTRAL: { icon: ShieldQuestion, tone: 'amber' as const, text: 'text-signal-amber' },
  NONE: { icon: ShieldQuestion, tone: 'neutral' as const, text: 'text-base-400' },
};

const protocolExplainers: Record<AuthCheck['protocol'], string> = {
  SPF: 'Sender Policy Framework verifies the sending server is authorized to send mail for this domain.',
  DKIM: 'DomainKeys Identified Mail checks a cryptographic signature proving the message was not altered in transit.',
  DMARC: 'Domain-based Message Authentication ties SPF and DKIM together and tells receivers what to do on failure.',
};

export default function AuthenticationTab({ checks }: { checks: AuthCheck[] }) {
  return (
    <div className="space-y-5 animate-fadeUp">
      <Card eyebrow="Sender Verification" title="Authentication Results" icon={<KeyRound size={16} />}>
        <div className="grid sm:grid-cols-3 gap-4">
          {checks.map((check) => {
            const meta = resultMeta[check.result];
            const Icon = meta.icon;
            return (
              <div key={check.protocol} className="rounded-lg border border-base-700 bg-base-800/60 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-sm font-bold text-base-100">{check.protocol}</span>
                    <Tooltip content={protocolExplainers[check.protocol]} />
                  </div>
                  <Icon size={18} className={meta.text} />
                </div>
                <Badge tone={meta.tone}>{check.result}</Badge>
                <p className="text-xs text-base-400 mt-3 leading-relaxed">{check.detail}</p>
                <p className="font-mono text-[11px] text-base-500 mt-2 break-all">{check.domain}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 rounded-lg border border-signal-red/30 bg-signal-red/5 p-4">
          <p className="text-sm font-medium text-base-100 mb-1">Alignment summary</p>
          <p className="text-xs text-base-400 leading-relaxed">
            Both SPF and DKIM fail for this sending domain, and its DMARC policy of{' '}
            <code className="font-mono text-signal-amber">p=none</code> means the receiving server took no
            enforcement action on the failure. This is a strong indicator of spoofed or unauthorized sending
            infrastructure.
          </p>
        </div>
      </Card>
    </div>
  );
}
