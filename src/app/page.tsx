"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

/**
 * Gravity Labs - Dropdown Update
 * David: Se implementó el menú desplegable en el botón MENU.
 * Se añadieron opciones de Sesión, Registro y Soporte con diseño de alta fidelidad.
 */
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [browserName, setBrowserName] = useState("USER");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Detección de navegador para el easter egg
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
    
    // Cerrar menú al hacer click fuera
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
      paquetes: [
        { nombre: "Nebula Landing", precio: "$499", desc: "Monopágina de alto impacto para conversiones rápidas." },
        { nombre: "Supernova Business", precio: "$1,200", desc: "Sitio corporativo escalable con optimización SEO avanzada." },
        { nombre: "Galactic E-Commerce", precio: "$2,500+", desc: "Tienda online completa con pasarelas y gestión de inventario." }
      ]
    },
    {
      titulo: "Sistemas de Órbita Móvil",
      paquetes: [
        { nombre: "Prototipo Pulsar", precio: "$1,800", desc: "MVP funcional para validar tu idea en el mercado real." },
        { nombre: "Cosmos iOS/Android", precio: "$3,500", desc: "App nativa híbrida con experiencia de usuario premium." },
        { nombre: "Titan Enterprise", precio: "Custom", desc: "Ecosistema móvil complejo con arquitectura en la nube." }
      ]
    }
  ];

  const pasosProceso = [
    { n: "01", t: "Discovery", d: "Analizamos tu órbita de negocio y definimos objetivos críticos.", tech: "Audit / Research" },
    { n: "02", t: "Strategy", d: "Trazamos la trayectoria tecnológica y el plan de marketing.", tech: "Roadmap / UX" },
    { n: "03", t: "Development", d: "Construcción de alta fidelidad con código limpio y escalable.", tech: "Clean Code / AI" },
    { n: "04", t: "Liftoff", d: "Lanzamiento y monitoreo constante para optimizar el rendimiento.", tech: "Scale / Support" }
  ];

  return (
    <main className="min-h-screen bg-[#05050b] text-white overflow-hidden relative selection:bg-cyan-500/30">
      
      <style>{`
        html { scroll-behavior: smooth; }

        @keyframes orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes sun-corona { 0%, 100% { transform: scale(1); opacity: 0.4; filter: blur(60px); } 50% { transform: scale(1.3); opacity: 0.6; filter: blur(90px); } }
        @keyframes lava-pulse { 0%, 100% { transform: scale(1); filter: blur(4px); opacity: 0.8; } 50% { transform: scale(1.4); filter: blur(2px); opacity: 1; } }
        @keyframes revealUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }
        @keyframes scan-line { 0% { top: -10%; } 100% { top: 110%; } }
        @keyframes flow-line { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

        .animate-orbit-slow { animation: orbit 60s linear infinite; }
        .animate-orbit-mid { animation: orbit 40s linear infinite reverse; }
        .animate-orbit-fast { animation: orbit 25s linear infinite; }
        .animate-sun-corona { animation: sun-corona 5s ease-in-out infinite; }
        .lava-satellite { animation: lava-pulse 4s ease-in-out infinite; }
        
        .animate-reveal { animation: revealUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.6s; }

        .star { position: absolute; background: white; border-radius: 50%; pointer-events: none; will-change: transform; }
        .glow-border-container { position: relative; padding: 1.5px; overflow: hidden; border-radius: 3rem; background: rgba(255, 255, 255, 0.05); }
        .glow-border-tracer { position: absolute; width: 180%; height: 180%; top: -40%; left: -40%; background: conic-gradient(from 0deg, transparent 0deg, #22d3ee 180deg, #4f46e5 240deg, transparent 300deg); animation: orbit 5s linear infinite; filter: blur(8px); }
        .glow-content-wrapper { position: relative; background: #0a0a15; border-radius: calc(3rem - 1.5px); z-index: 10; }
        
        .glass-card { background: rgba(255, 255, 255, 0.015); backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.04); transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
        .input-field { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 1rem; padding: 1rem; color: white; width: 100%; outline: none; transition: all 0.3s ease; }
        .footer-link { color: #6b7280; transition: all 0.3s ease; display: block; padding: 4px 0; cursor: pointer; }
        .footer-link:hover { color: #22d3ee; transform: translateX(5px); }

        .scan-effect { position: absolute; left: 0; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, #22d3ee, transparent); opacity: 0.5; pointer-events: none; }
        .step-node:hover .scan-effect { animation: scan-line 2s linear infinite; }
      `}</style>

      {/* FONDO DE ESTRELLAS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(50)].map((_, i) => (
          <div key={i} className={`star ${i % 3 === 0 ? 'w-[2px] h-[2px] shadow-[0_0_4px_white]' : 'w-[1px] h-[1px]'}`}
            style={{ 
              top: `${(i * 13.7) % 100}%`, left: `${(i * 19.3) % 100}%`, 
              animationName: 'twinkle', animationDuration: `${4 + (i % 4)}s`,
              animationIterationCount: 'infinite', animationTimingFunction: 'ease-in-out',
              transform: `translateY(${scrollY * -((i % 3 === 0) ? 0.2 : 0.05)}px)` 
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#05050b]/80 backdrop-blur-md border-b border-white/5">
          <div className="flex justify-between items-center px-10 py-5 max-w-7xl w-full mx-auto">
            <div className="flex items-center gap-6 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="relative w-12 h-12 transition-transform duration-500 group-hover:scale-110">
                <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
              </div>
              <div className="flex flex-col border-l border-white/10 pl-6 py-0.5">
                <span className="font-light text-xl tracking-[0.35em] uppercase text-white/90 leading-none mb-1">Gravity</span>
                <span className="text-[8px] tracking-[0.75em] text-cyan-400 font-mono uppercase leading-none">Labs</span>
              </div>
            </div>
            
            <div className="hidden md:flex gap-14 text-[12px] uppercase tracking-[0.4em] text-gray-500 font-semibold items-center relative">
              <div className="flex gap-2 items-center text-[9px] font-mono text-cyan-500/50 uppercase tracking-widest mr-4">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Ready
              </div>
              <a href="#servicios" onClick={(e) => handleSmoothScroll(e, 'servicios')} className="hover:text-cyan-400 transition-colors">Services</a>
              <a href="#proceso" onClick={(e) => handleSmoothScroll(e, 'proceso')} className="hover:text-cyan-400 transition-colors">Proceso</a>
              
              {/* Botón MENU con Dropdown */}
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`px-9 py-3 rounded-full text-[11px] font-bold tracking-[0.3em] transition-all border ${isMenuOpen ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'}`}
                >
                  Menu
                </button>
                
                {/* Menú Desplegable */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-4 w-60 bg-[#0a0a15] border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl animate-reveal overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                    
                    <button className="w-full text-left px-6 py-4 rounded-xl hover:bg-white/5 transition-colors group">
                      <span className="block text-[10px] text-white tracking-[0.2em] group-hover:text-cyan-400 transition-colors uppercase">Iniciar Sesión</span>
                    </button>
                    
                    <button className="w-full text-left px-6 py-4 rounded-xl hover:bg-white/5 transition-colors group">
                      <span className="block text-[10px] text-white tracking-[0.2em] group-hover:text-cyan-400 transition-colors uppercase">Registro</span>
                    </button>
                    
                    <div className="h-[1px] bg-white/5 my-1 mx-4" />
                    
                    <button className="w-full text-left px-6 py-4 rounded-xl hover:bg-white/5 transition-colors group">
                      <span className="block text-[10px] text-gray-500 tracking-[0.2em] group-hover:text-indigo-400 transition-colors uppercase font-mono">Support_Line</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        <div id="inicio" className="h-24" />

        {/* Hero Section */}
        <section className="flex-1 flex items-start max-w-7xl w-full mx-auto px-8 pt-2 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-center">
            <div className="space-y-8 mt-10">
              <div className="inline-flex items-center gap-4 animate-reveal">
                <div className="h-[1px] w-12 bg-cyan-500/60" />
                <span className="text-cyan-400 font-mono text-[10px] tracking-[0.6em] uppercase">Tech & Strategy</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter animate-reveal delay-1 text-white">Marketing <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-300">Impulsado</span></h1>
              <p className="text-gray-400 text-lg max-w-md font-light animate-reveal delay-2">Programación de vanguardia y marketing de alta fidelidad.</p>
              <div className="pt-4 animate-reveal delay-3">
                <button onClick={(e) => handleSmoothScroll(e as any, 'servicios')} className="bg-indigo-600 hover:bg-indigo-500 px-14 py-5 rounded-2xl font-bold transition-all shadow-2xl shadow-indigo-500/20 uppercase tracking-widest text-sm">Iniciar Proyecto</button>
              </div>
            </div>

            <div className="relative flex justify-center items-center h-[650px] lg:translate-x-12 animate-reveal delay-2">
              <div className="absolute w-80 h-80 rounded-full bg-indigo-600/30 blur-[80px] animate-sun-corona" />
              <div className="absolute w-48 h-48 rounded-full bg-[radial-gradient(circle_at_30%_30%,#4f46e5_0%,#1e1b4b_100%)] border border-white/20 z-10 shadow-[0_0_60px_rgba(79,70,229,0.4)]" />
              
              <div className="absolute w-[580px] h-[580px] rounded-full border border-white/[0.03] animate-orbit-slow">
                <div className="absolute top-[10%] left-[15%] w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_30px_#22d3ee] lava-satellite" />
                <div className="absolute bottom-[20%] right-[10%] w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_15px_#6366f1] lava-satellite" style={{animationDelay: '-1s'}} />
              </div>

              <div className="absolute w-[440px] h-[440px] rounded-full border border-white/[0.07] animate-orbit-mid">
                <div className="absolute top-1/2 -right-4 w-7 h-7 rounded-full bg-blue-500 shadow-[0_0_40px_#3b82f6] lava-satellite" style={{animationDelay: '-0.5s'}} />
                <div className="absolute -top-3 left-1/2 w-4 h-4 rounded-full bg-cyan-300 shadow-[0_0_20px_#67e8f9] lava-satellite" style={{animationDelay: '-1.5s'}} />
              </div>

              <div className="absolute w-[320px] h-[320px] rounded-full border border-white/[0.1] animate-orbit-fast">
                 <div className="absolute bottom-4 left-10 w-2 h-2 rounded-full bg-white shadow-[0_0_15px_#fff] lava-satellite" />
              </div>

              <div className="absolute right-0 bottom-4 bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] w-80 shadow-2xl z-20 group hover:bg-white/[0.05] transition-all">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-6"><div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" /></div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-mono text-cyan-400 animate-pulse tracking-widest uppercase">System Active</span>
                </div>
                <h4 className="font-bold text-2xl mb-2 tracking-tight text-white/90">Estrategia Activa</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-light">Optimización constante de activos digitales en tiempo real.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Nosotros */}
        <section id="nosotros" className="relative z-10 max-w-7xl mx-auto px-8 py-32 border-t border-white/5">
          <div className="flex justify-between items-start mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight animate-reveal">Ingeniería <span className="text-gray-500 italic">creativa.</span></h2>
            <div className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.4em] pt-4 hidden md:block">
              <span className="text-indigo-500">SYS_AUTH:</span> {browserName}_LOGGED_IN
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <p className="text-gray-400 text-lg font-light animate-reveal delay-1 max-w-md">Fusionamos el rigor del código con la sensibilidad artística para crear experiencias que orbitan la perfección.</p>
            <div className="glow-border-container group animate-reveal delay-2"> 
              <div className="glow-border-tracer opacity-60" />
              <div className="glow-content-wrapper p-12">
                <div className="flex justify-between items-center mb-12">
                  <h3 className="text-xl font-bold flex items-center gap-3">Nuestros Pilares</h3>
                  <span className="text-[9px] font-mono text-cyan-500 animate-pulse tracking-widest uppercase">Active_Scan</span>
                </div>
                <ul className="space-y-12">
                  {["Desarrollo Nativo", "Marketing Analítico", "Diseño Sensorial"].map((t, i) => (
                    <li key={i} className="relative pl-12 animate-reveal" style={{ animationDelay: `${0.6 + (i * 0.2)}s` }}>
                      <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-cyan-400" />
                      <h4 className="text-white font-semibold mb-2">{t}</h4>
                      <p className="text-sm text-gray-500 font-light leading-relaxed">Arquitectura escalable diseñada para el alto rendimiento.</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Paquetes */}
        <section id="servicios" className="relative z-10 py-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="flex flex-col items-center mb-24 space-y-4">
              <div className="flex gap-4 items-center text-[10px] font-mono text-indigo-400 uppercase tracking-[0.8em] animate-reveal">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                System Selection Active
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter animate-reveal delay-1 text-center">Selecciona tu <span className="text-indigo-500">Trayectoria.</span></h2>
              <p className="text-gray-500 text-center max-w-2xl text-sm font-light leading-relaxed animate-reveal delay-2">
                Cada misión es única. Hemos diseñado tres niveles de despliegue tecnológico adaptados a la escala de tu ambición, desde aterrizajes rápidos hasta expansiones galácticas.
              </p>
            </div>
            {categorias.map((cat, idx) => (
              <div key={idx} className="mb-32 last:mb-0">
                <h3 className="text-2xl font-bold mb-12 border-l-4 border-indigo-600 pl-6 animate-reveal uppercase tracking-tighter">{cat.titulo}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {cat.paquetes.map((paquete, pIdx) => (
                    <div key={pIdx} className="glow-border-container group animate-reveal" style={{ animationDelay: `${0.2 + (pIdx * 0.2)}s` }}>
                      <div className="glow-border-tracer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="glow-content-wrapper p-10 h-full flex flex-col glass-card border-none">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-2xl font-black tracking-tight group-hover:text-cyan-400 transition-colors">{paquete.nombre}</h4>
                          <span className="text-[8px] font-mono text-gray-600">ID: GL-{idx}{pIdx}</span>
                        </div>
                        <p className="text-gray-400 text-sm font-light mb-10 flex-grow">{paquete.desc}</p>
                        <div className="mt-auto pt-8 border-t border-white/5 flex items-end justify-between">
                          <span className="text-3xl font-black text-white">{paquete.precio}</span>
                        </div>
                        <button onClick={(e) => handleSmoothScroll(e as any, 'contacto')} className="w-full mt-6 py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">Seleccionar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN NUESTRO PROCESO */}
        <section id="proceso" className="relative z-10 max-w-7xl mx-auto px-8 py-40 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <span className="text-cyan-400 font-mono text-[10px] tracking-[1em] uppercase block mb-4">Gravity Methodology</span>
              <h2 className="text-6xl font-black tracking-tighter">Ciclo de <span className="text-indigo-500 italic">Ejecución.</span></h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-white/10 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[flow-line_3s_infinite_linear]" style={{animationName: 'flow-line'}} />
            </div>
            {pasosProceso.map((paso, idx) => (
              <div key={idx} className="relative group step-node animate-reveal" style={{ animationDelay: `${idx * 0.2}s` }}>
                <div className="relative mb-12 inline-block">
                  <div className="w-24 h-24 rounded-2xl bg-[#0a0a15] border border-white/10 flex items-center justify-center text-3xl font-black transition-all duration-500 group-hover:border-cyan-500 group-hover:scale-110 overflow-hidden">
                    <span className="relative z-10 group-hover:text-cyan-400">{paso.n}</span>
                    <div className="scan-effect" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-tighter">{paso.tech}</span>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight group-hover:translate-x-2 transition-transform">{paso.t}</h3>
                  <p className="text-sm text-gray-500 font-light leading-relaxed">{paso.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN CONTACTO */}
        <section id="contacto" className="relative z-10 max-w-7xl mx-auto px-8 py-32 border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl md:text-7xl font-black text-white">Establece <br /><span className="text-cyan-400 italic">Conexión.</span></h2>
            </div>
            <div className="glow-border-container group">
              <div className="glow-border-tracer opacity-60" />
              <div className="glow-content-wrapper p-10 md:p-14">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" placeholder="Nombre" className="input-field" />
                    <input type="email" placeholder="Email" className="input-field" />
                  </div>
                  <textarea placeholder="Descripción del proyecto..." rows={4} className="input-field resize-none"></textarea>
                  <button className="w-full bg-indigo-600 hover:bg-cyan-500 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-indigo-600/20">Enviar Señal</button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="relative z-10 border-t border-white/5 bg-[#05050b]/80 backdrop-blur-xl pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
              <div className="space-y-6">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                  <div className="w-8 h-8 relative"><Image src="/logo.png" alt="Logo" fill className="object-contain" /></div>
                  <span className="font-bold tracking-tighter text-xl uppercase italic">Gravity Labs</span>
                </div>
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8">Navegación</h5>
                <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                  <li><a onClick={(e) => handleSmoothScroll(e, 'servicios')} className="footer-link">Servicios</a></li>
                  <li><a onClick={(e) => handleSmoothScroll(e, 'proceso')} className="footer-link">Proceso</a></li>
                  <li><a onClick={(e) => handleSmoothScroll(e, 'contacto')} className="footer-link">Contacto</a></li>
                </ul>
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8">Recursos</h5>
                <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                  <li><a href="#" className="footer-link">Instagram</a></li>
                  <li><a href="#" className="footer-link">LinkedIn</a></li>
                </ul>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem]">
                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-6 uppercase">Estado del Sistema</h5>
                <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-cyan-500 animate-pulse" />
                </div>
              </div>
            </div>
            <div className="text-[9px] font-mono text-gray-600 uppercase tracking-widest pt-12 border-t border-white/5 text-center md:text-left">
              © 2025 Gravity Labs • Built for the deep space
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}