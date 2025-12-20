-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. User Interests Table (Stores the weighted score for each topic)
create table if not exists user_interests (
    user_id uuid references auth.users(id) on delete cascade,
    topic text not null, -- 'business', 'medical', 'travel', 'technology', 'general', 'movies'
    score integer default 0,
    last_updated timestamptz default now(),
    primary key (user_id, topic)
);

-- 2. Interaction Logs (History of user actions for analytics)
create table if not exists interaction_logs (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    action_type text not null, -- 'save_word', 'start_dialogue', 'complete_lesson', 'watch_video'
    metadata jsonb, -- Stores details like { word: 'patient', category: 'medical' }
    created_at timestamptz default now()
);

-- Enable RLS
alter table user_interests enable row level security;
alter table interaction_logs enable row level security;

-- Policies for user_interests
create policy "Users can view their own interests"
    on user_interests for select using (auth.uid() = user_id);

create policy "Users can insert/update their own interests"
    on user_interests for all using (auth.uid() = user_id);

-- Policies for interaction_logs
create policy "Users can insert their own logs"
    on interaction_logs for insert with check (auth.uid() = user_id);

create policy "Users can view their own logs"
    on interaction_logs for select using (auth.uid() = user_id);
