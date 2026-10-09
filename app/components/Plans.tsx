import { Check, Smartphone, ShoppingCart, Settings } from "lucide-react";
import { siteConfig } from "../lib/config";
import { buildWhatsAppLinkByKey } from "../lib/whatsapp";
import ScrollReveal from "./ScrollReveal";

export default function Plans() {
  const { plans, launchOffer } = siteConfig;
  const customProjectLink = buildWhatsAppLinkByKey("customProject");

  return (
    <section
      id="planes"
      className="py-16 md:py-24"
      style={{ background: "var(--color-space-deep)" }}
      aria-labelledby="plans-title"
    >
      <div className="max-w-6xl mx-auto px-5">
        {/* Header */}
        <ScrollReveal className="mb-3">
          <p className="overline mb-3" style={{ color: "var(--color-indigo-bright)" }}>
            Planes
          </p>
          <h2
            id="plans-title"
            className="font-display font-bold text-3xl md:text-4xl text-[var(--color-bone)] leading-tight"
          >
            Elige tu punto de{" "}
            <em className="not-italic text-[var(--color-indigo-bright)]">partida.</em>
          </h2>
          <p className="text-[var(--color-muted)] mt-3 text-lg">
            Precios en dólares, publicados y sin sorpresas.
          </p>
        </ScrollReveal>

        {/* Plans grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {plans.map((plan, i) => {
            const isNebula = plan.id === "nebula";
            const showOffer = isNebula && launchOffer.enabled;
            const link = buildWhatsAppLinkByKey(plan.whatsappMessageKey);

            return (
              <ScrollReveal key={plan.id} delay={i * 120}>
                <div
                  className={[
                    "glass-card plan-card h-full flex flex-col gap-6 p-7 md:p-8 relative overflow-hidden",
                    plan.featured
                      ? "border-[var(--color-indigo-primary)] ring-1 ring-[var(--color-indigo-primary)]"
                      : "",
                  ].join(" ")}
                  style={
                    plan.featured
                      ? {
                          background:
                            "linear-gradient(145deg, rgba(91,94,244,0.12) 0%, rgba(17,24,39,0.85) 60%)",
                          borderColor: "rgba(91,94,244,0.5)",
                          boxShadow:
                            "0 0 40px rgba(91,94,244,0.18), 0 8px 32px rgba(0,0,0,0.5)",
                        }
                      : {}
                  }
                >
                  {(plan.badge || showOffer) && (
                    <div className="flex flex-wrap items-center gap-2">
                      {plan.badge && (
                        <span className="chip chip-indigo text-xs font-semibold">
                          {plan.badge}
                        </span>
                      )}
                      {showOffer && (
                        <span
                          className="chip text-xs font-semibold"
                          style={{
                            background: "rgba(234,179,8,0.15)",
                            borderColor: "rgba(234,179,8,0.4)",
                            color: "#fbbf24",
                          }}
                        >
                          Precio de lanzamiento
                        </span>
                      )}
                    </div>
                  )}

                  {/* Plan name */}
                  <div>
                    <h3 className="font-display font-bold text-2xl text-[var(--color-bone)] mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-[var(--color-muted)] text-base">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-end gap-2">
                    {showOffer && (
                      <span className="text-2xl font-bold text-[var(--color-muted)] line-through">
                        ${plan.priceFrom}
                      </span>
                    )}
                    <span className="font-display font-bold text-4xl md:text-5xl text-[var(--color-bone)]">
                      ${showOffer ? launchOffer.price : plan.priceFrom}
                    </span>
                    <span className="text-[var(--color-muted)] mb-1.5">desde</span>
                  </div>

                  {/* Spots left */}
                  {showOffer && (
                    <p className="text-sm font-semibold" style={{ color: "#fbbf24" }}>
                      Quedan {launchOffer.spotsLeft} cupos
                    </p>
                  )}

                  {/* Features */}
                  <ul className="flex flex-col gap-3 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span
                          className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{
                            background: "rgba(16,185,129,0.15)",
                            border: "1px solid rgba(16,185,129,0.35)",
                          }}
                        >
                          <Check
                            size={11}
                            color="var(--color-emerald-accent)"
                            strokeWidth={2.5}
                            aria-hidden="true"
                          />
                        </span>
                        <span className="text-[var(--color-muted)] text-base leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn btn-lg ${plan.featured ? "btn-primary" : "btn-secondary"}`}
                    id={`plan-cta-${plan.id}`}
                  >
                    Quiero este plan
                  </a>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Custom projects band */}
        <ScrollReveal className="mt-8">
          <div
            className="glass-card p-7 md:p-10 flex flex-col md:flex-row md:items-center gap-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(34,211,238,0.07) 0%, rgba(17,24,39,0.8) 60%)",
              borderColor: "rgba(34,211,238,0.2)",
            }}
          >
            <div className="flex-1">
              <h3 className="font-display font-bold text-2xl text-[var(--color-bone)] mb-2">
                Proyectos a medida
              </h3>
              <p className="text-[var(--color-muted)] text-base leading-relaxed mb-4">
                ¿Necesitas una tienda en línea, una app móvil o un sistema de
                gestión? Cuéntanos tu idea y te armamos una propuesta.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Tienda en línea", Icon: ShoppingCart },
                  { label: "App móvil", Icon: Smartphone },
                  { label: "Sistema de gestión", Icon: Settings },
                ].map(({ label, Icon }) => (
                  <span key={label} className="chip chip-cyan flex items-center gap-1.5">
                    <Icon size={13} aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <a
              href={customProjectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-lg flex-shrink-0"
              id="cta-custom-project"
            >
              Cuéntanos tu idea
            </a>
          </div>
        </ScrollReveal>

        {/* Payment line */}
        <ScrollReveal>
          <p className="text-center text-sm text-[var(--color-muted)] mt-6">
            Pagas con{" "}
            <strong className="text-[var(--color-bone)] font-medium">Pago Móvil</strong>{" "}
            o{" "}
            <strong className="text-[var(--color-bone)] font-medium">Binance</strong>.
            50% para iniciar y 50% al entregar.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
