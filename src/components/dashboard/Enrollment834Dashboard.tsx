import React, { useState } from 'react';
import SummaryCard from './SummaryCard';
import SidePanel from './SidePanel';
import { EnrollmentTrendChart, PlanDistributionChart } from './Charts';
import { members834, enrollmentTrendData, planDistributionData, type Member834 } from '@/lib/mockData';
import { Users, UserCheck, UserX, BarChart3 } from 'lucide-react';

const statusColors = {
  active: 'bg-success/10 text-success',
  terminated: 'bg-destructive/10 text-destructive',
  pending: 'bg-warning/10 text-warning',
};

const Enrollment834Dashboard: React.FC = () => {
  const [selected, setSelected] = useState<Member834 | null>(null);

  const latestTrend = enrollmentTrendData[enrollmentTrendData.length - 1];
  const totalMembers = latestTrend ? latestTrend.active + latestTrend.terminated : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total Members" value={totalMembers.toLocaleString()} icon={<Users className="w-4 h-4" />} delay={0} />
        <SummaryCard title="Active" value={latestTrend?.active.toLocaleString() ?? '0'} variant="success" icon={<UserCheck className="w-4 h-4" />} delay={60} />
        <SummaryCard title="Terminated" value={latestTrend?.terminated.toLocaleString() ?? '0'} variant="destructive" icon={<UserX className="w-4 h-4" />} delay={120} />
        <SummaryCard title="Plans" value={planDistributionData.length.toString()} icon={<BarChart3 className="w-4 h-4" />} delay={180} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EnrollmentTrendChart data={enrollmentTrendData} />
        <PlanDistributionChart data={planDistributionData} />
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm shadow-black/10 overflow-hidden animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}>
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Enrollment Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">Member ID</th>
                <th className="text-left px-5 py-3 font-medium">Name</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Plan</th>
                <th className="text-center px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Effective</th>
              </tr>
            </thead>
            <tbody>
              {members834.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-muted-foreground">No individual enrollment records yet. Upload an 834 EDI file to populate this table.</td></tr>
              ) : members834.map((m, i) => (
                <tr key={m.id} onClick={() => setSelected(m)}
                  className="border-b border-border/50 last:border-0 hover:bg-accent/50 cursor-pointer transition-colors animate-fade-in"
                  style={{ animationDelay: `${350 + i * 40}ms`, animationFillMode: 'backwards' }}>
                  <td className="px-5 py-3 font-mono text-xs text-foreground">{m.id}</td>
                  <td className="px-5 py-3 text-foreground">{m.name}</td>
                  <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">{m.plan}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[m.coverageStatus]}`}>{m.coverageStatus}</span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{m.effectiveDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <SidePanel title={`Member ${selected.id}`} onClose={() => setSelected(null)}>
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-muted-foreground">Name</span><p className="text-foreground font-medium">{selected.name}</p></div>
              <div><span className="text-muted-foreground">Plan</span><p className="text-foreground font-medium">{selected.plan}</p></div>
              <div><span className="text-muted-foreground">Status</span><p className={`font-medium ${selected.coverageStatus === 'active' ? 'text-success' : selected.coverageStatus === 'terminated' ? 'text-destructive' : 'text-warning'}`}>{selected.coverageStatus}</p></div>
              <div><span className="text-muted-foreground">Effective</span><p className="text-foreground">{selected.effectiveDate}</p></div>
            </div>
            {selected.terminationDate && (
              <div><span className="text-muted-foreground text-xs">Termination Date</span><p className="text-destructive font-medium">{selected.terminationDate}</p></div>
            )}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Coverage Timeline</h4>
              <div className="relative pl-4 border-l-2 border-border space-y-3">
                <div className="relative">
                  <div className="absolute -left-[21px] w-3 h-3 rounded-full bg-success border-2 border-card" />
                  <p className="text-xs text-foreground font-medium">Enrollment Start</p>
                  <p className="text-xs text-muted-foreground">{selected.effectiveDate}</p>
                </div>
                {selected.terminationDate && (
                  <div className="relative">
                    <div className="absolute -left-[21px] w-3 h-3 rounded-full bg-destructive border-2 border-card" />
                    <p className="text-xs text-foreground font-medium">Coverage Terminated</p>
                    <p className="text-xs text-muted-foreground">{selected.terminationDate}</p>
                  </div>
                )}
                {!selected.terminationDate && (
                  <div className="relative">
                    <div className="absolute -left-[21px] w-3 h-3 rounded-full bg-primary border-2 border-card animate-pulse-soft" />
                    <p className="text-xs text-foreground font-medium">Currently Active</p>
                    <p className="text-xs text-muted-foreground">Coverage ongoing</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SidePanel>
      )}
    </div>
  );
};

export default Enrollment834Dashboard;
