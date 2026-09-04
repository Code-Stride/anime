"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoIcon } from "./Icons";

const links = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/trending", label: "Trending" },
  { href: "/genre/Action", label: "Genres" },
];

export function Nav() {
  const path = usePathname();

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          <span className="brand-icon">
            <LogoIcon />
          </span>
          Ani<span className="accent">Vault</span>
        </Link>

        <nav className="nav-links">
          {links.map((l) => {
            const active =
              l.href === "/"
                ? path === "/"
                : path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link${active ? " on" : ""}`}
                style={active ? { color: "var(--text)", background: "var(--bg-3)" } : undefined}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
