import { useEffect, useMemo, useState } from "react";
import { CATEGORY_LABEL, ORDER_STATUSES, money, round2, useStore } from "../lib/store";
import type { Category, Order, OrderStatus, Product } from "../lib/store";
import { Logo } from "../components/chrome";
import {
  BagArt,
  IconArrowLeft,
  IconBox,
  IconCheck,
  IconChevronDown,
  IconGrid,
  IconPencil,
  IconReceipt,
  IconSearch,
  IconTrash,
  IconX,
  RoastMeter,
} from "../components/ui";

/* --------------------------------- helpers -------------------------------- */

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const STATUS_TONE: Record<OrderStatus, string> = {
  received: "border-cream-50/25 text-cream-100/85 bg-cream-50/5",
  roasting: "border-caramel-400/50 text-caramel-300 bg-caramel-400/10",
  shipped: "border-cream-50/45 text-cream-100 bg-cream-50/10",
  delivered: "border-moss-500/50 text-moss-300 bg-moss-500/10",
};

function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${STATUS_TONE[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function Thumb({ product, size = "h-11 w-11" }: { product: Pick<Product, "image" | "color" | "name">; size?: string }) {
  return (
    <span className={`${size} grid shrink-0 place-items-center overflow-hidden rounded-lg border border-cream-50/10 bg-espresso-800`}>
      {product.image ? (
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
      ) : (
        <BagArt color={product.color} className="h-[85%] w-[85%]" />
      )}
    </span>
  );
}

/* --------------------------------- overview -------------------------------- */

function Overview({ goOrders, goProducts }: { goOrders: () => void; goProducts: () => void }) {
  const { orders, products, restock, toast } = useStore();

  const stats = useMemo(() => {
    const now = Date.now();
    const day = 86400000;
    const inLast = (o: Order, days: number) => o.placedAt >= now - days * day;
    const sum = (os: Order[]) => round2(os.reduce((s, o) => s + o.total, 0));

    const last14 = orders.filter((o) => inLast(o, 14));
    const rev14 = sum(last14);
    const rev7 = sum(last14.filter((o) => inLast(o, 7)));
    const prev7 = sum(last14.filter((o) => o.placedAt < now - 7 * day));
    const delta = prev7 > 0 ? ((rev7 - prev7) / prev7) * 100 : rev7 > 0 ? 100 : 0;
    const units14 = last14.reduce((s, o) => s + o.items.reduce((x, i) => x + i.qty, 0), 0);

    const days: { label: string; value: number; isToday: boolean }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now - i * day);
      const key = d.toDateString();
      days.push({
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: round2(orders.filter((o) => new Date(o.placedAt).toDateString() === key).reduce((s, o) => s + o.total, 0)),
        isToday: i === 0,
      });
    }
    const maxDay = Math.max(...days.map((d) => d.value), 1);

    const byProduct = new Map<string, { name: string; qty: number; rev: number; color: string }>();
    for (const o of orders) {
      for (const it of o.items) {
        const cur = byProduct.get(it.productId) ?? { name: it.name, qty: 0, rev: 0, color: "#c4813f" };
        cur.qty += it.qty;
        cur.rev = round2(cur.rev + it.qty * it.price);
        byProduct.set(it.productId, cur);
      }
    }
    for (const [id, v] of byProduct) {
      const p = products.find((x) => x.id === id);
      if (p) v.color = p.color;
    }
    const top = [...byProduct.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);
    const maxTop = Math.max(...top.map((t) => t.qty), 1);

    return {
      rev14,
      delta,
      orders14: last14.length,
      aov: last14.length ? round2(rev14 / last14.length) : 0,
      units14,
      days,
      maxDay,
      top,
      maxTop,
    };
  }, [orders, products]);

  const lowStock = useMemo(
    () => products.filter((p) => p.stock <= 5).sort((a, b) => a.stock - b.stock).slice(0, 5),
    [products]
  );
  const recent = useMemo(() => [...orders].sort((a, b) => b.placedAt - a.placedAt).slice(0, 5), [orders]);

  const kpis = [
    { label: "Revenue · 14d", value: money(stats.rev14), delta: stats.delta },
    { label: "Orders · 14d", value: String(stats.orders14), delta: null as number | null },
    { label: "Avg order value", value: money(stats.aov), delta: null },
    { label: "Units sold · 14d", value: String(stats.units14), delta: null },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k, i) => (
          <div key={k.label} className={`rounded-xl border border-cream-50/10 bg-espresso-900 p-5 ${i === 0 ? "border-caramel-400/30" : ""}`}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream-100/40">{k.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-tight tabular-nums">{k.value}</p>
            {k.delta !== null && (
              <p className={`mt-1.5 text-xs font-bold ${k.delta >= 0 ? "text-moss-300" : "text-ember-500"}`}>
                {k.delta >= 0 ? "▲" : "▼"} {Math.abs(k.delta).toFixed(0)}% vs prior week
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-cream-50/10 bg-espresso-900 p-5 lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-xl font-semibold">Revenue — last 14 days</h3>
            <p className="text-xs font-bold text-cream-100/40 tabular-nums">peak {money(stats.maxDay)}</p>
          </div>
          <div className="mt-6 flex h-40 items-end gap-[6px]">
            {stats.days.map((d, i) => (
              <div key={i} className="group relative flex h-full flex-1 flex-col justify-end">
                <span className="pointer-events-none absolute -top-7 left-1/2 z-10 -translate-x-1/2 rounded bg-espresso-950 px-2 py-1 text-[10px] font-bold whitespace-nowrap text-cream-50 opacity-0 shadow-lg ring-1 ring-cream-50/15 transition-opacity duration-150 group-hover:opacity-100 tabular-nums">
                  {d.label} · {money(d.value)}
                </span>
                <div
                  className={`w-full origin-bottom animate-bar rounded-t-[4px] transition-colors ${
                    d.isToday ? "bg-ember-500 group-hover:bg-ember-600" : d.value > 0 ? "bg-caramel-500 group-hover:bg-caramel-400" : "bg-cream-50/10 group-hover:bg-cream-50/20"
                  }`}
                  style={{ height: `${Math.max(4, (d.value / stats.maxDay) * 100)}%`, animationDelay: `${i * 40}ms` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-semibold text-cream-100/35">
            <span>{stats.days[0]?.label}</span>
            <span className="text-ember-500">today</span>
          </div>
        </div>

        <div className="rounded-xl border border-cream-50/10 bg-espresso-900 p-5">
          <h3 className="font-display text-xl font-semibold">Top coffees</h3>
          <ul className="mt-4 space-y-3.5">
            {stats.top.map((t) => (
              <li key={t.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-semibold">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.color }} />
                    {t.name}
                  </span>
                  <span className="text-cream-100/45 tabular-nums">
                    {t.qty} bags · {money(t.rev)}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-cream-50/8">
                  <div className="h-full rounded-full bg-caramel-400 transition-all duration-700" style={{ width: `${(t.qty / stats.maxTop) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-cream-50/10 bg-espresso-900 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold">Low stock</h3>
            <span className="rounded-full bg-ember-500/15 px-2.5 py-1 text-[11px] font-bold text-ember-500">{lowStock.length} alerts</span>
          </div>
          {lowStock.length === 0 ? (
            <p className="mt-4 flex items-center gap-2 text-sm text-cream-100/50">
              <IconCheck className="h-4 w-4 text-moss-300" /> Everything's comfortably stocked.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <Thumb product={p} size="h-10 w-10" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{p.name}</p>
                    <p className={`text-xs font-bold ${p.stock === 0 ? "text-ember-500" : "text-caramel-300"}`}>
                      {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      restock(p.id, 10);
                      toast(`Restocked ${p.name} +10 bags`, "success");
                    }}
                    className="rounded-full border border-cream-50/20 px-3 py-1.5 text-xs font-bold text-cream-100/75 transition hover:border-moss-400 hover:text-moss-300 active:scale-95"
                  >
                    +10
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button onClick={goProducts} className="mt-5 w-full rounded-full border border-cream-50/15 py-2.5 text-xs font-bold text-cream-100/60 transition hover:border-caramel-400 hover:text-caramel-300">
            Manage inventory →
          </button>
        </div>

        <div className="rounded-xl border border-cream-50/10 bg-espresso-900 p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold">Recent orders</h3>
            <button onClick={goOrders} className="text-xs font-bold text-caramel-300 transition hover:text-caramel-400">
              View all →
            </button>
          </div>
          <ul className="mt-4 divide-y divide-cream-50/8">
            {recent.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 first:pt-0 last:pb-0">
                <span className="font-mono text-sm font-bold text-caramel-300">{o.id}</span>
                <span className="min-w-0 flex-1 truncate text-sm text-cream-100/70">
                  {o.customer.name} · {o.items.reduce((s, i) => s + i.qty, 0)} items
                </span>
                <span className="text-xs text-cream-100/40">{timeAgo(o.placedAt)}</span>
                <span className="font-display text-sm font-bold tabular-nums">{money(o.total)}</span>
                <StatusPill status={o.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ product form ------------------------------ */

const COLOR_OPTIONS = ["#e3d5b8", "#b0603c", "#3a2a22", "#c4813f", "#d9a441", "#8a9270"];

interface Draft {
  name: string;
  origin: string;
  process: string;
  altitude: string;
  category: Category;
  roast: number;
  price: string;
  stock: string;
  weight: string;
  notes: string;
  description: string;
  color: string;
}

function ProductForm({ initial, onDone }: { initial: Product | null; onDone: () => void }) {
  const { addProduct, updateProduct, toast } = useStore();
  const [d, setD] = useState<Draft>(() =>
    initial
      ? {
          name: initial.name,
          origin: initial.origin,
          process: initial.process,
          altitude: initial.altitude,
          category: initial.category,
          roast: initial.roast,
          price: String(initial.price),
          stock: String(initial.stock),
          weight: initial.weight,
          notes: initial.notes.join(", "),
          description: initial.description,
          color: initial.color,
        }
      : {
          name: "",
          origin: "",
          process: "Washed",
          altitude: "1,500 m",
          category: "single-origin",
          roast: 3,
          price: "",
          stock: "12",
          weight: "340 g",
          notes: "",
          description: "",
          color: "#c4813f",
        }
  );
  const [errs, setErrs] = useState<Record<string, string>>({});

  const setK = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!d.name.trim()) errors.name = "Give it a name.";
    const price = parseFloat(d.price);
    if (!(price > 0)) errors.price = "Price must be above $0.";
    const stock = parseInt(d.stock, 10);
    if (!(stock >= 0)) errors.stock = "Stock can't be negative.";
    setErrs(errors);
    if (Object.keys(errors).length > 0) return;

    const payload = {
      name: d.name.trim(),
      origin: d.origin.trim() || "Origin TBD",
      process: d.process.trim() || "Washed",
      altitude: d.altitude.trim() || "—",
      category: d.category,
      roast: d.roast,
      price: round2(price),
      stock,
      weight: d.weight.trim() || "340 g",
      notes: d.notes.split(",").map((n) => n.trim()).filter(Boolean).slice(0, 4),
      description: d.description.trim() || "Fresh off the roasting bench — tasting notes to come from tomorrow's cupping.",
      color: d.color,
    };

    if (initial) {
      updateProduct(initial.id, payload);
      toast(`Saved changes to ${payload.name}`, "success");
    } else {
      addProduct({ ...payload, image: "", active: true });
      toast(`${payload.name} added to the shelf`, "success");
    }
    onDone();
  };

  const darkSel = "field-dark appearance-none pr-9";

  return (
    <form onSubmit={submit} className="animate-rise rounded-xl border border-caramel-400/30 bg-espresso-900 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold">{initial ? `Edit — ${initial.name}` : "New coffee"}</h3>
        <button type="button" onClick={onDone} className="grid h-8 w-8 place-items-center rounded-full border border-cream-50/15 text-cream-100/60 transition hover:bg-cream-50 hover:text-espresso-950" aria-label="Cancel">
          <IconX className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-cream-100/45">Name *</span>
          <input className="field-dark" value={d.name} onChange={(e) => setK("name", e.target.value)} placeholder="Midnight Oil" />
          {errs.name && <span className="mt-1 block text-[11px] font-semibold text-ember-500">{errs.name}</span>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-cream-100/45">Origin</span>
          <input className="field-dark" value={d.origin} onChange={(e) => setK("origin", e.target.value)} placeholder="Nyeri, Kenya" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-cream-100/45">Process</span>
          <input className="field-dark" value={d.process} onChange={(e) => setK("process", e.target.value)} placeholder="Washed / Natural / Honey" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-cream-100/45">Altitude</span>
          <input className="field-dark" value={d.altitude} onChange={(e) => setK("altitude", e.target.value)} placeholder="1,800 m" />
        </label>
        <label className="relative block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-cream-100/45">Category</span>
          <select className={darkSel} value={d.category} onChange={(e) => setK("category", e.target.value as Category)}>
            <option value="single-origin">Single origin</option>
            <option value="blend">Blend</option>
            <option value="decaf">Decaf</option>
          </select>
          <IconChevronDown className="pointer-events-none absolute right-3 bottom-3 h-4 w-4 text-cream-100/40" />
        </label>
        <label className="relative block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-cream-100/45">Roast level</span>
          <select className={darkSel} value={d.roast} onChange={(e) => setK("roast", parseInt(e.target.value, 10))}>
            <option value={1}>1 — Light</option>
            <option value={2}>2 — Light +</option>
            <option value={3}>3 — Medium</option>
            <option value={4}>4 — Medium +</option>
            <option value={5}>5 — Dark</option>
          </select>
          <IconChevronDown className="pointer-events-none absolute right-3 bottom-3 h-4 w-4 text-cream-100/40" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-cream-100/45">Price ($) *</span>
          <input className="field-dark no-spin" type="number" step="0.5" min="0" value={d.price} onChange={(e) => setK("price", e.target.value)} placeholder="19.00" />
          {errs.price && <span className="mt-1 block text-[11px] font-semibold text-ember-500">{errs.price}</span>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-cream-100/45">Stock (bags) *</span>
          <input className="field-dark no-spin" type="number" min="0" value={d.stock} onChange={(e) => setK("stock", e.target.value)} placeholder="12" />
          {errs.stock && <span className="mt-1 block text-[11px] font-semibold text-ember-500">{errs.stock}</span>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-cream-100/45">Weight</span>
          <input className="field-dark" value={d.weight} onChange={(e) => setK("weight", e.target.value)} placeholder="340 g" />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-cream-100/45">Tasting notes (comma separated)</span>
          <input className="field-dark" value={d.notes} onChange={(e) => setK("notes", e.target.value)} placeholder="Blackcurrant, Panela, Black tea" />
        </label>
        <div>
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-cream-100/45">Bag color</span>
          <div className="flex items-center gap-2 pt-1">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setK("color", c)}
                className={`h-8 w-8 rounded-full border-2 transition ${d.color === c ? "scale-110 border-caramel-300" : "border-transparent opacity-70 hover:opacity-100"}`}
                style={{ background: c }}
                aria-label={`Bag color ${c}`}
              />
            ))}
          </div>
        </div>
        <label className="block sm:col-span-2 lg:col-span-3">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-cream-100/45">Description</span>
          <textarea className="field-dark min-h-20 resize-y" value={d.description} onChange={(e) => setK("description", e.target.value)} placeholder="What makes this coffee worth the shelf space?" />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="submit" className="flex items-center gap-2 rounded-full bg-caramel-400 px-6 py-3 text-sm font-bold text-espresso-950 transition hover:bg-caramel-300 active:scale-95">
          <IconCheck className="h-4 w-4" /> {initial ? "Save changes" : "Add to shelf"}
        </button>
        <button type="button" onClick={onDone} className="rounded-full border border-cream-50/20 px-6 py-3 text-sm font-bold text-cream-100/70 transition hover:border-cream-50/50 hover:text-cream-50">
          Cancel
        </button>
        <p className="text-[11px] text-cream-100/35">New coffees render with a house bag illustration until photography lands.</p>
      </div>
    </form>
  );
}

/* ------------------------------ products panel ---------------------------- */

function NumInput({
  value,
  onCommit,
  min = 0,
  step = 1,
  className = "",
  prefix,
}: {
  value: number;
  onCommit: (v: number) => void;
  min?: number;
  step?: number;
  className?: string;
  prefix?: string;
}) {
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);
  return (
    <span className={`relative inline-flex items-center ${className}`}>
      {prefix && <span className="pointer-events-none absolute left-2.5 text-cream-100/40">{prefix}</span>}
      <input
        type="number"
        min={min}
        step={step}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          const v = parseFloat(text);
          if (!Number.isNaN(v) && v >= min && v !== value) onCommit(round2(v));
          else setText(String(value));
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
        className={`field-dark no-spin py-1.5 text-sm tabular-nums ${prefix ? "pl-7" : ""} ${className}`}
      />
    </span>
  );
}

function ProductsPanel() {
  const { products, updateProduct, deleteProduct, toggleProduct, toast } = useStore();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (!confirmId) return;
    const t = window.setTimeout(() => setConfirmId(null), 2600);
    return () => window.clearTimeout(t);
  }, [confirmId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.origin.toLowerCase().includes(q);
    });
  }, [products, query, cat]);

  return (
    <div className="space-y-5">
      {(creating || editing) && (
        <ProductForm
          key={editing?.id ?? "new"}
          initial={editing}
          onDone={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <IconSearch className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-cream-100/35" />
          <input className="field-dark pl-9" placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search products" />
        </div>
        <div className="relative sm:w-48">
          <select className="field-dark appearance-none pr-9" value={cat} onChange={(e) => setCat(e.target.value as Category | "all")} aria-label="Filter by category">
            <option value="all">All categories</option>
            <option value="single-origin">Single origin</option>
            <option value="blend">Blend</option>
            <option value="decaf">Decaf</option>
          </select>
          <IconChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-cream-100/40" />
        </div>
        <button
          onClick={() => {
            setCreating(true);
            setEditing(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="rounded-full bg-caramel-400 px-5 py-2.5 text-sm font-bold text-espresso-950 transition hover:bg-caramel-300 active:scale-95 sm:ml-auto"
        >
          + New product
        </button>
      </div>

      <div className="nice-scroll-dark overflow-x-auto rounded-xl border border-cream-50/10">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-cream-50/10 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-cream-100/40">
              <th className="py-3 pr-4 pl-4">Product</th>
              <th className="py-3 pr-4">Category</th>
              <th className="py-3 pr-4">Roast</th>
              <th className="py-3 pr-4">Price</th>
              <th className="py-3 pr-4">Stock</th>
              <th className="py-3 pr-4">Visibility</th>
              <th className="py-3 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className={`border-b border-cream-50/6 transition-colors last:border-0 hover:bg-espresso-900/70 ${p.active ? "" : "opacity-50"}`}>
                <td className="py-3 pr-4 pl-4">
                  <div className="flex items-center gap-3">
                    <Thumb product={p} />
                    <div className="min-w-0">
                      <p className="truncate font-bold">{p.name}</p>
                      <p className="truncate text-xs text-cream-100/45">{p.origin}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <span className="rounded-full border border-cream-50/15 px-2.5 py-1 text-[11px] font-bold text-cream-100/70">
                    {CATEGORY_LABEL[p.category]}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <RoastMeter level={p.roast} dark />
                </td>
                <td className="py-3 pr-4">
                  <NumInput value={p.price} step={0.5} prefix="$" className="w-24" onCommit={(v) => updateProduct(p.id, { price: v })} />
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <NumInput value={p.stock} className="w-20" onCommit={(v) => updateProduct(p.id, { stock: Math.floor(v) })} />
                    {p.stock === 0 ? (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-ember-500">Out</span>
                    ) : p.stock <= 5 ? (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-caramel-300">Low</span>
                    ) : null}
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <button
                    onClick={() => {
                      toggleProduct(p.id);
                      toast(`${p.name} is now ${p.active ? "hidden from" : "live on"} the shelf`, "info");
                    }}
                    className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${p.active ? "bg-moss-500" : "bg-cream-50/15"}`}
                    role="switch"
                    aria-checked={p.active}
                    aria-label={`Toggle ${p.name} visibility`}
                  >
                    <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-cream-50 shadow transition-transform duration-300 ${p.active ? "translate-x-5" : ""}`} />
                  </button>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => {
                        setEditing(p);
                        setCreating(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="grid h-8 w-8 place-items-center rounded-full border border-cream-50/15 text-cream-100/60 transition hover:border-caramel-400 hover:text-caramel-300 active:scale-90"
                      aria-label={`Edit ${p.name}`}
                    >
                      <IconPencil className="h-3.5 w-3.5" />
                    </button>
                    {confirmId === p.id ? (
                      <button
                        onClick={() => {
                          deleteProduct(p.id);
                          setConfirmId(null);
                          toast(`${p.name} removed from the shelf`, "warn");
                        }}
                        className="rounded-full bg-ember-600 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-cream-50 transition hover:bg-ember-500 active:scale-95"
                      >
                        Sure?
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmId(p.id)}
                        className="grid h-8 w-8 place-items-center rounded-full border border-cream-50/15 text-cream-100/60 transition hover:border-ember-500 hover:text-ember-500 active:scale-90"
                        aria-label={`Delete ${p.name}`}
                      >
                        <IconTrash className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-cream-100/45">
                  No products match — adjust the search or add a new coffee.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-cream-100/35">
        Tip: price and stock edits save on Enter or blur · toggling visibility hides a coffee from the storefront instantly.
      </p>
    </div>
  );
}

/* ------------------------------- orders panel ------------------------------ */

function OrdersPanel() {
  const { orders, setOrderStatus, toast } = useStore();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const sorted = useMemo(() => [...orders].sort((a, b) => b.placedAt - a.placedAt), [orders]);
  const filtered = filter === "all" ? sorted : sorted.filter((o) => o.status === filter);

  const countFor = (s: OrderStatus | "all") => (s === "all" ? orders.length : orders.filter((o) => o.status === s).length);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {(["all", ...ORDER_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-4 py-2 text-[13px] font-bold capitalize transition-all active:scale-95 ${
              filter === s
                ? "border-caramel-400 bg-caramel-400 text-espresso-950"
                : "border-cream-50/15 text-cream-100/60 hover:border-cream-50/40 hover:text-cream-100"
            }`}
          >
            {s === "all" ? "All" : s}
            <span className={`ml-1.5 text-[11px] tabular-nums ${filter === s ? "text-espresso-950/60" : "text-cream-100/35"}`}>{countFor(s)}</span>
          </button>
        ))}
      </div>

      <div className="nice-scroll-dark overflow-x-auto rounded-xl border border-cream-50/10">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-cream-50/10 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-cream-100/40">
              <th className="py-3 pr-4 pl-4">Order</th>
              <th className="py-3 pr-4">Customer</th>
              <th className="py-3 pr-4">Items</th>
              <th className="py-3 pr-4">Total</th>
              <th className="py-3 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-cream-50/6 align-top transition-colors last:border-0 hover:bg-espresso-900/70">
                <td className="py-3.5 pr-4 pl-4">
                  <p className="font-mono font-bold text-caramel-300">{o.id}</p>
                  <p className="mt-0.5 text-xs text-cream-100/40">
                    {new Date(o.placedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {timeAgo(o.placedAt)}
                  </p>
                </td>
                <td className="py-3.5 pr-4">
                  <p className="font-bold">{o.customer.name}</p>
                  <p className="mt-0.5 text-xs text-cream-100/45">{o.customer.email}</p>
                  <p className="text-xs text-cream-100/35">
                    {o.customer.address}, {o.customer.city} {o.customer.zip}
                  </p>
                </td>
                <td className="max-w-60 py-3.5 pr-4">
                  <p className="text-cream-100/75">{o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</p>
                  {o.discount > 0 && <p className="mt-0.5 text-xs font-semibold text-moss-300">promo −{money(o.discount)}</p>}
                </td>
                <td className="py-3.5 pr-4">
                  <p className="font-display text-base font-bold tabular-nums">{money(o.total)}</p>
                  <p className="text-xs text-cream-100/40">{o.shipping === 0 ? "free shipping" : `+${money(o.shipping)} shipping`}</p>
                </td>
                <td className="py-3.5 pr-4">
                  <div className="relative inline-flex">
                    <select
                      value={o.status}
                      onChange={(e) => {
                        const s = e.target.value as OrderStatus;
                        setOrderStatus(o.id, s);
                        toast(`${o.id} marked as ${s}`, s === "delivered" ? "success" : "info");
                      }}
                      className={`cursor-pointer appearance-none rounded-full border py-1.5 pr-8 pl-3 text-[11px] font-bold capitalize outline-none transition focus:ring-2 focus:ring-caramel-400/30 ${STATUS_TONE[o.status]} bg-transparent [&>option]:bg-espresso-900 [&>option]:text-cream-50`}
                      aria-label={`Status for order ${o.id}`}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <IconChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 opacity-60" />
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-cream-100/45">
                  No orders with this status yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------------------------- page ---------------------------------- */

type Tab = "overview" | "products" | "orders";

export function Admin({ navigate }: { navigate: (to: string) => void }) {
  const { products, orders, resetDemo, toast } = useStore();
  const [tab, setTab] = useState<Tab>("overview");
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (!confirmReset) return;
    const t = window.setTimeout(() => setConfirmReset(false), 2800);
    return () => window.clearTimeout(t);
  }, [confirmReset]);

  const openOrders = orders.filter((o) => o.status === "received" || o.status === "roasting").length;

  const tabs: { id: Tab; label: string; icon: typeof IconGrid; count?: number }[] = [
    { id: "overview", label: "Overview", icon: IconGrid },
    { id: "products", label: "Products", icon: IconBox, count: products.length },
    { id: "orders", label: "Orders", icon: IconReceipt, count: orders.length },
  ];

  return (
    <div className="min-h-screen bg-espresso-950 text-cream-100">
      <div className="sticky top-0 z-40 border-b border-cream-50/10 bg-espresso-950/92 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="grid h-9 w-9 place-items-center rounded-full border border-cream-50/15 text-cream-100/60 transition hover:border-caramel-400 hover:text-caramel-300" aria-label="Back to storefront">
              <IconArrowLeft className="h-4 w-4" />
            </button>
            <Logo dark />
            <span className="hidden rounded-full border border-caramel-400/40 bg-caramel-400/10 px-3 py-1 text-[11px] font-bold text-caramel-300 sm:inline">
              Roastery OS · demo access
            </span>
          </div>
          <div className="flex items-center gap-2">
            {confirmReset ? (
              <button
                onClick={() => {
                  resetDemo();
                  setConfirmReset(false);
                  toast("Demo data restored to opening day", "success");
                }}
                className="rounded-full bg-ember-600 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-cream-50 transition hover:bg-ember-500 active:scale-95"
              >
                Confirm reset
              </button>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="hidden rounded-full border border-cream-50/20 px-4 py-2 text-xs font-bold text-cream-100/60 transition hover:border-ember-500 hover:text-ember-500 sm:block"
              >
                Reset demo data
              </button>
            )}
            <button
              onClick={() => navigate("/")}
              className="rounded-full bg-caramel-400 px-4 py-2 text-sm font-bold text-espresso-950 transition hover:bg-caramel-300 active:scale-95"
            >
              View storefront
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav className="flex gap-7 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex shrink-0 items-center gap-2 pt-3 pb-3.5 text-sm font-bold transition ${
                  tab === t.id ? "text-caramel-300" : "text-cream-100/45 hover:text-cream-100"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                {t.count !== undefined && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] tabular-nums ${tab === t.id ? "bg-caramel-400/20 text-caramel-300" : "bg-cream-50/10 text-cream-100/50"}`}>
                    {t.count}
                  </span>
                )}
                <span className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-caramel-400 transition-opacity ${tab === t.id ? "opacity-100" : "opacity-0"}`} />
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-caramel-300">Back of house</p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {tab === "overview" ? "How the roastery is doing" : tab === "products" ? "The shelf, managed" : "Every order, in one ledger"}
            </h1>
          </div>
          {openOrders > 0 && tab !== "orders" && (
            <button onClick={() => setTab("orders")} className="rounded-full border border-caramel-400/40 bg-caramel-400/10 px-4 py-2 text-xs font-bold text-caramel-300 transition hover:bg-caramel-400/20 active:scale-95">
              {openOrders} orders need attention →
            </button>
          )}
        </div>

        {tab === "overview" && <Overview goOrders={() => setTab("orders")} goProducts={() => setTab("products")} />}
        {tab === "products" && <ProductsPanel />}
        {tab === "orders" && <OrdersPanel />}
      </div>
    </div>
  );
}
