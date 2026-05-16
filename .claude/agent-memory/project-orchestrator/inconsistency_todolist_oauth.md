---
name: inconsistency-todolist-oauth
description: docs/todolist.md section 1.3 masih mention "Setup Google OAuth di Supabase" sebagai item, padahal user memory project_auth_phone_required explicitly reject Google OAuth karena tidak provide phone scope.
metadata:
  type: project
---

`docs/todolist.md` baris ~86: `- [ ] Setup Google OAuth di Supabase (perlu Google Cloud Console setup)`

User memory `project_auth_phone_required` (2026-05-14): user explicitly reject Google OAuth karena phone wajib dan Google tidak provide phone scope by default.

**Why:** todolist ditulis sebelum keputusan phone-required dibuat. Tidak di-update setelah decision change.

**How to apply:** Saat user atau agent lain ngeliat todolist dan tanya soal "Google OAuth", jangan route ke implementasi — flag inkonsistensi dulu, confirm dengan user apakah sudah firm reject atau ada perubahan. Saat next opportunity, route ke user untuk edit todolist (hapus baris itu atau gantikan dengan "Phone-required email+password — done").
