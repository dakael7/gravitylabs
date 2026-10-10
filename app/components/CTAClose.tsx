import { MessageCircle } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { siteConfig } from "../lib/config";
import { WhatsAppButton } from "./WhatsAppButton";

function InstagramIcon() {
  return (
    <svg
      width="14"
      height="14"
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

export default function CTAClose() {
  return (
    <section
      className="py-16 md:py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--color-space-deep) 0%, var(--color-space-black) 100%)",
      }}
      aria-labelledby="cta-close-title"
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(91,94,244,0.14) 0%, rgba(34,211,238,0.06) 40%, transparent 70%)",
        }}
      />

      <div className="max-w-4xl mx-auto px-5 text-center relative z-10">
        <ScrollReveal>
          <h2
            id="cta-close-title"
            className="font-display font-bold text-3xl md:text-5xl text-[var(--color-bone)] leading-tight mb-5"
          >
            Cuéntanos qué necesitas.
          </h2>
          <p className="text-lg text-[var(--color-muted)] leading-relaxed max-w-xl mx-auto mb-8">
            Escríbenos y te orientamos sin compromiso.
          </p>

          <div className="flex flex-col items-center gap-3">
            <WhatsAppButton
              location="cierre"
              messageKey="default"
              className="btn btn-whatsapp btn-lg"
              id="cta-close-whatsapp"
            >
              <MessageCircle size={20} aria-hidden="true" />
              Escríbenos por WhatsApp
            </WhatsAppButton>
            <WhatsAppButton
              location="cierre"
              messageKey="heroCall"
              className="btn btn-secondary btn-lg text-sm sm:text-base"
            >
              Agenda una llamada gratuita de 20 min
            </WhatsAppButton>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <span className="chip chip-muted text-sm">Pago Móvil · Binance</span>
              {siteConfig.instagramUrl && (
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chip chip-muted inline-flex items-center gap-1.5 text-sm"
                >
                  <InstagramIcon />
                  Instagram
                </a>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
