import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

/* --------------------------------- types --------------------------------- */

export type Category = "single-origin" | "blend" | "decaf";

export interface Product {
  id: string;
  name: string;
  origin: string;
  process: string;
  altitude: string;
  category: Category;
  roast: number; // 1..5
  price: number;
  stock: number;
  weight: string;
  notes: string[];
  description: string;
  image: string; // remote URL; empty string -> rendered as BagArt placeholder
  color: string; // used by BagArt placeholder + accents
  badge?: string;
  active: boolean;
  createdAt: number;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export type OrderStatus = "received" | "roasting" | "shipped" | "delivered";

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export interface Customer {
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  placedAt: number;
}

export type ToastKind = "success" | "info" | "warn";
export interface Toast {
  id: string;
  msg: string;
  kind: ToastKind;
}

interface StoreState {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
}

/* -------------------------------- constants ------------------------------- */

export const FREE_SHIP_THRESHOLD = 40;
export const FLAT_SHIPPING = 5.95;
export const PROMOS: Record<string, number> = { EMBER10: 0.1 };

export const CATEGORY_LABEL: Record<Category, string> = {
  "single-origin": "Single origin",
  blend: "Blend",
  decaf: "Decaf",
};

export const ORDER_STATUSES: OrderStatus[] = ["received", "roasting", "shipped", "delivered"];

export const round2 = (n: number) => Math.round(n * 100) / 100;
export const money = (n: number) => `$${n.toFixed(2)}`;

/* -------------------------------- seed data ------------------------------- */

const img = {
  dawn: "https://image.qwenlm.ai/generated-images/85bf0be1-7f6a-49bc-a6dd-ba3a6bf700a3/_result.png",
  velvet: "https://image.qwenlm.ai/generated-images/1c34933e-02fa-4b60-8ea2-089dd01e4779/_result.png",
  night: "https://image.qwenlm.ai/generated-images/da3616f1-9452-42f2-a6e5-5bdb688c4894/_result.png",
  hearth: "https://image.qwenlm.ai/generated-images/12bf99b8-a8fa-43e7-bb1b-81ecd331376a/_result.png",
  golden: "https://image.qwenlm.ai/generated-images/65353b16-03e9-4bd3-ac84-435778087172/_result.png",
  quiet: "https://image.qwenlm.ai/generated-images/d9a0d6b3-dbbf-4650-b6f4-1f67154d3e36/_result.png",
};

export const HERO_IMAGE =
  "https://image.qwenlm.ai/generated-images/5017e9d8-da3a-4da5-877e-321a73b827a3/_result.png";

const seedProducts: Product[] = [
  {
    id: "p-dawn",
    name: "Dawn Patrol",
    origin: "Yirgacheffe, Ethiopia",
    process: "Washed",
    altitude: "1,950–2,100 m",
    category: "single-origin",
    roast: 2,
    price: 19.5,
    stock: 16,
    weight: "340 g",
    notes: ["Bergamot", "Apricot", "Wild honey"],
    description:
      "A luminous washed lot from the Idido washing station — floral, tea-like and impossibly clean. Our lightest roast, pulled just past first crack to keep every spark of acidity.",
    image: img.dawn,
    color: "#e3d5b8",
    badge: "Roast of the week",
    active: true,
    createdAt: Date.now() - 86400000 * 40,
  },
  {
    id: "p-velvet",
    name: "Velvet Antler",
    origin: "Huila, Colombia",
    process: "Washed",
    altitude: "1,700–1,850 m",
    category: "single-origin",
    roast: 3,
    price: 18.5,
    stock: 24,
    weight: "340 g",
    notes: ["Caramel", "Red plum", "Cocoa nib"],
    description:
      "Grown by the Trujillo family across three generations. Round, syrupy and comforting — the cup we pour for people who say they don't like fancy coffee. They always convert.",
    image: img.velvet,
    color: "#b0603c",
    active: true,
    createdAt: Date.now() - 86400000 * 34,
  },
  {
    id: "p-night",
    name: "Night Shift",
    origin: "Mandheling, Sumatra",
    process: "Wet-hulled",
    altitude: "1,400–1,600 m",
    category: "single-origin",
    roast: 5,
    price: 18,
    stock: 5,
    weight: "340 g",
    notes: ["Dark chocolate", "Cedar", "Molasses"],
    description:
      "Our darkest drum, and proudly so. Wet-hulled Sumatra pushed to the edge of second crack — heavy, smoky-sweet, and built to stand up to milk, rain, and long nights.",
    image: img.night,
    color: "#3a2a22",
    active: true,
    createdAt: Date.now() - 86400000 * 28,
  },
  {
    id: "p-hearth",
    name: "Hearth Blend",
    origin: "Brazil + Guatemala",
    process: "Natural & washed",
    altitude: "1,100–1,600 m",
    category: "blend",
    roast: 4,
    price: 17,
    stock: 32,
    weight: "340 g",
    notes: ["Brown sugar", "Hazelnut", "Orange zest"],
    description:
      "The house espresso and the bag most people keep on repeat. A natural Brazil base for sweetness, washed Guatemala for structure. Dial it in once and it stays dialed.",
    image: img.hearth,
    color: "#c4813f",
    badge: "Espresso pick",
    active: true,
    createdAt: Date.now() - 86400000 * 21,
  },
  {
    id: "p-golden",
    name: "Golden Hour",
    origin: "Tarrazú, Costa Rica",
    process: "Honey",
    altitude: "1,600–1,900 m",
    category: "single-origin",
    roast: 3,
    price: 20.5,
    stock: 4,
    weight: "250 g",
    notes: ["Toffee", "White peach", "Jasmine"],
    description:
      "A red-honey micro-lot from Don Mayo, dried slow on raised beds. Toffee sweetness with a peach-juice finish — the coffee our roaster drinks on her day off.",
    image: img.golden,
    color: "#d9a441",
    active: true,
    createdAt: Date.now() - 86400000 * 14,
  },
  {
    id: "p-quiet",
    name: "Quiet Hours",
    origin: "Cauca, Colombia",
    process: "Sugarcane EA decaf",
    altitude: "1,750 m",
    category: "decaf",
    roast: 3,
    price: 17.5,
    stock: 12,
    weight: "340 g",
    notes: ["Milk chocolate", "Almond", "Date"],
    description:
      "Decaf that nobody clocks as decaf. Sugarcane process keeps the sugars intact, so it brews caramel-sweet at 4 pm and still lets you sleep at 11. Evening ritual, solved.",
    image: img.quiet,
    color: "#8a9270",
    active: true,
    createdAt: Date.now() - 86400000 * 7,
  },
];

function dayOffset(days: number, hour: number): number {
  const d = new Date(Date.now() - days * 86400000);
  d.setHours(hour, Math.floor(Math.random() * 50) + 5, 0, 0);
  return d.getTime();
}

function mkOrder(
  id: string,
  placedAt: number,
  customer: Customer,
  items: [string, number][],
  status: OrderStatus,
  discountRate = 0
): Order {
  const orderItems: OrderItem[] = items.map(([pid, qty]) => {
    const p = seedProducts.find((x) => x.id === pid)!;
    return { productId: pid, name: p.name, qty, price: p.price };
  });
  const subtotal = round2(orderItems.reduce((s, it) => s + it.price * it.qty, 0));
  const discount = round2(subtotal * discountRate);
  const shipping = subtotal - discount >= FREE_SHIP_THRESHOLD ? 0 : FLAT_SHIPPING;
  return {
    id,
    customer,
    items: orderItems,
    subtotal,
    discount,
    shipping,
    total: round2(subtotal - discount + shipping),
    status,
    placedAt,
  };
}

function seedOrders(): Order[] {
  return [
    mkOrder("EO-1041", dayOffset(13, 9), { name: "Maya Chen", email: "maya@fastmail.com", address: "88 Alder St", city: "Portland, OR", zip: "97204" }, [["p-hearth", 2], ["p-night", 1]], "delivered"),
    mkOrder("EO-1042", dayOffset(12, 14), { name: "Jonas Berg", email: "jonas.berg@posteo.de", address: "402 Hawthorne Blvd", city: "Portland, OR", zip: "97214" }, [["p-dawn", 1]], "delivered"),
    mkOrder("EO-1043", dayOffset(10, 11), { name: "Priya Nair", email: "priya.n@gmail.com", address: "17 Cypress Ave", city: "Oakland, CA", zip: "94607" }, [["p-velvet", 2], ["p-quiet", 1]], "delivered"),
    mkOrder("EO-1044", dayOffset(8, 16), { name: "Sam Okafor", email: "sam.o@proton.me", address: "230 Pine St", city: "Seattle, WA", zip: "98101" }, [["p-hearth", 1], ["p-golden", 1]], "delivered"),
    mkOrder("EO-1045", dayOffset(6, 10), { name: "Elena Vasquez", email: "elena.vz@outlook.com", address: "55 Mission Rd", city: "San Francisco, CA", zip: "94103" }, [["p-dawn", 2]], "shipped"),
    mkOrder("EO-1046", dayOffset(5, 13), { name: "Theo Lindqvist", email: "theo@lindqvist.se", address: "9 Belmont Ct", city: "Chicago, IL", zip: "60614" }, [["p-night", 2], ["p-hearth", 1]], "shipped"),
    mkOrder("EO-1047", dayOffset(3, 9), { name: "Ruth Adler", email: "ruth.adler@hey.com", address: "311 Juniper Way", city: "Boise, ID", zip: "83702" }, [["p-velvet", 1], ["p-dawn", 1], ["p-quiet", 2]], "roasting", 0.1),
    mkOrder("EO-1048", dayOffset(2, 15), { name: "Ken Watanabe", email: "ken.w@icloud.com", address: "77 Vine St", city: "Denver, CO", zip: "80202" }, [["p-golden", 1]], "roasting"),
    mkOrder("EO-1049", dayOffset(1, 8), { name: "Amara Diallo", email: "amara.d@gmail.com", address: "1200 Clay St", city: "Portland, OR", zip: "97209" }, [["p-hearth", 3]], "received"),
    mkOrder("EO-1050", dayOffset(0, 9), { name: "Oliver Hayes", email: "ollie.hayes@pm.me", address: "16 Ankeny Aly", city: "Portland, OR", zip: "97214" }, [["p-dawn", 1], ["p-velvet", 1]], "received"),
  ];
}

/* ------------------------------- persistence ------------------------------ */

const LS_KEY = "ember-oak-v1";

function seedState(): StoreState {
  return { products: seedProducts, cart: [], orders: seedOrders() };
}

function loadState(): StoreState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw) as StoreState;
    if (!Array.isArray(parsed.products) || !Array.isArray(parsed.orders) || !Array.isArray(parsed.cart)) {
      return seedState();
    }
    return parsed;
  } catch {
    return seedState();
  }
}

