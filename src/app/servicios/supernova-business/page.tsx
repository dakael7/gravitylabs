"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Gravity Labs - Service Detail: Supernova Business (V-0.2)
 * David: Componente de alta fidelidad con ilustración de Matriz de Datos Orbital.
 * Implementa animaciones de escaneo, rebote de datos y órbitas complejas.
 */
export default function SupernovaBusiness() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#05050b]" />;

  return (
    <main className="min-h-screen bg-[#05050b] text-white overflow-hidden relative selection:bg-indigo-500/30">
      
      {/* Capas de Fondo: Nebulosas en Índigo Profundo y Cian */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[-5%] w-[85%] h-[85%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-15%] left-[-10%] w-[75%] h-[75%] bg-blue-600/10 blur-[130px] rounded-full animate-pulse" style={{ animationDuration: '14s' }} />
        
        <svg className="absolute inset-0 w-full h-full opacity-30">
          {[...Array(80)].map((_, i) => (
            <circle
              key={i}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r={Math.random() * 0.9 + 0.2}
              fill="white"
              className="animate-pulse"
              style={{ 
                animationDelay: `${Math.random() * 6}s`,
                opacity: Math.random() * 0.7 + 0.3 
              }}
            />
          ))}
        </svg>
      </div>

      <style>{`
        @keyframes border-conic { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes scan { from { transform: translateY(-100%); } to { transform: translateY(500%); } }
        @keyframes float-complex { 
          0%, 100% { transform: translate(0, 0) rotate(0deg); } 
          33% { transform: translate(10px, -15px) rotate(2deg); } 
          66% { transform: translate(-5px, 10px) rotate(-1deg); } 
        }
        .animate-reveal { animation: revealUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        @keyframes revealUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .business-border-container { position: relative; padding: 2px; border-radius: 20px; overflow: hidden; background: rgba(255, 255, 255, 0.05); }
        .business-border-bg { position: absolute; inset: -50%; background: conic-gradient(from 0deg, #4f46e5, #06b6d4, #818cf8, #4f46e5); animation: border-conic 8s linear infinite; filter: blur(10px); }
      `}</style>

      {/* Navegación */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#05050b]/40 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-between items-center px-10 py-6 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity">
              <Image src="/logo.png" alt="Gravity Labs" fill className="object-contain" />
            </div>
            <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-gray-400 group-hover:text-white transition-colors">
              Regresar
            </span>
          </Link>
          <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest border border-indigo-500/20 px-4 py-2 rounded-full">
            Service_ID: V-0.2_SUPERNOVA
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-4 animate-reveal">
                <span className="w-12 h-[1px] bg-indigo-500" />
                <span className="font-mono text-[10px] text-indigo-400 uppercase tracking-[0.8em]">Scale_Mission_Ready</span>
              </div>
              <h1 className="text-7xl md:text-8xl font-black tracking-tighter animate-reveal [animation-delay:0.2s]">
                Supernova <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-500 italic">Business.</span>
              </h1>
              <p className="text-gray-400 text-xl font-light leading-relaxed max-w-xl animate-reveal [animation-delay:0.4s]">
                Un ecosistema digital robusto y autónomo. Diseñado para marcas que necesitan autoridad, secciones ilimitadas y el control total de su infraestructura.
              </p>
              <div className="flex gap-6 pt-6 animate-reveal [animation-delay:0.6s]">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex-1 backdrop-blur-md">
                  <span className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Inversión</span>
                  <span className="text-3xl font-black text-indigo-400">$1,200</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex-1 backdrop-blur-md">
                  <span className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Despliegue</span>
                  <span className="text-3xl font-black uppercase text-white">15-20 Días</span>
                </div>
              </div>
            </div>

            {/* Visual: Matriz de Datos Orbital (Nueva Ilustración Dinámica) */}
            <div className="relative aspect-square animate-reveal [animation-delay:0.5s] flex items-center justify-center scale-90 lg:scale-100">
              
              {/* Anillos de energía rotativos */}
              <div className="absolute w-[110%] h-[110%] border border-indigo-500/10 rounded-full animate-[spin_100s_linear_infinite]" />
              <div className="absolute w-[90%] h-[90%] border border-cyan-500/10 rounded-full animate-[spin_60s_linear_infinite_reverse]" />
              
              {/* El Núcleo del Sistema */}
              <div className="relative w-72 h-72 lg:w-96 lg:h-96">
                
                {/* Efecto de Luces y Glow central */}
                <div className="absolute inset-0 bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
                
                {/* La Matriz (Contenedor Principal) */}
                <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl group hover:border-indigo-500/40 transition-colors duration-700">
                  
                  {/* Líneas de Escaneo */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(99,102,241,0.1),transparent)] h-24 w-full -top-24 animate-[scan_4s_linear_infinite]" />

                  {/* Grid de Datos */}
                  <div className="absolute inset-0 opacity-15" 
                       style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                  {/* Elementos Flotantes */}
                  <div className="relative h-full w-full p-8 flex flex-col justify-between z-10">
                    
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="h-1 w-12 bg-indigo-500 rounded-full" />
                        <div className="text-[8px] font-mono text-indigo-400 tracking-[0.3em]">CORE_STABILITY: 99.9%</div>
                      </div>
                      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                      </div>
                    </div>

                    {/* Centro: Visualización de Carga Reactiva */}
                    <div className="flex items-end justify-center gap-1.5 h-32">
                      {[...Array(14)].map((_, i) => (
                        <div 
                          key={i}
                          className="w-2 bg-gradient-to-t from-indigo-600/80 to-cyan-400 rounded-full animate-[bounce_2s_ease-in-out_infinite]"
                          style={{ height: `${Math.random() * 80 + 20}%`, animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>

                    {/* Panel de Status */}
                    <div className="bg-black/40 border border-white/10 p-4 rounded-xl backdrop-blur-md">
                      <div className="flex justify-between mb-2">
                        <span className="text-[8px] font-mono text-gray-500 uppercase">Uplink_Encryption</span>
                        <span className="text-[8px] font-mono text-cyan-400 uppercase">Secure</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[85%] animate-[pulse_2s_infinite]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Widgets Flotantes */}
                <div className="absolute -top-8 -right-8 w-28 h-28 bg-[#05050b] border border-white/10 rounded-2xl p-4 animate-[float-complex_6s_ease-in-out_infinite] backdrop-blur-xl z-20 flex flex-col justify-center gap-3">
                    <div className="h-1 w-2/3 bg-indigo-500 rounded-full" />
                    <div className="h-1 w-full bg-white/10 rounded-full" />
                    <div className="h-1 w-1/2 bg-white/10 rounded-full" />
                </div>

                <div className="absolute -bottom-10 -left-10 w-36 h-24 bg-[#05050b] border border-indigo-500/30 rounded-2xl p-5 animate-[float-complex_8s_ease-in-out_infinite_reverse] backdrop-blur-xl z-20">
                   <div className="text-[9px] font-mono text-indigo-400 mb-3 tracking-tighter">DATA_SYNCHRONIZATION</div>
                   <div className="flex gap-1.5 h-6">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex-1 bg-indigo-500/20 rounded-sm animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Especificaciones Avanzadas */}
      <section className="py-24 relative z-10 px-8 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 space-y-4 text-center lg:text-left">
            <h2 className="text-sm font-mono text-indigo-400 tracking-[0.3em] uppercase">Advanced_Module_Specs</h2>
            <p className="text-4xl font-bold tracking-tight">Ingeniería para el Crecimiento.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Ecosistema Multi-Página",
                desc: "Arquitectura robusta con hasta 5 secciones dinámicas diseñadas para una navegación intuitiva y narrativa de marca.",
                label: "MULTI_PAGE_STRUCTURE"
              },
              {
                title: "Gestión de Contenido",
                desc: "Integración con CMS Headless para que gestiones tu inventario de contenidos sin necesidad de soporte técnico constante.",
                label: "CMS_AUTONOMY"
              },
              {
                title: "SEO Business Core",
                desc: "Optimización profunda por página, incluyendo Schema Markup y auditoría de velocidad para dominar los buscadores.",
                label: "ORGANIC_DOMINANCE"
              },
              {
                title: "Alta Seguridad SSL",
                desc: "Infraestructura cloud protegida con firewalls avanzados y protocolos de seguridad de grado industrial.",
                label: "SECURE_DEPLOYMENT"
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/[0.03] border border-white/5 p-8 rounded-3xl backdrop-blur-md hover:border-indigo-500/40 transition-all group">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                </div>
                <span className="text-[9px] font-mono text-gray-500 block mb-2 tracking-widest">{feature.label}</span>
                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Cierre */}
      <section className="py-32 relative z-10 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 rounded-[3rem] p-12 md:p-20 text-center backdrop-blur-xl overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.95]">
                Inicia la secuencia <br /> 
                <span className="text-indigo-400 italic">de expansión.</span>
              </h2>
              
              <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                El paquete Supernova Business es la base tecnológica de tu éxito comercial. No construimos sitios web, desplegamos ecosistemas de alta resolución.
              </p>

              <div className="pt-8">
                <Link 
                  href="/contratacion" 
                  className="inline-flex items-center gap-6 bg-white text-black px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-600 hover:text-white transition-all transform active:scale-95 shadow-[0_20px_40px_rgba(79,70,229,0.2)] group"
                >
                  SOLICITAR MISIÓN
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>

              <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest pt-4">
                Estación_Gravity_Labs // Deployment_Protocol_Active
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5 text-center relative z-10 backdrop-blur-md">
        <div className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.6em]">
          Gravity Labs Engineering © 2026 // Authored by David
        </div>
      </footer>
    </main>
  );
}