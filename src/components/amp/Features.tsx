import { ClipboardList, Calculator, Box, Users } from "lucide-react";
import { Reveal } from "./Reveal";

const features = [
  {
    icon: ClipboardList,
    title: "Kuesioner Interaktif",
    desc: "Jawab beberapa pertanyaan singkat — kami bantu Anda merumuskan kebutuhan rumah ideal dalam hitungan menit.",
  },
  {
    icon: Calculator,
    title: "Estimasi Biaya Otomatis",
    desc: "Dapatkan perkiraan biaya pembangunan yang akurat dan transparan, langsung berdasarkan input Anda.",
  },
  {
    icon: Box,
    title: "Desain & Visualisasi 3D",
    desc: "Lihat hunian Anda hidup melalui rendering 3D fotorealistis sebelum proses konstruksi dimulai.",
  },
  {
    icon: Users,
    title: "Kolaborasi Mudah",
    desc: "Diskusi dengan arsitek profesional langsung di platform — revisi cepat, dokumen rapi.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="relative bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Layanan</div>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Semua Kebutuhan Desain dalam Satu Platform
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Dari ide hingga estimasi, semua terintegrasi untuk pengalaman merancang yang lebih nyaman.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <div className="group relative h-full rounded-2xl border border-border bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-elevated hover:border-primary/20">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-primary/0 opacity-0 transition-opacity duration-500 group-hover:from-primary/[0.03] group-hover:to-transparent group-hover:opacity-100" />
                <div className="relative">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-red">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
