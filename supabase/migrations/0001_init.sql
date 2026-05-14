-- ============================================================================
-- AMP — Migration 0001: Initial Schema
-- ============================================================================
-- Skema dasar untuk Phase 1: profiles + projects + payments + project_files
-- Dijalankan sekali di Supabase SQL Editor.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. profiles — extends auth.users dengan data spesifik AMP
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  city TEXT,
  role TEXT NOT NULL DEFAULT 'client'
    CHECK (role IN ('client', 'admin', 'architect')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Data tambahan klien yang link ke auth.users';

-- ----------------------------------------------------------------------------
-- 2. projects — semua submission proyek (4 service types)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Service taxonomy
  service_type TEXT NOT NULL
    CHECK (service_type IN ('arsitektur_baru', 'interior_existing', 'rab_boq', 'imb')),

  -- Pipeline status
  status TEXT NOT NULL DEFAULT 'brief_submitted'
    CHECK (status IN (
      'brief_submitted',  -- klien sudah submit form
      'paid_commitment',  -- klien sudah bayar commitment fee
      'consultation',     -- konsultasi awal dengan arsitek
      'site_visit',       -- arsitek visit ke lokasi
      'designing',        -- proses desain
      'review',           -- klien review konsep
      'final',            -- desain final
      'completed',        -- proyek selesai
      'cancelled'         -- dibatalkan
    )),

  -- Brief data (struktur beda per service_type, JSONB untuk fleksibilitas)
  brief_data JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Estimasi (untuk service yang punya pricing langsung)
  estimate_total BIGINT NOT NULL DEFAULT 0,         -- total proyek bangun (untuk arsitektur)
  estimate_design_fee BIGINT NOT NULL DEFAULT 0,    -- biaya desain (sesuai paket)
  commitment_fee BIGINT NOT NULL DEFAULT 2500000,   -- non-refundable
  estimated_weeks INT,

  -- Kontak (di-mirror dari profiles untuk kemudahan query)
  client_name TEXT,
  client_phone TEXT,
  client_email TEXT,
  client_city TEXT,
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.projects IS 'Semua submission klien, lintas service type';
COMMENT ON COLUMN public.projects.brief_data IS 'Struktur JSON berbeda per service_type, lihat src/lib/services.ts';

-- ----------------------------------------------------------------------------
-- 3. payments — transaksi pembayaran (commitment fee + design fee bertahap)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,

  -- Identifier dari Midtrans (atau gateway lain)
  gateway_order_id TEXT UNIQUE,
  gateway_transaction_id TEXT,

  -- Detail
  amount BIGINT NOT NULL,
  payment_type TEXT NOT NULL
    CHECK (payment_type IN (
      'commitment_fee',
      'design_fee_tahap_1',  -- 40% saat penandatanganan
      'design_fee_tahap_2',  -- 40% saat preliminary+schematic disetujui
      'design_fee_tahap_3'   -- 20% saat semua dokumen approved
    )),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'settlement', 'expire', 'cancel', 'deny', 'refund')),
  payment_method TEXT,
  raw_response JSONB,
  paid_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.payments IS 'Transaksi pembayaran, mengacu skema 40-40-20 pricelist AMP';

-- ----------------------------------------------------------------------------
-- 4. project_files — file upload (RAB PDF, render 3D, gambar dll)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  file_type TEXT NOT NULL
    CHECK (file_type IN (
      'rab_pdf', 'render_3d', 'moodboard', 'vr_link',
      'site_photo', 'denah', 'drawing', 'other'
    )),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. Indexes
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_service_type ON public.projects(service_type);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_project_id ON public.payments(project_id);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_order_id ON public.payments(gateway_order_id);
CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON public.project_files(project_id);

-- ----------------------------------------------------------------------------
-- 6. Auto-update updated_at trigger
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS projects_updated_at ON public.projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ----------------------------------------------------------------------------
-- 7. Auto-create profile saat user signup
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 8. Row Level Security (RLS)
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

-- profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'architect'))
  );

-- projects policies
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
CREATE POLICY "Users can insert own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "Users can update own draft projects" ON public.projects;
CREATE POLICY "Users can update own draft projects" ON public.projects
  FOR UPDATE USING (auth.uid() = client_id AND status IN ('brief_submitted'));

DROP POLICY IF EXISTS "Admins can manage all projects" ON public.projects;
CREATE POLICY "Admins can manage all projects" ON public.projects
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'architect'))
  );

-- payments policies
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects pr WHERE pr.id = project_id AND pr.client_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert own payments" ON public.payments;
CREATE POLICY "Users can insert own payments" ON public.payments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects pr WHERE pr.id = project_id AND pr.client_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can manage all payments" ON public.payments;
CREATE POLICY "Admins can manage all payments" ON public.payments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'architect'))
  );

-- project_files policies
DROP POLICY IF EXISTS "Users can view own project files" ON public.project_files;
CREATE POLICY "Users can view own project files" ON public.project_files
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects pr WHERE pr.id = project_id AND pr.client_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can manage all files" ON public.project_files;
CREATE POLICY "Admins can manage all files" ON public.project_files
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'architect'))
  );
