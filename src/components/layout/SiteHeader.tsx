import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { CurrencySwitcher } from "@/lib/currency";

const nav = [
  { to: "/", label: "Overview" },
  { to: "/business-plan", label: "Plan" },
  { to: "/financials", label: "Financials" },
  { to: "/fleet", label: "Fleet" },
  { to: "/platform", label: "Platform" },
  { to: "/uzbek", label: "O'zbekcha" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/70">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-display">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-gold flex items-center justify-center text-primary-foreground font-bold">
            Q
          </div>
          <span className="font-semibold tracking-tight">Qatnov<span className="text-primary">.</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3.5 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-surface/60 transition-colors"
              activeProps={{ className: "px-3.5 py-2 rounded-md text-sm text-foreground bg-surface" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <CurrencySwitcher />
          <Link
            to="/platform"
            className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            Launch Platform
          </Link>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/50 px-6 py-4 space-y-1 bg-background">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block py-2 text-sm text-muted-foreground hover:text-foreground">
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="font-display font-semibold mb-3">Qatnov</div>
          <p className="text-muted-foreground">Uzbekistan's delivery infrastructure & merchant technology ecosystem.</p>
        </div>
        <div>
          <div className="font-medium mb-3">Divisions</div>
          <ul className="space-y-2 text-muted-foreground">
            <li>Fleet Operations (3PL)</li>
            <li>Merchant SaaS</li>
            <li>Marketplace</li>
            <li>Fintech</li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-3">Cities</div>
          <ul className="space-y-2 text-muted-foreground">
            <li>Tashkent · Samarkand</li>
            <li>Namangan · Andijan</li>
            <li>Fergana · Bukhara</li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-3">Targets</div>
          <ul className="space-y-2 text-muted-foreground">
            <li>500 → 3,000 riders (M0 → M18)</li>
            <li>25+ cities</li>
            <li>~$7M ecosystem</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Qatnov Logistics OS · Strategic plan v1
      </div>
    </footer>
  );
}
