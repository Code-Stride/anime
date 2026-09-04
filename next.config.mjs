/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // AniList covers are hosted on s4.anilist.co. We fetch and resize client-
    // side, so disable the Next image optimization proxy (which would run on
    // the server and can't reach external hosts in some environments).
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "s4.anilist.co" },
    ],
  },
};

export default nextConfig;
