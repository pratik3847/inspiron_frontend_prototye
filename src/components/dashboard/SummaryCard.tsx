import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  change?: string;
  variant?: 'default' | 'success' | 'destructive' | 'warning';
  icon?: React.ReactNode;
  delay?: number;
}

const variantStyles = {
  default: 'border-border',
  success: 'border-success/20',
  destructive: 'border-destructive/20',
  warning: 'border-warning/20',
};

const dotStyles = {
  default: 'bg-muted-foreground',
  success: 'bg-success',
  destructive: 'bg-destructive',
  warning: 'bg-warning',
};

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, change, variant = 'default', icon, delay = 0 }) => (
  <div
    className={`bg-card rounded-xl border ${variantStyles[variant]} p-5 shadow-sm shadow-black/10 animate-fade-in`}
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${dotStyles[variant]}`} />
        <span className="text-sm text-muted-foreground font-medium">{title}</span>
      </div>
      {icon && <span className="text-muted-foreground">{icon}</span>}
    </div>
    <div className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
      {value}
    </div>
    {change && (
      <p className="text-xs text-muted-foreground mt-1">{change}</p>
    )}
  </div>
);

export default SummaryCard;
