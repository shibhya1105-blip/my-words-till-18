# my words till 18

A small personal publishing site. Anyone with the link can read what's
published. Only you can write, edit, or delete — by signing in with an
email and password that only you know.

There is no way for a visitor to even see a "write" button. The page
they receive literally does not contain that code unless the server
has already confirmed it's you.

---

## How it's built (you don't need to understand this to use it)

- **Next.js** — the framework that runs the site
- **Supabase** — a free database that stores your posts, plus handles
  login/password security for you (you never touch raw passwords)
- **Vercel** — free hosting that runs the site and gives you a live URL

---

## Part 1 — Create your database (Supabase)

1. Go to **supabase.com** → sign up free → "New project"
2. Pick any project name (e.g. "my-words-till-18") and a strong
   database password — save that password somewhere, you won't need
   it day-to-day but you might later
3. Wait ~2 minutes for the project to finish setting up
4. In the left sidebar, click **SQL Editor** → **New query**
5. Open the file `supabase-schema.sql` (included in this folder),
   copy everything in it, paste it into the SQL editor, click **Run**
   - This creates the table that holds your posts, and locks it so
     only a signed-in session can write to it. Reading stays public.
6. In the left sidebar, click **Authentication** → **Providers** →
   confirm **Email** is enabled (it is by default)
7. Still in Authentication, go to **Users** → **Add user** → **Create
   new user**. Enter the email and password *you* want to log in
   with. This is the only account that will ever exist on this site.
   - Tip: under "Auto Confirm User," make sure it's checked, so you
     don't need to click a confirmation email before your first login.
8. Click **Project Settings** (gear icon) → **API**. You'll see:
   - **Project URL**
   - **anon public** key
   Keep this tab open — you need both in the next part.

## Part 2 — Connect the code to your database

1. Open the file `.env.local.example` in this folder
2. Make a copy of it named exactly `.env.local` (same folder)
3. Paste in your Project URL and anon public key from Supabase, so it
   looks like:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://abcxyz.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOиJIUzI1NiIs...
   ```
4. Save the file

`.env.local` is already in `.gitignore` — it will never get uploaded
anywhere public, which is exactly what you want since the anon key,
while safe to expose in a deployed site, shouldn't be casually shared.

## Part 3 — Try it on your own computer (optional but recommended)

If you have Node.js installed:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`. You should see the reading view.
Go to `http://localhost:3000/login` and sign in with the email and
password you created in Supabase step 7. You'll land on `/write`.

## Part 4 — Put it on the internet (Vercel)

1. Go to **vercel.com** → sign up free (you can sign up with GitHub,
   or just an email)
2. Easiest path if you're not using GitHub: install the Vercel CLI
   instead —
   ```bash
   npm install -g vercel
   vercel
   ```
   Follow the prompts (link to a new project, accept defaults). When
   it asks about environment variables, or once the project exists,
   go to your new project on vercel.com → **Settings** →
   **Environment Variables** → add the same two values from your
   `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

   Then run `vercel --prod` to deploy with those variables active.

3. Alternative path (no command line): push this folder to a new
   GitHub repository, then on vercel.com choose **Add New → Project**
   → import that repository. Vercel will ask for the same two
   environment variables during setup — paste them in from your
   `.env.local`. Click **Deploy**.

4. Vercel gives you a live URL like `my-words-till-18.vercel.app`.
   That's your site. Share the homepage link with anyone — `/login`
   and `/write` are yours alone.

## Writing once it's live

Go to `yoursite.vercel.app/login`, sign in, and you'll see the same
reading view but with a "New piece" button and Edit/Delete controls
on each piece. Everything you publish there saves straight to your
database and appears on the public homepage immediately — no
redeploying, no touching code.

## If you ever want a custom domain

Vercel → your project → **Settings** → **Domains** → add a domain you
own (bought from anywhere — Namecheap, Google Domains, etc.) and
follow the DNS instructions Vercel shows you.

## Adding new genres later

Open `lib/types.ts`, find the `GENRES` array near the top, and add a
new entry with an id, label, and color. You'll also need to update the
`check (genre in (...))` line in `supabase-schema.sql` and run that
updated line in Supabase's SQL editor — ask Claude to help if you'd
like a hand with that when the time comes.
