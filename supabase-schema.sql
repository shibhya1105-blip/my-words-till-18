-- ---------------------------------------------------------------------------
-- Run this once in Supabase: Project → SQL Editor → New query → paste → Run
-- ---------------------------------------------------------------------------

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  genre text not null check (genre in ('essay', 'fiction', 'poetry')),
  body text not null default '',
  published_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security: this is what makes "only me can write" actually true,
-- enforced by the database itself rather than by the app's UI.
alter table posts enable row level security;

-- Anyone (including logged-out visitors) can read posts.
create policy "Public can read posts"
  on posts for select
  using (true);

-- Only a logged-in (authenticated) user can create posts.
create policy "Authenticated can insert posts"
  on posts for insert
  to authenticated
  with check (true);

-- Only a logged-in user can edit posts.
create policy "Authenticated can update posts"
  on posts for update
  to authenticated
  using (true);

-- Only a logged-in user can delete posts.
create policy "Authenticated can delete posts"
  on posts for delete
  to authenticated
  using (true);

-- Keep updated_at current automatically on every edit.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on posts;
create trigger posts_set_updated_at
  before update on posts
  for each row
  execute function set_updated_at();
