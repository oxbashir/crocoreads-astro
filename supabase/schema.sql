-- CrocoReads Supabase schema
-- Run in Supabase Dashboard → SQL Editor

create extension if not exists "pgcrypto";

-- Profiles linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'author' check (role in ('admin', 'author')),
  created_at timestamptz not null default now()
);

-- Articles
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  content text not null default '',
  author_id uuid references public.profiles (id) on delete set null,
  author_name text not null default 'Osama',
  tags text[] not null default '{}',
  draft boolean not null default false,
  featured boolean not null default false,
  pub_date timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists articles_slug_idx on public.articles (slug);
create index if not exists articles_pub_date_idx on public.articles (pub_date desc);
create index if not exists articles_draft_idx on public.articles (draft);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    'author'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists articles_updated_at on public.articles;
create trigger articles_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.articles enable row level security;

-- Profiles: users read/update own profile
create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Articles: public reads published
create policy "Public can read published articles"
  on public.articles for select
  to anon
  using (draft = false);

-- Authenticated reads all (admin list includes drafts)
create policy "Authenticated can read all articles"
  on public.articles for select
  to authenticated
  using (true);

create policy "Authenticated can insert articles"
  on public.articles for insert
  to authenticated
  with check (true);

create policy "Authenticated can update articles"
  on public.articles for update
  to authenticated
  using (true);

create policy "Authenticated can delete articles"
  on public.articles for delete
  to authenticated
  using (true);

-- After first signup, promote yourself to admin in SQL Editor:
-- update public.profiles set role = 'admin' where email = 'your@email.com';
