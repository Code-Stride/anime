"use client";

import Image from "next/image";
import Link from "next/link";
import type { MediaListCard } from "@/lib/anilist";
import {
  displayTitle,
  formatLabel,
  resolveBanner,
  resolveCover,
  scoreLabel,
} from "@/lib/format";
import { StarIcon } from "./Icons";

export function BannerCard({ anime }: { anime: MediaListCard }) {
  const banner = resolveBanner(anime);
  const cover = resolveCover(anime);
  const label = displayTitle(anime.title);
  const fmt = formatLabel(anime.format);
  const score = scoreLabel(anime.averageScore);

  return (
    <Link href={`/anime/${anime.id}`} className="banner-card">
      <div className="banner-bg">
        {banner ? (
          <Image
            src={banner}
            alt={label}
            fill
            sizes="(max-width: 720px) 90vw, 280px"
            style={{ objectFit: "cover" }}
          />
        ) : cover ? (
          <Image
            src={cover}
            alt={label}
            fill
            sizes="(max-width: 720px) 90vw, 280px"
            style={{ objectFit: "cover" }}
          />
        ) : null}
      </div>
      <div className="banner-veil" />
      <div className="banner-content">
        <div className="banner-title">{label}</div>
        <div className="banner-meta">
          {score && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <StarIcon width={13} height={13} />
              {score}
            </span>
          )}
          {anime.episodes ? <span>{anime.episodes} EP</span> : null}
          {anime.seasonYear ? <span>{anime.seasonYear}</span> : null}
        </div>
        {anime.genres?.length > 0 && (
          <div className="banner-tags">
            {anime.genres.slice(0, 3).map((g) => (
              <span key={g} className="tb">
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
