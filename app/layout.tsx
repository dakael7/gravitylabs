import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gravity Labs · Tu negocio, con una web que vende",
  description:
    "Diseñamos y programamos tu página web lista para recibir clientes. Precios publicados desde $98. Especialistas en negocios venezolanos que quieren vender más.",
  openGraph: {
    title: "Gravity Labs · Tu negocio, con una web que vende",
    description:
      "Diseñamos y programamos tu página web lista para recibir clientes. Precios publicados desde $98.",
    locale: "es_VE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gravity Labs · Tu negocio, con una web que vende",
    description:
      "Diseñamos y programamos tu página web lista para recibir clientes. Precios publicados desde $98.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-dvh flex flex-col antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
