import { Star } from "lucide-react";
import { Reveal } from "./Reveal";

const items = [
  {
    name: "Andini Pratama",
    project: "Rumah Modern · 220m²",
    initials: "AP",
    quote:
      "Prosesnya transparan dari awal sampai akhir. Estimasi biayanya akurat dan timnya sangat responsif.",
    rating: 5,
  },
  {
    name: "Reza Mahendra",
    project: "Tropical House · 340m²",
    initials: "RM",
    quote:
      "Visualisasi 3D-nya membuat kami yakin sebelum mulai bangun. Hasil akhirnya melampaui ekspektasi.",
    rating: 5,
  },
  {
    name: "Sinta Wijaya",
    project: "Renovasi Cafe · 90m²",
    initials: "SW",
    quote:
      "Desainnya modern dan fungsional. Konsultasi terasa premium tapi tetap personal.",
    rating: 5,
  },
];

export const Testimonials = () => (
  <section className="relative overflow-hidden bg-background py-24 lg:py-32">
    <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
    <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
      <Reveal className="mx-auto max-w-2xl text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Testimoni</div>
        <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Suara dari klien kami
        </h2>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {items.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <div className="glass relative h-full rounded-2xl p-7 shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-elevated">
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-5 text-base leading-relaxed text-foreground">
                "{t.quote}"
              </blockquote>
              <div className="mt-7 flex items-center gap-3 border-t border-border/50 pt-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-red text-sm font-bold text-primary-foreground">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.project}</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
