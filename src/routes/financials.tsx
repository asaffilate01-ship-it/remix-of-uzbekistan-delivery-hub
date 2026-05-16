import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FinancialsModel } from "@/components/financials/FinancialsModel";
import { useCurrency, Disclaimer, EditableMoney } from "@/lib/currency";

export const Route = createFileRoute("/financials")({
  head: () => ({ meta: [
    { title: "Financial Model — Qatnov" },
    { name: "description", content: "Interactive P&L, balance sheet, cash flow and sliders for the Qatnov 3,000-rider plan. Every figure editable." },
  ]}),
  component: Financials,
});

type Row = { label: string; value: number | null; note: string; bold?: boolean; header?: boolean };

const DEFAULT_PNL: Row[] = [
  { label: "Gross delivery revenue", value: 2016000, note: "3,000 riders × 16 drops × 30d × $1.40" },
  { label: "Bike lease revenue", value: 194850, note: "$15/wk × 4.33 wks × 3,000 riders" },
  { label: "Merchant SaaS subscriptions", value: 90000, note: "Phase 2 ramp · ~1,500 merchants × $60" },
  { label: "Total revenue", value: 2300850, note: "", bold: true },
  { label: "Rider payouts", value: -1296000, note: "16 × 30 × $0.90 × 3,000" },
  { label: "Maintenance & fuel support", value: -120000, note: "$40 / rider / mo" },
  { label: "Operations staff", value: -100000, note: "HQ + regional hubs" },
  { label: "Offices & hubs", value: -40000, note: "" },
  { label: "Tech & support", value: -35000, note: "" },
  { label: "Insurance & admin", value: -25000, note: "" },
  { label: "Recruitment & marketing", value: -25000, note: "" },
  { label: "Bike depreciation", value: -90000, note: "Straight-line over ~24 months" },
  { label: "Total operating cost", value: -1731000, note: "", bold: true },
  { label: "Net profit (monthly)", value: 569850, note: "24.8% margin", bold: true },
  { label: "Annualised net profit", value: 6838200, note: "Run-rate", bold: true },
];

const DEFAULT_BALANCE: Row[] = [
  { label: "ASSETS", value: null, note: "", header: true },
  { label: "Motorcycles (3,000 × $1,200)", value: 3600000, note: "Owned fleet" },
  { label: "Spare bikes & parts", value: 300000, note: "~8% spare ratio" },
  { label: "Tech platform", value: 750000, note: "Capitalised dev" },
  { label: "Office & hub fit-out", value: 400000, note: "8 regional hubs" },
  { label: "Working capital / cash", value: 1000000, note: "" },
  { label: "Receivables (Uzum / Yango)", value: 700000, note: "~30 day terms" },
  { label: "Total assets", value: 6750000, note: "", bold: true },
  { label: "LIABILITIES & EQUITY", value: null, note: "", header: true },
  { label: "Bike financing facility", value: 1900000, note: "" },
  { label: "Trade payables", value: 250000, note: "" },
  { label: "Deferred merchant revenue", value: 100000, note: "" },
  { label: "Equity & retained earnings", value: 4500000, note: "" },
  { label: "Total liabilities & equity", value: 6750000, note: "", bold: true },
];

type CashRow = { month: string; inflow: number; outflow: number };
const DEFAULT_CASH: CashRow[] = [
  { month: "M1", inflow: 230000, outflow: 610000 },
  { month: "M2", inflow: 410000, outflow: 685000 },
  { month: "M3", inflow: 650000, outflow: 840000 },
  { month: "M4", inflow: 990000, outflow: 1040000 },
  { month: "M5", inflow: 1240000, outflow: 1190000 },
  { month: "M6", inflow: 1500000, outflow: 1335000 },
  { month: "M7", inflow: 1720000, outflow: 1450000 },
  { month: "M8", inflow: 1890000, outflow: 1545000 },
  { month: "M9", inflow: 2060000, outflow: 1625000 },
  { month: "M10", inflow: 2170000, outflow: 1680000 },
  { month: "M11", inflow: 2240000, outflow: 1710000 },
  { month: "M12", inflow: 2300850, outflow: 1731000 },
];

