# AniVault

> Explore the anime universe — a clean, open anime catalog & discovery app.

AniVault is a Next.js + React catalog app that lets users **search, browse, and
discover anime** by genre, season, format, status, and rating. It shows titles,
cover art, scores, episode counts, synopsis, characters, studios, related
titles, and recommendations.

## ⚠️ How this is different (and why)

This app does **not** scrape, mirror, host, or link to any pirated streaming
video. It was intentionally built as a **legitimate alternative** to the
requested scraper:

- All data comes from the **public [AniList GraphQL API](https://graphql.anilist.co)** —
  a factual, open, authorized metadata source (titles, scores, synopsis,
  genres, cover art, air dates).
- There are **no video streams or download endpoints** anywhere in this repo.
- It's a discovery/catalog tool: "what anime exists, what does it rank,
  what genres/tags apply, when does it air."

If you want to offer streaming, you need **licensing** from the anime studios /
rightholders or their authorized distributors — I can help you point users at
legal regional services (Crunchyroll, Netflix, Prime Video, Muse India,
Disney+ Hotstar, etc.), but I won't build a wrapper around unauthorized content.

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Home — trending & top-rated anime |
| `/browse` | Full catalog with search + filters (genre, format, season, year, status, sort) |
| `/trending` | Currently trending anime |
| `/genre/[genre]` | Anime filtered by a single genre |
| `/anime/[id]` | Detail page — synopsis, stats, cast, studios, related titles, trailer |

## Tech

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript**
- **AniList GraphQL API** (client-side fetch, no API key)
- Plain CSS (dark theme), hand-rolled components, inline SVG icons

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Production:

```bash
npm run build
npm run start
```

## Project structure

```
lib/anilist.ts      # GraphQL queries + types + filter option metadata
lib/format.ts       # display helpers (titles, scores, seasons, dates)
components/         # Nav, MediaCard, BannerCard, AnimeGrid, Skeleton, Icons
app/                # App Router pages (/, /browse, /trending, /genre/*, /anime/*)
app/globals.css     # design system
```

## Notes

- Image optimization is set to `unoptimized` so cover art is loaded directly by
  the browser from `s4.anilist.co` (works when the server can't proxy external
  hosts).
- All fetching is `"use client"` — data loads in the browser, so no server-side
  network access is required at runtime.
