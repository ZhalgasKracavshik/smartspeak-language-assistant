-- Create media_content table for n8n and dashboard content
create table if not exists public.media_content (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  type text default 'video', -- video, cartoon, song, story
  difficulty text default 'intermediate', -- A1, A2, etc or beginner/intermediate
  category text,
  cloudinary_url text, -- Stores YouTube URL or Cloudinary ID
  cloudinary_id text,
  thumbnail_url text,
  duration integer, -- in seconds
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.media_content enable row level security;

-- Policies
drop policy if exists "Media content is viewable by everyone." on public.media_content;
create policy "Media content is viewable by everyone." on public.media_content for select using (true);

drop policy if exists "Authenticated users can insert media content." on public.media_content;
create policy "Authenticated users can insert media content." on public.media_content for insert with check (auth.role() = 'authenticated' OR auth.role() = 'anon'); 
-- Note: 'anon' allowed for webhook if we use service role key, but usually service role bypasses RLS. 
-- For now, allowing anon insert for testing if needed, or rely on service role.

-- Index
create index if not exists media_content_category_idx on public.media_content(category);
create index if not exists media_content_type_idx on public.media_content(type);
