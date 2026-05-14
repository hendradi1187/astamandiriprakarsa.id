# Phase 1 — Setup Supabase & Run Aplikasi

Setelah patch ini di-apply, ada beberapa langkah konfigurasi yang harus dilakukan sebelum aplikasi bisa jalan. Total waktu: **±20 menit**.

---

## ✅ Checklist Singkat

- [ ] Step 1: Jalankan migration SQL di Supabase
- [ ] Step 2: Set env vars `.env.local` di Codespaces
- [ ] Step 3: Set env vars di Vercel (untuk production)
- [ ] Step 4: Test alur end-to-end

---

## Step 1 — Jalankan Migration SQL di Supabase

1. Buka [supabase.com/dashboard](https://supabase.com/dashboard) → masuk ke project Anda
2. Sidebar kiri → klik ikon **SQL Editor** (gambar database)
3. Klik **+ New query**
4. Buka file `supabase/migrations/0001_init.sql` di Codespaces, **copy semua isinya**
5. Paste ke SQL Editor di Supabase
6. Klik tombol hijau **Run** (atau Ctrl+Enter)
7. Tunggu sampai muncul "Success. No rows returned" di bawah

**Yang dibuat:** 4 tabel (`profiles`, `projects`, `payments`, `project_files`), trigger auto-create profile saat user signup, RLS policies untuk security.

**Cek hasilnya:** Sidebar → **Table Editor** → harusnya muncul 4 tabel baru di schema `public`.

---

## Step 2 — Set Env Vars di Codespaces (Development)

1. Di Supabase dashboard, klik **Settings** (ikon gear) → **API**
2. Copy 2 value berikut:
   - **Project URL** → mis. `https://abcdefg.supabase.co`
   - **anon public** key (di bagian "Project API keys") → string panjang `eyJ...`

3. Di Codespaces terminal:
   ```bash
   cp .env.example .env.local
   ```
4. Buka `.env.local` di editor, isi:
   ```
   VITE_SUPABASE_URL=https://abcdefg.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...isi-key-anda...
   ```
5. **Restart dev server** supaya env vars di-load:
   ```bash
   # Hentikan dev server (Ctrl+C), lalu:
   npm run dev
   ```

**Catatan:** `.env.local` sudah di-`.gitignore` jadi tidak akan ter-commit. Aman.

---

## Step 3 — Set Env Vars di Vercel (Production)

Supaya production di astamandiriprakarsa.id juga bisa akses Supabase:

1. Buka [vercel.com](https://vercel.com) → project Anda
2. **Settings** → **Environment Variables**
3. Tambah 2 variabel:
   - `VITE_SUPABASE_URL` = (paste Project URL)
   - `VITE_SUPABASE_ANON_KEY` = (paste anon key)
4. Pilih scope: **Production, Preview, Development**
5. **Save**
6. Trigger redeploy: Vercel akan auto-redeploy saat next push, atau di tab Deployments → **Redeploy**

---

## Step 4 — Test Alur End-to-End

Setelah dev server jalan di Codespaces:

1. **Buka `/`** → harusnya landing page tampil normal
2. **Klik "Mulai Konsultasi"** → harusnya redirect ke `/auth` (karena belum login)
3. **Tab "Daftar"** → isi nama, HP, email, password → submit
   - Cek di Supabase: **Authentication → Users** → user baru harus muncul
   - Cek di Table Editor: **profiles** → ada row baru dengan nama Anda
4. **Setelah login berhasil** → otomatis ke `/mulai` (Service Picker)
5. **Coba pilih 1 layanan**, mis. **Desain Rumah Baru**
   - Isi wizard sampai Step 3
   - Klik **Bayar Sekarang**
   - Cek toast "Brief berhasil dikirim, Project #XXXXXXXX..."
   - Cek Table Editor → **projects** → ada row baru
6. **Klik "Dashboard"** atau buka `/dashboard` → proyek baru Anda harus muncul di list

---

## Troubleshooting

**Q: Toast "Failed to fetch" atau error CORS saat signup?**
A: Env vars belum di-load. Pastikan `.env.local` ada, isinya benar, dan dev server SUDAH di-restart. Jangan lupa file harus diberi nama persis `.env.local` (bukan `.env` atau `.env.example`).

**Q: User berhasil signup tapi profile tidak terbuat?**
A: Trigger `on_auth_user_created` belum aktif. Re-run migration 0001 — bagian "DROP TRIGGER IF EXISTS" + "CREATE TRIGGER" akan refresh.

**Q: "Row violates RLS policy" saat insert project?**
A: RLS policies sudah benar tapi `auth.uid()` mungkin null karena session tidak ter-load. Coba logout & login ulang.

**Q: Email confirmation menghalangi login?**
A: Di Supabase → **Authentication** → **Providers** → **Email** → matikan toggle "Confirm email" untuk MVP. Aktifkan kembali saat production launch.

**Q: Saat klik link landing "Mulai Konsultasi" malah pindah halaman penuh (bukan SPA)?**
A: Itu karena Navbar/Hero pakai `<a href>` bukan `<Link>` Router. Tidak masalah fungsional — auth tetap jalan. Bisa di-refactor nanti.

---

## Alur Pipeline Lengkap (Phase 1)

```
Landing (/)
  ├─ User klik "Mulai Konsultasi" / CTA hero
  └─ Public, semua bisa lihat

/auth
  ├─ Form Login/Daftar (toggle tab)
  ├─ Supabase Auth (email + password)
  └─ Auto-create profile via trigger

/mulai (RequireAuth)
  └─ Service Picker — 4 kartu

/wizard/arsitektur_baru (RequireAuth)
  ├─ 4-step wizard existing (Form → Estimasi → Commitment → Mulai Desain)
  └─ INSERT ke projects pada klik "Bayar Sekarang"

/wizard/interior_existing (RequireAuth)
  ├─ Single-page form
  └─ INSERT ke projects pada klik "Submit Brief"

/wizard/rab_boq (RequireAuth)
  ├─ Single-page form (tiered pricing)
  └─ INSERT ke projects

/wizard/imb (RequireAuth)
  ├─ Lead capture form
  └─ INSERT ke projects (estimate=0, custom quote)

/dashboard (RequireAuth)
  └─ List semua projects user (filter by client_id via RLS)
```

---

## Yang Belum Masuk di Phase 1 (Roadmap Selanjutnya)

- ❌ **Midtrans Snap real** — saat klik "Bayar Sekarang" masih mock (langsung INSERT tanpa pembayaran beneran). Phase 1.5.
- ❌ **Email konfirmasi via Resend** — saat ini cuma toast. Phase 1.5.
- ❌ **Admin Panel** — lihat semua submission, manage status. Phase 2.
- ❌ **File Upload** — RAB PDF, render 3D ke Supabase Storage. Phase 2.
- ❌ **Detail Project Page** `/dashboard/project/:id` — saat ini cuma list, belum bisa klik detail. Phase 2.

---

## Quick Commands Reference

```bash
# Test build local
npm run build

# Lint
npm run lint

# Dev server
npm run dev

# Apply patch berikutnya
git am nama-patch.patch
git push --no-verify origin main
```
