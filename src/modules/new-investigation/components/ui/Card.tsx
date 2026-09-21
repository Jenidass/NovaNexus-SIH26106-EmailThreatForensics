import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className = '', glow = false }: CardProps) {
  return (
    <div
      className={`bg-[var(--nx-surface)] border border-[var(--nx-border)] rounded-[var(--nx-radius)]
        ${glow ? 'shadow-[0_0_0_1px_rgba(34,211,238,0.15),0_8px_24px_-8px_rgba(34,211,238,0.25)]' : ''}
        ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardProps) {
  return (
    <div className={`px-5 py-4 border-b border-[var(--nx-border)] flex items-center justify-between gap-3 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }: CardProps) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
}
