import { useState, useId, type ReactNode } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: ReactNode;
  side?: 'top' | 'bottom';
}

export default function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        aria-describedby={id}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="inline-flex items-center justify-center text-base-400 hover:text-signal-teal transition-colors rounded-full"
      >
        {children ?? <Info size={14} strokeWidth={2} />}
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className={`absolute z-50 w-64 rounded-md border border-base-600 bg-base-850 px-3 py-2 text-xs leading-relaxed text-base-200 shadow-xl
            left-1/2 -translate-x-1/2 ${side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
            animate-fadeUp`}
        >
          {content}
        </span>
      )}
    </span>
  );
}
