"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { BookOpen } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("That email and password don't match. Try again.");
      return;
    }

    router.push("/write");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-[360px]">
        <div className="flex items-center gap-2 justify-center mb-8">
          <BookOpen size={20} className="text-leather" strokeWidth={1.75} />
          <span className="font-serif font-bold text-xl">my words till 18</span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-hairline rounded-xl p-7"
        >
          <h1 className="font-serif font-semibold text-lg mb-1">
            Sign in to write
          </h1>
          <p className="text-[13px] text-muted mb-6">
            Only you have an account here. Visitors never see this page&apos;s controls.
          </p>

          <label className="block text-[12.5px] font-medium mb-1.5" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus-ring w-full border border-hairline rounded-md px-3 py-2 text-sm mb-4 bg-transparent"
          />

          <label className="block text-[12.5px] font-medium mb-1.5" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus-ring w-full border border-hairline rounded-md px-3 py-2 text-sm mb-5 bg-transparent"
          />

          {error && (
            <p className="text-[13px] text-brick mb-4" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="focus-ring w-full bg-ink text-paper rounded-md py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-muted mt-5">
          <a href="/" className="underline hover:text-ink">
            ← back to reading
          </a>
        </p>
      </div>
    </div>
  );
}
