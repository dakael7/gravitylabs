/**
 * Layout principal de Gravity Labs.
 * Este archivo es el que carga los estilos globales en toda la aplicación.
 */
import "./globals.css"; // ESTA LÍNEA ES VITAL
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gravity Labs",
  description: "Creative Software & Art",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      {/* La clase 'antialiased' ayuda a que las fuentes se vean mejor en modo oscuro */}
      <body className="antialiased">{children}</body>
    </html>
  );
}