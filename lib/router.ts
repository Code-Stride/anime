"use client";

import { useEffect, useState } from "react";

export type Route = { path: string; query: URLSearchParams };

/**
 * Parse the current URL hash into a path + query.
 * Example: `#/browse?genre=Action` => { path: "/browse", query: {genre: "Action"} }
 */
export function parseHash(): Route {
  const raw = typeof window !== "undefined" ? window.location.hash : "";
  const clean = raw.replace(/^#/, "");
  const qIndex = clean.indexOf("?");
  let path = clean;
  let query = new URLSearchParams();
  if (qIndex >= 0) {
    path = clean.slice(0, qIndex);
    query = new URLSearchParams(clean.slice(qIndex + 1));
  }
  // Normalize
  if (!path || path === "/") path = "/";
  if (!path.startsWith("/")) path = "/" + path;
  // strip trailing slash
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return { path, query };
}

export function hashHref(path: string, query?: Record<string, string>): string {
  let p = path.startsWith("/") ? path : "/" + path;
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  let out = "#" + (p === "/" ? "/" : p);
  if (query) {
    const qs = new URLSearchParams(query).toString();
    if (qs) out += "?" + qs;
  }
  return out;
}

/** Programmatic navigation that preserves SPA behavior and scrolls to top. */
export function navigate(path: string, query?: Record<string, string>) {
  const href = hashHref(path, query);
  if (window.location.hash === href) {
    window.scrollTo({ top: 0 });
    return;
  }
  window.location.hash = href;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash());

  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}

export function useHashPath(): string {
  return useRoute().path;
}
