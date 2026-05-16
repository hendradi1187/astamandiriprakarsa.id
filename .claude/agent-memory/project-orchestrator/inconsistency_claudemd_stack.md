---
name: inconsistency-claudemd-stack
description: CLAUDE.md menyebut Next.js + FastAPI + LangGraph + ComfyUI sebagai stack, padahal realita aplikasi utama adalah Vite + React + Supabase. FastAPI/ComfyUI/LangGraph hanya hidup di amp-ai/ (Python pipeline) dan masih sebagian mocked.
metadata:
  type: project
---

CLAUDE.md di repo root mendaftar stack sebagai "Next.js, Tailwind, FastAPI, LangGraph, ComfyUI". Realita per 2026-05-16:

- Aplikasi utama: **Vite 5 + React 18 + TypeScript + Tailwind + shadcn + Supabase** (lihat `package.json`, `vite.config.ts`, `todolist.md` Tech Stack Decision)
- LangGraph hanya di `amp-ai/python/` — masih scaffolded
- ComfyUI masih mocked di `amp-ai/tools/render-engine.ts`
- FastAPI tidak ada di repo sama sekali

**Why:** CLAUDE.md ditulis sebagai aspirational/marketing-style instruction. Stack klaim-nya tidak match dengan apa yang actually deployed.

**How to apply:** Saat routing task, treat CLAUDE.md sebagai "direction" bukan "ground truth" untuk stack. Selalu konfirmasi via `package.json` dan struktur folder. Saat rekomendasi feature, base ke Vite reality, bukan Next.js. Sebaiknya CLAUDE.md di-edit supaya konsisten, route ke [[frontend-engineering]] atau langsung minta founder revisi.
