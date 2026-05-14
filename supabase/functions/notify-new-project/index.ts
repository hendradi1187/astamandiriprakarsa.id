// Supabase Edge Function — notify-new-project
// Triggered via Database Webhook saat ada INSERT di public.projects
// Output: kirim WhatsApp notification ke nomor admin AMP via Fonnte gateway
//
// Deploy:
//   Option A — via Supabase dashboard (no CLI needed):
//     1. Dashboard → Edge Functions → Deploy a new function
//     2. Name: notify-new-project
//     3. Copy isi file ini ke editor
//     4. Set "Verify JWT" = OFF (supaya Database Webhook bisa call tanpa user JWT)
//     5. Deploy
//   Option B — via Supabase CLI:
//     supabase functions deploy notify-new-project --no-verify-jwt
//
// Required secrets (set di Edge Functions → Secrets di dashboard):
//   FONNTE_TOKEN — token API Fonnte (dapat di dashboard Fonnte → Devices)
//   ADMIN_PHONE  — nomor WA pemilik AMP format internasional tanpa +, mis. 6285611106194
//                  Untuk multi-recipient: pisahkan dengan koma, mis. "628xxx,628yyy"
//
// Database Webhook setup (Supabase dashboard → Database → Webhooks):
//   Name: notify-new-project
//   Table: public.projects
//   Events: Insert
//   Type: Supabase Edge Functions
//   Edge Function: notify-new-project
//   HTTP Method: POST

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: {
    id: string;
    client_id: string;
    service_type: string;
    status: string;
    estimate_total: number;
    estimate_design_fee: number;
    commitment_fee: number;
    estimated_weeks: number | null;
    client_name: string | null;
    client_phone: string | null;
    client_email: string | null;
    client_city: string | null;
    notes: string | null;
    created_at: string;
    brief_data: Record<string, unknown>;
  };
  old_record: unknown;
}

const SERVICE_NAMES: Record<string, string> = {
  arsitektur_baru: "Desain Rumah Baru",
  interior_existing: "Desain Interior Existing",
  rab_boq: "Hitung RAB / BOQ",
  imb: "Pengurusan IMB",
};

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  });

function buildMessage(project: WebhookPayload["record"]): string {
  const serviceName = SERVICE_NAMES[project.service_type] || project.service_type;
  const projectId = project.id.slice(0, 8).toUpperCase();
  const phoneClean = (project.client_phone || "").replace(/\D/g, "");

  const lines: string[] = [
    `🔔 *Brief Baru Masuk — AMP*`,
    ``,
    `🆔 Project: *${projectId}*`,
    `🏷️ Layanan: *${serviceName}*`,
    `🕒 ${formatDateTime(project.created_at)} WIB`,
    ``,
    `👤 Klien: *${project.client_name || "—"}*`,
    `📱 WA: ${project.client_phone || "—"}`,
    `📧 Email: ${project.client_email || "—"}`,
    `🏙️ Kota: ${project.client_city || "—"}`,
  ];

  if (project.estimate_total > 0) {
    lines.push(``, `💰 Estimasi Total: ${formatIDR(project.estimate_total)}`);
  }
  if (project.estimate_design_fee > 0) {
    lines.push(`✏️ Biaya Desain: ${formatIDR(project.estimate_design_fee)}`);
  }
  if (project.commitment_fee > 0) {
    lines.push(`🤝 Commitment Fee: ${formatIDR(project.commitment_fee)}`);
  }
  if (project.estimated_weeks) {
    lines.push(`⏱️ Durasi: ${project.estimated_weeks} minggu`);
  }

  if (project.notes) {
    lines.push(``, `📝 Catatan klien:`, `${project.notes}`);
  }

  if (phoneClean) {
    lines.push(``, `💬 Chat klien langsung: https://wa.me/${phoneClean}`);
  }

  return lines.join("\n");
}

async function sendFonnte(token: string, target: string, message: string) {
  const resp = await fetch("https://api.fonnte.com/send", {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      target,
      message,
      countryCode: "62",
    }).toString(),
  });
  const data = await resp.json().catch(() => ({}));
  return { ok: resp.ok && data?.status === true, data };
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const FONNTE_TOKEN = Deno.env.get("FONNTE_TOKEN");
  const ADMIN_PHONE = Deno.env.get("ADMIN_PHONE");

  if (!FONNTE_TOKEN || !ADMIN_PHONE) {
    console.error("Missing secrets: FONNTE_TOKEN or ADMIN_PHONE not set");
    return new Response(
      JSON.stringify({ ok: false, error: "Missing FONNTE_TOKEN or ADMIN_PHONE secrets" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let payload: WebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (payload.type !== "INSERT" || payload.table !== "projects") {
    return new Response(
      JSON.stringify({ ok: true, skipped: `Not an INSERT on projects (got ${payload.type} on ${payload.table})` }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  const message = buildMessage(payload.record);
  const { ok, data } = await sendFonnte(FONNTE_TOKEN, ADMIN_PHONE, message);

  if (!ok) {
    console.error("Fonnte send failed:", data);
    return new Response(
      JSON.stringify({ ok: false, gateway: data }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  console.log(`Notif sent for project ${payload.record.id.slice(0, 8)}`);
  return new Response(
    JSON.stringify({ ok: true, gateway: data }),
    { headers: { "Content-Type": "application/json" } }
  );
});
