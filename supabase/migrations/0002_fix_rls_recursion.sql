-- ============================================================================
-- AMP — Migration 0002: Fix infinite recursion in RLS admin policies
-- ============================================================================
-- Bug di 0001_init.sql: policy admin yang query public.profiles dari dalam
-- policy lain (atau dari policy profiles itu sendiri) memicu RLS recursion.
-- Error code: 42P17 'infinite recursion detected in policy for relation "profiles"'
--
-- Fix: pindahkan cek role ke SECURITY DEFINER function yang bypass RLS,
-- lalu re-create semua policy admin pakai function tersebut.
--
-- Dijalankan SETELAH 0001_init.sql di Supabase SQL Editor.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Helper function: cek apakah user saat ini admin/architect
-- ----------------------------------------------------------------------------
-- SECURITY DEFINER → jalan dengan privilege owner function (postgres),
-- bypass RLS pada SELECT FROM profiles → memutus recursion.
-- STABLE → marker bahwa hasil konsisten dalam 1 statement, planner bisa cache.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'architect')
  );
$$;

COMMENT ON FUNCTION public.is_admin() IS
  'Cek role current user. SECURITY DEFINER untuk memutus RLS recursion saat dipanggil dari policy.';

-- ----------------------------------------------------------------------------
-- 2. profiles: re-create admin policy pakai is_admin()
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 3. projects: re-create admin policy
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can manage all projects" ON public.projects;
CREATE POLICY "Admins can manage all projects" ON public.projects
  FOR ALL USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4. payments: re-create admin policy
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can manage all payments" ON public.payments;
CREATE POLICY "Admins can manage all payments" ON public.payments
  FOR ALL USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 5. project_files: re-create admin policy
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can manage all files" ON public.project_files;
CREATE POLICY "Admins can manage all files" ON public.project_files
  FOR ALL USING (public.is_admin());
