-- Run this SQL in your Supabase SQL Editor to add the missing columns to the live tables

-- 1. Upgrade upcoming_event table
ALTER TABLE upcoming_event ADD COLUMN IF NOT EXISTS date_iso text;
ALTER TABLE upcoming_event ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE upcoming_event ADD COLUMN IF NOT EXISTS booking_link text;

-- 2. Upgrade past_events table
ALTER TABLE past_events ADD COLUMN IF NOT EXISTS cta_link text;
ALTER TABLE past_events ADD COLUMN IF NOT EXISTS cta_text text;
