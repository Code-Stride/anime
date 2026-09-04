"use client";

import { useEffect, useState } from "react";
import type { MediaListCard } from "@/lib/anilist";
import { animeql, HOME_QUERY } from "@/lib/anilist";
import { hashHref, navigate } from "@/lib/router";
import { BannerCard } from "@/components/BannerCard";
import { AnimeGrid } from "@/components/AnimeGrid";
import { BannerLoader, ErrorBox, SkeletonGrid } from "@/components/Skeleton";
import { CompassIcon, SearchIcon, TrendingIcon } from "@/components/Icons";

type HomeData = {
  trending: { media: MediaListCard[] };
  popular: { media: MediaListCard[] };
};

export function HomeView() {
  const [data, setData] = useState<HomeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = "AniVault — Explore the Anime Universe";
  }, []);

  useEffect(() => {
    let alive = true;
    animeql<HomeData>(HOME_QUERY, { trendingPage: 1, popularPage: 1 })
      .then((d) => {
        if (alive) setData(d);
      })
      .catch((e: Error) => {
        if (alive) setError(e.message);
      });
    return () => {
      alive = false;
    };
  }, []);

  const trending = data?.trending.media ?? [];
  const popular = data?.popular.media ?? [];

  function goSearch() {
    const q = query.trim();
    if (q) navigate("/browse", { q });
  }

  return (
    <div className="page">
      <section className="hero">
        <h1>
          Explore the anime <span className="grad">universe</span>
        </h1>
        <p>
          A clean, open catalog of the anime you love — search, discover, and
          sort by genre, season, format, and rating. Powered by the AniList
          API.
        </p>
        <div className="hero-badges">
          <span className="badge">
            <span className="dot" /> Live AniList data
          </span>
          <span className="badge">No sign-up</span>
          <span className="badge">Thousands of titles</span>
        </div>
      </section>

      <section className="section" style={{ marginTop: 0 }}>
        <div className="searchbar">
          <SearchIcon width={20} height={20} />
          <input
            id="home-search"
            placeholder="Search anime… (e.g. Frieren, One Piece, Attack on Titan)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") goSearch();
            }}
          />
          <button className="search-btn" onClick={goSearch}>
            Search
          </button>
        </div>
        <div className="chip-row">
          <a className="chip" href={hashHref("/trending")}>
            <TrendingIcon width={15} height={15} style={{ verticalAlign: "text-bottom", marginRight: 4 }} />
            Trending now
          </a>
          <a className="chip" href={hashHref("/browse")}>
            <CompassIcon width={15} height={15} style={{ verticalAlign: "text-bottom", marginRight: 4 }} />
            Browse all
          </a>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>🔥 Trending this week</h2>
            <div className="sub">What everyone is watching right now</div>
          </div>
          <a className="link-more" href={hashHref("/trending")}>
            View all →
          </a>
        </div>
        {error ? (
          <ErrorBox message={error} />
        ) : trending.length === 0 ? (
          <BannerLoader />
        ) : (
          <div className="grid grid-banner">
            {trending.map((a) => (
              <BannerCard key={a.id} anime={a} />
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>⭐ Top rated</h2>
            <div className="sub">The highest-scored anime on AniList</div>
          </div>
          <a className="link-more" href={hashHref("/browse", { sort: "SCORE_DESC" })}>
            View all →
          </a>
        </div>
        {error ? null : popular.length === 0 ? (
          <SkeletonGrid />
        ) : (
          <AnimeGrid items={popular} />
        )}
      </section>

      <footer className="footer" style={{ marginTop: 60 }}>
        <div className="footer-inner">
          <div>
            <div className="brand">
              <span className="brand-icon">
                <CompassIcon width={18} height={18} />
              </span>
              Ani<span className="accent">Vault</span>
            </div>
            <p className="footer-blurb">
              AniVault is a demonstration catalog app. All metadata (titles,
              scores, synopses, cover art, genres) is provided by the public
              AniList API. AniVault does not host or stream any video content.
            </p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h4>Explore</h4>
              <a href={hashHref("/browse")}>All anime</a>
              <a href={hashHref("/trending")}>Trending</a>
              <a href={hashHref("/genre/Action")}>Genres</a>
            </div>
            <div className="footer-col">
              <h4>Data</h4>
              <a href="https://anilist.co" target="_blank" rel="noreferrer">
                AniList
              </a>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} AniVault</span>
            <span>Built for discovery · Data © AniList</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
