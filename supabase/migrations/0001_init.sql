-- lumatale schema · 0001_init
-- Run this in Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent: safe to re-run.

create table if not exists novels (
  id           bigint generated always as identity primary key,
  slug         text not null unique,
  title        text not null,
  author       text not null,
  synopsis     text not null,
  cover_url    text,
  scene_count  int not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists scenes (
  id          bigint generated always as identity primary key,
  novel_id    bigint not null references novels(id) on delete cascade,
  "order"     int not null,
  title       text not null,
  body        text not null,
  created_at  timestamptz not null default now(),
  unique (novel_id, "order")
);

create index if not exists scenes_novel_order_idx on scenes(novel_id, "order");

-- RLS: anon may SELECT, never write.
alter table novels enable row level security;
alter table scenes enable row level security;

drop policy if exists "novels_select_public" on novels;
create policy "novels_select_public" on novels
  for select using (true);

drop policy if exists "scenes_select_public" on scenes;
create policy "scenes_select_public" on scenes
  for select using (true);
