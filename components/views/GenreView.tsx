"use client";

import { useEffect, useState } from "react";
import type { MediaListCard } from "@/lib/anilist";
import { animeql, BROWSE_QUERY } from "@/lib/anilist";
import { hashHref } from "@/lib/router";
import { AnimeGrid } from "@/components/AnimeGrid";
import { EmptyState, ErrorBox, SkeletonGrid } from "@/components/Skeleton";
import { FilterIcon } from "@/components/Icons";

type GenreData = {
  Page: { media: MediaListCard[]; pageInfo: { total: number | null } };
};

const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Horror",
  "Mahou Shoujo", "Mecha", "Music", "Mystery", "Psychological", "Romance",
  "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller",
];

export function GenreView({ genre }: { genre: string }) {
  const label = GENRES.find((g) => g.toLowerCase() === genre?.toLowerCase()) || genre;

  const [items, setItems] = useState<MediaListCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    document.title = `${label} anime · AniVault`;
  }, [label]);

  useEffect(() => {
    if (!genre) return;
    let alive = true;
    setLoading(true);
    setError(null);
    animeql<GenreData>(BROWSE_QUERY, {
      page: 1,
      perPage: 30,
      genre: [genre],
      sort: ["POPULARITY_DESC"],
    })
      .then((d) => {
        if (alive) {
          setItems(d.Page.media);
          setTotal(d.Page.pageInfo.total);
        }
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
  }, [genre]);

  return (
    <div className="page">
      <div className="page-head">
        <h1>
          <FilterIcon width={24} height={24} style={{ verticalAlign: "-4px", marginRight: 8 }} />
          {label} anime
        </h1>
        <div className="sub">
          {total != null ? <b>{total}</b> : "Popular"} titles in the {label} genre
        </div>
      </div>

      <div className="chip-row">
        {GENRES.map((g) => (
          <a
            key={g}
            className={`chip${g.toLowerCase() === genre?.toLowerCase() ? " on" : ""}`}
            href={hashHref(`/genre/${encodeURIComponent(g)}`)}
          >
            {g}
          </a>
        ))}
      </div>

      <section className="section" style={{ marginTop: 26 }}>
        {loading ? (
          <SkeletonGrid count={24} />
        ) : error ? (
          <ErrorBox message={error} />
        ) : items.length === 0 ? (
          <EmptyState title="Nothing here yet" sub="Try another genre." />
        ) : (
          <AnimeGrid items={items} />
        )}
      </section>
    </div>
  );
}
