import { ListTree, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { EmailHeaderField } from '../../types/investigation';
import Card from '../ui/Card';
import ExpandableSection from '../ui/ExpandableSection';

export default function HeadersTab({ headers }: { headers: EmailHeaderField[] }) {
  const flaggedCount = headers.filter((h) => h.flagged).length;

  return (
    <div className="space-y-5 animate-fadeUp">
      <Card
        eyebrow="Raw Message Metadata"
        title="Email Headers"
        icon={<ListTree size={16} />}
        action={
          <span className="font-mono text-xs text-signal-red">
            {flaggedCount} flagged of {headers.length}
          </span>
        }
      >
        <div className="space-y-2">
          {headers.map((h) => (
            <ExpandableSection
              key={h.name}
              title={h.name}
              subtitle={h.value.length > 60 ? h.value.slice(0, 60) + '…' : h.value}
              defaultOpen={h.flagged}
              leftAccessory={
                h.flagged ? (
                  <AlertCircle size={15} className="text-signal-red shrink-0" />
                ) : (
                  <CheckCircle2 size={15} className="text-signal-green shrink-0" />
                )
              }
            >
              <p className="font-mono text-xs text-base-200 break-all bg-base-950 rounded-md p-3 border border-base-700">
                {h.value}
              </p>
              {h.note && (
                <p className="mt-2 text-xs text-base-400">
                  <span className="text-signal-amber font-medium">Analyst note: </span>
                  {h.note}
                </p>
              )}
            </ExpandableSection>
          ))}
        </div>
      </Card>
    </div>
  );
}
