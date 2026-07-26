-- Run in Supabase Dashboard → SQL Editor if articles table already exists without hero_image
alter table public.articles add column if not exists hero_image text;
