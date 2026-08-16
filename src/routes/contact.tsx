import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { canonical } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Qatnov — Merchants, Riders & Partners" },
      { name: "description", content: "Talk to Qatnov about merchant delivery, rider onboarding, partnerships or investment in Uzbekistan's last-mile logistics network." },
      { property: "og:title", content: "Contact Qatnov — Merchants, Riders & Partners" },
      { property: "og:description", content: "Request access to Qatnov's delivery network and merchant platform in Uzbekistan." },
      { property: "og:url", content: canonical("/contact") },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical("/contact") }],
  }),
  component: Contact,
});

const roles = [
  { v: "merchant", l: "Merchant / store" },
  { v: "rider", l: "Rider" },
  { v: "investor", l: "Investor" },
  { v: "partner", l: "Partner" },
  { v: "other", l: "Other" },
] as const;

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", role: "merchant", city: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setState("sending");
    const { error } = await supabase.from("leads").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim() || null,
      role: form.role,
      city: form.city.trim() || null,
      message: form.message.trim() || null,
    });
    if (error) {
      setState("idle");
      setError("We couldn't send that. Please check your details and try again.");
      return;
    }
    setState("done");
  }

  const field = "w-full rounded-md border border-border/60 bg-surface/50 px-3 py-2.5 text-sm outline-none focus:border-primary/60";

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
        Get on the <span className="gradient-text">Qatnov</span> network.
      </h1>
      <p className="mt-4 text-muted-foreground">
        Merchants, riders, partners and investors — tell us who you are and we'll come back to you.
      </p>

      {state === "done" ? (
        <div className="mt-10 glass rounded-2xl p-8 flex items-start gap-4">
          <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
          <div>
            <h2 className="font-display text-xl font-semibold">Thanks — we've got it.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your enquiry is with the Qatnov team. We reply to most requests within two business days.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-10 glass rounded-2xl p-6 md:p-8 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground">Name</label>
            <input id="name" required maxLength={120} value={form.name} onChange={set("name")} className={`mt-1.5 ${field}`} />
          </div>
          <div className="sm:col-span-1">
            <label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">Email</label>
            <input id="email" type="email" required maxLength={200} value={form.email} onChange={set("email")} className={`mt-1.5 ${field}`} />
          </div>
          <div className="sm:col-span-1">
            <label htmlFor="company" className="text-xs uppercase tracking-wider text-muted-foreground">Company (optional)</label>
            <input id="company" maxLength={160} value={form.company} onChange={set("company")} className={`mt-1.5 ${field}`} />
          </div>
          <div className="sm:col-span-1">
            <label htmlFor="city" className="text-xs uppercase tracking-wider text-muted-foreground">City (optional)</label>
            <input id="city" maxLength={80} value={form.city} onChange={set("city")} className={`mt-1.5 ${field}`} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="role" className="text-xs uppercase tracking-wider text-muted-foreground">I am a</label>
            <select id="role" value={form.role} onChange={set("role")} className={`mt-1.5 ${field}`}>
              {roles.map((r) => (
                <option key={r.v} value={r.v}>{r.l}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="text-xs uppercase tracking-wider text-muted-foreground">Message (optional)</label>
            <textarea id="message" rows={5} maxLength={2000} value={form.message} onChange={set("message")} className={`mt-1.5 ${field}`} />
          </div>
          {error && <p className="sm:col-span-2 text-sm text-destructive">{error}</p>}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={state === "sending"}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground glow-primary disabled:opacity-60"
            >
              {state === "sending" ? "Sending…" : "Send enquiry"} <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
