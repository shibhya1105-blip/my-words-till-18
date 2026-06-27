import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "my words till 18",
  description: "A collection of essays, fiction, and poetry.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-paper text-ink min-h-screen">
        {children}
      </body>
    </html>
  );
}
