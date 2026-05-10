import { Instagram, Linkedin, Facebook, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/amp-logo.png";

const cols = [
  {
    title: "Layanan",
    links: ["Desain Rumah", "Estimasi Biaya", "Visualisasi 3D", "Renovasi", "Konsultasi"],
  },
  {
    title: "Perusahaan",
    links: ["Tentang Kami", "Tim Arsitek", "Karier", "Blog", "Press Kit"],
  },
  {
    title: "Bantuan",
    links: ["FAQ", "Kontak", "Syarat & Ketentuan", "Kebijakan Privasi"],
  },
];

export const Footer = () => (
  <footer className="bg-secondary text-secondary-foreground">
    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white p-2">
              <img src={logo} alt="AMP" className="h-8 w-8 object-contain" />
            </div>
            <div className="leading-tight">
              <div className="text-[10px] tracking-[0.22em] text-secondary-foreground/60">ASTA MANDIRI</div>
              <div className="text-base font-bold">PRAKARSA</div>
            </div>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-secondary-foreground/70">
            Platform desain & estimasi rumah modern. Wujudkan hunian impian Anda bersama tim arsitek profesional.
          </p>
          <div className="mt-6 space-y-2.5 text-sm text-secondary-foreground/80">
            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /> hello@ampstudio.id</div>
            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> +62 812 0000 0000</div>
            <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary" /> Jakarta · Indonesia</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground/60">{c.title}</div>
              <ul className="mt-5 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-secondary-foreground/85 hover:text-primary transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
        <div className="text-xs text-secondary-foreground/60">
          © {new Date().getFullYear()} ASTA MANDIRI PRAKARSA. All rights reserved.
        </div>
        <div className="flex items-center gap-2">
          {[Instagram, Linkedin, Facebook].map((Icon, i) => (
            <a
              key={i}
              href="#"
              aria-label="social"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-secondary-foreground/80 transition-all hover:bg-primary hover:border-primary hover:text-primary-foreground"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);
