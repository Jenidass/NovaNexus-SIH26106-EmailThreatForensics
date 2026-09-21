import { Mail, Paperclip, Users, Calendar } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface EmailTabProps {
  meta: {
    subject: string;
    from: string;
    replyTo: string;
    to: string;
    date: string;
    attachments: number;
    bodyPreview: string;
  };
}

function Field({ label, value, flagged }: { label: string; value: string; flagged?: boolean }) {
  return (
    <div className="py-2.5 border-b border-base-700/60 last:border-b-0">
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-base-400 mb-1">{label}</p>
      <p className={`text-sm font-mono break-all ${flagged ? 'text-signal-red' : 'text-base-100'}`}>{value}</p>
    </div>
  );
}

export default function EmailTab({ meta }: EmailTabProps) {
  return (
    <div className="space-y-5 animate-fadeUp">
      <Card eyebrow="Message" title="Email Overview" icon={<Mail size={16} />}>
        <div className="grid md:grid-cols-2 gap-x-8">
          <div>
            <Field label="Subject" value={meta.subject} flagged />
            <Field label="From" value={meta.from} flagged />
            <Field label="Reply-To" value={meta.replyTo} flagged />
          </div>
          <div>
            <Field label="To" value={meta.to} />
            <Field label="Date" value={new Date(meta.date).toUTCString()} />
            <Field label="Attachments" value={String(meta.attachments)} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="red">
            <Users size={11} /> 14 recipients
          </Badge>
          <Badge tone="neutral">
            <Paperclip size={11} /> No attachments
          </Badge>
          <Badge tone="neutral">
            <Calendar size={11} /> Received Aug 27, 2026
          </Badge>
        </div>
      </Card>

      <Card eyebrow="Content" title="Body Preview">
        <div className="rounded-lg border border-base-700 bg-base-950 p-5 font-mono text-sm leading-relaxed text-base-200">
          <p className="text-base-400 text-xs mb-3 font-sans">
            Rendered as plain text for analysis. Original HTML formatting and embedded tracking pixels have been
            stripped.
          </p>
          {meta.bodyPreview}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="amber">Urgency language detected</Badge>
          <Badge tone="amber">Coercive deadline ("within 24 hours")</Badge>
        </div>
      </Card>
    </div>
  );
}
