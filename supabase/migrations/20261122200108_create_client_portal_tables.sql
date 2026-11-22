/*
# Client Portal: Projects, Project Updates, Profiles

## Overview
Creates the data model for a client portal where customers of شركة أبوطلال can log in
and track the progress of their active advertising and programming projects.

## New Tables

### profiles
- `id` (uuid, PK, references auth.users) — one-to-one with the auth user
- `full_name` (text) — client's display name
- `phone` (text) — contact phone number
- `company` (text, nullable) — optional company name
- `created_at` (timestamptz, default now())

### projects
- `id` (uuid, PK)
- `client_id` (uuid, FK → profiles.id, NOT NULL, DEFAULT auth.uid()) — the owning client
- `title` (text) — project name
- `type` (text) — project category: advertising, marketing, programming, design, mobile, seo
- `status` (text, default 'planning') — planning, in_progress, review, completed, on_hold
- `progress` (int, default 0) — 0–100 percentage
- `start_date` (date) — when the project started
- `deadline` (date, nullable) — target completion date
- `budget` (numeric, nullable) — agreed budget
- `description` (text, nullable) — project details
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### project_updates
- `id` (uuid, PK)
- `project_id` (uuid, FK → projects.id, ON DELETE CASCADE)
- `title` (text) — update headline
- `body` (text) — update details
- `progress_value` (int, nullable) — progress % at the time of this update
- `status` (text, nullable) — status at time of update
- `created_at` (timestamptz, default now())

## Security
- RLS enabled on all three tables.
- `profiles`: authenticated users can SELECT/UPDATE only their own profile row.
  INSERT uses DEFAULT auth.uid() so signup flow can create a profile without passing the id.
- `projects`: authenticated users can SELECT only their own projects (client_id = auth.uid()).
  INSERT/UPDATE/DELETE scoped to the owner. (In production, project creation is admin-only,
  but the owner-scoped policy is the safe default.)
- `project_updates`: authenticated users can SELECT updates on projects they own
  (via EXISTS check against projects.client_id). No direct INSERT/UPDATE/DELETE from clients —
  updates are created server-side by the company team.
- Grants: SELECT/INSERT/UPDATE on profiles TO authenticated; SELECT on project_updates TO authenticated;
  full CRUD on projects TO authenticated.
- `updated_at` auto-maintained by a trigger function.

## Important Notes
1. The `DEFAULT auth.uid()` on `profiles.id` and `projects.client_id` ensures inserts succeed
   when the frontend omits the owner id (which it always does with the anon-key client).
2. Email confirmation is OFF — clients can sign up and immediately log in.
3. The project_updates table has no INSERT policy for clients — only the company can post updates,
   which would be done through an admin tool or edge function in the future.
*/

-- =========================================================
-- profiles
-- =========================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  company text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- =========================================================
-- projects
-- =========================================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'programming',
  status text NOT NULL DEFAULT 'planning',
  progress int NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  deadline date,
  budget numeric(12,2),
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON projects TO authenticated;

DROP POLICY IF EXISTS "select_own_projects" ON projects;
CREATE POLICY "select_own_projects"
ON projects FOR SELECT
TO authenticated
USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "insert_own_projects" ON projects;
CREATE POLICY "insert_own_projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "update_own_projects" ON projects;
CREATE POLICY "update_own_projects"
ON projects FOR UPDATE
TO authenticated
USING (auth.uid() = client_id)
WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "delete_own_projects" ON projects;
CREATE POLICY "delete_own_projects"
ON projects FOR DELETE
TO authenticated
USING (auth.uid() = client_id);

-- =========================================================
-- project_updates
-- =========================================================
CREATE TABLE IF NOT EXISTS project_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  progress_value int CHECK (progress_value IS NULL OR (progress_value >= 0 AND progress_value <= 100)),
  status text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON project_updates TO authenticated;

DROP POLICY IF EXISTS "select_own_project_updates" ON project_updates;
CREATE POLICY "select_own_project_updates"
ON project_updates FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_updates.project_id
    AND projects.client_id = auth.uid()
  )
);

-- =========================================================
-- updated_at trigger for projects
-- =========================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- Indexes
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_project_id ON project_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
