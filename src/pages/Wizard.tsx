import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardList,
  Calculator,
  Wallet,
  Sparkles,
  Home,
  Building2,
  TreePine,
  Castle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Ruler,
  Layers,
  BedDouble,
  Palette,
  Wallet as WalletIcon,
  Sun,
  Wind,
  Trees,
  Lightbulb,
  HeadphonesIcon,
  MessageCircle,
  ImageIcon,
  PenTool,
  Box,
  CheckCircle2,
} from "lucide-react";
import logo from "@/assets/amp-logo.png";
import heroVilla from "@/assets/hero-villa.jpg";
import projVilla from "@/assets/proj-villa.jpg";
import projTropical from "@/assets/proj-tropical.jpg";
import projModern from "@/assets/proj-modern.jpg";
import projInterior from "@/assets/proj-interior.jpg";
import projCafe from "@/assets/proj-cafe.jpg";
import projRenovation from "@/assets/proj-renovation.jpg";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";

type Style = "modern" | "tropical" | "minimalist" | "classic";

interface FormState {
  name: string;
  phone: string;
  email: string;
  landSize: number;
  buildingSize: number;
  floors: number;
  bedrooms: number;
  style: Style;
  budgetTier: "standard" | "premium" | "luxury";
  city: string;
  notes: string;
}

const initialForm: FormState = {
  name: "",
  phone: "",
  email: "",
  landSize: 120,
  buildingSize: 90,
  floors: 2,
  bedrooms: 3,
  style: "modern",
  budgetTier: "premium",
  city: "",
  notes: "",
};

const steps = [
  { id: 1, title: "Kuesioner", icon: ClipboardList },
  { id: 2, title: "Estimasi", icon: Calculator },
  { id: 3, title: "Commitment Fee", icon: Wallet },
  { id: 4, title: "Mulai Desain", icon: Sparkles },
];

const styleOptions: { value: Style; label: string; icon: typeof Home }[] = [
  { value: "modern", label: "Modern", icon: Building2 },
  { value: "tropical", label: "Tropis", icon: TreePine },
  { value: "minimalist", label: "Minimalis", icon: Home },
  { value: "classic", label: "Klasik", icon: Castle },
];

