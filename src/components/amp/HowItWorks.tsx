import { Reveal } from "./Reveal";
import { FileQuestion, Receipt, CreditCard, PencilRuler } from "lucide-react";

const steps = [
  { icon: FileQuestion, title: "Isi Kuesioner", desc: "Ceritakan kebutuhan, gaya, dan budget hunian Anda lewat form interaktif." },
  { icon: Receipt, title: "Dapat Estimasi", desc: "Sistem kami menghitung estimasi biaya & timeline secara instan." },
  { icon: CreditCard, title: "Bayar Commitment Fee", desc: "Konfirmasi proyek Anda dengan biaya komitmen yang transparan." },
  { icon: PencilRuler, title: "Arsitek Mulai Mendesain", desc: "Tim arsitek profesional kami mulai merancang dan kolaborasi dengan Anda." },
];

export const HowItWorks = () => (
  <section className="relative bg-background py-24 lg:py-32">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <Reveal className="mx-auto max-w-2xl text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Cara Kerja</div>
        <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Empat langkah menuju rumah impian
        </h2>
        <p className="mt-5 text-muted-foreground sm:text-lg">
          Proses sederhana, transparan, dan terstruktur — dirancang untuk Anda.
        </p>
      </Reveal>

      <div className="relative mt-20">
        {/* Timeline line */}
        <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-6">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1} className="relative">
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-background ring-1 ring-border shadow-card">
                  <s.icon className="h-5 w-5 text-primary" />
                  <div className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-red">
                    {i + 1}
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);
