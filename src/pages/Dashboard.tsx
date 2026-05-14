import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  LogOut,
  Plus,
  Home,
  Sofa,
  Calculator,
  FileText,
  Clock,
  Wallet,
  Loader2,
  Inbox,
  UserCircle,
} from "lucide-react";
import { supabase, type Project, type ServiceType, type ProjectStatus } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/amp-logotype.png";

const serviceIcons: Record<ServiceType, typeof Home> = {
  arsitektur_baru: Home,
  interior_existing: Sofa,
  rab_boq: Calculator,
  imb: FileText,
};

const serviceNames: Record<ServiceType, string> = {
  arsitektur_baru: "Desain Rumah Baru",
  interior_existing: "Desain Interior Existing",
  rab_boq: "Hitung RAB / BOQ",
  imb: "Pengurusan IMB",
};

const statusLabel: Record<ProjectStatus, { label: string; color: string }> = {
  brief_submitted: { label: "Brief Dikirim", color: "bg-blue-100 text-blue-800" },
  paid_commitment: { label: "Commitment Dibayar", color: "bg-emerald-100 text-emerald-800" },
  consultation: { label: "Konsultasi", color: "bg-amber-100 text-amber-800" },
  site_visit: { label: "Site Visit", color: "bg-amber-100 text-amber-800" },
  designing: { label: "Proses Desain", color: "bg-indigo-100 text-indigo-800" },
  review: { label: "Review Klien", color: "bg-purple-100 text-purple-800" },
  final: { label: "Desain Final", color: "bg-green-100 text-green-800" },
  completed: { label: "Selesai", color: "bg-green-200 text-green-900" },
  cancelled: { label: "Dibatalkan", color: "bg-rose-100 text-rose-800" },
};

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });
      if (!mounted) return;
      if (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        setProjects([]);
      } else {
        setProjects((data as Project[]) || []);
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <main className="min-h-screen bg-muted/30">
      {/* TOP BAR */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4 lg:px-8">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="AMP — Asta Mandiri Prakarsa" className="h-9 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-muted transition"
            >
              <UserCircle className="h-3.5 w-3.5" /> Profil
            </Link>
            <button
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-muted transition"
            >
              <LogOut className="h-3.5 w-3.5" /> Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-4 py-8 lg:px-8 lg:py-12">
        <Link to="/mulai" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="h-4 w-4" /> Pilih Layanan
        </Link>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">Dashboard Proyek</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile?.full_name || user?.email} — daftar proyek Anda di AMP.
            </p>
          </div>
          <Link
            to="/mulai"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-red hover:shadow-glow transition self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Proyek Baru
          </Link>
        </div>

        {/* LIST */}
        <div className="mt-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : projects && projects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-background p-10 text-center">
              <Inbox className="mx-auto h-10 w-10 text-muted-foreground/60" />
              <h3 className="mt-3 text-lg font-semibold">Belum ada proyek</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Mulai konsultasi pertama Anda dengan tim arsitek AMP.
              </p>
              <Link
                to="/mulai"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-red hover:shadow-glow transition"
              >
                <Plus className="h-4 w-4" /> Mulai Proyek Pertama
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {projects?.map((p, idx) => {
                const Icon = serviceIcons[p.service_type];
                const st = statusLabel[p.status];
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    className="rounded-3xl border border-border bg-background p-5 lg:p-6 hover:border-primary/30 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs text-muted-foreground">{serviceNames[p.service_type]}</div>
                          <div className="font-bold leading-tight truncate">
                            #{p.id.slice(0, 8).toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${st.color}`}>
                        {st.label}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      {p.estimate_total > 0 && (
                        <div>
                          <div className="text-muted-foreground">Estimasi Bangun</div>
                          <div className="mt-0.5 font-semibold">{formatIDR(p.estimate_total)}</div>
                        </div>
                      )}
                      {p.estimate_design_fee > 0 && (
                        <div>
                          <div className="text-muted-foreground">Biaya Desain</div>
                          <div className="mt-0.5 font-semibold">{formatIDR(p.estimate_design_fee)}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-muted-foreground inline-flex items-center gap-1">
                          <Wallet className="h-3 w-3" /> Commitment Fee
                        </div>
                        <div className="mt-0.5 font-semibold text-primary">{formatIDR(p.commitment_fee)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Dibuat
                        </div>
                        <div className="mt-0.5 font-semibold">{formatDate(p.created_at)}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
