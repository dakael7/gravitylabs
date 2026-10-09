import { Search, ShieldCheck, MousePointerClick } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const cards = [
  {
    icon: <Search size={28} color="var(--color-indigo-bright)" aria-hidden="true" />,
    title: "Te encuentran en Google",
    desc: "Quien busca tu servicio ve tu negocio, no solo tu perfil.",
    color: "var(--color-indigo-bright)",
    glow: "rgba(91,94,244,0.15)",
    border: "rgba(91,94,244,0.3)",
  },
  {
    icon: <ShieldCheck size={28} color="var(--color-emerald-accent)" aria-hidden="true" />,
    title: "Generan confianza antes del primer mensaje",
    desc: "Una web seria muestra quién eres, qué haces y cómo trabajas.",
    color: "var(--color-emerald-accent)",
    glow: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.3)",
  },
  {
    icon: <MousePointerClick size={28} color="var(--color-cyan-accent)" aria-hidden="true" />,
    title: "Te escriben listos para comprar",
    desc: "Tu web responde las dudas y cada botón abre tu WhatsApp con el mensaje preparado.",
    color: "var(--color-cyan-accent)",
    glow: "rgba(34,211,238,0.12)",
    border: "rgba(34,211,238,0.3)",
  },
];

export default function WhyWeb() {
  return (
    <section
      className="py-16 md:py-24 bg-dots"
      style={{ background: "var(--color-space-deep)" }}
      aria-labelledby="why-web-title"
    >
      <div className="max-w-6xl mx-auto px-5">
        <ScrollReveal className="mb-12 max-w-2xl">
          <h2
            id="why-web-title"
            className="font-display font-bold text-3xl md:text-4xl text-[var(--color-bone)] leading-tight mb-4"
          >
            Vender por Instagram y WhatsApp funciona. Con web propia, funciona{" "}
            <em className="not-italic text-[var(--color-emerald-accent)]">mejor.</em>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <ScrollReveal key={card.title} delay={i * 100}>
              <div
                className="glass-card glass-card-hover h-full p-6 flex flex-col gap-4"
                style={{
                  background: `linear-gradient(135deg, ${card.glow} 0%, rgba(17,24,39,0.7) 60%)`,
                  borderColor: card.border,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  data-hover-icon
                  style={{
                    background: card.glow,
                    border: `1px solid ${card.border}`,
                  }}
                >
                  {card.icon}
                </div>
                <h3
                  className="font-display font-semibold text-lg text-[var(--color-bone)] leading-snug"
                >
                  {card.title}
                </h3>
                <p className="text-[var(--color-muted)] text-base leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
