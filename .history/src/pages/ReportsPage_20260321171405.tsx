import React from 'react';
import {
  claims837,
  payments835,
  members834,
  validationResults,
  claimsStatusSummary,
  paymentStatusSummary,
  reports,
} from '@/lib/mockData';
import { FileText, Download, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const totalClaims = claims837.length;
  const totalPayments = payments835.length;
  const totalMembers = members834.length;
  const validationErrors = validationResults.filter(v => v.type === 'error').length;
  const validationWarnings = validationResults.filter(v => v.type === 'warning').length;
  const validationPasses = validationResults.filter(v => v.type === 'pass').length;
  const paymentTotal = payments835.reduce((s, p) => s + p.paidAmount, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="mb-1">
        <h2 className="text-lg font-semibold text-foreground">Reports</h2>
        <p className="text-sm text-muted-foreground mt-1">Generated from the uploaded EDI dataset</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm shadow-black/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Claims</span>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-semibold text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{totalClaims}</div>
          <p className="text-xs text-muted-foreground mt-1">Accepted {claimsStatusSummary.accepted} • Pending {claimsStatusSummary.pending}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm shadow-black/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Payments</span>
            <CheckCircle className="w-4 h-4 text-success" />
          </div>
          <div className="text-2xl font-semibold text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>${paymentTotal.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Paid {paymentStatusSummary.paid} • Partial {paymentStatusSummary.partial}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm shadow-black/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Enrollment</span>
            <Clock className="w-4 h-4 text-warning" />
          </div>
          <div className="text-2xl font-semibold text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{totalMembers}</div>
          <p className="text-xs text-muted-foreground mt-1">Active members in dataset</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm shadow-black/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Validation</span>
            <AlertTriangle className="w-4 h-4 text-warning" />
          </div>
          <div className="text-2xl font-semibold text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{validationErrors}</div>
          <p className="text-xs text-muted-foreground mt-1">{validationWarnings} warnings • {validationPasses} passes</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm shadow-black/10 overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Generated Reports</h3>
        </div>
        <div className="divide-y divide-border/50">
          {reports.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-muted-foreground">No reports generated yet. Upload and validate EDI files to generate reports.</div>
          ) : reports.map((report, i) => (
            <div key={report.id} className="px-5 py-4 flex flex-col gap-3 animate-fade-in" style={{ animationDelay: `${120 + i * 40}ms`, animationFillMode: 'backwards' }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-foreground">{report.title}</h4>
                    <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{report.format}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                </div>
                <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-primary text-primary-foreground shadow-sm hover:brightness-95 active:scale-[0.98]">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {report.metrics.map(metric => (
                  <div key={metric.label} className="px-3 py-1 rounded-lg bg-secondary text-xs text-muted-foreground">
                    <span className="text-foreground font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>{metric.value}</span> {metric.label}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">Generated {report.generatedAt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
