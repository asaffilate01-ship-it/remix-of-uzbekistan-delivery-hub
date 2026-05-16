import { createContext, useContext, useState, type ReactNode } from "react";

export type Currency = "USD" | "UZS";

type Ctx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  fx: number; // UZS per 1 USD
  setFx: (n: number) => void;
  m: (usdAmount: number, opts?: { decimals?: number; compact?: boolean }) => string;
};

const CurrencyContext = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD");
  // Editable indicative FX. Default is an illustrative 2026 rate — user can override.
  const [fx, setFx] = useState(12650);

  const m = (usd: number, opts?: { decimals?: number; compact?: boolean }) => {
    const decimals = opts?.decimals ?? 0;
    if (currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: opts?.compact ? "compact" : "standard",
        maximumFractionDigits: decimals,
      }).format(usd);
    }
    const v = usd * fx;
    const num = new Intl.NumberFormat("en-US", {
      notation: opts?.compact ? "compact" : "standard",
      maximumFractionDigits: 0,
    }).format(v);
    return `${num} so'm`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, fx, setFx, m }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}

export function CurrencySwitcher() {
  const { currency, setCurrency, fx, setFx } = useCurrency();
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex rounded-md border border-border/60 overflow-hidden">
        {(["USD", "UZS"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            className={`px-2.5 py-1.5 font-mono transition ${
              currency === c
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      {currency === "UZS" && (
        <label className="flex items-center gap-1 text-muted-foreground">
          <span className="hidden sm:inline">FX</span>
          <input
            type="number"
            value={fx}
            onChange={(e) => setFx(Number(e.target.value) || fx)}
            className="w-20 bg-surface/60 border border-border/40 rounded px-1.5 py-0.5 font-mono text-foreground"
            aria-label="UZS per USD"
          />
        </label>
      )}
    </div>
  );
}

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl border border-gold/30 bg-gold/5 px-4 py-3 text-xs text-muted-foreground ${className}`}
    >
      <span className="font-mono text-gold">ILLUSTRATIVE DEFAULTS · </span>
      Every figure on this site is an editable assumption, not researched market data.
      Adjust sliders, toggle USD/UZS and change the FX rate to model your own scenario.
      Validate against primary sources before investor commitments.
    </div>
  );
}
