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
                <span className="text-[8px] tracking-[0.8em] text-cyan-400 font-mono uppercase leading-none opacity-80">Labs</span>
              </div>
            </div>
            
            <div className="hidden md:flex gap-14 text-[11px] uppercase tracking-[0.45em] text-gray-500 font-bold items-center">
              <div className="flex gap-2 items-center text-[9px] font-mono text-cyan-500/60 uppercase tracking-widest mr-4">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Auth_Success
              </div>
              <a href="#servicios" onClick={(e) => handleSmoothScroll(e, 'servicios')} className="hover:text-cyan-400 transition-colors">Servicios</a>
              <a href="#proceso" onClick={(e) => handleSmoothScroll(e, 'proceso')} className="hover:text-cyan-400 transition-colors">Proceso</a>
              
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`px-10 py-3.5 rounded-full text-[10px] font-black tracking-[0.35em] transition-all border ${isMenuOpen ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/90 hover:bg-white/10'}`}
                >
                  CONSOLA
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-5 w-64 bg-[#0a0a15] border border-white/10 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-reveal overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
                    <button className="w-full text-left px-6 py-4 rounded-xl hover:bg-white/5 transition-all group">
                      <span className="block text-[10px] text-white/80 tracking-[0.2em] group-hover:text-cyan-400 uppercase">Acceso al cliente</span>
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
                <span className="text-indigo-400 font-mono text-[10px] tracking-[0.7em] uppercase">Desarrollo de Alta Resolución</span>
              </div>
              <h1 className="text-6xl md:text-6xl font-black leading-[0.85] tracking-tighter animate-reveal delay-1 text-white">Tu proyecto digital,<br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">sin complicaciones.</span></h1>
              <p className="text-gray-400 text-xl max-w-lg font-light leading-relaxed animate-reveal delay-2 italic">
                Eliminamos la fricción entre la visión técnica y el éxito comercial. Sustituimos los procesos tradicionales por un sistema de ejecución directa.
              </p>
              <div className="pt-6 animate-reveal delay-3 flex items-center gap-8">
                <button onClick={(e) => handleSmoothScroll(e as any, 'servicios')} className="bg-indigo-600 hover:bg-indigo-500 px-16 py-5 rounded-2xl font-black transition-all shadow-3xl shadow-indigo-500/30 uppercase tracking-[0.3em] text-[11px]">LANZAR MISIÓN</button>
                <div className="hidden sm:block text-[9px] font-mono text-gray-600 uppercase tracking-widest leading-loose">
                  ESTADO: LISTO PARA DESPEGUE<br />
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
                  <span className="text-[10px] font-mono text-cyan-400 animate-pulse tracking-widest uppercase font-bold">SYNC_ALIGNED</span>
                </div>
                <h4 className="font-bold text-2xl mb-3 tracking-tight text-white/90">Sincronización de Órbita</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed font-normal">Ingeniería de software con ADN de marketing. Alineamos tu infraestructura técnica con objetivos comerciales.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Nosotros - System Core / Ingeniería Orgánica */}
<section id="nosotros" className="relative z-10 py-40 border-t border-white/5 bg-gradient-to-b from-transparent via-[#050510] to-transparent">
  <div className="max-w-7xl mx-auto px-8 relative z-10">
    
    {/* Encabezado Centrado Coherente con el resto del sitio */}
    <div className="flex flex-col items-center mb-28 space-y-6">
      {/* Indicador de sistema superior */}
      <div className="flex gap-5 items-center text-[11px] font-mono text-indigo-400 uppercase tracking-[0.9em] animate-reveal">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
        Mission Intelligence Unit
      </div>
      
      {/* Título Principal con Gradiente Orgánico e Itálica */}
      <h2 className="text-5xl md:text-7xl font-black tracking-tighter animate-reveal delay-1 text-center">
        Ingeniería{' '}
        <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent italic">
          Orgánica.
        </span>
      </h2>

      {/* Identificadores de Protocolo Inferiores */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-gray-500 text-sm font-mono uppercase tracking-[0.5em] mt-4 animate-terminal-flicker text-center">
          Protocol: Creative_Development_Standard_V2
        </p>
        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.5em] mt-2">
          <span className="text-indigo-500">SYS_AUTH_HEX:</span> #GL_{browserName}_8B2
        </div>
      </div>
    </div>

    {/* Contenido Principal: Filosofía y Métricas */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
      <div className="space-y-12">
        {/* Texto descriptivo accesible y persuasivo */}
        <p className="text-gray-400 text-xl font-light animate-reveal delay-1 max-w-xl leading-relaxed text-left">
          En <span className="text-white font-medium">Gravity Labs</span>, entendemos que tu presencia digital es mucho más que una tarjeta de presentación; es el motor de tu negocio. Por eso, no solo escribimos código ni nos limitamos a crear páginas web aisladas. 
          <br /><br />
          Construimos ecosistemas digitales vivos que evolucionan contigo. Fusionamos la precisión de la ingeniería con una visión artística para que cada detalle funcione a la perfección y conecte emocionalmente con tus clientes desde el primer segundo.
        </p>
        
        {/* Métricas de Rendimiento Real */}
        <div className="grid grid-cols-2 gap-8 animate-reveal delay-2">
          <div className="text-left border-l border-white/10 pl-6">
            <h4 className="text-3xl font-black text-white mb-2">99.9%</h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Disponibilidad Total</p>
          </div>
          <div className="text-left border-l border-white/10 pl-6">
            <h4 className="text-3xl font-black text-white mb-2">450ms</h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Respuesta Instantánea</p>
          </div>
        </div>
      </div>
      
      {/* Tarjeta de Filosofía Técnica con Efecto Glow */}
      <div className="glow-border-container group animate-reveal delay-2"> 
        <div className="glow-border-tracer opacity-40 group-hover:opacity-80 transition-opacity" />
        <div className="glow-content-wrapper p-14 bg-[#0A0A1B]/60 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-14">
            <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-4">
              <span className="w-2 h-8 bg-indigo-600 rounded-full" />
              Filosofía Técnica
            </h3>
            <span className="text-[10px] font-mono text-cyan-500 animate-pulse tracking-widest uppercase font-bold">Deep_Scan_Init</span>
          </div>
          
          <ul className="space-y-14">
            {[
              {
                t: "Desarrollo Nativo", 
                d: "Creamos herramientas a medida que aprovechan toda la potencia de la tecnología actual para una experiencia sin errores ni esperas."
              },
              {
                t: "Marketing de Precisión", 
                d: "Usamos datos reales para asegurar que cada parte de tu proyecto esté diseñada para atraer clientes y generar resultados."
              },
              {
                t: "Diseño Sensorial", 
                d: "Interfaces intuitivas y fáciles de usar. Si tus clientes se sienten cómodos navegando, será mucho más sencillo que confíen en ti."
              }
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
  </div>
</section>

        {/* Sección de Paquetes - Selección de Trayectoria */}
<section id="servicios" className="relative z-10 py-40 border-t border-white/5 bg-gradient-to-b from-transparent via-[#080815] to-transparent">
  <div className="max-w-7xl mx-auto px-8 relative z-10">
    
    {/* Encabezado Principal */}
    <div className="flex flex-col items-center mb-28 space-y-6">
      <div className="flex gap-5 items-center text-[11px] font-mono text-indigo-400 uppercase tracking-[0.9em] animate-reveal">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
        Configuración de Despegue
      </div>
      <h2 className="text-5xl md:text-7xl font-black tracking-tighter animate-reveal delay-1 text-center">
        Planes de <span className="text-indigo-500">Despliegue.</span>
      </h2>
      <p className="text-gray-500 text-sm font-mono uppercase tracking-[0.5em] mt-4 animate-terminal-flicker text-center">
        SISTEMA: ESPERANDO SELECCIÓN DE RUTA...
      </p>
    </div>
    
    {[
      {
        titulo: "Arquitectura de Ecosistemas Web",
        subtitulo: "Sitios web rápidos y elegantes diseñados para que tu negocio crezca en internet.",
        paquetes: [
          {
            nombre: "Nebula Landing",
            version: "V-0.0",
            desc: "La opción ideal para empezar rápido. Creamos una página de aterrizaje enfocada en un solo objetivo: convertir tus visitas en clientes. Es ligera, carga al instante y está optimizada para que te encuentren fácilmente en Google.",
            precio: "$499",
            status: "LANZAMIENTO_INMEDIATO"
          },
          {
            nombre: "Supernova Business",
            version: "V-0.1",
            desc: "Tu casa digital completa. Una web profesional con varias secciones (Inicio, Nosotros, Servicios) y un sistema sencillo para que tú mismo puedas cambiar textos o imágenes sin depender de nadie. Control total y autonomía para tu marca.",
            precio: "$1,200",
            status: "CONTROL_TOTAL"
          },
          {
            nombre: "Galactic E-Commerce",
            version: "V-0.2",
            desc: "Tu tienda abierta al mundo las 24 horas. Construimos una plataforma de ventas robusta y segura donde tus clientes pueden comprar con confianza. Manejo de inventario, pagos automáticos y una experiencia de compra fluida y profesional.",
            precio: "$2,500+",
            status: "VENTAS_ACTIVAS"
          }
        ]
      },
      {
        titulo: "Sistemas de Propulsión Móvil",
        subtitulo: "Aplicaciones para celulares que tus clientes amarán usar todos los días.",
        paquetes: [
          {
            nombre: "Orbit App",
            version: "V-1.0",
            desc: "Tu negocio en el bolsillo de tus clientes. Una aplicación móvil enfocada en la facilidad de uso y la elegancia. Perfecta para ofrecer servicios directos, turnos o catálogos digitales con una experiencia rápida y moderna.",
            precio: "$2,000",
            status: "EXPERIENCIA_MOVIL"
          },
          {
            nombre: "Titanium System",
            version: "V-1.1",
            desc: "Una herramienta potente para tu empresa. Aplicaciones con funciones avanzadas como notificaciones al celular, mapas en tiempo real o sistemas de usuarios. Diseñada para negocios que necesitan una app que trabaje duro por ellos.",
            precio: "$4,500",
            status: "ALTO_RENDIMIENTO"
          },
          {
            nombre: "Cosmos Enterprise",
            version: "V-1.2",
            desc: "La solución definitiva a gran escala. Creamos un ecosistema completo que funciona perfecto tanto en iPhone como en Android. Incluye la máxima seguridad para tus datos y una estructura preparada para miles de usuarios simultáneos.",
            precio: "$8,000+",
            status: "ESTÁNDAR_GLOBAL"
          }
        ]
      }
    ].map((cat, idx) => (
      <div key={idx} className="mb-40 last:mb-0">
        <div className="mb-16 animate-reveal text-left">
          <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter border-l-4 border-indigo-600 pl-8">
            {cat.titulo}
          </h3>
          <p className="text-gray-500 text-sm ml-9 max-w-2xl leading-relaxed">
            {cat.subtitulo}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {cat.paquetes.map((paquete, pIdx) => (
            <div key={pIdx} className="glow-border-container group animate-reveal" style={{ animationDelay: `${0.3 + (pIdx * 0.2)}s` }}>
              <div className="glow-border-tracer opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="glow-content-wrapper p-12 h-full flex flex-col glass-card border-none bg-[#0A0A1B]/60 backdrop-blur-xl">
                
                <div className="flex justify-between items-start mb-8">
                  <div className="flex flex-col gap-1 text-left">
                    <h4 className="text-2xl font-black tracking-tight group-hover:text-cyan-400 transition-colors duration-500">
                      {paquete.nombre}
                    </h4>
                    <span className="text-[10px] font-mono text-cyan-500/80 tracking-[0.2em] uppercase font-bold">
                      {paquete.status}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-gray-600 border border-white/10 px-2 py-1 rounded">
                    {paquete.version}
                  </span>
                </div>

                <p className="text-gray-400 text-[14px] font-light mb-12 flex-grow leading-relaxed text-left">
                  {paquete.desc}
                </p>

                <div className="mt-auto pt-10 border-t border-white/10 flex items-center justify-between">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Inversión desde</span>
                    <span className="text-4xl font-black text-white">{paquete.precio}</span>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-cyan-500/50 transition-all duration-500">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 opacity-20 group-hover:opacity-100 animate-pulse" />
                  </div>
                </div>

                <button 
                  onClick={(e) => handleSmoothScroll(e as any, 'contacto')} 
                  className="w-full mt-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-[0.35em] hover:bg-white hover:text-black transition-all duration-500 transform active:scale-95"
                >
                  Iniciar Misión
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
</section>

        {/* SECCIÓN NUESTRO PROCESO - Ciclo de Ejecución */}
<section id="proceso" className="relative z-10 py-48 border-t border-white/5 bg-gradient-to-b from-transparent via-[#050510] to-transparent">
  <div className="max-w-7xl mx-auto px-8 relative z-10">
    
    {/* Encabezado Centrado Estilo Gravity Labs */}
    <div className="flex flex-col items-center mb-32 space-y-6">
      {/* Indicador superior con pulso */}
      <div className="flex gap-5 items-center text-[11px] font-mono text-indigo-400 uppercase tracking-[0.9em] animate-reveal">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
        Gravity_Sequence_Protocol
      </div>
      
      {/* Título Principal con Itálica e Índigo */}
      <h2 className="text-5xl md:text-7xl font-black tracking-tighter animate-reveal delay-1 text-center">
        Ciclo de <span className="text-indigo-500 italic">Ejecución.</span>
      </h2>

      {/* Identificadores de Sistema Inferiores */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-gray-500 text-sm font-mono uppercase tracking-[0.5em] mt-4 animate-terminal-flicker text-center">
          PHASE_SYNC: ALPHA_SEQUENCE_ON
        </p>
        <p className="text-gray-400 text-lg font-light max-w-2xl text-center leading-relaxed mt-2">
          Un camino estructurado y transparente para llevar tu visión desde el concepto inicial hasta un despliegue exitoso.
        </p>
      </div>
    </div>
    
    {/* Grid de Pasos del Proceso */}
    <div className="grid grid-cols-1 md:grid-cols-5 gap-12 relative">
      {/* Línea de flujo animada que conecta los nodos */}
      <div className="hidden md:block absolute top-14 left-0 w-full h-[1px] bg-white/5 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-[flow-line_4s_infinite_linear]" style={{animationName: 'flow-line'}} />
      </div>

      {[
        {
          n: "01",
          tech: "Plan_Selection",
          t: "Elección",
          d: "Seleccionas el plan que mejor se adapta a tus metas. Definimos el alcance para asegurar que la inversión sea exacta."
        },
        {
          n: "02",
          tech: "Strategic_Sync",
          t: "Escucha",
          d: "Analizamos a fondo tu negocio y tus clientes. Traducimos tus ideas en una estrategia técnica sólida y fácil de entender."
        },
        {
          n: "03",
          tech: "Visual_Prototype",
          t: "Diseño",
          d: "Creamos la interfaz de tu proyecto. Podrás ver y probar cómo lucirá la experiencia antes de iniciar la construcción."
        },
        {
          n: "04",
          tech: "Core_Engineering",
          t: "Desarrollo",
          d: "Transformamos el diseño en código de alta fidelidad. Construimos una herramienta rápida, segura y optimizada."
        },
        {
          n: "05",
          tech: "Final_Mission",
          t: "Despegue",
          d: "Lanzamos tu proyecto al mundo y monitoreamos su rendimiento para asegurar que todo funcione a la perfección."
        }
      ].map((paso, idx) => (
        <div key={idx} className="relative group step-node animate-reveal text-left" style={{ animationDelay: `${idx * 0.20}s` }}>
          {/* Nodo visual con efecto Scan */}
          <div className="relative mb-14 inline-block">
            <div className="w-24 h-24 rounded-[2rem] bg-[#0a0a15] border border-white/10 flex items-center justify-center text-3xl font-black transition-all duration-700 group-hover:border-cyan-500 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] group-hover:scale-110 overflow-hidden">
              <span className="relative z-10 group-hover:text-white transition-colors">
                {paso.n}
              </span>
              <div className="scan-effect absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000" />
            </div>
          </div>

          {/* Información del Paso */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-left">
              <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest font-bold border border-indigo-500/20 px-2 py-0.5 rounded">
                {paso.tech}
              </span>
            </div>
            <h3 className="text-2xl font-black tracking-tighter group-hover:text-cyan-400 transition-colors text-left uppercase">
              {paso.t}
            </h3>
            <p className="text-[13px] text-gray-500 font-light leading-relaxed group-hover:text-gray-400 transition-colors text-left">
              {paso.d}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

        {/* SECCIÓN CONTACTO - Uplink Terminal */}
<section id="contacto" className="relative z-10 py-48 border-t border-white/5 bg-gradient-to-b from-transparent to-[#050510]">
  <div className="max-w-7xl mx-auto px-8 relative z-10">
    
    {/* Encabezado Centrado Estilo Gravity Labs */}
    <div className="flex flex-col items-center mb-28 space-y-6">
      <div className="flex gap-5 items-center text-[11px] font-mono text-cyan-400 uppercase tracking-[0.9em] animate-reveal">
        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
        Direct_Communication_Link
      </div>
      
      <h2 className="text-5xl md:text-7xl font-black tracking-tighter animate-reveal delay-1 text-center">
        Establece <span className="text-cyan-400 italic">Conexión.</span>
      </h2>

      <div className="flex flex-col items-center gap-2">
        <p className="text-gray-500 text-sm font-mono uppercase tracking-[0.5em] mt-4 animate-terminal-flicker text-center">
          Uplink_Signal: READY_TO_TRANSMIT
        </p>
        <p className="text-gray-400 text-lg font-light max-w-2xl text-center leading-relaxed mt-2">
          ¿Tienes alguna duda técnica o necesitas soporte con tu proyecto? Nuestro equipo está listo para escucharte y resolver tus desafíos.
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-28 items-center">
      {/* Texto Persuasivo de Soporte */}
      <div className="space-y-12 text-left">
        <div className="space-y-8">
          <div className="border-l-2 border-indigo-500 pl-8 space-y-4">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Soporte Prioritario</h3>
            <p className="text-gray-500 text-base font-light leading-relaxed">
              No dejes que una duda detenga tu crecimiento. Respondemos a todas las consultas en menos de 24 horas con soluciones claras y directas.
            </p>
          </div>
          
          <div className="border-l-2 border-cyan-500 pl-8 space-y-4">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Consultoría Técnica</h3>
            <p className="text-gray-500 text-base font-light leading-relaxed">
              ¿No estás seguro de qué plan elegir? Cuéntanos tu idea y te ayudaremos a seleccionar la trayectoria más eficiente para tu negocio.
            </p>
          </div>
        </div>

        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.6em] flex items-center gap-4 bg-white/5 p-4 rounded-xl w-fit">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
          Sistemas Operativos: 24/7 Monitoring
        </div>
      </div>
      
      {/* Formulario Estilo Terminal */}
      <div className="glow-border-container group">
        <div className="glow-border-tracer opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="glow-content-wrapper p-12 md:p-16 bg-[#0A0A1B]/80 backdrop-blur-xl">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3 text-left">
                <label className="text-[10px] font-mono text-gray-500 uppercase ml-4 tracking-widest font-bold">Tu Nombre</label>
                <input type="text" placeholder="Nombre completo" className="input-field w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:border-cyan-500 outline-none transition-all" />
              </div>
              <div className="space-y-3 text-left">
                <label className="text-[10px] font-mono text-gray-500 uppercase ml-4 tracking-widest font-bold">Correo de Respuesta</label>
                <input type="email" placeholder="email@ejemplo.com" className="input-field w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:border-cyan-500 outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-3 text-left">
              <label className="text-[10px] font-mono text-gray-500 uppercase ml-4 tracking-widest font-bold">Mensaje o Consulta</label>
              <textarea placeholder="¿En qué podemos ayudarte hoy?" rows={5} className="input-field w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:border-cyan-500 outline-none transition-all resize-none"></textarea>
            </div>
            
            <button className="w-full bg-indigo-600 hover:bg-cyan-500 py-6 rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] transition-all duration-500 shadow-2xl shadow-indigo-600/20 active:scale-95 group overflow-hidden relative">
              <span className="relative z-10 text-white">Enviar Mensaje</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </form>
        </div>
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
                © 2026 Gravity Labs  • Todos los derechos reservados
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