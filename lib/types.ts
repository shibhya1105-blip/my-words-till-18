export type Genre = "essay" | "fiction" | "poetry";

export interface Post {
  id: string;
  title: string;
  genre: Genre;
  body: string;
  published_date: string; // YYYY-MM-DD
  created_at: string;
  updated_at: string;
}

export const GENRES: { id: Genre; label: string; color: string }[] = [
  { id: "essay", label: "Essay", color: "#6B4226" },
  { id: "fiction", label: "Fiction", color: "#B5482A" },
  { id: "poetry", label: "Poetry", color: "#8A9A7E" },
];

export function genreMeta(id: Genre) {
  return GENRES.find((g) => g.id === id) || GENRES[0];
}

export function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function wordCount(text: string) {
  const t = (text || "").trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}
