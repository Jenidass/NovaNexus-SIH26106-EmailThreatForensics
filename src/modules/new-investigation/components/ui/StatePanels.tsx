import type { ReactNode } from 'react';
import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({ icon, title, description }: { icon?: ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="w-12 h-12 rounded-full bg-[var(--nx-surface-hover)] border border-[var(--nx-border)] flex items-center justify-center mb-4 text-[var(--nx-text-faint)]">
        {icon ?? <Inbox className="w-5 h-5" />}
      </div>
      <h3 className="text-sm font-medium text-[var(--nx-text)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--nx-text-dim)] max-w-sm">{description}</p>
    </div>
  );
}

export function ErrorPanel({ title, description, onRetry }: { title: string; description: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="w-12 h-12 rounded-full bg-[var(--nx-critical)]/10 border border-[var(--nx-critical)]/30 flex items-center justify-center mb-4 text-[var(--nx-critical)]">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-medium text-[var(--nx-text)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--nx-text-dim)] max-w-sm mb-5">{description}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-[var(--nx-text-dim)]">
      <Loader2 className="w-4 h-4 animate-spin text-[var(--nx-cyan)]" />
      {label}
    </div>
  );
}
