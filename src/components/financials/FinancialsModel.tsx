import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { num } from "@/lib/format";
import { useCurrency } from "@/lib/currency";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

export type Inputs = {
  riders: number;
  deliveriesPerDay: number;
  revenuePerDelivery: number;
  riderPayout: number;
  bikeLease: number;
  maintenancePerRider: number;
  overheadMonthly: number;
};

// All defaults expressed in USD — illustrative, fully editable.
const DEFAULT_INPUTS: Inputs = {
  riders: 3000,
  deliveriesPerDay: 16,
  revenuePerDelivery: 1.4,
  riderPayout: 0.9,
  bikeLease: 15,
  maintenancePerRider: 40,
  overheadMonthly: 200000,
};

const tooltipStyle = {
  background: "oklch(0.21 0.035 240)",
  border: "1px solid oklch(0.32 0.03 240 / 0.6)",
  borderRadius: 8,
  color: "white",
  fontSize: 12,
};

export function FinancialsModel({ initial }: { initial?: Partial<Inputs> }) {
  const [i, setI] = useState<Inputs>({ ...DEFAULT_INPUTS, ...initial });
  const { m, currency } = useCurrency();

  const calc = useMemo(() => {
    const dailyDeliveries = i.riders * i.deliveriesPerDay;
    const monthlyDeliveries = dailyDeliveries * 30;
    const grossRevenue = monthlyDeliveries * i.revenuePerDelivery;
    const payouts = monthlyDeliveries * i.riderPayout;
    const leaseRevenue = i.riders * i.bikeLease * 4.33;
    const maintenance = i.riders * i.maintenancePerRider;
    const totalRevenue = grossRevenue + leaseRevenue;
    const totalCost = payouts + maintenance + i.overheadMonthly;
    const grossProfit = grossRevenue - payouts;
    const netProfit = totalRevenue - totalCost;
    return {
      dailyDeliveries, monthlyDeliveries, grossRevenue, payouts, leaseRevenue,
      maintenance, totalRevenue, totalCost, grossProfit, netProfit,
      margin: (netProfit / totalRevenue) * 100,
    };
  }, [i]);

  const projection = useMemo(() => {
    return Array.from({ length: 12 }).map((_, idx) => {
      const ramp = Math.min(1, (idx + 1) / 9);
      const ridersM = Math.round(i.riders * ramp);
      const rev = ridersM * i.deliveriesPerDay * 30 * i.revenuePerDelivery + ridersM * i.bikeLease * 4.33;
      const cost = ridersM * i.deliveriesPerDay * 30 * i.riderPayout + ridersM * i.maintenancePerRider + i.overheadMonthly * (0.4 + 0.6 * ramp);
      return {
        month: `M${idx + 1}`,
        revenue: Math.round(rev),
        cost: Math.round(cost),
        profit: Math.round(rev - cost),
        riders: ridersM,
      };
    });
  }, [i]);

  const costBreakdown = [
    { name: "Rider payouts", value: Math.round(calc.payouts) },
    { name: "Maintenance & fuel", value: Math.round(calc.maintenance) },
    { name: "Overheads", value: i.overheadMonthly },
  ];
  const colors = ["oklch(0.78 0.17 165)", "oklch(0.82 0.14 80)", "oklch(0.72 0.15 220)", "oklch(0.7 0.17 320)"];
  const axisFmt = (v: number) => m(v, { compact: true });

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-display font-semibold">Interactive financial model</h3>
            <p className="text-sm text-muted-foreground">Drag the sliders — every figure on this page recalculates instantly. Switch currency in the header.</p>
          </div>
          <button onClick={() => setI(DEFAULT_INPUTS)} className="text-xs text-muted-foreground hover:text-primary transition">Reset</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SliderRow label="Active riders" value={i.riders} min={100} max={6000} step={100}
            onChange={(v) => setI({ ...i, riders: v })} display={num(i.riders)} />
          <SliderRow label="Deliveries / rider / day" value={i.deliveriesPerDay} min={4} max={28} step={1}
            onChange={(v) => setI({ ...i, deliveriesPerDay: v })} display={`${i.deliveriesPerDay} drops`} />
          <SliderRow label="Revenue / delivery" value={i.revenuePerDelivery * 100} min={50} max={400} step={5}
            onChange={(v) => setI({ ...i, revenuePerDelivery: v / 100 })} display={m(i.revenuePerDelivery, { decimals: 2 })} />
          <SliderRow label="Rider payout / delivery" value={i.riderPayout * 100} min={30} max={250} step={5}
            onChange={(v) => setI({ ...i, riderPayout: v / 100 })} display={m(i.riderPayout, { decimals: 2 })} />
          <SliderRow label="Bike lease / rider / week" value={i.bikeLease} min={0} max={40} step={1}
            onChange={(v) => setI({ ...i, bikeLease: v })} display={m(i.bikeLease)} />
          <SliderRow label="Monthly overheads" value={i.overheadMonthly} min={50000} max={600000} step={5000}
            onChange={(v) => setI({ ...i, overheadMonthly: v })} display={m(i.overheadMonthly)} />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Showing in <span className="font-mono text-primary">{currency}</span>. Slider min/max units are interpreted as USD; UZS view converts at the FX rate set in the header.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Monthly revenue" value={m(calc.totalRevenue)} accent="primary" sub={`${num(calc.monthlyDeliveries)} deliveries`} />
        <Kpi label="Monthly cost" value={m(calc.totalCost)} sub={`${num(i.riders)} riders`} />
        <Kpi label="Net profit / month" value={m(calc.netProfit)} accent="gold" sub={`${calc.margin.toFixed(1)}% margin`} />
        <Kpi label="Annualised profit" value={m(calc.netProfit * 12)} accent="primary" sub="run-rate" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h4 className="font-display font-semibold mb-4">12-month revenue vs cost ramp</h4>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={projection}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.17 165)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.78 0.17 165)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cst" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.82 0.14 80)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="oklch(0.82 0.14 80)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
              <XAxis dataKey="month" stroke="oklch(0.72 0.02 240)" fontSize={12} />
              <YAxis stroke="oklch(0.72 0.02 240)" fontSize={12} tickFormatter={axisFmt} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => m(v)} />
              <Area type="monotone" dataKey="revenue" stroke="oklch(0.78 0.17 165)" fill="url(#rev)" strokeWidth={2} />
              <Area type="monotone" dataKey="cost" stroke="oklch(0.82 0.14 80)" fill="url(#cst)" strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-2xl p-6">
          <h4 className="font-display font-semibold mb-4">Cost breakdown</h4>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={costBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {costBreakdown.map((_, idx) => <Cell key={idx} fill={colors[idx]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => m(v)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {costBreakdown.map((c, idx) => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: colors[idx] }} />
                  <span className="text-muted-foreground">{c.name}</span>
                </div>
                <span className="font-mono">{m(c.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly profit bars */}
      <div className="glass rounded-2xl p-6">
        <h4 className="font-display font-semibold mb-4">Monthly net profit (12-month plan)</h4>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={projection}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
            <XAxis dataKey="month" stroke="oklch(0.72 0.02 240)" fontSize={12} />
            <YAxis stroke="oklch(0.72 0.02 240)" fontSize={12} tickFormatter={axisFmt} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => m(v)} />
            <Bar dataKey="profit" radius={[6, 6, 0, 0]}>
              {projection.map((p, idx) => (
                <Cell key={idx} fill={p.profit >= 0 ? "oklch(0.78 0.17 165)" : "oklch(0.65 0.22 25)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SliderRow({
  label, value, min, max, step, onChange, display,
}: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-mono text-sm text-primary">{display}</span>
      </div>
      <Slider min={min} max={max} step={step} value={[value]} onValueChange={(v) => onChange(v[0])} />
    </div>
  );
}

function Kpi({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: "primary" | "gold" }) {
  const ring = accent === "primary" ? "from-primary/30" : accent === "gold" ? "from-gold/30" : "from-white/10";
  return (
    <div className={`relative rounded-2xl p-5 glass overflow-hidden`}>
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${ring} via-transparent`} />
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-display font-semibold">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}
