"use client";

import type { MediaListCard } from "@/lib/anilist";
import { MediaCard } from "./MediaCard";

export function AnimeGrid({ items }: { items: MediaListCard[] }) {
  return (
    <div className="grid grid-cards">
      {items.map((a) => (
        <MediaCard key={a.id} anime={a} />
      ))}
    </div>
  );
}
