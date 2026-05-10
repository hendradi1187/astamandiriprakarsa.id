import { motion } from "framer-motion";
import { ArrowRight, Clock, ShieldCheck, Award } from "lucide-react";
import hero from "@/assets/hero-villa.jpg";

const trust = [
  { icon: Clock, label: "Proses Cepat" },
  { icon: ShieldCheck, label: "Aman & Terpercaya" },
  { icon: Award, label: "Tim Arsitek Profesional" },
];

export const Hero = () => {
  return (
    <section id="hero" className="relative overflow-hidden pt-28 lg:pt-36">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-20 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:pb-32">
        {/* Left */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Platform Perencanaan Hunian #1 di Indonesia
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[64px]"
          >
            Rancang Rumah Impian Anda{" "}
            <span className="relative inline-block text-primary">
              Lebih Cepat
              <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-red opacity-30" />
            </span>{" "}
            & Lebih Mudah
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Platform digital interaktif untuk membantu Anda merancang hunian, mendapatkan estimasi
            biaya pembangunan, dan berkolaborasi langsung dengan tim arsitek profesional.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="/wizard"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-red transition-all duration-300 hover:shadow-glow hover:scale-[1.03] active:scale-[0.98]"
            >
              Mulai Perencanaan
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#portfolio"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-surface hover:scale-[1.02]"
            >
              Lihat Portfolio
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6"
          >
            {trust.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4 text-primary" />
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
          className="relative"
        >
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-red opacity-10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] shadow-elevated ring-1 ring-border">
            <img
              src={hero}
              alt="Luxury tropical modern villa designed by AMP"
              width={1280}
              height={1280}
              className="aspect-[4/5] w-full object-cover lg:aspect-[5/6]"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Floating stat cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute left-5 top-5 glass rounded-2xl px-4 py-3 shadow-card"
            >
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Estimasi</div>
              <div className="mt-0.5 text-base font-bold text-foreground">Real-time</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute bottom-5 right-5 glass rounded-2xl px-4 py-3 shadow-card"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="h-7 w-7 rounded-full bg-gradient-red ring-2 ring-white" />
                  <div className="h-7 w-7 rounded-full bg-secondary ring-2 ring-white" />
                  <div className="h-7 w-7 rounded-full bg-muted-foreground ring-2 ring-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">150+ Klien</div>
                  <div className="text-[10px] text-muted-foreground">⭐ 4.9 rating</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
