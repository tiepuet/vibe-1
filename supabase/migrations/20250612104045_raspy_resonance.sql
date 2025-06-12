/*
  # Create events table

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `name` (text) - event name
      - `slogan` (text, optional) - event slogan
      - `description` (text, optional) - event description
      - `image_url` (text, optional) - event image
      - `start_time` (timestamptz) - event start time
      - `end_time` (timestamptz) - event end time
      - `status` (text) - event status (draft/open/closed)
      - `created_by` (uuid) - creator user id
      - `created_at` (timestamptz) - creation time

  2. Security
    - Enable RLS on `events` table
    - Add policies for reading events
    - Add policies for admin management
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slogan text,
  description text,
  image_url text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed')),
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read events"
  ON events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage events"
  ON events
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );