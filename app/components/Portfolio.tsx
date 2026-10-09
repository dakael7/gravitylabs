"use client";

import Image from "next/image";
import { ExternalLink, Globe, Smartphone } from "lucide-react";
import { siteConfig } from "../lib/config";
import ScrollReveal from "./ScrollReveal";
import { useState } from "react";

type Project = (typeof siteConfig.projects)[number];

function GooglePlayIcon({ size = 18 }: { size?: number }) {
  return (
    <Image
      src="/images/res/googleplay.png"
      alt=""
      aria-hidden="true"
      width={960}
      height={1060}
      className="shrink-0 object-contain"
      style={{ width: size, height: size }}
    />
  );
}

function BrowserFrame({ project }: { project: Project }) {
  const [imgError, setImgError] = useState(false);
  const host = project.url
    ? project.url.replace(/^https?:\/\//, "").split("/")[0]
    : project.title.toLowerCase();

  return (
    <div
      className="portfolio-screenshot-hover rounded-2xl overflow-hidden relative group cursor-pointer"
      style={{
        background: "rgba(13,18,32,0.9)",
        border: "1px solid rgba(255,255,255,0.10)",
      }}
    >
      {/* Browser chrome bar */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{
          background: "rgba(8,12,20,0.8)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/50 flex-shrink-0" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50 flex-shrink-0" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/50 flex-shrink-0" />
        <span
          className="mx-auto px-4 py-0.5 rounded-full text-xs text-[var(--color-muted)] font-mono"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            maxWidth: "200px",
          }}
        >
          {host}
        </span>
      </div>

      {/* Screenshot area */}
      <div className="relative overflow-hidden" style={{ height: "300px" }}>
        {imgError || !project.screenshot ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ background: "linear-gradient(135deg, rgba(91,94,244,0.08), rgba(17,24,39,0.95))" }}
          >
            <Globe size={40} color="var(--color-muted)" aria-hidden="true" />
            <span className="text-sm text-[var(--color-muted)]">Captura próximamente</span>
          </div>
        ) : (
          <Image
            src={project.screenshot}
            alt={project.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top"
            onError={() => setImgError(true)}
            loading="lazy"
            style={{ transition: "object-position 5s ease-in-out" }}
          />
        )}

        {/* Hover overlay with CTA (desktop) */}
        {project.url && (
          <div
            className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                "linear-gradient(to top, rgba(8,12,20,0.92) 0%, transparent 60%)",
            }}
          >
            <span
              className="btn btn-primary"
              style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", minHeight: "40px" }}
            >
              {project.ctaLabel} →
            </span>
          </div>
        )}
      </div>

      {/* Mobile: always-visible CTA below frame */}
      {project.url && (
        <div
          className="md:hidden flex items-center justify-end px-4 py-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="text-sm font-semibold text-[var(--color-indigo-bright)] flex items-center gap-1">
            {project.ctaLabel} →
          </span>
        </div>
      )}
    </div>
  );
}

