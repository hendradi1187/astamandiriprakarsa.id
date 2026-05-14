import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    "Supabase env vars belum di-set. Salin .env.example ke .env.local dan isi VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/* ---------- Types yang match dengan schema 0001_init.sql ---------- */

export type ServiceType = "arsitektur_baru" | "interior_existing" | "rab_boq" | "imb";

export type ProjectStatus =
  | "brief_submitted"
  | "paid_commitment"
  | "consultation"
  | "site_visit"
  | "designing"
  | "review"
  | "final"
  | "completed"
  | "cancelled";

export type UserRole = "client" | "admin" | "architect";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  service_type: ServiceType;
  status: ProjectStatus;
  brief_data: Record<string, unknown>;
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
  updated_at: string;
}

export interface Payment {
  id: string;
  project_id: string;
  gateway_order_id: string | null;
  gateway_transaction_id: string | null;
  amount: number;
  payment_type: "commitment_fee" | "design_fee_tahap_1" | "design_fee_tahap_2" | "design_fee_tahap_3";
  status: "pending" | "settlement" | "expire" | "cancel" | "deny" | "refund";
  payment_method: string | null;
  raw_response: Record<string, unknown> | null;
  paid_at: string | null;
  created_at: string;
}
