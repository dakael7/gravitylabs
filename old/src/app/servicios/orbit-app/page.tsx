"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase'; // Conexión con el núcleo de datos

/**
 * Gravity Labs - Detalle de Servicio: Orbit App (V-0.4.2)
 * David: Integración de flujo productizado hacia /uplink?pkg=orbit.
 * UPDATE: Sincronización dinámica de PRECIO desde el núcleo (gravity_services).
 */
export default function OrbitApp() {
  const [mounted, setMounted] = useState(false);
  const [price, setPrice] = useState<string>('---'); // Estado para el precio dinámico

  useEffect(() => {
    setMounted(true);

    /**
     * David: Protocolo de sincronización de precio.
     * Consulta el registro de 'Orbit App' para asegurar consistencia con el Admin.
     */
    const syncPrice = async () => {
      try {
        const { data, error } = await supabase
          .from('gravity_services')
          .select('precio')
          .eq('nombre', 'Orbit App') // Identificador único en DB
          .single();

        if (data && !error) {
          setPrice(data.precio);
        }
      } catch (err) {
        console.error("Error_Price_Sync_Failure", err);
      }
    };

    syncPrice();
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#080510]" />;

  return (
    <main className="min-h-screen bg-[#080510] text-white overflow-hidden relative selection:bg-purple-500/30">
      
      {/* Capas de Fondo: Nebulosas Subtiles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[85%] h-[85%] bg-purple-600/5 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '11s' }} />
        <div className="absolute bottom-[-10%] left-[-5%] w-[75%] h-[75%] bg-blue-600/5 blur-[130px] rounded-full animate-pulse" style={{ animationDuration: '15s' }} />
        
        <svg className="absolute inset-0 w-full h-full opacity-20">
          {[...Array(70)].map((_, i) => (
            <circle
              key={i}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r={Math.random() * 0.7 + 0.3}
              fill="white"
              className="animate-pulse"
              style={{ 
                animationDelay: `${Math.random() * 6}s`,
                opacity: Math.random() * 0.6 + 0.4 
              }}
            />
          ))}
        </svg>
      </div>

      <style>{`
        @keyframes float-mobile { 0%, 100% { transform: translateY(0) rotate3d(1, 1, 1, 0deg); } 50% { transform: translateY(-20px) rotate3d(1, 1, 1, 1deg); } }
        
        @keyframes rgb-border-flow {
          0% { border-color: #a855f7; box-shadow: 0 0 10px rgba(168, 85, 247, 0.2); }
          33% { border-color: #3b82f6; box-shadow: 0 0 10px rgba(59, 130, 246, 0.2); }
          66% { border-color: #ec4899; box-shadow: 0 0 10px rgba(236, 72, 153, 0.2); }
          100% { border-color: #a855f7; box-shadow: 0 0 10px rgba(168, 85, 247, 0.2); }
        }

        @keyframes orbit-lights {
          from { transform: rotate(0deg) translateX(190px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(190px) rotate(-360deg); }
        }

        .animate-reveal { animation: revealUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        @keyframes revealUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Navegación */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#080510]/50 backdrop-blur-2xl border-b border-white/5">
        <div className="flex justify-between items-center px-10 py-6 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity">
              <Image src="/logo.png" alt="Gravity Labs" fill className="object-contain" />
            </div>
            <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-gray-400 group-hover:text-white transition-colors">Regresar</span>
          </Link>
          <div className="text-[10px] font-mono text-purple-400 uppercase tracking-widest border border-purple-500/20 px-4 py-2 rounded-full backdrop-blur-md">
            ID_PROTOCOLO: V-0.4_ORBIT
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-4 animate-reveal">
                <span className="w-12 h-[1px] bg-purple-500" />
                <span className="font-mono text-[10px] text-purple-400 uppercase tracking-[0.8em]">Despliegue_iOS_Android</span>
              </div>
              <h1 className="text-7xl md:text-8xl font-black tracking-tighter animate-reveal [animation-delay:0.2s]">
                Orbit <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 italic">App.</span>
              </h1>
              <p className="text-gray-400 text-xl font-light leading-relaxed max-w-xl animate-reveal [animation-delay:0.4s]">
                Desarrollo móvil nativo de alta fidelidad. Una sola base de código para conquistar los ecosistemas de Apple y Google con rendimiento extremo.
              </p>
              <div className="flex gap-6 pt-6 animate-reveal [animation-delay:0.6s]">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex-1 backdrop-blur-md">
                  <span className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Inversión Base</span>
                  {/* David: Precio sincronizado */}
                  <span className="text-3xl font-black text-purple-400">${price}</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex-1 backdrop-blur-md">
                  <span className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Ciclo de Obra</span>
                  <span className="text-3xl font-black uppercase text-white">45-60 Días</span>
                </div>
              </div>
            </div>

            {/* Visual: Smartphone con luces RGB */}
            <div className="relative aspect-square flex items-center justify-center animate-reveal [animation-delay:0.5s]">
              <div className="absolute w-[60%] h-[60%] bg-purple-600/5 blur-[120px] rounded-full" />
              <div className="absolute w-1 h-1 bg-purple-400/50 rounded-full blur-[1px] animate-[orbit-lights_5s_linear_infinite]" />
              <div className="absolute w-1 h-1 bg-blue-400/50 rounded-full blur-[1px] animate-[orbit-lights_8s_linear_infinite_reverse]" />
              
              <div className="relative w-full max-w-[450px] h-[600px] flex items-center justify-center">
                <div className="relative w-64 h-[520px] bg-[#050505] border-[2px] rounded-[3rem] shadow-2xl overflow-hidden animate-[float-mobile_8s_ease-in-out_infinite,rgb-border-flow_6s_linear_infinite] z-20">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#0a0a0a] rounded-b-2xl z-30" />
                  <div className="p-8 pt-16 space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-2xl border border-purple-500/20 flex items-center justify-center">
                         <div className="w-3 h-3 bg-purple-500/40 rounded-full animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-24 bg-white/10 rounded-full" />
                        <div className="h-1.5 w-16 bg-white/5 rounded-full" />
                      </div>
                    </div>
                    <div className="h-44 w-full bg-gradient-to-br from-purple-600/10 to-transparent rounded-[2rem] border border-white/5 relative overflow-hidden" />
                    <div className="space-y-3">
                       <div className="h-1.5 w-full bg-white/5 rounded-full" />
                       <div className="h-1.5 w-3/4 bg-white/5 rounded-full" />
                    </div>
                    <div className="w-full bg-purple-600/90 py-4 rounded-2xl flex items-center justify-center text-[9px] font-black uppercase tracking-[0.2em] hover:bg-purple-500 transition-all active:scale-95">
                      Iniciar_Sincronía
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-6 w-40 h-20 bg-[#0a0a14]/80 border border-white/5 rounded-3xl p-5 backdrop-blur-xl z-30 animate-bounce shadow-xl">
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-[7px] font-mono text-purple-400 uppercase tracking-widest font-bold">Notificación</span>
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full" />
                </div>

                <div className="absolute bottom-16 -left-10 w-52 h-32 bg-[#050510]/95 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-2xl z-10 shadow-2xl rotate-2">
                   <div className="text-[8px] font-mono text-gray-600 mb-4 uppercase">Rendimiento_Nativo</div>
                   <div className="flex items-end gap-1.5 h-12">
                      {[40, 70, 50, 90, 60, 80].map((h, i) => (
                        <div key={i} className="flex-1 bg-purple-500/20 rounded-t-sm" style={{ height: `${h}%` }} />
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-24 relative z-10 px-8 border-t border-white/5 bg-purple-500/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 space-y-4 text-center lg:text-left">
            <h2 className="text-sm font-mono text-purple-400 tracking-[0.3em] uppercase">Especificaciones_Móviles</h2>
            <p className="text-4xl font-bold tracking-tight">Potencia Nativa en cada Píxel.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Despliegue Híbrido", desc: "Desarrollo basado en React Native o Flutter para garantizar fluidez total en iOS y Android con un solo código.", label: "CROSS_PLATFORM" },
              { title: "Notificaciones Push", desc: "Sistemas de mensajería en tiempo real para mantener el engagement de tus usuarios al máximo nivel.", label: "RETENCIÓN" },
              { title: "Integración de API", desc: "Conexión robusta con bases de datos y servicios externos para una funcionalidad total y segura.", label: "BACKEND_SYNC" },
              { title: "Diseño UX Mobile", desc: "Interfaces pensadas exclusivamente para el uso táctil y gestos intuitivos de alta fidelidad.", label: "INTERFAZ_FLUIDA" }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-md hover:border-purple-500/40 transition-all group">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
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
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <div className="relative z-10 space-y-10">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                Domina el <br />
                <span className="text-purple-400 italic">Ecosistema Móvil.</span>
              </h2>
              <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                Tu marca merece estar en el bolsillo de tus clientes. Creamos herramientas móviles que se sienten rápidas, seguras y visualmente impactantes.
              </p>
              <div className="pt-6">
                <Link 
                  href="/uplink?pkg=orbit" 
                  className="inline-flex items-center gap-6 bg-white text-black px-14 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-purple-600 hover:text-white transition-all transform active:scale-95 shadow-2xl shadow-purple-500/20 group"
                >
                  INICIAR AHORA
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center relative z-10">
        <div className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.8em]">
          Unidad Móvil Gravity Labs © 2026 // Authored by David
        </div>
      </footer>
    </main>
  );
}