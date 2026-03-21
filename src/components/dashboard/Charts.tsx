import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// Shared chart theme
const CHART_COLORS = {
  success: 'hsl(142, 71%, 45%)',
  destructive: 'hsl(0, 84%, 60%)',
  warning: 'hsl(38, 92%, 50%)',
  primary: 'hsl(142, 71%, 45%)',
  muted: 'hsl(217, 33%, 30%)',
};

const tooltipStyle = {
  contentStyle: {
    backgroundColor: 'hsl(224, 47%, 10%)',
    border: '1px solid hsl(217, 33%, 20%)',
    borderRadius: '8px',
    fontSize: '12px',
    color: 'hsl(210, 40%, 98%)',
  },
  itemStyle: { color: 'hsl(215, 20%, 65%)' },
};

// ─── 837 Claims Charts ───

interface ClaimsStatusData {
  accepted: number;
  rejected: number;
  pending: number;
}

export const ClaimsStatusPieChart: React.FC<{ data: ClaimsStatusData }> = ({ data }) => {
  const chartData = [
    { name: 'Accepted', value: data.accepted, color: CHART_COLORS.success },
    { name: 'Rejected', value: data.rejected, color: CHART_COLORS.destructive },
    { name: 'Pending', value: data.pending, color: CHART_COLORS.warning },
  ].filter(d => d.value > 0);

  if (chartData.length === 0) return <ChartEmpty label="No claims data to visualize" />;

  return (
    <ChartCard title="Claims by Status">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" strokeWidth={0}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-5 mt-2">
        {chartData.map(d => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            {d.name} ({d.value})
          </div>
        ))}
      </div>
    </ChartCard>
  );
};

interface ClaimsTrendPoint {
  month: string;
  claims: number;
  amount: number;
}

export const ClaimsTrendChart: React.FC<{ data: ClaimsTrendPoint[] }> = ({ data }) => {
  if (data.length === 0) return <ChartEmpty label="No trend data available" />;

  return (
    <ChartCard title="Claims Volume Trend">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="claimsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
              <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
          <Tooltip {...tooltipStyle} />
          <Area type="monotone" dataKey="claims" stroke={CHART_COLORS.primary} fill="url(#claimsGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

// ─── 835 Remittance Charts ───

interface PaymentBreakdownPoint {
  month: string;
  paid: number;
  adjustments: number;
}

export const PaymentBreakdownChart: React.FC<{ data: PaymentBreakdownPoint[] }> = ({ data }) => {
  if (data.length === 0) return <ChartEmpty label="No payment data to visualize" />;

  return (
    <ChartCard title="Payments vs Adjustments">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={2}>
          <XAxis dataKey="month" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} width={50}
            tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip {...tooltipStyle} formatter={(value: number) => `$${value.toLocaleString()}`} />
          <Bar dataKey="paid" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} name="Paid" />
          <Bar dataKey="adjustments" fill={CHART_COLORS.destructive} radius={[4, 4, 0, 0]} name="Adjustments" />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-5 mt-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS.success }} /> Paid
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS.destructive }} /> Adjustments
        </div>
      </div>
    </ChartCard>
  );
};

export const PaymentStatusPieChart: React.FC<{ paid: number; denied: number; partial: number }> = ({ paid, denied, partial }) => {
  const chartData = [
    { name: 'Paid', value: paid, color: CHART_COLORS.success },
    { name: 'Denied', value: denied, color: CHART_COLORS.destructive },
    { name: 'Partial', value: partial, color: CHART_COLORS.warning },
  ].filter(d => d.value > 0);

  if (chartData.length === 0) return <ChartEmpty label="No payment status data" />;

  return (
    <ChartCard title="Payment Status Distribution">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" strokeWidth={0}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-5 mt-2">
        {chartData.map(d => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            {d.name} ({d.value})
          </div>
        ))}
      </div>
    </ChartCard>
  );
};

// ─── 834 Enrollment Charts ───

interface EnrollmentTrendPoint {
  month: string;
  active: number;
  terminated: number;
}

export const EnrollmentTrendChart: React.FC<{ data: EnrollmentTrendPoint[] }> = ({ data }) => {
  if (data.length === 0) return <ChartEmpty label="No enrollment trend data" />;

  return (
    <ChartCard title="Enrollment Trend">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.success} stopOpacity={0.3} />
              <stop offset="100%" stopColor={CHART_COLORS.success} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="termGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.destructive} stopOpacity={0.2} />
              <stop offset="100%" stopColor={CHART_COLORS.destructive} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
          <Tooltip {...tooltipStyle} />
          <Area type="monotone" dataKey="active" stroke={CHART_COLORS.success} fill="url(#activeGrad)" strokeWidth={2} name="Active" />
          <Area type="monotone" dataKey="terminated" stroke={CHART_COLORS.destructive} fill="url(#termGrad)" strokeWidth={2} name="Terminated" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-5 mt-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS.success }} /> Active
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS.destructive }} /> Terminated
        </div>
      </div>
    </ChartCard>
  );
};

export const PlanDistributionChart: React.FC<{ data: { plan: string; count: number }[] }> = ({ data }) => {
  if (data.length === 0) return <ChartEmpty label="No plan distribution data" />;

  const colors = [CHART_COLORS.primary, CHART_COLORS.warning, 'hsl(200, 70%, 50%)', 'hsl(280, 60%, 55%)'];

  return (
    <ChartCard title="Members by Plan">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" barSize={18}>
          <XAxis type="number" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="plan" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Members">
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

// ─── Shared Components ───

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-card rounded-xl border border-border shadow-sm shadow-black/10 p-5 animate-fade-in" style={{ animationDelay: '250ms', animationFillMode: 'backwards' }}>
    <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
    {children}
  </div>
);

const ChartEmpty: React.FC<{ label: string }> = ({ label }) => (
  <div className="bg-card rounded-xl border border-border shadow-sm shadow-black/10 p-5 animate-fade-in">
    <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  </div>
);
