-- ==========================================
-- SMARTSPEAK SECURITY POLICIES (RLS)
-- ==========================================

-- 0. PRE-REQUISITES: ENSURE ALL REQUIRED TABLES AND COLUMNS EXIST

-- Add role column to profiles if it doesn't exist
alter table profiles 
add column if not exists role text check (role in ('user', 'admin', 'teacher')) default 'user';

-- Create quests table if it doesn't exist
create table if not exists quests (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  xp_reward integer default 10,
  target_count integer default 1,
  type text check (type in ('vocabulary', 'grammar', 'speech', 'dialogue', 'mixed')) default 'mixed',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1. PROFILES & ROLES
-- Drop existing policies to avoid conflicts
-- Drop existing policies to avoid conflicts
drop policy if exists "Public profiles are viewable by everyone" on profiles;
drop policy if exists "Users can update own profile" on profiles;

-- Allow public read of profiles (username, avatar, level)
create policy "Public profiles are viewable by everyone" 
on profiles for select using (true);

-- Allow users to update their own profile (EXCEPT role, which is protected by trigger)
create policy "Users can update own profile" 
on profiles for update using (auth.uid() = id);

-- 2. VOCABULARY (Public Read, Admin Write)
alter table vocabulary enable row level security;

drop policy if exists "Vocabulary is viewable by everyone" on vocabulary;
drop policy if exists "Admins can insert vocabulary" on vocabulary;
drop policy if exists "Admins can update vocabulary" on vocabulary;
drop policy if exists "Admins can delete vocabulary" on vocabulary;

create policy "Vocabulary is viewable by everyone" 
on vocabulary for select using (true);

create policy "Admins can insert vocabulary" 
on vocabulary for insert 
with check (
  auth.uid() in (select id from profiles where role = 'admin')
);

create policy "Admins can update vocabulary" 
on vocabulary for update 
using (
  auth.uid() in (select id from profiles where role = 'admin')
);

create policy "Admins can delete vocabulary" 
on vocabulary for delete 
using (
  auth.uid() in (select id from profiles where role = 'admin')
);

-- 3. MEDIA CONTENT (Public Read, Admin Write)
alter table media_content enable row level security;

drop policy if exists "Media content is viewable by everyone" on media_content;
drop policy if exists "Admins can manage media content" on media_content;

create policy "Media content is viewable by everyone" 
on media_content for select using (true);

create policy "Admins can manage media content" 
on media_content for all 
using (
  auth.uid() in (select id from profiles where role = 'admin')
);

-- 4. QUESTS (Public Read, Admin Write)
alter table quests enable row level security;

drop policy if exists "Quests are viewable by everyone" on quests;
drop policy if exists "Admins can manage quests" on quests;

create policy "Quests are viewable by everyone" 
on quests for select using (true);

create policy "Admins can manage quests" 
on quests for all 
using (
  auth.uid() in (select id from profiles where role = 'admin')
);

-- 5. STORAGE OBJECTS (Optional - Un-comment if needed)
-- drop policy if exists "Public Access" on storage.objects;
-- drop policy if exists "Admin Upload" on storage.objects;
-- create policy "Public Access" on storage.objects for select using ( bucket_id = 'media' );
-- create policy "Admin Upload" on storage.objects for insert with check ( bucket_id = 'media' and auth.uid() in (select id from profiles where role = 'admin') );
