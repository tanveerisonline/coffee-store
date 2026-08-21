import { useState } from "react";
import { useStore } from "../lib/store";
import { IconArrowRight, IconBag, IconBean, IconBeanSolid, IconCheck, IconMail, IconPin, IconTimer, IconTruck } from "./ui";

/* --------------------------------- ticker --------------------------------- */

const TICKER_ITEMS = [
  "Roasted every Tuesday",
  "Free shipping over $40",
  "Now tasting: bergamot & apricot",
  "Small batch · Portland, OR",
  "Code EMBER10 — 10% off first order",
  "48-hour rest before dispatch",
  "Twelve farms, zero mystery blends",
];

export function Ticker() {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {TICKER_ITEMS.map((item) => (
        <span key={key + item} className="flex items-center">
          <span className="px-5 text-[12px] font-bold uppercase tracking-[0.16em] whitespace-nowrap">{item}</span>
          <IconBeanSolid className="h-3 w-3 opacity-60" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="overflow-hidden border-y border-espresso-950/20 bg-caramel-400 py-2.5 text-espresso-950">
      <div className="flex w-max animate-ticker">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}

/* --------------------------------- header --------------------------------- */

export function Logo({ onClick, dark = false }: { onClick?: () => void; dark?: boolean }) {
  return (
    <button onClick={onClick} className="group flex items-center gap-2.5 text-left" aria-label="Ember & Oak home">
      <span className={`grid h-9 w-9 place-items-center rounded-full ${dark ? "bg-cream-50 text-espresso-950" : "bg-caramel-400 text-espresso-950"} transition-transform duration-300 group-hover:rotate-[24deg]`}>
        <IconBean className="h-5 w-5" />
      </span>
      <span className="leading-none">
        <span className={`block font-display text-lg font-semibold tracking-tight ${dark ? "text-cream-50" : "text-espresso-950"}`}>
          Ember <span className="italic">&</span> Oak
        </span>
        <span className={`block text-[9px] font-bold uppercase tracking-[0.34em] ${dark ? "text-caramel-300" : "text-caramel-600"}`}>
          Roasters
        </span>
      </span>
    </button>
  );
}

export function Header({
  route,
  navigate,
  onCart,
}: {
  route: string;
  navigate: (to: string) => void;
  onCart: () => void;
}) {
  const { cartCount } = useStore();

  const goAnchor = (id: string) => {
    if (route !== "/") {
      navigate("/");
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-cream-50/10 bg-espresso-950/92 text-cream-50 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo
          dark
          onClick={() => {
            if (route !== "/") navigate("/");
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />

        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
          <button onClick={() => goAnchor("shop")} className="text-cream-100/75 transition hover:text-caramel-300">
            The Shelf
          </button>
          <button onClick={() => goAnchor("craft")} className="text-cream-100/75 transition hover:text-caramel-300">
            Our Craft
          </button>
          <button
            onClick={() => navigate("/admin")}
            className={`rounded-full border px-3.5 py-1.5 text-[13px] transition ${
              route === "/admin"
                ? "border-caramel-400 bg-caramel-400 text-espresso-950"
                : "border-cream-50/25 text-cream-100/80 hover:border-caramel-300 hover:text-caramel-300"
            }`}
          >
            Roastery OS
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/admin")}
            aria-label="Admin dashboard"
            className={`grid h-10 w-10 place-items-center rounded-full border transition md:hidden ${
              route === "/admin"
                ? "border-caramel-400 bg-caramel-400 text-espresso-950"
                : "border-cream-50/20 text-cream-100/80 hover:border-caramel-300 hover:text-caramel-300"
            }`}
          >
            <IconTimer className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={onCart}
            className="relative flex h-10 items-center gap-2 rounded-full bg-cream-50 px-4 text-sm font-bold text-espresso-950 transition hover:bg-caramel-300 active:scale-95"
            aria-label={`Open bag, ${cartCount} items`}
          >
            <IconBag className="h-4.5 w-4.5" />
            <span className="hidden sm:inline">Bag</span>
            {cartCount > 0 && (
              <span
                key={cartCount}
                className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 animate-bump place-items-center rounded-full bg-ember-500 px-1 text-[11px] font-extrabold text-cream-50"
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

/* --------------------------------- footer --------------------------------- */

export function Footer({ navigate }: { navigate: (to: string) => void }) {
  const { toast } = useStore();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState(false);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErr(true);
      return;
    }
    setErr(false);
    setDone(true);
    toast("You're on the list — see you Tuesday.", "success");
  };

  return (
    <footer className="relative overflow-hidden bg-espresso-950 text-cream-100">
      <div className="pointer-events-none absolute -top-16 -right-10 opacity-[0.07]">
        <IconBeanSolid className="h-72 w-72 text-caramel-300" />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div>
            <Logo dark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-100/55">
              A six-coffee roastery on SE Belmont. Small drums, named farms, and a stubborn belief that coffee should taste like where it grew.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-caramel-300">Visit</h4>
            <ul className="mt-4 space-y-3 text-sm text-cream-100/65">
              <li className="flex gap-2.5">
                <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-caramel-400" />
                2140 SE Belmont St<br />Portland, OR 97214
              </li>
              <li className="flex gap-2.5">
                <IconTimer className="mt-0.5 h-4 w-4 shrink-0 text-caramel-400" />
                Mon–Fri 7–5 · Sat–Sun 8–4
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-caramel-300">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="#shop" className="text-cream-100/65 transition hover:text-caramel-300">The shelf</a>
              </li>
              <li>
                <a href="#craft" className="text-cream-100/65 transition hover:text-caramel-300">How we roast</a>
              </li>
              <li>
                <button onClick={() => navigate("/admin")} className="text-cream-100/65 transition hover:text-caramel-300">
                  Roastery OS
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-caramel-300">First crack — the weekly roast letter</h4>
            {done ? (
              <p className="mt-4 flex items-center gap-2 rounded-lg border border-moss-500/40 bg-moss-500/10 px-4 py-3 text-sm font-semibold text-moss-300">
                <IconCheck className="h-4 w-4" /> You're in. First letter lands Tuesday.
              </p>
            ) : (
              <form onSubmit={subscribe} className="mt-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <IconMail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-cream-100/35" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@somewhere.com"
                      className="field-dark pl-9"
                      aria-label="Email address"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-lg bg-caramel-400 px-4 text-sm font-bold text-espresso-950 transition hover:bg-caramel-300 active:scale-95"
                  >
                    Join
                  </button>
                </div>
                {err && <p className="mt-2 text-xs font-semibold text-ember-500">That email doesn't look right — try again?</p>}
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-cream-50/10 pt-6 text-xs text-cream-100/40 sm:flex-row sm:items-center">
          <p>© 2026 Ember & Oak Roasters · Demo storefront — orders are simulated, no cards charged.</p>
          <p className="flex items-center gap-1.5">
            <IconTruck className="h-3.5 w-3.5" /> Ships anywhere in the lower 48
            <IconArrowRight className="h-3.5 w-3.5" />
          </p>
        </div>
      </div>
    </footer>
  );
}
