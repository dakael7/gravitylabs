import { Palette, Code2, BarChart3 } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const specialties = [
  {
    id: "design",
    icon: <Palette size={32} aria-hidden="true" />,
    iconColor: "var(--color-indigo-bright)",
    iconBg: "rgba(91,94,244,0.15)",
    iconBorder: "rgba(91,94,244,0.3)",
    label: "Diseño",
    title: "Una imagen profesional",
    desc: "que se ve bien en el celular y transmite confianza.",
    gradient: "from-indigo-500/10 to-transparent",
  },
  {
    id: "dev",
    icon: <Code2 size={32} aria-hidden="true" />,
    iconColor: "var(--color-cyan-accent)",
    iconBg: "rgba(34,211,238,0.12)",
    iconBorder: "rgba(34,211,238,0.3)",
    label: "Desarrollo",
    title: "Código rápido y seguro,",
    desc: "hecho a la medida de tu negocio.",
    gradient: "from-cyan-500/10 to-transparent",
  },
  {
    id: "mkt",
    icon: <BarChart3 size={32} aria-hidden="true" />,
    iconColor: "var(--color-emerald-accent)",
    iconBg: "rgba(16,185,129,0.12)",
    iconBorder: "rgba(16,185,129,0.3)",
    label: "Marketing",
    title: "Estrategia y analíticas",
    desc: "para atraer clientes y saber qué funciona.",
    gradient: "from-emerald-500/10 to-transparent",
  },
];

export default function Specialties() {
  return (
    <section
      className="py-16 md:py-24 bg-space"
      aria-labelledby="specialties-title"
    >
      <div className="max-w-6xl mx-auto px-5">
        <ScrollReveal className="mb-12">
          <p className="overline mb-3">Un solo equipo</p>
          <h2
            id="specialties-title"
            className="font-display font-bold text-3xl md:text-4xl text-[var(--color-bone)] leading-tight"
          >
            Hacemos que tu web{" "}
            <em className="not-italic text-[var(--color-indigo-bright)]">
              trabaje para ti.
            </em>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {specialties.map((sp, i) => (
            <ScrollReveal key={sp.id} delay={i * 120}>
              <div className="glass-card glass-card-hover h-full p-8 flex flex-col gap-5">
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  data-hover-icon
                  style={{
                    background: sp.iconBg,
                    border: `1px solid ${sp.iconBorder}`,
                    color: sp.iconColor,
                  }}
                >
                  {sp.icon}
                </div>

                {/* Label */}
                <span
                  className="overline"
                  style={{ color: sp.iconColor }}
                >
                  {sp.label}
                </span>

                {/* Text */}
                <div>
                  <p className="font-display font-semibold text-xl text-[var(--color-bone)] leading-snug">
                    {sp.title}
                  </p>
                  <p className="font-display font-semibold text-xl text-[var(--color-muted)] leading-snug">
                    {sp.desc}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
