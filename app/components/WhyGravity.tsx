import { siteConfig } from "../lib/config";
import ScrollReveal from "./ScrollReveal";

export default function WhyGravity() {
  return (
    <section
      className="py-16 md:py-24 bg-space"
      aria-labelledby="why-gravity-title"
    >
      <div className="max-w-6xl mx-auto px-5">
        <ScrollReveal className="max-w-3xl mx-auto text-center">
          <p className="overline mb-4" style={{ color: "var(--color-cyan-accent)" }}>
            Experiencia propia
          </p>
          <h2
            id="why-gravity-title"
            className="font-display font-bold text-3xl md:text-4xl text-[var(--color-bone)] leading-tight mb-5"
          >
            También aprendimos construyendo RINDE.
          </h2>
          <p className="text-[var(--color-muted)] text-lg leading-relaxed">
            Lanzar nuestra propia app nos enseñó que un buen producto necesita
            más que desarrollo. Esa experiencia guía cada proyecto de Gravity Labs.
          </p>
        </ScrollReveal>

        {/* Team section — controlled by flag */}
        {siteConfig.showTeam && (
          <div className="mt-16">
            <p className="overline mb-8 text-center" style={{ color: "var(--color-muted)" }}>
              El equipo
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {siteConfig.team.map((member) => (
                <div
                  key={member.id}
                  className="glass-card flex flex-col items-center gap-3 p-6 w-48"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center font-display font-bold text-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-indigo-primary), var(--color-cyan-accent))",
                      color: "white",
                    }}
                  >
                    {member.initials}
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-[var(--color-bone)] text-sm">
                      {member.name}
                    </p>
                    <p className="text-sm text-[var(--color-muted)] mt-0.5">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
