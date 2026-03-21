import React, { useState } from 'react';
import { ArrowLeftRight, CheckCircle, XCircle, AlertTriangle, Search, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import SidePanel from '@/components/dashboard/SidePanel';

type MatchStatus = 'matched' | 'unmatched' | 'partial' | 'overpaid';

interface ReconciliationRecord {
  claimId: string;
  paymentId: string | null;
  patient: string;
  provider: string;
  claimedAmount: number;
  paidAmount: number;
  adjustments: number;
  status: MatchStatus;
  reason?: string;
}

// Sample reconciliation data
const reconciliationData: ReconciliationRecord[] = [
  { claimId: 'CLM-4821', paymentId: 'PMT-9341', patient: 'Robert Chen', provider: 'Valley Medical Group', claimedAmount: 3847.50, paidAmount: 3847.50, adjustments: 0, status: 'matched' },
  { claimId: 'CLM-4822', paymentId: 'PMT-9343', patient: 'Maria Gonzales', provider: 'Sunrise Health', claimedAmount: 12450.00, paidAmount: 0, adjustments: 12450.00, status: 'unmatched', reason: 'Claim denied — missing provider NPI (NM109) in Loop 2310B' },
  { claimId: 'CLM-4823', paymentId: null, patient: 'James Wilson', provider: 'Metro Clinic', claimedAmount: 890.25, paidAmount: 0, adjustments: 0, status: 'unmatched', reason: 'No matching 835 remittance found for this claim' },
  { claimId: 'CLM-4824', paymentId: 'PMT-9342', patient: 'Aisha Patel', provider: 'Lakewood Hospital', claimedAmount: 5670.00, paidAmount: 4500.00, adjustments: 1170.00, status: 'partial', reason: 'Contractual obligation adjustment (CO-45): $1,170.00 applied' },
  { claimId: 'CLM-4825', paymentId: 'PMT-9345', patient: 'David Thompson', provider: 'Valley Medical Group', claimedAmount: 2340.75, paidAmount: 1200.00, adjustments: 1140.75, status: 'partial', reason: 'Bundled procedure adjustment (CO-97): $1,140.75 applied' },
  { claimId: 'CLM-4826', paymentId: 'PMT-9344', patient: 'Lisa Nakamura', provider: 'Central Care Partners', claimedAmount: 7890.00, paidAmount: 7890.00, adjustments: 0, status: 'matched' },
  { claimId: 'CLM-4827', paymentId: null, patient: 'Marcus Brown', provider: 'Sunrise Health', claimedAmount: 1567.30, paidAmount: 0, adjustments: 0, status: 'unmatched', reason: 'Claim still pending — awaiting payer response' },
  { claimId: 'CLM-4828', paymentId: 'PMT-9346', patient: 'Elena Vasquez', provider: 'Metro Clinic', claimedAmount: 2100.00, paidAmount: 2350.00, adjustments: 0, status: 'overpaid', reason: 'Overpayment of $250.00 — interest penalty applied by payer' },
];

const statusConfig: Record<MatchStatus, { label: string; color: string; bg: string; chartColor: string }> = {
  matched: { label: 'Matched', color: 'text-success', bg: 'bg-success/10', chartColor: 'hsl(142, 71%, 45%)' },
  partial: { label: 'Partial', color: 'text-warning', bg: 'bg-warning/10', chartColor: 'hsl(38, 92%, 50%)' },
  unmatched: { label: 'Unmatched', color: 'text-destructive', bg: 'bg-destructive/10', chartColor: 'hsl(0, 84%, 60%)' },
  overpaid: { label: 'Overpaid', color: 'text-primary', bg: 'bg-primary/10', chartColor: 'hsl(200, 70%, 50%)' },
};

const statusIcon = (s: MatchStatus) => {
  if (s === 'matched') return <CheckCircle className="w-3.5 h-3.5 text-success" />;
  if (s === 'unmatched') return <XCircle className="w-3.5 h-3.5 text-destructive" />;
  if (s === 'partial') return <AlertTriangle className="w-3.5 h-3.5 text-warning" />;
  return <ArrowLeftRight className="w-3.5 h-3.5 text-primary" />;
};

const tooltipStyle = {
  contentStyle: {
    backgroundColor: 'hsl(224, 47%, 10%)',
    border: '1px solid hsl(217, 33%, 20%)',
    borderRadius: '8px',
    fontSize: '12px',
    color: 'hsl(210, 40%, 98%)',
  },
};

const ReconciliationPage: React.FC = () => {
  const [selected, setSelected] = useState<ReconciliationRecord | null>(null);
  const [filter, setFilter] = useState<MatchStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = reconciliationData.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.claimId.toLowerCase().includes(q) || r.patient.toLowerCase().includes(q) || r.provider.toLowerCase().includes(q);
    }
    return true;
  });

  const matched = reconciliationData.filter(r => r.status === 'matched').length;
  const partial = reconciliationData.filter(r => r.status === 'partial').length;
  const unmatched = reconciliationData.filter(r => r.status === 'unmatched').length;
  const overpaid = reconciliationData.filter(r => r.status === 'overpaid').length;

  const totalClaimed = reconciliationData.reduce((s, r) => s + r.claimedAmount, 0);
  const totalPaid = reconciliationData.reduce((s, r) => s + r.paidAmount, 0);
  const totalAdj = reconciliationData.reduce((s, r) => s + r.adjustments, 0);
  const variance = totalClaimed - totalPaid - totalAdj;

  // Chart data: per-record comparison
  const comparisonData = reconciliationData.map(r => ({
    name: r.claimId.replace('CLM-', ''),
    claimed: r.claimedAmount,
    paid: r.paidAmount,
    status: r.status,
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-primary" />
          835 ↔ 837 Reconciliation
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Match remittance payments against submitted claims to identify discrepancies</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in">
        {([
          { label: 'Matched', value: matched, status: 'matched' as MatchStatus },
          { label: 'Partial Pay', value: partial, status: 'partial' as MatchStatus },
          { label: 'Unmatched', value: unmatched, status: 'unmatched' as MatchStatus },
          { label: 'Overpaid', value: overpaid, status: 'overpaid' as MatchStatus },
        ]).map((card, i) => (
          <button
            key={card.status}
            onClick={() => setFilter(filter === card.status ? 'all' : card.status)}
            className={`rounded-xl border p-4 text-left transition-all active:scale-[0.97] animate-fade-in ${
              filter === card.status ? `${statusConfig[card.status].bg} border-current ${statusConfig[card.status].color}` : 'bg-card border-border hover:border-muted-foreground'
            }`}
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
          >
            <div className="flex items-center gap-2 mb-2">
              {statusIcon(card.status)}
              <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
            </div>
            <p className="text-xl font-semibold text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{card.value}</p>
          </button>
        ))}
      </div>

      {/* Financial summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
        {[
          { label: 'Total Claimed', value: totalClaimed },
          { label: 'Total Paid', value: totalPaid },
          { label: 'Adjustments', value: totalAdj },
          { label: 'Variance', value: variance },
        ].map(item => (
          <div key={item.label} className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
            <p className={`text-lg font-semibold ${item.label === 'Variance' && item.value > 0 ? 'text-warning' : 'text-foreground'}`}
              style={{ fontVariantNumeric: 'tabular-nums' }}>
              ${item.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </div>

      {/* Comparison chart */}
      <div className="bg-card rounded-xl border border-border shadow-sm shadow-black/10 p-5 animate-fade-in" style={{ animationDelay: '280ms', animationFillMode: 'backwards' }}>
        <h3 className="text-sm font-semibold text-foreground mb-4">Claimed vs Paid Comparison</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={comparisonData} barGap={1} barSize={16}>
            <XAxis dataKey="name" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} width={55}
              tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip {...tooltipStyle} formatter={(value: number) => `$${value.toLocaleString()}`} />
            <Bar dataKey="claimed" name="Claimed" fill="hsl(215, 20%, 35%)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="paid" name="Paid" radius={[3, 3, 0, 0]}>
              {comparisonData.map((entry, i) => (
                <Cell key={i} fill={statusConfig[entry.status].chartColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-5 mt-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'hsl(215, 20%, 35%)' }} /> Claimed
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'hsl(142, 71%, 45%)' }} /> Paid (color = status)
          </div>
        </div>
      </div>

      {/* Filters & search */}
      <div className="flex flex-col sm:flex-row gap-3 animate-fade-in" style={{ animationDelay: '340ms', animationFillMode: 'backwards' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by Claim ID, patient, or provider..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(['all', 'matched', 'partial', 'unmatched', 'overpaid'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors active:scale-95 ${
                filter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}>
              {f === 'all' ? 'All' : statusConfig[f].label}
            </button>
          ))}
        </div>
      </div>

      {/* Reconciliation table */}
      <div className="bg-card rounded-xl border border-border shadow-sm shadow-black/10 overflow-hidden animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Claim ID</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Payment ID</th>
                <th className="text-left px-5 py-3 font-medium">Patient</th>
                <th className="text-right px-5 py-3 font-medium">Claimed</th>
                <th className="text-right px-5 py-3 font-medium">Paid</th>
                <th className="text-right px-5 py-3 font-medium hidden sm:table-cell">Δ Variance</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">No records match your filter criteria.</td></tr>
              ) : filtered.map((r, i) => {
                const diff = r.claimedAmount - r.paidAmount;
                return (
                  <tr key={r.claimId} onClick={() => setSelected(r)}
                    className="border-b border-border/50 last:border-0 hover:bg-accent/50 cursor-pointer transition-colors animate-fade-in"
                    style={{ animationDelay: `${440 + i * 35}ms`, animationFillMode: 'backwards' }}>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[r.status].bg} ${statusConfig[r.status].color}`}>
                        {statusIcon(r.status)} {statusConfig[r.status].label}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-foreground">{r.claimId}</td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell">{r.paymentId ?? '—'}</td>
                    <td className="px-5 py-3 text-foreground">{r.patient}</td>
                    <td className="px-5 py-3 text-right text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      ${r.claimedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`px-5 py-3 text-right font-medium ${statusConfig[r.status].color}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                      ${r.paidAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`px-5 py-3 text-right hidden sm:table-cell ${diff > 0 ? 'text-warning' : diff < 0 ? 'text-primary' : 'text-muted-foreground'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {diff === 0 ? '—' : `${diff > 0 ? '+' : '-'}$${Math.abs(diff).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail side panel */}
      {selected && (
        <SidePanel title={`Reconciliation: ${selected.claimId}`} onClose={() => setSelected(null)}>
          <div className="space-y-5 text-sm">
            {/* Visual comparison */}
            <div>
              <h4 className="text-xs text-muted-foreground font-medium mb-3">Amount Comparison</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Claimed</span>
                    <span className="text-foreground font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      ${selected.claimedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-muted-foreground/40 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Paid</span>
                    <span className={`font-medium ${statusConfig[selected.status].color}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                      ${selected.paidAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full rounded-full`}
                      style={{
                        width: `${selected.claimedAmount > 0 ? Math.min((selected.paidAmount / selected.claimedAmount) * 100, 100) : 0}%`,
                        backgroundColor: statusConfig[selected.status].chartColor,
                      }} />
                  </div>
                </div>
                {selected.adjustments > 0 && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Adjustments</span>
                      <span className="text-destructive font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        -${selected.adjustments.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-destructive rounded-full"
                        style={{ width: `${(selected.adjustments / selected.claimedAmount) * 100}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-muted-foreground text-xs">Patient</span><p className="text-foreground font-medium">{selected.patient}</p></div>
              <div><span className="text-muted-foreground text-xs">Provider</span><p className="text-foreground font-medium">{selected.provider}</p></div>
              <div><span className="text-muted-foreground text-xs">Claim ID</span><p className="text-foreground font-mono text-xs">{selected.claimId}</p></div>
              <div><span className="text-muted-foreground text-xs">Payment ID</span><p className="text-foreground font-mono text-xs">{selected.paymentId ?? 'N/A'}</p></div>
              <div className="col-span-2">
                <span className="text-muted-foreground text-xs">Status</span>
                <p className={`font-medium flex items-center gap-1.5 ${statusConfig[selected.status].color}`}>
                  {statusIcon(selected.status)} {statusConfig[selected.status].label}
                </p>
              </div>
            </div>

            {/* Reason / AI insight */}
            {selected.reason && (
              <div>
                <h4 className="text-xs text-muted-foreground font-medium mb-2">AI Analysis</h4>
                <div className="bg-secondary rounded-lg p-3 text-xs text-muted-foreground leading-relaxed">
                  {selected.reason}
                </div>
              </div>
            )}

            {/* Variance summary */}
            <div className="bg-secondary/50 rounded-lg p-3 border border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Net Variance</span>
                <span className={`font-semibold text-sm ${
                  selected.claimedAmount - selected.paidAmount === 0 ? 'text-success' :
                  selected.claimedAmount - selected.paidAmount > 0 ? 'text-warning' : 'text-primary'
                }`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {selected.claimedAmount - selected.paidAmount === 0
                    ? 'Fully reconciled'
                    : `${selected.claimedAmount - selected.paidAmount > 0 ? '+' : '-'}$${Math.abs(selected.claimedAmount - selected.paidAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                  }
                </span>
              </div>
            </div>
          </div>
        </SidePanel>
      )}
    </div>
  );
};

export default ReconciliationPage;
