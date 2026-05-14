import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calculator, Loader2, Ruler, FileCheck, Wallet, Info } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getRabPrice, type RabBriefData } from "@/lib/services";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/amp-logo.png";
import { Slider } from "@/components/ui/slider";

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const WizardRAB = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const [buildingSize, setBuildingSize] = useState(150);
  const [hasDesign, setHasDesign] = useState(true);
  const [designSource, setDesignSource] = useState<"amp" | "external">("external");
  const [notes, setNotes] = useState("");

  const estimate = useMemo(() => {
    const price = getRabPrice(buildingSize);
    return {
      designFee: price,
      isCustomQuote: price === 0,
      weeks: 2,
      commitment: 2_500_000,
    };
  }, [buildingSize]);

  const handleSubmit = async () => {
    if (!user) return;

    setSubmitting(true);
    try {
      const briefData: RabBriefData = {
        buildingSize,
        hasDesign,
        designSource: hasDesign ? designSource : undefined,
      };

      const { data, error } = await supabase
        .from("projects")
        .insert({
          client_id: user.id,
          service_type: "rab_boq",
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
        description: `Project #${data.id.slice(0, 8).toUpperCase()} dibuat.`,
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
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="AMP" className="h-9 w-9 object-contain" />
            <div className="leading-tight">
              <div className="text-lg font-extrabold tracking-tight">AMP</div>
              <div className="text-[9px] tracking-[0.2em] text-muted-foreground font-semibold">
                ASTA MANDIRI PRAKARSA
              </div>
            </div>
          </Link>
          <Link to="/mulai" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Pilih Layanan Lain
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] px-4 py-8 lg:px-8 lg:py-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Layanan</div>
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">Hitung RAB / BOQ</h1>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
            Tim QS AMP akan menyiapkan perhitungan anggaran detail dengan harga upah-bahan dan analisa rekapitulasi. Output: PDF RAB siap pakai untuk eksekusi.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-2xl border border-border bg-background p-5 lg:p-6">
              <div className="flex items-center gap-2.5">
                <Ruler className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-sm font-bold tracking-tight">Luas Bangunan</h3>
              </div>
              <div className="mt-4 flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Total luas yang akan dihitung RAB-nya</span>
                <span className="text-sm font-bold text-primary">{buildingSize} m²</span>
              </div>
              <Slider min={50} max={1000} step={10} value={[buildingSize]} onValueChange={(v) => setBuildingSize(v[0])} />
              <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
                <div className="rounded-lg bg-muted/50 px-2 py-1.5 text-center">≤ 250 m²: Rp 2 jt</div>
                <div className="rounded-lg bg-muted/50 px-2 py-1.5 text-center">251–400 m²: Rp 2,65 jt</div>
                <div className="rounded-lg bg-muted/50 px-2 py-1.5 text-center">401–600 m²: Rp 3 jt</div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-5 lg:p-6">
              <div className="flex items-center gap-2.5">
                <FileCheck className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-sm font-bold tracking-tight">Apakah Sudah Punya Gambar Desain?</h3>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                RAB butuh gambar lengkap (denah, tampak, potongan, detail) untuk perhitungan akurat.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setHasDesign(true)}
                  className={`text-left rounded-xl border p-4 transition ${
                    hasDesign ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div className="text-sm font-semibold">Sudah punya gambar</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">Siap dihitung RAB</div>
                </button>
                <button
                  onClick={() => setHasDesign(false)}
                  className={`text-left rounded-xl border p-4 transition ${
                    !hasDesign ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div className="text-sm font-semibold">Belum ada</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">Perlu desain dulu</div>
                </button>
              </div>
              {hasDesign && (
                <div className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">Sumber gambar:</div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDesignSource("amp")}
                      className={`text-left rounded-xl border p-3 transition ${
                        designSource === "amp" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <div className="text-sm font-semibold">Dari AMP</div>
                    </button>
                    <button
                      onClick={() => setDesignSource("external")}
                      className={`text-left rounded-xl border p-3 transition ${
                        designSource === "external" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <div className="text-sm font-semibold">Dari Pihak Lain</div>
                    </button>
                  </div>
                </div>
              )}
              {!hasDesign && (
                <div className="mt-4 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900">
                  <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Kami sarankan Anda gunakan layanan <strong>Desain Rumah Baru</strong> terlebih dahulu. Tim AMP akan menghubungi Anda.
                  </span>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-background p-5 lg:p-6">
              <h3 className="text-sm font-bold tracking-tight">Catatan Tambahan</h3>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mis. tingkat finishing, kompleksitas struktur, deadline..."
                className="mt-3 w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-6 rounded-3xl bg-secondary text-secondary-foreground p-6 shadow-elevated">
              <div className="text-xs uppercase tracking-[0.2em] opacity-60">Biaya Layanan RAB</div>
              {estimate.isCustomQuote ? (
                <>
                  <div className="mt-3 text-2xl font-bold">Custom Quote</div>
                  <p className="mt-2 text-xs opacity-70 leading-relaxed">
                    Bangunan {">"} 600 m² butuh quote khusus disesuaikan kompleksitas. Tim AMP akan menghubungi Anda untuk diskusi.
                  </p>
                </>
              ) : (
                <>
                  <div className="mt-3 text-3xl lg:text-4xl font-bold">{formatIDR(estimate.designFee)}</div>
                  <div className="mt-1 text-xs opacity-60">untuk bangunan {buildingSize} m²</div>
                </>
              )}

              <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Estimasi Waktu</span>
                  <span className="font-semibold">± {estimate.weeks} minggu</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Output</span>
                  <span className="font-semibold text-right text-xs">RAB + Analisa + Rekapitulasi</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-red hover:shadow-glow transition disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? "Mengirim..." : "Submit Brief RAB"}
                <Wallet className="h-4 w-4" />
              </button>
              <p className="mt-3 text-center text-[11px] opacity-60">
                Brief disimpan, tim AMP menghubungi via WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WizardRAB;
