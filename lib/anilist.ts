// AniVault data layer
// All data comes from the public AniList GraphQL API (https://graphql.anilist.co).
// Requests are made on the client (browser) — no API key required.

export const ANILIST_API = "https://graphql.anilist.co";

type GQLError = { message: string };

export async function animeql<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch(ANILIST_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`AniList request failed (${res.status})`);
  }

  const json = await res.json();
  if (json.errors && json.errors.length > 0) {
    throw new Error((json.errors as GQLError[]).map((e) => e.message).join("; "));
  }
  return json.data as T;
}

// ---------------------------------------------------------------------------
// Shared fragments / types
// ---------------------------------------------------------------------------

export interface Title {
  romaji: string | null;
  english: string | null;
  native: string | null;
}

export interface CoverImage {
  extraLarge?: string | null;
  large?: string | null;
  medium?: string | null;
  color?: string | null;
}

export interface FuzzyDate {
  year?: number | null;
  month?: number | null;
  day?: number | null;
}

export type MediaFormat =
  | "TV"
  | "TV_SHORT"
  | "MOVIE"
  | "SPECIAL"
  | "OVA"
  | "ONA"
  | "MUSIC"
  | "MANGA"
  | "NOVEL"
  | "ONE_SHOT";

export type MediaStatus =
  | "FINISHED"
  | "RELEASING"
  | "NOT_YET_RELEASED"
  | "CANCELLED"
  | "HIATUS";

export type MediaSort =
  | "TRENDING_DESC"
  | "POPULARITY_DESC"
  | "SCORE_DESC"
  | "TITLE_ROMAJI"
  | "START_DATE_DESC"
  | "UPDATED_AT_DESC";

export interface MediaListCard {
  id: number;
  title: Title;
  coverImage: CoverImage;
  bannerImage?: string | null;
  averageScore?: number | null;
  meanScore?: number | null;
  popularity?: number | null;
  format?: MediaFormat | null;
  status?: MediaStatus | null;
  season?: string | null;
  seasonYear?: number | null;
  episodes?: number | null;
  duration?: number | null;
  genres: string[];
  isAdult?: boolean | null;
  startDate?: FuzzyDate | null;
  countryOfOrigin?: string | null;
  description?: string | null;
  nextAiringEpisode?: {
    episode: number | null;
    airingAt: number | null;
    timeUntilAiring: number | null;
  } | null;
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

const CARD_FIELDS = `
  id
  title { romaji english native }
  coverImage { extraLarge large medium color }
  bannerImage
  averageScore
  meanScore
  popularity
  format
  status
  season
  seasonYear
  episodes
  duration
  genres
  isAdult
  startDate { year month day }
  countryOfOrigin
  description(asHtml: false)
  nextAiringEpisode { episode airingAt timeUntilAiring }
`;

export const BROWSE_QUERY = `
  query Browse(
    $search: String
    $page: Int
    $perPage: Int
    $format: [MediaFormat]
    $genre: [String]
    $seasonYear: Int
    $season: MediaSeason
    $status: [MediaStatus]
    $sort: [MediaSort]
  ) {
    Page(page: $page, perPage: $perPage) {
      media(
        type: ANIME
        search: $search
        format_in: $format
        genre_in: $genre
        seasonYear: $seasonYear
        season: $season
        status_in: $status
        sort: $sort
      ) {
        ${CARD_FIELDS}
      }
      pageInfo { total currentPage hasNextPage }
    }
  }
`;

export const HOME_QUERY = `
  query Home($trendingPage: Int, $popularPage: Int) {
    trending: Page(page: $trendingPage, perPage: 12) {
      media(type: ANIME, sort: TRENDING_DESC) { ${CARD_FIELDS} }
    }
    popular: Page(page: $popularPage, perPage: 12) {
      media(type: ANIME, sort: SCORE_DESC) { ${CARD_FIELDS} }
    }
  }
`;

export const TRENDING_QUERY = `
  query Trending($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, sort: TRENDING_DESC) { ${CARD_FIELDS} }
      pageInfo { total currentPage hasNextPage }
    }
  }
`;

export const DETAIL_QUERY = `
  query Detail($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title { romaji english native }
      coverImage { extraLarge large medium color }
      bannerImage
      description(asHtml: false)
      averageScore
      meanScore
      popularity
      favourites
      format
      status
      season
      seasonYear
      episodes
      duration
      genres
      source
      isAdult
      countryOfOrigin
      hashtag
      startDate { year month day }
      endDate { year month day }
      nextAiringEpisode { episode airingAt timeUntilAiring }
      trailer { id site thumbnail }
      studios(isMain: true) { nodes { id name } }
      genres
      tags { name rank isMediaSpoiler isGeneralSpoiler }
      relations {
        edges {
          relationType
          node { id title { romaji } coverImage { medium } format averageScore }
        }
      }
      characters(sort: ROLE, perPage: 12) {
        edges {
          role
          node { id name { full } image { medium } }
          voiceActors(language: JAPANESE) { id name { full } image { medium } }
        }
      }
      recommendations(perPage: 10, sort: RATING_DESC) {
        nodes {
          mediaRecommendation {
            id
            title { romaji }
            coverImage { medium }
            format
            averageScore
          }
        }
      }
    }
  }
`;

export const SEASONS = [
  "WINTER",
  "SPRING",
  "SUMMER",
  "FALL",
] as const;

export const FORMAT_OPTIONS: { value: MediaFormat; label: string }[] = [
  { value: "TV", label: "TV" },
  { value: "TV_SHORT", label: "TV Short" },
  { value: "MOVIE", label: "Movie" },
  { value: "OVA", label: "OVA" },
  { value: "ONA", label: "ONA" },
  { value: "SPECIAL", label: "Special" },
  { value: "MUSIC", label: "Music" },
];

export const STATUS_OPTIONS: { value: MediaStatus; label: string }[] = [
  { value: "RELEASING", label: "Currently airing" },
  { value: "FINISHED", label: "Finished" },
  { value: "NOT_YET_RELEASED", label: "Not yet released" },
  { value: "HIATUS", label: "On hiatus" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const SORT_OPTIONS: { value: MediaSort | "DEFAULT"; label: string }[] = [
  { value: "TRENDING_DESC", label: "Trending" },
  { value: "SCORE_DESC", label: "Top rated" },
  { value: "POPULARITY_DESC", label: "Most popular" },
  { value: "START_DATE_DESC", label: "Newest" },
  { value: "TITLE_ROMAJI", label: "A–Z" },
];
