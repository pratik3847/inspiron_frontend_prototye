import React, { useState } from 'react';
import SummaryCard from './SummaryCard';
import SidePanel from './SidePanel';
import { PaymentBreakdownChart, PaymentStatusPieChart } from './Charts';
import { payments835, paymentBreakdownData, paymentStatusSummary, type Payment835 } from '@/lib/mockData';
import { DollarSign, TrendingUp, XCircle, BarChart3 } from 'lucide-react';

const statusColors = {
  paid: 'bg-success/10 text-success',
  denied: 'bg-destructive/10 text-destructive',
  partial: 'bg-warning/10 text-warning',
};

const Remittance835Dashboard: React.FC = () => {
  const [selected, setSelected] = useState<Payment835 | null>(null);

  const { paid, denied, partial } = paymentStatusSummary;
  const totalPayments = paid + denied + partial;
  const paidTotal = paymentBreakdownData.reduce((s, p) => s + p.paid, 0);
  const deniedTotal = paymentBreakdownData.reduce((s, p) => s + p.adjustments, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total Payments" value={totalPayments.toLocaleString()} icon={<BarChart3 className="w-4 h-4" />} delay={0} />
        <SummaryCard title="Paid Amount" value={`$${(paidTotal / 1000).toFixed(0)}k`} variant="success" icon={<TrendingUp className="w-4 h-4" />} delay={60} />
        <SummaryCard title="Adjustments" value={`$${(deniedTotal / 1000).toFixed(0)}k`} variant="destructive" icon={<XCircle className="w-4 h-4" />} delay={120} />
        <SummaryCard title="Denied" value={denied.toLocaleString()} variant="warning" icon={<DollarSign className="w-4 h-4" />} delay={180} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PaymentBreakdownChart data={paymentBreakdownData} />
        <PaymentStatusPieChart paid={paid} denied={denied} partial={partial} />
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm shadow-black/10 overflow-hidden animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}>
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Payment Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">Payment ID</th>
                <th className="text-left px-5 py-3 font-medium">Claim Ref</th>
                <th className="text-right px-5 py-3 font-medium">Paid</th>
                <th className="text-right px-5 py-3 font-medium hidden sm:table-cell">Adjustments</th>
                <th className="text-center px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments835.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-muted-foreground">No individual payments uploaded yet. Upload an 835 EDI file to populate this table.</td></tr>
              ) : payments835.map((p, i) => (
                <tr key={p.id} onClick={() => setSelected(p)}
                  className="border-b border-border/50 last:border-0 hover:bg-accent/50 cursor-pointer transition-colors animate-fade-in"
                  style={{ animationDelay: `${350 + i * 40}ms`, animationFillMode: 'backwards' }}>
                  <td className="px-5 py-3 font-mono text-xs text-foreground">{p.id}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{p.claimRef}</td>
                  <td className="px-5 py-3 text-right text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    ${p.paidAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3 text-right text-muted-foreground hidden sm:table-cell" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    ${p.adjustments.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status]}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <SidePanel title={`Payment ${selected.id}`} onClose={() => setSelected(null)}>
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-muted-foreground">Claim Ref</span><p className="text-foreground font-mono text-xs">{selected.claimRef}</p></div>
              <div><span className="text-muted-foreground">Status</span><p className={`font-medium ${selected.status === 'paid' ? 'text-success' : selected.status === 'denied' ? 'text-destructive' : 'text-warning'}`}>{selected.status}</p></div>
              <div><span className="text-muted-foreground">Paid</span><p className="text-foreground font-medium">${selected.paidAmount.toLocaleString()}</p></div>
              <div><span className="text-muted-foreground">Adjustments</span><p className="text-foreground font-medium">${selected.adjustments.toLocaleString()}</p></div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">AI Summary</h4>
              <div className="bg-secondary rounded-lg p-3 text-xs text-muted-foreground">
                {selected.status === 'denied'
                  ? 'Payment denied — claim rejected due to missing provider NPI in Loop 2310B. Verify NM109 segment.'
                  : selected.status === 'partial'
                  ? `Partial payment processed. Adjustment of $${selected.adjustments.toLocaleString()} applied due to contractual obligation (CO-45).`
                  : 'Payment processed successfully. All claim segments validated and matched.'}
              </div>
            </div>
          </div>
        </SidePanel>
      )}
    </div>
  );
};

export default Remittance835Dashboard;
