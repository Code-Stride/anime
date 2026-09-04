"use client";

import { useEffect, useMemo, useState } from "react";
import type { MediaListCard } from "@/lib/anilist";
import {
  animeql,
  BROWSE_QUERY,
  FORMAT_OPTIONS,
  MediaSort,
  SEASONS,
  SORT_OPTIONS,
  STATUS_OPTIONS,
} from "@/lib/anilist";
import { navigate, useRoute } from "@/lib/router";
import { AnimeGrid } from "@/components/AnimeGrid";
import { EmptyState, ErrorBox, SkeletonGrid } from "@/components/Skeleton";
import { FilterIcon, SearchIcon } from "@/components/Icons";
import { formatCount } from "@/lib/format";

type BrowseResult = {
  Page: {
    media: MediaListCard[];
    pageInfo: { total: number | null; currentPage: number | null; hasNextPage: boolean };
  };
};

const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Horror",
  "Mahou Shoujo", "Mecha", "Music", "Mystery", "Psychological", "Romance",
  "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller",
];

const PER_PAGE = 24;

export function BrowseView() {
  const { query } = useRoute();

  const q = query.get("q") || "";
  const genre = query.get("genre") || "";
  const format = query.get("format") || "";
  const season = query.get("season") || "";
  const year = query.get("year") || "";
  const status = query.get("status") || "";
  const sort = query.get("sort") || "TRENDING_DESC";

  const [results, setResults] = useState<BrowseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const page = parseInt(query.get("page") || "1", 10);
  const [searchText, setSearchText] = useState(q);

  useEffect(() => {
    document.title = "Browse anime · AniVault";
  }, []);

  const years = useMemo(() => {
    const now = new Date().getFullYear();
    const arr: number[] = [];
    for (let y = now + 1; y >= 1940; y--) arr.push(y);
    return arr;
  }, []);

  function buildVariables(p: number) {
    const vars: Record<string, unknown> = {
      page: p,
      perPage: PER_PAGE,
      sort: [sort === "DEFAULT" ? "TRENDING_DESC" : (sort as MediaSort)],
    };
    if (q) vars.search = q;
    if (genre) vars.genre = [genre];
    if (format) vars.format = [format];
    if (season) vars.season = season;
    if (year) vars.seasonYear = parseInt(year, 10);
    if (status) vars.status = [status];
    return vars;
  }

  function fetchPage(p: number) {
    setLoading(true);
    setError(null);
    animeql<BrowseResult>(BROWSE_QUERY, buildVariables(p))
      .then((d) => setResults(d))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setSearchText(q);
    fetchPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, genre, format, season, year, status, sort, page]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(query);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    navigate("/browse", Object.fromEntries(next));
  }

  const media = results?.Page.media ?? [];
  const total = results?.Page.pageInfo.total ?? null;
  const hasNext = results?.Page.pageInfo.hasNextPage ?? false;

  return (
    <div className="page">
      <div className="page-head">
        <h1>
          <FilterIcon width={24} height={24} style={{ verticalAlign: "-4px", marginRight: 8 }} />
          Browse anime
        </h1>
        <div className="sub">
          {q ? (
            <>
              Results for <b>“{q}”</b>
              {total != null ? ` · ${formatCount(total)} found` : ""}
            </>
          ) : total != null ? (
            <>
              <b>{formatCount(total)}</b> anime match your filters
            </>
          ) : (
            "Filter by season, genre, format, and more"
          )}
        </div>
      </div>

      <section className="section" style={{ marginTop: 16 }}>
        <div className="searchbar">
          <SearchIcon width={20} height={20} />
          <input
            className="browse-input"
            value={searchText}
            placeholder="Search anime by title…"
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setParam("q", searchText.trim());
            }}
          />
          <button className="search-btn" onClick={() => setParam("q", searchText.trim())}>
            Search
          </button>
          {q && (
            <button className="chip" onClick={() => { setSearchText(""); setParam("q", ""); }} title="Clear query">
              ✕
            </button>
          )}
        </div>

        <div className="filters">
          <div className="filter-group">
            <label className="filter-label">Genre</label>
            <select className="filter-select" value={genre} onChange={(e) => setParam("genre", e.target.value)}>
              <option value="">All genres</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Format</label>
            <select className="filter-select" value={format} onChange={(e) => setParam("format", e.target.value)}>
              <option value="">All formats</option>
              {FORMAT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Season</label>
            <select className="filter-select" value={season} onChange={(e) => setParam("season", e.target.value)}>
              <option value="">Any season</option>
              {SEASONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Year</label>
            <select className="filter-select" value={year} onChange={(e) => setParam("year", e.target.value)}>
              <option value="">Any year</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select className="filter-select" value={status} onChange={(e) => setParam("status", e.target.value)}>
              <option value="">Any status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sort by</label>
            <select className="filter-select" value={sort} onChange={(e) => setParam("sort", e.target.value)}>
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="section" style={{ marginTop: 26 }}>
        {loading ? (
          <SkeletonGrid count={PER_PAGE} />
        ) : error ? (
          <ErrorBox message={error} />
        ) : media.length === 0 ? (
          <EmptyState
            title="No anime found"
            sub="Try removing some filters or search for a different title."
          />
        ) : (
          <AnimeGrid items={media} />
        )}
      </section>

      {!loading && !error && media.length > 0 && (
        <div className="pagination">
          <button
            className="btn btn-ghost"
            disabled={page <= 1}
            onClick={() => setParam("page", String(page - 1))}
          >
            ← Prev
          </button>
          <span className="page-info">Page {page}</span>
          <button
            className="btn btn-ghost"
            disabled={!hasNext}
            onClick={() => setParam("page", String(page + 1))}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
