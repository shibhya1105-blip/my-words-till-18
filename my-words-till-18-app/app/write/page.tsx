import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { WriteClient } from "./WriteClient";
import { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function WritePage() {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();

  // Gatekeeping happens here, server-side, before any markup for the
  // editor is generated. A logged-out visitor who guesses this URL
  // gets redirected — they never receive the editor's HTML at all.
  if (!userData?.user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("published_date", { ascending: false });

  const posts = (data ?? []) as Post[];

  return <WriteClient initialPosts={posts} />;
}
