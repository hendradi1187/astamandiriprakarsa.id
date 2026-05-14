import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  User,
  Phone,
  MapPin,
  LogOut,
  LayoutDashboard,
  Loader2,
  Shield,
  Save,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/amp-logotype.png";

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    if (profile && !initialized) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setCity(profile.city || "");
      setInitialized(true);
    }
  }, [profile, initialized]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      toast({ title: "Lengkapi data", description: "Nama lengkap & nomor WhatsApp wajib diisi." });
      return;
    }
    if (!user) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          phone: phone.trim(),
          city: city.trim() || null,
        })
        .eq("id", user.id);
      if (error) throw error;
      await refreshProfile();
      toast({ title: "Profil tersimpan", description: "Data Anda berhasil diperbarui." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      toast({ title: "Gagal menyimpan", description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const roleColor =
    profile?.role === "admin"
      ? "bg-red-100 text-red-800"
      : profile?.role === "architect"
      ? "bg-blue-100 text-blue-800"
      : "bg-muted text-foreground";

  return (
    <main className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4 lg:px-8">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="AMP — Asta Mandiri Prakarsa" className="h-9 w-auto object-contain" />
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

      <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8 lg:py-12">
        <Link
          to="/mulai"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Pilih Layanan
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">Profil Saya</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Update data kontak Anda. Tim AMP akan menggunakan nomor WhatsApp ini untuk follow-up proyek.
          </p>
        </motion.div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl border border-border bg-background p-6 lg:p-8 shadow-soft space-y-5"
        >
          <InputWithIcon
            icon={Mail}
            label="Email (tidak dapat diubah)"
            value={user?.email || ""}
            onChange={() => {}}
            readOnly
          />

          {profile?.role && (
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Role:</span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${roleColor}`}
              >
                {profile.role}
              </span>
            </div>
          )}

          <div className="h-px bg-border" />

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
          <InputWithIcon
            icon={MapPin}
            label="Kota (opsional)"
            value={city}
            onChange={setCity}
            placeholder="Mis. Jakarta Selatan"
            autoComplete="address-level2"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-red transition hover:shadow-glow hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-dashed border-border bg-background/50 p-5 text-sm text-muted-foreground">
          <strong className="text-foreground">Catatan keamanan:</strong> Untuk mengubah password atau email,
          hubungi tim AMP melalui WhatsApp. Fitur self-service untuk perubahan kredensial akan tersedia di update berikutnya.
        </div>
      </div>
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
  readOnly,
}: {
  icon: typeof Mail;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  readOnly?: boolean;
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
        readOnly={readOnly}
        className={`w-full rounded-xl border border-input pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
          readOnly ? "bg-muted/50 cursor-not-allowed text-muted-foreground" : "bg-background"
        }`}
      />
    </div>
  </div>
);

export default Profile;
