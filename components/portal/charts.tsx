'use client';

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const GOLD = '#C9A84C';
const GOLD_LIGHT = '#E0C677';
const INK = '#1A1A1A';

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 12,
  fontSize: 12,
  color: 'hsl(var(--foreground))',
};

/** Monthly billed/collected area chart. */
export function RevenueArea({ data }: { data: { month: string; billed: number; paid: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="gPaid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity={0.45} />
            <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gBilled" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={INK} stopOpacity={0.18} />
            <stop offset="100%" stopColor={INK} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} stroke="hsl(var(--muted-foreground))" />
        <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="hsl(var(--muted-foreground))"
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => `$${Number(v).toLocaleString()}`} />
        <Area type="monotone" dataKey="billed" stroke={INK} strokeWidth={2} fill="url(#gBilled)" name="Billed" />
        <Area type="monotone" dataKey="paid" stroke={GOLD} strokeWidth={2.5} fill="url(#gPaid)" name="Collected" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Invoice status distribution donut. */
export function StatusDonut({ data }: { data: { name: string; value: number }[] }) {
  const COLORS = [GOLD, GOLD_LIGHT, '#8a8a8a', '#c0392b'];
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">No invoice data yet.</div>;
  }
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={84} paddingAngle={3} stroke="none">
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

/** Cases-by-status bars. */
export function CasesBar({ data }: { data: { status: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="status" tickLine={false} axisLine={false} fontSize={11} stroke="hsl(var(--muted-foreground))" />
        <YAxis tickLine={false} axisLine={false} fontSize={11} allowDecimals={false} stroke="hsl(var(--muted-foreground))" />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--accent))' }} />
        <Bar dataKey="count" fill={GOLD} radius={[6, 6, 0, 0]} barSize={42} />
      </BarChart>
    </ResponsiveContainer>
  );
}
