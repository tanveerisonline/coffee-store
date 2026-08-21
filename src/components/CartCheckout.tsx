import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { FLAT_SHIPPING, FREE_SHIP_THRESHOLD, PROMOS, money, round2, useStore } from "../lib/store";
import type { Order } from "../lib/store";
import { BagArt, IconArrowLeft, IconArrowRight, IconBag, IconCheck, IconInfo, IconMinus, IconPlus, IconTrash, IconX, useEscape, useScrollLock } from "./ui";

/* -------------------------------- cart drawer ------------------------------ */

export function CartDrawer({ open, onClose, onCheckout }: { open: boolean; onClose: () => void; onCheckout: () => void }) {
  const { cartLines, cartSubtotal, cartCount, setQty, removeFromCart } = useStore();

  useScrollLock(open);
  useEscape(open, onClose);

  if (!open) return null;

  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - cartSubtotal);
  const progress = Math.min(100, (cartSubtotal / FREE_SHIP_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <button className="absolute inset-0 bg-espresso-950/60 backdrop-blur-[2px]" onClick={onClose} aria-label="Close bag" />

      <div className="absolute top-0 right-0 flex h-full w-full max-w-md animate-slide-right flex-col bg-cream-50 shadow-2xl">
        <div className="flex items-center justify-between border-b border-espresso-950/10 p-5">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Your bag{" "}
            <span className="ml-1 rounded-full bg-espresso-950 px-2.5 py-0.5 align-middle text-xs font-bold text-cream-50 tabular-nums">
              {cartCount}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-espresso-950/15 text-espresso-950/60 transition hover:bg-espresso-950 hover:text-cream-50"
            aria-label="Close"
          >
            <IconX className="h-4.5 w-4.5" />
          </button>
        </div>

        {cartLines.length > 0 && (
          <div className="border-b border-espresso-950/10 bg-cream-100 px-5 py-3.5">
            {remaining > 0 ? (
              <p className="text-xs font-bold">
                You're <span className="text-caramel-600">{money(remaining)}</span> away from free shipping
              </p>
            ) : (
              <p className="flex items-center gap-1.5 text-xs font-bold text-moss-600">
                <IconCheck className="h-3.5 w-3.5" /> Free shipping unlocked
              </p>
            )}
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-espresso-950/10">
              <div
                className={`h-full rounded-full transition-all duration-500 ${remaining > 0 ? "bg-caramel-500" : "bg-moss-500"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {cartLines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-cream-200">
              <IconBag className="h-9 w-9 text-espresso-950/35" />
            </span>
            <p className="font-display text-2xl font-semibold">Your bag is empty</p>
            <p className="text-sm text-espresso-950/55">Six coffees are waiting on the shelf — go find your next favorite cup.</p>
            <button
              onClick={onClose}
              className="mt-2 rounded-full bg-espresso-950 px-6 py-3 text-sm font-bold text-cream-50 transition hover:bg-caramel-600 active:scale-95"
            >
              Browse the shelf
            </button>
          </div>
        ) : (
          <>
            <ul className="nice-scroll flex-1 divide-y divide-espresso-950/8 overflow-y-auto px-5">
              {cartLines.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-3.5 py-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-espresso-950/10 bg-cream-200">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                    ) : (
                      <div className="grid h-full w-full place-items-center">
                        <BagArt color={product.color} className="h-14 w-14" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{product.name}</p>
                    <p className="text-xs text-espresso-950/50">
                      {money(product.price)} · {product.weight}
                    </p>
                    <div className="mt-2 inline-flex items-center rounded-full border border-espresso-950/15">
                      <button
                        onClick={() => setQty(product.id, qty - 1)}
                        className="grid h-7 w-8 place-items-center rounded-l-full transition hover:bg-cream-200 active:scale-90"
                        aria-label={`Decrease ${product.name}`}
                      >
                        <IconMinus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-7 text-center text-[13px] font-extrabold tabular-nums">{qty}</span>
                      <button
                        onClick={() => setQty(product.id, qty + 1)}
                        disabled={qty >= product.stock}
                        className="grid h-7 w-8 place-items-center rounded-r-full transition hover:bg-cream-200 active:scale-90 disabled:opacity-30"
                        aria-label={`Increase ${product.name}`}
                      >
                        <IconPlus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between py-0.5">
                    <p className="font-display text-sm font-bold tabular-nums">{money(product.price * qty)}</p>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-espresso-950/35 transition hover:text-ember-600"
                      aria-label={`Remove ${product.name}`}
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-3 border-t border-espresso-950/10 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-espresso-950/60">Subtotal</span>
                <span className="font-display text-xl font-bold tabular-nums">{money(cartSubtotal)}</span>
              </div>
              <p className="text-xs text-espresso-950/45">Shipping & promo codes are calculated at checkout.</p>
              <button
                onClick={onCheckout}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-espresso-950 py-3.5 text-sm font-bold text-cream-50 transition hover:bg-caramel-600 active:scale-[0.98]"
              >
                Checkout · {money(cartSubtotal)}
                <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button onClick={onClose} className="w-full text-center text-xs font-bold text-espresso-950/55 underline underline-offset-4 transition hover:text-espresso-950">
                Keep shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* --------------------------------- checkout -------------------------------- */

type Step = "details" | "payment" | "done";

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-espresso-950/55">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[11px] font-semibold text-ember-600">{error}</span>}
    </label>
  );
}

export function CheckoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cartLines, cartSubtotal, placeOrder, toast } = useStore();

  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", zip: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [card, setCard] = useState({ num: "", exp: "", cvc: "", holder: "" });
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<{ code: string; rate: number } | null>(null);
  const [promoErr, setPromoErr] = useState("");
  const [processing, setProcessing] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  useScrollLock(open);
  useEscape(open && !processing, () => {
    if (step === "done") toast("Order placed — check your inbox for the receipt", "success");
    onClose();
  });

  useEffect(() => {
    if (open) {
      setStep("details");
      setErrors({});
      setCardErrors({});
      setPromoInput("");
      setPromo(null);
      setPromoErr("");
      setProcessing(false);
      setOrder(null);
    }
  }, [open]);

  const discount = round2(cartSubtotal * (promo?.rate ?? 0));
  const shipBase = cartSubtotal - discount;
  const shipping = cartLines.length === 0 || shipBase >= FREE_SHIP_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = round2(shipBase + shipping);

  const stepIndex = step === "details" ? 0 : step === "payment" ? 1 : 2;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "We need a name for the label.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "That email doesn't look right.";
    if (!form.address.trim()) errs.address = "Where should the beans go?";
    if (!form.city.trim()) errs.city = "Required.";
    if (!/^\d{4,6}([ -]?\d{2,4})?$/.test(form.zip.trim())) errs.zip = "Invalid ZIP.";
    setErrors(errs);
    if (Object.keys(errs).length === 0) setStep("payment");
  };

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (PROMOS[code]) {
      setPromo({ code, rate: PROMOS[code] });
      setPromoErr("");
      toast(`${code} applied — ${Math.round(PROMOS[code] * 100)}% off`, "success");
    } else {
      setPromo(null);
      setPromoErr(`“${code}” isn't a valid code. Try EMBER10.`);
    }
  };

  const pay = () => {
    const errs: Record<string, string> = {};
    if (card.num.replace(/\s/g, "").length !== 16) errs.num = "Card number needs 16 digits.";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.exp)) errs.exp = "Use MM/YY.";
    if (!/^\d{3,4}$/.test(card.cvc)) errs.cvc = "3–4 digits.";
    if (!card.holder.trim()) errs.holder = "Name on card.";
    setCardErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setProcessing(true);
    window.setTimeout(() => {
      const placed = placeOrder(
        {
          name: form.name.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          zip: form.zip.trim(),
        },
        promo?.rate ?? 0
      );
      setOrder(placed);
      setProcessing(false);
      setStep("done");
      toast(`Order ${placed.id} confirmed — beans on the way`, "success");
    }, 1400);
  };

  const totalsBlock = useMemo(
    () => (
      <div className="space-y-1.5 rounded-lg bg-cream-100 p-4 text-sm">
        {cartLines.map((l) => (
          <div key={l.product.id} className="flex justify-between gap-3">
            <span className="text-espresso-950/70">
              {l.qty}× {l.product.name}
            </span>
            <span className="font-semibold tabular-nums">{money(l.product.price * l.qty)}</span>
          </div>
        ))}
        <div className="my-2 border-t border-espresso-950/10" />
        <div className="flex justify-between text-espresso-950/60">
          <span>Subtotal</span>
          <span className="tabular-nums">{money(cartSubtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between font-semibold text-moss-600">
            <span>Promo ({promo?.code})</span>
            <span className="tabular-nums">−{money(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-espresso-950/60">
          <span>Shipping</span>
          <span className="font-semibold tabular-nums">{shipping === 0 ? "Free" : money(shipping)}</span>
        </div>
        <div className="flex justify-between pt-1 font-display text-lg font-bold">
          <span>Total</span>
          <span className="tabular-nums">{money(total)}</span>
        </div>
      </div>
    ),
    [cartLines, cartSubtotal, discount, shipping, total, promo]
  );

  if (!open) return null;
  if (cartLines.length === 0 && step !== "done") return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Checkout">
      <button className="fixed inset-0 bg-espresso-950/70 backdrop-blur-[3px]" onClick={() => !processing && onClose()} aria-label="Close checkout" />

      <div className="relative mx-auto my-6 w-[calc(100%-2rem)] max-w-lg animate-pop sm:my-12">
        <div className="overflow-hidden rounded-xl bg-cream-50 shadow-2xl">
          <div className="flex items-center justify-between border-b border-espresso-950/10 p-5">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                {step === "details" ? "Checkout" : step === "payment" ? "Payment" : "Confirmed"}
              </h2>
              <div className="mt-2 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-9 rounded-full transition-colors duration-300 ${i <= stepIndex ? "bg-caramel-500" : "bg-espresso-950/12"}`}
                  />
                ))}
              </div>
            </div>
            {!processing && (
              <button
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-full border border-espresso-950/15 text-espresso-950/60 transition hover:bg-espresso-950 hover:text-cream-50"
                aria-label="Close"
              >
                <IconX className="h-4.5 w-4.5" />
              </button>
            )}
          </div>

          {step === "details" && (
            <form onSubmit={submitDetails} className="nice-scroll max-h-[65vh] space-y-4 overflow-y-auto p-5">
              <Field label="Full name" error={errors.name}>
                <input className="field" value={form.name} onChange={set("name")} placeholder="Frankie Bean" autoComplete="name" />
              </Field>
              <Field label="Email" error={errors.email}>
                <input className="field" type="email" value={form.email} onChange={set("email")} placeholder="you@somewhere.com" autoComplete="email" />
              </Field>
              <Field label="Street address" error={errors.address}>
                <input className="field" value={form.address} onChange={set("address")} placeholder="2140 SE Belmont St" autoComplete="street-address" />
              </Field>
              <div className="grid grid-cols-[1fr_110px] gap-4">
                <Field label="City" error={errors.city}>
                  <input className="field" value={form.city} onChange={set("city")} placeholder="Portland, OR" />
                </Field>
                <Field label="ZIP" error={errors.zip}>
                  <input className="field" value={form.zip} onChange={set("zip")} placeholder="97214" inputMode="numeric" autoComplete="postal-code" />
                </Field>
              </div>
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center gap-2 rounded-full border border-espresso-950/20 px-5 py-3 text-sm font-bold text-espresso-950/70 transition hover:border-espresso-950 hover:text-espresso-950"
                >
                  <IconArrowLeft className="h-4 w-4" /> Back to bag
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-full bg-espresso-950 px-6 py-3 text-sm font-bold text-cream-50 transition hover:bg-caramel-600 active:scale-[0.97]"
                >
                  Continue to payment <IconArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {step === "payment" && (
            <div className="nice-scroll max-h-[65vh] space-y-4 overflow-y-auto p-5">
              {totalsBlock}

              <div>
                {promo ? (
                  <div className="flex items-center justify-between rounded-lg border border-moss-500/40 bg-moss-500/10 px-4 py-2.5">
                    <p className="flex items-center gap-2 text-sm font-bold text-moss-600">
                      <IconCheck className="h-4 w-4" /> {promo.code} — {Math.round(promo.rate * 100)}% off applied
                    </p>
                    <button
                      onClick={() => {
                        setPromo(null);
                        setPromoInput("");
                      }}
                      className="text-moss-600/70 transition hover:text-ember-600"
                      aria-label="Remove promo code"
                    >
                      <IconX className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        className="field flex-1 uppercase"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          setPromoErr("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            applyPromo();
                          }
                        }}
                        placeholder="Promo code"
                      />
                      <button
                        onClick={applyPromo}
                        className="rounded-lg border border-espresso-950/25 px-4 text-sm font-bold transition hover:bg-espresso-950 hover:text-cream-50 active:scale-95"
                      >
                        Apply
                      </button>
                    </div>
                    {promoErr && <p className="mt-1.5 text-[11px] font-semibold text-ember-600">{promoErr}</p>}
                  </>
                )}
              </div>

              <div className="space-y-4 border-t border-espresso-950/10 pt-4">
                <Field label="Card number" error={cardErrors.num}>
                  <input
                    className="field font-mono"
                    inputMode="numeric"
                    value={card.num}
                    onChange={(e) =>
                      setCard((c) => ({ ...c, num: e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ") }))
                    }
                    placeholder="4242 4242 4242 4242"
                  />
                </Field>
                <Field label="Name on card" error={cardErrors.holder}>
                  <input className="field" value={card.holder} onChange={(e) => setCard((c) => ({ ...c, holder: e.target.value }))} placeholder="FRANKIE BEAN" />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Expiry" error={cardErrors.exp}>
                    <input
                      className="field font-mono"
                      inputMode="numeric"
                      value={card.exp}
                      onChange={(e) => {
                        const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setCard((c) => ({ ...c, exp: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d }));
                      }}
                      placeholder="MM/YY"
                    />
                  </Field>
                  <Field label="CVC" error={cardErrors.cvc}>
                    <input
                      className="field font-mono"
                      inputMode="numeric"
                      value={card.cvc}
                      onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                      placeholder="123"
                    />
                  </Field>
                </div>
              </div>

              <p className="flex items-start gap-2 rounded-lg bg-espresso-950 px-3.5 py-2.5 text-[11px] font-semibold text-cream-100/75">
                <IconInfo className="mt-0.5 h-3.5 w-3.5 shrink-0 text-caramel-300" />
                Demo checkout — no real payment is processed and nothing leaves your browser.
              </p>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  onClick={() => setStep("details")}
                  disabled={processing}
                  className="flex items-center gap-2 rounded-full border border-espresso-950/20 px-5 py-3 text-sm font-bold text-espresso-950/70 transition hover:border-espresso-950 hover:text-espresso-950 disabled:opacity-40"
                >
                  <IconArrowLeft className="h-4 w-4" /> Details
                </button>
                <button
                  onClick={pay}
                  disabled={processing}
                  className="flex items-center gap-2.5 rounded-full bg-espresso-950 px-6 py-3 text-sm font-bold text-cream-50 transition hover:bg-caramel-600 active:scale-[0.97] disabled:cursor-wait disabled:opacity-80"
                >
                  {processing ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream-50/30 border-t-cream-50" />
                      Brewing your order…
                    </>
                  ) : (
                    <>Pay {money(total)}</>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === "done" && order && (
            <div className="p-8 text-center">
              <div className="mx-auto grid h-16 w-16 animate-pop place-items-center rounded-full border border-moss-500/40 bg-moss-500/15">
                <IconCheck className="h-8 w-8 text-moss-600" />
              </div>
              <h3 className="mt-5 font-display text-3xl font-semibold tracking-tight">
                Order <span className="text-caramel-600">{order.id}</span> confirmed
              </h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-espresso-950/60">
                Thanks, {order.customer.name.split(" ")[0]} — your beans join Tuesday's roast. A receipt is on its way to{" "}
                <span className="font-semibold text-espresso-950">{order.customer.email}</span>.
              </p>
              <div className="mx-auto mt-5 max-w-xs rounded-lg bg-cream-100 p-4 text-sm">
                <div className="flex justify-between text-espresso-950/60">
                  <span>Items</span>
                  <span className="font-semibold tabular-nums">{order.items.reduce((s, i) => s + i.qty, 0)}</span>
                </div>
                <div className="mt-1 flex justify-between text-espresso-950/60">
                  <span>Estimated delivery</span>
                  <span className="font-semibold">
                    {new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <div className="mt-2 flex justify-between border-t border-espresso-950/10 pt-2 font-display text-lg font-bold">
                  <span>Paid</span>
                  <span className="tabular-nums">{money(order.total)}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="mt-6 rounded-full bg-espresso-950 px-7 py-3 text-sm font-bold text-cream-50 transition hover:bg-caramel-600 active:scale-95"
              >
                Back to the shelf
              </button>
              <p className="mt-3 text-[11px] font-semibold text-espresso-950/40">
                Track it any time in Roastery OS → Orders, status “received”.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
