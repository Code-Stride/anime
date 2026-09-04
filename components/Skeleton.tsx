"use client";

import { LogoIcon } from "./Icons";

export function SkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="sk-card">
          <div className="skeleton cover" />
          <div className="card-info" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="skeleton line" />
            <div className="skeleton line short" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Loader({ label = "Loading catalog…" }: { label?: string }) {
  return (
    <div className="loader">
      <div className="spinner" />
      <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

export function BannerLoader({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-banner">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton" style={{ aspectRatio: "16/9" }} />
      ))}
    </div>
  );
}

export function EmptyState({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="empty">
      <div
        style={{
          width: 64,
          height: 64,
          margin: "0 auto 16px",
          borderRadius: 18,
          display: "grid",
          placeItems: "center",
          background: "var(--bg-3)",
          border: "1px solid var(--border)",
          color: "var(--text-faint)",
        }}
      >
        <LogoIcon width={30} height={30} />
      </div>
      <h3>{title}</h3>
      <p>{sub}</p>
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="error-box">
      <strong>Couldn’t load data.</strong> {message}
    </div>
  );
}
