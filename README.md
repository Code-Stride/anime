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

## Pages (hash-routed SPA)

Because the app is a fully client-side Next.js static export (built for
GitHub Pages), routing is driven by the URL hash — so there are **no server
routes** and it works on a static host with zero configuration.

| View | URL (hash) | Purpose |
|------|------------|---------|
| Home | `#/` | Trending & top-rated anime |
| Browse | `#/browse` | Full catalog with search + filters (genre, format, season, year, status, sort) |
| Trending | `#/trending` | Currently trending anime |
| Genre | `#/genre/Action` | Anime filtered by a single genre |
| Detail | `#/anime/113415` | Synopsis, stats, cast, studios, related titles, trailer |

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

## Deploy to GitHub Pages

This is a **static export** (`output: 'export'` in `next.config.mjs`), so it
deploys straight to GitHub Pages — no server needed. A workflow is included at
`.github/workflows/deploy-pages.yml`.

1. Push to **`main`** (or run the "Deploy to GitHub Pages" workflow manually
   from the Actions tab).
2. In **Settings → Pages**, set the source to **GitHub Actions** (the workflow
   auto-enables it with `enablement: true`).
3. Done — the site is served at `https://<user>.github.io/<repo>/`.

The workflow computes `NEXT_PUBLIC_BASE_PATH` from the repo name so asset paths
are correct for project pages (`/repo/`). For a user/org site
(`<user>.github.io`) the base path is left empty automatically.

To build the static export locally:

```bash
npm run build
# output goes to ./out  (serve it with any static server)
```

## Project structure

```
lib/anilist.ts        # GraphQL queries + types + filter option metadata
lib/format.ts         # display helpers (titles, scores, seasons, dates)
lib/router.ts         # hash router (parseHash, useRoute, navigate)
components/           # Nav, MediaCard, BannerCard, AnimeGrid, Skeleton, Icons
components/views/     # HomeView, BrowseView, TrendingView, GenreView, AnimeDetailView
app/                  # App Router shell (single SPA entry that routes by hash)
app/globals.css       # design system
.github/workflows/    # GitHub Pages deploy workflow
```

## Notes

- Image optimization is set to `unoptimized` so cover art is loaded directly by
  the browser from `s4.anilist.co` (works when the server can't proxy external
  hosts).
- All fetching is `"use client"` — data loads in the browser, so no server-side
  network access is required at runtime.
