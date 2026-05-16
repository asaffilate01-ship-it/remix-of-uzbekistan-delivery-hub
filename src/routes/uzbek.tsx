import { createFileRoute } from "@tanstack/react-router";
import { useCurrency, Disclaimer } from "@/lib/currency";

export const Route = createFileRoute("/uzbek")({
  head: () => ({ meta: [
    { title: "Qatnov — O'zbekiston yetkazib berish infratuzilmasi" },
    { name: "description", content: "O'zbekiston bo'ylab yetkazib berish, savdogarlar texnologiyasi va logistika platformasi uchun to'liq strategik reja." },
  ]}),
  component: Uzbek,
});

const fazalar = [
  { p: "1-bosqich", t: "Yetkazib berish parki infratuzilmasi", d: "6–12 oy · 300–500 haydovchi · Toshkent va Samarqand. Uzum va Yango bilan integratsiya, restoranlar bilan hamkorlik." },
  { p: "2-bosqich", t: "Savdogarlar uchun SaaS", d: "12–24 oy · POS, KDS, CRM, sodiqlik tizimi, QR buyurtma, to'g'ridan-to'g'ri buyurtma ilovasi." },
  { p: "3-bosqich", t: "Parkni kengaytirish", d: "3,000 haydovchi, 25+ shahar. Qorong'i do'konlar, oziq-ovqat, dorixona va B2B kuryer xizmati." },
  { p: "4-bosqich", t: "O'z marketpleysi", d: "Iste'molchi ilovasi, oyiga obuna va past komissiya." },
  { p: "5-bosqich", t: "Fintech ekotizimi", d: "Haydovchi va mototsikl moliyalashtirish, savdogarlar uchun kredit, hamyon, SoftPOS, sug'urta." },
];

const sariflarUSD: ReadonlyArray<readonly [string, number, boolean?]> = [
  ["Mototsikl (Bajaj Boxer)", 1200],
  ["Ro'yxatdan o'tkazish", 60],
  ["Sug'urta (yillik)", 15],
  ["Yetkazib berish qutisi", 75],
  ["Dubulg'a va xavfsizlik vositalari", 85],
  ["GPS tracker", 25],
  ["Brending", 30],
  ["Bitta haydovchi uchun jami", 1490, true],
];

function Uzbek() {
  const { m } = useCurrency();
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-8">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Strategik reja · O'zbekcha</div>
        <h1 className="mt-3 text-5xl font-display font-semibold">O'zbekistonning <span className="gradient-text">logistika operatsion tizimi.</span></h1>
        <p className="mt-5 text-lg text-muted-foreground">Yetkazib berish parki, haydovchilarni boshqarish ekotizimi, restoran texnologiyasi platformasi, savdogarlar uchun operatsion tizim va logistika SaaS tarmog'i — Uzum va Yango talabidan boshlab.</p>
      </header>

      <Disclaimer className="mb-10" />

      <section className="grid md:grid-cols-3 gap-4 mb-12">
        {[
          ["~38M", "aholi soni"],
          ["3,000", "haydovchi rejasi"],
          [m(7000000, { compact: true }), "umumiy investitsiya"],
        ].map(([v, l]) => (
          <div key={l} className="glass rounded-2xl p-6">
            <div className="text-3xl font-display font-semibold gradient-text">{v}</div>
            <div className="mt-1 text-sm text-muted-foreground">{l}</div>
          </div>
        ))}
      </section>

      {/* Phases */}
      <section className="mb-16">
        <h2 className="text-2xl font-display font-semibold mb-5">Bosqichma-bosqich rivojlanish</h2>
        <div className="space-y-3">
          {fazalar.map((f, i) => (
            <div key={f.p} className="glass rounded-xl p-5 flex gap-4">
              <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-mono text-xs shrink-0">{i + 1}</div>
              <div>
                <div className="flex items-center gap-3"><span className="text-xs font-mono text-muted-foreground">{f.p}</span><h3 className="font-display font-semibold">{f.t}</h3></div>
                <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Daromad modeli */}
      <section className="mb-16">
        <h2 className="text-2xl font-display font-semibold mb-5">Daromad modeli</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ["Yetkazib berish marjinasi", "Platforma har bir buyurtma uchun ~$1.00–$2.30 to'laydi. Haydovchi $0.65–$1.50 oladi, park esa farqni saqlaydi."],
            ["Mototsikl ijarasi", "Haftasiga $10–$25 har bir haydovchi uchun."],
            ["Haydovchi moliyalashtirish", "$1,200 lik mototsikl $1,900+ ga moliyalashtiriladi — uzoq muddatda juda foydali."],
            ["Savdogarlar SaaS", "Oylik obuna: POS, CRM, buyurtma, analitika."],
            ["Maxsus park shartnomalari", "Oziq-ovqat tarmoqlari, dorixonalar, restoranlar uchun."],
            ["Reklama daromadlari", "Mototsikl brendingi, yetkazib berish qutilari, savdogarlar promosi."],
          ].map(([t, d]) => (
            <div key={t as string} className="glass rounded-2xl p-5">
              <h3 className="font-display font-semibold">{t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sariflar */}
      <section className="mb-16">
        <h2 className="text-2xl font-display font-semibold mb-5">Bitta haydovchi uchun sarflar</h2>
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {sariflarUSD.map(([k, v, bold]) => (
                <tr key={k} className={`border-b border-border/30 last:border-0 ${bold ? "bg-surface/40 font-semibold" : ""}`}>
                  <td className="px-5 py-3.5">{k}</td>
                  <td className="px-5 py-3.5 text-right font-mono">{m(v)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Shaharlar */}
      <section className="mb-16">
        <h2 className="text-2xl font-display font-semibold mb-5">Shaharlar bo'yicha haydovchilar</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            ["Toshkent", 1500], ["Samarqand", 350], ["Namangan", 300],
            ["Andijon", 300], ["Farg'ona", 250], ["Buxoro", 150],
          ].map(([c, r]) => (
            <div key={c as string} className="glass rounded-xl p-4 flex items-center justify-between">
              <span className="font-display">{c}</span>
              <span className="font-mono text-primary">{r} haydovchi</span>
            </div>
          ))}
        </div>
      </section>

      <section className="glass rounded-3xl p-8 md:p-12 bg-gradient-to-tr from-primary/10 via-transparent to-gold/10">
        <h2 className="text-3xl font-display font-semibold">Uzoq muddatli ko'rinish</h2>
        <p className="mt-3 text-muted-foreground">Bu loyiha shunchaki yetkazib berish kompaniyasi emas — bu O'zbekistonning <span className="text-foreground font-medium">logistika operatsion tizimi</span>: parklar, haydovchilar, savdogarlar texnologiyasi, to'lovlar, moliyalashtirish, marketpleys infratuzilmasi, oxirgi milya logistikasi, yetkazib berish SaaS va fintech ekotizimi.</p>
      </section>
    </div>
  );
}
