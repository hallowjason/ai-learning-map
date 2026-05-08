-- Migration 002 — add `display_name` column for user-editable display label.
-- The `name` PK stays as the canonical identifier (used for login + Realtime
-- key); `display_name` is an optional override shown in the UI.
-- Apply via: Supabase Dashboard → SQL Editor → paste this file → Run

alter table public.users
  add column if not exists display_name text;

-- Optional helpful index for case-insensitive search by display name
create index if not exists users_display_name_idx
  on public.users (lower(coalesce(display_name, name)));
