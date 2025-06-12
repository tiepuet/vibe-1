/*
  # Create criteria and scoring tables

  1. New Tables
    - `criteria`
      - `id` (uuid, primary key)
      - `event_id` (uuid) - related event
      - `name` (text) - criteria name
      - `description` (text, optional) - criteria description
      - `weight` (integer) - criteria weight
      - `max_score` (integer) - maximum score
    
    - `judges`
      - `id` (uuid, primary key)
      - `event_id` (uuid) - related event
      - `user_id` (uuid) - judge user
    
    - `judge_scores`
      - `id` (uuid, primary key)
      - `project_id` (uuid) - scored project
      - `judge_id` (uuid) - scoring judge
      - `submitted_at` (timestamptz) - scoring time
      - `total_score` (numeric) - total calculated score
    
    - `criteria_scores`
      - `id` (uuid, primary key)
      - `judge_score_id` (uuid) - related judge score
      - `criteria_id` (uuid) - scored criteria
      - `score` (numeric) - criteria score

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Create criteria table
CREATE TABLE IF NOT EXISTS criteria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  weight integer NOT NULL DEFAULT 1 CHECK (weight >= 0),
  max_score integer NOT NULL DEFAULT 10 CHECK (max_score > 0)
);

-- Create judges table
CREATE TABLE IF NOT EXISTS judges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(event_id, user_id)
);

-- Create judge_scores table
CREATE TABLE IF NOT EXISTS judge_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  judge_id uuid REFERENCES judges(id) ON DELETE CASCADE,
  submitted_at timestamptz DEFAULT now(),
  total_score numeric DEFAULT 0,
  UNIQUE(project_id, judge_id)
);

-- Create criteria_scores table
CREATE TABLE IF NOT EXISTS criteria_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_score_id uuid REFERENCES judge_scores(id) ON DELETE CASCADE,
  criteria_id uuid REFERENCES criteria(id) ON DELETE CASCADE,
  score numeric CHECK (score >= 0),
  UNIQUE(judge_score_id, criteria_id)
);

-- Enable RLS
ALTER TABLE criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE judge_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE criteria_scores ENABLE ROW LEVEL SECURITY;

-- Criteria policies
CREATE POLICY "Anyone can read criteria"
  ON criteria
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage criteria"
  ON criteria
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Judges policies
CREATE POLICY "Anyone can read judges"
  ON judges
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage judges"
  ON judges
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Judge scores policies
CREATE POLICY "Anyone can read judge scores"
  ON judge_scores
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Judges can manage their scores"
  ON judge_scores
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM judges 
      WHERE judges.id = judge_scores.judge_id 
      AND judges.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all judge scores"
  ON judge_scores
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Criteria scores policies
CREATE POLICY "Anyone can read criteria scores"
  ON criteria_scores
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Judges can manage their criteria scores"
  ON criteria_scores
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM judge_scores js
      JOIN judges j ON j.id = js.judge_id
      WHERE js.id = criteria_scores.judge_score_id 
      AND j.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all criteria scores"
  ON criteria_scores
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );