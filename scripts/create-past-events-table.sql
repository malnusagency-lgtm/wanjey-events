-- Run this in your Supabase SQL Editor to set up the past_events table

CREATE TABLE IF NOT EXISTS past_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  category text DEFAULT 'Event',
  description text,
  image_url text,
  highlight_stat text,
  event_month_year text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE past_events ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON past_events
  FOR SELECT USING (true);

-- Allow authenticated admin users to insert, update, and delete
CREATE POLICY "Allow authenticated insert" ON past_events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON past_events
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON past_events
  FOR DELETE USING (auth.role() = 'authenticated');
