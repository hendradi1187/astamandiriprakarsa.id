import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "@/assets/amp-logotype.png";

const links = [
  { label: "Beranda", href: "#hero" },
  { label: "Layanan", href: "#features" },
  { label: "Proyek", href: "#portfolio" },
  { label: "Tentang Kami", href: "#about" },
  { label: "Blog", href: "#blog" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "nav-blur border-b border-border/60" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20 lg:px-10">
        <a href="#hero" className="flex items-center group">
          <img src={logo} alt="AMP — Asta Mandiri Prakarsa" className="h-9 lg:h-10 w-auto object-contain" />
        </a>

        <ul className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-300"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="/mulai"
            className="hidden sm:inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-red hover:shadow-glow hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
          >
            Mulai Perencanaan
          </a>
          <button
            className="lg:hidden rounded-full p-2.5 hover:bg-muted transition"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden nav-blur border-b border-border"
          >
            <ul className="px-6 py-4 space-y-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-foreground/80 hover:bg-muted"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/mulai"
                  onClick={() => setOpen(false)}
                  className="mt-2 block rounded-full bg-primary text-primary-foreground px-4 py-3 text-center text-sm font-semibold shadow-red"
                >
                  Mulai Perencanaan
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
