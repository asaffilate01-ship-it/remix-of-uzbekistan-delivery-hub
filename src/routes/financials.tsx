import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { FinancialsModel } from "@/components/financials/FinancialsModel";
import { useCurrency, Disclaimer, EditableMoney } from "@/lib/currency";

export const Route = createFileRoute("/financials")({
  head: () => ({ meta: [
    { title: "Financial Model — Qatnov" },
    { name: "description", content: "Editable revenue, expenses and initial investment that drive a live P&L, balance sheet and 12-month cash flow forecast." },
  ]}),
  component: Financials,
});

type Line = { id: string; label: string; amount: number };
type CapexLine = Line & { life: number }; // depreciation life in months

const uid = () => Math.random().toString(36).slice(2, 9);

const DEFAULT_REVENUE: Line[] = [
  { id: uid(), label: "Gross delivery revenue", amount: 2016000 },
  { id: uid(), label: "Bike lease revenue", amount: 194850 },
  { id: uid(), label: "Merchant SaaS subscriptions", amount: 90000 },
];

const DEFAULT_EXPENSES: Line[] = [
  { id: uid(), label: "Rider payouts", amount: 1296000 },
  { id: uid(), label: "Maintenance & fuel support", amount: 120000 },
  { id: uid(), label: "Operations staff", amount: 100000 },
  { id: uid(), label: "Offices & hubs", amount: 40000 },
  { id: uid(), label: "Tech & support", amount: 35000 },
  { id: uid(), label: "Insurance & admin", amount: 25000 },
  { id: uid(), label: "Recruitment & marketing", amount: 25000 },
];

const DEFAULT_CAPEX: CapexLine[] = [
  { id: uid(), label: "Motorcycles (3,000 × $1,200)", amount: 3600000, life: 24 },
  { id: uid(), label: "Spare bikes & parts", amount: 300000, life: 36 },
  { id: uid(), label: "Tech platform build", amount: 750000, life: 36 },
  { id: uid(), label: "Office & hub fit-out", amount: 400000, life: 60 },
];

const DEFAULT_FUNDING: Line[] = [
  { id: uid(), label: "Founder equity", amount: 1500000 },
  { id: uid(), label: "Seed round", amount: 3000000 },
  { id: uid(), label: "Bike financing facility", amount: 1900000 },
];

const RAMP = [0.15, 0.25, 0.4, 0.55, 0.7, 0.82, 0.9, 0.95, 1, 1, 1, 1];

