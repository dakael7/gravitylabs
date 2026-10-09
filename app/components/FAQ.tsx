import { ChevronDown } from "lucide-react";
import { siteConfig } from "../lib/config";
import ScrollReveal from "./ScrollReveal";

function FaqItem({ item }: { item: typeof siteConfig.faq[number] }) {
  const headingId = `faq-heading-${item.id}`;
  const panelId = `faq-panel-${item.id}`;

  return (
    <details className="glass-card faq-item overflow-hidden">
      <summary
        id={headingId}
        aria-controls={panelId}
        className="faq-toggle w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        style={{ minHeight: "60px" }}
      >
        <span className="faq-question font-display font-semibold text-[var(--color-bone)] text-base md:text-lg leading-snug">
          {item.question}
        </span>
        <ChevronDown
          size={20}
          className="faq-chevron"
          color="var(--color-muted)"
          aria-hidden="true"
        />
      </summary>

      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        className="faq-content"
      >
        <div>
          <p className="px-6 pb-5 text-[var(--color-muted)] text-base leading-relaxed">
            {item.answer}
          </p>
        </div>
      </div>
    </details>
  );
}

export default function FAQ() {
  return (
    <section
      id="preguntas"
      className="py-16 md:py-24"
      style={{ background: "var(--color-space-deep)" }}
      aria-labelledby="faq-title"
    >
      <div className="max-w-6xl mx-auto px-5">
        <ScrollReveal className="mb-12">
          <p className="overline mb-3" style={{ color: "var(--color-cyan-accent)" }}>
            Preguntas frecuentes
          </p>
          <h2
            id="faq-title"
            className="font-display font-bold text-3xl md:text-4xl text-[var(--color-bone)] leading-tight"
          >
            Lo que suelen{" "}
            <em className="not-italic text-[var(--color-cyan-accent)]">preguntarnos.</em>
          </h2>
        </ScrollReveal>

        <div className="flex flex-col gap-3">
          {siteConfig.faq.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 60}>
              <FaqItem item={item} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
