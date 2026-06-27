import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const supabase = createClient();

  // Re-check auth here too. The /write page already gates rendering,
  // but this is the line that actually matters: even if someone
  // crafted a request by hand, Supabase's row-level security plus
  // this check both block it unless they're really logged in.
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json();
  const { title, genre, body: text, published_date } = body;

  if (!title || !genre || !published_date) {
    return NextResponse.json(
      { error: "Title, genre, and date are required." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({ title, genre, body: text ?? "", published_date })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post: data });
}
