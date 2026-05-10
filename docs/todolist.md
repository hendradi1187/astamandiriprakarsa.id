# Asta Smart-Build Platform — Roadmap Pengembangan

> **Status proyek**: MVP Phase 1 (Brief → Estimasi → Paywall)
> **Last updated**: 2026-05-10
> **Live URL**: https://astamandiriprakarsa.id
> **Repo**: https://github.com/hendradi1187/astamandiriprakarsa.id

---

## Tech Stack Decision

| Layer | Pilihan | Catatan |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript | Sudah running, jangan ganti |
| UI | Tailwind + shadcn/ui + Framer Motion | Sudah lengkap |
| Backend | **Supabase** (PostgreSQL + Auth + Storage + Edge Functions) | Pengganti Firebase di PRD |
| Hosting | Vercel | Sudah live, auto-deploy on push |
| Payment | **Midtrans** (Snap API) | Indonesia-friendly, dokumentasi lengkap |
| Email | **Resend** | 3000 email/bulan gratis |
| Analytics | Vercel Analytics + Google Analytics 4 | Phase 3 |
| AI (opsional) | OpenAI / Anthropic API | Phase 4, bukan Ollama lokal |

---

## Status Saat Ini

### ✅ Sudah selesai
- [x] Landing page lengkap (Hero, Features, Stats, HowItWorks, Portfolio, Testimonials, CTA, Footer)
- [x] Wizard 4-step UI (`/wizard`)
  - [x] Step 1: Form kuesioner (data klien, slider luas, pilih gaya, tier anggaran)
  - [x] Step 2: Auto-estimasi harga
  - [x] Step 3: Mockup paywall (TIDAK FUNGSIONAL)
  - [x] Step 4: Konfirmasi sukses + CTA WhatsApp
- [x] PWA manifest + icons
- [x] SEO meta tags + Open Graph
- [x] Custom domain `astamandiriprakarsa.id` + SSL
- [x] Auto-deploy Vercel dari GitHub `main`

### ⚠️ Yang BELUM ada (kritikal untuk MVP PRD)
- [ ] Database — submission tidak disimpan
- [ ] Authentication — klien tidak bisa login
- [ ] Payment Gateway real — cuma simulasi `setTimeout`
- [ ] Client Dashboard — lihat status proyek, download files
- [ ] Admin Panel — lihat brief klien, upload RAB & 3D
- [ ] File Storage — tidak bisa upload PDF/gambar
- [ ] Email/WA notification — manual semua

---

## 🔴 Phase 1 — Foundation (1-2 minggu)

**Goal**: Wizard berfungsi end-to-end dengan database + auth + payment real.

### Prerequisites (User TODO)
- [ ] Daftar akun **Supabase** di https://supabase.com (login GitHub)
- [ ] Buat project baru di Supabase, region **Singapore**
- [ ] Copy: `Project URL` dan `anon public key` dan `service_role key` dari Settings → API
- [ ] Daftar akun **Midtrans Sandbox** di https://dashboard.sandbox.midtrans.com
- [ ] Copy: `Server Key` dan `Client Key` dari Settings → Access Keys
- [ ] Daftar akun **Resend** di https://resend.com (login GitHub)
- [ ] Generate `RESEND_API_KEY`
- [ ] Verifikasi domain `astamandiriprakarsa.id` di Resend (tambah TXT record di Rumahweb DNS)

### 1.1 Setup Supabase
- [ ] Install dependencies: `@supabase/supabase-js`, `@supabase/auth-ui-react`
- [ ] Buat file `src/lib/supabase.ts` (client init)
- [ ] Buat file `.env.local` dengan `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`
- [ ] Tambahkan `.env.local` ke `.gitignore` (sudah ada via `*.local`)
- [ ] Setup env vars di Vercel (Settings → Environment Variables)

### 1.2 Database Schema
- [ ] Buat migration file `supabase/migrations/001_init.sql`
- [ ] Tabel `clients` (extends `auth.users`)
- [ ] Tabel `projects` (status: brief_submitted, paid, site_visit, designing, final, completed)
- [ ] Tabel `payments` (Midtrans transactions)
- [ ] Tabel `project_files` (PDF RAB, render 3D, moodboard, VR link)
- [ ] Setup Row Level Security (RLS) policies
- [ ] Generate TypeScript types: `supabase gen types typescript`

