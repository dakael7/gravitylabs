"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
      observer.unobserve(el);
      window.clearTimeout(fallbackTimer);
    };

    const bounds = el.getBoundingClientRect();
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      (bounds.top <= window.innerHeight && bounds.bottom >= 0)
    ) {
      return;
    }

    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    el.style.transition = `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`;

    const fallbackTimer = window.setTimeout(reveal, 2500);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal();
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px 15% 0px" }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, [delay]);

  return (
    <div ref={ref} className={className} data-scroll-reveal="true">
      {children}
    </div>
  );
}
