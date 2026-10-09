"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import BrandLogo from "./BrandLogo";

const navLinks = [
  { href: "#planes", label: "Planes" },
  { href: "#portafolio", label: "Portafolio" },
  { href: "#como-trabajamos", label: "Cómo trabajamos" },
  { href: "#preguntas", label: "Preguntas" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 20);

      if (menuOpen || currentScrollY <= 80) {
        setHeaderHidden(false);
        lastScrollY = currentScrollY;
      } else if (currentScrollY > lastScrollY + 4) {
        setHeaderHidden(true);
        lastScrollY = currentScrollY;
      } else if (currentScrollY < lastScrollY - 4) {
        setHeaderHidden(false);
        lastScrollY = currentScrollY;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function handleNavClick() {
    setMenuOpen(false);
  }

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-40 transition-transform duration-300",
        headerHidden && !menuOpen ? "header-hidden" : "",
      ].join(" ")}
    >
      <div
        className={[
          "navbar-glass backdrop-blur-xl backdrop-saturate-150 max-w-6xl mx-auto px-5 flex items-center h-16",
          scrolled ? "navbar-glass-scrolled" : "",
        ].join(" ")}
      >
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2.5 font-display font-bold text-lg text-[var(--color-bone)] no-underline"
          aria-label="Gravity Labs — inicio"
        >
          <BrandLogo size={48} />
          <span className="tracking-tight">
            GRAVITY <span className="text-[var(--color-indigo-bright)]">LABS</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-6 ml-8"
          aria-label="Navegación principal"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link text-sm text-[var(--color-muted)] hover:text-[var(--color-bone)] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile: hamburger */}
        <div className="ml-auto flex md:hidden items-center gap-2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-[var(--color-bone)] hover:bg-white/10 transition-colors"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Menú de navegación"
        aria-hidden={!menuOpen}
        hidden={!menuOpen}
        className={[
          "mobile-menu-panel md:hidden",
          menuOpen ? "mobile-menu-panel-open" : "",
        ].join(" ")}
      >
        <nav
          className="flex flex-col px-5 py-8 gap-2"
          aria-label="Navegación móvil"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className="mobile-nav-link text-xl font-display font-semibold text-[var(--color-bone)] py-3 border-b border-white/10 hover:text-[var(--color-indigo-bright)] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
