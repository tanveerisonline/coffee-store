import { useState } from "react";
import { CATEGORY_LABEL, money, useStore } from "../lib/store";
import type { Product } from "../lib/store";
import { BagArt, IconBag, IconCheck, IconMinus, IconPlus, IconX, RoastMeter, useEscape, useScrollLock } from "./ui";

function BadgePill({ text }: { text: string }) {
  const tone =
    text === "Roast of the week"
      ? "bg-caramel-400 text-espresso-950"
      : text === "Espresso pick"
        ? "bg-espresso-950 text-cream-50"
        : "bg-ember-500 text-cream-50";
  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${tone}`}>{text}</span>
  );
}

export function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToCart, toast } = useStore();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useScrollLock(true);
  useEscape(true, onClose);

  const soldOut = product.stock <= 0;
  const low = !soldOut && product.stock <= 5;

  const add = () => {
    if (soldOut) return;
    addToCart(product.id, qty);
    setAdded(true);
    toast(`${product.name} × ${qty} added to your bag`, "success");
    window.setTimeout(onClose, 550);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label={product.name}>
      <button className="fixed inset-0 bg-espresso-950/70 backdrop-blur-[3px]" onClick={onClose} aria-label="Close" />
      <div className="relative mx-auto my-6 w-[calc(100%-2rem)] max-w-3xl animate-pop sm:my-12">
        <div className="grid overflow-hidden rounded-xl bg-cream-50 shadow-2xl md:grid-cols-2">
          <div className="relative bg-cream-200">
            {product.image ? (
              <img src={product.image} alt={product.name} className="h-64 w-full object-cover md:h-full" loading="eager" decoding="async" />
            ) : (
              <div className="grid h-64 w-full place-items-center md:h-full">
                <BagArt color={product.color} className="h-44 w-44" />
              </div>
            )}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {product.badge && <BadgePill text={product.badge} />}
              {low && <BadgePill text={`Only ${product.stock} left`} />}
              {soldOut && <BadgePill text="Sold out" />}
            </div>
          </div>

          <div className="flex flex-col p-6 sm:p-8">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-caramel-600">
                {CATEGORY_LABEL[product.category]} · {product.origin}
              </p>
              <button
                onClick={onClose}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-espresso-950/15 text-espresso-950/60 transition hover:bg-espresso-950 hover:text-cream-50"
                aria-label="Close details"
              >
                <IconX className="h-4 w-4" />
              </button>
            </div>

            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{product.name}</h2>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.notes.map((n) => (
                <span key={n} className="rounded-full border border-espresso-950/15 bg-cream-100 px-2.5 py-1 text-[11px] font-semibold">
                  {n}
                </span>
              ))}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-espresso-950/70">{product.description}</p>

            <dl className="mt-5 space-y-2 border-t border-espresso-950/10 pt-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-espresso-950/50">Process</dt>
                <dd className="font-semibold">{product.process}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-espresso-950/50">Altitude</dt>
                <dd className="font-semibold">{product.altitude}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-espresso-950/50">Weight</dt>
                <dd className="font-semibold">{product.weight}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-espresso-950/50">Roast level</dt>
                <dd>
                  <RoastMeter level={product.roast} />
                </dd>
              </div>
            </dl>

            <div className="mt-auto pt-6">
              <div className="flex items-end justify-between">
                <p className="font-display text-3xl font-bold">{money(product.price)}</p>
                {low && <p className="text-xs font-bold text-ember-600">Selling fast — {product.stock} in stock</p>}
                {soldOut && <p className="text-xs font-bold text-ember-600">Back on the next roast</p>}
              </div>

              <div className="mt-4 flex gap-3">
                <div className="flex items-center rounded-full border border-espresso-950/20">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="grid h-11 w-10 place-items-center rounded-l-full transition hover:bg-cream-200 active:scale-90 disabled:opacity-30"
                    disabled={qty <= 1 || soldOut}
                    aria-label="Decrease quantity"
                  >
                    <IconMinus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-extrabold tabular-nums">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="grid h-11 w-10 place-items-center rounded-r-full transition hover:bg-cream-200 active:scale-90 disabled:opacity-30"
                    disabled={qty >= product.stock || soldOut}
                    aria-label="Increase quantity"
                  >
                    <IconPlus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={add}
                  disabled={soldOut}
                  className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-full text-sm font-bold transition active:scale-[0.97] ${
                    soldOut
                      ? "cursor-not-allowed bg-espresso-950/15 text-espresso-950/40"
                      : added
                        ? "bg-moss-500 text-cream-50"
                        : "bg-espresso-950 text-cream-50 hover:bg-caramel-600"
                  }`}
                >
                  {added ? (
                    <>
                      <IconCheck className="h-4.5 w-4.5" /> In the bag
                    </>
                  ) : (
                    <>
                      <IconBag className="h-4.5 w-4.5" /> Add to bag
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
