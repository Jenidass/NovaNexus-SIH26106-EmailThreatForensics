import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  tone?: 'teal' | 'amber' | 'red' | 'green' | 'neutral' | 'orange';
  className?: string;
}

const toneClasses: Record<NonNullable<BadgeProps['tone']>, string> = {
  teal: 'bg-signal-teal/10 text-signal-teal border-signal-teal/30',
  amber: 'bg-signal-amber/10 text-signal-amber border-signal-amber/30',
  orange: 'bg-orange-400/10 text-orange-400 border-orange-400/30',
  red: 'bg-signal-red/10 text-signal-red border-signal-red/30',
  green: 'bg-signal-green/10 text-signal-green border-signal-green/30',
  neutral: 'bg-base-700/60 text-base-200 border-base-600',
};

export default function Badge({ children, tone = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide font-mono ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
