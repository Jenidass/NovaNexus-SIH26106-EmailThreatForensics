import type { Severity, SignalStatus } from '../types/investigation';

export type SignalColor = 'teal' | 'amber' | 'orange' | 'red' | 'green';

interface SeverityStyle {
  label: string;
  text: string;
  bg: string;
  border: string;
  ring: string;
  dot: string;
  glow: string;
}

// GREEN = safe, YELLOW/amber = suspicious, ORANGE = high, RED = critical
export const severityStyles: Record<Severity, SeverityStyle> = {
  SAFE: {
    label: 'Safe',
    text: 'text-signal-green',
    bg: 'bg-signal-green/10',
    border: 'border-signal-green/40',
    ring: 'ring-signal-green/30',
    dot: 'bg-signal-green',
    glow: 'shadow-[0_0_40px_-8px_rgba(63,201,138,0.45)]',
  },
  SUSPICIOUS: {
    label: 'Suspicious',
    text: 'text-signal-amber',
    bg: 'bg-signal-amber/10',
    border: 'border-signal-amber/40',
    ring: 'ring-signal-amber/30',
    dot: 'bg-signal-amber',
    glow: 'shadow-[0_0_40px_-8px_rgba(245,166,35,0.45)]',
  },
  HIGH: {
    label: 'High',
    text: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/40',
    ring: 'ring-orange-400/30',
    dot: 'bg-orange-400',
    glow: 'shadow-[0_0_40px_-8px_rgba(251,146,60,0.5)]',
  },
  CRITICAL: {
    label: 'Critical',
    text: 'text-signal-red',
    bg: 'bg-signal-red/10',
    border: 'border-signal-red/40',
    ring: 'ring-signal-red/30',
    dot: 'bg-signal-red',
    glow: 'shadow-glowRed',
  },
};

export function scoreToSeverity(score: number): Severity {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 35) return 'SUSPICIOUS';
  return 'SAFE';
}

export function riskColorToClasses(color: 'teal' | 'amber' | 'red' | 'green') {
  const map = {
    teal: { bar: 'bg-signal-teal', text: 'text-signal-teal' },
    amber: { bar: 'bg-signal-amber', text: 'text-signal-amber' },
    red: { bar: 'bg-signal-red', text: 'text-signal-red' },
    green: { bar: 'bg-signal-green', text: 'text-signal-green' },
  } as const;
  return map[color];
}

export const signalStatusStyles: Record<SignalStatus, { text: string; bg: string; border: string; label: string }> = {
  PASS: { text: 'text-signal-green', bg: 'bg-signal-green/10', border: 'border-signal-green/30', label: 'Pass' },
  WARN: { text: 'text-signal-amber', bg: 'bg-signal-amber/10', border: 'border-signal-amber/30', label: 'Warning' },
  FAIL: { text: 'text-signal-red', bg: 'bg-signal-red/10', border: 'border-signal-red/30', label: 'Failed' },
};
