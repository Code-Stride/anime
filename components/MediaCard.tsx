"use client";

import Image from "next/image";
import type { MediaListCard } from "@/lib/anilist";
import { hashHref } from "@/lib/router";
import {
  displayTitle,
  episodeLabel,
  formatLabel,
  resolveCover,
  scoreLabel,
  seasonYear,
} from "@/lib/format";
import { StarIcon } from "./Icons";

export function MediaCard({ anime }: { anime: MediaListCard }) {
  const cover = resolveCover(anime);
  const score = scoreLabel(anime.averageScore);
  const fm = formatLabel(anime.format);
  const season = seasonYear(anime);
  const eps = episodeLabel(anime);
  const time = anime.nextAiringEpisode?.timeUntilAiring;

  return (
    <a href={hashHref(`/anime/${anime.id}`)} className="card">
      <div className="card-cover">
        {cover ? (
          <Image
            src={cover}
            alt={displayTitle(anime.title)}
            fill
            sizes="(max-width: 720px) 45vw, 180px"
            priority={false}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="card-cover" />
        )}
        <div className="card-top">
          {score && (
            <span className="score-badge">
              <StarIcon width={12} height={12} />
              {score}
            </span>
          )}
          {fm && <span className="format-badge">{fm}</span>}
        </div>
      </div>
      <div className="card-info">
        <div className="card-title">{displayTitle(anime.title)}</div>
        <div className="card-meta">
          {season && (
            <>
              {season}
              <span className="sep">·</span>
            </>
          )}
          {eps}
          {time != null && (
            <>
              <span className="sep">·</span>
              <span style={{ color: "var(--accent-3)" }}>airs {Math.max(1, Math.round(time / 86400))}d</span>
            </>
          )}
        </div>
        {anime.genres?.length > 0 && (
          <div className="genres">
            {anime.genres.slice(0, 3).map((g) => (
              <span key={g}>{g}</span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
