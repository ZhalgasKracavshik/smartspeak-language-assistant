-- Migration script to update user_interests table
-- WARNING: This will reset user interest data

-- 1. Drop existing policies and table to avoid conflicts
drop policy if exists "Users can view their own interests" on user_interests;
drop policy if exists "Users can manage their own interests" on user_interests;
drop policy if exists "Users can insert/update their own interests" on user_interests;
drop table if exists user_interests cascade;

-- 2. Recreate user_interests with NEW schema (Composite Key)
create table user_interests (
    user_id uuid references auth.users(id) on delete cascade,
    topic text not null, -- 'business', 'medical', 'travel', 'technology', 'general', 'movies'
    score integer default 0,
    last_updated timestamptz default now(),
    primary key (user_id, topic)
);

-- 3. Re-enable RLS
alter table user_interests enable row level security;

-- 4. Recreate Policies
create policy "Users can view their own interests"
    on user_interests for select using (auth.uid() = user_id);

create policy "Users can insert/update their own interests"
    on user_interests for all using (auth.uid() = user_id);

-- 5. Create interaction_logs if not exists (usually safe to keep)
create table if not exists interaction_logs (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    action_type text not null,
    metadata jsonb,
    created_at timestamptz default now()
);

alter table interaction_logs enable row level security;

drop policy if exists "Users can insert their own logs" on interaction_logs;
drop policy if exists "Users can view their own logs" on interaction_logs;

create policy "Users can insert their own logs"
    on interaction_logs for insert with check (auth.uid() = user_id);

create policy "Users can view their own logs"
    on interaction_logs for select using (auth.uid() = user_id);
