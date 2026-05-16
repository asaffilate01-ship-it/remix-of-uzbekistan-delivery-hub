import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { num } from "@/lib/format";
import { useCurrency, Disclaimer, EditableMoney } from "@/lib/currency";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Bike, Wrench, Shield, MapPin, Box, Radio, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/fleet")({
  head: () => ({ meta: [
    { title: "Fleet & Riders — Qatnov" },
    { name: "description", content: "Rider distribution, motorcycle strategy, asset costs and city allocation." },
  ]}),
  component: Fleet,
});

type CityRow = { id: string; city: string; hub: string; weight: number };

const DEFAULT_CITIES: CityRow[] = [
  { id: "c1", city: "Tashkent",     hub: "HQ + 3 sub-hubs", weight: 50 },
  { id: "c2", city: "Samarkand",    hub: "Regional hub",    weight: 12 },
  { id: "c3", city: "Namangan",     hub: "Regional hub",    weight: 10 },
  { id: "c4", city: "Andijan",      hub: "Regional hub",    weight: 10 },
  { id: "c5", city: "Fergana",      hub: "Regional hub",    weight: 8 },
  { id: "c6", city: "Bukhara",      hub: "Satellite hub",   weight: 5 },
  { id: "c7", city: "Other cities", hub: "Partner hubs",    weight: 5 },
];

type BikeRow = { id: string; item: string; cost: number; icon: React.ComponentType<{ className?: string }> };
const DEFAULT_BIKE: BikeRow[] = [
  { id: "b1", item: "Motorcycle (Bajaj Boxer)", cost: 1200, icon: Bike },
  { id: "b2", item: "Registration",             cost: 60,   icon: Shield },
  { id: "b3", item: "Insurance (annual)",       cost: 15,   icon: Shield },
  { id: "b4", item: "Delivery box",             cost: 75,   icon: Box },
  { id: "b5", item: "Helmet & safety gear",     cost: 85,   icon: Shield },
  { id: "b6", item: "GPS tracker",              cost: 25,   icon: Radio },
  { id: "b7", item: "Branding & livery",        cost: 30,   icon: Wrench },
];

function SliderRow({
  label, value, onChange, min, max, step = 1, format,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step?: number; format?: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-foreground">{format ? format(value) : num(value)}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
        className="mt-2"
      />
    </div>
  );
}

