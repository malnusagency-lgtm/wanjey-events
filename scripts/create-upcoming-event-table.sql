-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS upcoming_event (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL DEFAULT 'BIG VOICES FEST',
  subtitle text DEFAULT 'Season 2: Millennial Edition',
  event_date text DEFAULT '6TH JUNE',
  save_the_date_text text DEFAULT 'SAVE THE DATE',
  cta_text text DEFAULT 'Join the Movement',
  is_active boolean DEFAULT true,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default event data
INSERT INTO upcoming_event (title, subtitle, event_date, save_the_date_text, cta_text)
VALUES ('BIG VOICES FEST', 'Season 2: Millennial Edition', '6TH JUNE', 'SAVE THE DATE', 'Join the Movement')
ON CONFLICT DO NOTHING;

-- Allow public reads (for the live website)
ALTER TABLE upcoming_event ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON upcoming_event
  FOR SELECT USING (true);

-- Only authenticated admins can update
CREATE POLICY "Allow authenticated update" ON upcoming_event
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert" ON upcoming_event
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