function AppFrame({ project }: { project: Project }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex w-full flex-col items-center">
      <div
        className="group relative mx-auto w-full cursor-pointer overflow-hidden"
        style={{
          maxWidth: "190px",
          padding: "6px",
          background: "linear-gradient(145deg, #47536a, #0a0f19 38%, #283348)",
          border: "1px solid rgba(206,222,255,0.48)",
          borderRadius: "29px",
          boxShadow:
            "0 26px 62px rgba(0,0,0,0.62), 0 0 32px rgba(93,107,255,0.18)",
        }}
      >
        <div
          className="absolute left-1/2 top-[13px] z-10 -translate-x-1/2"
          style={{
            width: "27%",
            height: "8px",
            borderRadius: "999px",
            background: "#0b1018",
          }}
          aria-hidden="true"
        />
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: "0.49",
            borderRadius: "23px",
            background: "rgba(13,18,32,0.95)",
          }}
        >
          {imgError || !project.screenshot ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.08), rgba(17,24,39,0.95))" }}
            >
              <Smartphone size={36} color="var(--color-muted)" aria-hidden="true" />
              <span className="text-xs text-[var(--color-muted)]">Captura próximamente</span>
            </div>
          ) : (
            <Image
              src={project.screenshot}
              alt={project.alt}
              fill
              sizes="(max-width: 768px) calc(100vw - 72px), 190px"
              className="object-cover object-top"
              onError={() => setImgError(true)}
              loading="lazy"
              style={{ transition: "transform 0.4s ease" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const isFeatured = project.featured;
  const hasUrl = Boolean(project.url);

  const inner = (
    <div
      className={[
        "glass-card glass-card-hover h-full flex flex-col gap-5 overflow-hidden",
        isFeatured ? "md:col-span-2" : "",
      ].join(" ")}
      style={
        isFeatured
          ? {
              background:
                "linear-gradient(145deg, rgba(91,94,244,0.09) 0%, rgba(17,24,39,0.85) 60%)",
              borderColor: "rgba(91,94,244,0.3)",
            }
          : {}
      }
    >
      {/* Image frame */}
      <div className="p-5 pb-0">
        {project.type === "web" ? (
          <BrowserFrame project={project} />
        ) : (
          <div className="flex justify-center py-4">
            <AppFrame project={project} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-5 pb-6 flex flex-col gap-3 flex-1">
        {/* Label chip + external icon */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`chip text-xs ${
              project.label === "Proyecto real" ? "chip-emerald" : "chip-indigo"
            }`}
          >
            {project.label}
          </span>
          {project.type === "app" && hasUrl ? (
            <span className="chip chip-emerald inline-flex items-center gap-1.5 text-xs">
              <GooglePlayIcon size={14} />
              Disponible en Google Play
            </span>
          ) : hasUrl ? (
            <ExternalLink size={15} color="var(--color-muted)" aria-hidden="true" />
          ) : (
            <span className="chip chip-muted text-xs">Próximamente</span>
          )}
        </div>

        <h3 className="font-display font-bold text-xl text-[var(--color-bone)] leading-tight">
          {project.title}
        </h3>
        <p
          className="text-[var(--color-muted)] text-sm leading-relaxed"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {project.description}
        </p>
      </div>
    </div>
  );

  if (hasUrl) {
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Abrir ${project.title} en una pestaña nueva`}
        className={[
          "block h-full",
          isFeatured ? "md:col-span-2" : "",
        ].join(" ")}
      >
        {inner}
      </a>
    );
  }

  return (
    <div className={isFeatured ? "md:col-span-2" : ""}>{inner}</div>
  );
}

export default function Portfolio() {
  return (
    <section
      id="portafolio"
      className="py-16 md:py-24 bg-space"
      aria-labelledby="portfolio-title"
    >
      <div className="max-w-6xl mx-auto px-5">
        {/* Header */}
        <ScrollReveal className="mb-12">
          <p className="overline mb-3" style={{ color: "var(--color-cyan-accent)" }}>
            Portafolio
          </p>
          <h2
            id="portfolio-title"
            className="font-display font-bold text-3xl md:text-4xl text-[var(--color-bone)] leading-tight mb-3"
          >
            Mira cómo{" "}
            <em className="not-italic text-[var(--color-cyan-accent)]">se ve</em>{" "}
            el trabajo.
          </h2>
          <p className="text-[var(--color-muted)] text-base">
            Toca un proyecto y entra a verlo completo.
          </p>
        </ScrollReveal>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {siteConfig.projects.map((project, i) => (
            <ScrollReveal
              key={project.id}
              delay={i * 100}
              className={project.featured ? "md:col-span-2" : ""}
            >
              <ProjectCard project={project} />
            </ScrollReveal>
          ))}

        </div>

        {/* Disclaimer */}
        <ScrollReveal>
          <p className="text-center text-xs text-[var(--color-muted)] mt-8 max-w-xl mx-auto leading-relaxed">
            Los conceptos de diseño son ejemplos creados por Gravity Labs. Los
            proyectos reales se indican como tales.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
