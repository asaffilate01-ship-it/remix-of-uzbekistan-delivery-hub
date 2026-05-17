import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useCurrency, Disclaimer, EditableMoney } from "@/lib/currency";
import { num } from "@/lib/format";

export const Route = createFileRoute("/financials")({
  head: () => ({
    meta: [
      { title: "Financial Model — Qatnov" },
      { name: "description", content: "Scenario sliders drive a live P&L, balance sheet and 12-month cash flow forecast." },
      { property: "og:title", content: "Financial Model — Qatnov" },
      { property: "og:description", content: "Interactive P&L, balance sheet and cash flow for Qatnov's fleet operations." },
      { property: "og:url", content: "https://uzbek-delivery-flow.lovable.app/financials" },
    ],
    links: [{ rel: "canonical", href: "https://uzbek-delivery-flow.lovable.app/financials" }],
  }),
  component: Financials,
});

type Line = { id: string; label: string; amount: number };
type CapexLine = Line & { life: number };

type Scenario = {
  riders: number;
  deliveriesPerDay: number;
  revenuePerDelivery: number;
  riderPayout: number;
  bikeLeasePerWeek: number;
  maintenancePerRider: number;
  overheadMonthly: number;
  bikeCost: number;
  financingPct: number; // % of bike capex funded by debt
};

const DEFAULT_SCENARIO: Scenario = {
  riders: 500,
  deliveriesPerDay: 16,
  revenuePerDelivery: 1.5,
  riderPayout: 1.0,
  bikeLeasePerWeek: 15,
  maintenancePerRider: 40,
  overheadMonthly: 50000,
  bikeCost: 1200,
  financingPct: 100,
};

const uid = () => Math.random().toString(36).slice(2, 9);

// Free-form lines that sliders don't drive. Sit alongside the driven rows.
const DEFAULT_REVENUE_EXTRA: Line[] = [
  { id: "rev-saas", label: "Merchant SaaS subscriptions", amount: 15000 },
];
const DEFAULT_EXPENSES_EXTRA: Line[] = [
  { id: "exp-ops", label: "Operations staff", amount: 0 },
  { id: "exp-tech", label: "Tech & support", amount: 0 },
];
const DEFAULT_CAPEX_EXTRA: CapexLine[] = [
  { id: "cap-spares", label: "Spare bikes & parts", amount: 50000, life: 36 },
  { id: "cap-tech", label: "Tech platform build", amount: 250000, life: 36 },
  { id: "cap-fitout", label: "Office & hub fit-out", amount: 100000, life: 60 },
  { id: "cap-office", label: "Office setup", amount: 50000, life: 60 },
  { id: "cap-it", label: "IT setup", amount: 50000, life: 36 },
];
const DEFAULT_FUNDING_EXTRA: Line[] = [
  { id: "fund-founder", label: "Founder equity", amount: 250000 },
  { id: "fund-seed", label: "Seed round", amount: 750000 },
];

const RAMP = [0.15, 0.25, 0.4, 0.55, 0.7, 0.82, 0.9, 0.95, 1, 1, 1, 1];

