import { useRef, type ReactNode, type KeyboardEvent } from 'react';

export interface TabDef {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
}

interface TabsProps {
  tabs: TabDef[];
  activeId: string;
  onChange: (id: string) => void;
}

export default function Tabs({ tabs, activeId, onChange }: TabsProps) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (e.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (e.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (nextIndex !== null) {
      e.preventDefault();
      const nextTab = tabs[nextIndex];
      onChange(nextTab.id);
      refs.current[nextTab.id]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Investigation sections"
      className="flex gap-1 overflow-x-auto no-scrollbar border-b border-base-700 px-1 sm:px-0"
    >
      {tabs.map((tab, index) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[tab.id] = el;
            }}
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`relative flex shrink-0 items-center gap-2 px-3.5 py-3 text-sm font-medium whitespace-nowrap transition-colors
              ${active ? 'text-signal-teal' : 'text-base-400 hover:text-base-200'}`}
          >
            {tab.icon}
            {tab.label}
            {tab.badge}
            {active && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-signal-teal shadow-glow" />
            )}
          </button>
        );
      })}
    </div>
  );
}
