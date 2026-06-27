"use client";

import { useMemo, useState } from "react";
import { Post, GENRES, genreMeta, formatDate, wordCount } from "@/lib/types";
import { MarginaliaMark } from "@/components/MarginaliaMark";
import { Pencil, Trash2, Plus, BookOpen, LogOut } from "lucide-react";

interface ReadingRoomProps {
  posts: Post[];
  isWriter: boolean; // true only on /write, only when logged in
  onNewPiece?: () => void;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
  onLogout?: () => void;
}

export function ReadingRoom({
  posts,
  isWriter,
  onNewPiece,
  onEdit,
  onDelete,
  onLogout,
}: ReadingRoomProps) {
  const [filter, setFilter] = useState<string>("all");
  const [activeId, setActiveId] = useState<string | null>(
    posts[0]?.id ?? null
  );
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? posts : posts.filter((p) => p.genre === filter)),
    [posts, filter]
  );

  const active = posts.find((p) => p.id === activeId) ?? null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between gap-3 px-7 py-[18px] border-b border-hairline sticky top-0 bg-paper z-10 flex-wrap">
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <BookOpen size={18} className="text-leather flex-shrink-0" strokeWidth={1.75} />
          <span className="font-serif font-bold text-xl tracking-[0.01em]">
            my words till 18
          </span>
          <span className="font-mono text-[11px] text-muted tracking-[0.04em]">
            a place to keep what's written
          </span>
        </div>

        {isWriter && (
          <button
            onClick={onLogout}
            className="focus-ring flex items-center gap-1.5 border border-ink rounded-full px-4 py-[7px] text-[13px] font-medium hover:bg-ink hover:text-paper transition-colors"
          >
            <LogOut size={13} /> Log out
          </button>
        )}
      </header>

      <div className="flex flex-1 min-h-0 flex-col md:flex-row">
        <nav
          aria-label="Table of contents"
          className="w-full md:w-[300px] flex-shrink-0 border-b md:border-b-0 md:border-r border-hairline py-5 max-h-[40vh] md:max-h-none overflow-y-auto"
        >
          <div className="flex gap-1.5 px-5 pb-4 flex-wrap">
            <Chip
              active={filter === "all"}
              color="#1F1B16"
              onClick={() => setFilter("all")}
            >
              All
            </Chip>
            {GENRES.map((g) => (
              <Chip
                key={g.id}
                active={filter === g.id}
                color={g.color}
                onClick={() => setFilter(g.id)}
              >
                {g.label}
              </Chip>
            ))}
          </div>

          {isWriter && (
            <button
              onClick={onNewPiece}
              className="focus-ring flex items-center gap-1.5 w-[calc(100%-40px)] mx-5 mb-4 border-[1.5px] border-dashed border-[#C9BFA4] rounded-lg px-3 py-2.5 text-[13px] font-medium text-leather hover:bg-[#F1EADA]/60 transition-colors"
            >
              <Plus size={15} /> New piece
            </button>
          )}

          {filtered.length === 0 && (
            <p className="px-5 text-[13px] text-muted leading-relaxed">
              {isWriter
                ? "Nothing here yet. Start your first piece above."
                : "Nothing published here yet."}
            </p>
          )}

          <ul className="list-none m-0 p-0">
            {filtered.map((p) => {
              const meta = genreMeta(p.genre);
              const isActive = p.id === activeId;
              return (
                <li key={p.id} className="relative">
                  <button
                    onClick={() => setActiveId(p.id)}
                    className={`focus-ring group flex items-center gap-2 w-full text-left px-[17px] py-[11px] transition-colors ${
                      isActive ? "bg-[#F1EADA]" : "bg-transparent"
                    }`}
                    style={{
                      borderLeft: `3px solid ${isActive ? meta.color : "transparent"}`,
                    }}
                  >
                    {isActive && <MarginaliaMark color={meta.color} />}
                    <div className="flex-1 min-w-0">
                      <div className="font-serif font-semibold text-[14.5px] whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-brick transition-colors">
                        {p.title || "Untitled"}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full inline-block flex-shrink-0"
                          style={{ background: meta.color }}
                        />
                        <span className="font-mono text-[10.5px] text-muted whitespace-nowrap overflow-hidden text-ellipsis">
                          {meta.label} · {formatDate(p.published_date)}
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <main className="flex-1 overflow-y-auto px-5 md:px-14 py-8 md:py-10 pb-14">
          {active ? (
            <article className="max-w-[640px] mx-auto">
              <div className="flex items-center gap-2.5 mb-3.5 flex-wrap">
                <span
                  className="font-sans text-[11.5px] font-semibold tracking-[0.05em] uppercase"
                  style={{ color: genreMeta(active.genre).color }}
                >
                  {genreMeta(active.genre).label}
                </span>
                <span className="text-[#D8CFB8]">·</span>
                <span className="font-mono text-xs text-muted">
                  {formatDate(active.published_date)}
                </span>
                <span className="text-[#D8CFB8]">·</span>
                <span className="font-mono text-xs text-muted">
                  {wordCount(active.body)} words
                </span>
              </div>

              <h1 className="font-serif font-bold text-[28px] md:text-[38px] leading-[1.15] mb-7">
                {active.title}
              </h1>

              <div className="font-serif text-[17.5px] leading-[1.75] text-inksoft whitespace-pre-wrap">
                {active.body || (
                  <span className="text-[#A39B85] italic">
                    This piece doesn't have any words yet.
                  </span>
                )}
              </div>

              {isWriter && (
                <div className="flex gap-2.5 mt-10 pt-5 border-t border-hairline">
                  <button
                    onClick={() => onEdit?.(active)}
                    className="focus-ring flex items-center gap-1.5 border border-ink rounded-md px-3.5 py-[7px] text-[13px] font-medium hover:bg-ink hover:text-paper transition-colors"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(active.id)}
                    className="focus-ring flex items-center gap-1.5 border border-hairline rounded-md px-3.5 py-[7px] text-[13px] font-medium text-brick hover:bg-brick/5 transition-colors"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              )}
            </article>
          ) : (
            <div className="max-w-[480px] mx-auto mt-16 text-center">
              <p className="font-serif text-[19px] text-leather mb-2.5">
                An empty page.
              </p>
              <p className="text-sm text-muted">
                {isWriter
                  ? "Start your first piece from the index on the left."
                  : "There's nothing published here yet."}
              </p>
            </div>
          )}
        </main>
      </div>

      {confirmDeleteId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-ink/35 flex items-center justify-center z-50 p-4"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-paper rounded-xl p-6 w-80 shadow-2xl"
          >
            <p className="text-[14.5px] mb-4.5 leading-relaxed">
              Delete this piece for good? This can&apos;t be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="focus-ring border border-[#C9BFA4] rounded-md px-3.5 py-[7px] text-[13px]"
              >
                Keep it
              </button>
              <button
                onClick={() => {
                  const post = posts.find((p) => p.id === confirmDeleteId);
                  if (post) onDelete?.(post);
                  setConfirmDeleteId(null);
                }}
                className="focus-ring bg-brick border border-brick rounded-md px-3.5 py-[7px] text-[13px] font-medium text-paper"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  color,
  onClick,
  children,
}: {
  active: boolean;
  color: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="focus-ring font-sans text-xs font-medium px-[11px] py-[5px] rounded-full border transition-colors"
      style={{
        borderColor: active ? color : "#E3DBC9",
        background: active ? color : "transparent",
        color: active ? "#FAF6EF" : "#6B5F4D",
      }}
    >
      {children}
    </button>
  );
}
