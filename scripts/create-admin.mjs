import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve('.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function createAdmin() {
  const { data, error } = await supabase.auth.signUp({
    email: 'theweventsmarketing@gmail.com',
    password: 'Shiku_poetess1',
  });

  if (error) {
    console.error('Failed to create user:', error.message);
  } else {
    console.log('User created successfully:', data.user?.email);
    console.log('NOTE: If email confirmations are enabled in Supabase, you must click the link sent to this email before you can log in.');
  }
}

createAdmin();
