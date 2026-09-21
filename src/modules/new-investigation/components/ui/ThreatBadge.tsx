import { ShieldAlert, ShieldX, ShieldQuestion, ShieldCheck, Shield } from 'lucide-react';
import type { ThreatLevel } from '../../types/investigation';

const config: Record<ThreatLevel, { color: string; bg: string; border: string; label: string; icon: typeof Shield }> = {
  critical: { color: 'text-[var(--nx-critical)]', bg: 'bg-[var(--nx-critical)]/10', border: 'border-[var(--nx-critical)]/30', label: 'Critical', icon: ShieldX },
  high: { color: 'text-[var(--nx-high)]', bg: 'bg-[var(--nx-high)]/10', border: 'border-[var(--nx-high)]/30', label: 'High', icon: ShieldAlert },
  medium: { color: 'text-[var(--nx-medium)]', bg: 'bg-[var(--nx-medium)]/10', border: 'border-[var(--nx-medium)]/30', label: 'Medium', icon: ShieldQuestion },
  low: { color: 'text-[var(--nx-low)]', bg: 'bg-[var(--nx-low)]/10', border: 'border-[var(--nx-low)]/30', label: 'Low', icon: Shield },
  clean: { color: 'text-[var(--nx-clean)]', bg: 'bg-[var(--nx-clean)]/10', border: 'border-[var(--nx-clean)]/30', label: 'Clean', icon: ShieldCheck },
};

export function ThreatBadge({ level, size = 'md' }: { level: ThreatLevel; size?: 'sm' | 'md' }) {
  const c = config[level];
  const Icon = c.icon;
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${c.color} ${c.bg} ${c.border} ${pad}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {c.label}
    </span>
  );
}

export const threatLevelColor = (level: ThreatLevel) => config[level].color;
