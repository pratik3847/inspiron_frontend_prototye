import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, ChevronDown } from 'lucide-react';
import { validationResults } from '@/lib/mockData';

const icons = {
  error: <XCircle className="w-4 h-4 text-destructive shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-warning shrink-0" />,
  pass: <CheckCircle className="w-4 h-4 text-success shrink-0" />,
};

const ValidationPanel: React.FC = () => {
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const errors = validationResults.filter(v => v.type === 'error');
  const warnings = validationResults.filter(v => v.type === 'warning');
  const passes = validationResults.filter(v => v.type === 'pass');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-semibold text-destructive" style={{ fontVariantNumeric: 'tabular-nums' }}>{errors.length}</p>
          <p className="text-xs text-destructive/80 mt-1">Errors</p>
        </div>
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-semibold text-warning" style={{ fontVariantNumeric: 'tabular-nums' }}>{warnings.length}</p>
          <p className="text-xs text-warning/80 mt-1">Warnings</p>
        </div>
        <div className="bg-success/10 border border-success/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-semibold text-success" style={{ fontVariantNumeric: 'tabular-nums' }}>{passes.length}</p>
          <p className="text-xs text-success/80 mt-1">Passed</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm shadow-black/10 overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Validation Results</h3>
        </div>
        <div className="divide-y divide-border/50">
          {validationResults.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-muted-foreground">No validation results yet. Upload an EDI file to validate.</div>
          ) : validationResults.map(v => (
            <div key={v.code}>
              <button
                onClick={() => setExpanded(expanded === v.code ? null : v.code)}
                className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-accent/50 transition-colors"
              >
                {icons[v.type]}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{v.code}</span>
                    <span className="text-sm text-foreground">{v.message}</span>
                  </div>
                </div>
                {v.line && <span className="text-xs text-muted-foreground">Line {v.line}</span>}
                {(v.suggestion || v.line) && (
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expanded === v.code ? 'rotate-180' : ''}`} />
                )}
              </button>
              {expanded === v.code && v.suggestion && (
                <div className="px-5 pb-3 pl-12">
                  <div className="bg-secondary rounded-lg p-3 text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">Suggested fix: </span>{v.suggestion}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValidationPanel;
