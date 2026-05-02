/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // Set via NEXT_PUBLIC_BASE_PATH env var in CI (e.g. /japan-gold-leaderboard for GitHub Pages project repo)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  trailingSlash: true,
};

export default nextConfig;
