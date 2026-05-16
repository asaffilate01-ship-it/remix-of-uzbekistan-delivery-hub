import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Disclaimer, EditableMoney } from "@/lib/currency";

export const Route = createFileRoute("/business-plan")({
  head: () => ({ meta: [
    { title: "Business Plan — Qatnov" },
    { name: "description", content: "Full strategic plan: phased rollout, market opportunity, technology, risks and exit." },
  ]}),
  component: BusinessPlan,
});

const phases = [
  { p: "Phase 1", t: "Delivery Fleet Infrastructure", d: "6–12 months · 300–500 riders · Tashkent + Samarkand. Integrate with Uzum/Yango, onboard restaurants, validate unit economics.", color: "primary" },
  { p: "Phase 2", t: "Merchant SaaS Expansion", d: "12–24 months · POS, KDS, CRM, loyalty, analytics, QR ordering, white-label direct ordering. Recurring monthly subscriptions.", color: "gold" },
  { p: "Phase 3", t: "Scale Fleet", d: "3,000 riders, 25+ cities. Add dark stores, grocery, pharmacy, B2B courier logistics.", color: "primary" },
  { p: "Phase 4", t: "Own Marketplace", d: "Launch direct consumer ordering app with subscription-based merchant plans and lower commissions than incumbents.", color: "gold" },
  { p: "Phase 5", t: "Fintech Ecosystem", d: "Rider & motorcycle financing, merchant loans, wallets, SoftPOS, insurance.", color: "primary" },
];

const sections = [
  { h: "Executive summary", body: "Build Uzbekistan's leading delivery fleet, rider management, restaurant technology, merchant OS and logistics SaaS. Initially leverage Uzum and Yango for order volume and customer demand — becoming the infrastructure layer powering delivery rather than competing for end-user attention. This dramatically reduces customer acquisition costs, marketing burn and adoption risk." },
  { h: "Core business model", body: "Four divisions built sequentially: (1) Fleet Operations 3PL — riders, motorcycles, dispatch and SLA management for Uzum, Yango, restaurants, pharmacies, supermarkets and e-commerce sellers. (2) Merchant Technology — POS, KDS, CRM, loyalty, analytics, QR ordering, direct ordering apps, white-label storefronts. (3) Marketplace — own food, grocery, courier and pharmacy delivery apps. (4) Fintech — rider financing, motorcycle leasing, merchant finance, SoftPOS, wallets, QR payments and insurance." },
  { h: "Market opportunity", body: "~38M population. Tashkent (3–4M), Samarkand (1.3M), Namangan (1M+), Andijan (800K+), Fergana, Bukhara. Rapidly growing smartphone usage, digital payments, food delivery, e-commerce, social commerce and urbanisation. Restaurants remain under-digitised — a generational SaaS opportunity." },
  { h: "Strategic advantage", body: "Instead of spending millions acquiring customers, use Uzum/Yango demand initially to build merchant relationships, rider network, logistics operations and merchant software ecosystem. Then migrate merchants toward direct ordering and gradually build the own marketplace." },
  { h: "Revenue model", body: "Delivery margins (platform pays ~$1.00–$2.30 / drop, rider receives $0.65–$1.50, fleet keeps the spread). Motorcycle leasing ($10–$25 / rider / week). Rider financing ($1,200 bike financed for $1,900+). Merchant SaaS subscriptions. Dedicated fleet contracts for grocery chains, pharmacies, restaurants, marketplaces. Advertising on bike branding, delivery boxes and merchant promotions." },
  { h: "Technology platform", body: "Rider app (onboarding/KYC, live orders, wallet, earnings, shifts, GPS, support, rider scoring, maintenance alerts). Merchant platform (POS, KDS, CRM, loyalty, inventory, analytics, direct ordering, QR menus, WhatsApp ordering). Fleet dashboard (live maps, rider tracking, SLA monitoring, dispatch analytics, profitability, rider utilisation, incident management). Dispatch engine (auto-assignment, batching, route optimisation, surge pricing, heat maps, ETA prediction)." },
  { h: "Tech stack", body: "React Native + Next.js frontends. Python FastAPI + Supabase + PostgreSQL + Edge Functions backend. AWS, Redis, WebSockets, Cloudflare infrastructure. Google Maps initially → Yandex Maps later. AI layer for fraud detection, ETA prediction, rider optimisation, demand forecasting, merchant insights." },
  { h: "Operations", body: "HQ in Tashkent handles finance, dispatch, support, onboarding, compliance and analytics. Regional hubs in each city handle bike servicing, rider onboarding, spare bikes, maintenance and local support." },
  { h: "Risks", body: "Operational: rider fraud, theft, accidents, churn, fake deliveries. Financial: delayed platform payouts, fuel inflation, bike maintenance. Strategic: overdependence on a single platform, regulatory changes, price wars." },
  { h: "Exit potential", body: "Logistics infrastructure becomes extremely valuable. Potential acquirers: Uzum, Yango, regional super apps, fintech companies, marketplace operators, regional logistics consolidators." },
  { h: "Long-term vision", body: "Becomes Uzbekistan's logistics operating system: fleets, riders, merchant tech, payments, financing, marketplace infrastructure, last-mile logistics, delivery SaaS and fintech ecosystem — not just a delivery company." },
];

