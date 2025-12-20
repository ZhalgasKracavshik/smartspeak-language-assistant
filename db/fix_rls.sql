-- Fix RLS policies for connected_accounts
alter table connected_accounts enable row level security;

-- Drop ALL existing policies to avoid conflicts
drop policy if exists "Users can insert/update their own connected accounts" on connected_accounts;
drop policy if exists "Users can view their own connected accounts" on connected_accounts;
drop policy if exists "Users can insert their own connected accounts" on connected_accounts;
drop policy if exists "Users can update their own connected accounts" on connected_accounts;
drop policy if exists "Users can delete their own connected accounts" on connected_accounts;

-- Re-create granular policies
create policy "Users can view their own connected accounts" 
    on connected_accounts for select using (auth.uid() = user_id);

create policy "Users can insert their own connected accounts" 
    on connected_accounts for insert with check (auth.uid() = user_id);

create policy "Users can update their own connected accounts" 
    on connected_accounts for update using (auth.uid() = user_id);

create policy "Users can delete their own connected accounts" 
    on connected_accounts for delete using (auth.uid() = user_id);
