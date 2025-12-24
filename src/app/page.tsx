"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

/**
 * Gravity Labs - High Fidelity Restoration (Enhanced Edition)
 * David: Se ajustaron alineaciones de títulos y párrafos para eliminar ruido visual
 * y garantizar una estructura simétrica en todos los bloques de contenido.
 */
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [browserName, setBrowserName] = useState("USER");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Detección de agente de usuario para personalización de terminal
    const ua = navigator.userAgent;
    let browser = "USER";
    if (ua.includes("Firefox")) browser = "FIREFOX";
    else if (ua.includes("SamsungBrowser")) browser = "SAMSUNG_BROWSER";
    else if (ua.includes("Opera") || ua.includes("OPR")) browser = "OPERA";
    else if (ua.includes("Edge") || ua.includes("Edg")) browser = "EDGE";
    else if (ua.includes("Chrome")) browser = "CHROME";
    else if (ua.includes("Safari")) browser = "SAFARI";
    setBrowserName(browser);

    const handleScroll = () => setScrollY(window.scrollY);
    
    // Controlador de cierre para el menú desplegable (Outside Click)
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    setIsMenuOpen(false);
  };

  if (!mounted) return <div className="min-h-screen bg-[#05050b]" />;

  const categorias = [
    {
      titulo: "Arquitectura de Ecosistemas Web",
      subtitulo: "Desarrollo basado en componentes de alto rendimiento y escalabilidad atómica.",
      paquetes: [
        { nombre: "Nebula Landing", precio: "$499", desc: "Monopágina de alto impacto optimizada para conversiones rápidas y SEO técnico." },
        { nombre: "Supernova Business", precio: "$1,200", desc: "Arquitectura corporativa completa con CMS headless y gestión dinámica de contenido." },
        { nombre: "Galactic E-Commerce", precio: "$2,500+", desc: "Infraestructura comercial robusta con lógica de inventario global y seguridad de nivel bancario." }
      ]
    },
    {
      titulo: "Sistemas de Órbita Móvil",
      subtitulo: "Aplicaciones nativas e híbridas diseñadas para una retención de usuario superior.",
      paquetes: [
        { nombre: "Prototipo Pulsar", precio: "$1,800", desc: "MVP (Producto Mínimo Viable) diseñado para validación de mercado en ciclos de 4 semanas." },
        { nombre: "Cosmos iOS/Android", precio: "$3,500", desc: "Experiencia multiplataforma fluida con integración de sensores y notificaciones push inteligentes." },
        { nombre: "Titan Enterprise", precio: "Custom", desc: "Soluciones de software complejas con sincronización en tiempo real y arquitectura de microservicios." }
      ]
    }
  ];

  const pasosProceso = [
    { n: "01", t: "Discovery", d: "Inmersión profunda en tu modelo de negocio para identificar cuellos de botella y vectores de crecimiento.", tech: "Data Audit / Market Research" },
    { n: "02", t: "Strategy", d: "Diseño de la arquitectura lógica y el roadmap de marketing orientado a resultados cuantificables.", tech: "Logic Mapping / UI/UX Design" },
    { n: "03", t: "Development", d: "Codificación modular utilizando los últimos estándares de la industria y pruebas de estrés constantes.", tech: "Next.js / Node.js / AI Cloud" },
    { n: "04", t: "Liftoff", d: "Despliegue controlado, monitoreo de métricas post-lanzamiento y optimización continua de conversión.", tech: "Deployment / Scale / Support" }
  ];

  return (
    <main className="min-h-screen bg-[#05050b] text-white overflow-hidden relative selection:bg-cyan-500/30">
      
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes sun-corona { 0%, 100% { transform: scale(1); opacity: 0.4; filter: blur(60px); } 50% { transform: scale(1.3); opacity: 0.6; filter: blur(90px); } }
        @keyframes lava-pulse { 0%, 100% { transform: scale(1); filter: blur(4px); opacity: 0.8; } 50% { transform: scale(1.4); filter: blur(2px); opacity: 1; } }
        @keyframes revealUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }
        @keyframes scan-line { 0% { top: -10%; } 100% { top: 110%; } }
        @keyframes flow-line { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes terminal-flicker { 0% { opacity: 1; } 50% { opacity: 0.8; } 100% { opacity: 1; } }

        .animate-orbit-slow { animation: orbit 70s linear infinite; }
        .animate-orbit-mid { animation: orbit 45s linear infinite reverse; }
        .animate-orbit-fast { animation: orbit 30s linear infinite; }
        .animate-sun-corona { animation: sun-corona 6s ease-in-out infinite; }
        .lava-satellite { animation: lava-pulse 4s ease-in-out infinite; }
        .animate-reveal { animation: revealUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.3s; }
        .delay-2 { animation-delay: 0.5s; }
        .delay-3 { animation-delay: 0.7s; }

        .star { position: absolute; background: white; border-radius: 50%; pointer-events: none; }
        .glow-border-container { position: relative; padding: 1px; overflow: hidden; border-radius: 2.5rem; background: rgba(255, 255, 255, 0.05); }
        .glow-border-tracer { position: absolute; width: 200%; height: 200%; top: -50%; left: -50%; background: conic-gradient(from 0deg, transparent 0deg, #22d3ee 180deg, #4f46e5 240deg, transparent 300deg); animation: orbit 4s linear infinite; filter: blur(10px); }
        .glow-content-wrapper { position: relative; background: #080812; border-radius: calc(2.5rem - 1px); z-index: 10; }
        .glass-card { background: rgba(255, 255, 255, 0.01); backdrop-filter: blur(30px); border: 1px solid rgba(255, 255, 255, 0.05); transition: all 0.5s ease; }
        .glass-card:hover { background: rgba(255, 255, 255, 0.03); transform: translateY(-5px); border-color: rgba(34, 211, 238, 0.2); }
        .input-field { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 1.25rem; padding: 1.25rem; color: white; width: 100%; outline: none; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .input-field:focus { background: rgba(255, 255, 255, 0.05); border-color: #22d3ee; box-shadow: 0 0 20px rgba(34, 211, 238, 0.1); }
        .footer-link { color: #6b7280; transition: all 0.3s ease; display: block; padding: 4px 0; cursor: pointer; }
        .footer-link:hover { color: #22d3ee; transform: translateX(8px); }
        .scan-effect { position: absolute; left: 0; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, #22d3ee, transparent); opacity: 0.3; pointer-events: none; }
        .step-node:hover .scan-effect { animation: scan-line 1.5s linear infinite; }
      `}</style>

      {/* RENDERIZADO DE PARTÍCULAS ESTELARES */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(60)].map((_, i) => (
          <div key={i} className={`star ${i % 4 === 0 ? 'w-[2px] h-[2px] shadow-[0_0_6px_white]' : 'w-[1px] h-[1px]'}`}
            style={{ 
              top: `${(i * 17) % 100}%`, left: `${(i * 23) % 100}%`, 
              animationName: 'twinkle', animationDuration: `${3 + (i % 5)}s`,
              animationIterationCount: 'infinite', animationTimingFunction: 'ease-in-out',
              transform: `translateY(${scrollY * -((i % 4 === 0) ? 0.15 : 0.03)}px)` 
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#05050b]/85 backdrop-blur-xl border-b border-white/5">
          <div className="flex justify-between items-center px-10 py-6 max-w-7xl w-full mx-auto">
            <div className="flex items-center gap-6 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="relative w-12 h-12 transition-all duration-700 group-hover:rotate-[360deg]">
                <Image src="/logo.png" alt="Gravity Labs Logo" fill className="object-contain" priority />
              </div>
              <div className="flex flex-col border-l border-white/10 pl-6 py-0.5">
                <span className="font-light text-xl tracking-[0.4em] uppercase text-white leading-none mb-1">Gravity</span>
                <span className="text-[8px] tracking-[0.8em] text-cyan-400 font-mono uppercase leading-none opacity-80">Technology Labs</span>
              </div>
            </div>
            
            <div className="hidden md:flex gap-14 text-[11px] uppercase tracking-[0.45em] text-gray-500 font-bold items-center">
              <div className="flex gap-2 items-center text-[9px] font-mono text-cyan-500/60 uppercase tracking-widest mr-4">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Auth_Success
              </div>
              <a href="#servicios" onClick={(e) => handleSmoothScroll(e, 'servicios')} className="hover:text-cyan-400 transition-colors">Services</a>
              <a href="#proceso" onClick={(e) => handleSmoothScroll(e, 'proceso')} className="hover:text-cyan-400 transition-colors">Process</a>
              
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`px-10 py-3.5 rounded-full text-[10px] font-black tracking-[0.35em] transition-all border ${isMenuOpen ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/90 hover:bg-white/10'}`}
                >
                  CONSOLE
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-5 w-64 bg-[#0a0a15] border border-white/10 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-reveal overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
                    <button className="w-full text-left px-6 py-4 rounded-xl hover:bg-white/5 transition-all group">
                      <span className="block text-[10px] text-white/80 tracking-[0.2em] group-hover:text-cyan-400 uppercase">Client Access</span>
                    </button>
                    <button className="w-full text-left px-6 py-4 rounded-xl hover:bg-white/5 transition-all group">
                      <span className="block text-[10px] text-white/80 tracking-[0.2em] group-hover:text-cyan-400 uppercase">Project Tracking</span>
                    </button>
                    <div className="h-[1px] bg-white/5 my-2 mx-4" />
                    <button className="w-full text-left px-6 py-4 rounded-xl hover:bg-white/5 transition-all group">
                      <span className="block text-[10px] text-gray-600 tracking-[0.25em] group-hover:text-indigo-400 font-mono uppercase">Sys_Log_V2.0</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        <div id="inicio" className="h-32" />

        {/* Hero Section - Core System */}
        <section className="flex-1 flex items-start max-w-7xl w-full mx-auto px-8 pt-4 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-center">
            <div className="space-y-10 mt-10">
              <div className="inline-flex items-center gap-5 animate-reveal">
                <div className="h-[1px] w-14 bg-indigo-500/50" />
                <span className="text-indigo-400 font-mono text-[10px] tracking-[0.7em] uppercase">High Fidelty Solutions</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter animate-reveal delay-1 text-white">Digital <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">Evolution</span></h1>
              <p className="text-gray-400 text-xl max-w-lg font-light leading-relaxed animate-reveal delay-2 italic">
                Ingeniería de software de precisión diseñada para empresas que no aceptan el status quo. Elevamos tu marca a una órbita superior.
              </p>
              <div className="pt-6 animate-reveal delay-3 flex items-center gap-8">
                <button onClick={(e) => handleSmoothScroll(e as any, 'servicios')} className="bg-indigo-600 hover:bg-indigo-500 px-16 py-5 rounded-2xl font-black transition-all shadow-3xl shadow-indigo-500/30 uppercase tracking-[0.3em] text-[11px]">Explorar Órbitas</button>
                <div className="hidden sm:block text-[9px] font-mono text-gray-600 uppercase tracking-widest leading-loose">
                  System_Status: Optimal <br />
                  Connection: Secure_SSL
                </div>
              </div>
            </div>

            <div className="relative flex justify-center items-center h-[700px] lg:translate-x-16 animate-reveal delay-2">
              <div className="absolute w-96 h-96 rounded-full bg-indigo-600/20 blur-[100px] animate-sun-corona" />
              <div className="absolute w-56 h-56 rounded-full bg-[radial-gradient(circle_at_30%_30%,#4f46e5_0%,#1e1b4b_100%)] border border-white/15 z-10 shadow-[0_0_80px_rgba(79,70,229,0.3)]" />
              
              {/* Complex Orbital Mechanics */}
              <div className="absolute w-[620px] h-[620px] rounded-full border border-white/[0.04] animate-orbit-slow">
                <div className="absolute top-[12%] left-[18%] w-8 h-8 rounded-full bg-cyan-400 shadow-[0_0_40px_#22d3ee] lava-satellite" />
                <div className="absolute bottom-[25%] right-[15%] w-4 h-4 rounded-full bg-indigo-400 shadow-[0_0_20px_#818cf8] lava-satellite" style={{animationDelay: '-1.2s'}} />
              </div>

              <div className="absolute w-[460px] h-[460px] rounded-full border border-white/[0.08] animate-orbit-mid">
                <div className="absolute top-1/2 -right-5 w-6 h-6 rounded-full bg-blue-500 shadow-[0_0_35px_#3b82f6] lava-satellite" style={{animationDelay: '-0.8s'}} />
              </div>

              <div className="absolute w-[340px] h-[340px] rounded-full border border-white/[0.12] animate-orbit-fast">
                 <div className="absolute bottom-6 left-12 w-3 h-3 rounded-full bg-white shadow-[0_0_20px_#fff] lava-satellite" />
              </div>

              <div className="absolute right-0 bottom-10 bg-white/[0.01] backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] w-80 shadow-2xl z-20 group hover:bg-white/[0.04] transition-all duration-700">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-8 border border-cyan-500/20">
                  <div className="w-4 h-4 rounded-full bg-cyan-400 animate-ping" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-mono text-cyan-400 animate-pulse tracking-widest uppercase font-bold">Live_Metrics</span>
                </div>
                <h4 className="font-bold text-2xl mb-3 tracking-tight text-white/90">Estrategia 360°</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed font-normal">Sincronización total entre tu infraestructura técnica y tus objetivos de mercado.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Nosotros - System Core */}
        <section id="nosotros" className="relative z-10 max-w-7xl mx-auto px-8 py-40 border-t border-white/5">
          <div className="flex justify-between items-start mb-16">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter animate-reveal">Ingeniería <span className="text-gray-500 italic">Orgánica.</span></h2>
              <p className="text-gray-500 font-mono text-xs tracking-widest uppercase">Protocol: Creative_Development_Standard_V2</p>
            </div>
            <div className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.5em] pt-6 hidden md:block">
              <span className="text-indigo-500">SYS_AUTH_HEX:</span> #GL_{browserName}_8B2
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div className="space-y-12">
              <p className="text-gray-400 text-xl font-light animate-reveal delay-1 max-w-xl leading-relaxed">
                En <span className="text-white font-medium">Gravity Labs</span>, no solo escribimos código; esculpimos ecosistemas digitales. Cada línea está pensada para la máxima eficiencia y cada pixel para una respuesta emocional.
              </p>
              <div className="grid grid-cols-2 gap-8 animate-reveal delay-2">
                <div className="text-left">
                  <h4 className="text-3xl font-black text-white mb-2">99.9%</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Uptime Architecture</p>
                </div>
                <div className="text-left">
                  <h4 className="text-3xl font-black text-white mb-2">450ms</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Avg Response Time</p>
                </div>
              </div>
            </div>
            
            <div className="glow-border-container group animate-reveal delay-2"> 
              <div className="glow-border-tracer opacity-40 group-hover:opacity-80 transition-opacity" />
              <div className="glow-content-wrapper p-14">
                <div className="flex justify-between items-center mb-14">
                  <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-4">
                    <span className="w-2 h-8 bg-indigo-600 rounded-full" />
                    Filosofía Técnica
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-500 animate-pulse tracking-widest uppercase font-bold">Deep_Scan_Init</span>
                </div>
                <ul className="space-y-14">
                  {[
                    {t: "Desarrollo Nativo", d: "Optimización a nivel de compilación para garantizar fluidez absoluta."},
                    {t: "Marketing de Precisión", d: "Algoritmos predictivos para maximizar el ROI en cada campaña."},
                    {t: "UI Sensorial", d: "Interfaces que anticipan las necesidades del usuario final."}
                  ].map((item, i) => (
                    <li key={i} className="relative pl-14 animate-reveal" style={{ animationDelay: `${0.8 + (i * 0.2)}s` }}>
                      <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]" />
                      <h4 className="text-white text-lg font-bold mb-3 text-left">{item.t}</h4>
                      <p className="text-[13px] text-gray-500 font-light leading-relaxed text-left">{item.d}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Paquetes - Deployment Selection */}
        <section id="servicios" className="relative z-10 py-40 border-t border-white/5 bg-gradient-to-b from-transparent via-[#080815] to-transparent">
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="flex flex-col items-center mb-28 space-y-6">
              <div className="flex gap-5 items-center text-[11px] font-mono text-indigo-400 uppercase tracking-[0.9em] animate-reveal">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                Select Orbital Trajectory
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter animate-reveal delay-1 text-center">Niveles de <span className="text-indigo-500">Despliegue.</span></h2>
              <p className="text-gray-500 text-sm font-mono uppercase tracking-[0.5em] mt-4 animate-terminal-flicker text-center">LOG: WAITING_FOR_SIGNAL_INPUT_...</p>
            </div>
            
            {categorias.map((cat, idx) => (
              <div key={idx} className="mb-40 last:mb-0">
                <div className="mb-16 animate-reveal text-left">
                  <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter border-l-4 border-indigo-600 pl-8">{cat.titulo}</h3>
                  <p className="text-gray-500 text-sm ml-9 max-w-2xl leading-relaxed">{cat.subtitulo}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {cat.paquetes.map((paquete, pIdx) => (
                    <div key={pIdx} className="glow-border-container group animate-reveal" style={{ animationDelay: `${0.3 + (pIdx * 0.2)}s` }}>
                      <div className="glow-border-tracer opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                      <div className="glow-content-wrapper p-12 h-full flex flex-col glass-card border-none">
                        <div className="flex justify-between items-start mb-6">
                          <h4 className="text-2xl font-black tracking-tight group-hover:text-cyan-400 transition-colors duration-500 text-left">{paquete.nombre}</h4>
                          <span className="text-[9px] font-mono text-gray-600 border border-white/10 px-2 py-1 rounded">V-{idx}.{pIdx}</span>
                        </div>
                        <p className="text-gray-400 text-[13px] font-light mb-12 flex-grow leading-relaxed text-left">{paquete.desc}</p>
                        <div className="mt-auto pt-10 border-t border-white/10 flex items-center justify-between">
                          <div className="flex flex-col text-left">
                            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Starting_at</span>
                            <span className="text-4xl font-black text-white">{paquete.precio}</span>
                          </div>
                          <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 opacity-20 group-hover:opacity-100 animate-pulse" />
                          </div>
                        </div>
                        <button onClick={(e) => handleSmoothScroll(e as any, 'contacto')} className="w-full mt-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-[0.35em] hover:bg-white hover:text-black transition-all duration-500 transform active:scale-95">Inicializar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN NUESTRO PROCESO - Deployment Lifecycle */}
        <section id="proceso" className="relative z-10 max-w-7xl mx-auto px-8 py-48 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-12">
            <div className="max-w-3xl space-y-6 text-left">
              <span className="text-cyan-400 font-mono text-[11px] tracking-[1.2em] uppercase block font-bold">Gravity_Sequence</span>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter">Ciclo de <span className="text-indigo-500 italic">Ejecución.</span></h2>
              <p className="text-gray-500 text-lg font-light leading-relaxed">Un flujo de trabajo iterativo diseñado para eliminar la fricción técnica y acelerar el tiempo de salida al mercado.</p>
            </div>
            <div className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.5em] pb-4 border-b border-white/10 w-full md:w-auto text-right">
              PHASE_SYNC: ALPHA_SEQUENCE_ON
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 relative">
            <div className="hidden md:block absolute top-14 left-0 w-full h-[1px] bg-white/5 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-[flow-line_4s_infinite_linear]" style={{animationName: 'flow-line'}} />
            </div>
            {pasosProceso.map((paso, idx) => (
              <div key={idx} className="relative group step-node animate-reveal text-left" style={{ animationDelay: `${idx * 0.25}s` }}>
                <div className="relative mb-14 inline-block">
                  <div className="w-28 h-28 rounded-[2.5rem] bg-[#0a0a15] border border-white/10 flex items-center justify-center text-4xl font-black transition-all duration-700 group-hover:border-cyan-500 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] group-hover:scale-110 overflow-hidden">
                    <span className="relative z-10 group-hover:text-cyan-400 transition-colors">{paso.n}</span>
                    <div className="scan-effect" />
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="flex items-center gap-4 text-left">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">{paso.tech}</span>
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter group-hover:translate-x-3 transition-transform duration-500 text-left">{paso.t}</h3>
                  <p className="text-sm text-gray-500 font-light leading-relaxed group-hover:text-gray-400 transition-colors text-left">{paso.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN CONTACTO - Uplink Terminal */}
        <section id="contacto" className="relative z-10 max-w-7xl mx-auto px-8 py-48 border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-28 items-center">
            <div className="space-y-12 text-left">
              <h2 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter">Establece <br /><span className="text-cyan-400 italic">Conexión.</span></h2>
              <div className="space-y-6">
                <p className="text-gray-400 text-lg font-light leading-relaxed max-w-md">
                  Nuestros ingenieros están listos para decodificar tus necesidades. Inicia el protocolo de transmisión ahora.
                </p>
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.6em] flex items-center gap-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                  Uplink_Signal: READY_TO_TRANSMIT
                </div>
              </div>
            </div>
            
            <div className="glow-border-container group">
              <div className="glow-border-tracer opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="glow-content-wrapper p-12 md:p-16">
                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 text-left">
                      <label className="text-[9px] font-mono text-gray-600 uppercase ml-4 tracking-widest">Identificación</label>
                      <input type="text" placeholder="Nombre completo" className="input-field" />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[9px] font-mono text-gray-600 uppercase ml-4 tracking-widest">Canal de Retorno</label>
                      <input type="email" placeholder="Email corporativo" className="input-field" />
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[9px] font-mono text-gray-600 uppercase ml-4 tracking-widest">Buffer de Datos</label>
                    <textarea placeholder="Cuéntanos sobre tu visión o desafíos técnicos..." rows={5} className="input-field resize-none"></textarea>
                  </div>
                  <button className="w-full bg-indigo-600 hover:bg-cyan-500 py-6 rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] transition-all duration-500 shadow-2xl shadow-indigo-600/20 active:scale-95 group overflow-hidden relative">
                    <span className="relative z-10">Enviar Señal</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER - System Archive */}
        <footer className="relative z-10 border-t border-white/5 bg-[#05050b]/90 backdrop-blur-3xl pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
              <div className="space-y-8 text-left">
                <div className="flex items-center gap-5 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                  <div className="w-10 h-10 relative"><Image src="/logo.png" alt="Logo" fill className="object-contain" /></div>
                  <span className="font-black tracking-[0.2em] text-2xl uppercase italic text-white">Gravity Labs</span>
                </div>
                <p className="text-gray-500 text-[13px] leading-relaxed max-w-[280px] font-light">
                  Ingeniería de software de alta fidelidad y estrategias de marketing digital diseñadas para empresas que operan en la frontera tecnológica.
                </p>
              </div>
              <div className="text-left">
                <h5 className="text-[11px] font-black uppercase tracking-[0.4em] text-white mb-10 border-b border-white/10 pb-4 inline-block">Navegación</h5>
                <ul className="space-y-5 text-xs font-bold uppercase tracking-[0.25em]">
                  <li><a onClick={(e) => handleSmoothScroll(e, 'servicios')} className="footer-link">Portfolio de Órbitas</a></li>
                  <li><a onClick={(e) => handleSmoothScroll(e, 'proceso')} className="footer-link">Ciclo de Desarrollo</a></li>
                  <li><a onClick={(e) => handleSmoothScroll(e, 'contacto')} className="footer-link">Protocolo Contacto</a></li>
                </ul>
              </div>
              <div className="text-left">
                <h5 className="text-[11px] font-black uppercase tracking-[0.4em] text-white mb-10 border-b border-white/10 pb-4 inline-block">Conexión</h5>
                <ul className="space-y-5 text-xs font-bold uppercase tracking-[0.25em]">
                  <li><a href="#" className="footer-link">Instagram_Feed</a></li>
                  <li><a href="#" className="footer-link">LinkedIn_Network</a></li>
                  <li><a href="#" className="footer-link">Behance_Showcase</a></li>
                </ul>
              </div>
              <div className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem] relative overflow-hidden group text-left">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-8">System_Diagnostics</h5>
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                    <span>SERVER_LOAD</span>
                    <span className="text-cyan-500 font-bold">14.2%</span>
                  </div>
                  <div className="h-[3px] w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[14%] bg-cyan-500" />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                    <span>SECURITY</span>
                    <span className="text-green-500 font-bold">ACTIVE</span>
                  </div>
                  <div className="text-[9px] font-mono text-gray-600 uppercase tracking-widest mt-4">Encrypted_Uplink_Enabled</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-white/5 gap-10">
              <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest text-center md:text-left">
                © 2025 Gravity Labs • Engineered for the Deep Space • All rights reserved
              </div>
              <div className="flex gap-12 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                <span className="hover:text-white cursor-pointer transition-colors">Privacy_Log</span>
                <span className="hover:text-white cursor-pointer transition-colors">Usage_Terms</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}