### 1.3 Authentication
- [ ] Halaman `/login` dengan email magic link + Google OAuth
- [ ] Halaman `/register` (atau merged dengan login)
- [ ] Auth context provider (`src/contexts/AuthContext.tsx`)
- [ ] Protected routes wrapper (`<RequireAuth>`)
- [ ] Logout button di Navbar
- [ ] Setup Google OAuth di Supabase (perlu Google Cloud Console setup)

### 1.4 Wizard Submit ke Database
- [ ] Modify `src/pages/Wizard.tsx` step 1 → save draft submission ke localStorage
- [ ] Step 2 (estimasi): submit ke Supabase saat klien lanjut → create `projects` record dengan status `brief_submitted`
- [ ] Generate unique project ID
- [ ] Redirect ke `/dashboard/project/:id` setelah submit (atau lanjut ke step 3 paywall)

### 1.5 Midtrans Payment Integration
- [ ] Install `midtrans-client` di dependencies
- [ ] Buat Vercel Serverless Function `api/payment/create.ts`
  - Input: `project_id`, `amount`, client info
  - Output: Snap token + redirect_url
- [ ] Buat `api/payment/webhook.ts` untuk receive callback Midtrans
  - Verify signature dengan Server Key
  - Update `payments` table dengan status (`settlement`, `expire`, `cancel`)
  - Update `projects.status` ke `paid` jika sukses
- [ ] Modify Wizard step 3: ganti `setTimeout` mock dengan Snap.js real
- [ ] Embed Snap.js di `index.html` (script tag) atau via dynamic import
- [ ] Test sandbox flow: VA Mandiri, QRIS, Credit Card sandbox

### 1.6 Email Notifications (Resend)
- [ ] Setup Resend SDK di Vercel Function `api/email/send.ts`
- [ ] Email templates (React Email atau plain HTML):
  - Email konfirmasi submission ke klien
  - Email notifikasi brief baru ke admin (`hendra@pm.ghanemtech.co.id`)
  - Email konfirmasi pembayaran ke klien
  - Email notifikasi pembayaran ke admin
- [ ] Trigger email dari API endpoints (bukan langsung dari frontend)

### 1.7 Client Dashboard (Minimal)
- [ ] Halaman `/dashboard` — list project klien yang login
- [ ] Halaman `/dashboard/project/:id` — detail project
  - Status timeline (brief → paid → site visit → design → final)
  - Estimasi & detail brief
  - Riwayat pembayaran
  - Placeholder untuk file (Phase 2)
- [ ] Empty state jika belum ada project

### 1.8 Testing
- [ ] Test full flow: register → login → wizard → submit → payment sandbox → webhook → status updated
- [ ] Test email notifications terkirim
- [ ] Test responsive di mobile

---

## 🟡 Phase 2 — Dashboard & Admin (1 minggu)

**Goal**: Admin/arsitek bisa kelola brief klien, upload deliverables.

### 2.1 Admin Panel
- [ ] Buat role system di Supabase (`role` column di `clients` table)
- [ ] Halaman `/admin` (protected, role=admin only)
- [ ] Table list semua project dengan filter & sort
  - Filter by status, kota, tier anggaran
  - Sort by created_at, estimate_total
- [ ] Bulk actions (export CSV, change status)
- [ ] Halaman `/admin/project/:id` — full detail + file management

### 2.2 File Upload
- [ ] Setup Supabase Storage bucket: `project-files` (private)
- [ ] RLS policy: hanya admin bisa upload, klien hanya bisa download file project mereka
- [ ] Upload component dengan drag & drop (`react-dropzone`)
- [ ] Support upload: PDF (RAB), JPG/PNG (render 3D, moodboard)
- [ ] File preview di dashboard klien
- [ ] Generate signed URL untuk download

### 2.3 Status Workflow
- [ ] Component `<ProjectStatusBadge>` dengan warna sesuai status
- [ ] Admin bisa update status manual (dropdown)
- [ ] Otomatisasi status: payment confirmed → status auto-update ke `paid`
- [ ] Email klien setiap kali status berubah

