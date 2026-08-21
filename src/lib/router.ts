import { useCallback, useEffect, useState } from "react";

function currentRoute(): string {
  const h = window.location.hash.replace(/^#/, "");
  if (h.startsWith("/admin")) return "/admin";
  return "/";
}

/** Tiny hash router: "/" = storefront, "/admin" = roastery dashboard. */
export function useHashRoute(): [string, (to: string) => void] {
  const [route, setRoute] = useState<string>(() => currentRoute());

  useEffect(() => {
    const onHash = () => setRoute(currentRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback((to: string) => {
    const target = to === "/" ? "#/" : `#${to}`;
    if (window.location.hash === target) return;
    window.location.hash = target;
  }, []);

  return [route, navigate];
}
