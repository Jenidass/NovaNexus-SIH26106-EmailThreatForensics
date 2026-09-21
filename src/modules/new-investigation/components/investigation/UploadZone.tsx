import { useCallback, useRef, useState } from 'react';
import { UploadCloud, FileWarning } from 'lucide-react';
import type { UploadedFile } from '../../types/investigation';

const ACCEPTED_EXT = ['.eml', '.msg', '.txt'];
const MAX_SIZE_MB = 25;

interface UploadZoneProps {
  onFileAccepted: (file: UploadedFile) => void;
}

function validate(file: File): string | null {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ACCEPTED_EXT.includes(ext)) {
    return `Unsupported file type "${ext}". Accepted formats: ${ACCEPTED_EXT.join(', ')}`;
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `File exceeds the ${MAX_SIZE_MB}MB limit.`;
  }
  return null;
}

export function UploadZone({ onFileAccepted }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const err = validate(file);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    onFileAccepted({
      id: `file-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type || 'message/rfc822',
      lastModified: file.lastModified,
      file,
    });
  }, [onFileAccepted]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-[var(--nx-radius)] border-2 border-dashed p-10 text-center transition-colors
          ${dragging ? 'border-[var(--nx-cyan)] bg-[var(--nx-cyan)]/5' : 'border-[var(--nx-border-strong)] hover:border-[var(--nx-cyan)]/40'}`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={ACCEPTED_EXT.join(',')}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
        />
        <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 border
          ${dragging ? 'border-[var(--nx-cyan)] bg-[var(--nx-cyan)]/10' : 'border-[var(--nx-border)] bg-[var(--nx-surface-hover)]'}`}>
          <UploadCloud className={`w-6 h-6 ${dragging ? 'text-[var(--nx-cyan)]' : 'text-[var(--nx-text-dim)]'}`} />
        </div>
        <p className="text-sm font-medium text-[var(--nx-text)]">
          Drag and drop an email file, or <span className="text-[var(--nx-cyan)]">browse</span>
        </p>
        <p className="text-xs text-[var(--nx-text-faint)] mt-1.5">
          Supports {ACCEPTED_EXT.join(', ')} · Max {MAX_SIZE_MB}MB
        </p>
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-[var(--nx-radius-sm)] border border-[var(--nx-critical)]/30 bg-[var(--nx-critical)]/10 px-3 py-2.5 text-xs text-[var(--nx-critical)]">
          <FileWarning className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