### 2.4 Generate PDF Summary
- [ ] Install `jsPDF` atau `react-pdf`
- [ ] Template PDF auto-summary klien (dari step 2 wizard):
  - Header logo AMP
  - Data brief klien
  - Estimasi harga
  - Mood description
  - Footer kontak
- [ ] Download button di Wizard step 4
- [ ] Auto-attach ke email konfirmasi

---

## 🟢 Phase 3 — Polish & Visual (3-5 hari)

**Goal**: UX wizard lebih impresif, conversion rate naik.

### 3.1 Visual Style Picker
- [ ] Ganti icon Lucide (Building2, TreePine, Home, Castle) dengan **foto rumah real** untuk setiap gaya
- [ ] 4-6 gambar referensi per gaya (modern, tropis, minimalis, klasik)
- [ ] Gallery grid dengan hover effect
- [ ] Mungkin: pilihan multi-select gaya (contoh: "tropis + minimalis")

### 3.2 Auto-Generated Moodboard
- [ ] Library 30-50 gambar referensi (hosted di Supabase Storage atau Cloudinary)
- [ ] Tag setiap gambar dengan: style, tier, ruang (interior/exterior/garden/dll)
- [ ] Algoritma simple: query 6-8 gambar yang match dengan input klien
- [ ] Display di Wizard step 2 (sebelah estimasi harga)
- [ ] Embed di PDF summary

### 3.3 Estimasi sebagai Rentang
- [ ] Ubah angka tunggal → rentang (`Rp X – Rp Y`)
- [ ] Lower bound = estimate × 0.85, upper = × 1.15
- [ ] Visualize dengan progress bar atau slider visual

### 3.4 Upload Foto Lahan
- [ ] Step baru di wizard: upload foto lahan (opsional)
- [ ] Multiple file upload, max 5 foto, total <10MB
- [ ] Compress di client-side sebelum upload
- [ ] Simpan di Supabase Storage `client-uploads`

### 3.5 WhatsApp Notification Otomatis
- [ ] Daftar **Fonnte** atau **Wablas** (WhatsApp gateway Indonesia)
- [ ] Vercel Function `api/wa/send.ts`
- [ ] Notifikasi otomatis ke admin saat brief masuk
- [ ] Notifikasi ke klien dengan link ke dashboard
- [ ] Cost: ~Rp 50-100/pesan

### 3.6 PWA Improvements
- [ ] Install prompt UI ("Tambahkan ke Home Screen")
- [ ] Offline support (service worker untuk landing page cached)
- [ ] Push notifications (web push) untuk update status

---

## 🔵 Phase 4 — Advanced (Phase 2 PRD, opsional)

### 4.1 AI Auto-Summary
- [ ] Integrasi OpenAI GPT-4o-mini ATAU Anthropic Claude Haiku
- [ ] Prompt engineering: input brief klien → output narasi konsep desain
- [ ] Cost estimasi: ~$0.001 per submission (very cheap)
- [ ] Cache hasil di database supaya tidak di-regenerate berulang

### 4.2 RAG untuk Estimasi Material
- [ ] Database harga material per kota (CSV → Supabase)
- [ ] Vector embedding deskripsi material
- [ ] Query: "rumah modern 200m² di Jakarta" → estimasi material breakdown
- [ ] Tampilkan breakdown estimasi (struktur, finishing, MEP, dll)

### 4.3 3D Viewer
- [ ] Sketchfab embed untuk preview desain 3D
- [ ] Atau Three.js viewer untuk file `.glb` / `.gltf`
- [ ] Annotation/komentar pada model 3D

### 4.4 Komentar & Review System
- [ ] Klien bisa comment pada gambar render
- [ ] Annotation tool (pin & note)
- [ ] Real-time via Supabase Realtime
- [ ] Threaded conversation per file

### 4.5 Analytics & Tracking
- [ ] Google Analytics 4 (GTM setup)
- [ ] Vercel Analytics (sudah included free)
- [ ] Funnel tracking: visit → start wizard → submit → pay
- [ ] A/B testing untuk CTA & copywriting

### 4.6 Multi-language
- [ ] i18n setup (id, en)
- [ ] Translate semua copy
- [ ] Auto-detect locale
- [ ] Toggle language di Navbar

---

