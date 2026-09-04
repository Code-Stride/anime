"use client";

import { hashHref, useRoute } from "@/lib/router";
import { LogoIcon } from "./Icons";

const links = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/trending", label: "Trending" },
  { href: "/genre/Action", label: "Genres" },
];

export function Nav() {
  const { path } = useRoute();

  return (
    <header className="nav">
      <div className="nav-inner">
        <a href={hashHref("/")} className="brand">
          <span className="brand-icon">
            <LogoIcon />
          </span>
          Ani<span className="accent">Vault</span>
        </a>

        <nav className="nav-links">
          {links.map((l) => {
            const active =
              l.href === "/"
                ? path === "/"
                : l.href.startsWith("/genre/")
                ? path.startsWith("/genre/")
                : path === l.href;
            return (
              <a
                key={l.href}
                href={hashHref(l.href)}
                className={`nav-link${active ? " on" : ""}`}
                style={active ? { color: "var(--text)", background: "var(--bg-3)" } : undefined}
              >
                {l.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
