import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AniVault — Explore the Anime Universe",
    template: "%s · AniVault",
  },
  description:
    "A clean, open anime catalog and discovery app. Search, explore, and find anime by genres, seasons, ratings, and more.",
  applicationName: "AniVault",
  keywords: ["anime", "catalog", "discovery", "AniList"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
