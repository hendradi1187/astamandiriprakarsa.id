# Deploy ke Vercel — Phase 1 Production

Guide ini memandu deploy aplikasi AMP dari local ke production Vercel.
Waktu total: **±25 menit** untuk first deploy.

> Sudah selesai `PHASE-1-SETUP.md` dan aplikasi jalan normal di local? Lanjut ke sini.

---

## ✅ Pre-flight Checklist

Sebelum mulai, pastikan:

- [ ] Akun **GitHub** & repo project sudah ada (kode sudah di-push)
- [ ] Akun **Vercel** (gratis, sign up dengan GitHub di [vercel.com](https://vercel.com))
- [ ] Akun **Supabase** dengan project running (Anda sudah punya)
- [ ] Local sudah test alur end-to-end & berhasil (signup → wizard → submit → dashboard)

---

## Step 1 — Push Code ke GitHub

```bash
# Cek branch ahead berapa commit
git status

# Push ke origin/main
git push origin main
```

Kalau belum ada GitHub remote, buat dulu repo baru di GitHub lalu:
```bash
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main
```

---

## Step 2 — Connect Repo ke Vercel

1. Login [vercel.com](https://vercel.com) dengan akun GitHub
2. Klik **Add New** → **Project**
3. **Import Git Repository** → cari & pilih repo AMP Anda → **Import**
4. Konfigurasi project:
   - **Framework Preset**: Vercel auto-detect **Vite** ✓
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto)
   - **Output Directory**: `dist` (auto)
   - **Install Command**: `npm install` (auto)
5. **JANGAN klik Deploy dulu** — Anda perlu set env vars first

---

## Step 3 — Set Env Vars di Vercel

Sebelum first deploy, di halaman konfigurasi yang sama:

1. Scroll ke section **Environment Variables**
2. Tambah 2 variabel:

   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | `https://pczjudmdxxocrentdhbc.supabase.co` (sama dengan `.env.local`) |
   | `VITE_SUPABASE_ANON_KEY` | (paste anon/publishable key dari Supabase) |

3. Apply ke ketiga environment: **Production, Preview, Development**
4. Klik **Deploy** sekarang

Vercel akan build & deploy. Tunggu ±2-3 menit sampai status hijau ✓.

---

## Step 4 — Dapatkan Production URL & Update Supabase 🚨

Setelah deploy sukses, Anda dapat URL Vercel seperti:
```
https://amp-astamandiriprakarsa.vercel.app
```

**INI BAGIAN CRITICAL**. Tanpa update Supabase Auth URLs ke domain ini, login dari production akan redirect ke `localhost` dan gagal.

### 4a. Update Supabase Site URL & Redirect URLs

1. Buka [Supabase dashboard](https://supabase.com/dashboard) → project Anda
2. **Authentication** → **URL Configuration**
3. **Site URL**: ganti dari `http://localhost:8082` ke production URL Anda:
   ```
   https://amp-astamandiriprakarsa.vercel.app
   ```
4. **Redirect URLs**: tambahkan (klik **Add URL** masing-masing):
   ```
   https://amp-astamandiriprakarsa.vercel.app/**
   https://*.vercel.app/**
   http://localhost:8082/**
   http://localhost:8083/**
   ```
   > `*.vercel.app/**` supaya **preview deployments** (setiap PR dapat URL unik) juga ikut whitelisted. `localhost:808x` supaya dev local masih jalan.

5. **Save**

### 4b. Update Email Templates (opsional tapi recommended)

Kalau email confirmation aktif di Supabase, link verifikasi default akan pakai `{{ .SiteURL }}` — sekarang sudah mengarah ke production. Cek template di **Authentication** → **Email Templates** kalau perlu customize subject/body.

---

## Step 5 — Test Alur Production

Buka URL production di **browser baru / incognito** (supaya gak ke-mix dengan session local):

1. **`/`** — landing page tampil, hero render normal
2. **Klik "Mulai Perencanaan"** → redirect ke `/auth`
3. **Daftar akun baru** dengan email yang BELUM dipakai (email asli, bukan dummy)
4. **Confirm email** kalau email confirmation aktif (cek inbox)
5. **Login** → harus redirect ke `/mulai`
6. **Pilih layanan** (mis. Desain Rumah Baru) → isi wizard → klik Bayar Sekarang
7. **Cek dashboard** → proyek baru muncul
8. **Cek `/profile`** → klik link "Profil" → bisa update data
9. **Cek Supabase Table Editor**:
   - `auth.users` → user baru ada
   - `profiles` → row dengan full_name, phone
   - `projects` → row dengan service_type & brief_data JSON

✓ Kalau semua lolos, **production sudah live**.

---

## Step 6 (Optional) — Custom Domain

Untuk pasang `astamandiriprakarsa.id` di Vercel:

1. Vercel project → **Settings** → **Domains** → **Add**
2. Ketik `astamandiriprakarsa.id` → **Add**
3. Vercel kasih DNS records (A / CNAME) yang harus di-set di registrar domain Anda
4. Set DNS records di registrar (IDWebHost / Niagahoster / Cloudflare / dll)
5. Tunggu DNS propagation (5 menit – 24 jam)
6. **PENTING**: setelah custom domain aktif, **ulangi Step 4a** dengan domain baru:
   - Site URL: `https://astamandiriprakarsa.id`
   - Redirect URLs: tambah `https://astamandiriprakarsa.id/**`

---

## 🔁 Cara Update Production Selanjutnya

Tinggal:
```bash
git add ...
git commit -m "..."
git push origin main
```

Vercel **auto-deploy** dari push ke `main`. Setiap PR juga dapat **preview deployment** dengan URL unik untuk testing.

CI workflow (`.github/workflows/ci.yml`) akan jalan paralel — lint + test + build — di GitHub Actions setiap push/PR.

---

## Troubleshooting

**Q: Vercel build gagal dengan error import resolution**
A: Cek `vercel.json` ada. Cek `package.json` & `package-lock.json` ke-commit. Cek log build di Vercel dashboard untuk pesan spesifik.

**Q: Build sukses tapi blank page di production**
A: Buka browser DevTools → Console. Kemungkinan: env vars belum di-set di Vercel (Supabase client error). Verifikasi di Vercel **Settings → Environment Variables** ada `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`. Setelah set/edit, harus trigger **Redeploy** (auto-deploy ulang) untuk apply.

**Q: Login berhasil tapi setelah redirect malah ke `localhost`**
A: Site URL di Supabase belum di-update. Cek Step 4a.

**Q: User signup sukses tapi confirmation email link 404**
A: Redirect URL di Supabase belum cover domain production. Tambahkan `https://your-domain/**` di Redirect URLs.

**Q: 404 saat refresh page di route protected (mis. `/mulai`)**
A: `vercel.json` SPA rewrite tidak aktif. Cek file ada di root project & ke-commit. Trigger redeploy.

**Q: CORS error saat panggil Supabase dari production**
A: Cek Supabase project → **Settings → API → CORS origins**. Defaultnya `*` jadi semua origin bolah. Kalau Anda lock down, tambahkan production domain di sini.

**Q: Preview deployment (URL `*-git-branch-*.vercel.app`) login gagal**
A: Wildcard `https://*.vercel.app/**` di Supabase Redirect URLs belum ada. Tambahkan untuk cover semua preview URLs.

---

## Checklist Production-Ready

Sebelum kasih URL ke klien:

- [ ] Production URL berhasil signup + login + submit project
- [ ] Email confirmation di-on (toggle off cuma untuk dev)
- [ ] Site URL & Redirect URLs di Supabase pakai production domain
- [ ] Custom domain DNS sudah aktif (kalau pakai)
- [ ] Test di mobile browser (responsive sudah OK)
- [ ] `/dashboard` & `/profile` jalan tanpa error
- [ ] Browser DevTools Console clean (no critical errors)
- [ ] Branding di-update di Supabase Email Templates (Subject, From name)

---

## Yang Belum Cover di Phase 1 (Production)

- ❌ Custom domain SSL (Vercel handle otomatis kalau pakai domain mereka, custom domain juga otomatis via Let's Encrypt — tapi setup DNS perlu manual)
- ❌ Real payment integration (Midtrans webhook handler) — Phase 1.5
- ❌ Transactional email (Resend) untuk konfirmasi submission — Phase 1.5
- ❌ Admin panel & file upload — Phase 2
- ❌ Error monitoring (Sentry) — kapan-kapan
- ❌ Analytics (Vercel Analytics atau Plausible) — saat traffic mulai ada

---

## Quick Reference

| Resource | URL |
|---|---|
| Production app | `https://your-app.vercel.app` |
| Vercel dashboard | https://vercel.com/dashboard |
| Supabase dashboard | https://supabase.com/dashboard |
| GitHub repo | https://github.com/USERNAME/REPO_NAME |
| CI workflow | `.github/workflows/ci.yml` |
| SPA routing config | `vercel.json` |
