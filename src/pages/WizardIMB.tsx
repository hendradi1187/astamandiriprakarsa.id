import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Loader2, MapPin, Building, Ruler, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ImbBriefData } from "@/lib/services";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/amp-logotype.png";

const BUILDING_TYPES = [
  { id: "rumah_tinggal" as const, label: "Rumah Tinggal", desc: "Hunian pribadi" },
  { id: "komersial" as const, label: "Komersial", desc: "Kantor, kafe, dll" },
  { id: "ruko" as const, label: "Ruko / Rukan", desc: "Toko + tinggal" },
  { id: "lainnya" as const, label: "Lainnya", desc: "Jenis khusus" },
];

const WizardIMB = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const [city, setCity] = useState(profile?.city || "");
  const [buildingType, setBuildingType] = useState<ImbBriefData["buildingType"]>("rumah_tinggal");
  const [landSize, setLandSize] = useState(120);
  const [buildingSize, setBuildingSize] = useState(90);
  const [hasExistingPermit, setHasExistingPermit] = useState(false);
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    if (!user) return;
    if (!city.trim()) {
      toast({ title: "Lengkapi data", description: "Kota / kabupaten wajib diisi." });
      return;
    }

    setSubmitting(true);
    try {
      const briefData: ImbBriefData = {
        city: city.trim(),
        buildingType,
        landSize,
        buildingSize,
        hasExistingPermit,
      };

      const { data, error } = await supabase
        .from("projects")
        .insert({
          client_id: user.id,
          service_type: "imb",
          status: "brief_submitted",
          brief_data: briefData,
          estimate_total: 0,
          estimate_design_fee: 0,
          commitment_fee: 2_500_000,
          estimated_weeks: null,
          client_name: profile?.full_name,
          client_phone: profile?.phone,
          client_email: user.email,
          client_city: city.trim(),
          notes: notes || null,
        })
        .select("id")
        .single();

      if (error) throw error;
      toast({
        title: "Permintaan IMB terkirim!",
        description: `Project #${data.id.slice(0, 8).toUpperCase()}. Tim AMP akan menghubungi dengan quote yang sesuai daerah Anda.`,
      });
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      toast({ title: "Gagal submit", description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4 lg:px-8">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="AMP — Asta Mandiri Prakarsa" className="h-9 w-auto object-contain" />
          </Link>
          <Link to="/mulai" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Pilih Layanan Lain
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[800px] px-4 py-8 lg:px-8 lg:py-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Layanan</div>
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">Pengurusan IMB / PBG</h1>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Setiap daerah punya regulasi berbeda untuk IMB. Isi data berikut, tim AMP akan menghubungi Anda dengan quote yang sesuai daerah dan kompleksitas bangunan.
          </p>
        </motion.div>

        <div className="mt-8 rounded-3xl border border-border bg-background p-6 lg:p-8 space-y-6">
          <Section icon={MapPin} title="Lokasi" hint="Kota / kabupaten lokasi bangunan">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Mis. Jakarta Selatan, Bandung, Tangerang Selatan"
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </Section>

          <Section icon={Building} title="Jenis Bangunan">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {BUILDING_TYPES.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBuildingType(b.id)}
                  className={`text-left rounded-xl border p-3 transition ${
                    buildingType === b.id ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div className="text-sm font-semibold">{b.label}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{b.desc}</div>
                </button>
              ))}
            </div>
          </Section>

          <Section icon={Ruler} title="Luas Tanah & Bangunan">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Luas Tanah (m²)</label>
                <input
                  type="number"
                  value={landSize}
                  onChange={(e) => setLandSize(parseInt(e.target.value) || 0)}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Luas Bangunan (m²)</label>
                <input
                  type="number"
                  value={buildingSize}
                  onChange={(e) => setBuildingSize(parseInt(e.target.value) || 0)}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </Section>

          <Section title="Apakah Sudah Punya IMB Sebelumnya?">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setHasExistingPermit(false)}
                className={`text-left rounded-xl border p-3 transition ${
                  !hasExistingPermit ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="text-sm font-semibold">Belum ada</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">Perlu IMB baru</div>
              </button>
              <button
                onClick={() => setHasExistingPermit(true)}
                className={`text-left rounded-xl border p-3 transition ${
                  hasExistingPermit ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="text-sm font-semibold">Sudah ada</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">Perlu perpanjangan / revisi</div>
              </button>
            </div>
          </Section>

          <Section title="Catatan Tambahan">
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Mis. kondisi bangunan saat ini, urgensi, dokumen yang sudah ada..."
              className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </Section>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 leading-relaxed">
            <strong>Catatan:</strong> Harga IMB sangat bervariasi tergantung daerah dan dinas terkait. Tim AMP akan memberikan quote pasti setelah review brief Anda — biasanya dalam 1-2 hari kerja.
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-red hover:shadow-glow transition disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Mengirim..." : "Kirim Permintaan Quote IMB"}
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
};

const Section = ({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon?: typeof FileText;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-start gap-2.5">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />}
      <div>
        <h3 className="text-sm font-bold tracking-tight">{title}</h3>
        {hint && <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>}
      </div>
    </div>
    <div className="mt-3">{children}</div>
  </div>
);

export default WizardIMB;
