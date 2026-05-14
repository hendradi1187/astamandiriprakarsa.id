# astamandiriprakarsa.id

Website company profile dibangun dengan Vite + React + TypeScript + shadcn/ui + Tailwind CSS.

## 🚀 Quick Start dengan GitHub Codespaces (Direkomendasikan)

Bisa langsung dipakai dari HP, tablet, atau browser apa pun tanpa instalasi.

1. Buka repository ini di GitHub
2. Klik tombol hijau **Code** → tab **Codespaces** → **Create codespace on main**
3. Tunggu container ter-build (1-3 menit pertama kali)
4. Di terminal yang terbuka, jalankan:
   ```bash
   npm run dev
   ```
5. Codespaces akan otomatis membuka preview di port `8080`

Semua extension VS Code yang dibutuhkan (ESLint, Prettier, Tailwind IntelliSense, dsb.) akan otomatis ter-install.

## 💻 Setup Lokal (Opsional)

Butuh: **Node.js 20+** dan **npm** (atau **bun**).

```bash
git clone https://github.com/USERNAME/NAMA-REPO.git
cd NAMA-REPO
npm install
npm run dev
```

Buka [http://localhost:8080](http://localhost:8080)

## 📜 Scripts

| Command           | Keterangan                       |
| ----------------- | -------------------------------- |
| `npm run dev`     | Dev server (port 8080)           |
| `npm run build`   | Build production                 |
| `npm run preview` | Preview hasil build              |
| `npm run lint`    | Cek kualitas kode (ESLint)       |
| `npm test`        | Jalankan unit tests (Vitest)     |

## 🏗️ Tech Stack

- **Build tool**: Vite 5
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS 3 + shadcn/ui (Radix UI)
- **Routing**: React Router DOM 6
- **Forms**: React Hook Form + Zod
- **Animation**: Framer Motion
- **Data fetching**: TanStack Query
- **Testing**: Vitest + Testing Library
- **Deployment**: Vercel

## 📁 Struktur Folder

```
.
├── .devcontainer/      # Konfigurasi GitHub Codespaces
├── .github/workflows/  # CI GitHub Actions
├── .vscode/            # Workspace settings
├── public/             # Static assets
├── src/
│   ├── assets/         # Gambar & media
│   ├── components/     # Komponen React
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilities
│   ├── pages/          # Halaman aplikasi
│   ├── test/           # Test files
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tailwind.config.ts
├── vercel.json
└── vite.config.ts
```

## 🌐 Deployment ke Vercel

Sudah ada `vercel.json`. Cara deploy:

1. Login ke [vercel.com](https://vercel.com) dengan akun GitHub
2. **Add New Project** → pilih repository ini
3. Vercel auto-detect Vite → klik **Deploy**
4. Setiap `git push` ke `main` akan trigger auto-deploy

## 🔄 Workflow Harian (Codespaces)

```bash
git pull
# ... edit kode ...
git add .
git commit -m "feat: deskripsi perubahan"
git push
```

GitHub Actions akan otomatis cek lint, test, dan build setiap push.

## 📝 License

Private project — All rights reserved.
