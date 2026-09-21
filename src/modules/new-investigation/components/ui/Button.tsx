import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: ReactNode;
}

export function Button({ children, variant = 'primary', icon, className = '', ...rest }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-[var(--nx-radius-sm)] px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-[var(--nx-cyan)] text-[#04141a] hover:bg-[#3fdcf5]',
    secondary: 'bg-[var(--nx-surface-hover)] text-[var(--nx-text)] border border-[var(--nx-border-strong)] hover:border-[var(--nx-cyan)]/40',
    ghost: 'text-[var(--nx-text-dim)] hover:text-[var(--nx-text)] hover:bg-[var(--nx-surface-hover)]',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {icon}
      {children}
    </button>
  );
}
