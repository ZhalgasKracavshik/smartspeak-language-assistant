import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://corwafubbfnsrubiwbxd.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvcndhZnViYmZuc3J1Yml3YnhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MDE2MzcsImV4cCI6MjA3OTQ3NzYzN30.6guRzfgIzx5Abrcy31wIxqB6Ui-R2O7-Ei7pvG7tEwU';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing. Check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
