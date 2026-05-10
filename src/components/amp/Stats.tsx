import { Reveal } from "./Reveal";

const stats = [
  { value: "250+", label: "Proyek Selesai" },
  { value: "150+", label: "Klien Puas" },
  { value: "10+", label: "Tahun Pengalaman" },
  { value: "Seluruh", label: "Indonesia" },
];

export const Stats = () => (
  <section className="border-y border-border bg-background py-16 lg:py-20">
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-6 lg:grid-cols-4 lg:px-10">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.07} className="text-center">
          <div className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {s.value}
          </div>
          <div className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {s.label}
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);