type LaunchRow = { label: string; value: number; bold?: boolean };
const DEFAULT_LAUNCH: LaunchRow[] = [
  { label: "Bikes (500 × $1,490)", value: 745000 },
  { label: "Spare bikes", value: 75000 },
  { label: "Operations centre (Tashkent)", value: 125000 },
  { label: "Regional hubs", value: 150000 },
  { label: "Tech development", value: 320000 },
  { label: "Initial staff", value: 150000 },
  { label: "Working capital", value: 380000 },
  { label: "Total launch capital", value: 1945000, bold: true },
  { label: "Full 3,000-rider ecosystem", value: 7000000, bold: true },
];

function BusinessPlan() {
  const [launch, setLaunch] = useState<LaunchRow[]>(DEFAULT_LAUNCH);
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-8">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Strategic plan</div>
        <h1 className="mt-3 text-5xl font-display font-semibold">The 3PL + Merchant SaaS + Logistics Platform.</h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-3xl">A five-phase rollout from rider infrastructure to a full logistics operating system — built around Uzbekistan's demand, demographics and digital trajectory.</p>
      </header>

      <Disclaimer className="mb-10" />

      {/* Phases timeline */}
      <section className="relative mb-20">
        <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-gold to-transparent" />
        <div className="space-y-5">
          {phases.map((p, i) => (
            <div key={p.p} className="relative pl-12">
              <div className={`absolute left-0 top-2 h-8 w-8 rounded-full flex items-center justify-center font-mono text-xs ${p.color === "primary" ? "bg-primary text-primary-foreground" : "bg-gold text-gold-foreground"} ring-4 ring-background`}>
                {i + 1}
              </div>
              <div className="glass rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground">{p.p}</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <h3 className="font-display font-semibold">{p.t}</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sections */}
      <div className="space-y-10">
        {sections.map((s, i) => (
          <section key={s.h} className="grid md:grid-cols-12 gap-6 border-t border-border/40 pt-10">
            <div className="md:col-span-4">
              <div className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</div>
              <h2 className="mt-2 text-2xl font-display font-semibold">{s.h}</h2>
            </div>
            <div className="md:col-span-8">
              <p className="text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          </section>
        ))}
      </div>



      {/* Capital table */}
      <section className="mt-16">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-display font-semibold">Initial launch capital · 500 riders</h2>
          <button onClick={() => setLaunch(DEFAULT_LAUNCH)} className="text-xs text-muted-foreground hover:text-primary">Reset</button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Click any value to edit.</p>
        <div className="mt-5 glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {launch.map((r, i) => (
                <tr key={r.label} className={`border-b border-border/30 last:border-0 ${r.bold ? "bg-surface/40 font-semibold" : ""}`}>
                  <td className="px-5 py-3.5">{r.label}</td>
                  <td className="px-5 py-3.5 text-right">
                    <EditableMoney
                      value={r.value}
                      onChange={(v) => setLaunch(launch.map((row, idx) => (idx === i ? { ...row, value: v } : row)))}
                      step={r.bold ? 100000 : 25000}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
