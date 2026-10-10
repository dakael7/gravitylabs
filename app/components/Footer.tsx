import { siteConfig } from "../lib/config";
import BrandLogo from "./BrandLogo";
import Link from "next/link";

const navLinks = [
  { href: "#planes", label: "Planes" },
  { href: "#portafolio", label: "Portafolio" },
  { href: "#como-trabajamos", label: "Cómo trabajamos" },
  { href: "#preguntas", label: "Preguntas" },
];

function InstagramIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  const year = 2026;

  return (
    <footer
      className="py-10 border-t"
      style={{
        background: "var(--color-space-black)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
      aria-label="Pie de página"
    >
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-display font-bold text-base text-[var(--color-bone)] no-underline"
              aria-label="Gravity Labs — inicio"
            >
              <BrandLogo size={32} />
              GRAVITY <span className="text-[var(--color-indigo-bright)] ml-1">LABS</span>
            </Link>
            <p className="text-sm text-[var(--color-muted)]">
              Diseño, desarrollo y marketing para negocios que quieren vender más.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Navegación footer">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--color-muted)] hover:text-[var(--color-bone)] transition-colors"
              >
                {link.label}
              </a>
            ))}
            {siteConfig.instagramUrl && (
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--color-muted)] hover:text-[var(--color-bone)] transition-colors flex items-center gap-1"
              >
                <InstagramIcon size={13} />
                Instagram
              </a>
            )}
          </nav>
        </div>

        <div className="divider-gradient mt-8 mb-5" aria-hidden="true" />

        <p className="text-sm text-[var(--color-muted)] text-center">
          © {year} Gravity Labs. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
