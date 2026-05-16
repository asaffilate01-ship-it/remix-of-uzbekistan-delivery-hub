import { createFileRoute } from "@tanstack/react-router";
import { FinancialsModel } from "@/components/financials/FinancialsModel";
import { useCurrency, Disclaimer } from "@/lib/currency";

export const Route = createFileRoute("/financials")({
  head: () => ({ meta: [
    { title: "Financial Model — Qatnov" },
    { name: "description", content: "Interactive P&L, balance sheet, cash flow and sliders for the Qatnov 3,000-rider plan." },
  ]}),
  component: Financials,
});

// All amounts are USD. UZS view converts via the FX rate set in the header.
const pnl: ReadonlyArray<readonly [string, number | null, string, boolean?]> = [
  ["Gross delivery revenue", 2016000, "3,000 riders × 16 drops × 30d × $1.40"],
  ["Bike lease revenue", 194850, "$15/wk × 4.33 wks × 3,000 riders"],
  ["Merchant SaaS subscriptions", 90000, "Phase 2 ramp · ~1,500 merchants × $60"],
  ["Total revenue", 2300850, "", true],
  ["Rider payouts", -1296000, "16 × 30 × $0.90 × 3,000"],
  ["Maintenance & fuel support", -120000, "$40 / rider / mo"],
  ["Operations staff", -100000, "HQ + regional hubs"],
  ["Offices & hubs", -40000, ""],
  ["Tech & support", -35000, ""],
  ["Insurance & admin", -25000, ""],
  ["Recruitment & marketing", -25000, ""],
  ["Bike depreciation", -90000, "Straight-line over ~24 months"],
  ["Total operating cost", -1731000, "", true],
  ["Net profit (monthly)", 569850, "24.8% margin", true],
  ["Annualised net profit", 6838200, "Run-rate", true],
];

const balance: ReadonlyArray<readonly [string, number | null, string, boolean?]> = [
  ["ASSETS", null, "", true],
  ["Motorcycles (3,000 × $1,200)", 3600000, "Owned fleet"],
  ["Spare bikes & parts", 300000, "~8% spare ratio"],
  ["Tech platform", 750000, "Capitalised dev"],
  ["Office & hub fit-out", 400000, "8 regional hubs"],
  ["Working capital / cash", 1000000, ""],
  ["Receivables (Uzum / Yango)", 700000, "~30 day terms"],
  ["Total assets", 6750000, "", true],
  ["LIABILITIES & EQUITY", null, "", true],
  ["Bike financing facility", 1900000, ""],
  ["Trade payables", 250000, ""],
  ["Deferred merchant revenue", 100000, ""],
  ["Equity & retained earnings", 4500000, ""],
  ["Total liabilities & equity", 6750000, "", true],
];

const cashflow = [
  ["Month", "Inflow", "Outflow", "Net", "Cumulative"],
  ["M1", 230000, 610000, -380000, -380000],
  ["M2", 410000, 685000, -275000, -655000],
  ["M3", 650000, 840000, -190000, -845000],
  ["M4", 990000, 1040000, -50000, -895000],
  ["M6", 1500000, 1335000, 165000, -610000],
  ["M9", 2060000, 1625000, 435000, 450000],
  ["M12", 2300850, 1731000, 569850, 2720000],
] as const;

function Financials() {
  const { m } = useCurrency();
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <header className="mb-8 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Financial model</div>
        <h1 className="mt-3 text-5xl font-display font-semibold">P&L, balance sheet & cash flow.</h1>
        <p className="mt-4 text-muted-foreground">
          The model below is fully interactive — pull the sliders to stress-test riders, delivery volume, payouts and overheads.
          Tables underneath reflect a baseline 3,000-rider scenario.
        </p>
      </header>

      <Disclaimer className="mb-10" />

      <FinancialsModel />

      {/* P&L */}
      <section className="mt-20">
        <h2 className="text-2xl font-display font-semibold">Profit & loss · monthly</h2>
        <p className="text-xs text-muted-foreground mt-1">Default scenario — change defaults via the sliders above.</p>
        <div className="mt-5 glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {pnl.map(([label, val, note, bold], i) => (
                <tr key={i} className={`border-b border-border/30 last:border-0 ${bold ? "bg-surface/40 font-semibold" : ""}`}>
                  <td className="px-5 py-3.5">{label}</td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">{note}</td>
                  <td className={`px-5 py-3.5 text-right font-mono ${typeof val === "number" && val < 0 ? "text-destructive/90" : ""}`}>
                    {typeof val === "number" ? m(Math.abs(val)).replace(/^/, val < 0 ? "−" : "") : ""}
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
                  <td className="px-5 py-3.5">{label}</td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">{note}</td>
                  <td className="px-5 py-3.5 text-right font-mono">{typeof val === "number" ? m(val) : ""}</td>
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
                      {j === 0 ? c : (typeof c === "number" ? (c < 0 ? "−" : "") + m(Math.abs(c)) : c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Illustrative — cash positive ~month 6, cumulative break-even ~month 9 on the default scenario.</p>
      </section>
    </div>
  );
}