function Fleet() {
  const { m } = useCurrency();

  // Global scenario sliders
  const [totalRiders, setTotalRiders]   = useState(3000);
  const [dropsPerDay, setDropsPerDay]   = useState(16);
  const [revPerDrop, setRevPerDrop]     = useState(1.5);
  const [payPerDrop, setPayPerDrop]     = useState(1.0);
  const [leaseWeekly, setLeaseWeekly]   = useState(15);

  const [cities, setCities] = useState<CityRow[]>(DEFAULT_CITIES);
  const [bikeSetup, setBikeSetup] = useState<BikeRow[]>(DEFAULT_BIKE);

  const totalBike = bikeSetup.reduce((s, b) => s + b.cost, 0);
  const sumWeights = Math.max(1, cities.reduce((s, c) => s + c.weight, 0));

  const allocated = useMemo(() => cities.map((c) => {
    const riders = Math.round((c.weight / sumWeights) * totalRiders);
    const drops = riders * dropsPerDay;
    return { ...c, riders, drops };
  }), [cities, sumWeights, totalRiders, dropsPerDay]);

  const totalDrops = allocated.reduce((s, c) => s + c.drops, 0);
  const dailyGross = dropsPerDay * revPerDrop;
  const riderTake  = dropsPerDay * payPerDrop;
  const fleetCtb   = dailyGross - riderTake;

  const updateCity = (id: string, patch: Partial<CityRow>) =>
    setCities((arr) => arr.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const removeCity = (id: string) => setCities((arr) => arr.filter((c) => c.id !== id));
  const addCity = () => setCities((arr) => [
    ...arr,
    { id: `c${Date.now()}`, city: "New city", hub: "Hub", weight: 5 },
  ]);

  const updateBike = (id: string, patch: Partial<BikeRow>) =>
    setBikeSetup((arr) => arr.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  const removeBike = (id: string) => setBikeSetup((arr) => arr.filter((b) => b.id !== id));
  const addBike = () => setBikeSetup((arr) => [
    ...arr,
    { id: `b${Date.now()}`, item: "New item", cost: 50, icon: Wrench },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <header className="max-w-3xl mb-8">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Fleet operations</div>
        <h1 className="mt-3 text-5xl font-display font-semibold">500 riders at launch. 3,000 by month 18. Bajaj Boxer fleet.</h1>
        <p className="mt-4 text-muted-foreground">Drag the sliders, edit cities, retune the bike setup — every KPI, capex and economic on this page recomputes live.</p>
      </header>

      <Disclaimer className="mb-8" />

      {/* Scenario controls */}
      <section className="glass rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-semibold">Scenario controls</h2>
          <span className="text-xs font-mono text-muted-foreground">live</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
          <SliderRow label="Total riders"          value={totalRiders} onChange={setTotalRiders} min={100}  max={6000} step={50} />
          <SliderRow label="Deliveries / rider / day" value={dropsPerDay} onChange={setDropsPerDay} min={4}    max={30}   step={1} />
          <SliderRow label="Revenue / delivery (USD)" value={revPerDrop}  onChange={setRevPerDrop}  min={0.5}  max={5}    step={0.05} format={(v) => `$${v.toFixed(2)}`} />
          <SliderRow label="Rider payout / delivery (USD)" value={payPerDrop} onChange={setPayPerDrop} min={0.2} max={4}   step={0.05} format={(v) => `$${v.toFixed(2)}`} />
          <SliderRow label="Bike lease / week (USD)" value={leaseWeekly}  onChange={setLeaseWeekly} min={0}    max={60}   step={1} format={(v) => `$${v}`} />
        </div>
      </section>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Total riders",      v: num(totalRiders) },
          { l: "Daily deliveries",  v: num(totalDrops) },
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
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-display font-semibold">City allocation</h2>
          <button onClick={addCity} className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-md border border-border/60 hover:border-primary/60 hover:text-primary transition">
            <Plus className="h-3.5 w-3.5" /> Add city
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-3">Adjust each city's share — riders & drops re-allocate from the global total.</p>
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface/60 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">City</th>
                <th className="px-4 py-3 text-left font-medium">Hub</th>
                <th className="px-4 py-3 text-left font-medium w-[28%]">Share</th>
                <th className="px-4 py-3 text-right font-medium">Riders</th>
                <th className="px-4 py-3 text-right font-medium">Drops / day</th>
                <th className="px-4 py-3 text-right font-medium">Capex (bikes)</th>
                <th className="px-2"></th>
              </tr>
            </thead>
            <tbody>
              {allocated.map((c) => (
                <tr key={c.id} className="border-b border-border/30 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <Input
                        value={c.city}
                        onChange={(e) => updateCity(c.id, { city: e.target.value })}
                        className="h-8 bg-transparent border-transparent hover:border-border/60 focus:border-primary/60 px-2"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      value={c.hub}
                      onChange={(e) => updateCity(c.id, { hub: e.target.value })}
                      className="h-8 bg-transparent border-transparent hover:border-border/60 focus:border-primary/60 px-2 text-muted-foreground"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Slider
                        value={[c.weight]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(v) => updateCity(c.id, { weight: v[0] })}
                        className="flex-1"
                      />
                      <span className="font-mono text-xs w-10 text-right text-muted-foreground">
                        {((c.weight / sumWeights) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{num(c.riders)}</td>
                  <td className="px-4 py-3 text-right font-mono">{num(c.drops)}</td>
                  <td className="px-4 py-3 text-right font-mono text-primary">{m(c.riders * totalBike)}</td>
                  <td className="px-2 py-3">
                    <button
                      onClick={() => removeCity(c.id)}
                      className="text-muted-foreground hover:text-destructive transition"
                      aria-label="Remove city"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-surface/40 font-semibold">
                <td className="px-4 py-3">Totals</td>
                <td />
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{sumWeights} pts</td>
                <td className="px-4 py-3 text-right font-mono">{num(totalRiders)}</td>
                <td className="px-4 py-3 text-right font-mono">{num(totalDrops)}</td>
                <td className="px-4 py-3 text-right font-mono text-primary">{m(totalRiders * totalBike)}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12 grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-7">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-display font-semibold">Per-rider bike setup</h3>
              <p className="mt-1 text-sm text-muted-foreground">Edit any line item, add or remove rows — capex updates everywhere.</p>
            </div>
            <button onClick={addBike} className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-md border border-border/60 hover:border-primary/60 hover:text-primary transition">
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
          <div className="mt-6 space-y-3">
            {bikeSetup.map(({ id, item, cost, icon: Icon }) => (
              <div key={id} className="flex items-center justify-between border-b border-border/30 pb-3 last:border-0 gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-surface/60 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <Input
                    value={item}
                    onChange={(e) => updateBike(id, { item: e.target.value })}
                    className="h-8 bg-transparent border-transparent hover:border-border/60 focus:border-primary/60 px-2"
                  />
                </div>
                <EditableMoney
                  value={cost}
                  step={cost >= 500 ? 50 : 5}
                  onChange={(v) => updateBike(id, { cost: v })}
                />
                <button onClick={() => removeBike(id)} className="text-muted-foreground hover:text-destructive transition" aria-label="Remove">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 border-t border-border/40">
              <span className="font-semibold">Total per rider</span>
              <span className="font-mono text-lg gradient-text font-semibold">{m(totalBike)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Fleet-wide capex ({num(totalRiders)} riders)</span>
              <span className="font-mono">{m(totalRiders * totalBike)}</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-7">
          <h3 className="text-xl font-display font-semibold">Rider economics</h3>
          <p className="mt-1 text-sm text-muted-foreground">Per rider, per day — driven by scenario sliders above.</p>
          <div className="mt-6 space-y-4">
            {[
              ["Deliveries / day",         num(dropsPerDay)],
              ["Revenue / delivery",       m(revPerDrop, { decimals: 2 })],
              ["Daily gross revenue",      m(dailyGross, { decimals: 2 })],
              ["Rider take-home / day",    m(riderTake, { decimals: 2 })],
              ["Bike lease (weekly)",      m(leaseWeekly)],
              ["Fleet contribution / day", m(fleetCtb, { decimals: 2 })],
              ["Fleet contribution / mo",  m(fleetCtb * 30 * totalRiders)],
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
