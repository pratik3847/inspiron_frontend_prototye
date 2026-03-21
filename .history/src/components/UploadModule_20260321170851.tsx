import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, CheckCircle, X, Archive, FileWarning, FolderOpen } from 'lucide-react';
import { mockUploadFiles } from '@/lib/mockData';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: '837' | '835' | '834' | 'unknown';
  progress: number;
  status: 'uploading' | 'processing' | 'parsed' | 'error';
  isZip: boolean;
  children?: { name: string; type: '837' | '835' | '834' | 'unknown' }[];
  segments?: number;
  loops?: number;
  errorMsg?: string;
}

const detectType = (name: string): '837' | '835' | '834' | 'unknown' => {
  const lower = name.toLowerCase();
  if (lower.includes('837')) return '837';
  if (lower.includes('835')) return '835';
  if (lower.includes('834')) return '834';
  // Try extension-based detection
  if (lower.endsWith('.edi') || lower.endsWith('.x12')) return '837';
  return 'unknown';
};

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

let fileIdCounter = 0;

const UploadModule: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>(mockUploadFiles);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = useCallback((name: string, size: number) => {
    const id = `file-${++fileIdCounter}`;
    const isZip = name.toLowerCase().endsWith('.zip');
    const file: UploadedFile = {
      id, name, size,
      type: isZip ? 'unknown' : detectType(name),
      progress: 0,
      status: 'uploading',
      isZip,
    };
    setFiles(prev => [...prev, file]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: 100, status: 'processing' } : f));

        // Simulate processing / parsing
        setTimeout(() => {
          setFiles(prev => prev.map(f => {
            if (f.id !== id) return f;
            if (isZip) {
              return {
                ...f, status: 'parsed',
                type: '837',
                children: [
                  { name: `${name.replace('.zip', '')}_claim_01.edi`, type: '837' as const },
                  { name: `${name.replace('.zip', '')}_claim_02.edi`, type: '837' as const },
                  { name: `${name.replace('.zip', '')}_remit_01.edi`, type: '835' as const },
                ],
                segments: 847,
                loops: 124,
              };
            }
            // Simulate random success/error
            if (Math.random() > 0.85) {
              return { ...f, status: 'error' as const, errorMsg: 'Invalid ISA segment: unexpected delimiter at position 106' };
            }
            return {
              ...f, status: 'parsed',
              segments: Math.floor(Math.random() * 400) + 100,
              loops: Math.floor(Math.random() * 60) + 20,
            };
          }));
        }, 1200);
      } else {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, progress } : f));
      }
    }, 150);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    Array.from(e.dataTransfer.files).forEach(f => simulateUpload(f.name, f.size));
  }, [simulateUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(f => simulateUpload(f.name, f.size));
    }
  }, [simulateUpload]);

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  const statusIcon = (f: UploadedFile) => {
    if (f.status === 'parsed') return <CheckCircle className="w-4 h-4 text-success" />;
    if (f.status === 'error') return <FileWarning className="w-4 h-4 text-destructive" />;
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hidden file input */}
      <input ref={inputRef} type="file" className="hidden" multiple accept=".edi,.x12,.zip,.txt"
        onChange={handleFileSelect} />

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
          dragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border hover:border-muted-foreground'
        }`}
      >
        <Upload className={`w-10 h-10 mx-auto mb-3 transition-colors ${dragging ? 'text-primary' : 'text-muted-foreground'}`} />
        <p className="text-foreground font-medium mb-1">Drop EDI files here or click to browse</p>
        <p className="text-sm text-muted-foreground mb-3">Supports .edi, .x12, .txt, and .zip batch uploads</p>
        <div className="flex justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary text-xs text-muted-foreground">
            <FileText className="w-3 h-3" /> .edi / .x12
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary text-xs text-muted-foreground">
            <Archive className="w-3 h-3" /> .zip batch
          </span>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Uploaded Files ({files.length})</h3>
            <button onClick={() => setFiles([])} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Clear all
            </button>
          </div>

          {files.map(f => (
            <div key={f.id} className={`bg-card rounded-xl border ${f.status === 'error' ? 'border-destructive/30' : 'border-border'} p-4 animate-fade-in`}>
              <div className="flex items-start gap-3">
                {f.isZip ? <Archive className="w-8 h-8 text-warning shrink-0 mt-0.5" /> : <FileText className="w-8 h-8 text-muted-foreground shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-sm text-foreground font-medium truncate">{f.name}</p>
                      {statusIcon(f)}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-xs text-muted-foreground">{formatSize(f.size)}</span>
                      {f.type !== 'unknown' && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{f.type}</span>
                      )}
                      <button onClick={() => removeFile(f.id)} className="text-muted-foreground hover:text-foreground transition-colors active:scale-95">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {(f.status === 'uploading' || f.status === 'processing') && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${f.status === 'processing' ? 'bg-warning animate-pulse-soft' : 'bg-primary'}`}
                          style={{ width: `${f.progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-24 text-right">
                        {f.status === 'processing' ? 'Parsing EDI...' : `${Math.round(f.progress)}%`}
                      </span>
                    </div>
                  )}

                  {/* Parsed metadata */}
                  {f.status === 'parsed' && (
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {f.segments !== undefined && (
                        <span className="inline-flex items-center gap-1">
                          <span className="text-foreground font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>{f.segments}</span> segments
                        </span>
                      )}
                      {f.loops !== undefined && (
                        <span className="inline-flex items-center gap-1">
                          <span className="text-foreground font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>{f.loops}</span> loops
                        </span>
                      )}
                      <span className="text-success">✓ Parsed successfully</span>
                    </div>
                  )}

                  {/* Error state */}
                  {f.status === 'error' && f.errorMsg && (
                    <div className="mt-2 p-2 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                      {f.errorMsg}
                    </div>
                  )}

                  {/* ZIP children */}
                  {f.status === 'parsed' && f.children && f.children.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <FolderOpen className="w-3 h-3" /> Extracted {f.children.length} files:
                      </p>
                      {f.children.map((child, ci) => (
                        <div key={ci} className="flex items-center gap-2 pl-3 py-1 text-xs">
                          <FileText className="w-3 h-3 text-muted-foreground" />
                          <span className="text-foreground truncate">{child.name}</span>
                          <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">{child.type}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No EDI files uploaded yet
        </div>
      )}
    </div>
  );
};

export default UploadModule;
