/*
# Admin role, invoices, messages, and updated RLS

## Overview
Adds an admin role system to the existing client portal, plus two new tables:
invoices (payment tracking) and messages (direct client-admin chat).
Also updates existing RLS policies so admins can manage all projects and updates.

## Changes to Existing Tables

### profiles
- New column: `is_admin` (boolean, default false) — marks team members.
  Clients have is_admin = false; team members have is_admin = true.
  Set via raw_app_meta_data → not user-editable through the Data API.

### projects
- RLS policies updated: admins (is_admin = true) can SELECT, INSERT, UPDATE all
  projects. Clients retain owner-scoped SELECT (and INSERT/UPDATE for their own).
  Admins need INSERT to create new client projects, and UPDATE to change progress.

### project_updates
- RLS policies updated: admins can INSERT updates on any project.
  Clients retain read-only access to their own projects' updates.
- Grant INSERT to authenticated (was SELECT only).

## New Tables

### invoices
- `id` (uuid, PK)
- `project_id` (uuid, FK → projects.id, ON DELETE CASCADE)
- `client_id` (uuid, FK → profiles.id) — denormalized for RLS simplicity
- `invoice_number` (text, unique) — human-readable invoice ID
- `title` (text) — invoice description
- `amount` (numeric(12,2)) — total billed
- `status` (text, default 'unpaid') — unpaid, partial, paid, overdue
- `paid_amount` (numeric(12,2), default 0) — amount paid so far
- `due_date` (date) — payment deadline
- `issued_at` (timestamptz, default now()) — when invoice was created
- `notes` (text, nullable)

### messages
- `id` (uuid, PK)
- `project_id` (uuid, FK → projects.id, ON DELETE CASCADE)
- `sender_id` (uuid, FK → profiles.id) — who sent the message
- `recipient_id` (uuid, FK → profiles.id) — who receives it
- `body` (text) — message content
- `read_at` (timestamptz, nullable) — when recipient read it
- `created_at` (timestamptz, default now())

## Security

### is_admin() helper function
- SECURITY DEFINER function that reads `raw_app_meta_data` from the JWT.
- Returns true if the user's `role` app metadata is 'admin'.
- App metadata is set server-side and is NOT user-editable through the Data API,
  so this is a safe authorization signal (unlike raw_user_meta_data).

### profiles RLS
- Admins can SELECT all profiles (to see client list).
- Clients can SELECT only their own profile (unchanged).
- `is_admin` column is excluded from client INSERT/UPDATE via column-level grants:
  clients get INSERT(id, full_name, phone, company) and UPDATE(full_name, phone, company).
  Only service_role or admins can set is_admin.

### projects RLS (updated)
- SELECT: admin sees all; client sees own.
- INSERT: admin can insert any (client_id can be any user); client can insert own.
- UPDATE: admin can update any; client can update own.

### project_updates RLS (updated)
- SELECT: admin sees all; client sees own projects' updates.
- INSERT: admin can insert on any project; clients cannot insert (no client INSERT policy).

### invoices RLS
- SELECT: admin sees all; client sees invoices for their own projects.
- INSERT/UPDATE/DELETE: admin only (clients cannot create or modify invoices).

### messages RLS
- SELECT: users see messages where they are sender OR recipient.
  (Both admin and client see the conversation from their side.)
- INSERT: authenticated users can send messages where sender_id = auth.uid().
  Admin sends to a client; client sends to their project's admin.
- UPDATE: users can mark their own received messages as read (recipient_id = auth.uid()).

## Important Notes
1. The `is_admin` flag lives in `raw_app_meta_data` (JWT), set via the Supabase
   admin API or a bootstrap RPC. It is NOT in `raw_user_meta_data`, so clients
   cannot self-promote.
2. `claim_admin()` RPC lets the FIRST user bootstrap themselves as admin.
   After the first admin is set, the function refuses to promote anyone —
   subsequent admin promotions must go through the existing admin's UI
   (which calls an admin-only edge function or service-role operation).
3. The `is_admin` profile column is a convenience for the frontend; the
   authoritative check is the `is_admin()` SQL function reading JWT metadata.
4. Column-level grants on profiles prevent clients from setting is_admin.
*/

