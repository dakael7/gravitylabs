"use client";

/**
 * Gravity Labs - Versión Final Unificada
 * - Layout: Sin espacios entre Navbar y Hero (flex-col).
 * - Mensaje: Fusión explícita entre programación avanzada y marketing.
 * - Visual: Sol tecnológico y satélites con efecto fluido (Lava Lamp).
 * - Estilo: Minimalista, elegante y profesional.
 */
import React from 'react';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#05050b] text-white overflow-hidden relative selection:bg-cyan-500/30">
      
      {/* Animaciones Globales */}
      <style jsx global>{`
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes lava-pulse {
          0%, 100% { transform: scale(1); filter: blur(4px); opacity: 0.7; }
          50% { transform: scale(1.5); filter: blur(2px); opacity: 1; }
        }
        @keyframes sun-corona {
          0%, 100% { transform: scale(1); opacity: 0.4; filter: blur(60px); }
          50% { transform: scale(1.3); opacity: 0.6; filter: blur(90px); }
        }
        
        .animate-orbit-slow { animation: orbit 50s linear infinite; }
        .animate-orbit-mid { animation: orbit 35s linear infinite reverse; }
        .animate-orbit-fast { animation: orbit 22s linear infinite; }
        .animate-orbit-hyper { animation: orbit 15s linear infinite reverse; }
        
        .lava-satellite {
          animation: lava-pulse 3.5s ease-in-out infinite;
        }
      `}</style>

      {/* Fondo Atmosférico sutil */}
      <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* CONTENEDOR UNIFICADO: Navbar + Hero en una sola pieza */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navbar Minimalista */}
        <nav className="flex justify-between items-center px-10 py-8 max-w-7xl w-full mx-auto">
          <div className="flex items-center gap-6 group cursor-pointer">
            <div className="relative w-12 h-12 transition-transform duration-500 group-hover:scale-110">
              <Image 
                src="/logo.png" 
                alt="Gravity Labs" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col border-l border-white/10 pl-6 py-0.5">
              <span className="font-light text-xl tracking-[0.35em] uppercase text-white/90 leading-none mb-1">
                Gravity
              </span>
              <span className="text-[8px] tracking-[0.75em] text-cyan-400 font-mono uppercase leading-none">
                Labs
              </span>
            </div>
          </div>

          <div className="hidden md:flex gap-14 text-[12px] uppercase tracking-[0.4em] text-gray-500 font-semibold items-center">
            <a href="#" className="hover:text-cyan-400 transition-colors duration-300">Services</a>
            <a href="#" className="hover:text-cyan-400 transition-colors duration-300">Portfolio</a>
            <button className="bg-white/5 border border-white/10 px-9 py-3 rounded-full text-[11px] font-bold tracking-[0.3em] hover:bg-white/10 transition-all text-white/80">
              Menu
            </button>
          </div>
        </nav>

        {/* Hero Section: Se integra sin espacios muertos */}
        <section className="flex-1 flex items-center max-w-7xl w-full mx-auto px-8 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-center">
            
            {/* Texto de Marketing Directo */}
            <div className="space-y-10">
              <div className="inline-flex items-center gap-4">
                <div className="h-[1px] w-12 bg-cyan-500/60" />
                <span className="text-cyan-400 font-mono text-[10px] tracking-[0.6em] uppercase">Tech & Strategy</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
                Marketing <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-300">
                  Impulsado
                </span>
              </h1>

              <p className="text-gray-400 text-lg max-w-md leading-relaxed font-light">
                Donde la <span className="text-white/90 font-medium">programación avanzada</span> se encuentra con el <span className="text-white/90 font-medium">marketing de resultados</span>. Creamos activos digitales de alto impacto diseñados para escalar tu marca.
              </p>

              <div className="pt-4">
                <button className="group relative bg-indigo-600 hover:bg-indigo-500 px-14 py-5 rounded-2xl font-bold transition-all shadow-[0_15px_40px_rgba(79,70,229,0.3)] hover:-translate-y-1 active:scale-95 overflow-hidden">
                  <span className="relative z-10 text-sm tracking-widest uppercase">Despega Ahora</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </button>
              </div>
            </div>

            {/* Sistema Orbital Lava Lamp */}
            <div className="relative flex justify-center items-center h-[600px] lg:translate-x-12">
              
              {/* Núcleo Solar Premium */}
              <div className="absolute w-72 h-72 rounded-full bg-indigo-600/30 blur-[70px] animate-sun-corona" />
              <div className="absolute w-44 h-44 rounded-full bg-[radial-gradient(circle_at_30%_30%,#4f46e5_0%,#1e1b4b_100%)] border border-white/20 shadow-[0_0_100px_rgba(79,70,229,0.5)] z-10" />

              {/* Órbita 1: Externa - 3 Satélites Lava */}
              <div className="absolute w-[540px] h-[540px] rounded-full border border-white/[0.03] animate-orbit-slow">
                <div className="absolute top-10 left-1/4 w-5 h-5 rounded-full bg-blue-500 shadow-[0_0_25px_#3b82f6] lava-satellite" />
                <div className="absolute bottom-20 right-10 w-3 h-3 rounded-full bg-indigo-400 shadow-[0_0_15px_#818cf8] lava-satellite" />
                <div className="absolute top-1/2 -left-1 w-2 h-2 rounded-full bg-white/30" />
              </div>

              {/* Órbita 2: Media - 2 Satélites Brillantes */}
              <div className="absolute w-[400px] h-[400px] rounded-full border border-white/[0.07] animate-orbit-mid">
                <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_35px_#22d3ee] lava-satellite" />
                <div className="absolute bottom-10 left-10 w-4 h-4 rounded-full bg-blue-300 shadow-[0_0_20px_#93c5fd] lava-satellite" />
              </div>

              {/* Órbita 3: Interna - 2 Satélites Energía */}
              <div className="absolute w-[280px] h-[280px] rounded-full border border-white/10 animate-orbit-fast">
                <div className="absolute top-0 right-1/2 w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_30px_#a855f7] lava-satellite" />
                <div className="absolute bottom-5 right-5 w-2 h-2 rounded-full bg-cyan-200 shadow-[0_0_15px_#a5f3fc] lava-satellite" />
              </div>

              {/* Órbita 4: Hyper - 1 Satélite Destello */}
              <div className="absolute w-[200px] h-[200px] animate-orbit-hyper">
                <div className="absolute top-1/2 -right-1 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_25px_#fff] lava-satellite" />
              </div>

              {/* Tarjeta Informativa Glassmorphism */}
              <div className="absolute -right-16 bottom-4 bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] w-80 shadow-2xl z-20 hover:bg-white/[0.05] transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                </div>
                <h4 className="font-bold text-2xl mb-2 tracking-tight text-white/90">Estrategia Activa</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-light">
                  Monitoreo en tiempo real y optimización de activos digitales mediante código de alta precisión.
                </p>
              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}