function Financials() {
  const { m, currency } = useCurrency();
  const [s, setS] = useState<Scenario>(DEFAULT_SCENARIO);
  const [revExtra, setRevExtra] = useState<Line[]>(DEFAULT_REVENUE_EXTRA);
  const [expExtra, setExpExtra] = useState<Line[]>(DEFAULT_EXPENSES_EXTRA);
  const [capExtra, setCapExtra] = useState<CapexLine[]>(DEFAULT_CAPEX_EXTRA);
  const [fundExtra, setFundExtra] = useState<Line[]>(DEFAULT_FUNDING_EXTRA);

  // Driven line items — recomputed live from scenario.
  const driven = useMemo(() => {
    const monthlyDeliveries = s.riders * s.deliveriesPerDay * 30;
    const grossDeliveryRevenue = monthlyDeliveries * s.revenuePerDelivery;
    const bikeLeaseRevenue = s.riders * s.bikeLeasePerWeek * 4.33;
    const riderPayouts = monthlyDeliveries * s.riderPayout;
    const maintenance = s.riders * s.maintenancePerRider;
    const motorcyclesCapex = s.riders * s.bikeCost;
    const bikeFinancing = motorcyclesCapex * (s.financingPct / 100);
    return {
      monthlyDeliveries,
      grossDeliveryRevenue,
      bikeLeaseRevenue,
      riderPayouts,
      maintenance,
      motorcyclesCapex,
      bikeFinancing,
    };
  }, [s]);

  const revenue: Line[] = [
    { id: "drv-gross", label: "Gross delivery revenue", amount: driven.grossDeliveryRevenue },
    { id: "drv-lease", label: "Bike lease revenue", amount: driven.bikeLeaseRevenue },
    ...revExtra,
  ];
  const expenses: Line[] = [
    { id: "drv-payout", label: "Rider payouts", amount: driven.riderPayouts },
    { id: "drv-maint", label: "Maintenance & fuel support", amount: driven.maintenance },
    { id: "drv-over", label: "Monthly overheads", amount: s.overheadMonthly },
    ...expExtra,
  ];
  const capex: CapexLine[] = [
    { id: "drv-bikes", label: `Motorcycles (${num(s.riders)} × ${m(s.bikeCost)})`, amount: driven.motorcyclesCapex, life: 24 },
    ...capExtra,
  ];
  const funding: Line[] = [
    { id: "drv-fin", label: `Bike financing facility (${s.financingPct}% of bikes)`, amount: driven.bikeFinancing },
    ...fundExtra,
  ];

  const derived = useMemo(() => {
    const totalRevenue = revenue.reduce((a, r) => a + r.amount, 0);
    const totalOpex = expenses.reduce((a, r) => a + r.amount, 0);
    const totalCapex = capex.reduce((a, r) => a + r.amount, 0);
    const totalFunding = funding.reduce((a, r) => a + r.amount, 0);
    const monthlyDepreciation = capex.reduce((a, r) => a + (r.life > 0 ? r.amount / r.life : 0), 0);
    const ebitda = totalRevenue - totalOpex;
    const netProfit = ebitda - monthlyDepreciation;
    const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    let cum = totalFunding - totalCapex;
    const months: { month: string; inflow: number; outflow: number; net: number; cumulative: number }[] = [
      { month: "M0", inflow: totalFunding, outflow: totalCapex, net: totalFunding - totalCapex, cumulative: cum },
    ];
    for (let i = 0; i < 12; i++) {
      const r = totalRevenue * RAMP[i];
      const o = totalOpex * (0.45 + 0.55 * RAMP[i]);
      const net = r - o;
      cum += net;
      months.push({ month: `M${i + 1}`, inflow: r, outflow: o, net, cumulative: cum });
    }
    const endCash = cum;
    const retained = months.slice(1).reduce((a, x) => a + (x.inflow - x.outflow) - monthlyDepreciation, 0);
    const netCapex = Math.max(0, totalCapex - monthlyDepreciation * 12);
    return { totalRevenue, totalOpex, totalCapex, totalFunding, monthlyDepreciation, ebitda, netProfit, margin, months, endCash, retained, netCapex };
  }, [revenue, expenses, capex, funding]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
      <header className="mb-8 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Financial model</div>
        <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-display font-semibold leading-tight">Scenario sliders. Live statements.</h1>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground">
          Move any slider — revenue, expenses, capex and funding all recalculate instantly, and the P&L, balance sheet and 12-month cash flow follow.
        </p>
      </header>

      <Disclaimer className="mb-10" />

      {/* Scenario sliders */}
      <section className="glass rounded-2xl p-4 sm:p-6 md:p-8 mb-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-display font-semibold">Scenario inputs</h2>
            <p className="text-sm text-muted-foreground">Showing in <span className="font-mono text-primary">{currency}</span>. Sliders interpreted as USD; UZS view converts at the FX rate in the header.</p>
          </div>
          <button onClick={() => setS(DEFAULT_SCENARIO)} className="text-xs text-muted-foreground hover:text-primary transition">Reset</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SliderRow label="Active riders" value={s.riders} min={50} max={6000} step={50}
            onChange={(v) => setS({ ...s, riders: v })} display={num(s.riders)} />
          <SliderRow label="Deliveries / rider / day" value={s.deliveriesPerDay} min={4} max={28} step={1}
            onChange={(v) => setS({ ...s, deliveriesPerDay: v })} display={`${s.deliveriesPerDay} drops`} />
          <SliderRow label="Revenue / delivery" value={s.revenuePerDelivery * 100} min={50} max={400} step={5}
            onChange={(v) => setS({ ...s, revenuePerDelivery: v / 100 })} display={m(s.revenuePerDelivery, { decimals: 2 })} />
          <SliderRow label="Rider payout / delivery" value={s.riderPayout * 100} min={30} max={250} step={5}
            onChange={(v) => setS({ ...s, riderPayout: v / 100 })} display={m(s.riderPayout, { decimals: 2 })} />
          <SliderRow label="Bike lease / rider / week" value={s.bikeLeasePerWeek} min={0} max={40} step={1}
            onChange={(v) => setS({ ...s, bikeLeasePerWeek: v })} display={m(s.bikeLeasePerWeek)} />
          <SliderRow label="Maintenance / rider / month" value={s.maintenancePerRider} min={0} max={150} step={5}
            onChange={(v) => setS({ ...s, maintenancePerRider: v })} display={m(s.maintenancePerRider)} />
          <SliderRow label="Monthly overheads" value={s.overheadMonthly} min={10000} max={500000} step={5000}
            onChange={(v) => setS({ ...s, overheadMonthly: v })} display={m(s.overheadMonthly)} />
          <SliderRow label="Bike cost (each)" value={s.bikeCost} min={400} max={3000} step={50}
            onChange={(v) => setS({ ...s, bikeCost: v })} display={m(s.bikeCost)} />
          <SliderRow label="Bike financing %" value={s.financingPct} min={0} max={100} step={5}
            onChange={(v) => setS({ ...s, financingPct: v })} display={`${s.financingPct}%`} />
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <Stat label="Monthly revenue" value={m(derived.totalRevenue)} accent="primary" />
          <Stat label="Monthly cost" value={m(derived.totalOpex)} />
          <Stat label="Net profit / mo" value={m(derived.netProfit)} accent={derived.netProfit >= 0 ? "gold" : "destructive"} />
          <Stat label="Bikes capex" value={m(driven.motorcyclesCapex)} />
        </div>
      </section>

      {/* Editable line items — driven rows recompute, extras stay free-form */}
      <section className="grid lg:grid-cols-2 gap-6">
        <ExtraList
          title="Monthly revenue · extras"
          subtitle="Gross delivery & bike lease are driven by sliders. Add other revenue lines here."
          driven={[
            { label: "Gross delivery revenue", amount: driven.grossDeliveryRevenue },
            { label: "Bike lease revenue", amount: driven.bikeLeaseRevenue },
          ]}
          lines={revExtra}
          setLines={setRevExtra}
          onReset={() => setRevExtra(DEFAULT_REVENUE_EXTRA)}
          accent="primary"
        />
        <ExtraList
          title="Monthly expenses · extras"
          subtitle="Rider payouts, maintenance and overheads come from sliders. Add other costs here."
          driven={[
            { label: "Rider payouts", amount: driven.riderPayouts },
            { label: "Maintenance & fuel support", amount: driven.maintenance },
            { label: "Monthly overheads", amount: s.overheadMonthly },
          ]}
          lines={expExtra}
          setLines={setExpExtra}
          onReset={() => setExpExtra(DEFAULT_EXPENSES_EXTRA)}
          accent="destructive"
        />
        <CapexExtraList
          title="Initial investment · extras"
          subtitle={`Motorcycles capex (${num(s.riders)} × ${m(s.bikeCost)} = ${m(driven.motorcyclesCapex)}) is driven by sliders.`}
          drivenLabel={`Motorcycles (${num(s.riders)} × ${m(s.bikeCost)})`}
          drivenAmount={driven.motorcyclesCapex}
          lines={capExtra}
          setLines={setCapExtra}
          onReset={() => setCapExtra(DEFAULT_CAPEX_EXTRA)}
        />
        <ExtraList
          title="Funding sources · extras"
          subtitle={`Bike financing (${s.financingPct}% of bikes capex = ${m(driven.bikeFinancing)}) is driven by sliders. Add equity, grants and other debt here.`}
          driven={[
            { label: `Bike financing facility`, amount: driven.bikeFinancing },
          ]}
          lines={fundExtra}
          setLines={setFundExtra}
          onReset={() => setFundExtra(DEFAULT_FUNDING_EXTRA)}
          accent="gold"
        />
      </section>

      {/* Derived P&L */}
      <section className="mt-16">
        <h2 className="text-2xl font-display font-semibold">Profit & loss · monthly (derived)</h2>
        <p className="text-xs text-muted-foreground mt-1">Calculated from sliders + extra lines.</p>
        <div className="mt-5 glass rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {revenue.map((r) => (
                <tr key={r.id} className="border-b border-border/30">
                  <td className="px-5 py-3">{r.label}</td>
                  <td className="px-5 py-3 text-right font-mono tabular-nums">{m(r.amount)}</td>
                </tr>
              ))}
              <tr className="border-b border-border/30 bg-surface/40 font-semibold">
                <td className="px-5 py-3.5">Total revenue</td>
                <td className="px-5 py-3.5 text-right font-mono tabular-nums">{m(derived.totalRevenue)}</td>
              </tr>
              {expenses.map((r) => (
                <tr key={r.id} className="border-b border-border/30">
                  <td className="px-5 py-3">{r.label}</td>
                  <td className="px-5 py-3 text-right font-mono tabular-nums text-destructive/90">−{m(r.amount)}</td>
                </tr>
              ))}
              <tr className="border-b border-border/30 bg-surface/40 font-semibold">
                <td className="px-5 py-3.5">Total operating cost</td>
                <td className="px-5 py-3.5 text-right font-mono tabular-nums text-destructive/90">−{m(derived.totalOpex)}</td>
              </tr>
              <tr className="border-b border-border/30">
                <td className="px-5 py-3">EBITDA</td>
                <td className="px-5 py-3 text-right font-mono tabular-nums">{m(derived.ebitda)}</td>
              </tr>
              <tr className="border-b border-border/30">
                <td className="px-5 py-3">Depreciation</td>
                <td className="px-5 py-3 text-right font-mono tabular-nums text-destructive/90">−{m(derived.monthlyDepreciation)}</td>
              </tr>
              <tr className="bg-surface/40 font-semibold">
                <td className="px-5 py-3.5">Net profit / month <span className="text-xs text-muted-foreground font-normal ml-2">({derived.margin.toFixed(1)}% margin)</span></td>
                <td className="px-5 py-3.5 text-right font-mono tabular-nums text-primary">{m(derived.netProfit)}</td>
              </tr>
              <tr className="bg-surface/60 font-semibold">
                <td className="px-5 py-3.5">Annualised net profit</td>
                <td className="px-5 py-3.5 text-right font-mono tabular-nums text-primary">{m(derived.netProfit * 12)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Balance sheet */}
      <section className="mt-16">
        <h2 className="text-2xl font-display font-semibold">Balance sheet · end of year 1 (derived)</h2>
        <p className="text-xs text-muted-foreground mt-1">Capex less depreciation plus closing cash vs funding plus retained earnings.</p>
        <div className="mt-5 glass rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              <tr className="bg-surface/40 uppercase text-xs tracking-wider font-semibold"><td className="px-5 py-3" colSpan={2}>Assets</td></tr>
              <tr className="border-b border-border/30">
                <td className="px-5 py-3">Cash on hand (close of M12)</td>
                <td className={`px-5 py-3 text-right font-mono tabular-nums ${derived.endCash < 0 ? "text-destructive/90" : ""}`}>{derived.endCash < 0 ? "−" : ""}{m(Math.abs(derived.endCash))}</td>
              </tr>
              <tr className="border-b border-border/30">
                <td className="px-5 py-3">Fixed assets (capex less depreciation)</td>
                <td className="px-5 py-3 text-right font-mono tabular-nums">{m(derived.netCapex)}</td>
              </tr>
              <tr className="bg-surface/40 font-semibold border-b border-border/30">
                <td className="px-5 py-3.5">Total assets</td>
                <td className="px-5 py-3.5 text-right font-mono tabular-nums">{m(derived.endCash + derived.netCapex)}</td>
              </tr>
              <tr className="bg-surface/40 uppercase text-xs tracking-wider font-semibold"><td className="px-5 py-3" colSpan={2}>Liabilities & equity</td></tr>
              {funding.map((f) => (
                <tr key={f.id} className="border-b border-border/30">
                  <td className="px-5 py-3">{f.label}</td>
                  <td className="px-5 py-3 text-right font-mono tabular-nums">{m(f.amount)}</td>
                </tr>
              ))}
              <tr className="border-b border-border/30">
                <td className="px-5 py-3">Retained earnings (yr 1)</td>
                <td className={`px-5 py-3 text-right font-mono tabular-nums ${derived.retained < 0 ? "text-destructive/90" : ""}`}>{derived.retained < 0 ? "−" : ""}{m(Math.abs(derived.retained))}</td>
              </tr>
              <tr className="bg-surface/40 font-semibold">
                <td className="px-5 py-3.5">Total liabilities & equity</td>
                <td className="px-5 py-3.5 text-right font-mono tabular-nums">{m(derived.totalFunding + derived.retained)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Cash flow */}
      <section className="mt-16 mb-8">
        <h2 className="text-2xl font-display font-semibold">12-month cash flow forecast (derived)</h2>
        <p className="text-xs text-muted-foreground mt-1">M0 = funding in, capex out. M1–M12 = revenue and expenses ramped to full scale.</p>
        <div className="mt-5 glass rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface/60 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 text-left font-medium">Month</th>
                <th className="px-5 py-3 text-right font-medium">Inflow</th>
                <th className="px-5 py-3 text-right font-medium">Outflow</th>
                <th className="px-5 py-3 text-right font-medium">Net</th>
                <th className="px-5 py-3 text-right font-medium">Cumulative cash</th>
              </tr>
            </thead>
            <tbody>
              {derived.months.map((r) => (
                <tr key={r.month} className="border-b border-border/30 last:border-0">
                  <td className="px-5 py-3 font-mono text-primary">{r.month}</td>
                  <td className="px-5 py-3 text-right font-mono tabular-nums">{m(r.inflow)}</td>
                  <td className="px-5 py-3 text-right font-mono tabular-nums text-destructive/90">−{m(r.outflow)}</td>
                  <td className={`px-5 py-3 text-right font-mono tabular-nums ${r.net < 0 ? "text-destructive/90" : ""}`}>{r.net < 0 ? "−" : ""}{m(Math.abs(r.net))}</td>
                  <td className={`px-5 py-3 text-right font-mono tabular-nums font-semibold ${r.cumulative < 0 ? "text-destructive/90" : "text-primary"}`}>{r.cumulative < 0 ? "−" : ""}{m(Math.abs(r.cumulative))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SliderRow({ label, value, min, max, step, onChange, display }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string;
}) {
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

function Stat({ label, value, accent }: { label: string; value: string; accent?: "primary" | "gold" | "destructive" }) {
  const color = accent === "primary" ? "text-primary" : accent === "gold" ? "text-gold" : accent === "destructive" ? "text-destructive/90" : "";
  return (
    <div className="rounded-xl border border-border/40 bg-surface/40 px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-mono font-semibold tabular-nums ${color}`}>{value}</div>
    </div>
  );
}

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

function ExtraList({
  title, subtitle, driven, lines, setLines, onReset, accent,
}: {
  title: string; subtitle: string; driven: { label: string; amount: number }[];
  lines: Line[]; setLines: (l: Line[]) => void; onReset: () => void;
  accent?: "primary" | "destructive" | "gold";
}) {
  const { m } = useCurrency();
  const total = driven.reduce((a, l) => a + l.amount, 0) + lines.reduce((a, l) => a + l.amount, 0);
  const totalColor = accent === "destructive" ? "text-destructive/90" : accent === "gold" ? "text-gold" : "text-primary";

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <button onClick={onReset} className="text-xs text-muted-foreground hover:text-primary">Reset extras</button>
      </div>
      <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>
      <div className="space-y-1.5">
        {driven.map((d) => (
          <div key={d.label} className="grid grid-cols-[1fr_auto] items-center gap-2 text-sm py-1.5 px-1 border-b border-dashed border-border/30">
            <span className="text-muted-foreground italic">{d.label} <span className="text-[10px] uppercase tracking-wider ml-1 text-primary/60">slider-driven</span></span>
            <span className="font-mono tabular-nums">{m(d.amount)}</span>
          </div>
        ))}
        {lines.map((l, i) => (
          <div key={l.id} className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto] items-center gap-2 group">
            <input
              value={l.label}
              onChange={(e) => setLines(lines.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
              className="bg-transparent border-b border-transparent hover:border-border/60 focus:border-primary focus:outline-none text-sm py-1.5 px-1 min-w-0"
            />
            <EditableMoney value={l.amount} onChange={(v) => setLines(lines.map((x, j) => j === i ? { ...x, amount: v } : x))} step={5000} />
            <div className="col-span-2 sm:col-span-1 flex items-center justify-end sm:opacity-0 sm:group-hover:opacity-100 transition">
              <button onClick={() => setLines(move(lines, i, i - 1))} className="p-1.5 text-muted-foreground hover:text-primary"><ArrowUp className="h-3.5 w-3.5" /></button>
              <button onClick={() => setLines(move(lines, i, i + 1))} className="p-1.5 text-muted-foreground hover:text-primary"><ArrowDown className="h-3.5 w-3.5" /></button>
              <button onClick={() => setLines(lines.filter((_, j) => j !== i))} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setLines([...lines, { id: uid(), label: "New line", amount: 10000 }])}
        className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
      >
        <Plus className="h-3.5 w-3.5" /> Add line
      </button>
      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Total</span>
        <span className={`font-mono font-semibold tabular-nums ${totalColor}`}>{m(total)}</span>
      </div>
    </div>
  );
}

function CapexExtraList({
  title, subtitle, drivenLabel, drivenAmount, lines, setLines, onReset,
}: {
  title: string; subtitle: string; drivenLabel: string; drivenAmount: number;
  lines: CapexLine[]; setLines: (l: CapexLine[]) => void; onReset: () => void;
}) {
  const { m } = useCurrency();
  const total = drivenAmount + lines.reduce((a, l) => a + l.amount, 0);

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <button onClick={onReset} className="text-xs text-muted-foreground hover:text-primary">Reset extras</button>
      </div>
      <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>
      <div className="space-y-1.5">
        <div className="grid grid-cols-[1fr_auto] items-center gap-2 text-sm py-1.5 px-1 border-b border-dashed border-border/30">
          <span className="text-muted-foreground italic">{drivenLabel} <span className="text-[10px] uppercase tracking-wider ml-1 text-primary/60">slider-driven</span></span>
          <span className="font-mono tabular-nums">{m(drivenAmount)}</span>
        </div>
        {lines.map((l, i) => (
          <div key={l.id} className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto_auto] items-center gap-2 group">
            <input
              value={l.label}
              onChange={(e) => setLines(lines.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
              className="bg-transparent border-b border-transparent hover:border-border/60 focus:border-primary focus:outline-none text-sm py-1.5 px-1 min-w-0"
            />
            <EditableMoney value={l.amount} onChange={(v) => setLines(lines.map((x, j) => j === i ? { ...x, amount: v } : x))} step={25000} />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <input
                type="number"
                value={l.life}
                onChange={(e) => setLines(lines.map((x, j) => j === i ? { ...x, life: Number(e.target.value) || 0 } : x))}
                className="w-12 bg-surface/60 border border-border/40 rounded px-1.5 py-0.5 font-mono text-foreground"
                title="Useful life in months"
              />
              <span>mo</span>
            </div>
            <div className="flex items-center justify-end sm:opacity-0 sm:group-hover:opacity-100 transition">
              <button onClick={() => setLines(move(lines, i, i - 1))} className="p-1.5 text-muted-foreground hover:text-primary"><ArrowUp className="h-3.5 w-3.5" /></button>
              <button onClick={() => setLines(move(lines, i, i + 1))} className="p-1.5 text-muted-foreground hover:text-primary"><ArrowDown className="h-3.5 w-3.5" /></button>
              <button onClick={() => setLines(lines.filter((_, j) => j !== i))} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setLines([...lines, { id: uid(), label: "New line", amount: 50000, life: 36 }])}
        className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
      >
        <Plus className="h-3.5 w-3.5" /> Add line
      </button>
      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Total capex</span>
        <span className="font-mono font-semibold tabular-nums text-primary">{m(total)}</span>
      </div>
    </div>
  );
}
