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
} from "lucide-react";
import logo from "@/assets/amp-logo.png";
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
  floors: 1,
  bedrooms: 3,
  style: "modern",
  budgetTier: "premium",
  city: "",
  notes: "",
};

const steps = [
  { id: 1, title: "Kuesioner", subtitle: "Ceritakan rumah impian", icon: ClipboardList },
  { id: 2, title: "Estimasi", subtitle: "Perkiraan biaya & waktu", icon: Calculator },
  { id: 3, title: "Commitment Fee", subtitle: "Amankan slot desain", icon: Wallet },
  { id: 4, title: "Mulai Desain", subtitle: "Tim arsitek bekerja", icon: Sparkles },
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

const Wizard = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [paid, setPaid] = useState(false);

  const estimate = useMemo(() => {
    const perM2 = tierMultiplier[form.budgetTier];
    const total = form.buildingSize * perM2 * form.floors;
    const designFee = Math.round(total * 0.04);
    const commitment = 2_500_000;
    const weeks = Math.max(8, Math.round(form.buildingSize / 12));
    return { perM2, total, designFee, commitment, weeks };
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
    }, 900);
  };

  const progress = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 nav-blur border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:h-20 lg:px-10">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="AMP" className="h-9 w-9 lg:h-10 lg:w-10 object-contain" />
            <div className="leading-tight">
              <div className="text-[10px] lg:text-[11px] tracking-[0.22em] text-muted-foreground font-medium">ASTA MANDIRI</div>
              <div className="text-sm lg:text-base font-bold tracking-tight">PRAKARSA</div>
            </div>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition"
          >
            <ArrowLeft className="h-4 w-4" /> Beranda
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-8 lg:px-10 lg:pt-20">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground/70">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Wizard Perencanaan Rumah
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight lg:text-5xl">
            Wujudkan rumah impian dalam <span className="text-primary">4 langkah</span>.
          </h1>
          <p className="mt-4 text-base text-muted-foreground lg:text-lg">
            Mulai dari kuesioner singkat, dapatkan estimasi otomatis, amankan slot dengan commitment fee, lalu tim arsitek AMP mulai mendesain.
          </p>
        </div>
      </section>

      {/* Stepper */}
      <section className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="rounded-3xl border border-border bg-card p-6 lg:p-8 shadow-elevated">
          {/* Progress bar */}
          <div className="relative mb-8">
            <div className="absolute left-0 right-0 top-5 h-[2px] bg-border" />
            <div
              className="absolute left-0 top-5 h-[2px] bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
            <ol className="relative grid grid-cols-4 gap-2">
              {steps.map((s) => {
                const active = step === s.id;
                const done = step > s.id;
                const Icon = s.icon;
                return (
                  <li key={s.id} className="flex flex-col items-center text-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        done
                          ? "bg-primary border-primary text-primary-foreground"
                          : active
                          ? "bg-background border-primary text-primary scale-110 shadow-red"
                          : "bg-background border-border text-muted-foreground"
                      }`}
                    >
                      {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <div className="mt-3 hidden sm:block">
                      <div className={`text-sm font-semibold ${active || done ? "text-foreground" : "text-muted-foreground"}`}>
                        {s.title}
                      </div>
                      <div className="text-xs text-muted-foreground">{s.subtitle}</div>
                    </div>
                    <div className="mt-2 sm:hidden text-[11px] font-medium text-foreground/70">{s.title}</div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Steps content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Mis. Andi Wijaya" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor WhatsApp *</Label>
                    <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+62 812..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="nama@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Kota / Lokasi *</Label>
                    <Input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Mis. Jakarta Selatan" />
                  </div>

                  <div className="space-y-3 lg:col-span-2">
                    <div className="flex items-center justify-between">
                      <Label>Luas Tanah</Label>
                      <span className="text-sm font-semibold text-primary">{form.landSize} m²</span>
                    </div>
                    <Slider min={50} max={1000} step={10} value={[form.landSize]} onValueChange={(v) => update("landSize", v[0])} />
                  </div>
                  <div className="space-y-3 lg:col-span-2">
                    <div className="flex items-center justify-between">
                      <Label>Luas Bangunan</Label>
                      <span className="text-sm font-semibold text-primary">{form.buildingSize} m²</span>
                    </div>
                    <Slider min={36} max={800} step={6} value={[form.buildingSize]} onValueChange={(v) => update("buildingSize", v[0])} />
                  </div>

                  <div className="space-y-3">
                    <Label>Jumlah Lantai</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((n) => (
                        <button
                          key={n}
                          onClick={() => update("floors", n)}
                          className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                            form.floors === n ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-foreground/30"
                          }`}
                        >
                          {n} Lantai
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Jumlah Kamar Tidur</Label>
                    <div className="flex gap-2">
                      {[2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => update("bedrooms", n)}
                          className={`flex-1 rounded-xl border px-3 py-3 text-sm font-medium transition ${
                            form.bedrooms === n ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-foreground/30"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 lg:col-span-2">
                    <Label>Gaya Arsitektur</Label>
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
                  </div>

                  <div className="space-y-3 lg:col-span-2">
                    <Label>Tier Anggaran</Label>
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
                            <div className="mt-1 text-xs text-muted-foreground">
                              {formatIDR(tierMultiplier[t])} / m²
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="notes">Catatan Tambahan</Label>
                    <textarea
                      id="notes"
                      rows={3}
                      value={form.notes}
                      onChange={(e) => update("notes", e.target.value)}
                      className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Mis. butuh kolam renang, taman tropis, home office..."
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-6 lg:grid-cols-5">
                  <div className="lg:col-span-3 space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">Estimasi Proyek Anda</h2>
                    <p className="text-muted-foreground">
                      Berdasarkan input Anda, berikut estimasi anggaran pembangunan dan biaya desain. Angka ini bersifat indikatif dan akan difinalisasi setelah survei lokasi.
                    </p>
                    <div className="rounded-2xl border border-border bg-muted/30 p-6">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <Row k="Luas Bangunan" v={`${form.buildingSize} m²`} />
                        <Row k="Jumlah Lantai" v={`${form.floors}`} />
                        <Row k="Gaya" v={<span className="capitalize">{form.style}</span>} />
                        <Row k="Tier" v={<span className="capitalize">{form.budgetTier}</span>} />
                        <Row k="Harga / m²" v={formatIDR(estimate.perM2)} />
                        <Row k="Estimasi Waktu" v={`${estimate.weeks} minggu`} />
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <div className="rounded-3xl bg-secondary text-secondary-foreground p-7 shadow-elevated">
                      <div className="text-xs uppercase tracking-[0.2em] text-secondary-foreground/60">Total Estimasi Pembangunan</div>
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
              )}

              {step === 3 && (
                <div className="grid gap-6 lg:grid-cols-5">
                  <div className="lg:col-span-3 space-y-5">
                    <h2 className="text-2xl font-bold tracking-tight">Commitment Fee</h2>
                    <p className="text-muted-foreground">
                      Bayar commitment fee untuk mengamankan slot tim arsitek AMP. Fee ini akan dipotong dari biaya desain final saat Anda lanjut ke tahap kontrak.
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
                          <span className="text-foreground/85">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="lg:col-span-2">
                    <div className="rounded-3xl border border-border bg-card p-7 shadow-elevated">
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
                        onClick={pay}
                        className="mt-6 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-red transition hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Bayar {formatIDR(estimate.commitment)}
                      </button>
                      <p className="mt-3 text-center text-xs text-muted-foreground">
                        Pembayaran aman & terenkripsi
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="py-6 text-center">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow"
                  >
                    <Check className="h-10 w-10" />
                  </motion.div>
                  <h2 className="mt-6 text-3xl font-bold tracking-tight lg:text-4xl">
                    {paid ? "Selamat! Desain Anda Dimulai" : "Siap Memulai Desain"}
                  </h2>
                  <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                    Tim arsitek AMP akan menghubungi <span className="font-semibold text-foreground">{form.name || "Anda"}</span> via WhatsApp dalam 1×24 jam untuk menjadwalkan konsultasi awal & site visit.
                  </p>

                  <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
                    {[
                      { t: "1×24 jam", s: "Konfirmasi tim" },
                      { t: "3–5 hari", s: "Site visit" },
                      { t: `${estimate.weeks} minggu`, s: "Desain final" },
                    ].map((x) => (
                      <div key={x.s} className="rounded-2xl border border-border bg-card p-5">
                        <div className="text-xl font-bold text-primary">{x.t}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{x.s}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                      to="/"
                      className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold hover:bg-muted transition"
                    >
                      Kembali ke Beranda
                    </Link>
                    <a
                      href={`https://wa.me/6281200000000?text=${encodeURIComponent(`Halo AMP, saya ${form.name} sudah menyelesaikan wizard perencanaan.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-red hover:shadow-glow transition"
                    >
                      Hubungi via WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer nav */}
          {step < 4 && (
            <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
              <button
                onClick={prev}
                disabled={step === 1}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium transition hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4" /> Sebelumnya
              </button>
              <div className="text-xs text-muted-foreground">
                Langkah {step} dari {steps.length}
              </div>
              {step === 3 ? (
                <button
                  onClick={pay}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-red hover:shadow-glow transition"
                >
                  Bayar Sekarang <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-red hover:shadow-glow transition"
                >
                  Lanjut <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="py-12 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} ASTA MANDIRI PRAKARSA — Wizard Perencanaan Rumah
        </div>
      </section>
    </main>
  );
};

const Row = ({ k, v }: { k: string; v: React.ReactNode }) => (
  <div>
    <div className="text-xs uppercase tracking-wider text-muted-foreground">{k}</div>
    <div className="mt-1 font-semibold text-foreground">{v}</div>
  </div>
);

export default Wizard;
