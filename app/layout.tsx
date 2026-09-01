import type { Metadata } from "next";
import "./globals.css";

const title = "Black Circle — Open-World Crime Thriller";
const description =
  "A story-driven open world built around reactive law enforcement, combat, vehicles and layered narrative discovery. Playable prototype available now.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "Black Circle",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
