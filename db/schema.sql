-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  avatar_url text,
  level integer default 1,
  xp integer default 0,
  streak integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Vocabulary Progress
create table vocabulary_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  word_id integer not null,
  status text check (status in ('new', 'learning', 'mastered')) default 'new',
  next_review timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table vocabulary_progress enable row level security;

create policy "Users can view own vocabulary progress." on vocabulary_progress
  for select using (auth.uid() = user_id);

create policy "Users can update own vocabulary progress." on vocabulary_progress
  for all using (auth.uid() = user_id);

-- Dialogue Progress
create table dialogue_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  dialogue_id text not null,
  score integer default 0,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table dialogue_progress enable row level security;

create policy "Users can view own dialogue progress." on dialogue_progress
  for select using (auth.uid() = user_id);

create policy "Users can insert own dialogue progress." on dialogue_progress
  for insert with check (auth.uid() = user_id);

-- User Achievements
create table user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  achievement_id text not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table user_achievements enable row level security;

create policy "Users can view own achievements." on user_achievements
  for select using (auth.uid() = user_id);

-- Daily Quests
create table daily_quests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  quest_id text not null,
  progress integer default 0,
  is_completed boolean default false,
  date date default CURRENT_DATE
);

alter table daily_quests enable row level security;

create policy "Users can view own daily quests." on daily_quests
  for select using (auth.uid() = user_id);

  for all using (auth.uid() = user_id);

-- Quests Definitions (Admin Managed)
create table quests (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  xp_reward integer default 10,
  target_count integer default 1,
  type text check (type in ('vocabulary', 'grammar', 'speech', 'dialogue', 'mixed')) default 'mixed',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Quests
alter table quests enable row level security;
create policy "Everyone can view quests." on quests for select using (true);
-- Admin only policy will be handled by generic admin policy or specific one
-- create policy "Admins can manage quests" on quests for all using (auth.uid() in (select id from profiles where role = 'admin'));

-- ROLES & ADMIN ACCESS
-- Add role to profiles if not exists (handled via migration in prod, but documented here)
-- alter table profiles add column if not exists role text check (role in ('user', 'admin', 'teacher')) default 'user';

-- Create Admin Policies (Generic example, apply to specific content tables as needed)
-- Example: Allow admins to insert/update content
-- create policy "Admins can do everything on content" on some_content_table
--   for all using (
--     auth.uid() in (select id from profiles where role = 'admin')
--   );
