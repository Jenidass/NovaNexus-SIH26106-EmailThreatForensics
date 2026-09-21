import { Globe2, MapPin, ServerCrash } from 'lucide-react';
import type { NetworkInfo } from '../../types/investigation';
import { Card, CardBody, CardHeader } from '../ui/Card';

export function NetworkInfoCard({ network }: { network: NetworkInfo }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-[var(--nx-cyan)]" />
          <h3 className="text-sm font-semibold text-[var(--nx-text)]">IP & Geolocation</h3>
        </div>
        {network.blacklisted && (
          <span className="flex items-center gap-1 text-[11px] text-[var(--nx-critical)]"><ServerCrash className="w-3.5 h-3.5" /> Blacklisted</span>
        )}
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[var(--nx-radius-sm)] bg-[var(--nx-cyan)]/10 border border-[var(--nx-cyan)]/30 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-[var(--nx-cyan)]" />
          </div>
          <div>
            <p className="text-sm text-[var(--nx-text)] nx-mono">{network.ip}</p>
            <p className="text-xs text-[var(--nx-text-dim)]">{network.city}, {network.country}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-3 border-t border-[var(--nx-border)]">
          <Field label="ISP" value={network.isp} />
          <Field label="ASN" value={network.asn} mono />
          <Field label="Coordinates" value={`${network.latitude.toFixed(2)}, ${network.longitude.toFixed(2)}`} mono />
          <Field label="VPN / Proxy" value={network.vpnOrProxy ? 'Detected' : 'Not detected'} />
        </div>
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
