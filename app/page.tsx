import { createClient } from "@/lib/supabase-server";
import { ReadingRoom } from "@/components/ReadingRoom";
import { Post } from "@/lib/types";

// Always fetch fresh posts rather than caching a stale build.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createClient();

  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("published_date", { ascending: false });

  const posts = (data ?? []) as Post[];

  // isWriter is hardcoded false here — this page never renders edit
  // controls, regardless of who is logged in elsewhere. Visitors get
  // a read-only HTML response with no write UI in it at all.
  return <ReadingRoom posts={posts} isWriter={false} />;
}
