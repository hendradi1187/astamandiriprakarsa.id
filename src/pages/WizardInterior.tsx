import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sofa,
  Loader2,
  Check,
  Ruler,
  Layers,
  Sparkles,
  Wallet,
  ListChecks,
  Palette,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { INTERIOR_PRICE_PER_M2, type InteriorBriefData } from "@/lib/services";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/amp-logotype.png";
import { Slider } from "@/components/ui/slider";

const ROOM_OPTIONS = [
  { id: "ruang_tamu", label: "Ruang Tamu" },
  { id: "ruang_keluarga", label: "Ruang Keluarga" },
  { id: "dapur", label: "Dapur" },
  { id: "kamar_utama", label: "Kamar Utama" },
  { id: "kamar_anak", label: "Kamar Anak" },
  { id: "kamar_mandi", label: "Kamar Mandi" },
  { id: "ruang_makan", label: "Ruang Makan" },
  { id: "ruang_kerja", label: "Ruang Kerja" },
] as const;

const STYLES = [
  { value: "modern" as const, label: "Modern" },
  { value: "minimalist" as const, label: "Minimalis" },
  { value: "scandinavian" as const, label: "Scandinavian" },
  { value: "industrial" as const, label: "Industrial" },
  { value: "tropical" as const, label: "Tropis" },
  { value: "classic" as const, label: "Klasik" },
];

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const WizardInterior = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const [buildingSize, setBuildingSize] = useState(80);
  const [scope, setScope] = useState<InteriorBriefData["scope"]>("partial");
  const [rooms, setRooms] = useState<string[]>(["ruang_tamu", "dapur"]);
  const [style, setStyle] = useState<InteriorBriefData["style"]>("modern");
  const [hasFurniture, setHasFurniture] = useState(false);
  const [notes, setNotes] = useState("");

  const estimate = useMemo(() => {
    const total = buildingSize * INTERIOR_PRICE_PER_M2;
    return {
      designFee: total,
      total: 0,
      commitment: 2_500_000,
      weeks: 4,
    };
  }, [buildingSize]);

  const toggleRoom = (id: string) =>
    setRooms((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]));

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Silakan login", description: "Anda harus masuk dulu untuk submit." });
      return;
    }
    if (rooms.length === 0) {
      toast({ title: "Pilih ruangan", description: "Pilih minimal 1 ruangan yang akan direnovasi." });
      return;
    }

    setSubmitting(true);
    try {
      const briefData: InteriorBriefData = {
        buildingSize,
        scope,
        rooms,
        style,
        hasFurniture,
      };
      const { data, error } = await supabase
        .from("projects")
        .insert({
          client_id: user.id,
          service_type: "interior_existing",
          status: "brief_submitted",
          brief_data: briefData,
          estimate_total: 0,
          estimate_design_fee: estimate.designFee,
          commitment_fee: estimate.commitment,
          estimated_weeks: estimate.weeks,
          client_name: profile?.full_name,
          client_phone: profile?.phone,
          client_email: user.email,
          client_city: profile?.city,
          notes: notes || null,
        })
        .select("id")
        .single();

      if (error) throw error;
      toast({
        title: "Brief berhasil dikirim!",
        description: `Project #${data.id.slice(0, 8).toUpperCase()} dibuat. Tim AMP akan menghubungi Anda.`,
      });
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat submit.";
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

      <div className="mx-auto max-w-[1200px] px-4 py-8 lg:px-8 lg:py-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sofa className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Layanan</div>
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">Desain Interior Existing</h1>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
            Renovasi interior rumah Anda dengan gambar detail lengkap. Tarif flat Rp 400rb/m², output sesuai pricelist resmi (3D Interior, pola lantai, detail furniture).
          </p>
        </motion.div>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          {/* FORM */}
          <div className="lg:col-span-3 space-y-6">
            <Section icon={Ruler} title="Luas Bangunan Existing">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Total luas yang akan didesain</span>
                <span className="text-sm font-bold text-primary">{buildingSize} m²</span>
              </div>
              <Slider min={20} max={500} step={5} value={[buildingSize]} onValueChange={(v) => setBuildingSize(v[0])} />
            </Section>

            <Section icon={Layers} title="Scope Renovasi">
              <div className="grid grid-cols-2 gap-3">
                <RadioCard
                  active={scope === "full"}
                  title="Full Renovation"
                  desc="Seluruh interior rumah"
                  onClick={() => setScope("full")}
                />
                <RadioCard
                  active={scope === "partial"}
                  title="Partial"
                  desc="Beberapa ruangan saja"
                  onClick={() => setScope("partial")}
                />
              </div>
            </Section>

            <Section icon={ListChecks} title="Ruangan yang Akan Direnovasi" hint="Pilih satu atau lebih.">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ROOM_OPTIONS.map((r) => {
                  const active = rooms.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      onClick={() => toggleRoom(r.id)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                        active
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-foreground hover:border-foreground/30"
                      }`}
                    >
                      <span className={`flex h-4 w-4 items-center justify-center rounded border ${active ? "border-primary bg-primary" : "border-border"}`}>
                        {active && <Check className="h-3 w-3 text-primary-foreground" />}
                      </span>
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </Section>

            <Section icon={Palette} title="Gaya Interior">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STYLES.map((s) => (
                  <RadioCard
                    key={s.value}
                    active={style === s.value}
                    title={s.label}
                    onClick={() => setStyle(s.value)}
                  />
                ))}
              </div>
            </Section>

            <Section icon={Sparkles} title="Pengadaan Furniture">
              <div className="grid grid-cols-2 gap-3">
                <RadioCard
                  active={!hasFurniture}
                  title="Gambar Saja"
                  desc="Klien sourcing sendiri"
                  onClick={() => setHasFurniture(false)}
                />
                <RadioCard
                  active={hasFurniture}
                  title="Termasuk Furniture"
                  desc="AMP bantu rekomendasi"
                  onClick={() => setHasFurniture(true)}
                />
              </div>
            </Section>

            <Section title="Catatan Tambahan">
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mis. preferensi warna, kebutuhan storage, kondisi existing..."
                className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </Section>
          </div>

          {/* SUMMARY */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 rounded-3xl bg-secondary text-secondary-foreground p-6 shadow-elevated">
              <div className="text-xs uppercase tracking-[0.2em] opacity-60">Estimasi Biaya Desain</div>
              <div className="mt-3 text-3xl lg:text-4xl font-bold">{formatIDR(estimate.designFee)}</div>
              <div className="mt-1 text-xs opacity-60">{buildingSize} m² × Rp 400rb / m²</div>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Estimasi Waktu</span>
                  <span className="font-semibold">± {estimate.weeks} minggu</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Commitment Fee</span>
                  <span className="font-semibold text-primary">{formatIDR(estimate.commitment)}</span>
                </div>
              </div>
              <p className="mt-4 text-[11px] opacity-60 leading-relaxed">
                Commitment fee bersifat <strong>non-refundable</strong> dan terpisah dari biaya desain. Mengamankan slot tim arsitek AMP.
              </p>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-red hover:shadow-glow transition disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? "Mengirim..." : "Submit Brief & Lanjut Pembayaran"}
                <Wallet className="h-4 w-4" />
              </button>
              <p className="mt-3 text-center text-[11px] opacity-60">
                Brief disimpan, tim AMP akan menghubungi via WhatsApp.
              </p>
            </div>
          </div>
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
  icon?: typeof Sofa;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-border bg-background p-5 lg:p-6">
    <div className="flex items-start gap-2.5">
      {Icon && <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />}
      <div>
        <h3 className="text-sm font-bold tracking-tight">{title}</h3>
        {hint && <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>}
      </div>
    </div>
    <div className="mt-4">{children}</div>
  </div>
);

const RadioCard = ({
  active,
  title,
  desc,
  onClick,
}: {
  active: boolean;
  title: string;
  desc?: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`text-left rounded-xl border p-3 transition ${
      active ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
    }`}
  >
    <div className="text-sm font-semibold">{title}</div>
    {desc && <div className="mt-0.5 text-[11px] text-muted-foreground">{desc}</div>}
  </button>
);

export default WizardInterior;
