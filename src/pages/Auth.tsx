import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, User, Phone, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/amp-logo.png";

type Mode = "login" | "register";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const from = (location.state as { from?: string } | null)?.from || "/mulai";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast({ title: "Lengkapi data", description: "Email dan password wajib diisi." });
      return;
    }
    if (mode === "register" && (!fullName.trim() || !phone.trim())) {
      toast({ title: "Lengkapi data", description: "Nama dan nomor HP wajib diisi." });
      return;
    }
    setLoading(true);
    try {
      const { error } =
        mode === "login"
          ? await signIn(email, password)
          : await signUp(email, password, fullName, phone);
      if (error) {
        toast({ title: mode === "login" ? "Gagal login" : "Gagal daftar", description: error });
        return;
      }
      if (mode === "register") {
        toast({
          title: "Pendaftaran berhasil",
          description: "Silakan cek email Anda untuk konfirmasi (jika diaktifkan di Supabase).",
        });
      }
      navigate(from, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/30 grid lg:grid-cols-2">
      {/* LEFT — branding */}
      <aside className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-12">
        <Link to="/" className="inline-flex items-center gap-3">
          <img src={logo} alt="AMP" className="h-12 w-12 object-contain" />
          <div className="leading-tight">
            <div className="text-2xl font-extrabold tracking-tight">AMP</div>
            <div className="text-[10px] tracking-[0.22em] opacity-80 font-semibold">
              ASTA MANDIRI<br />PRAKARSA
            </div>
          </div>
        </Link>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Wujudkan rumah impian Anda<br />
            <span className="opacity-80">bersama tim arsitek profesional.</span>
          </h1>
          <p className="mt-4 text-sm opacity-80 max-w-md leading-relaxed">
            Login untuk mengakses dashboard proyek Anda, lihat status desain, dan kelola pembayaran.
          </p>
        </div>
        <div className="text-xs opacity-60">
          © {new Date().getFullYear()} Asta Mandiri Prakarsa
        </div>
      </aside>

      {/* RIGHT — form */}
      <section className="flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>

          <div className="rounded-3xl border border-border bg-background p-6 lg:p-8 shadow-soft">
            <div className="flex gap-2 rounded-xl bg-muted p-1 mb-6">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                  mode === "login" ? "bg-background shadow text-foreground" : "text-muted-foreground"
                }`}
              >
                Masuk
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                  mode === "register" ? "bg-background shadow text-foreground" : "text-muted-foreground"
                }`}
              >
                Daftar
              </button>
            </div>

            <h2 className="text-2xl font-bold tracking-tight">
              {mode === "login" ? "Masuk ke akun Anda" : "Buat akun baru"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "login"
                ? "Lanjutkan konsultasi atau lihat status proyek Anda."
                : "Mulai konsultasi proyek desain bersama AMP."}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === "register" && (
                <>
                  <InputWithIcon
                    icon={User}
                    label="Nama Lengkap"
                    value={fullName}
                    onChange={setFullName}
                    placeholder="Andi Wijaya"
                    autoComplete="name"
                  />
                  <InputWithIcon
                    icon={Phone}
                    label="Nomor WhatsApp"
                    value={phone}
                    onChange={setPhone}
                    placeholder="+62 812..."
                    autoComplete="tel"
                  />
                </>
              )}
              <InputWithIcon
                icon={Mail}
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="nama@email.com"
                autoComplete="email"
              />
              <InputWithIcon
                icon={Lock}
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Minimal 6 karakter"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-red transition hover:shadow-glow hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "login" ? "Masuk" : "Daftar Sekarang"}
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-muted-foreground">
              {mode === "login" ? (
                <>
                  Belum punya akun?{" "}
                  <button onClick={() => setMode("register")} className="font-semibold text-primary hover:underline">
                    Daftar di sini
                  </button>
                </>
              ) : (
                <>
                  Sudah punya akun?{" "}
                  <button onClick={() => setMode("login")} className="font-semibold text-primary hover:underline">
                    Masuk
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

const InputWithIcon = ({
  icon: Icon,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  icon: typeof Mail;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-foreground">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-input bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  </div>
);

export default Auth;
