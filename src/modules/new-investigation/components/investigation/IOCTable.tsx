import { ListTree } from 'lucide-react';
import type { IOC } from '../../types/investigation';
import { iocTypeLabel } from '../../data/mockInvestigation';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { EmptyState } from '../ui/StatePanels';

export function IOCTable({ iocs }: { iocs: IOC[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ListTree className="w-4 h-4 text-[var(--nx-cyan)]" />
          <h3 className="text-sm font-semibold text-[var(--nx-text)]">Indicators of Compromise</h3>
        </div>
        <span className="text-[11px] text-[var(--nx-text-faint)]">{iocs.length} found</span>
      </CardHeader>
      <CardBody className="p-0">
        {iocs.length === 0 ? (
          <div className="px-5 py-2">
            <EmptyState icon={<ListTree className="w-5 h-5" />} title="No IOCs extracted" description="This message did not yield any indicators of compromise." />
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] uppercase tracking-wide text-[var(--nx-text-faint)] border-b border-[var(--nx-border)]">
                <th className="text-left font-medium px-5 py-2.5">Type</th>
                <th className="text-left font-medium px-5 py-2.5">Value</th>
                <th className="text-left font-medium px-5 py-2.5">Confidence</th>
                <th className="text-left font-medium px-5 py-2.5">Source</th>
                <th className="text-left font-medium px-5 py-2.5">First seen</th>
              </tr>
            </thead>
            <tbody>
              {iocs.map((ioc) => (
                <tr key={ioc.id} className="border-b border-[var(--nx-border)] last:border-0 hover:bg-[var(--nx-surface-hover)]">
                  <td className="px-5 py-2.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--nx-border-strong)] text-[var(--nx-text-dim)]">
                      {iocTypeLabel[ioc.type]}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 nx-mono text-[var(--nx-text)]">{ioc.value}</td>
                  <td className="px-5 py-2.5 text-[var(--nx-text-dim)]">{ioc.confidence}%</td>
                  <td className="px-5 py-2.5 text-[var(--nx-text-dim)]">{ioc.source}</td>
                  <td className="px-5 py-2.5 text-[var(--nx-text-faint)]">{ioc.firstSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardBody>
    </Card>
  );
}
