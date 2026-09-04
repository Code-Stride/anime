"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Title } from "@/lib/anilist";
import { animeql, DETAIL_QUERY } from "@/lib/anilist";
import { Nav } from "@/components/Nav";
import { Loader, ErrorBox } from "@/components/Skeleton";
import {
  BackIcon,
  CalendarIcon,
  ClockIcon,
  ExternalIcon,
  FilmIcon,
  HeartIcon,
  ShareIcon,
  StarIcon,
} from "@/components/Icons";
import {
  airingIn,
  dateLabel,
  displayTitle,
  formatCount,
  formatLabel,
  hexToRgba,
  relationLabel,
  resolveBanner,
  resolveCover,
  romajiTitle,
  scoreLabel,
  seasonYear,
  statusLabel,
  studioList,
} from "@/lib/format";

type Trailer = { id: string | null; site: string | null; thumbnail: string | null };

type DetailData = {
  Media: {
    id: number;
    title: Title;
    coverImage: { extraLarge?: string | null; large?: string | null; medium?: string | null; color?: string | null };
    bannerImage?: string | null;
    description?: string | null;
    averageScore?: number | null;
    meanScore?: number | null;
    popularity?: number | null;
    favourites?: number | null;
    format?: string | null;
    status?: string | null;
    season?: string | null;
    seasonYear?: number | null;
    episodes?: number | null;
    duration?: number | null;
    genres: string[];
    source?: string | null;
    isAdult?: boolean | null;
    countryOfOrigin?: string | null;
    hashtag?: string | null;
    startDate?: { year?: number | null; month?: number | null; day?: number | null } | null;
    endDate?: { year?: number | null; month?: number | null; day?: number | null } | null;
    nextAiringEpisode?: { episode: number | null; airingAt: number | null; timeUntilAiring: number | null } | null;
    trailer?: Trailer | null;
    studios?: { nodes?: { id: number; name: string }[] } | null;
    tags?: { name: string; rank: number; isMediaSpoiler: boolean; isGeneralSpoiler: boolean }[] | null;
    relations?: {
      edges?: {
        relationType?: string | null;
        node: { id: number; title: Title; coverImage: { medium?: string | null }; format?: string | null; averageScore?: number | null };
      }[];
    } | null;
    characters?: {
      edges?: {
        role?: string | null;
        node: { id: number; name: { full?: string | null }; image: { medium?: string | null } };
        voiceActors?: { id: number; name: { full?: string | null }; image: { medium?: string | null } }[];
      }[];
    } | null;
    recommendations?: {
      nodes?: {
        mediaRecommendation: {
          id: number;
          title: Title;
          coverImage: { medium?: string | null };
          format?: string | null;
          averageScore?: number | null;
        };
      }[];
    } | null;
  };
};

function trailerUrl(t: Trailer | null | undefined): string | null {
  if (!t?.id) return null;
  if (t.site === "youtube") return `https://www.youtube.com/embed/${t.id}`;
  return null;
}

