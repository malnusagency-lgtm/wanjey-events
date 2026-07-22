-- 1. Add event_phase column to past_events table
ALTER TABLE past_events 
ADD COLUMN IF NOT EXISTS event_phase text DEFAULT 'actual';

-- Update existing records to 'actual'
UPDATE past_events SET event_phase = 'actual' WHERE event_phase IS NULL;

-- 2. Create Analytics Events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL,
  path text NOT NULL,
  section text,
  visitor_id text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and policies for analytics_events
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow public inserts for analytics events (anyone visiting the site can trigger this)
CREATE POLICY "Enable insert for public" ON analytics_events
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated users (admins) can view analytics events
CREATE POLICY "Enable read for authenticated users" ON analytics_events
  FOR SELECT
  TO authenticated
  USING (true);