function Financials() {
  const { m } = useCurrency();
  const [revenue, setRevenue] = useState<Line[]>(DEFAULT_REVENUE);
  const [expenses, setExpenses] = useState<Line[]>(DEFAULT_EXPENSES);
  const [capex, setCapex] = useState<CapexLine[]>(DEFAULT_CAPEX);
  const [funding, setFunding] = useState<Line[]>(DEFAULT_FUNDING);

  const derived = useMemo(() => {
    const totalRevenue = revenue.reduce((s, r) => s + r.amount, 0);
    const totalOpex = expenses.reduce((s, r) => s + r.amount, 0);
    const totalCapex = capex.reduce((s, r) => s + r.amount, 0);
    const totalFunding = funding.reduce((s, r) => s + r.amount, 0);
    const monthlyDepreciation = capex.reduce(
      (s, r) => s + (r.life > 0 ? r.amount / r.life : 0),
      0,
    );
    const ebitda = totalRevenue - totalOpex;
    const netProfit = ebitda - monthlyDepreciation;
    const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // 12-month cash flow (M0 = investment & capex; M1-M12 = ramp ops)
    let cum = 0;
    const months: { month: string; inflow: number; outflow: number; net: number; cumulative: number }[] = [];
    // Month 0
    cum = totalFunding - totalCapex;
    months.push({ month: "M0", inflow: totalFunding, outflow: totalCapex, net: totalFunding - totalCapex, cumulative: cum });
    for (let i = 0; i < 12; i++) {
      const r = totalRevenue * RAMP[i];
      const o = totalOpex * (0.45 + 0.55 * RAMP[i]); // fixed-ish + variable
      const net = r - o;
      cum += net;
      months.push({ month: `M${i + 1}`, inflow: r, outflow: o, net, cumulative: cum });
    }
    const endCash = cum;
    const retained = months.slice(1).reduce((s, x) => s + (x.inflow - x.outflow) - monthlyDepreciation, 0);
    const netCapex = Math.max(0, totalCapex - monthlyDepreciation * 12);

    return {
      totalRevenue, totalOpex, totalCapex, totalFunding,
      monthlyDepreciation, ebitda, netProfit, margin,
      months, endCash, retained, netCapex,
    };
  }, [revenue, expenses, capex, funding]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <header className="mb-8 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Financial model</div>
        <h1 className="mt-3 text-5xl font-display font-semibold">Editable inputs. Live statements.</h1>
        <p className="mt-4 text-muted-foreground">
          Edit revenue, expenses and initial investment below — the P&L, balance sheet and 12-month cash flow forecast recalculate instantly.
        </p>
      </header>

      <Disclaimer className="mb-10" />

      <FinancialsModel />

      {/* Inputs */}
      <section className="mt-20 grid lg:grid-cols-2 gap-6">
        <EditableList
          title="Monthly revenue"
          subtitle="Lines that contribute to total revenue at full scale."
          lines={revenue}
          setLines={setRevenue}
          onReset={() => setRevenue(DEFAULT_REVENUE)}
          accent="primary"
        />
        <EditableList
          title="Monthly expenses"
          subtitle="Operating costs at full scale. Depreciation is calculated separately from capex."
          lines={expenses}
          setLines={setExpenses}
          onReset={() => setExpenses(DEFAULT_EXPENSES)}
          accent="destructive"
        />
        <EditableCapexList
          title="Initial investment · capex"
          subtitle="One-off spend at M0. Each line depreciates straight-line over its useful life."
          lines={capex}
          setLines={setCapex}
          onReset={() => setCapex(DEFAULT_CAPEX)}
        />
        <EditableList
          title="Funding sources"
          subtitle="Cash brought in at M0 — equity, debt and grants."
          lines={funding}
          setLines={setFunding}
          onReset={() => setFunding(DEFAULT_FUNDING)}
          accent="gold"
        />
      </section>

      {/* Derived P&L */}
      <section className="mt-16">
        <h2 className="text-2xl font-display font-semibold">Profit & loss · monthly (derived)</h2>
        <p className="text-xs text-muted-foreground mt-1">Calculated from your revenue and expense lines above.</p>
        <div className="mt-5 glass rounded-2xl overflow-hidden">
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

      {/* Derived Balance Sheet */}
      <section className="mt-16">
        <h2 className="text-2xl font-display font-semibold">Balance sheet · end of year 1 (derived)</h2>
        <p className="text-xs text-muted-foreground mt-1">Capex less depreciation plus closing cash position vs funding plus retained earnings.</p>
        <div className="mt-5 glass rounded-2xl overflow-hidden">
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

      {/* Derived Cash Flow */}
      <section className="mt-16 mb-8">
        <h2 className="text-2xl font-display font-semibold">12-month cash flow forecast (derived)</h2>
        <p className="text-xs text-muted-foreground mt-1">M0 = funding in, capex out. M1–M12 = revenue and expenses ramped to full scale.</p>
        <div className="mt-5 glass rounded-2xl overflow-hidden">
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

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

function EditableList({
  title, subtitle, lines, setLines, onReset, accent,
}: {
  title: string; subtitle: string; lines: Line[]; setLines: (l: Line[]) => void;
  onReset: () => void; accent?: "primary" | "destructive" | "gold";
}) {
  const total = lines.reduce((s, l) => s + l.amount, 0);
  const { m } = useCurrency();
  const totalColor =
    accent === "destructive" ? "text-destructive/90" :
    accent === "gold" ? "text-gold" : "text-primary";

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <button onClick={onReset} className="text-xs text-muted-foreground hover:text-primary">Reset</button>
      </div>
      <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>
      <div className="space-y-1.5">
        {lines.map((l, i) => (
          <div key={l.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-2 group">
            <input
              value={l.label}
              onChange={(e) => setLines(lines.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
              className="bg-transparent border-b border-transparent hover:border-border/60 focus:border-primary focus:outline-none text-sm py-1.5 px-1"
            />
            <EditableMoney
              value={l.amount}
              onChange={(v) => setLines(lines.map((x, j) => j === i ? { ...x, amount: v } : x))}
              step={5000}
            />
            <div className="flex items-center opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => setLines(move(lines, i, i - 1))} className="p-1 text-muted-foreground hover:text-primary"><ArrowUp className="h-3 w-3" /></button>
              <button onClick={() => setLines(move(lines, i, i + 1))} className="p-1 text-muted-foreground hover:text-primary"><ArrowDown className="h-3 w-3" /></button>
              <button onClick={() => setLines(lines.filter((_, j) => j !== i))} className="p-1 text-muted-foreground hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
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

function EditableCapexList({
  title, subtitle, lines, setLines, onReset,
}: {
  title: string; subtitle: string; lines: CapexLine[]; setLines: (l: CapexLine[]) => void; onReset: () => void;
}) {
  const total = lines.reduce((s, l) => s + l.amount, 0);
  const monthlyDep = lines.reduce((s, l) => s + (l.life > 0 ? l.amount / l.life : 0), 0);
  const { m } = useCurrency();

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <button onClick={onReset} className="text-xs text-muted-foreground hover:text-primary">Reset</button>
      </div>
      <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>
      <div className="space-y-1.5">
        {lines.map((l, i) => (
          <div key={l.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 group">
            <input
              value={l.label}
              onChange={(e) => setLines(lines.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
              className="bg-transparent border-b border-transparent hover:border-border/60 focus:border-primary focus:outline-none text-sm py-1.5 px-1"
            />
            <EditableMoney
              value={l.amount}
              onChange={(v) => setLines(lines.map((x, j) => j === i ? { ...x, amount: v } : x))}
              step={25000}
            />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <input
                type="number"
                value={l.life}
                onChange={(e) => setLines(lines.map((x, j) => j === i ? { ...x, life: Number(e.target.value) || 0 } : x))}
                className="w-14 bg-surface/60 border border-border/40 rounded px-1.5 py-1 text-right font-mono text-xs"
              />
              <span>mo</span>
            </div>
            <div className="flex items-center opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => setLines(lines.filter((_, j) => j !== i))} className="p-1 text-muted-foreground hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setLines([...lines, { id: uid(), label: "New capex line", amount: 100000, life: 36 }])}
        className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
      >
        <Plus className="h-3.5 w-3.5" /> Add line
      </button>
      <div className="mt-4 pt-3 border-t border-border/40 space-y-1 text-sm">
        <div className="flex items-center justify-between"><span className="text-muted-foreground">Total capex</span><span className="font-mono font-semibold tabular-nums text-primary">{m(total)}</span></div>
        <div className="flex items-center justify-between"><span className="text-muted-foreground">Monthly depreciation</span><span className="font-mono tabular-nums text-destructive/90">−{m(monthlyDep)}</span></div>
      </div>
    </div>
  );
}
