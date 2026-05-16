import { createFileRoute } from "@tanstack/react-router";
import { FinancialsModel } from "@/components/financials/FinancialsModel";
import { gbp } from "@/lib/format";

export const Route = createFileRoute("/financials")({
  head: () => ({ meta: [
    { title: "Financial Model — Qatnov" },
    { name: "description", content: "Interactive P&L, balance sheet, cash flow and sliders for the Qatnov 3,000-rider plan." },
  ]}),
  component: Financials,
});

const pnl = [
  ["Gross delivery revenue", 1584000, "3,000 riders × 16 drops × 30d × £1.10"],
  ["Bike lease revenue", 155880, "£12/wk × 4.33 wks × 3,000 riders"],
  ["Merchant SaaS subscriptions", 90000, "Phase 2 ramp, ~1,500 merchants × £60"],
  ["Total revenue", 1829880, "", true],
  ["Rider payouts", -1008000, "16 × 30 × £0.70 × 3,000"],
  ["Maintenance & fuel support", -90000, "£30 / rider / mo"],
  ["Operations staff", -80000, "HQ + regional hubs"],
  ["Offices & hubs", -30000, ""],
  ["Tech & support", -25000, ""],
  ["Insurance & admin", -20000, ""],
  ["Recruitment & marketing", -20000, ""],
  ["Bike depreciation", -70000, "Straight-line over 24 months"],
  ["Total operating cost", -1343000, "", true],
  ["Net profit (monthly)", 486880, "26.6% margin", true],
  ["Annualised net profit", 5842560, "Run-rate", true],
] as const;

const balance = [
  ["ASSETS", null, null, true],
  ["Motorcycles (3,000 × £950)", 2850000, "Owned fleet"],
  ["Spare bikes & parts", 240000, "8% spare ratio"],
  ["Tech platform", 600000, "Capitalised dev"],
  ["Office & hub fit-out", 320000, "8 regional hubs"],
  ["Working capital / cash", 800000, ""],
  ["Receivables (Uzum/Yango)", 540000, "~30 day terms"],
  ["Total assets", 5350000, "", true],
  ["LIABILITIES & EQUITY", null, null, true],
  ["Bike financing facility", 1500000, ""],
  ["Trade payables", 200000, ""],
  ["Deferred merchant revenue", 75000, ""],
  ["Equity & retained earnings", 3575000, ""],
  ["Total liabilities & equity", 5350000, "", true],
] as const;

const cashflow = [
  ["Month", "Inflow", "Outflow", "Net", "Cumulative"],
  ["M1", 180000, 480000, -300000, -300000],
  ["M2", 320000, 540000, -220000, -520000],
  ["M3", 510000, 660000, -150000, -670000],
  ["M4", 780000, 820000, -40000, -710000],
  ["M6", 1180000, 1050000, 130000, -480000],
  ["M9", 1620000, 1280000, 340000, 360000],
  ["M12", 1829880, 1343000, 486880, 2150000],
] as const;

function Financials() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <header className="mb-12 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Financial model</div>
        <h1 className="mt-3 text-5xl font-display font-semibold">P&L, balance sheet & cash flow.</h1>
        <p className="mt-4 text-muted-foreground">
          The model below is fully interactive — pull the sliders to stress-test riders, delivery volume, payouts and overheads.
          Tables underneath reflect a baseline 3,000-rider scenario.
        </p>
      </header>

      <FinancialsModel />

      {/* P&L */}
      <section className="mt-20">
        <h2 className="text-2xl font-display font-semibold">Profit & loss · monthly (£)</h2>
        <div className="mt-5 glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {pnl.map(([label, val, note, bold], i) => (
                <tr key={i} className={`border-b border-border/30 last:border-0 ${bold ? "bg-surface/40 font-semibold" : ""}`}>
                  <td className="px-5 py-3.5">{label as string}</td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">{note as string}</td>
                  <td className={`px-5 py-3.5 text-right font-mono ${typeof val === "number" && val < 0 ? "text-destructive/90" : ""}`}>
                    {typeof val === "number" ? gbp(val) : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Balance sheet */}
      <section className="mt-16">
        <h2 className="text-2xl font-display font-semibold">Balance sheet · at scale</h2>
        <div className="mt-5 glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {balance.map(([label, val, note, bold], i) => (
                <tr key={i} className={`border-b border-border/30 last:border-0 ${bold ? "bg-surface/40 font-semibold uppercase text-xs tracking-wider" : ""}`}>
                  <td className="px-5 py-3.5">{label as string}</td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">{note as string ?? ""}</td>
                  <td className="px-5 py-3.5 text-right font-mono">{typeof val === "number" ? gbp(val) : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Cash flow */}
      <section className="mt-16 mb-8">
        <h2 className="text-2xl font-display font-semibold">12-month cash flow forecast</h2>
        <div className="mt-5 glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface/60 text-xs uppercase tracking-wider text-muted-foreground">
                {cashflow[0].map((h) => <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {cashflow.slice(1).map((row, i) => (
                <tr key={i} className="border-b border-border/30 last:border-0">
                  {row.map((c, j) => (
                    <td key={j} className={`px-5 py-3.5 ${j === 0 ? "font-mono text-primary" : "font-mono text-right"} ${j === 3 && typeof c === "number" && c < 0 ? "text-destructive/90" : ""} ${j === 4 ? "font-semibold" : ""}`}>
                      {j === 0 ? c : (typeof c === "number" ? gbp(c) : c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Cash positive from month 6, cumulative break-even ~month 9.</p>
      </section>
    </div>
  );
}