export default function AnimeDetail() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [data, setData] = useState<DetailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    setLoading(true);
    setError(null);
    animeql<DetailData>(DETAIL_QUERY, { id: parseInt(id, 10) })
      .then((d) => {
        if (alive) setData(d);
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
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <Nav />
        <Loader label="Loading title…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <Nav />
        <div className="page-head">
          <h1>Something went wrong</h1>
        </div>
        <ErrorBox message={error} />
      </div>
    );
  }

  if (!data?.Media) {
    return (
      <div className="page">
        <Nav />
        <div className="empty">
          <h3>Title not found</h3>
          <p>This anime may have been removed or the id is invalid.</p>
        </div>
      </div>
    );
  }

  const m = data.Media;
  const title = displayTitle(m.title);
  const romaji = romajiTitle(m.title);
  const cover = m.coverImage?.extraLarge || m.coverImage?.large || m.coverImage?.medium;
  const banner = resolveBanner(m);
  const score = scoreLabel(m.averageScore);
  const year = m.seasonYear || m.startDate?.year;
  const fm = formatLabel(m.format as never);
  const st = statusLabel(m.status as never);
  const season = seasonYear(m as never);
  const accent = m.coverImage?.color || "#6d5bff";
  const trailing = trailerUrl(m.trailer);

  const characters = m.characters?.edges || [];
  const relations = m.relations?.edges || [];
  const recs = m.recommendations?.nodes || [];

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="page">
      <Nav />

      <div style={{ paddingTop: 16 }}>
        <Link href="/browse" className="chip">
          <BackIcon width={15} height={15} style={{ verticalAlign: "text-bottom", marginRight: 4 }} />
          Back to browse
        </Link>
      </div>

      <div className="detail-hero">
        {banner && (
          <div className="detail-banner">
            <Image
              src={banner}
              alt={title}
              fill
              sizes="100vw"
              priority
              style={{ objectFit: "cover" }}
            />
            <div className="detail-banner-veil" />
          </div>
        )}

        <div className="detail-body container" style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "0 20px" }}>
          <div className="detail-cover" style={{ position: "relative", background: hexToRgba(accent, 0.3), borderColor: hexToRgba(accent, 0.5) }}>
            {cover && (
              <Image
                src={cover}
                alt={title}
                fill
                sizes="220px"
                priority
                style={{ objectFit: "cover" }}
              />
            )}
          </div>

          <div>
            <h1 className="detail-title">{title}</h1>
            <div className="detail-original">{romaji !== title ? romaji : m.title.native}</div>

            <div className="detail-meta">
              {score && (
                <span className="pill accent">
                  <StarIcon width={14} height={14} />
                  {score}
                </span>
              )}
              <span className="pill">{fm}</span>
              {st && <span className="pill">{st}</span>}
              {season && <span className="pill">{season}</span>}
              {m.episodes ? <span className="pill">{m.episodes} episodes</span> : null}
              {m.duration ? (
                <span className="pill">
                  <ClockIcon width={13} height={13} />
                  {m.duration}m
                </span>
              ) : null}
              {m.countryOfOrigin ? (
                <span className="pill"><FilmIcon width={13} height={13} />{m.countryOfOrigin}</span>
              ) : null}
              {m.nextAiringEpisode?.timeUntilAiring != null && (
                <span className="pill accent">
                  <CalendarIcon width={13} height={13} />
                  EP {m.nextAiringEpisode.episode} in {airingIn(m.nextAiringEpisode.timeUntilAiring)}
                </span>
              )}
            </div>

            <div className="detail-actions">
              <button
                className="btn btn-primary"
                onClick={() => {
                  const url = typeof window !== "undefined"
                    ? `https://anilist.co/anime/${m.id}`
                    : "#";
                  window.open(url, "_blank", "noopener");
                }}
              >
                View on AniList
                <ExternalIcon width={15} height={15} />
              </button>
              <button
                className="btn btn-ghost"
                onClick={async () => {
                  if (navigator.share) {
                    try {
                      await navigator.share({ title, url: shareUrl });
                    } catch {
                      /* user cancelled */
                    }
                  } else if (navigator.clipboard) {
                    await navigator.clipboard.writeText(shareUrl);
                    alert("Link copied!");
                  }
                }}
              >
                <ShareIcon width={15} height={15} />
                Share
              </button>
            </div>

            {m.description && (
              <p className="detail-desc" dangerouslySetInnerHTML={{ __html: m.description }} />
            )}

            {m.genres?.length > 0 && (
              <div className="detail-genres genres">
                {m.genres.map((g) => (
                  <Link key={g} href={`/genre/${encodeURIComponent(g)}`} className="chip">
                    {g}
                  </Link>
                ))}
              </div>
            )}

            <div className="detail-stats">
              <div className="stat-card">
                <div className="k">Score</div>
                <div className="v acc">{score ? `${score} / 10` : "—"}</div>
              </div>
              <div className="stat-card">
                <div className="k">Popularity</div>
                <div className="v">{formatCount(m.popularity)}</div>
              </div>
              <div className="stat-card">
                <div className="k">Favourites</div>
                <div className="v">{formatCount(m.favourites)}</div>
              </div>
              <div className="stat-card">
                <div className="k">Aired</div>
                <div className="v">
                  {dateLabel(m.startDate as never)}
                  {m.endDate?.year && m.endDate.year !== m.startDate?.year ? ` – ${dateLabel(m.endDate as never)}` : ""}
                </div>
              </div>
              <div className="stat-card">
                <div className="k">Studio</div>
                <div className="v" style={{ fontSize: 15 }}>{studioList(m.studios) || "—"}</div>
              </div>
              {m.source && (
                <div className="stat-card">
                  <div className="k">Source</div>
                  <div className="v" style={{ fontSize: 15 }}>{m.source.replace(/_/g, " ")}</div>
                </div>
              )}
            </div>

            {trailing && (
              <div className="trailer-frame">
                <iframe
                  src={trailing}
                  title={`${title} trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {characters.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Characters</h2>
          </div>
          <div className="cast-list">
            {characters.map((c) => {
              const va = c.voiceActors?.[0];
              return (
                <div key={c.node.id} className="cast-card">
                  {c.node.image?.medium && (
                    <Image src={c.node.image.medium} alt={c.node.name.full || ""} width={46} height={46} />
                  )}
                  <div>
                    <div className="name">{c.node.name.full}</div>
                    <div className="role">{c.role === "MAIN" ? "Main" : "Supporting"}</div>
                    {va && <div className="role" style={{ color: "var(--accent-3)" }}>VA: {va.name.full}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {relations.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Related</h2>
          </div>
          <div className="rel-grid">
            {relations.map((r) => (
              <Link key={r.node.id} href={`/anime/${r.node.id}`} className="rel-card">
                {r.node.coverImage?.medium && (
                  <Image src={r.node.coverImage.medium} alt={displayTitle(r.node.title)} width={46} height={66} />
                )}
                <div>
                  <div className="t">{displayTitle(r.node.title)}</div>
                  <div className="sub">
                    {relationLabel(r.relationType)}
                    {r.node.format ? ` · ${formatLabel(r.node.format as never)}` : ""}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {recs.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>You might also like</h2>
          </div>
          <div className="rel-grid">
            {recs.map((r) => (
              <Link key={r.mediaRecommendation.id} href={`/anime/${r.mediaRecommendation.id}`} className="rel-card">
                {r.mediaRecommendation.coverImage?.medium && (
                  <Image src={r.mediaRecommendation.coverImage.medium} alt={displayTitle(r.mediaRecommendation.title)} width={46} height={66} />
                )}
                <div>
                  <div className="t">{displayTitle(r.mediaRecommendation.title)}</div>
                  <div className="sub">
                    {formatLabel(r.mediaRecommendation.format as never)}
                    {r.mediaRecommendation.averageScore ? ` · ${scoreLabel(r.mediaRecommendation.averageScore)}★` : ""}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="brand">
              <span className="brand-icon"><HeartIcon width={18} height={18} /></span>
              Ani<span className="accent">Vault</span>
            </div>
            <p className="footer-blurb">
              Data via AniList’s public GraphQL API. AniVault hosts no video
              content. You can read the original entry on{" "}
              <a href={`https://anilist.co/anime/${m.id}`} target="_blank" rel="noreferrer" style={{ color: "var(--accent-3)" }}>
                AniList
              </a>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