/* --------------------------------- context -------------------------------- */

interface StoreCtx {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  toasts: Toast[];
  cartCount: number;
  cartSubtotal: number;
  cartLines: { product: Product; qty: number }[];
  toast: (msg: string, kind?: ToastKind) => void;
  addToCart: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (customer: Customer, promoRate: number) => Order;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  addProduct: (input: Omit<Product, "id" | "createdAt">) => Product;
  deleteProduct: (id: string) => void;
  toggleProduct: (id: string) => void;
  restock: (id: string, amount: number) => void;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  resetDemo: () => void;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(loadState);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable — demo continues in memory */
    }
  }, [state]);

  const toast = useCallback((msg: string, kind: ToastKind = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((t) => [...t.slice(-3), { id, msg, kind }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const cartLines = useMemo(
    () =>
      state.cart
        .map((c) => {
          const product = state.products.find((p) => p.id === c.productId);
          return product ? { product, qty: c.qty } : null;
        })
        .filter((x): x is { product: Product; qty: number } => x !== null),
    [state.cart, state.products]
  );

  const cartCount = useMemo(() => state.cart.reduce((s, c) => s + c.qty, 0), [state.cart]);
  const cartSubtotal = useMemo(
    () => round2(cartLines.reduce((s, l) => s + l.product.price * l.qty, 0)),
    [cartLines]
  );

  const addToCart = useCallback((productId: string, qty = 1) => {
    setState((s) => {
      const product = s.products.find((p) => p.id === productId);
      if (!product || product.stock <= 0) return s;
      const existing = s.cart.find((c) => c.productId === productId);
      const nextQty = Math.min(product.stock, (existing?.qty ?? 0) + qty);
      const cart = existing
        ? s.cart.map((c) => (c.productId === productId ? { ...c, qty: nextQty } : c))
        : [...s.cart, { productId, qty: nextQty }];
      return { ...s, cart };
    });
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setState((s) => {
      const product = s.products.find((p) => p.id === productId);
      const clamped = product ? Math.min(qty, product.stock) : qty;
      if (clamped <= 0) return { ...s, cart: s.cart.filter((c) => c.productId !== productId) };
      return { ...s, cart: s.cart.map((c) => (c.productId === productId ? { ...c, qty: clamped } : c)) };
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setState((s) => ({ ...s, cart: s.cart.filter((c) => c.productId !== productId) }));
  }, []);

  const clearCart = useCallback(() => setState((s) => ({ ...s, cart: [] })), []);

  const placeOrder = useCallback(
    (customer: Customer, promoRate: number): Order => {
      const items: OrderItem[] = cartLines.map((l) => ({
        productId: l.product.id,
        name: l.product.name,
        qty: l.qty,
        price: l.product.price,
      }));
      const subtotal = round2(items.reduce((s, it) => s + it.price * it.qty, 0));
      const discount = round2(subtotal * promoRate);
      const shipping = subtotal - discount >= FREE_SHIP_THRESHOLD || items.length === 0 ? 0 : FLAT_SHIPPING;
      const order: Order = {
        id: `EO-${Math.floor(1000 + Math.random() * 9000)}`,
        customer,
        items,
        subtotal,
        discount,
        shipping,
        total: round2(subtotal - discount + shipping),
        status: "received",
        placedAt: Date.now(),
      };
      setState((s) => ({
        ...s,
        orders: [order, ...s.orders],
        cart: [],
        products: s.products.map((p) => {
          const line = items.find((i) => i.productId === p.id);
          return line ? { ...p, stock: Math.max(0, p.stock - line.qty) } : p;
        }),
      }));
      return order;
    },
    [cartLines]
  );

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    setState((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }, []);

  const addProduct = useCallback((input: Omit<Product, "id" | "createdAt">): Product => {
    const product: Product = { ...input, id: `p-${Date.now()}`, createdAt: Date.now() };
    setState((s) => ({ ...s, products: [product, ...s.products] }));
    return product;
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      products: s.products.filter((p) => p.id !== id),
      cart: s.cart.filter((c) => c.productId !== id),
    }));
  }, []);

  const toggleProduct = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
    }));
  }, []);

  const restock = useCallback((id: string, amount: number) => {
    setState((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === id ? { ...p, stock: p.stock + amount } : p)),
    }));
  }, []);

  const setOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    }));
  }, []);

  const resetDemo = useCallback(() => {
    setState(seedState());
  }, []);

  const value: StoreCtx = {
    products: state.products,
    cart: state.cart,
    orders: state.orders,
    toasts,
    cartCount,
    cartSubtotal,
    cartLines,
    toast,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    placeOrder,
    updateProduct,
    addProduct,
    deleteProduct,
    toggleProduct,
    restock,
    setOrderStatus,
    resetDemo,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
