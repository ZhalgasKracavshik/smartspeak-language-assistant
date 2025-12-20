-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. Connected Accounts (for storing OAuth tokens)
create table if not exists connected_accounts (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    provider text not null, -- 'youtube', 'tiktok', 'spotify'
    access_token text,
    refresh_token text,
    expires_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(user_id, provider)
);

-- 2. User Interests (analyzed from connected accounts)
create table if not exists user_interests (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    topic text not null,
    weight numeric default 1.0,
    source text, -- 'youtube', 'manual', etc.
    created_at timestamptz default now()
);

-- 3. Daily Recommendations
create table if not exists daily_recommendations (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    content_url text not null,
    title text,
    thumbnail_url text,
    type text default 'video',
    platform text default 'youtube',
    reason text,
    created_at timestamptz default now(),
    date date default current_date
);

-- RLS Policies
alter table connected_accounts enable row level security;
create policy "Users can view their own connected accounts" 
    on connected_accounts for select using (auth.uid() = user_id);
create policy "Users can insert/update their own connected accounts" 
    on connected_accounts for all using (auth.uid() = user_id);

alter table user_interests enable row level security;
create policy "Users can view their own interests" 
    on user_interests for select using (auth.uid() = user_id);
create policy "Users can manage their own interests" 
    on user_interests for all using (auth.uid() = user_id);

alter table daily_recommendations enable row level security;
create policy "Users can view their own recommendations" 
    on daily_recommendations for select using (auth.uid() = user_id);
