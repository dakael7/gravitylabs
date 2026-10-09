"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase'; // Conexión con el núcleo de datos

/**
 * Gravity Labs - Servicio: Cosmos Enterprise (V-1.0.1)
 * David: La solución integral definitiva para corporaciones.
 * UPDATE: Sincronización dinámica de PRECIO desde el núcleo (gravity_services).
 */
export default function CosmosEnterprise() {
  const [mounted, setMounted] = useState(false);
  const [price, setPrice] = useState<string>('---'); // Estado para el precio dinámico

  useEffect(() => {
    setMounted(true);

    /**
     * David: Protocolo de sincronización de precio.
     * Consulta el registro de 'Cosmos Enterprise' para asegurar el estándar de inversión.
     */
    const syncPrice = async () => {
      try {
        const { data, error } = await supabase
          .from('gravity_services')
          .select('precio')
          .eq('nombre', 'Cosmos Enterprise') // Identificador único en DB
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

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-amber-500/30">
      
      {/* Fondo: Polvo Estelar y Nebulosas Doradas */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[100%] h-[100%] bg-amber-600/[0.03] blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[90%] h-[90%] bg-yellow-600/[0.02] blur-[140px] rounded-full animate-pulse" style={{ animationDuration: '12s' }} />
        
        <svg className="absolute inset-0 w-full h-full opacity-30">
          {[...Array(100)].map((_, i) => (
            <circle
              key={i}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r={Math.random() * 0.8 + 0.2}
              fill="#fbbf24"
              className="animate-pulse"
              style={{ animationDelay: `${Math.random() * 5}s` }}
            />
          ))}
        </svg>
      </div>

      <style>{`
        @keyframes float-hero { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-20px) scale(1.02); } }
        
        /* Animación de borde RGB perimetral (Gold Edition) */
        @keyframes gold-border-flow {
          0% { border-color: #fbbf24; box-shadow: 0 0 15px rgba(251, 191, 36, 0.1); }
          50% { border-color: #fef3c7; box-shadow: 0 0 25px rgba(251, 191, 36, 0.2); }
          100% { border-color: #fbbf24; box-shadow: 0 0 15px rgba(251, 191, 36, 0.1); }
        }

        @keyframes rotate-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes data-flow-gold { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        
        .animate-reveal { animation: revealUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        @keyframes revealUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Navegación */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#050505]/60 backdrop-blur-2xl border-b border-white/5">
        <div className="flex justify-between items-center px-10 py-6 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity">
              <Image src="/logo.png" alt="Gravity Labs" fill className="object-contain" />
            </div>
            <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-gray-400 group-hover:text-white transition-colors">Regresar</span>
          </Link>
          <div className="text-[10px] font-mono text-amber-500 uppercase tracking-[0.3em] border border-amber-500/20 px-5 py-2 rounded-full backdrop-blur-md">
            ENTERPRISE_CORE: V-1.0
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-44 pb-20 px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-4 animate-reveal">
                <span className="w-16 h-[1px] bg-amber-500" />
                <span className="font-mono text-[10px] text-amber-500 uppercase tracking-[0.8em]">Maximum_Scale_Architecture</span>
              </div>
              <h1 className="text-8xl md:text-9xl font-black tracking-tighter animate-reveal [animation-delay:0.2s]">
                Cosmos <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-yellow-600 italic">Enterprise.</span>
              </h1>
              <p className="text-gray-400 text-xl font-light leading-relaxed max-w-xl animate-reveal [animation-delay:0.4s]">
                La solución definitiva para corporaciones que no aceptan límites. Ecosistemas digitales masivos, interconectados y diseñados para el liderazgo global.
              </p>
              <div className="flex gap-8 pt-6 animate-reveal [animation-delay:0.6s]">
                <div className="bg-white/[0.03] border border-amber-500/10 p-8 rounded-3xl flex-1 backdrop-blur-xl">
                  <span className="block text-[10px] font-mono text-amber-600 uppercase mb-3 tracking-widest">Inversión Elite</span>
                  {/* David: Precio dinámico sincronizado */}
                  <span className="text-4xl font-black text-white">${price}</span>
                </div>
                <div className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl flex-1 backdrop-blur-xl">
                  <span className="block text-[10px] font-mono text-gray-500 uppercase mb-3 tracking-widest">Ciclo de Lanzamiento</span>
                  <span className="text-4xl font-black uppercase text-white">90 Días</span>
                </div>
              </div>
            </div>

            {/* Visual: Monolito Cosmos */}
            <div className="relative aspect-square flex items-center justify-center animate-reveal [animation-delay:0.5s]">
              <div className="absolute w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full animate-pulse" />
              
              <div className="relative w-full max-w-[500px] h-[600px] flex items-center justify-center">
                <div className="relative w-80 h-[500px] bg-[#0a0a0a] border-[2px] rounded-[4rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-[float-hero_10s_ease-in-out_infinite,gold-border-flow_8s_linear_infinite] z-20 flex flex-col items-center justify-center p-12">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fbbf24 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
                  
                  <div className="relative z-10 w-full space-y-12">
                    <div className="w-20 h-20 mx-auto border-2 border-amber-500/30 rounded-full flex items-center justify-center animate-[rotate-slow_15s_linear_infinite]">
                      <div className="w-12 h-12 bg-amber-500/20 rounded-full blur-sm" />
                      <div className="absolute w-full h-[2px] bg-amber-500/40" />
                    </div>
                    
                    <div className="space-y-6">
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-r from-amber-500 to-yellow-200 animate-[data-flow-gold_3s_ease-in-out_infinite]" />
                      </div>
                      <div className="h-1 w-3/4 mx-auto bg-white/5 rounded-full" />
                      <div className="h-1 w-1/2 mx-auto bg-white/5 rounded-full" />
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] font-mono text-amber-500 uppercase tracking-[0.5em] block mb-2">System_Integrity</span>
                      <span className="text-2xl font-black text-white">99.9%</span>
                    </div>
                  </div>
                </div>

                {/* Satélites de Datos */}
                <div className="absolute top-20 -right-12 w-44 bg-[#0f0f0f]/90 border border-amber-500/20 rounded-3xl p-6 backdrop-blur-2xl z-30 shadow-2xl">
                   <div className="text-[8px] font-mono text-amber-600 mb-4 uppercase tracking-widest">Global_Nodes</div>
                   <div className="grid grid-cols-3 gap-2">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-4 bg-amber-500/10 rounded-sm border border-amber-500/20 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                   </div>
                </div>

                <div className="absolute bottom-20 -left-16 w-60 bg-[#0f0f0f]/95 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl z-10 shadow-2xl">
                   <div className="text-[8px] font-mono text-gray-500 mb-5 uppercase tracking-widest">Enterprise_Traffic</div>
                   <div className="flex items-end gap-2 h-16">
                      {[30, 60, 45, 100, 80, 95, 70].map((h, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-amber-600/40 to-amber-200/20 rounded-t-md" style={{ height: `${h}%` }} />
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Características Cosmos */}
      <section className="py-24 relative z-10 px-8 border-y border-white/5 bg-amber-500/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-sm font-mono text-amber-500 tracking-[0.5em] uppercase mb-4">The_Enterprise_Framework</h2>
            <p className="text-5xl font-bold tracking-tight">Sin Límites. Sin Compromisos.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "Ecosistema Total", desc: "Integración perfecta de Web, Móvil y Backend bajo una arquitectura unificada y coherente.", label: "FULL_STACK_OMNI" },
              { title: "Seguridad de Élite", desc: "Protocolos de protección avanzados y auditorías de seguridad constantes para datos sensibles.", label: "TITANIUM_ARMOR" },
              { title: "Soporte Prioritario", desc: "Canal directo 24/7 con nuestro equipo de ingeniería para evoluciones y mantenimiento técnico.", label: "VIP_CONCIERGE" }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/[0.02] border border-white/5 p-12 rounded-[3rem] backdrop-blur-md hover:border-amber-500/30 transition-all group">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-8 border border-amber-500/20 group-hover:scale-110 transition-transform">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                </div>
                <span className="text-[10px] font-mono text-amber-600 block mb-3 tracking-widest">{feature.label}</span>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed font-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className="py-40 relative z-10 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-b from-amber-500/[0.07] to-transparent border border-amber-500/20 rounded-[5rem] p-16 md:p-32 text-center backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            
            <div className="relative z-10 space-y-12">
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]">
                Construye tu <br />
                <span className="text-amber-500 italic">Legado Digital.</span>
              </h2>
              <p className="text-gray-400 text-lg md:text-2xl font-light leading-relaxed max-w-3xl mx-auto">
                Cosmos Enterprise no es solo un servicio, es el estándar de oro de Gravity Labs. Diseñado para quienes buscan dominar su industria con tecnología de vanguardia.
              </p>
              
              <div className="pt-8">
                <Link 
                  href="/uplink?pkg=cosmos" 
                  className="inline-flex items-center gap-6 bg-amber-500 text-black px-16 py-7 rounded-3xl font-black text-sm uppercase tracking-[0.5em] hover:bg-white transition-all transform active:scale-95 shadow-[0_20px_50px_rgba(251,191,36,0.2)] group"
                >
                  INICIAR AHORA
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className="text-[10px] font-mono text-gray-700 uppercase tracking-[1em]">
          Cosmos Enterprise Division © 2026 // Authored by David
        </div>
      </footer>
    </main>
  );
}