## Estimasi Biaya Bulanan (saat MVP live)

| Service | Plan | Cost/bulan |
|---|---|---|
| Vercel | Hobby (free) | Rp 0 |
| Supabase | Free tier (500MB DB, 1GB storage, 50k MAU) | Rp 0 |
| Midtrans | Pay per transaction (~2.9% + Rp 2k per VA) | Variable |
| Resend | Free tier (3k email/bulan) | Rp 0 |
| Domain `.id` | Rumahweb (sudah dibayar) | ~Rp 30k/bulan equiv |
| Fonnte WA (Phase 3) | Pay per message | ~Rp 50-100/pesan |
| OpenAI/Claude (Phase 4) | Pay per token | ~$5-20/bulan estimasi |

**Total fixed cost MVP**: ~Rp 30k/bulan (cuma domain)
**Variable**: tergantung volume transaksi & email

---

## Database Schema (Final Draft)

```sql
-- 1. clients table (extends auth.users)
CREATE TABLE clients (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  city TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin', 'architect')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'brief_submitted'
    CHECK (status IN ('brief_submitted', 'paid', 'site_visit', 'designing', 'review', 'final', 'completed', 'cancelled')),
  land_size INT NOT NULL,
  building_size INT NOT NULL,
  floors INT NOT NULL DEFAULT 1,
  bedrooms INT NOT NULL DEFAULT 3,
  style TEXT NOT NULL CHECK (style IN ('modern', 'tropical', 'minimalist', 'classic')),
  budget_tier TEXT NOT NULL CHECK (budget_tier IN ('standard', 'premium', 'luxury')),
  notes TEXT,
  estimate_total BIGINT NOT NULL,
  estimate_design_fee BIGINT NOT NULL,
  commitment_fee BIGINT NOT NULL DEFAULT 2500000,
  estimated_weeks INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  midtrans_order_id TEXT UNIQUE NOT NULL,
  midtrans_transaction_id TEXT,
  amount BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'settlement', 'expire', 'cancel', 'deny', 'refund')),
  payment_method TEXT,
  raw_response JSONB,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. project_files table
CREATE TABLE project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_type TEXT NOT NULL CHECK (file_type IN ('rab_pdf', 'render_3d', 'moodboard', 'vr_link', 'site_photo', 'drawing', 'other')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_payments_project_id ON payments(project_id);
CREATE INDEX idx_payments_midtrans_order_id ON payments(midtrans_order_id);
CREATE INDEX idx_project_files_project_id ON project_files(project_id);

-- RLS Policies (skeleton - detail nanti)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;

-- Client can read/update only their own row
CREATE POLICY "Clients can view own profile" ON clients FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Clients can update own profile" ON clients FOR UPDATE USING (auth.uid() = id);

-- Client can view only their own projects
CREATE POLICY "Clients can view own projects" ON projects FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Clients can insert own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Admin/architect can view all (TODO: detail policy)
CREATE POLICY "Admins can view all projects" ON projects FOR ALL
  USING (EXISTS (SELECT 1 FROM clients WHERE id = auth.uid() AND role IN ('admin', 'architect')));
```

---

## Catatan Penting

1. **Keep current stack** — JANGAN migrasi ke Flutter. Web React + PWA sudah cukup untuk MVP.
2. **Sandbox first** — semua testing payment pakai Midtrans sandbox dulu, baru switch ke production setelah verifikasi.
3. **Backup database** — Supabase auto-backup harian di paid plan; di free tier, manual export weekly via SQL dump.
4. **Vercel env vars** — JANGAN commit `.env.local` ke git. Set langsung di Vercel dashboard.
5. **CORS** — Vercel Functions auto-handle CORS untuk same-origin (no extra config needed).
6. **Webhook security** — selalu verifikasi signature Midtrans di webhook handler, JANGAN trust payload mentah.

---

## Reference Links

- Supabase docs: https://supabase.com/docs
- Midtrans Snap: https://docs.midtrans.com/docs/snap-snap-integration-guide
- Resend React Email: https://react.email
- Vercel Serverless Functions: https://vercel.com/docs/functions
- shadcn/ui: https://ui.shadcn.com
- Project repo: https://github.com/hendradi1187/astamandiriprakarsa.id
