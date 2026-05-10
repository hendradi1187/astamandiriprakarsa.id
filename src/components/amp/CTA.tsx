import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

export const CTA = () => (
  <section id="cta" className="relative overflow-hidden bg-secondary py-24 lg:py-32">
    {/* Animated gradient backdrop */}
    <motion.div
      aria-hidden
      className="absolute inset-0 bg-gradient-cta"
      style={{ backgroundSize: "200% 200%" }}
      animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
      transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
    />
    <div aria-hidden className="absolute -left-1/4 top-1/3 h-[480px] w-[480px] rounded-full bg-primary/30 blur-[120px]" />
    <div aria-hidden className="absolute -right-1/4 bottom-0 h-[480px] w-[480px] rounded-full bg-primary-glow/20 blur-[120px]" />

    <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-10">
      <Reveal>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Mulai Sekarang</div>
        <h2 className="mt-5 text-balance text-4xl font-bold tracking-tight text-secondary-foreground sm:text-5xl lg:text-6xl">
          Bangun Rumah Dengan Cara yang{" "}
          <span className="bg-gradient-red bg-clip-text text-transparent">Lebih Modern</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-secondary-foreground/70 sm:text-lg">
          Mulai perjalanan desain rumah Anda bersama ASTA MANDIRI PRAKARSA.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <a
          href="#hero"
          className="group mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground shadow-red transition-all duration-300 hover:shadow-glow hover:scale-[1.04] active:scale-[0.98]"
        >
          Mulai Konsultasi Sekarang
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </Reveal>
    </div>
  </section>
);
