import { useMemo, useState } from "react";
import { CATEGORY_LABEL, HERO_IMAGE, money, useStore } from "../lib/store";
import type { Category, Product } from "../lib/store";
import {
  BagArt,
  IconArrowRight,
  IconBeanSolid,
  IconCheck,
  IconChevronDown,
  IconCopy,
  IconFlame,
  IconLeaf,
  IconPlus,
  IconSearch,
  IconStar,
  IconTimer,
  IconX,
  Reveal,
  RoastMeter,
} from "./ui";
import { Ticker } from "./chrome";

/* ---------------------------------- hero ---------------------------------- */

function Hero({ onOpenProduct }: { onOpenProduct: (id: string) => void }) {
  const { products } = useStore();
  const spotlight = products.find((p) => p.id === "p-dawn" && p.active) ?? products.find((p) => p.active);

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -right-24 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(210,154,91,0.4),transparent_65%)] blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 opacity-[0.05]">
        <IconBeanSolid className="h-80 w-80 rotate-12 text-espresso-950" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:pt-16 lg:pb-20">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.22em] text-caramel-600">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ember-500" />
              </span>
              Small-batch roastery · Portland, OR
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="mt-5 font-display text-[2.75rem] leading-[1.02] font-semibold tracking-tight sm:text-6xl xl:text-7xl">
              Slow coffee,
              <br />
              <em className="font-light text-caramel-600 italic">roasted</em> like
              <br />
              it matters.
            </h1>
          </Reveal>

          <Reveal delay={170}>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-espresso-950/65">
              Six coffees on the shelf at any time — sourced from growers we can name, roasted every Tuesday, rested
              48 hours, and shipped the same week. No warehouse bags, no mystery blends.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a
                href="#shop"
                className="group flex items-center gap-2.5 rounded-full bg-espresso-950 py-3.5 pr-5 pl-6 text-sm font-bold text-cream-50 transition hover:bg-caramel-600 active:scale-[0.97]"
              >
                Browse the shelf
                <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#craft"
                className="text-sm font-bold text-espresso-950 underline decoration-caramel-500 decoration-2 underline-offset-8 transition hover:text-caramel-600"
              >
                How we roast
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <dl className="mt-12 flex max-w-md divide-x divide-espresso-950/15 border-t border-espresso-950/15 pt-6">
              {[
                ["06", "coffees on the shelf"],
                ["48 hr", "rest before shipping"],
                ["Tues", "roast day, every week"],
              ].map(([big, small]) => (
                <div key={big} className="flex-1 px-4 first:pl-0">
                  <dt className="sr-only">{small}</dt>
                  <dd className="font-display text-2xl font-bold text-espresso-950 sm:text-3xl">{big}</dd>
                  <dd className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-espresso-950/45">{small}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="relative lg:col-span-6">
          <Reveal delay={150} className="relative mx-auto max-w-md lg:ml-auto">
            <div className="relative overflow-hidden rounded-b-[2rem] rounded-t-[999px] border-[6px] border-espresso-950 shadow-[0_35px_70px_-30px_rgba(26,17,12,0.55)]">
              <img
                src={HERO_IMAGE}
                alt="Pour-over coffee brewing at the roastery bar"
                className="aspect-[5/6] w-full object-cover"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-espresso-950/50 to-transparent" />
            </div>

            <div className="absolute top-8 left-1/2 flex -translate-x-1/2 items-end gap-2.5">
              {[26, 34, 21].map((h, i) => (
                <span
                  key={i}
                  className="steam"
                  style={{ position: "relative", bottom: "auto", height: `${h}px`, animationDelay: `${i * 1.05}s` }}
                />
              ))}
            </div>

            <div className="absolute top-24 -left-3 animate-floaty rounded-full border border-espresso-950/10 bg-cream-50/95 px-4 py-2.5 shadow-lg backdrop-blur sm:-left-8">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-espresso-950/55">
                <IconStar className="h-3.5 w-3.5 text-caramel-500" /> Now cupping
              </p>
              <p className="mt-0.5 text-sm font-bold">Bergamot · Apricot · Honey</p>
            </div>

            {spotlight && (
              <button
                onClick={() => onOpenProduct(spotlight.id)}
                className="group absolute -right-2 -bottom-6 flex w-60 rotate-2 items-center gap-3 rounded-xl bg-espresso-950 p-3 text-left text-cream-50 shadow-2xl transition duration-300 hover:rotate-0 hover:bg-espresso-850 sm:-right-8"
              >
                {spotlight.image ? (
                  <img src={spotlight.image} alt="" className="h-14 w-14 rounded-lg object-cover" loading="lazy" decoding="async" />
                ) : (
                  <span className="grid h-14 w-14 place-items-center rounded-lg bg-espresso-800">
                    <BagArt color={spotlight.color} className="h-12 w-12" />
                  </span>
                )}
                <span className="flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-caramel-300">Roast of the week</span>
                  <span className="block font-display text-lg leading-tight font-semibold">{spotlight.name}</span>
                  <span className="block text-xs text-cream-100/60">
                    {money(spotlight.price)} · view <span className="transition group-hover:tracking-wider">→</span>
                  </span>
                </span>
              </button>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ product card ------------------------------ */

function ProductCard({
  product,
  index,
  onOpen,
}: {
  product: Product;
  index: number;
  onOpen: (id: string) => void;
}) {
  const { addToCart, toast } = useStore();
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;
  const low = !soldOut && product.stock <= 5;

  const add = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (soldOut || added) return;
    addToCart(product.id);
    setAdded(true);
    toast(`${product.name} added to your bag`, "success");
    window.setTimeout(() => setAdded(false), 1100);
  };

  return (
    <Reveal delay={(index % 3) * 80}>
      <article
        onClick={() => onOpen(product.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(product.id);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`View ${product.name}`}
        className="group cursor-pointer overflow-hidden rounded-xl border border-espresso-950/10 bg-cream-50 outline-none transition-all duration-300 hover:-translate-y-1.5 hover:border-espresso-950/25 hover:shadow-[0_24px_50px_-20px_rgba(26,17,12,0.4)] focus-visible:ring-2 focus-visible:ring-caramel-500"
      >
        <div className="relative aspect-[5/4] overflow-hidden bg-cream-200">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            />
          ) : (
            <div className="grid h-full w-full place-items-center transition-transform duration-700 group-hover:scale-[1.06]">
              <BagArt color={product.color} className="h-40 w-40" />
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {product.badge && (
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${
                  product.badge === "Roast of the week" ? "bg-caramel-400 text-espresso-950" : "bg-espresso-950 text-cream-50"
                }`}
              >
                {product.badge}
              </span>
            )}
            {low && (
              <span className="rounded-full bg-ember-500 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-cream-50">
                Only {product.stock} left
              </span>
            )}
          </div>

          {soldOut && (
            <div className="absolute inset-0 grid place-items-center bg-cream-100/70 backdrop-blur-[2px]">
              <span className="rounded-full bg-espresso-950 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-cream-50">
                Sold out
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-caramel-600">
              {CATEGORY_LABEL[product.category]} · {product.origin.split(",")[0]}
            </p>
            <RoastMeter level={product.roast} className="[&_span:last-child]:hidden" />
          </div>

          <h3 className="mt-2 font-display text-[22px] leading-snug font-semibold tracking-tight transition-colors group-hover:text-caramel-600">
            {product.name}
          </h3>
          <p className="mt-0.5 text-sm text-espresso-950/55">{product.origin}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.notes.map((n) => (
              <span key={n} className="rounded-full border border-espresso-950/12 bg-cream-100 px-2 py-0.5 text-[11px] font-semibold text-espresso-950/70">
                {n}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-espresso-950/10 pt-4">
            <p className="font-display text-xl font-bold">
              {money(product.price)} <span className="font-body text-xs font-semibold text-espresso-950/45">/ {product.weight}</span>
            </p>
            <button
              onClick={add}
              disabled={soldOut}
              aria-label={`Add ${product.name} to bag`}
              className={`flex items-center gap-1.5 rounded-full py-2.5 pr-4.5 pl-3.5 text-sm font-bold transition-all active:scale-90 ${
                soldOut
                  ? "cursor-not-allowed bg-espresso-950/12 text-espresso-950/35"
                  : added
                    ? "bg-moss-500 text-cream-50"
                    : "bg-espresso-950 text-cream-50 hover:bg-caramel-600"
              }`}
            >
              {added ? <IconCheck className="h-4 w-4" /> : <IconPlus className="h-4 w-4" />}
              {added ? "Added" : "Add"}
            </button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* --------------------------------- shop grid ------------------------------ */

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

function Shelf({ onOpenProduct }: { onOpenProduct: (id: string) => void }) {
  const { products } = useStore();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");
  const [sort, setSort] = useState<SortKey>("featured");

  const active = useMemo(() => products.filter((p) => p.active), [products]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: active.length };
    for (const p of active) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [active]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = active.filter((p) => {
      const inCat = cat === "all" || p.category === cat;
      if (!inCat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q) ||
        p.notes.some((n) => n.toLowerCase().includes(q)) ||
        CATEGORY_LABEL[p.category].toLowerCase().includes(q)
      );
    });
    list = [...list];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [active, query, cat, sort]);

  const chips: { value: Category | "all"; label: string }[] = [
    { value: "all", label: "All coffee" },
    { value: "single-origin", label: "Single origin" },
    { value: "blend", label: "Blends" },
    { value: "decaf", label: "Decaf" },
  ];

  return (
    <section id="shop" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-caramel-600">The lineup</p>
              <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                This week <em className="font-light text-caramel-600 italic">on the shelf</em>
              </h2>
            </div>
            <p className="text-sm font-semibold text-espresso-950/50 tabular-nums">
              {filtered.length} of {active.length} coffees
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xs">
              <IconSearch className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-espresso-950/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search beans, notes, origins…"
                className="field pr-10 pl-10"
                aria-label="Search coffees"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute top-1/2 right-2.5 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-espresso-950/8 text-espresso-950/60 transition hover:bg-espresso-950 hover:text-cream-50"
                  aria-label="Clear search"
                >
                  <IconX className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCat(c.value)}
                  className={`rounded-full border px-4 py-2 text-[13px] font-bold transition-all active:scale-95 ${
                    cat === c.value
                      ? "border-espresso-950 bg-espresso-950 text-cream-50 shadow-md"
                      : "border-espresso-950/20 bg-transparent text-espresso-950/70 hover:border-espresso-950/60 hover:text-espresso-950"
                  }`}
                >
                  {c.label}
                  <span className={`ml-1.5 text-[11px] tabular-nums ${cat === c.value ? "text-caramel-300" : "text-espresso-950/40"}`}>
                    {counts[c.value] ?? 0}
                  </span>
                </button>
              ))}

              <div className="relative ml-0 lg:ml-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="field w-auto appearance-none pr-9 font-semibold"
                  aria-label="Sort coffees"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: low → high</option>
                  <option value="price-desc">Price: high → low</option>
                  <option value="name">Name A–Z</option>
                </select>
                <IconChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-espresso-950/50" />
              </div>
            </div>
          </div>
        </Reveal>

        {filtered.length > 0 ? (
          <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} onOpen={onOpenProduct} />
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-cream-200">
              <IconBeanSolid className="h-9 w-9 text-espresso-950/30" />
            </span>
            <p className="font-display text-2xl font-semibold">Nothing in the hopper matches that.</p>
            <p className="max-w-sm text-sm text-espresso-950/55">
              Try a tasting note like “chocolate”, an origin like “Ethiopia”, or clear the filters entirely.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setCat("all");
              }}
              className="mt-1 rounded-full bg-espresso-950 px-6 py-3 text-sm font-bold text-cream-50 transition hover:bg-caramel-600 active:scale-95"
            >
              Clear search & filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------- craft section ---------------------------- */

const STEPS = [
  {
    n: "01",
    icon: IconLeaf,
    title: "Sourcing",
    body: "We buy from twelve farms we can name, at prices we publish, through importers who treat growers like partners — not suppliers.",
  },
  {
    n: "02",
    icon: IconFlame,
    title: "Roasting",
    body: "Small 12-kilo drums on a vintage Probat. We roast to the bean in front of us, and every single batch is cupped the next morning.",
  },
  {
    n: "03",
    icon: IconTimer,
    title: "Resting",
    body: "Every bag rests 48 hours before dispatch, so it lands at your door at the peak of its curve — not three weeks past it.",
  },
];

function Craft() {
  return (
    <section id="craft" className="relative scroll-mt-16 overflow-hidden bg-espresso-950 text-cream-100">
      <div className="pointer-events-none absolute top-10 right-0 font-display text-[11rem] font-bold text-cream-50/[0.03] italic select-none">
        roast
      </div>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
        <Reveal>
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-caramel-300">Our craft</p>
          <h2 className="mt-3 max-w-xl font-display text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
            From cherry to cup in <em className="font-light text-caramel-300 italic">three</em> unhurried steps.
          </h2>
        </Reveal>

        <div className="relative mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
          <div className="absolute top-7 right-[16%] left-[16%] hidden border-t-2 border-dashed border-cream-50/15 md:block" />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 130} className={i === 1 ? "relative md:translate-y-8" : "relative"}>
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-caramel-400/40 bg-espresso-900 text-caramel-300">
                  <s.icon className="h-6 w-6" />
                </span>
                <span className="font-display text-5xl font-bold text-caramel-400/70">{s.n}</span>
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold">{s.title}</h3>
              <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-cream-100/60">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- promo band ------------------------------ */

function PromoBand() {
  const { toast } = useStore();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText("EMBER10");
    } catch {
      /* clipboard blocked — the code is visible anyway */
    }
    setCopied(true);
    toast("EMBER10 copied — apply it at checkout", "success");
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 pb-20 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-xl bg-caramel-400 text-espresso-950">
          <div className="pointer-events-none absolute -top-10 -right-6 opacity-15">
            <IconBeanSolid className="h-44 w-44 -rotate-12" />
          </div>
          <div className="flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                First order? Take <em className="italic">10% off.</em>
              </h3>
              <p className="mt-2 max-w-md text-sm font-semibold text-espresso-950/70">
                Use code <span className="rounded bg-espresso-950 px-1.5 py-0.5 font-mono text-caramel-300">EMBER10</span> at
                checkout — it stacks with free shipping over $40.
              </p>
            </div>
            <button
              onClick={copy}
              className={`flex shrink-0 items-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-bold transition active:scale-95 ${
                copied ? "bg-moss-500 text-cream-50" : "bg-espresso-950 text-cream-50 hover:bg-espresso-800"
              }`}
            >
              {copied ? <IconCheck className="h-4.5 w-4.5" /> : <IconCopy className="h-4.5 w-4.5" />}
              {copied ? "Copied to clipboard" : "Copy code"}
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* --------------------------------- page ----------------------------------- */

export function ShopPage({ onOpenProduct }: { onOpenProduct: (id: string) => void }) {
  return (
    <main>
      <Hero onOpenProduct={onOpenProduct} />
      <Ticker />
      <Shelf onOpenProduct={onOpenProduct} />
      <Craft />
      <PromoBand />
    </main>
  );
}
