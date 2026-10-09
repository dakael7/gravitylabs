import { buildWhatsAppLinkByKey } from "../lib/whatsapp";
import ScrollReveal from "./ScrollReveal";

export default function CTAClose() {
  const whatsappDefault = buildWhatsAppLinkByKey("default");

  return (
    <section
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ background: "var(--color-space-black)" }}
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

          <div className="flex justify-center">
            <a
              href={whatsappDefault}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
              id="cta-close-whatsapp"
            >
              Escríbenos por WhatsApp
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
