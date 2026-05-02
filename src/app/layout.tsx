import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "eBird Japan Gold Leaderboard",
  description:
    "Weekly leaderboard for quality eBird checklists (Gold & Silver tiers) across all 47 Japanese prefectures. Powered by eBird API v2 · Cornell Lab of Ornithology.",
  keywords: ["eBird", "Japan", "birding", "leaderboard", "checklists", "birdwatching"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
