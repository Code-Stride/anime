"use client";

import { useRoute } from "@/lib/router";
import { Nav } from "@/components/Nav";
import { HomeView } from "@/components/views/HomeView";
import { BrowseView } from "@/components/views/BrowseView";
import { TrendingView } from "@/components/views/TrendingView";
import { GenreView } from "@/components/views/GenreView";
import { AnimeDetailView } from "@/components/views/AnimeDetailView";

export default function Page() {
  const { path } = useRoute();

  let view: React.ReactNode;
  if (path.startsWith("/anime/")) {
    const id = path.slice("/anime/".length).split("/")[0];
    view = <AnimeDetailView id={id} />;
  } else if (path.startsWith("/genre/")) {
    const genre = decodeURIComponent(path.slice("/genre/".length).split("/")[0]);
    view = <GenreView genre={genre} />;
  } else if (path === "/browse") {
    view = <BrowseView />;
  } else if (path === "/trending") {
    view = <TrendingView />;
  } else {
    view = <HomeView />;
  }

  return (
    <div className="container">
      <Nav />
      {view}
    </div>
  );
}
