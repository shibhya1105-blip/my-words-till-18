"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { ReadingRoom } from "@/components/ReadingRoom";
import { Post, Genre, GENRES, wordCount } from "@/lib/types";
import { Check, X } from "lucide-react";

interface DraftState {
  id: string | null; // null means new, unsaved
  title: string;
  genre: Genre;
  published_date: string;
  body: string;
}

export function WriteClient({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter();
  const supabase = createClient();

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [draft, setDraft] = useState<DraftState | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function startNewPiece() {
    setDraft({
      id: null,
      title: "",
      genre: "essay",
      published_date: new Date().toISOString().slice(0, 10),
      body: "",
    });
  }

  function startEdit(post: Post) {
    setDraft({
      id: post.id,
      title: post.title,
      genre: post.genre,
      published_date: post.published_date,
      body: post.body,
    });
  }

  async function handleDelete(post: Post) {
    const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    }
  }

  async function commitDraft() {
    if (!draft || !draft.title.trim()) return;
    setSaveState("saving");

    const payload = {
      title: draft.title.trim(),
      genre: draft.genre,
      body: draft.body,
      published_date: draft.published_date,
    };

    try {
      if (draft.id) {
        const res = await fetch(`/api/posts/${draft.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("save failed");
        const { post } = await res.json();
        setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
      } else {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("save failed");
        const { post } = await res.json();
        setPosts((prev) => [post, ...prev]);
      }
      setSaveState("saved");
      setDraft(null);
      setTimeout(() => setSaveState("idle"), 1800);
    } catch {
      setSaveState("error");
    }
  }

  if (draft) {
    return (
      <DraftEditor
        draft={draft}
        setDraft={setDraft}
        onCancel={() => setDraft(null)}
        onCommit={commitDraft}
        saveState={saveState}
      />
    );
  }

  return (
    <ReadingRoom
      posts={posts}
      isWriter={true}
      onNewPiece={startNewPiece}
      onEdit={startEdit}
      onDelete={handleDelete}
      onLogout={handleLogout}
    />
  );
}

function DraftEditor({
  draft,
  setDraft,
  onCancel,
  onCommit,
  saveState,
}: {
  draft: DraftState;
  setDraft: (d: DraftState) => void;
  onCancel: () => void;
  onCommit: () => void;
  saveState: "idle" | "saving" | "saved" | "error";
}) {
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const canSave = draft.title.trim().length > 0;

  return (
    <div className="min-h-screen px-5 md:px-14 py-8 md:py-10">
      <div className="max-w-[640px] mx-auto">
        <div className="flex gap-2 mb-5 flex-wrap items-center">
          {GENRES.map((g) => {
            const active = draft.genre === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setDraft({ ...draft, genre: g.id })}
                className="focus-ring font-sans text-xs font-medium px-[11px] py-[5px] rounded-full border transition-colors"
                style={{
                  borderColor: active ? g.color : "#E3DBC9",
                  background: active ? g.color : "transparent",
                  color: active ? "#FAF6EF" : "#6B5F4D",
                }}
              >
                {g.label}
              </button>
            );
          })}
          <input
            type="date"
            value={draft.published_date}
            onChange={(e) =>
              setDraft({ ...draft, published_date: e.target.value })
            }
            className="focus-ring font-mono text-xs border border-hairline rounded-full px-[11px] py-[5px] bg-transparent text-chip ml-auto"
          />
        </div>

        <input
          ref={titleRef}
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder="Give it a title"
          className="focus-ring w-full font-serif font-bold text-[32px] border-0 border-b-2 border-hairline bg-transparent pb-3 mb-6 outline-none"
        />

        <textarea
          value={draft.body}
          onChange={(e) => setDraft({ ...draft, body: e.target.value })}
          placeholder="Start writing…"
          rows={16}
          className="focus-ring w-full font-serif text-[17px] leading-[1.75] text-inksoft border-0 bg-transparent outline-none resize-y min-h-[300px]"
        />

        <div className="flex items-center gap-3 mt-5 pt-5 border-t border-hairline flex-wrap">
          <button
            onClick={onCommit}
            disabled={!canSave}
            className="focus-ring flex items-center gap-1.5 rounded-md px-[18px] py-2.5 text-[13.5px] font-semibold text-paper disabled:cursor-not-allowed"
            style={{ background: canSave ? "#1F1B16" : "#D8CFB8" }}
          >
            <Check size={14} /> Publish
          </button>
          <button
            onClick={onCancel}
            className="focus-ring flex items-center gap-1.5 border border-hairline rounded-md px-4 py-2.5 text-[13.5px] font-medium text-chip"
          >
            <X size={14} /> Cancel
          </button>
          <span className="font-mono text-[11.5px] text-muted ml-auto">
            {wordCount(draft.body)} words
            {saveState === "saving" && " · saving…"}
            {saveState === "saved" && " · saved"}
            {saveState === "error" && " · couldn't save, try again"}
          </span>
        </div>
      </div>
    </div>
  );
}