function Financials() {
  const { m } = useCurrency();
  const [pnl, setPnl] = useState<Row[]>(DEFAULT_PNL);
  const [balance, setBalance] = useState<Row[]>(DEFAULT_BALANCE);
  const [cash, setCash] = useState<CashRow[]>(DEFAULT_CASH);

  const updateRow = (
    rows: Row[],
    setRows: (r: Row[]) => void,
    idx: number,
    v: number,
  ) => setRows(rows.map((r, i) => (i === idx ? { ...r, value: v } : r)));

  const updateCash = (idx: number, key: "inflow" | "outflow", v: number) =>
    setCash(cash.map((r, i) => (i === idx ? { ...r, [key]: v } : r)));

  // Running cumulative cash position.
  let cumulative = 0;
  const cashWithNet = cash.map((r) => {
    const net = r.inflow - r.outflow;
    cumulative += net;
    return { ...r, net, cumulative };
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <header className="mb-8 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Financial model</div>
        <h1 className="mt-3 text-5xl font-display font-semibold">P&L, balance sheet & cash flow.</h1>
        <p className="mt-4 text-muted-foreground">
          Pull the sliders below — or click <span className="text-primary font-mono">any number</span> in the tables to edit it directly. Hover a cell to step it up or down.
        </p>
      </header>

      <Disclaimer className="mb-10" />

      <FinancialsModel />

      {/* P&L */}
      <section className="mt-20">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-display font-semibold">Profit & loss · monthly</h2>
          <button onClick={() => setPnl(DEFAULT_PNL)} className="text-xs text-muted-foreground hover:text-primary">Reset</button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Click any value to type a new one. Hover for ▲ / ▼ steppers.</p>
        <div className="mt-5 glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {pnl.map((r, i) => (
                <tr key={i} className={`border-b border-border/30 last:border-0 ${r.bold ? "bg-surface/40 font-semibold" : ""}`}>
                  <td className="px-5 py-3.5">{r.label}</td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">{r.note}</td>
                  <td className="px-5 py-3.5 text-right">
                    {r.value !== null && (
                      <EditableMoney
                        value={r.value}
                        onChange={(v) => updateRow(pnl, setPnl, i, v)}
                        step={r.bold ? 50000 : 10000}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Balance sheet */}
      <section className="mt-16">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-display font-semibold">Balance sheet · at scale</h2>
          <button onClick={() => setBalance(DEFAULT_BALANCE)} className="text-xs text-muted-foreground hover:text-primary">Reset</button>
        </div>
        <div className="mt-5 glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {balance.map((r, i) => (
                <tr key={i} className={`border-b border-border/30 last:border-0 ${r.header ? "bg-surface/40 font-semibold uppercase text-xs tracking-wider" : ""} ${r.bold ? "bg-surface/40 font-semibold" : ""}`}>
                  <td className="px-5 py-3.5">{r.label}</td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">{r.note}</td>
                  <td className="px-5 py-3.5 text-right">
                    {r.value !== null && (
                      <EditableMoney
                        value={r.value}
                        onChange={(v) => updateRow(balance, setBalance, i, v)}
                        step={r.bold ? 100000 : 25000}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Cash flow */}
      <section className="mt-16 mb-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-display font-semibold">12-month cash flow forecast</h2>
          <button onClick={() => setCash(DEFAULT_CASH)} className="text-xs text-muted-foreground hover:text-primary">Reset</button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Inflow and outflow are editable. Net and cumulative recalculate live.</p>
        <div className="mt-5 glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface/60 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 text-left font-medium">Month</th>
                <th className="px-5 py-3 text-right font-medium">Inflow</th>
                <th className="px-5 py-3 text-right font-medium">Outflow</th>
                <th className="px-5 py-3 text-right font-medium">Net</th>
                <th className="px-5 py-3 text-right font-medium">Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {cashWithNet.map((r, i) => (
                <tr key={r.month} className="border-b border-border/30 last:border-0">
                  <td className="px-5 py-3.5 font-mono text-primary">{r.month}</td>
                  <td className="px-5 py-3.5 text-right">
                    <EditableMoney value={r.inflow} onChange={(v) => updateCash(i, "inflow", v)} step={25000} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <EditableMoney value={r.outflow} onChange={(v) => updateCash(i, "outflow", v)} step={25000} />
                  </td>
                  <td className={`px-5 py-3.5 text-right font-mono tabular-nums ${r.net < 0 ? "text-destructive/90" : ""}`}>
                    {(r.net < 0 ? "−" : "") + m(Math.abs(r.net))}
                  </td>
                  <td className={`px-5 py-3.5 text-right font-mono tabular-nums font-semibold ${r.cumulative < 0 ? "text-destructive/90" : "text-primary"}`}>
                    {(r.cumulative < 0 ? "−" : "") + m(Math.abs(r.cumulative))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Cumulative position updates instantly as you edit each month.</p>
      </section>
    </div>
  );
}
