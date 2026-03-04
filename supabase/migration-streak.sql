-- Add streak and IQ points columns to users table
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS checkin_streak integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_checkin_at timestamptz,
  ADD COLUMN IF NOT EXISTS iq_points integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS longest_streak integer DEFAULT 0;