const tierMultiplier = { standard: 4_500_000, premium: 6_500_000, luxury: 9_500_000 } as const;

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const formatIDRShort = (n: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(n);

const conceptHeroes = [heroVilla, projModern, projVilla, projTropical];
const moodboards = [
  { img: projTropical, label: "Modern Tropical" },
  { img: projInterior, label: "Natural Material" },
  { img: projCafe, label: "Warm & Elegant" },
  { img: projRenovation, label: "Open Space Living" },
];
const concepts = [
  { img: projModern, name: "Konsep A", desc: "Desain modern tropis dengan bukaan lebar untuk pencahayaan alami optimal.", floors: 2, bedrooms: 3, m2: 90, recommended: true },
  { img: projVilla, name: "Konsep B", desc: "Desain minimalis elegan dengan material natural dan aksen kayu.", floors: 2, bedrooms: 3, m2: 88 },
  { img: projTropical, name: "Konsep C", desc: "Desain modern kontemporer dengan balkon luas dan taman dalam.", floors: 2, bedrooms: 3, m2: 92 },
];
const designProcess = [
  { id: 1, title: "Analisis Kebutuhan", desc: "Menganalisis data & preferensi", done: true },
  { id: 2, title: "Konsep & Sketsa", desc: "Membuat konsep awal", done: true },
  { id: 3, title: "Visualisasi 3D", desc: "Merender visual terbaik", active: true },
  { id: 4, title: "Evaluasi & Optimasi", desc: "Menyempurnakan desain" },
];

const Wizard = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [paid, setPaid] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const [floorTab, setFloorTab] = useState<1 | 2>(1);

  const estimate = useMemo(() => {
    const perM2 = tierMultiplier[form.budgetTier];
    const total = form.buildingSize * perM2 * form.floors;
    const designFee = Math.round(total * 0.04);
    const commitment = 2_500_000;
    const weeks = Math.max(8, Math.round(form.buildingSize / 12));
    const breakdown = [
      { label: "Pekerjaan Struktur", pct: 35 },
      { label: "Pekerjaan Arsitektur", pct: 30 },
      { label: "Pekerjaan MEP", pct: 20 },
      { label: "Finishing", pct: 10 },
      { label: "Lain - lain", pct: 5 },
    ].map((b) => ({ ...b, value: Math.round((total * b.pct) / 100) }));
    return { perM2, total, designFee, commitment, weeks, breakdown };
  }, [form]);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const canNext = () => {
    if (step === 1) return form.name.trim() && form.phone.trim() && form.city.trim();
    return true;
  };

  const next = () => {
    if (!canNext()) {
      toast({ title: "Lengkapi data", description: "Mohon isi nama, nomor HP, dan kota." });
      return;
    }
    setStep((s) => Math.min(4, s + 1));
  };
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const pay = () => {
    setTimeout(() => {
      setPaid(true);
      setStep(4);
      toast({ title: "Pembayaran berhasil", description: "Tim arsitek AMP akan menghubungi Anda." });
    }, 700);
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto flex max-w-[1400px] flex-col lg:flex-row">
        {/* SIDEBAR */}
        <aside className="lg:sticky lg:top-0 lg:h-screen lg:w-[300px] lg:flex-shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-background">
          <div className="flex h-full flex-col p-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="AMP" className="h-10 w-10 object-contain" />
              <div className="leading-tight">
                <div className="text-2xl font-extrabold tracking-tight">AMP</div>
                <div className="text-[9px] tracking-[0.22em] text-muted-foreground font-semibold">
                  ASTA MANDIRI<br />PRAKARSA
                </div>
              </div>
            </Link>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
            </Link>

            {/* Summary */}
            <div className="mt-8">
              <div className="text-[10px] font-bold tracking-[0.18em] text-muted-foreground">
                RINGKASAN PERENCANAAN
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <SummaryRow icon={Ruler} label="Luas Tanah" value={`${form.landSize} m²`} />
                <SummaryRow icon={Home} label="Luas Bangunan" value={`${form.buildingSize} m²`} />
                <SummaryRow icon={Layers} label="Jumlah Lantai" value={`${form.floors} Lantai`} />
                <SummaryRow icon={BedDouble} label="Kamar Tidur" value={`${form.bedrooms} Kamar`} />
                <SummaryRow icon={Palette} label="Gaya Arsitektur" value={<span className="capitalize">{form.style}</span>} />
                <SummaryRow icon={WalletIcon} label="Tier Anggaran" value={<span className="capitalize">{form.budgetTier}</span>} />
                <div className="pt-1 text-right text-xs text-muted-foreground">
                  Rp {formatIDRShort(estimate.perM2)} / m²
                </div>
              </div>
            </div>

            {/* AI Card */}
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-primary" /> AI Analysis
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                AI sedang menganalisis kebutuhan Anda untuk menghasilkan desain terbaik.
              </p>
              <button className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                Lihat Analisis <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {/* Progress list */}
            <div className="mt-6">
              <div className="text-[10px] font-bold tracking-[0.18em] text-muted-foreground">PROGRESS</div>
              <ul className="mt-3 space-y-1">
                {steps.map((s) => {
                  const done = step > s.id;
                  const active = step === s.id;
                  return (
                    <li
                      key={s.id}
                      className={`flex items-center justify-between rounded-lg px-2 py-2 text-sm ${
                        active ? "text-primary font-semibold" : done ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-bold ${
                            active
                              ? "border-primary bg-primary/10 text-primary"
                              : done
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {done ? <Check className="h-3 w-3" /> : s.id}
                        </span>
                        {s.title}
                      </span>
                      {done && <Check className="h-4 w-4 text-primary/60" />}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Help card */}
            <div className="mt-auto rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                  <HeadphonesIcon className="h-5 w-5 text-foreground/70" />
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-foreground">Butuh bantuan?</div>
                  <p className="mt-0.5 text-muted-foreground leading-relaxed">
                    Konsultasi gratis dengan tim arsitek kami.
                  </p>
                  <a
                    href="https://wa.me/6281200000000"
                    className="mt-2 inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                  >
                    Hubungi Kami <MessageCircle className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <section className="flex-1 p-6 lg:p-10 space-y-6">
          {/* Top bar: stepper + save */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <ol className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
              {steps.map((s, i) => {
                const active = step === s.id;
                const done = step > s.id;
                return (
                  <li key={s.id} className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    <button
                      onClick={() => done && setStep(s.id)}
                      className="flex items-center gap-2"
                    >
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : done
                            ? "border-2 border-primary bg-background text-primary"
                            : "border-2 border-border bg-background text-muted-foreground"
                        }`}
                      >
                        {done ? <Check className="h-3.5 w-3.5" /> : s.id}
                      </span>
                      <span
                        className={`text-sm ${active ? "font-bold text-primary" : done ? "font-medium text-foreground" : "text-muted-foreground"}`}
                      >
                        {s.title}
                      </span>
                    </button>
                    {i < steps.length - 1 && <span className="hidden sm:block h-px w-6 bg-border" />}
                  </li>
                );
              })}
            </ol>
            <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition self-start lg:self-auto">
              <Bookmark className="h-4 w-4" /> Simpan & Keluar
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {step === 1 && <StepQuestionnaire form={form} update={update} />}
              {step === 2 && <StepEstimate form={form} estimate={estimate} />}
              {step === 3 && <StepCommitment estimate={estimate} onPay={pay} />}
              {step === 4 && (
                <StepDesign
                  form={form}
                  estimate={estimate}
                  heroIdx={heroIdx}
                  setHeroIdx={setHeroIdx}
                  floorTab={floorTab}
                  setFloorTab={setFloorTab}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer nav */}
          {step < 4 && (
            <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">
              <button
                onClick={prev}
                disabled={step === 1}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4" /> Sebelumnya
              </button>
              <div className="text-xs text-muted-foreground">Langkah {step} dari {steps.length}</div>
              {step === 3 ? (
                <button
                  onClick={pay}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-red hover:shadow-glow transition"
                >
                  Bayar Sekarang <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-red hover:shadow-glow transition"
                >
                  Lanjut <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

/* ---------- Sidebar Row ---------- */
const SummaryRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Home;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-center justify-between">
    <span className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-4 w-4" /> {label}
    </span>
    <span className="font-semibold text-foreground">{value}</span>
  </div>
);

/* ---------- STEP 1 ---------- */
const StepQuestionnaire = ({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) => (
  <div className="rounded-3xl border border-border bg-background p-6 lg:p-8 space-y-6">
    <div>
      <h2 className="text-2xl font-bold tracking-tight">Ceritakan rumah impian Anda</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Lengkapi data berikut untuk membantu AI & arsitek kami memahami kebutuhan Anda.
      </p>
    </div>
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Field label="Nama Lengkap *">
        <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Mis. Andi Wijaya" />
      </Field>
      <Field label="Nomor WhatsApp *">
        <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+62 812..." />
      </Field>
      <Field label="Email">
        <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="nama@email.com" />
      </Field>
      <Field label="Kota / Lokasi *">
        <Input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Mis. Jakarta Selatan" />
      </Field>

      <SliderField label="Luas Tanah" value={`${form.landSize} m²`} className="lg:col-span-2">
        <Slider min={50} max={1000} step={10} value={[form.landSize]} onValueChange={(v) => update("landSize", v[0])} />
      </SliderField>
      <SliderField label="Luas Bangunan" value={`${form.buildingSize} m²`} className="lg:col-span-2">
        <Slider min={36} max={800} step={6} value={[form.buildingSize]} onValueChange={(v) => update("buildingSize", v[0])} />
      </SliderField>

      <Field label="Jumlah Lantai">
        <div className="flex gap-2">
          {[1, 2, 3].map((n) => (
            <Pill key={n} active={form.floors === n} onClick={() => update("floors", n)}>{n} Lantai</Pill>
          ))}
        </div>
      </Field>
      <Field label="Jumlah Kamar Tidur">
        <div className="flex gap-2">
          {[2, 3, 4, 5].map((n) => (
            <Pill key={n} active={form.bedrooms === n} onClick={() => update("bedrooms", n)}>{n}</Pill>
          ))}
        </div>
      </Field>

      <Field label="Gaya Arsitektur" className="lg:col-span-2">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {styleOptions.map((s) => {
            const Icon = s.icon;
            const active = form.style === s.value;
            return (
              <button
                key={s.value}
                onClick={() => update("style", s.value)}
                className={`group rounded-2xl border p-4 text-left transition ${
                  active ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <div className="mt-3 text-sm font-semibold">{s.label}</div>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Tier Anggaran" className="lg:col-span-2">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(["standard", "premium", "luxury"] as const).map((t) => {
            const active = form.budgetTier === t;
            return (
              <button
                key={t}
                onClick={() => update("budgetTier", t)}
                className={`rounded-2xl border p-4 text-left transition ${
                  active ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
                }`}
              >
                <div className="text-sm font-semibold capitalize">{t}</div>
                <div className="mt-1 text-xs text-muted-foreground">{formatIDR(tierMultiplier[t])} / m²</div>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Catatan Tambahan" className="lg:col-span-2">
        <textarea
          rows={3}
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Mis. butuh kolam renang, taman tropis, home office..."
        />
      </Field>
    </div>
  </div>
);

const Field = ({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    <Label>{label}</Label>
    {children}
  </div>
);
const SliderField = ({ label, value, children, className = "" }: { label: string; value: string; children: React.ReactNode; className?: string }) => (
  <div className={`space-y-3 ${className}`}>
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      <span className="text-sm font-semibold text-primary">{value}</span>
    </div>
    {children}
  </div>
);
const Pill = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${
      active ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-foreground/30"
    }`}
  >
    {children}
  </button>
);

/* ---------- STEP 2 ---------- */
const StepEstimate = ({ form, estimate }: { form: FormState; estimate: ReturnType<typeof useMemo<any>> }) => (
  <div className="grid gap-6 lg:grid-cols-5">
    <div className="lg:col-span-3 rounded-3xl border border-border bg-background p-6 lg:p-8 space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Estimasi Proyek Anda</h2>
      <p className="text-sm text-muted-foreground">
        Berdasarkan input Anda, berikut estimasi anggaran pembangunan dan biaya desain.
      </p>
      <div className="rounded-2xl border border-border bg-muted/30 p-6 grid grid-cols-2 gap-4 text-sm">
        <KV k="Luas Bangunan" v={`${form.buildingSize} m²`} />
        <KV k="Jumlah Lantai" v={form.floors} />
        <KV k="Gaya" v={<span className="capitalize">{form.style}</span>} />
        <KV k="Tier" v={<span className="capitalize">{form.budgetTier}</span>} />
        <KV k="Harga / m²" v={formatIDR(estimate.perM2)} />
        <KV k="Estimasi Waktu" v={`${estimate.weeks} minggu`} />
      </div>
    </div>
    <div className="lg:col-span-2">
      <div className="rounded-3xl bg-secondary text-secondary-foreground p-7 shadow-elevated">
        <div className="text-xs uppercase tracking-[0.2em] text-secondary-foreground/60">Total Estimasi</div>
        <div className="mt-3 text-3xl font-bold lg:text-4xl">{formatIDR(estimate.total)}</div>
        <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-secondary-foreground/70">Biaya Desain (≈4%)</span>
            <span className="font-semibold">{formatIDR(estimate.designFee)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-secondary-foreground/70">Commitment Fee</span>
            <span className="font-semibold text-primary">{formatIDR(estimate.commitment)}</span>
          </div>
        </div>
        <p className="mt-5 text-xs text-secondary-foreground/60">
          Commitment fee bersifat refundable & dipotong dari biaya desain final.
        </p>
      </div>
    </div>
  </div>
);
const KV = ({ k, v }: { k: string; v: React.ReactNode }) => (
  <div>
    <div className="text-xs uppercase tracking-wider text-muted-foreground">{k}</div>
    <div className="mt-1 font-semibold text-foreground">{v}</div>
  </div>
);

/* ---------- STEP 3 ---------- */
const StepCommitment = ({ estimate, onPay }: { estimate: any; onPay: () => void }) => (
  <div className="grid gap-6 lg:grid-cols-5">
    <div className="lg:col-span-3 rounded-3xl border border-border bg-background p-6 lg:p-8 space-y-5">
      <h2 className="text-2xl font-bold tracking-tight">Commitment Fee</h2>
      <p className="text-sm text-muted-foreground">
        Bayar commitment fee untuk mengamankan slot tim arsitek AMP. Fee ini akan dipotong dari biaya desain final.
      </p>
      <ul className="space-y-3">
        {[
          "Slot tim arsitek tersimpan untuk Anda",
          "Konsultasi awal dengan principal architect",
          "Site visit & analisa lokasi",
          "Mood board awal & arah konsep desain",
          "100% dipotong dari biaya desain bila lanjut",
        ].map((b) => (
          <li key={b} className="flex items-start gap-3 text-sm">
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Check className="h-3 w-3" />
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="lg:col-span-2">
      <div className="rounded-3xl border border-border bg-background p-7 shadow-elevated">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total Bayar</div>
        <div className="mt-2 text-4xl font-bold text-primary">{formatIDR(estimate.commitment)}</div>
        <div className="mt-5 space-y-3">
          {["Transfer Bank (BCA, Mandiri, BNI)", "Virtual Account", "QRIS / E-Wallet"].map((m) => (
            <div key={m} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm">
              <span className="h-2 w-2 rounded-full bg-primary" /> {m}
            </div>
          ))}
        </div>
        <button
          onClick={onPay}
          className="mt-6 w-full rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-red transition hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]"
        >
          Bayar {formatIDR(estimate.commitment)}
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">Pembayaran aman & terenkripsi</p>
      </div>
    </div>
  </div>
);

/* ---------- STEP 4 ---------- */
const StepDesign = ({
  form,
  estimate,
  heroIdx,
  setHeroIdx,
  floorTab,
  setFloorTab,
}: {
  form: FormState;
  estimate: any;
  heroIdx: number;
  setHeroIdx: (n: number) => void;
  floorTab: 1 | 2;
  setFloorTab: (n: 1 | 2) => void;
}) => {
  const heroSrc = conceptHeroes[heroIdx % conceptHeroes.length];
  return (
    <>
      {/* AI Hero card */}
      <div className="rounded-3xl border border-border bg-background p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
              AI sedang merancang
              <br />
              <span className="text-primary">rumah impian Anda</span>{" "}
              <Sparkles className="inline h-7 w-7 text-primary" />
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-md">
              Berdasarkan preferensi dan kebutuhan yang Anda berikan, kami menggabungkan teknologi AI dan pengalaman arsitek profesional untuk menciptakan desain terbaik.
            </p>
            <div className="mt-6">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-semibold">Proses AI: 75%</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: "75%" }} />
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl">
            <img src={heroSrc} alt="Konsep" className="aspect-[16/11] w-full object-cover" />
            <div className="absolute left-3 bottom-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold backdrop-blur">
              Konsep Utama
            </div>
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-semibold backdrop-blur">
                {(heroIdx % conceptHeroes.length) + 1} / {conceptHeroes.length}
              </span>
              <button
                onClick={() => setHeroIdx((heroIdx - 1 + conceptHeroes.length) % conceptHeroes.length)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground hover:bg-background transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setHeroIdx((heroIdx + 1) % conceptHeroes.length)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background hover:opacity-90 transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Process strip */}
      <div className="rounded-2xl border border-border bg-background p-4 lg:p-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {designProcess.map((p, i) => {
            const Icon = [ImageIcon, PenTool, Box, CheckCircle2][i];
            return (
              <div key={p.id} className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                    p.done
                      ? "bg-primary/10 text-primary"
                      : p.active
                      ? "border-2 border-primary bg-background text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {p.done ? <Check className="h-4 w-4" /> : p.active ? <Icon className="h-4 w-4" /> : <span className="text-sm font-bold">{p.id}</span>}
                </div>
                <div>
                  <div className="text-sm font-semibold">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Moodboard */}
      <div className="rounded-3xl border border-border bg-background p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">
              Moodboard & Inspirasi <span className="text-xs font-medium text-muted-foreground">(AI Generated)</span>
            </h3>
          </div>
          <button className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {moodboards.map((m) => (
            <div key={m.label} className="group">
              <div className="overflow-hidden rounded-2xl">
                <img src={m.img} alt={m.label} className="aspect-square w-full object-cover transition group-hover:scale-105" />
              </div>
              <div className="mt-2 text-center text-sm font-medium">{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Concepts */}
      <div className="rounded-3xl border border-border bg-background p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Konsep Desain Awal</h3>
            <p className="text-xs text-muted-foreground">Beberapa opsi konsep yang disarankan AI berdasarkan kebutuhan Anda.</p>
          </div>
          <button className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Lihat Semua Konsep <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {concepts.map((c) => (
            <div key={c.name} className="rounded-2xl border border-border overflow-hidden bg-background hover:shadow-elevated transition">
              <div className="relative">
                <img src={c.img} alt={c.name} className="aspect-[4/3] w-full object-cover" />
                {c.recommended && (
                  <span className="absolute left-3 top-3 rounded-md bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
                    Direkomendasikan
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="font-bold">{c.name}</div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Layers className="h-3 w-3" /> {c.floors} Lantai</span>
                  <span className="inline-flex items-center gap-1"><BedDouble className="h-3 w-3" /> {c.bedrooms} Kamar</span>
                  <span className="inline-flex items-center gap-1"><Ruler className="h-3 w-3" /> {c.m2} m²</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insight + Floor Plan + Budget */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI Insight */}
        <div className="rounded-3xl border border-border bg-background p-6 space-y-4">
          <div>
            <h3 className="font-bold">AI Insight</h3>
            <p className="text-xs text-muted-foreground">Rekomendasi cerdas untuk hasil terbaik.</p>
          </div>
          <ul className="space-y-3">
            {[
              { icon: Sun, t: "Pencahayaan Optimal", d: "Orientasi bukaan utama menghadap timur." },
              { icon: Wind, t: "Sirkulasi Udara Baik", d: "Ventilasi silang diterapkan untuk kenyamanan alami." },
              { icon: Trees, t: "Ruang Hijau", d: "Taman dan area hijau 18% dari total lahan." },
            ].map((x) => {
              const Icon = x.icon;
              return (
                <li key={x.t} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-muted">
                    <Icon className="h-4 w-4 text-foreground/70" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{x.t}</div>
                    <div className="text-xs text-muted-foreground">{x.d}</div>
                  </div>
                </li>
              );
            })}
          </ul>
          <button className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/15 transition">
            <Lightbulb className="h-3 w-3" /> Lihat Semua Insight
          </button>
        </div>

        {/* Floor plan */}
        <div className="rounded-3xl border border-border bg-background p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold">Preview Denah <span className="text-xs font-medium text-muted-foreground">(AI)</span></h3>
              <p className="text-xs text-muted-foreground">Layout awal berdasarkan kebutuhan ruang Anda.</p>
            </div>
          </div>
          <div className="flex gap-2">
            {([1, 2] as const).map((n) => (
              <button
                key={n}
                onClick={() => setFloorTab(n)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  floorTab === n ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Lantai {n}
              </button>
            ))}
          </div>
          <div className="rounded-2xl border border-border bg-muted/30 p-4 aspect-[4/3] flex items-center justify-center">
            <img src={projInterior} alt="Denah" className="max-h-full rounded-xl object-contain opacity-90" />
          </div>
          <button className="text-xs font-semibold text-primary hover:underline">Lihat Detail Denah →</button>
        </div>

        {/* Budget estimate */}
        <div className="rounded-3xl border border-border bg-background p-6 space-y-4">
          <div>
            <h3 className="font-bold">Estimasi Anggaran <span className="text-xs font-medium text-muted-foreground">(AI)</span></h3>
            <p className="text-xs text-muted-foreground">Perkiraan biaya berdasarkan tier <span className="capitalize">{form.budgetTier}</span>.</p>
          </div>
          <div>
            <div className="text-2xl font-extrabold">{formatIDR(estimate.total)}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">Estimasi Kasar</div>
          </div>
          <ul className="space-y-2 text-xs">
            {estimate.breakdown.map((b: any) => (
              <li key={b.label} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {b.label}
                </span>
                <span className="text-muted-foreground">{b.pct}%</span>
                <span className="font-semibold">{formatIDR(b.value)}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-xl bg-primary/5 p-3 text-[11px] text-foreground/80">
            Estimasi ini dapat berubah setelah desain final dan perhitungan detail.
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="rounded-3xl border border-border bg-background p-5 lg:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="hidden sm:block h-14 w-14 rounded-xl overflow-hidden flex-shrink-0">
            <img src={projCafe} alt="Tim" className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="text-base font-bold">Siap untuk menyempurnakan desain Anda?</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Arsitek kami akan menyempurnakan konsep ini menjadi desain final yang siap untuk direalisasikan bersama Anda.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 self-stretch lg:self-auto">
          <a
            href="https://wa.me/6281200000000"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-red hover:shadow-glow transition flex-1 lg:flex-none justify-center"
          >
            Lanjut ke Konsultasi <ArrowRight className="h-4 w-4" />
          </a>
          <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium hover:bg-muted transition">
            <Bookmark className="h-4 w-4" /> Simpan Konsep
          </button>
        </div>
      </div>
    </>
  );
};

export default Wizard;
