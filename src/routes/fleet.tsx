import { createFileRoute } from "@tanstack/react-router";
import { num } from "@/lib/format";
import { useCurrency, Disclaimer } from "@/lib/currency";
import { Bike, Wrench, Shield, MapPin, Box, Radio } from "lucide-react";

export const Route = createFileRoute("/fleet")({
  head: () => ({ meta: [
    { title: "Fleet & Riders — Qatnov" },
    { name: "description", content: "Rider distribution, motorcycle strategy, asset costs and city allocation." },
  ]}),
  component: Fleet,
});

const cities = [
  { city: "Tashkent", riders: 1500, drops: 24000, hub: "HQ + 3 sub-hubs" },
  { city: "Samarkand", riders: 350, drops: 5600, hub: "Regional hub" },
  { city: "Namangan", riders: 300, drops: 4800, hub: "Regional hub" },
  { city: "Andijan", riders: 300, drops: 4800, hub: "Regional hub" },
  { city: "Fergana", riders: 250, drops: 4000, hub: "Regional hub" },
  { city: "Bukhara", riders: 150, drops: 2400, hub: "Satellite hub" },
  { city: "Other cities", riders: 150, drops: 2400, hub: "Partner hubs" },
];

// USD defaults (illustrative — overridden by sliders elsewhere).
const bikeSetup = [
  { item: "Motorcycle (Bajaj Boxer)", cost: 1200, icon: Bike },
  { item: "Registration", cost: 60, icon: Shield },
  { item: "Insurance (annual)", cost: 15, icon: Shield },
  { item: "Delivery box", cost: 75, icon: Box },
  { item: "Helmet & safety gear", cost: 85, icon: Shield },
  { item: "GPS tracker", cost: 25, icon: Radio },
  { item: "Branding & livery", cost: 30, icon: Wrench },
];

const totalBike = bikeSetup.reduce((s, b) => s + b.cost, 0);
const totalRiders = cities.reduce((s, c) => s + c.riders, 0);
const totalDrops = cities.reduce((s, c) => s + c.drops, 0);

function Fleet() {
  const { m } = useCurrency();
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <header className="max-w-3xl mb-8">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Fleet operations</div>
        <h1 className="mt-3 text-5xl font-display font-semibold">3,000 riders. Bajaj Boxer fleet. Built for the last mile.</h1>
        <p className="mt-4 text-muted-foreground">Asset-light per unit, network-effects at scale. Every motorcycle is a margin engine that compounds through leasing, financing and advertising.</p>
      </header>

      <Disclaimer className="mb-10" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Total riders", v: num(totalRiders) },
          { l: "Daily deliveries", v: num(totalDrops) },
          { l: "Weekly deliveries", v: num(totalDrops * 7) },
          { l: "Monthly deliveries", v: num(totalDrops * 30) },
        ].map((k) => (
          <div key={k.l} className="glass rounded-2xl p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{k.l}</div>
            <div className="mt-2 text-3xl font-display font-semibold gradient-text">{k.v}</div>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-display font-semibold">City allocation</h2>
        <div className="mt-5 glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface/60 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 text-left font-medium">City</th>
                <th className="px-5 py-3 text-left font-medium">Hub</th>
                <th className="px-5 py-3 text-right font-medium">Riders</th>
                <th className="px-5 py-3 text-right font-medium">Drops / day</th>
                <th className="px-5 py-3 text-right font-medium">Capex (bikes)</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((c) => (
                <tr key={c.city} className="border-b border-border/30 last:border-0">
                  <td className="px-5 py-3.5 font-medium flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" />{c.city}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{c.hub}</td>
                  <td className="px-5 py-3.5 text-right font-mono">{num(c.riders)}</td>
                  <td className="px-5 py-3.5 text-right font-mono">{num(c.drops)}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-primary">{m(c.riders * totalBike)}</td>
                </tr>
              ))}
              <tr className="bg-surface/40 font-semibold">
                <td className="px-5 py-3.5">Totals</td>
                <td />
                <td className="px-5 py-3.5 text-right font-mono">{num(totalRiders)}</td>
                <td className="px-5 py-3.5 text-right font-mono">{num(totalDrops)}</td>
                <td className="px-5 py-3.5 text-right font-mono text-primary">{m(totalRiders * totalBike)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12 grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-7">
          <h3 className="text-xl font-display font-semibold">Per-rider bike setup</h3>
          <p className="mt-1 text-sm text-muted-foreground">Bajaj Boxer chosen for durability, fuel efficiency and ubiquitous parts. Costs are indicative landed prices.</p>
          <div className="mt-6 space-y-3">
            {bikeSetup.map(({ item, cost, icon: Icon }) => (
              <div key={item} className="flex items-center justify-between border-b border-border/30 pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-surface/60 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">{item}</span>
                </div>
                <span className="font-mono text-sm">{m(cost)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 border-t border-border/40">
              <span className="font-semibold">Total per rider</span>
              <span className="font-mono text-lg gradient-text font-semibold">{m(totalBike)}</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-7">
          <h3 className="text-xl font-display font-semibold">Rider economics</h3>
          <p className="mt-1 text-sm text-muted-foreground">Per rider, per day — baseline conservative assumptions.</p>
          <div className="mt-6 space-y-4">
            {[
              ["Deliveries / day", "16"],
              ["Revenue / delivery", m(1.4, { decimals: 2 })],
              ["Daily gross revenue", m(22.4, { decimals: 2 })],
              ["Rider take-home", m(14.4, { decimals: 2 })],
              ["Bike lease (weekly)", `${m(15)} – ${m(25)}`],
              ["Fleet contribution / day", m(5.6, { decimals: 2 })],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-border/30 pb-3 last:border-0 text-sm">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-mono">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 glass rounded-2xl p-7">
        <h3 className="text-xl font-display font-semibold">Motorcycle strategy</h3>
        <div className="mt-5 grid md:grid-cols-2 gap-5">
          {[
            { name: "Bajaj Boxer", use: "Core fleet — 80%", traits: ["Bulletproof reliability", "Excellent fuel economy", "Widely available parts", "Low TCO"] },
            { name: "Bajaj Pulsar 125 / 150", use: "Express tier — 20%", traits: ["Faster express deliveries", "Premium merchant fleets", "Higher rider satisfaction", "Better top-up resale"] },
          ].map((mc) => (
            <div key={mc.name} className="rounded-xl border border-border/40 bg-surface/40 p-6">
              <div className="flex items-center justify-between">
                <div className="font-display text-lg">{mc.name}</div>
                <div className="text-xs font-mono text-primary">{mc.use}</div>
              </div>
              <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                {mc.traits.map((t) => <li key={t} className="flex gap-2"><span className="text-primary">▸</span> {t}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
