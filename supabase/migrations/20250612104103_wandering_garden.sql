/*
  # Create projects table

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `event_id` (uuid) - related event
      - `team_id` (uuid) - related team
      - `idea_id` (uuid) - related idea
      - `scheduled_time` (timestamptz) - presentation time
      - `code_link` (text, optional) - source code link
      - `slide_link` (text, optional) - presentation slides link
      - `demo_link` (text, optional) - demo link
      - `submitted_at` (timestamptz, optional) - submission time

  2. Security
    - Enable RLS on `projects` table
    - Add appropriate policies
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  scheduled_time timestamptz NOT NULL,
  code_link text,
  slide_link text,
  demo_link text,
  submitted_at timestamptz
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Team members can update their projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = projects.team_id 
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );