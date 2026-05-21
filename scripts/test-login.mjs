import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve('.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'theweventsmarketing@gmail.com',
    password: 'Shiku_poetess1',
  });

  if (error) {
    console.error('LOGIN ERROR:', error.message);
  } else {
    console.log('LOGIN SUCCESS! User is authenticated.');
    console.log('User:', data.user?.email);
  }
}

testLogin();
