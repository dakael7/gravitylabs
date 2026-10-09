import { siteConfig } from "../lib/config";

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

function LogoIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="16" cy="16" rx="14" ry="6" stroke="url(#f-orbit-grad)" strokeWidth="1.5" fill="none" opacity="0.7" transform="rotate(-25 16 16)" />
      <ellipse cx="16" cy="16" rx="9" ry="4" stroke="url(#f-orbit-grad2)" strokeWidth="1.2" fill="none" opacity="0.5" transform="rotate(55 16 16)" />
      <circle cx="16" cy="16" r="4.5" fill="url(#f-planet-grad)" />
      <circle cx="28" cy="13" r="1.8" fill="#22d3ee" opacity="0.9" />
      <circle cx="6" cy="20" r="1.2" fill="#5b5ef4" opacity="0.8" />
      <defs>
        <linearGradient id="f-orbit-grad" x1="2" y1="16" x2="30" y2="16">
          <stop offset="0%" stopColor="#5b5ef4" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="f-orbit-grad2" x1="2" y1="16" x2="30" y2="16">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <radialGradient id="f-planet-grad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#7c7fff" />
          <stop offset="100%" stopColor="#5b5ef4" />
        </radialGradient>
      </defs>
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
            <a
              href="/"
              className="flex items-center gap-2 font-display font-bold text-base text-[var(--color-bone)] no-underline"
              aria-label="Gravity Labs — inicio"
            >
              <LogoIcon />
              GRAVITY <span className="text-[var(--color-indigo-bright)] ml-1">LABS</span>
            </a>
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

        <p className="text-xs text-[var(--color-muted)] text-center">
          © {year} Gravity Labs. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
