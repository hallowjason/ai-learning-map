-- AI Learning Map — initial schema
-- Apply via: Supabase Dashboard → SQL Editor → paste this entire file → Run

-- ============================================================
-- Table: users (the only table we need)
-- ============================================================
create table if not exists public.users (
  name           text primary key,
  current_zone   int  not null default 1,
  lotus_in_zone  int  not null default 0,
  completed_practices text[] not null default array[]::text[],
  created_at     timestamptz not null default now(),
  last_active    timestamptz not null default now()
);

create index if not exists users_zone_idx on public.users (current_zone);
create index if not exists users_active_idx on public.users (last_active desc);

-- ============================================================
-- Row Level Security — open access (teacher-supervised event)
-- ============================================================
alter table public.users enable row level security;

drop policy if exists "users_public_read"   on public.users;
drop policy if exists "users_public_insert" on public.users;
drop policy if exists "users_public_update" on public.users;

create policy "users_public_read"   on public.users for select using (true);
create policy "users_public_insert" on public.users for insert with check (true);
create policy "users_public_update" on public.users for update using (true) with check (true);

-- ============================================================
-- Realtime: broadcast row changes to all clients
-- ============================================================
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'users'
  ) then
    alter publication supabase_realtime add table public.users;
  end if;
end $$;