-- =========================================================
-- is_admin() helper: reads JWT app metadata
-- =========================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- Revoke public access; grant to authenticated only
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- =========================================================
-- claim_admin() bootstrap: first user becomes admin
-- =========================================================
CREATE OR REPLACE FUNCTION public.claim_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count int;
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RETURN false;
  END IF;

  -- Check if any admin already exists
  SELECT count(*) INTO admin_count
  FROM auth.users
  WHERE raw_app_meta_data->>'role' = 'admin';

  IF admin_count = 0 THEN
    -- No admin yet: promote the current user
    UPDATE auth.users
    SET raw_app_meta_data = jsonb_set(
      COALESCE(raw_app_meta_data, '{}'::jsonb),
      '{role}',
      '"admin"',
      true
    )
    WHERE id = current_user_id;

    -- Also set the profiles flag
    UPDATE profiles SET is_admin = true WHERE id = current_user_id;

    RETURN true;
  END IF;

  RETURN false;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;

-- =========================================================
-- profiles: add is_admin column
-- =========================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- Column-level grants: clients cannot set is_admin
-- Revoke all, then grant selectively
REVOKE ALL ON profiles FROM anon, authenticated;
GRANT SELECT (id, full_name, phone, company, is_admin, created_at) ON profiles TO authenticated;
GRANT INSERT (id, full_name, phone, company) ON profiles TO authenticated;
GRANT UPDATE (full_name, phone, company) ON profiles TO authenticated;

-- Drop old policies, create new ones with admin support
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.is_admin());

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
-- projects: update RLS to allow admin full access
-- =========================================================
DROP POLICY IF EXISTS "select_own_projects" ON projects;
CREATE POLICY "select_own_projects"
ON projects FOR SELECT
TO authenticated
USING (auth.uid() = client_id OR public.is_admin());

DROP POLICY IF EXISTS "insert_own_projects" ON projects;
CREATE POLICY "insert_own_projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = client_id OR public.is_admin());

DROP POLICY IF EXISTS "update_own_projects" ON projects;
CREATE POLICY "update_own_projects"
ON projects FOR UPDATE
TO authenticated
USING (auth.uid() = client_id OR public.is_admin())
WITH CHECK (auth.uid() = client_id OR public.is_admin());

DROP POLICY IF EXISTS "delete_own_projects" ON projects;
CREATE POLICY "delete_own_projects"
ON projects FOR DELETE
TO authenticated
USING (auth.uid() = client_id OR public.is_admin());

-- =========================================================
-- project_updates: allow admin INSERT
-- =========================================================
-- Re-grant INSERT so admins can post updates
GRANT INSERT, UPDATE ON project_updates TO authenticated;

DROP POLICY IF EXISTS "select_own_project_updates" ON project_updates;
CREATE POLICY "select_own_project_updates"
ON project_updates FOR SELECT
TO authenticated
USING (
  public.is_admin()
  OR EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_updates.project_id
    AND projects.client_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "insert_admin_project_updates" ON project_updates;
CREATE POLICY "insert_admin_project_updates"
ON project_updates FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- =========================================================
-- invoices table
-- =========================================================
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invoice_number text UNIQUE NOT NULL,
  title text NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  status text NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partial', 'paid', 'overdue')),
  paid_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
  due_date date,
  issued_at timestamptz NOT NULL DEFAULT now(),
  notes text
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON invoices TO authenticated;
GRANT INSERT, UPDATE, DELETE ON invoices TO authenticated;

DROP POLICY IF EXISTS "select_invoices" ON invoices;
CREATE POLICY "select_invoices"
ON invoices FOR SELECT
TO authenticated
USING (auth.uid() = client_id OR public.is_admin());

DROP POLICY IF EXISTS "insert_admin_invoices" ON invoices;
CREATE POLICY "insert_admin_invoices"
ON invoices FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "update_admin_invoices" ON invoices;
CREATE POLICY "update_admin_invoices"
ON invoices FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "delete_admin_invoices" ON invoices;
CREATE POLICY "delete_admin_invoices"
ON invoices FOR DELETE
TO authenticated
USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- =========================================================
-- messages table
-- =========================================================
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON messages TO authenticated;

DROP POLICY IF EXISTS "select_messages" ON messages;
CREATE POLICY "select_messages"
ON messages FOR SELECT
TO authenticated
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

DROP POLICY IF EXISTS "insert_messages" ON messages;
CREATE POLICY "insert_messages"
ON messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "update_read_messages" ON messages;
CREATE POLICY "update_read_messages"
ON messages FOR UPDATE
TO authenticated
USING (auth.uid() = recipient_id)
WITH CHECK (auth.uid() = recipient_id);

CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
