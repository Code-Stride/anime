"use client";

import { useEffect, useState } from "react";
import type { MediaListCard } from "@/lib/anilist";
import { animeql, TRENDING_QUERY } from "@/lib/anilist";
import { BannerCard } from "@/components/BannerCard";
import { BannerLoader, ErrorBox } from "@/components/Skeleton";
import { TrendingIcon } from "@/components/Icons";

type TrendingData = {
  Page: { media: MediaListCard[]; pageInfo: { hasNextPage: boolean } };
};

export function TrendingView() {
  const [items, setItems] = useState<MediaListCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Trending anime · AniVault";
  }, []);

  useEffect(() => {
    let alive = true;
    animeql<TrendingData>(TRENDING_QUERY, { page: 1, perPage: 24 })
      .then((d) => {
        if (alive) setItems(d.Page.media);
      })
      .catch((e: Error) => {
        if (alive) setError(e.message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="page">
      <div className="page-head">
        <h1>
          <TrendingIcon width={26} height={26} style={{ verticalAlign: "-4px", marginRight: 8 }} />
          Trending anime
        </h1>
        <div className="sub">The most-watched anime on AniList right now</div>
      </div>

      <section className="section" style={{ marginTop: 18 }}>
        {loading ? (
          <BannerLoader count={12} />
        ) : error ? (
          <ErrorBox message={error} />
        ) : items.length === 0 ? (
          <p className="empty">No trending anime available.</p>
        ) : (
          <div className="grid grid-banner">
            {items.map((a) => (
              <BannerCard key={a.id} anime={a} />
            ))}
          </div>
        )}
      </section>

      <footer className="footer" style={{ marginTop: 60 }}>
        <div className="footer-inner">
          <div>
            <div className="brand">
              <span className="brand-icon">
                <TrendingIcon width={18} height={18} />
              </span>
              Ani<span className="accent">Vault</span>
            </div>
            <p className="footer-blurb">
              AniVault shows catalog metadata only, sourced from the public
              AniList API. It does not host or stream video.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
