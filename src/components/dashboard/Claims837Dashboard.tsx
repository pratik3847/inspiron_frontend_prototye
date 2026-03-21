import React, { useState } from 'react';
import SummaryCard from './SummaryCard';
import SidePanel from './SidePanel';
import { ClaimsStatusPieChart, ClaimsTrendChart } from './Charts';
import { claims837, claimsTrendData, claimsStatusSummary, type Claim837 } from '@/lib/mockData';
import { FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const statusColors = {
  accepted: 'bg-success/10 text-success',
  rejected: 'bg-destructive/10 text-destructive',
  pending: 'bg-warning/10 text-warning',
};

const Claims837Dashboard: React.FC = () => {
  const [selected, setSelected] = useState<Claim837 | null>(null);

  // Use chart summary data for cards (aggregated insights)
  const { accepted, rejected, pending } = claimsStatusSummary;
  const total = accepted + rejected + pending;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total Claims" value={total.toLocaleString()} icon={<FileText className="w-4 h-4" />} delay={0} />
        <SummaryCard title="Accepted" value={accepted.toLocaleString()} variant="success" icon={<CheckCircle className="w-4 h-4" />} delay={60} />
        <SummaryCard title="Rejected" value={rejected.toLocaleString()} variant="destructive" icon={<AlertTriangle className="w-4 h-4" />} delay={120} />
        <SummaryCard title="Pending" value={pending.toLocaleString()} variant="warning" icon={<Clock className="w-4 h-4" />} delay={180} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ClaimsTrendChart data={claimsTrendData} />
        <ClaimsStatusPieChart data={claimsStatusSummary} />
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm shadow-black/10 overflow-hidden animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}>
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Recent Claims</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">Claim ID</th>
                <th className="text-left px-5 py-3 font-medium">Patient</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Provider</th>
                <th className="text-right px-5 py-3 font-medium">Amount</th>
                <th className="text-center px-5 py-3 font-medium">Status</th>
                <th className="text-center px-5 py-3 font-medium hidden sm:table-cell">Errors</th>
              </tr>
            </thead>
            <tbody>
              {claims837.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">No individual claims uploaded yet. Upload an 837 EDI file to populate this table.</td></tr>
              ) : claims837.map((claim, i) => (
                <tr
                  key={claim.id}
                  onClick={() => setSelected(claim)}
                  className="border-b border-border/50 last:border-0 hover:bg-accent/50 cursor-pointer transition-colors animate-fade-in"
                  style={{ animationDelay: `${350 + i * 40}ms`, animationFillMode: 'backwards' }}
                >
                  <td className="px-5 py-3 font-mono text-xs text-foreground">{claim.id}</td>
                  <td className="px-5 py-3 text-foreground">{claim.patientName}</td>
                  <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">{claim.provider}</td>
                  <td className="px-5 py-3 text-right text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    ${claim.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[claim.status]}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center hidden sm:table-cell">
                    {claim.errors > 0 ? (
                      <span className="text-destructive font-medium">{claim.errors}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <SidePanel title={`Claim ${selected.id}`} onClose={() => setSelected(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Patient</span><p className="text-foreground font-medium">{selected.patientName}</p></div>
              <div><span className="text-muted-foreground">Provider</span><p className="text-foreground font-medium">{selected.provider}</p></div>
              <div><span className="text-muted-foreground">Amount</span><p className="text-foreground font-medium">${selected.amount.toLocaleString()}</p></div>
              <div><span className="text-muted-foreground">Status</span><p className={`font-medium ${selected.status === 'accepted' ? 'text-success' : selected.status === 'rejected' ? 'text-destructive' : 'text-warning'}`}>{selected.status}</p></div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">EDI Segments</h4>
              <div className="bg-secondary rounded-lg p-3 font-mono text-xs text-muted-foreground space-y-1">
                {selected.segments.map((seg, i) => (
                  <div key={i} className="hover:text-foreground transition-colors">{seg}</div>
                ))}
              </div>
            </div>
          </div>
        </SidePanel>
      )}
    </div>
  );
};

export default Claims837Dashboard;
