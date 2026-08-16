import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bike, Store, Users, BarChart3, Map as MapIcon, Bell, Activity, Wallet, Settings, ChevronRight,
  Shield, FileCheck, Calendar, Fuel, Wrench, MessageSquare, Layers, Building2,
  ArrowRight, Lock,
} from "lucide-react";
import { num } from "@/lib/format";
import { useCurrency } from "@/lib/currency";

export const Route = createFileRoute("/platform")({
  head: () => ({
    meta: [
      { title: "Operating Platform — Qatnov" },
      { name: "description", content: "Qatnov's proprietary fleet operating platform: bikes, riders, merchants, compliance, payroll and analytics — built for our own operations." },
      { property: "og:title", content: "Operating Platform — Qatnov" },
      { property: "og:description", content: "Dispatch, riders, merchants and analytics — Qatnov's proprietary operations platform." },
      { property: "og:url", content: "https://uzbek-delivery-flow.lovable.app/platform" },
    ],
    links: [{ rel: "canonical", href: "https://uzbek-delivery-flow.lovable.app/platform" }],
  }),
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

const heroStats = [
  { icon: Building2, v: "500+", l: "Target operators" },
  { icon: Users, v: "500", l: "Riders at launch" },
  { icon: Bike, v: "3,000", l: "Bikes by month 18" },
  { icon: Shield, v: "99.9%", l: "Uptime SLA" },
];

const features = [
  { i: Bike, t: "Fleet Management", d: "Track every bike — registration, insurance, permits, maintenance and mileage in one place." },
  { i: Users, t: "Rider Management", d: "Onboard riders with full KYC, document expiry alerts and performance scorecards." },
  { i: Store, t: "Merchant Portal", d: "Manage contracts with restaurants, groceries and pharmacies with automated invoicing." },
  { i: Calendar, t: "Gantt Scheduling", d: "Visual shift scheduling with day/week/month views, absence tracking and holidays." },
  { i: BarChart3, t: "Real-Time Analytics", d: "Revenue, expenses, trip KPIs, fuel and profitability reports with CSV/PDF export." },
  { i: FileCheck, t: "Compliance & KYC", d: "Licences, permits and IDs — automated expiry alerts so we never miss a renewal." },
  { i: Shield, t: "Role-Based Access", d: "Admin, Staff, HR, Finance, Rider, Vendor — each role sees only what they need." },
  { i: Wallet, t: "Financial Suite", d: "Rider payroll, vendor invoicing, expense tracking, fines and fuel cost analysis." },
  { i: Wrench, t: "Maintenance Tracking", d: "Schedule services, track costs and get alerts when vehicles are due for inspection." },
  { i: Bell, t: "Smart Notifications", d: "Document expiry, shift reminders, payment due dates — automated across all channels." },
  { i: Layers, t: "Modular Architecture", d: "Built to scale city by city with isolated data models and per-market configuration." },
  { i: Building2, t: "Multi-City Ready", d: "One codebase, multiple Uzbekistan cities — each with its own fleet, riders and rules." },
];

const categoryFeatures: Record<string, { t: string; d: string }[]> = {
  "Fleet & Vehicles": [
    { t: "Bike & Vehicle Registry", d: "Track every bike — registration, insurance, permits and mileage in one place." },
    { t: "Rental Bike Management", d: "Manage rented bikes with rental company tracking, contracts and payment reconciliation." },
    { t: "Maintenance Tracking", d: "Schedule services, track repair costs and get inspection alerts." },
    { t: "Fuel Log Management", d: "Log fuel per vehicle with cost/litre, odometer readings and station tracking." },
    { t: "Fleet Map & GPS", d: "Visualize the fleet on a live map with route tracking and geofencing." },
    { t: "Accident Reporting", d: "Log accidents with photos, report numbers, insurance claims and repair estimates." },
  ],
  "Riders & HR": [
    { t: "KYC Onboarding", d: "Full document upload, ID verification and registration workflow." },
    { t: "Document Expiry Alerts", d: "Automated reminders for visas, licences and permits." },
    { t: "Performance Scorecards", d: "Track SLA, drops/hour, ratings and earnings per rider." },
    { t: "Shift Scheduling", d: "Gantt-style scheduler with absences, holidays and overtime." },
    { t: "Biometric Attendance", d: "Clock-in / clock-out via mobile with location verification." },
    { t: "Driver Portal", d: "Riders see earnings, shifts, documents and tickets in one app." },
  ],
  "Finance & Payments": [
    { t: "Payroll", d: "Weekly and monthly rider payouts with adjustments and deductions." },
    { t: "Expense Management", d: "Capture receipts, approvals, and project allocation." },
    { t: "Fines & Penalties", d: "Track issued fines, dispute status and rider deductions." },
    { t: "Vendor Invoicing", d: "Generate invoices to merchants with breakdowns and aging." },
    { t: "VAT & Tax Reports", d: "Generate filings ready for Uzbekistan tax authority submission." },
    { t: "Bank Reconciliation", d: "Match bank statements to platform transactions automatically." },
  ],
  "Vendors & Contracts": [
    { t: "Contract Library", d: "Store, version and renew merchant contracts in one place." },
    { t: "SLA Tracking", d: "Per-merchant SLA dashboards with breach alerts." },
    { t: "Pricing Engine", d: "Per-merchant rate cards with surge and zone rules." },
    { t: "Onboarding Flows", d: "Self-serve merchant signup, KYC and menu import." },
  ],
  "Compliance & Security": [
    { t: "Audit Trail", d: "Every action logged with user, timestamp and IP for compliance." },
    { t: "Data Privacy", d: "Data export, deletion and consent management built-in." },
    { t: "Role-Based Access", d: "Granular permissions per role, branch and feature." },
    { t: "Expiry Dashboard", d: "Single view of all documents nearing expiry across the fleet." },
  ],
  "Platform & Infrastructure": [
    { t: "City Isolation", d: "Each city runs its own data layer with shared platform code." },
    { t: "Custom Domain", d: "Each city can run on its own domain with automatic SSL." },
    { t: "API Access", d: "RESTful API and webhooks to plug into existing merchant POS." },
    { t: "Multi-Branch", d: "Operate multiple hubs under one city with branch-level reporting." },
  ],
};

const categories = Object.keys(categoryFeatures);

function Platform() {
  return (
    <div>
      <Hero />
      <FeaturesGrid />
      <CategoryExplorer />
      <LivePreview />
      <UserApps />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      <div className="absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute -bottom-32 -left-32 h-[480px] w-[480px] rounded-full bg-gold/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28 grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs text-primary">
            <Lock className="h-3.5 w-3.5" /> Proprietary Operating Platform
          </div>
          <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-display font-semibold leading-[1.05] tracking-tight">
            Our Operating <span className="bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">Platform</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Bikes, riders, merchants, compliance, payroll and analytics — everything we built to run our own delivery fleet, city by city. Not for resale today.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#demo" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
              See the demo <ArrowRight className="h-4 w-4" />
            </a>
            <Link to="/financials" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-border/60 hover:bg-surface/60 transition">
              Financial model
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {heroStats.map(({ icon: Icon, v, l }) => (
            <div key={l} className="glass rounded-2xl p-6 border border-border/40">
              <Icon className="h-5 w-5 text-primary" />
              <div className="mt-4 text-3xl md:text-4xl font-display font-semibold">{v}</div>
              <div className="text-sm text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesGrid() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Enterprise-Grade Capabilities</div>
        <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold">Built to Run a Fleet at Scale</h2>
        <p className="mt-4 text-muted-foreground">From onboarding our first rider to managing thousands of bikes — every tool we need, in one stack.</p>
      </div>
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map(({ i: Icon, t, d }) => (
          <div key={t} className="group glass rounded-2xl p-6 border border-border/40 hover:border-primary/40 transition">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-gold/20 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-4 font-display text-lg font-semibold">{t}</div>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CategoryExplorer() {
  const [active, setActive] = useState(categories[0]);
  return (
    <section className="border-y border-border/40 bg-surface/20">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary">45+ Features</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold">Explore Every Module</h2>
            <p className="mt-3 text-muted-foreground">Click any category to see the capabilities we have built into our stack.</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-4 py-2 rounded-full text-sm border transition ${active === c ? "bg-primary text-primary-foreground border-primary" : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-surface/60"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categoryFeatures[active].map((f) => (
            <div key={f.t} className="rounded-2xl border border-border/40 bg-background/40 p-6">
              <div className="font-display text-lg font-semibold">{f.t}</div>
              <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UserApps() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-xs uppercase tracking-[0.2em] text-primary">Apps for every user</div>
      <h2 className="mt-3 text-3xl md:text-4xl font-display font-semibold">One platform, four front doors.</h2>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { i: Bike, t: "Rider app", f: ["KYC onboarding", "Active orders & navigation", "Earnings & wallet", "Shift scheduling", "Maintenance alerts"] },
          { i: Store, t: "Merchant app", f: ["POS & KDS", "Inventory & menus", "CRM & loyalty", "QR & WhatsApp ordering", "Analytics"] },
          { i: Activity, t: "Fleet dashboard", f: ["Maps & SLA tracking", "Dispatch analytics", "Profitability per rider", "Incident management", "City heat maps"] },
          { i: Users, t: "Customer app", f: ["Food & grocery", "Pharmacy delivery", "Wallet & loyalty", "Subscriptions", "Tracking & support"] },
        ].map(({ i: Icon, t, f }) => (
          <div key={t} className="glass rounded-2xl p-6 border border-border/40">
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
  );
}

function LivePreview() {
  const [tab, setTab] = useState<Tab>("dispatch");
  return (
    <section id="demo" className="border-y border-border/40 bg-surface/20">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary">Interactive preview</div>
            <h2 className="mt-3 text-3xl md:text-4xl font-display font-semibold">platform<span className="text-primary">.</span>qatnov</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl">A look at the fleet, dispatch and merchant operating system we use internally.</p>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← back to overview</Link>
        </div>

        <div className="glass rounded-3xl overflow-hidden border border-border/60">
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
                  { icon: MessageSquare, label: "Messages" },
                  { icon: Fuel, label: "Fuel" },
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

            <div className="p-6">
              {tab === "dispatch" && <Dispatch />}
              {tab === "riders" && <Riders />}
              {tab === "merchants" && <Merchants />}
              {tab === "analytics" && <Analytics />}
            </div>
          </div>
        </div>
      </div>
    </section>
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
