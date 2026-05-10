import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "./Reveal";
import modern from "@/assets/proj-modern.jpg";
import tropical from "@/assets/proj-tropical.jpg";
import interior from "@/assets/proj-interior.jpg";
import renovation from "@/assets/proj-renovation.jpg";
import cafe from "@/assets/proj-cafe.jpg";
import villa from "@/assets/proj-villa.jpg";

const categories = ["Semua", "Rumah Modern", "Tropical House", "Interior Design", "Renovation", "Cafe Design"] as const;

const projects = [
  { img: modern, title: "Casa Putih", category: "Rumah Modern", location: "Jakarta" },
  { img: tropical, title: "Villa Senja", category: "Tropical House", location: "Bali" },
  { img: interior, title: "Living Hall", category: "Interior Design", location: "Surabaya" },
  { img: renovation, title: "Riverside Renovation", category: "Renovation", location: "Bandung" },
  { img: cafe, title: "Tanah & Kayu Cafe", category: "Cafe Design", location: "Yogyakarta" },
  { img: villa, title: "Sunset Residence", category: "Rumah Modern", location: "Bogor" },
];

export const Portfolio = () => {
  const [active, setActive] = useState<(typeof categories)[number]>("Semua");
  const filtered = active === "Semua" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="portfolio" className="bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Portfolio</div>
            <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Karya yang kami banggakan
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Setiap proyek adalah cerita — kombinasi arsitektur, fungsi, dan jiwa pemiliknya.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                active === c
                  ? "bg-secondary text-secondary-foreground shadow-card"
                  : "bg-background text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {c}
            </button>
          ))}
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.a
                href="#"
                key={p.title}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative block overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-border"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    width={1024}
                    height={1280}
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-6 text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">{p.category}</div>
                  <div className="mt-1 text-xl font-bold">{p.title}</div>
                  <div className="mt-0.5 text-sm text-white/70">{p.location}</div>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
