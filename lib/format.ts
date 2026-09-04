import type {
  MediaFormat,
  MediaListCard,
  MediaStatus,
  Title,
} from "@/lib/anilist";

export function displayTitle(title: Title): string {
  return title.english || title.romaji || title.native || "Untitled";
}

export function romajiTitle(title: Title): string {
  return title.romaji || title.english || title.native || "Untitled";
}

export function formatLabel(fmt?: MediaFormat | null): string {
  const map: Record<string, string> = {
    TV: "TV",
    TV_SHORT: "TV Short",
    MOVIE: "Movie",
    OVA: "OVA",
    ONA: "ONA",
    SPECIAL: "Special",
    MUSIC: "Music",
    MANGA: "Manga",
    NOVEL: "Novel",
    ONE_SHOT: "One-shot",
  };
  return fmt ? map[fmt] || fmt : "Anime";
}

export function statusLabel(status?: MediaStatus | null): string {
  const map: Record<string, string> = {
    FINISHED: "Finished",
    RELEASING: "Airing",
    NOT_YET_RELEASED: "Not yet aired",
    CANCELLED: "Cancelled",
    HIATUS: "On hiatus",
  };
  return status ? map[status] || status : "—";
}

export function seasonYear(anime: MediaListCard): string {
  const { season, seasonYear } = anime;
  if (!season && !seasonYear) return "";
  const s = season ? season.charAt(0) + season.slice(1).toLowerCase() : "";
  return [s, seasonYear].filter(Boolean).join(" ");
}

export function episodeLabel(anime: MediaListCard): string {
  if (anime.nextAiringEpisode?.episode) {
    return `EP ${anime.nextAiringEpisode.episode} soon`;
  }
  if (anime.episodes) return `${anime.episodes} EP`;
  return "";
}

export function scoreLabel(score?: number | null): string {
  if (score == null) return "";
  return (score / 10).toFixed(1);
}

export function formatCount(n?: number | null): string {
  if (n == null) return "";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

export function dateLabel(date: { year?: number | null; month?: number | null; day?: number | null } | null): string {
  if (!date) return "";
  const { year, month, day } = date;
  if (!year) return "";
  if (!month) return String(year);
  const names = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const base = `${names[month - 1] ?? ""} ${year}`;
  if (!day) return base;
  return `${day} ${base}`;
}

export function airingIn(seconds?: number | null): string {
  if (seconds == null) return "";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  if (days > 0) return `${days}d ${hours}h`;
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

export function studioList(studios?: { nodes?: { name: string }[] } | null): string {
  return (studios?.nodes || []).map((s) => s.name).join(", ");
}

export function relationLabel(type?: string | null): string {
  const map: Record<string, string> = {
    ADAPTATION: "Adaptation",
    PREQUEL: "Prequel",
    SEQUEL: "Sequel",
    PARENT: "Parent",
    SIDE_STORY: "Side story",
    CHARACTER: "Character",
    SUMMARY: "Summary",
    ALTERNATIVE: "Alternative",
    SPIN_OFF: "Spin-off",
    OTHER: "Other",
    SOURCE: "Source",
    COMPILATION: "Compilation",
    CONTAINS: "Contains",
  };
  return type ? map[type] || type.replace(/_/g, " ") : "";
}

export function resolveCover(anime: { coverImage?: { extraLarge?: string | null; large?: string | null; medium?: string | null } | null }): string | undefined {
  const c = anime.coverImage;
  return (c?.extraLarge || c?.large || c?.medium || undefined) || undefined;
}

export function resolveBanner(anime: { bannerImage?: string | null }): string | undefined {
  return anime.bannerImage || undefined;
}

export function hexToRgba(hex?: string | null, alpha = 1): string {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  const m = hex.replace("#", "");
  const r = parseInt(m.substring(0, 2), 16);
  const g = parseInt(m.substring(2, 4), 16);
  const b = parseInt(m.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
