import { useEffect, useState } from "react";
import { StoreProvider, useStore } from "./lib/store";
import { useHashRoute } from "./lib/router";
import { Footer, Header } from "./components/chrome";
import { ShopPage } from "./components/Shop";
import { ProductModal } from "./components/ProductModal";
import { CartDrawer, CheckoutModal } from "./components/CartCheckout";
import { Admin } from "./pages/Admin";
import { IconCheck, IconInfo } from "./components/ui";

function ToastViewport() {
  const { toasts } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[70] flex w-full max-w-md -translate-x-1/2 flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`flex animate-rise items-center gap-2.5 rounded-full border py-2.5 pr-5 pl-3.5 text-sm font-semibold shadow-2xl backdrop-blur ${
            t.kind === "warn"
              ? "border-ember-500/40 bg-espresso-900/95 text-cream-50"
              : "border-cream-50/10 bg-espresso-900/95 text-cream-50"
          }`}
        >
          <span
            className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${
              t.kind === "success" ? "bg-moss-500/25 text-moss-300" : t.kind === "warn" ? "bg-ember-500/25 text-ember-500" : "bg-caramel-400/20 text-caramel-300"
            }`}
          >
            {t.kind === "success" ? <IconCheck className="h-3.5 w-3.5" /> : <IconInfo className="h-3.5 w-3.5" />}
          </span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

function AppInner() {
  const [route, navigate] = useHashRoute();
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const { products } = useStore();

  const openProduct = openId ? (products.find((p) => p.id === openId) ?? null) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  const isAdmin = route === "/admin";

  return (
    <div className="min-h-screen bg-cream-100 font-body text-espresso-950">
      <div className="noise" aria-hidden="true" />

      {!isAdmin && <Header route={route} navigate={navigate} onCart={() => setCartOpen(true)} />}

      {isAdmin ? <Admin navigate={navigate} /> : <ShopPage onOpenProduct={setOpenId} />}

      {!isAdmin && <Footer navigate={navigate} />}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />
      {openProduct && <ProductModal product={openProduct} onClose={() => setOpenId(null)} />}
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />

      <ToastViewport />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  );
}
