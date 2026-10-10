import { Check, ChevronDown, MessageCircle } from "lucide-react";
import { WhatsAppButton } from "./WhatsAppButton";
import HeroMockups from "./HeroMockups";

export default function Hero() {
  return (
    <section
      className="relative min-h-svh flex items-center bg-space bg-dots pt-16 pb-12 sm:pt-20 sm:pb-16"
      aria-label="Encabezado principal"
    >
      {/* Extra glow top-left */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-5%",
            width: "60%",
            height: "70%",
            background:
              "radial-gradient(ellipse, rgba(91,94,244,0.10) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "0",
            right: "-5%",
            width: "50%",
            height: "60%",
            background:
              "radial-gradient(ellipse, rgba(34,211,238,0.07) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-5 w-full z-10">
        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-6">
          <div className="max-w-2xl min-w-0">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Overline */}
            <div
              className="overline animate-fade-in-up"
              style={{ color: "var(--color-cyan-accent)", animationDelay: "0ms" }}
            >
              Diseño · Desarrollo · Marketing
            </div>

            {/* H1 */}
            <h1
              className="font-display font-bold text-4xl sm:text-5xl lg:text-[3.5rem] text-[var(--color-bone)] leading-[1.1] tracking-tight animate-fade-in-up"
              style={{ animationDelay: "80ms" }}
            >
              Tu negocio, con una web que{" "}
              <em className="not-italic text-[var(--color-indigo-bright)]">
                vende.
              </em>
            </h1>

            {/* Body */}
            <p
              className="text-base sm:text-lg text-[var(--color-muted)] leading-relaxed max-w-lg animate-fade-in-up"
              style={{ animationDelay: "160ms" }}
            >
              Diseñamos y programamos tu página web y la preparamos para que te
              lleguen clientes. Un solo equipo, precios claros desde{" "}
              <a
                href="#planes"
                className="font-semibold text-[var(--color-bone)] underline underline-offset-4"
              >
                $98
              </a>
              .
            </p>

            <div className="flex flex-col gap-3 animate-fade-in-up" style={{ animationDelay: "240ms" }}>
              <WhatsAppButton
                location="hero"
                messageKey="default"
                className="btn btn-whatsapp btn-lg w-full sm:w-fit px-3 sm:px-8"
                id="hero-cta-whatsapp"
              >
                <MessageCircle size={20} aria-hidden="true" />
                Escríbenos por WhatsApp
              </WhatsAppButton>
              <WhatsAppButton
                location="hero_llamada"
                messageKey="heroCall"
                className="btn btn-secondary btn-lg w-full sm:w-fit px-3 sm:px-8 text-sm sm:text-base"
              >
                Agenda una llamada gratuita de 20 min
              </WhatsAppButton>
            </div>

            <ul className="flex flex-col gap-2 text-sm text-[var(--color-muted)]">
              {[
                "Ves el diseño antes de que programemos",
                "Precios publicados",
                "Pagas 50% para empezar y 50% al entregar",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check
                    size={16}
                    className="shrink-0 text-[var(--color-emerald-accent)]"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>

            {/* Discrete link */}
            <a
              href="#planes"
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-bone)] transition-colors self-start flex items-center gap-1 animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              Ver planes
              <ChevronDown size={14} aria-hidden="true" />
            </a>

          </div>
          </div>
          <HeroMockups />
        </div>
      </div>
    </section>
  );
}
