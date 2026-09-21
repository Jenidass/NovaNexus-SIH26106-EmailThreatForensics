import { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

interface AnalysisLogProps {
  lines: string[];
}

export function AnalysisLog({ lines }: AnalysisLogProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines.length]);

  return (
    <div className="rounded-[var(--nx-radius)] border border-[var(--nx-border)] bg-[#070a11] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--nx-border)] bg-[var(--nx-bg-elevated)]">
        <Terminal className="w-3.5 h-3.5 text-[var(--nx-cyan)]" />
        <span className="text-xs font-medium text-[var(--nx-text-dim)]">analysis.log</span>
        <span className="ml-auto w-2 h-2 rounded-full bg-[var(--nx-clean)] nx-pulse" />
      </div>
      <div className="p-4 h-40 overflow-y-auto nx-scrollbar nx-mono text-[11px] leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className="text-[var(--nx-text-dim)]">
            <span className="text-[var(--nx-text-faint)]">[{String(i).padStart(3, '0')}]</span> {line}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}
