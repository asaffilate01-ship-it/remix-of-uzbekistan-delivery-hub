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
      <span className="font-mono text-gold">RESEARCH-BASED ASSUMPTIONS · </span>
      Every figure on this site is an editable assumption based on research.
      Tap any number to edit, drag sliders, toggle USD/UZS, change the FX rate.
      Validate against primary sources before investor commitments.
    </div>
  );
}

/**
 * Inline editable money cell. Value is stored in USD (the model's base unit);
 * the visible display switches between USD and UZS via the currency context.
 * Click the number to edit, or use the ▲ / ▼ buttons to step.
 */
export function EditableMoney({
  value,
  onChange,
  step = 1000,
  decimals = 0,
  className = "",
  align = "right",
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  decimals?: number;
  className?: string;
  align?: "left" | "right";
}) {
  const { currency, fx, m } = useCurrency();
  const [editing, setEditing] = useState(false);
  const negative = value < 0;
  const abs = Math.abs(value);

  // When editing, show the raw number in the active currency (no symbol).
  const editValue =
    currency === "USD" ? abs.toFixed(decimals) : Math.round(abs * fx).toString();

  if (editing) {
    return (
      <input
        autoFocus
        defaultValue={editValue}
        onBlur={(e) => {
          const raw = Number(e.target.value.replace(/[, ]/g, "")) || 0;
          const usd = currency === "USD" ? raw : raw / fx;
          onChange(negative ? -usd : usd);
          setEditing(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          if (e.key === "Escape") setEditing(false);
        }}
        className={`w-32 bg-surface/80 border border-primary/60 rounded px-2 py-1 font-mono text-${align} text-foreground outline-none ${className}`}
      />
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 group ${className}`}>
      <button
        type="button"
        aria-label="Decrease"
        onClick={() => onChange(value - step)}
        className="opacity-0 group-hover:opacity-100 transition text-muted-foreground hover:text-destructive text-xs px-1 font-mono"
      >
        ▼
      </button>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className={`font-mono tabular-nums hover:text-primary hover:underline decoration-dotted underline-offset-4 transition ${
          negative ? "text-destructive/90" : ""
        }`}
      >
        {negative ? "−" : ""}
        {m(abs, { decimals })}
      </button>
      <button
        type="button"
        aria-label="Increase"
        onClick={() => onChange(value + step)}
        className="opacity-0 group-hover:opacity-100 transition text-muted-foreground hover:text-primary text-xs px-1 font-mono"
      >
        ▲
      </button>
    </span>
  );
}

