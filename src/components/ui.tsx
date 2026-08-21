import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/* ---------------------------------- icons --------------------------------- */

export interface IconProps {
  className?: string;
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconBean({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <ellipse cx="12" cy="12" rx="6.4" ry="8.6" transform="rotate(32 12 12)" />
      <path d="M9.2 5.6c2.4 2.7 1.1 4.7 2.7 6.7s3.8 2.4 2.9 6.1" />
    </svg>
  );
}

export function IconBeanSolid({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <ellipse cx="12" cy="12" rx="6.6" ry="8.8" transform="rotate(32 12 12)" fill="currentColor" />
      <path
        d="M9.2 5.6c2.4 2.7 1.1 4.7 2.7 6.7s3.8 2.4 2.9 6.1"
        fill="none"
        stroke="rgba(0,0,0,0.32)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconFlame({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M12 3c3 3.2 5 6 5 9a5 5 0 0 1-10 0c0-1.8.8-3.4 2-5 .3 1.2 1 2.1 2 2.5C10.5 7.5 11 5 12 3Z" />
      <path d="M12 17.5a2.5 2.5 0 0 0 2.5-2.5c0-1.2-.9-2.2-2.5-3.7-1.6 1.5-2.5 2.5-2.5 3.7a2.5 2.5 0 0 0 2.5 2.5Z" />
    </svg>
  );
}

export function IconSearch({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-3.8-3.8" />
    </svg>
  );
}

export function IconBag({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M5.5 8.5h13l-.9 10.6a2 2 0 0 1-2 1.9H8.4a2 2 0 0 1-2-1.9L5.5 8.5Z" />
      <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
    </svg>
  );
}

export function IconPlus({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M12 5.5v13M5.5 12h13" />
    </svg>
  );
}

export function IconMinus({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M5.5 12h13" />
    </svg>
  );
}

export function IconX({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconTrash({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M4.5 6.5h15M9.5 6V4.8A1.3 1.3 0 0 1 10.8 3.5h2.4a1.3 1.3 0 0 1 1.3 1.3V6.5M6.5 6.5l.8 12.2a1.8 1.8 0 0 0 1.8 1.8h5.8a1.8 1.8 0 0 0 1.8-1.8l.8-12.2" />
      <path d="M10 10.5v6M14 10.5v6" />
    </svg>
  );
}

export function IconArrowRight({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </svg>
  );
}

export function IconArrowLeft({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M19.5 12h-15M10.5 6l-6 6 6 6" />
    </svg>
  );
}

export function IconCheck({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M4.5 12.5l5 5L19.5 7" />
    </svg>
  );
}

export function IconPencil({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M4 20l4.5-1L20 7.5a2.12 2.12 0 0 0-3-3L5.5 16 4 20Z" />
      <path d="M14.5 6.5l3 3" />
    </svg>
  );
}

export function IconLeaf({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M19.5 4.5c-9.5.5-14.5 5.5-14.5 14 7 .5 13.5-4 14.5-14Z" />
      <path d="M5.5 19.5c3-5.5 7-9 11-11" />
    </svg>
  );
}

export function IconTimer({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <circle cx="12" cy="13.5" r="7" />
      <path d="M12 10v3.5l2.5 2M9.5 3.5h5M12 3.5v3" />
    </svg>
  );
}

export function IconTruck({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M3 7.5h11v9H3zM14 10.5h3.6l3 3.2v2.8h-2.4" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="16.6" cy="17.5" r="1.8" />
      <path d="M8.8 17.5h5.9M3 16.5v1" />
    </svg>
  );
}

export function IconChevronDown({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M6 9.5l6 6 6-6" />
    </svg>
  );
}

export function IconStar({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z"
      />
    </svg>
  );
}

export function IconCopy({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <rect x="8.5" y="8.5" width="12" height="12" rx="2" />
      <path d="M15.5 5.5v-1a2 2 0 0 0-2-2h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h1" transform="translate(1 1)" />
    </svg>
  );
}

export function IconCup({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M5 9.5h11v5.5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9.5Z" />
      <path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16M8.5 6c-.7-1 .7-1.7 0-2.7M12.5 6c-.7-1 .7-1.7 0-2.7" />
    </svg>
  );
}

export function IconBox({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M12 3l8 4v10l-8 4-8-4V7l8-4Z" />
      <path d="M4 7l8 4 8-4M12 11v10" />
    </svg>
  );
}

export function IconGrid({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function IconReceipt({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M6 3.5h12V20.5l-2.4-1.5-2.4 1.5-2.4-1.5-2.4 1.5-2.4-1.5V3.5Z" />
      <path d="M9 8h6M9 11.5h6M9 15h3.5" />
    </svg>
  );
}

export function IconMail({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4.5 7.5l7.5 5.5 7.5-5.5" />
    </svg>
  );
}

export function IconPin({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <path d="M12 21s-6.5-5.5-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.5 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.3" />
    </svg>
  );
}

export function IconInfo({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 7.8v.2" />
    </svg>
  );
}

/* ------------------------------ scroll reveal ----------------------------- */

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${inView ? "in" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------- roast meter ------------------------------ */

const ROAST_LABELS = ["", "Light", "Light +", "Medium", "Medium +", "Dark"];

export function RoastMeter({
  level,
  dark = false,
  className = "",
}: {
  level: number;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`} title={`Roast: ${ROAST_LABELS[level] ?? ""}`}>
      <span className="flex gap-[3px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <IconBeanSolid
            key={i}
            className={`h-3 w-3 ${
              i <= level
                ? dark
                  ? "text-caramel-300"
                  : "text-espresso-800"
                : dark
                  ? "text-cream-50/20"
                  : "text-espresso-950/15"
            }`}
          />
        ))}
      </span>
      <span className={`text-[10px] font-bold uppercase tracking-[0.12em] ${dark ? "text-cream-50/50" : "text-espresso-950/50"}`}>
        {ROAST_LABELS[level] ?? ""}
      </span>
    </div>
  );
}

/* --------------------------- placeholder bag art -------------------------- */

export function BagArt({ color, className = "" }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <ellipse cx="60" cy="107" rx="30" ry="5" fill="rgba(0,0,0,0.25)" />
      <path d="M34 34h52l5 69a6 6 0 0 1-6 6.6H35a6 6 0 0 1-6-6.6l5-69Z" fill={color} />
      <rect x="32" y="24" width="56" height="14" rx="5" fill={color} />
      <rect x="32" y="24" width="56" height="14" rx="5" fill="rgba(0,0,0,0.24)" />
      <line x1="39" y1="44" x2="35.5" y2="100" stroke="rgba(0,0,0,0.14)" strokeWidth="2" />
      <line x1="81" y1="44" x2="84.5" y2="100" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
      <circle cx="60" cy="74" r="17" fill="#f4ead8" />
      <g transform="rotate(28 60 74)">
        <ellipse cx="60" cy="74" rx="7.5" ry="10" fill={color} />
        <path
          d="M55.8 66.5c3.4 3 1.6 6 4.3 8.2s4.6 3.4 3.4 7.6"
          stroke="#f4ead8"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/* ------------------------------ body scroll lock --------------------------- */

export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

export function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, onEscape]);
}
