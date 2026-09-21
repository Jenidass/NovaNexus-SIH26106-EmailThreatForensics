interface ProgressBarProps {
  value: number; // 0-100
  colorClass?: string;
  trackClass?: string;
  height?: string;
}

export function ProgressBar({ value, colorClass = 'bg-[var(--nx-cyan)]', trackClass = 'bg-[var(--nx-border)]', height = 'h-1.5' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`w-full rounded-full overflow-hidden ${trackClass} ${height}`}>
      <div
        className={`${height} rounded-full transition-all duration-300 ease-out ${colorClass}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
