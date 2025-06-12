/*
  # Create ideas table

  1. New Tables
    - `ideas`
      - `id` (uuid, primary key)
      - `event_id` (uuid) - related event
      - `user_id` (uuid) - idea creator
      - `title` (text) - idea title
      - `description` (text, optional) - idea description
      - `status` (text) - approval status
      - `created_at` (timestamptz) - creation time

  2. Security
    - Enable RLS on `ideas` table
    - Add policies for reading and creating ideas
*/

-- Create ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read ideas"
  ON ideas
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create ideas"
  ON ideas
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas"
  ON ideas
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all ideas"
  ON ideas
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );