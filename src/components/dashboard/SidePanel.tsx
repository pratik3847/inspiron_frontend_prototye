import React from 'react';
import { X } from 'lucide-react';

interface SidePanelProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const SidePanel: React.FC<SidePanelProps> = ({ title, onClose, children }) => (
  <div className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border shadow-2xl shadow-black/40 z-50 animate-slide-in-right">
    <div className="flex items-center justify-between px-5 py-4 border-b border-border">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <button onClick={onClose} className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors active:scale-95">
        <X className="w-4 h-4" />
      </button>
    </div>
    <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 57px)' }}>
      {children}
    </div>
  </div>
);

export default SidePanel;
