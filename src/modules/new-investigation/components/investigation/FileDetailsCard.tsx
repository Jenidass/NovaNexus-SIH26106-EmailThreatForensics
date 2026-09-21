import { FileText, X } from 'lucide-react';
import type { UploadedFile } from '../../types/investigation';

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

interface FileDetailsCardProps {
  file: UploadedFile;
  onRemove: () => void;
}

export function FileDetailsCard({ file, onRemove }: FileDetailsCardProps) {
  const rows = [
    { label: 'File name', value: file.name },
    { label: 'File size', value: formatSize(file.size) },
    { label: 'MIME type', value: file.type },
    { label: 'Last modified', value: new Date(file.lastModified).toLocaleString() },
  ];

  return (
    <div className="rounded-[var(--nx-radius)] border border-[var(--nx-border)] bg-[var(--nx-bg-elevated)] p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[var(--nx-radius-sm)] bg-[var(--nx-cyan)]/10 border border-[var(--nx-cyan)]/30 flex items-center justify-center">
            <FileText className="w-5 h-5 text-[var(--nx-cyan)]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--nx-text)]">{file.name}</p>
            <p className="text-xs text-[var(--nx-text-faint)]">{formatSize(file.size)} · ready for analysis</p>
          </div>
        </div>
        <button onClick={onRemove} className="text-[var(--nx-text-faint)] hover:text-[var(--nx-critical)] transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 pt-4 border-t border-[var(--nx-border)]">
        {rows.map((r) => (
          <div key={r.label}>
            <p className="text-[10px] uppercase tracking-wide text-[var(--nx-text-faint)]">{r.label}</p>
            <p className="text-xs text-[var(--nx-text)] mt-0.5 truncate nx-mono">{r.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
