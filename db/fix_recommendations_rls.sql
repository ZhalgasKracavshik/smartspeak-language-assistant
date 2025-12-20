-- Fix missing RLS policies for daily_recommendations

-- Add INSERT policy
create policy "Users can insert own recommendations"
    on daily_recommendations for insert with check (auth.uid() = user_id);
    
-- Add UPDATE policy
create policy "Users can update own recommendations"
    on daily_recommendations for update using (auth.uid() = user_id);
    
-- Add DELETE policy
create policy "Users can delete own recommendations"
    on daily_recommendations for delete using (auth.uid() = user_id);
