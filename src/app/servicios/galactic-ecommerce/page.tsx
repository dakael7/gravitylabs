"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Gravity Labs - Service Detail: Galactic E-Commerce (V-0.3)
 * David: Versión en español con espaciado optimizado.
 * Se ajustaron los contenedores para evitar desbordamiento de botones.
 */
export default function GalacticEcommerce() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#030308]" />;

  return (
    <main className="min-h-screen bg-[#030308] text-white overflow-hidden relative selection:bg-emerald-500/30">
      
      {/* Capas de Fondo */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-emerald-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 blur-[130px] rounded-full animate-pulse" style={{ animationDuration: '13s' }} />
        
        <svg className="absolute inset-0 w-full h-full opacity-30">
          {[...Array(90)].map((_, i) => (
            <circle
              key={i}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r={Math.random() * 0.8 + 0.4}
              fill="white"
              className="animate-pulse"
              style={{ 
                animationDelay: `${Math.random() * 8}s`,
                opacity: Math.random() * 0.5 + 0.5 
              }}
            />
          ))}
        </svg>
      </div>

      <style>{`
        @keyframes flow-horizontal { from { transform: translateX(-100%); } to { transform: translateX(300%); } }
        @keyframes coin-float { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-20px) scale(1.05); } }
        @keyframes border-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-reveal { animation: revealUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        @keyframes revealUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Navegación */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#030308]/50 backdrop-blur-2xl border-b border-white/5">
        <div className="flex justify-between items-center px-10 py-6 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity">
              <Image src="/logo.png" alt="Gravity Labs" fill className="object-contain" />
            </div>
            <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-gray-400 group-hover:text-white transition-colors">Regresar</span>
          </Link>
          <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest border border-emerald-500/20 px-4 py-2 rounded-full backdrop-blur-md">
            ID_PROTOCOLO: V-0.3_GALACTIC
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-4 animate-reveal">
                <span className="w-12 h-[1px] bg-emerald-500" />
                <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-[0.8em]">Motor_Ventas_Activo</span>
              </div>
              <h1 className="text-7xl md:text-8xl font-black tracking-tighter animate-reveal [animation-delay:0.2s]">
                Galactic <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 italic">E-Commerce.</span>
              </h1>
              <p className="text-gray-400 text-xl font-light leading-relaxed max-w-xl animate-reveal [animation-delay:0.4s]">
                No es solo una tienda, es una máquina de facturación. Ingeniería optimizada para procesar transacciones sin fricción, integrada con pasarelas globales y diseño de alta resolución.
              </p>
              <div className="flex gap-6 pt-6 animate-reveal [animation-delay:0.6s]">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex-1 backdrop-blur-md">
                  <span className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Inversión Base</span>
                  <span className="text-3xl font-black text-emerald-400">$2,400</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex-1 backdrop-blur-md">
                  <span className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Ciclo de Obra</span>
                  <span className="text-3xl font-black uppercase text-white">25-30 Días</span>
                </div>
              </div>
            </div>

            {/* Visual: Motor de Ventas Optimizado */}
            <div className="relative aspect-square flex items-center justify-center animate-reveal [animation-delay:0.5s] scale-95 lg:scale-105">
              <div className="absolute w-[110%] h-[110%] border border-emerald-500/5 rounded-full animate-[spin_120s_linear_infinite]" />
              
              <div className="relative w-full max-w-[450px] h-[550px] flex items-center justify-center">
                
                {/* Tarjeta de Producto - Espaciado Mejorado */}
                <div className="absolute top-0 right-4 w-[280px] h-auto bg-[#07070F] border border-white/10 rounded-[2.5rem] p-6 shadow-2xl z-30 animate-[coin-float_8s_ease-in-out_infinite] backdrop-blur-md">
                  <div className="w-full h-40 bg-gradient-to-br from-emerald-500/30 to-blue-600/20 rounded-3xl mb-5 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute top-3 right-3 px-2 py-1 bg-emerald-500 text-[8px] font-black rounded-md text-black uppercase">NUEVO</div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="h-2 w-24 bg-white/20 rounded-full" />
                      <div className="text-[12px] font-mono text-emerald-400 font-bold">$299.00</div>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full" />
                    <div className="flex gap-2 pt-1">
                      {[...Array(3)].map((_, i) => <div key={i} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10" />)}
                    </div>
                    {/* Botón con padding seguro */}
                    <div className="w-full bg-emerald-500 py-4 rounded-2xl flex items-center justify-center text-[9px] font-black tracking-[0.2em] uppercase text-black mt-2 cursor-pointer hover:bg-emerald-400 transition-all active:scale-95">
                      Añadir al Carrito
                    </div>
                  </div>
                </div>

                {/* Etiquetas Flotantes */}
                <div className="absolute top-20 left-0 z-40 flex flex-col gap-3 animate-[coin-float_10s_ease-in-out_infinite_reverse]">
                  {['Moda_Urbana', 'Edición_Limitada', 'Cyber_Ventas'].map((tag, i) => (
                    <div key={i} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl text-[8px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
                      {tag}
                    </div>
                  ))}
                </div>

                {/* Panel de Pago - Ajustado para evitar salida de botones */}
                <div className="absolute bottom-10 left-4 w-[300px] h-auto bg-[#0A0A1F]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 z-20 -rotate-3 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Pago_Seguro</span>
                    <div className="flex gap-1.5">
                      <div className="w-7 h-4 bg-white/10 rounded-sm" />
                      <div className="w-7 h-4 bg-emerald-500/40 rounded-sm" />
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="h-2 w-20 bg-white/20 rounded-full" />
                        <div className="h-2 w-12 bg-white/10 rounded-full" />
                      </div>
                      <div className="text-xl font-black text-white">$299.00</div>
                    </div>
                    <div className="h-[1px] w-full bg-white/10" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-10 bg-white/5 rounded-xl border border-white/5" />
                      <div className="h-10 bg-emerald-500/20 rounded-xl border border-emerald-500/30 flex items-center justify-center text-[8px] font-bold text-emerald-400 uppercase tracking-tighter">
                        PAGAR
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notificación de Venta */}
                <div className="absolute bottom-4 right-4 bg-emerald-500 text-black px-5 py-3.5 rounded-2xl z-40 flex items-center gap-3 animate-bounce shadow-2xl shadow-emerald-500/30">
                  <div className="w-7 h-7 bg-black/10 rounded-full flex items-center justify-center text-[10px]">✓</div>
                  <div className="flex flex-col">
                    <span className="text-[7px] font-black uppercase tracking-tighter">Venta_Confirmada</span>
                    <span className="text-[10px] font-bold">Hace 1 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-24 relative z-10 px-8 border-t border-white/5 bg-emerald-500/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 space-y-4 text-center lg:text-left">
            <h2 className="text-sm font-mono text-emerald-400 tracking-[0.3em] uppercase">Sistema_Lógica_Comercial</h2>
            <p className="text-4xl font-bold tracking-tight">Arquitectura de Conversión Galáctica.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Pasarelas Multi-Canal", desc: "Integración nativa con Stripe, PayPal y sistemas locales para procesar pagos sin fricción.", label: "PAGOS_SYNC" },
              { title: "Gestor de Inventario", desc: "Gestión autónoma de stock y variaciones con carga ultra-rápida y actualizaciones en tiempo real.", label: "STOCK_INTELIGENTE" },
              { title: "Check-out en 1 Clic", desc: "Optimización técnica del túnel de venta para maximizar la conversión y reducir carritos abandonados.", label: "CERO_FRICCIÓN" },
              { title: "Analítica de Ventas", desc: "Tablero para medir el ROI y comportamiento del usuario. Ingeniería orientada a resultados.", label: "RASTREO_INGRESOS" }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-md hover:border-emerald-500/40 transition-all group">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                </div>
                <span className="text-[9px] font-mono text-gray-500 block mb-2 tracking-widest">{feature.label}</span>
                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className="py-32 relative z-10 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 rounded-[3rem] p-12 md:p-24 text-center backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            <div className="relative z-10 space-y-10">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                Construye un <br />
                <span className="text-emerald-400">Imperio Comercial.</span>
              </h2>
              <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                No construimos webs, desplegamos infraestructuras de ingresos. El paquete Galactic es la herramienta definitiva para dominar tu sector.
              </p>
              <div className="pt-6">
                <Link 
                  href="/contratacion" 
                  className="inline-flex items-center gap-6 bg-white text-black px-14 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-emerald-500 hover:text-white transition-all transform active:scale-95 shadow-2xl shadow-emerald-500/20"
                >
                  DESPLEGAR TIENDA
                </Link>
              </div>
              <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest pt-8">
                Ingeniería Gravity Labs // Despliegue_Seguro_Activo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center relative z-10">
        <div className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.8em]">
          Gravity Labs Deployment System © 2026 // David
        </div>
      </footer>
    </main>
  );
}