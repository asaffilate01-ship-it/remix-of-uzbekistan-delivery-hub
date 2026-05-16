import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bike, Store, Users, BarChart3, Map, Bell, Activity, Wallet, Settings, ChevronRight,
} from "lucide-react";
import { num } from "@/lib/format";
import { useCurrency } from "@/lib/currency";

export const Route = createFileRoute("/platform")({
  head: () => ({ meta: [
    { title: "Fleet Platform — Qatnov" },
    { name: "description", content: "Investor demo of the fleet management platform: rider tracking, SLA monitoring, dispatch and merchant tools." },
  ]}),
  component: Platform,
});

type Tab = "dispatch" | "riders" | "merchants" | "analytics";

const riders = [
  { id: "RDR-2841", name: "Akmal R.", city: "Tashkent", drops: 18, sla: 98, status: "active", earnings: 12.4 },
  { id: "RDR-2842", name: "Sherzod K.", city: "Tashkent", drops: 22, sla: 99, status: "active", earnings: 15.1 },
  { id: "RDR-2843", name: "Bobur M.", city: "Samarkand", drops: 14, sla: 95, status: "active", earnings: 9.8 },
  { id: "RDR-2844", name: "Jasur T.", city: "Tashkent", drops: 19, sla: 92, status: "break", earnings: 13.2 },
  { id: "RDR-2845", name: "Rustam O.", city: "Namangan", drops: 16, sla: 97, status: "active", earnings: 11.0 },
  { id: "RDR-2846", name: "Doniyor S.", city: "Andijan", drops: 21, sla: 100, status: "active", earnings: 14.7 },
  { id: "RDR-2847", name: "Aziz N.", city: "Tashkent", drops: 12, sla: 88, status: "issue", earnings: 8.1 },
  { id: "RDR-2848", name: "Iskander L.", city: "Fergana", drops: 20, sla: 99, status: "active", earnings: 13.9 },
];

const merchants = [
  { name: "Choyxona Navat", type: "Restaurant", orders: 1240, gmv: 8600, plan: "Pro" },
  { name: "Korzinka.uz", type: "Grocery", orders: 5810, gmv: 41200, plan: "Enterprise" },
  { name: "Apteka Karavan", type: "Pharmacy", orders: 720, gmv: 4900, plan: "Standard" },
  { name: "Evos Burger", type: "Restaurant", orders: 3120, gmv: 18700, plan: "Pro" },
  { name: "Makro Express", type: "Grocery", orders: 2050, gmv: 14300, plan: "Pro" },
];

