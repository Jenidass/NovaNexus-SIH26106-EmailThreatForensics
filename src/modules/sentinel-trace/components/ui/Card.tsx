import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  eyebrow?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function Card({ children, className = '', title, eyebrow, icon, action }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-base-700 bg-base-850/80 backdrop-blur-sm p-5 sm:p-6 ${className}`}
    >
      {(title || eyebrow) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {icon && <span className="text-signal-teal">{icon}</span>}
            <div>
              {eyebrow && (
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-base-400 mb-0.5">
                  {eyebrow}
                </p>
              )}
              {title && <h3 className="text-sm font-semibold text-base-100">{title}</h3>}
            </div>
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
