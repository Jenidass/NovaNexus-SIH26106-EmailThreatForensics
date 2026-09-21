import { LayoutGrid, Mail, Radar, Settings, ShieldHalf, Siren } from 'lucide-react';
import { NewInvestigationPage } from './components/investigation/NewInvestigationPage';
import './styles/theme.css';

const navItems = [
  { icon: LayoutGrid, label: 'Dashboard' },
  { icon: Mail, label: 'New Investigation', active: true },
  { icon: Radar, label: 'Threat Map' },
  { icon: Siren, label: 'Alerts' },
  { icon: Settings, label: 'Settings' },
];

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--nx-bg)] flex">
      <aside className="w-56 border-r border-[var(--nx-border)] bg-[var(--nx-bg-elevated)] flex flex-col flex-shrink-0">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="w-8 h-8 rounded-[var(--nx-radius-sm)] bg-[var(--nx-cyan)]/10 border border-[var(--nx-cyan)]/30 flex items-center justify-center">
            <ShieldHalf className="w-4 h-4 text-[var(--nx-cyan)]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--nx-text)] leading-tight">Nova Nexus</p>
            <p className="text-[10px] text-[var(--nx-text-faint)]">SIH26106</p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-[var(--nx-radius-sm)] text-sm cursor-pointer transition-colors
                ${item.active ? 'bg-[var(--nx-cyan)]/10 text-[var(--nx-cyan)] border border-[var(--nx-cyan)]/20' : 'text-[var(--nx-text-dim)] hover:bg-[var(--nx-surface-hover)] hover:text-[var(--nx-text)]'}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </div>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-[var(--nx-border)] text-[10px] text-[var(--nx-text-faint)]">
          AI-Powered Email Threat Detection,<br />GeoLocation & Forensic Intelligence
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto nx-scrollbar">
        <NewInvestigationPage />
      </main>
    </div>
  );
}
