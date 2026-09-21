import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface ExpandableSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  leftAccessory?: ReactNode;
  rightAccessory?: ReactNode;
}

export default function ExpandableSection({
  title,
  subtitle,
  children,
  defaultOpen = false,
  leftAccessory,
  rightAccessory,
}: ExpandableSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border border-base-700 bg-base-800/50 overflow-hidden transition-colors hover:border-base-600">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          {leftAccessory}
          <div className="min-w-0">
            <p className="text-sm font-medium text-base-100 truncate">{title}</p>
            {subtitle && <p className="text-xs text-base-400 truncate mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {rightAccessory}
          <ChevronDown
            size={16}
            className={`text-base-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      <div
        className={`grid transition-all duration-200 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-0 border-t border-base-700/70 text-sm text-base-300 leading-relaxed">
            <div className="pt-3">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
