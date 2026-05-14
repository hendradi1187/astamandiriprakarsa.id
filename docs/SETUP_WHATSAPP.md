# Setup WhatsApp Notification

Notifikasi WhatsApp otomatis ke pemilik AMP setiap ada submission baru.
Total waktu setup: **±20 menit**.

## Arsitektur

```
Wizard → INSERT projects → Database Webhook → Edge Function → Fonnte API → 📱 WA admin
```

Decoupled: Wizard tidak tahu apapun soal WA. Trigger jalan otomatis untuk
ANY insert ke `projects` table (termasuk nanti dari admin panel).

---

## Step 1 — Daftar Fonnte & Connect WhatsApp

1. Buka [fonnte.com](https://fonnte.com) → **Daftar** (gratis untuk tier basic, paid untuk volume lebih)
2. Login → klik **+ Tambah Device** atau **Devices**
3. Nama device: mis. "AMP Admin"
4. Klik **Connect** → muncul QR code
5. Buka WhatsApp di HP pemilik AMP → menu **⋮** → **Linked devices** → **Link a device** → scan QR Fonnte
6. Tunggu beberapa detik → status device jadi **connected** ✓
7. Copy **Token Device** (di kolom Device list, klik device → ada string panjang)

> Token ini yang dipake Edge Function untuk auth ke Fonnte API. Simpan baik-baik.

> Note: kalau WhatsApp di-logout dari HP, Fonnte kehilangan koneksi — perlu scan ulang QR. Pakai HP/nomor yang stabil.

---

## Step 2 — Deploy Edge Function ke Supabase

### Option A: via Dashboard UI (recommended, no CLI)

1. Supabase dashboard → sidebar **Edge Functions** → **Deploy a new function**
2. **Function name**: `notify-new-project` (harus persis ini)
3. Buka file `supabase/functions/notify-new-project/index.ts` di project Anda
4. Copy seluruh isinya → paste di code editor Supabase
5. **Verify JWT**: toggle **OFF** (penting — kalau ON, Database Webhook gak bisa call)
6. Klik **Deploy function**
7. Tunggu sampai status **Active**

### Option B: via Supabase CLI

```bash
# Install Supabase CLI dulu kalau belum
npm install -g supabase

# Login (one-time)
supabase login

# Link ke project Anda
supabase link --project-ref pczjudmdxxocrentdhbc

# Deploy
supabase functions deploy notify-new-project --no-verify-jwt
```

---

## Step 3 — Set Secrets di Edge Function

Edge Function butuh 2 secret: `FONNTE_TOKEN` & `ADMIN_PHONE`.

### Via Dashboard

1. Supabase dashboard → **Edge Functions** → klik fungsi `notify-new-project`
2. Tab **Secrets** → klik **Add new secret**
3. Tambah 2 secret:

   | Name | Value |
   |---|---|
   | `FONNTE_TOKEN` | (paste Token Device dari Fonnte) |
   | `ADMIN_PHONE` | `6285611106194` (nomor WA admin, format internasional tanpa `+`) |

   > Multi-recipient: pisahkan dengan koma → `6285611106194,6281234567890`

4. **Save**

### Via CLI

```bash
supabase secrets set FONNTE_TOKEN=xxxxxxxxx
supabase secrets set ADMIN_PHONE=6285611106194
```

---

## Step 4 — Setup Database Webhook

Webhook trigger Edge Function setiap kali ada INSERT ke `projects`.

1. Supabase dashboard → sidebar **Database** → **Webhooks**
2. Klik **Create a new hook**
3. Konfigurasi:
   - **Name**: `notify-new-project`
   - **Table**: `public.projects`
   - **Events**: ✓ Insert (uncheck Update & Delete)
   - **Type**: pilih **Supabase Edge Functions**
   - **Edge Function**: pilih `notify-new-project` dari dropdown
   - **HTTP Method**: POST
   - **HTTP Headers**: biarkan default (Supabase auto-add auth)
   - **HTTP Params**: kosongkan
4. **Confirm**

---

## Step 5 — Test 🎉

1. Buka aplikasi (local atau production)
2. Login → pilih layanan → isi wizard sampai Step 3 → klik **Bayar Sekarang**
3. **Cek HP admin AMP** dalam ±5 detik — harusnya muncul WA notif:

   ```
   🔔 Brief Baru Masuk — AMP

   🆔 Project: A1B2C3D4
   🏷️ Layanan: Desain Rumah Baru
   🕒 14 Mei 2026, 11.30 WIB

   👤 Klien: Andi Wijaya
   📱 WA: +62 812 3456 7890
   📧 Email: andi@email.com
   🏙️ Kota: Jakarta Selatan

   💰 Estimasi Total: Rp 1.560.000.000
   ✏️ Biaya Desain: Rp 60.000.000
   🤝 Commitment Fee: Rp 2.500.000
   ⏱️ Durasi: 20 minggu

   💬 Chat klien langsung: https://wa.me/628123456789
   ```

4. **Cek log Edge Function** kalau notif gak muncul:
   - Supabase dashboard → Edge Functions → `notify-new-project` → tab **Logs**
   - Cari error terbaru

---

## Troubleshooting

**Q: Notif tidak muncul, log Edge Function bilang "Missing FONNTE_TOKEN or ADMIN_PHONE secrets"**
A: Secret belum di-set. Ulangi Step 3.

**Q: Log bilang "Fonnte send failed" dengan response `{ reason: "no device" }`**
A: WhatsApp di HP admin sudah ter-logout dari Fonnte. Login ke Fonnte → scan QR ulang.

**Q: Log bilang "Fonnte send failed" dengan reason terkait quota / saldo**
A: Quota Fonnte habis. Upgrade plan di dashboard Fonnte.

**Q: Tidak ada log sama sekali — webhook gak ter-trigger?**
A: Cek di Supabase **Database → Webhooks → notify-new-project** → tab **Webhook Logs**. Kalau kosong, berarti webhook belum aktif atau ada error config. Coba delete + create ulang webhook.

**Q: Mau test tanpa submit wizard beneran?**
A: Insert manual via SQL Editor:
```sql
INSERT INTO public.projects (
  client_id, service_type, status, brief_data,
  estimate_total, estimate_design_fee, commitment_fee, estimated_weeks,
  client_name, client_phone, client_email, client_city, notes
) VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'arsitektur_baru', 'brief_submitted', '{}'::jsonb,
  1500000000, 50000000, 2500000, 18,
  'Test Klien', '+6285611106194', 'test@example.com', 'Jakarta', 'Ini test notif WA'
);
```

**Q: Cara ganti format pesan?**
A: Edit `buildMessage()` di `supabase/functions/notify-new-project/index.ts`, lalu re-deploy function.

**Q: Cara ganti provider dari Fonnte ke Wablas/Whapi/lainnya?**
A: Edit fungsi `sendFonnte()` di Edge Function — ganti URL endpoint & body format sesuai API provider baru. Ganti env var name kalau perlu. Re-deploy.

---

## Biaya Operasional

- **Supabase Edge Function**: gratis sampai 500K invocations/month — practical-nya unlimited untuk MVP
- **Supabase Database Webhook**: gratis (included di Free plan, ada limit di lower tier — cek pricing)
- **Fonnte**: 
  - Basic plan ~Rp 50-100rb/bulan, biasanya cukup untuk <500 message/bulan
  - Cek [fonnte.com/pricing](https://fonnte.com) untuk detail

Untuk MVP AMP dengan volume 10-50 submission/bulan, **total biaya operasional WA notif: ~Rp 50-100rb/bulan**.

---

## Yang Belum Cover (Roadmap)

- ❌ Notif ke **klien** (konfirmasi terima submission) — bisa di-add dengan target: `record.client_phone` di Edge Function. Phase 1.5.
- ❌ Template message dinamis per service_type (sekarang sama semua). Phase 1.5.
- ❌ Retry logic kalau Fonnte error (sekarang sekali coba, log fail). Bisa di-add via Supabase Functions queue. Phase 2.
- ❌ Notif untuk update status proyek (mis. saat status berubah → notify klien). Phase 2.