function Platform() {
  const [tab, setTab] = useState<Tab>("dispatch");

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-primary">Fleet management OS</div>
          <h1 className="mt-3 text-4xl md:text-5xl font-display font-semibold">platform<span className="text-primary">.</span>qatnov</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">Interactive preview of the fleet, dispatch and merchant operating system — inspired by what we use internally.</p>
        </div>
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← back to overview</Link>
      </header>

      <div className="glass rounded-3xl overflow-hidden border border-border/60">
        {/* App chrome */}
        <div className="flex items-center justify-between border-b border-border/40 px-5 py-3 bg-surface/40">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-destructive/60" />
              <span className="h-3 w-3 rounded-full bg-gold/60" />
              <span className="h-3 w-3 rounded-full bg-primary/60" />
            </div>
            <div className="ml-4 font-mono text-xs text-muted-foreground">platform.qatnov.uz / dashboard</div>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-3">
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" /> demo</span>
            <span>admin@qatnov.uz</span>
          </div>
        </div>

        <div className="grid md:grid-cols-[220px_1fr] min-h-[680px]">
          {/* Sidebar */}
          <aside className="border-r border-border/40 bg-surface/30 p-3">
            <div className="space-y-1">
              {[
                { id: "dispatch", icon: Map, label: "Dispatch" },
                { id: "riders", icon: Bike, label: "Riders" },
                { id: "merchants", icon: Store, label: "Merchants" },
                { id: "analytics", icon: BarChart3, label: "Analytics" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setTab(s.id as Tab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${tab === s.id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-surface/60"}`}
                >
                  <s.icon className="h-4 w-4" /> {s.label}
                </button>
              ))}
            </div>
            <div className="border-t border-border/40 my-4" />
            <div className="space-y-1">
              {[
                { icon: Bell, label: "Incidents", badge: 3 },
                { icon: Wallet, label: "Finance" },
                { icon: Settings, label: "Settings" },
              ].map((s) => (
                <button key={s.label} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-surface/60">
                  <s.icon className="h-4 w-4" /> <span className="flex-1 text-left">{s.label}</span>
                  {s.badge && <span className="text-[10px] bg-destructive text-destructive-foreground rounded-full px-1.5">{s.badge}</span>}
                </button>
              ))}
            </div>
          </aside>

          {/* Content */}
          <div className="p-6">
            {tab === "dispatch" && <Dispatch />}
            {tab === "riders" && <Riders />}
            {tab === "merchants" && <Merchants />}
            {tab === "analytics" && <Analytics />}
          </div>
        </div>
      </div>

      {/* User apps */}
      <section className="mt-20">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Apps for every user</div>
        <h2 className="mt-3 text-3xl md:text-4xl font-display font-semibold">One platform, four front doors.</h2>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { i: Bike, t: "Rider app", f: ["KYC onboarding", "Active orders & navigation", "Earnings & wallet", "Shift scheduling", "Maintenance alerts"] },
            { i: Store, t: "Merchant app", f: ["POS & KDS", "Inventory & menus", "CRM & loyalty", "QR & WhatsApp ordering", "Analytics"] },
            { i: Activity, t: "Fleet dashboard", f: ["Maps & SLA tracking", "Dispatch analytics", "Profitability per rider", "Incident management", "City heat maps"] },
            { i: Users, t: "Customer app", f: ["Food & grocery", "Pharmacy delivery", "Wallet & loyalty", "Subscriptions", "Tracking & support"] },
          ].map(({ i: Icon, t, f }) => (
            <div key={t} className="glass rounded-2xl p-6">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-gold/20 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-4 font-display text-lg font-semibold">{t}</div>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {f.map((x) => <li key={x} className="flex gap-2"><ChevronRight className="h-3.5 w-3.5 text-primary mt-0.5" />{x}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Dispatch() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: "Target orders", v: "1,200", t: "day 1 goal" },
          { l: "Riders planned", v: "500", t: "phase 1" },
          { l: "Target ETA", v: "22 min", t: "benchmark" },
          { l: "Target SLA", v: "96%", t: "benchmark" },
        ].map((k) => (
          <div key={k.l} className="rounded-xl border border-border/40 bg-surface/40 p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.l}</div>
            <div className="mt-1 text-2xl font-display font-semibold">{k.v}</div>
            <div className="text-xs text-primary">{k.t}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border/40 bg-surface/30 p-5 relative overflow-hidden min-h-[280px]">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="font-display font-semibold">Tashkent · planned coverage</div>
            <div className="text-xs text-muted-foreground font-mono">41.3111° N, 69.2797° E</div>
          </div>
          <div className="relative h-[230px]">
            {[
              [12, 22], [28, 35], [45, 18], [55, 50], [70, 30], [80, 60], [35, 65], [20, 70], [62, 12], [88, 42],
            ].map(([x, y], i) => (
              <span key={i}
                className={`absolute h-2.5 w-2.5 rounded-full ${i % 3 === 0 ? "bg-gold" : "bg-primary"} ring-4 ${i % 3 === 0 ? "ring-gold/20" : "ring-primary/20"}`}
                style={{ left: `${x}%`, top: `${y}%` }}
              />
            ))}
            <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 12 22 Q 35 30 45 18" stroke="oklch(0.78 0.17 165 / 0.5)" strokeDasharray="2 2" fill="none" />
              <path d="M 55 50 Q 65 40 70 30" stroke="oklch(0.78 0.17 165 / 0.5)" strokeDasharray="2 2" fill="none" />
              <path d="M 20 70 Q 30 65 35 65" stroke="oklch(0.82 0.14 80 / 0.5)" strokeDasharray="2 2" fill="none" />
            </svg>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-border/40 overflow-hidden">
        <div className="bg-surface/60 px-4 py-2.5 text-xs uppercase tracking-wider text-muted-foreground">Demo order queue</div>
        <div className="divide-y divide-border/30">
          {[
            ["ORD-94821", "Choyxona Navat → Mirzo Ulug'bek", "12 min", "Akmal R."],
            ["ORD-94822", "Evos Burger → Yunusabad", "18 min", "Sherzod K."],
            ["ORD-94823", "Korzinka.uz → Chilonzor", "26 min", "Auto-assigning…"],
            ["ORD-94824", "Apteka → Yashnobod", "9 min", "Doniyor S."],
          ].map(([id, route, eta, rider]) => (
            <div key={id} className="grid grid-cols-12 gap-3 px-4 py-3 text-sm">
              <div className="col-span-2 font-mono text-primary">{id}</div>
              <div className="col-span-6">{route}</div>
              <div className="col-span-2 text-muted-foreground">{eta}</div>
              <div className="col-span-2 text-muted-foreground">{rider}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Riders() {
  const { m } = useCurrency();
  return (
    <div className="rounded-xl border border-border/40 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-surface/60">
          <tr className="text-xs uppercase tracking-wider text-muted-foreground">
            <th className="px-4 py-3 text-left font-medium">ID</th>
            <th className="px-4 py-3 text-left font-medium">Rider</th>
            <th className="px-4 py-3 text-left font-medium">City</th>
            <th className="px-4 py-3 text-right font-medium">Drops</th>
            <th className="px-4 py-3 text-right font-medium">SLA</th>
            <th className="px-4 py-3 text-right font-medium">Earnings (today)</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {riders.map((r) => (
            <tr key={r.id} className="hover:bg-surface/30">
              <td className="px-4 py-3 font-mono text-primary">{r.id}</td>
              <td className="px-4 py-3">{r.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{r.city}</td>
              <td className="px-4 py-3 text-right font-mono">{r.drops}</td>
              <td className="px-4 py-3 text-right font-mono">{r.sla}%</td>
              <td className="px-4 py-3 text-right font-mono">{m(r.earnings, { decimals: 2 })}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  r.status === "active" ? "bg-primary/15 text-primary" :
                  r.status === "break" ? "bg-gold/15 text-gold" : "bg-destructive/15 text-destructive"
                }`}>{r.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Merchants() {
  const { m: fmt } = useCurrency();
  return (
    <div className="rounded-xl border border-border/40 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-surface/60">
          <tr className="text-xs uppercase tracking-wider text-muted-foreground">
            <th className="px-4 py-3 text-left font-medium">Merchant</th>
            <th className="px-4 py-3 text-left font-medium">Type</th>
            <th className="px-4 py-3 text-right font-medium">Orders (30d)</th>
            <th className="px-4 py-3 text-right font-medium">GMV</th>
            <th className="px-4 py-3 text-left font-medium">Plan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {merchants.map((mc) => (
            <tr key={mc.name} className="hover:bg-surface/30">
              <td className="px-4 py-3 font-medium">{mc.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{mc.type}</td>
              <td className="px-4 py-3 text-right font-mono">{num(mc.orders)}</td>
              <td className="px-4 py-3 text-right font-mono">{fmt(mc.gmv)}</td>
              <td className="px-4 py-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary">{mc.plan}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Analytics() {
  const { m } = useCurrency();
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {[
        { t: "Deliveries / day", v: "4,000", trend: [40, 55, 48, 62, 70, 65, 78] },
        { t: "Avg revenue / drop", v: m(1.4, { decimals: 2 }), trend: [30, 35, 38, 42, 45, 48, 50] },
        { t: "Active merchants", v: "120", trend: [20, 30, 40, 55, 65, 75, 90] },
        { t: "Net margin %", v: "22%", trend: [10, 18, 22, 25, 27, 28, 30] },
      ].map((c) => (
        <div key={c.t} className="rounded-xl border border-border/40 bg-surface/40 p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.t}</div>
          <div className="mt-1 text-3xl font-display font-semibold">{c.v}</div>
          <div className="mt-4 flex items-end gap-1 h-16">
            {c.trend.map((h, i) => (
              <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-primary/20 to-primary" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
