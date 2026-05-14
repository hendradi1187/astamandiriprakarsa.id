import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Home, Sofa, Calculator, FileText, LogOut, LayoutDashboard, Clock, Wallet } from "lucide-react";
import { services, type ServiceConfig } from "@/lib/services";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/amp-logo.png";

const serviceIcons: Record<ServiceConfig["id"], typeof Home> = {
  arsitektur_baru: Home,
  interior_existing: Sofa,
  rab_boq: Calculator,
  imb: FileText,
};

const Mulai = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  return (
    <main className="min-h-screen bg-muted/30">
      {/* TOP BAR */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="AMP" className="h-9 w-9 object-contain" />
            <div className="leading-tight">
              <div className="text-lg font-extrabold tracking-tight">AMP</div>
              <div className="text-[9px] tracking-[0.2em] text-muted-foreground font-semibold">
                ASTA MANDIRI PRAKARSA
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-muted transition"
            >
              <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
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
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
            Halo, {profile?.full_name || user?.email?.split("@")[0]} 👋
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-2xl">
            Mau mulai layanan apa hari ini? Pilih salah satu di bawah ini. Setiap layanan punya form & deliverable yang berbeda.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:gap-6">
          {services.map((s, idx) => {
            const Icon = serviceIcons[s.id];
            return (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
                onClick={() => navigate(`/wizard/${s.id}`)}
                className="group relative flex flex-col text-left rounded-3xl border border-border bg-background p-6 lg:p-7 transition hover:border-primary hover:shadow-elevated"
              >
                {s.highlight && (
                  <span className="absolute -top-2 right-5 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                    Paling Populer
                  </span>
                )}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold tracking-tight">{s.name}</h3>
                    <p className="mt-0.5 text-sm font-medium text-muted-foreground">{s.shortDesc}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{s.longDesc}</p>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 font-medium">
                    <Wallet className="h-3 w-3" /> {s.startsFromLabel}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 font-medium">
                    <Clock className="h-3 w-3" /> {s.durationLabel}
                  </span>
                </div>
                <div className="mt-5 inline-flex items-center gap-2 self-start rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-red group-hover:shadow-glow transition">
                  {s.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-dashed border-border bg-background/50 p-5 text-sm text-muted-foreground">
          <strong className="text-foreground">Tidak yakin pilih layanan yang mana?</strong>{" "}
          Hubungi tim AMP melalui WhatsApp di{" "}
          <a href="https://wa.me/6285611106194" className="font-semibold text-primary hover:underline">
            +62 856 1106 194
          </a>{" "}
          untuk konsultasi gratis sebelum mulai.
        </div>
      </div>
    </main>
  );
};

export default Mulai;
