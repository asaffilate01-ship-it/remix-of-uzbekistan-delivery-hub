import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, Store, Smartphone, Banknote, MapPin, Bike } from "lucide-react";
import { num } from "@/lib/format";
import { useCurrency, Disclaimer } from "@/lib/currency";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Qatnov — Uzbekistan's Delivery Infrastructure & Merchant OS" },
      { name: "description", content: "3PL fleet, merchant SaaS, marketplace and fintech for Uzbekistan. 3,000-rider plan, ~$7M ecosystem." },
    ],
  }),
  component: Home,
});

function Home() {
  const { m } = useCurrency();
  const tickerStats: ReadonlyArray<readonly [string, string]> = [
    [m(2300850, { compact: true }), "monthly gross revenue @ scale"],
    ["3,000", "active riders target"],
    ["25+", "cities in 24 months"],
    ["16", "deliveries / rider / day"],
    [`${m(569850, { compact: true })}+`, "modelled monthly net profit"],
    ["~38M", "population served"],
  ];
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-32 md:pb-32">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/50 px-3 py-1 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Strategic plan · 2025–2030 · Tashkent HQ
              </div>
              <h1 className="mt-6 font-display text-5xl md:text-7xl font-semibold tracking-tight leading-[1.02]">
                Uzbekistan's
                <br />
                <span className="gradient-text">logistics operating system.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                Fleet infrastructure, rider management, restaurant technology and merchant SaaS — initially powering Uzum and Yango, eventually owning the last mile.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/business-plan" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition glow-primary">
                  Read the full plan <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/financials" className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-surface/50 px-5 py-3 text-sm font-medium hover:bg-surface transition">
                  Open the financial model
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6 max-w-xl">
                {[
                  ["3,000", "riders"],
                  ["£1.58M", "gross / mo"],
                  ["£5.5M", "ecosystem"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <div className="text-3xl font-display font-semibold gradient-text">{v}</div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-transparent to-gold/20 rounded-3xl blur-2xl" />
                <div className="relative glass rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">LIVE DISPATCH · TASHKENT</div>
                      <div className="font-display text-lg">Operations control room</div>
                    </div>
                    <span className="text-xs text-primary font-mono">● ONLINE</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Active riders", value: "2,847", color: "primary" },
                      { label: "Open orders", value: "1,204", color: "gold" },
                      { label: "Avg ETA", value: "18 min", color: "primary" },
                      { label: "SLA today", value: "97.4%", color: "gold" },
                    ].map((m) => (
                      <div key={m.label} className="rounded-xl bg-surface/60 border border-border/40 p-4">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</div>
                        <div className={`text-2xl font-display font-semibold ${m.color === "primary" ? "text-primary" : "text-gold"}`}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-border/40 bg-surface/60 p-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>Deliveries (last 12h)</span><span>4,891</span>
                    </div>
                    <div className="flex items-end gap-1 h-20">
                      {[28, 35, 22, 48, 55, 41, 62, 70, 58, 75, 88, 72].map((h, i) => (
                        <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-primary/30 to-primary" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Bike className="h-4 w-4 text-primary" /> Bajaj Boxer fleet
                    <span className="ml-auto font-mono">v2.4.1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TICKER */}
        <div className="border-y border-border/40 bg-surface/30 overflow-hidden">
          <div className="ticker flex gap-12 whitespace-nowrap py-4 text-sm">
            {[...tickerStats, ...tickerStats].map(([v, l], i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="font-mono text-primary">{v}</span>
                <span className="text-muted-foreground">{l}</span>
                <span className="text-border">●</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIVISIONS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-primary">Business model</div>
          <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold">Four divisions, one infrastructure.</h2>
          <p className="mt-4 text-muted-foreground">Built sequentially — each layer compounds on the previous.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {[
            { i: Truck, t: "Fleet Operations (3PL)", d: "Riders, motorcycles, dispatch, SLA management and dedicated fleets for Uzum, Yango, restaurants, pharmacies and supermarkets.", tag: "Phase 1" },
            { i: Store, t: "Merchant Technology Platform", d: "POS, KDS, CRM, loyalty, analytics, QR ordering, direct ordering apps and white-label storefronts.", tag: "Phase 2" },
            { i: Smartphone, t: "Marketplace Layer", d: "Own food, grocery, courier and pharmacy delivery apps — built on existing fleet infrastructure.", tag: "Phase 4" },
            { i: Banknote, t: "Fintech Ecosystem", d: "Rider financing, motorcycle leasing, merchant loans, SoftPOS, wallets, QR payments and insurance.", tag: "Phase 5" },
          ].map(({ i: Icon, t, d, tag }) => (
            <div key={t} className="glass rounded-2xl p-7 hover:bg-white/[0.04] transition">
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-gold/20 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xs font-mono text-muted-foreground bg-surface/60 border border-border/40 rounded-full px-2.5 py-1">{tag}</span>
              </div>
              <h3 className="mt-5 text-xl font-display font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CITIES */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="glass rounded-3xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-primary">Market</div>
              <h2 className="mt-3 text-4xl font-display font-semibold">~38M people. Six anchor cities.</h2>
              <p className="mt-4 text-muted-foreground">Rapid smartphone, digital payments and food delivery growth — earlier-stage than UAE, Saudi or Turkey.</p>
              <Link to="/fleet" className="mt-6 inline-flex items-center gap-2 text-primary text-sm">
                See full fleet allocation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Tashkent", "3–4M", 1500],
                ["Samarkand", "1.3M", 350],
                ["Namangan", "1M+", 300],
                ["Andijan", "800K+", 300],
                ["Fergana", "Regional hub", 250],
                ["Bukhara", "Heritage city", 150],
              ].map(([city, pop, riders]) => (
                <div key={city as string} className="rounded-xl border border-border/40 bg-surface/40 p-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {pop}
                  </div>
                  <div className="mt-2 font-display text-lg">{city}</div>
                  <div className="mt-1 text-xs font-mono text-primary">{num(riders as number)} riders</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK NUMBERS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { k: "Capex per bike-rider unit", v: gbp(1185), s: "Bike, registration, insurance, box, gear, GPS, branding" },
            { k: "Initial launch capital", v: gbp(1500000), s: "500 riders, hubs, tech, working capital" },
            { k: "Full ecosystem", v: "£5.5–6M", s: "3,000 riders across 25+ cities" },
          ].map((x) => (
            <div key={x.k} className="glass rounded-2xl p-7">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{x.k}</div>
              <div className="mt-2 text-4xl font-display font-semibold gradient-text">{x.v}</div>
              <div className="mt-3 text-sm text-muted-foreground">{x.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative rounded-3xl overflow-hidden glass p-10 md:p-16">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-gold/10" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-display font-semibold">Not just a delivery company.</h3>
              <p className="mt-3 text-muted-foreground">Fleets, riders, merchant tech, payments, financing — the operating system for the last mile.</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link to="/platform" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground glow-primary">Explore the platform</Link>
              <Link to="/uzbek" className="inline-flex items-center gap-2 rounded-md border border-border/60 px-5 py-3 text-sm">O'zbekcha versiya</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
