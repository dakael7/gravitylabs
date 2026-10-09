import ScrollReveal from "./ScrollReveal";

const steps = [
  {
    num: "01",
    title: "Elección",
    desc: "Escoges el plan y definimos el alcance exacto.",
    color: "var(--color-indigo-bright)",
    bg: "rgba(91,94,244,0.15)",
    border: "rgba(91,94,244,0.35)",
  },
  {
    num: "02",
    title: "Escucha",
    desc: "Entendemos tu negocio y a tus clientes.",
    color: "var(--color-cyan-accent)",
    bg: "rgba(34,211,238,0.12)",
    border: "rgba(34,211,238,0.3)",
  },
  {
    num: "03",
    title: "Diseño",
    desc: "Ves y pruebas cómo se verá tu web antes de que empecemos a programar.",
    color: "var(--color-emerald-accent)",
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.3)",
  },
  {
    num: "04",
    title: "Desarrollo",
    desc: "Construimos tu web rápida, segura y optimizada.",
    color: "var(--color-indigo-bright)",
    bg: "rgba(91,94,244,0.12)",
    border: "rgba(91,94,244,0.3)",
  },
  {
    num: "05",
    title: "Despegue",
    desc: "La lanzamos y revisamos que todo funcione.",
    color: "var(--color-cyan-accent)",
    bg: "rgba(34,211,238,0.10)",
    border: "rgba(34,211,238,0.25)",
  },
];

export default function HowWeWork() {
  return (
    <section
      id="como-trabajamos"
      className="py-16 md:py-24"
      style={{ background: "var(--color-space-deep)" }}
      aria-labelledby="how-title"
    >
      <div className="max-w-6xl mx-auto px-5">
        <ScrollReveal className="mb-12">
          <p className="overline mb-3" style={{ color: "var(--color-indigo-bright)" }}>
            Cómo trabajamos
          </p>
          <h2
            id="how-title"
            className="font-display font-bold text-3xl md:text-4xl text-[var(--color-bone)] leading-tight"
          >
            Un camino{" "}
            <em className="not-italic text-[var(--color-indigo-bright)]">claro,</em>{" "}
            de la idea al lanzamiento.
          </h2>
        </ScrollReveal>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop */}
          <div
            className="hidden md:block absolute top-10 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 5%, rgba(91,94,244,0.25) 20%, rgba(34,211,238,0.25) 80%, transparent 95%)",
            }}
            aria-hidden="true"
          />

          <div className="grid md:grid-cols-5 gap-6 md:gap-4">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 80}>
                <div className="process-step flex md:flex-col items-start md:items-center md:text-center gap-4 md:gap-4">
                  {/* Number bubble */}
                  <div
                    className="process-step-number flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center font-display font-bold text-xl md:text-2xl relative z-10"
                    style={{
                      background: step.bg,
                      border: `2px solid ${step.border}`,
                      color: step.color,
                      boxShadow: `0 0 20px ${step.bg}`,
                    }}
                  >
                    {step.num}
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-1 md:mt-4">
                    <h3
                      className="font-display font-semibold text-base text-[var(--color-bone)]"
                      style={{ color: step.color }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Mobile connector line (vertical) */}
                  {i < steps.length - 1 && (
                    <div
                      className="md:hidden absolute left-8 ml-px"
                      style={{
                        top: "4rem",
                        height: "1.5rem",
                        width: "1px",
                        background:
                          "linear-gradient(to bottom, rgba(91,94,244,0.3), transparent)",
                      }}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
