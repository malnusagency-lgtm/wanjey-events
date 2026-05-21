-- Run this script in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  event_date date,
  event_type text,
  message text,
  status text DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Archived')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Allow anonymous inserts (for the contact form on your public website)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON leads
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users (admin) to read and update
CREATE POLICY "Allow authenticated read" ON leads
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON leads
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON leads
  FOR DELETE USING (auth.role() = 'authenticated');
