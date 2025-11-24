-- Add missing columns to profiles table if they don't exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'level') then
        alter table profiles add column level text default 'A1';
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'xp') then
        alter table profiles add column xp integer default 0;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'interests') then
        alter table profiles add column interests text[] default '{}';
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'progress') then
        alter table profiles add column progress jsonb default '{}'::jsonb;
    end if;
end $$;

-- Create friends table
create table if not exists friends (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  friend_id uuid references auth.users(id) on delete cascade not null,
  status text check (status in ('pending', 'accepted', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, friend_id)
);

-- Enable RLS
alter table friends enable row level security;

-- Policies for friends
drop policy if exists "Users can view their own friends" on friends;
create policy "Users can view their own friends"
  on friends for select
  using (auth.uid() = user_id or auth.uid() = friend_id);

drop policy if exists "Users can insert friend requests" on friends;
create policy "Users can insert friend requests"
  on friends for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own friend requests" on friends;
create policy "Users can update their own friend requests"
  on friends for update
  using (auth.uid() = user_id or auth.uid() = friend_id);

-- Create a view for leaderboard
drop view if exists leaderboard;
create or replace view leaderboard as
select 
  p.id as user_id,
  p.full_name,
  p.level,
  p.xp,
  p.avatar_url,
  row_number() over (order by p.xp desc) as rank
from profiles p
order by p.xp desc
limit 100;
