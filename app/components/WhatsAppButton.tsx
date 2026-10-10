"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import { siteConfig, type WhatsAppMessageKey } from "../lib/config";
import { buildWhatsAppLinkByKey } from "../lib/whatsapp";
import { trackEvent } from "../lib/analytics";

export type WhatsAppLocation =
  | "header"
  | "hero"
  | "hero_llamada"
  | "plan_nebula"
  | "plan_supernova"
  | "a_medida"
  | "portafolio"
  | "cierre"
  | "flotante";

interface WhatsAppButtonProps {
  children: ReactNode;
  location: WhatsAppLocation;
  messageKey: WhatsAppMessageKey;
  className?: string;
  id?: string;
  ariaLabel?: string;
  style?: CSSProperties;
}

export function WhatsAppButton({
  children,
  location,
  messageKey,
  className,
  id,
  ariaLabel,
  style,
}: WhatsAppButtonProps) {
  const message = siteConfig.whatsappMessages[messageKey];

  return (
    <a
      href={buildWhatsAppLinkByKey(messageKey)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={className}
      id={id}
      style={style}
      onClick={() => trackEvent("whatsapp_click", { location, message })}
    >
      {children}
    </a>
  );
}

export default function WhatsAppFloatingButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <WhatsAppButton
      location="flotante"
      messageKey="default"
      ariaLabel="Escribir por WhatsApp"
      className={[
        "fixed bottom-6 right-5 z-50 flex items-center justify-center",
        "w-14 h-14 rounded-full shadow-lg",
        "pb-safe",
        "transition-all duration-300",
        visible
          ? "opacity-100 scale-100 pointer-events-auto"
          : "opacity-0 scale-75 pointer-events-none",
      ].join(" ")}
      style={{
        background: "#147a4a",
        boxShadow: "0 4px 24px rgba(37,211,102,0.5)",
        bottom: "max(1.5rem, env(safe-area-inset-bottom) + 0.75rem)",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="28"
        height="28"
        fill="white"
        aria-hidden="true"
      >
        <path d="M16.003 2.667C8.638 2.667 2.667 8.639 2.667 16.003c0 2.358.62 4.617 1.796 6.608L2.667 29.333l6.891-1.768a13.274 13.274 0 0 0 6.445 1.668c7.364 0 13.33-5.97 13.33-13.33 0-7.362-5.966-13.236-13.33-13.236zm0 24.346a11.055 11.055 0 0 1-5.652-1.554l-.404-.241-4.09 1.049 1.077-3.972-.264-.406a11.066 11.066 0 0 1-1.704-5.886c0-6.118 4.98-11.094 11.037-11.094 6.059 0 11.038 4.976 11.038 11.094 0 6.12-4.979 11.01-11.038 11.01zm6.062-8.262c-.332-.166-1.965-.966-2.27-1.077-.305-.11-.527-.166-.748.167-.22.332-.857 1.077-1.05 1.299-.193.22-.387.248-.72.083-.332-.166-1.404-.517-2.673-1.65-.987-.882-1.653-1.97-1.847-2.303-.193-.332-.02-.512.145-.677.15-.148.332-.386.498-.58.166-.192.221-.33.332-.552.111-.22.056-.414-.028-.58-.083-.166-.748-1.8-1.025-2.466-.27-.648-.545-.56-.748-.57-.193-.009-.415-.011-.637-.011-.221 0-.581.083-.885.415-.305.332-1.161 1.133-1.161 2.765 0 1.633 1.189 3.21 1.355 3.432.166.22 2.34 3.573 5.672 5.01.793.342 1.411.547 1.893.7.795.253 1.52.217 2.093.132.638-.096 1.965-.803 2.243-1.578.277-.775.277-1.44.194-1.578-.082-.138-.305-.221-.637-.388z" />
      </svg>
    </WhatsAppButton>
  );
}
