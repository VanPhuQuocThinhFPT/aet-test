/*
  # DevMatch Database Schema

  ## Overview
  Creates the core tables for the DevMatch platform - a developer matching system.

  ## New Tables

  ### profiles
  - Stores developer profile information
  - Fields: id, user_id, name, avatar_url, bio, location, experience_level, github_url, linkedin_url, looking_for, created_at, updated_at

  ### skills
  - Stores available skills/technologies
  - Fields: id, name, category, color

  ### profile_skills
  - Join table linking profiles to skills
  - Fields: id, profile_id, skill_id

  ### projects
  - Project ideas posted by developers
  - Fields: id, profile_id, title, description, status, tech_stack, team_size, created_at

  ### matches
  - Tracks swipe actions and matches between developers
  - Fields: id, swiper_id, swiped_id, direction, matched_at, created_at

  ### messages
  - Chat messages between matched developers
  - Fields: id, match_id, sender_id, content, created_at

  ## Security
  - RLS enabled on all tables
  - Authenticated users can read public profiles
  - Users can only modify their own data
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  avatar_url text DEFAULT '',
  bio text DEFAULT '',
  location text DEFAULT '',
  experience_level text DEFAULT 'junior' CHECK (experience_level IN ('junior', 'mid', 'senior', 'lead')),
  github_url text DEFAULT '',
  linkedin_url text DEFAULT '',
  looking_for text DEFAULT 'teammate' CHECK (looking_for IN ('teammate', 'mentor', 'mentee', 'collaborator')),
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'other',
  color text NOT NULL DEFAULT '#6b7280'
);

CREATE TABLE IF NOT EXISTS profile_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE(profile_id, skill_id)
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  status text DEFAULT 'idea' CHECK (status IN ('idea', 'in_progress', 'completed')),
  tech_stack text[] DEFAULT '{}',
  team_size int DEFAULT 2,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  swiped_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  direction text NOT NULL CHECK (direction IN ('left', 'right')),
  is_match boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(swiper_id, swiped_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read skills"
  ON skills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can read profile skills"
  ON profile_skills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own profile skills"
  ON profile_skills FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = profile_id AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can read projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = profile_id AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = profile_id AND profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = profile_id AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read own matches"
  ON matches FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = swiper_id AND profiles.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = swiped_id AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own swipes"
  ON matches FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = swiper_id AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read match messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches m
      JOIN profiles p ON (p.id = m.swiper_id OR p.id = m.swiped_id)
      WHERE m.id = match_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = sender_id AND profiles.user_id = auth.uid()
    )
  );

INSERT INTO skills (name, category, color) VALUES
  ('React', 'frontend', '#61dafb'),
  ('Vue.js', 'frontend', '#42b883'),
  ('Angular', 'frontend', '#dd0031'),
  ('TypeScript', 'language', '#3178c6'),
  ('JavaScript', 'language', '#f7df1e'),
  ('Python', 'language', '#3776ab'),
  ('Rust', 'language', '#ce422b'),
  ('Go', 'language', '#00add8'),
  ('Java', 'language', '#ed8b00'),
  ('Node.js', 'backend', '#339933'),
  ('Django', 'backend', '#092e20'),
  ('FastAPI', 'backend', '#009688'),
  ('PostgreSQL', 'database', '#336791'),
  ('MongoDB', 'database', '#47a248'),
  ('Redis', 'database', '#dc382d'),
  ('Docker', 'devops', '#2496ed'),
  ('Kubernetes', 'devops', '#326ce5'),
  ('AWS', 'cloud', '#ff9900'),
  ('GCP', 'cloud', '#4285f4'),
  ('Figma', 'design', '#f24e1e'),
  ('TailwindCSS', 'frontend', '#06b6d4'),
  ('GraphQL', 'backend', '#e10098'),
  ('Next.js', 'frontend', '#000000'),
  ('Svelte', 'frontend', '#ff3e00'),
  ('Swift', 'mobile', '#f05138'),
  ('Kotlin', 'mobile', '#7f52ff'),
  ('React Native', 'mobile', '#61dafb'),
  ('Machine Learning', 'ai', '#ff6f00'),
  ('LLMs', 'ai', '#10a37f'),
  ('Web3', 'blockchain', '#f16822')
ON CONFLICT (name) DO NOTHING;
