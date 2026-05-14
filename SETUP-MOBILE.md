# 📱 Panduan Setup dari HP (Tanpa Laptop)

Panduan ini khusus untuk upload project ke GitHub dan mulai pakai Codespaces, semuanya lewat browser HP/tablet.

---

## Langkah 1: Buat Akun GitHub (skip jika sudah punya)

1. Buka [github.com](https://github.com) di browser HP
2. Sign up dengan email
3. Verifikasi email

---

## Langkah 2: Buat Repository Baru

1. Login ke GitHub di browser HP
2. Tap ikon **+** di pojok kanan atas → **New repository**
3. Isi:
   - **Repository name**: `astamandiriprakarsa.id` (atau nama lain)
   - **Private** (atau Public, terserah)
   - ❌ **JANGAN centang** "Add a README", "Add .gitignore", atau "Choose a license"
4. Tap **Create repository**

---

## Langkah 3: Upload File Project ke GitHub (via Browser)

GitHub mendukung upload file langsung lewat browser, jadi tidak perlu Git di HP.

1. Setelah repo dibuat, scroll ke bawah dan tap **"uploading an existing file"**
2. Upload file `astamandiriprakarsa.id-setup.zip` yang sudah saya buat
3. **⚠️ Tapi GitHub web tidak otomatis extract zip!** Jadi ada 2 opsi:

### Opsi A: Lewat aplikasi (Paling mudah di HP)

1. Install aplikasi **"Working Copy"** (iOS) atau **"Termux"** (Android) — gratis
2. Atau gunakan aplikasi **"a-Shell"** (iOS)
3. Extract zip di HP → push pakai Git dari aplikasi

### Opsi B: Pakai Codespaces sebagai "uploader" (Trik termudah!)

Ini cara paling cerdas tanpa instalasi apa-apa:

1. Di repo GitHub yang masih kosong, tap **Code** → **Codespaces** → **Create codespace on main**
2. Setelah Codespaces terbuka, di terminal jalankan satu per satu:
   ```bash
   # Upload zip dari HP ke Codespaces:
   # Drag-drop file zip ke file explorer di Codespaces
   # (di browser desktop) atau pakai upload icon
   ```
3. Lalu extract:
   ```bash
   unzip astamandiriprakarsa.id-setup.zip
   mv astamandiriprakarsa.id-main/* .
   mv astamandiriprakarsa.id-main/.* . 2>/dev/null
   rmdir astamandiriprakarsa.id-main
   rm astamandiriprakarsa.id-setup.zip
   ```
4. Commit & push:
   ```bash
   git add .
   git commit -m "Initial commit: setup project"
   git push
   ```

### Opsi C: Pakai laptop sebentar (Paling cepat, 5 menit)

Kalau ada akses laptop walau cuma sebentar:

```bash
cd astamandiriprakarsa.id-main
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```

Setelah ini, **selamanya bisa ngoding dari HP via Codespaces**.

---

## Langkah 4: Mulai Ngoding dari HP

1. Di browser HP, buka repo Anda di github.com
2. Tap **Code** (tombol hijau) → tab **Codespaces** → **Create codespace on main**
3. VS Code akan terbuka di browser HP
4. Di terminal:
   ```bash
   npm run dev
   ```
5. Tap notifikasi "Open in Browser" untuk preview website

---

## Tips Pakai Codespaces di HP

- **Putar HP ke landscape** supaya layar lebih lega
- Install aplikasi **GitHub Mobile** untuk notifikasi & review code
- Codespaces gratis **120 jam core/bulan** (cukup banget untuk hobi/sampingan)
- **Auto-stop** setelah 30 menit tidak aktif (bisa diatur), data tetap tersimpan
- Untuk pengalaman terbaik di Android, pakai browser **Chrome** atau **Edge**
- Di iOS pakai **Safari** atau **Chrome**

---

## Troubleshooting

**Q: Codespaces lama loading?**
A: Pertama kali memang 1-3 menit untuk build container. Selanjutnya cepat.

**Q: Port preview tidak muncul?**
A: Tap ikon **PORTS** di bottom panel, cari port 8080, tap ikon globe.

**Q: Lupa cara push?**
A: Di Codespaces ada tab **Source Control** (ikon cabang) — bisa commit & push lewat GUI tanpa ngetik perintah git.
