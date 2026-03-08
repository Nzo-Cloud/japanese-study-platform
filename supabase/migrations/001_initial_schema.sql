-- ============================================================
-- Japanese Study Platform — Initial Database Schema
-- Run this SQL in the Supabase SQL Editor to set up all tables.
-- ============================================================

-- Enable UUID extension (usually enabled by default in Supabase)
create extension if not exists "uuid-ossp";

-- ─── Users Table ─────────────────────────────────────────────
-- Extends Supabase auth.users with profile data
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  jlpt_level text default 'N5' check (jlpt_level in ('N5', 'N4', 'N3', 'N2', 'N1')),
  study_streak int default 0,
  total_quizzes_taken int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ─── Quiz Results Table ──────────────────────────────────────
create table public.quiz_results (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  quiz_type text not null check (quiz_type in ('kana', 'kanji', 'grammar', 'mixed', 'exam')),
  jlpt_level text not null check (jlpt_level in ('N5', 'N4', 'N3', 'N2', 'N1')),
  score int not null,
  total_questions int not null,
  accuracy float not null,
  taken_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ─── SRS Items Table ─────────────────────────────────────────
create table public.srs_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  item_type text not null check (item_type in ('kana', 'kanji', 'grammar')),
  item_id text not null,
  last_reviewed timestamp with time zone default timezone('utc'::text, now()) not null,
  next_review timestamp with time zone default timezone('utc'::text, now()) not null,
  interval_days int default 1,
  ease_factor float default 2.5,
  correct_streak int default 0,
  -- Ensure each user has at most one SRS entry per item
  unique (user_id, item_type, item_id)
);

-- ─── Row Level Security ──────────────────────────────────────

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.quiz_results enable row level security;
alter table public.srs_items enable row level security;

-- Users: users can read and update their own profile
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Quiz Results: users can read and insert their own results
create policy "Users can view own quiz results"
  on public.quiz_results for select
  using (auth.uid() = user_id);

create policy "Users can insert own quiz results"
  on public.quiz_results for insert
  with check (auth.uid() = user_id);

-- SRS Items: users can manage their own SRS items
create policy "Users can view own SRS items"
  on public.srs_items for select
  using (auth.uid() = user_id);

create policy "Users can insert own SRS items"
  on public.srs_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update own SRS items"
  on public.srs_items for update
  using (auth.uid() = user_id);

-- ─── Indexes ─────────────────────────────────────────────────

create index idx_quiz_results_user_id on public.quiz_results (user_id);
create index idx_quiz_results_taken_at on public.quiz_results (taken_at desc);
create index idx_srs_items_user_id on public.srs_items (user_id);
create index idx_srs_items_next_review on public.srs_items (next_review);
