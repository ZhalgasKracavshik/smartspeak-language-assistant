-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. Modules Table
create table if not exists public.modules (
  id bigint primary key, -- Keeping manual ID to match existing 1-9 structure
  title text not null,
  description text,
  grade_level integer default 9,
  color_theme text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.modules enable row level security;

-- Policies for modules (Drop first to avoid "policy already exists" error)
drop policy if exists "Modules are viewable by everyone." on public.modules;
create policy "Modules are viewable by everyone." on public.modules for select using (true);

drop policy if exists "Authenticated users can insert modules." on public.modules;
create policy "Authenticated users can insert modules." on public.modules for insert with check (auth.role() = 'authenticated');


-- 2. Grammar Topics Table
create table if not exists public.grammar_topics (
  id uuid default uuid_generate_v4() primary key,
  module_id bigint references public.modules(id) on delete cascade,
  title text not null,
  description text,
  rules jsonb default '[]'::jsonb, -- Array of strings
  examples jsonb default '[]'::jsonb, -- Array of strings
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.grammar_topics enable row level security;

drop policy if exists "Grammar topics are viewable by everyone." on public.grammar_topics;
create policy "Grammar topics are viewable by everyone." on public.grammar_topics for select using (true);


-- 3. Vocabulary Table
create table if not exists public.vocabulary (
  id uuid default uuid_generate_v4() primary key,
  word text not null,
  translation_ru text, -- Simplified from nested JSON for easier querying
  translation_kz text,
  transcription text,
  part_of_speech text,
  level text, -- 'A1', 'B1' etc
  category text,
  example_sentence text, -- Primary example
  example_translation_ru text,
  example_translation_kz text,
  module_id bigint references public.modules(id) on delete set null, -- Null if it's a general dictionary word
  audio_url text, -- Future proofing
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.vocabulary enable row level security;

drop policy if exists "Vocabulary is viewable by everyone." on public.vocabulary;
create policy "Vocabulary is viewable by everyone." on public.vocabulary for select using (true);

drop policy if exists "Authenticated users can insert vocabulary." on public.vocabulary;
create policy "Authenticated users can insert vocabulary." on public.vocabulary for insert with check (auth.role() = 'authenticated');

-- Indexes for performance
create index if not exists vocabulary_word_idx on public.vocabulary(word);
create index if not exists vocabulary_module_id_idx on public.vocabulary(module_id);
create index if not exists grammar_module_id_idx on public.grammar_topics(module_id);
