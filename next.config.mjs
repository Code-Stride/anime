/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Static export for GitHub Pages (no server). All data is fetched
  // client-side from AniList, so the app works as a fully static SPA.
  output: "export",
  trailingSlash: true,

  // For project pages at https://<user>.github.io/<repo>/, set
  // NEXT_PUBLIC_BASE_PATH=/<repo> during build. For user/org pages
  // (https://<user>.github.io) leave it empty.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",

  images: {
    // Cover art is hosted on s4.anilist.co and loaded directly by the
    // browser, so disable Next's image optimization proxy (which would run
    // on the server and can't reach external hosts in all environments).
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "s4.anilist.co" }],
  },
};

export default nextConfig;
