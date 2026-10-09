"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase'; // Importación de la instancia de Supabase

/**
 * Gravity Labs - Service Detail: Nebula Landing
 * David: Componente optimizado con flujo de conversión.
 * UPDATE: Sincronización dinámica de PRECIO desde el núcleo (gravity_services).
 * El resto del contenido permanece estático según instrucciones.
 */
export default function NebulaLanding() {
  const [mounted, setMounted] = useState(false);
  const [price, setPrice] = useState<string>('---'); // Estado para el precio dinámico

  useEffect(() => {
    setMounted(true);
    
    /**
     * David: Protocolo de sincronización de precio.
     * Busca en la tabla de servicios el registro correspondiente a Nebula.
     */
    const syncPrice = async () => {
      try {
        const { data, error } = await supabase
          .from('gravity_services')
          .select('precio')
          .eq('nombre', 'Nebula Landing') // Identificador único en el núcleo
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

  if (!mounted) return <div className="min-h-screen bg-[#020205]" />;

  return (
    <main className="min-h-screen bg-[#020205] text-white overflow-hidden relative selection:bg-cyan-500/30">
      
      {/* Capas de Fondo: Estrellas Dispersas y Nebulosas Orgánicas */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-indigo-600/10 blur-[140px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-cyan-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '12s' }} />
        
        <svg className="absolute inset-0 w-full h-full opacity-40">
          {[...Array(60)].map((_, i) => (
            <circle
              key={i}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r={Math.random() * 0.8 + 0.2}
              fill="white"
              className="animate-pulse"
              style={{ 
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.7 + 0.3 
              }}
            />
          ))}
        </svg>
      </div>

      <style>{`
        @keyframes border-conic { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes float-slow { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-12px) rotate(0.5deg); } }
        .animate-reveal { animation: revealUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        @keyframes revealUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .rgb-border-container { position: relative; padding: 1.5px; border-radius: 14px; overflow: hidden; background: rgba(255, 255, 255, 0.05); box-shadow: 0 0 30px rgba(79, 70, 229, 0.2); }
        .rgb-border-bg { position: absolute; inset: -50%; background: conic-gradient(from 0deg, #6366f1, #06b6d4, #a855f7, #6366f1); animation: border-conic 6s linear infinite; filter: blur(8px); }
      `}</style>

      {/* Navegación */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#020205]/40 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-between items-center px-10 py-6 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity">
              <Image src="/logo.png" alt="Gravity Labs" fill className="object-contain" />
            </div>
            <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-gray-400 group-hover:text-white transition-colors">
              Regresar
            </span>
          </Link>
          <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest border border-cyan-500/20 px-4 py-2 rounded-full">
            Service_ID: V-0.0_NEBULA
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-4 animate-reveal">
                <span className="w-12 h-[1px] bg-cyan-500" />
                <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-[0.8em]">Deployment_Ready</span>
              </div>
              <h1 className="text-7xl md:text-8xl font-black tracking-tighter animate-reveal [animation-delay:0.2s]">
                Nebula <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-600">Landing.</span>
              </h1>
              <p className="text-gray-400 text-xl font-light leading-relaxed max-w-xl animate-reveal [animation-delay:0.4s]">
                Diseñada para ser rápida y efectiva. Una página única donde la claridad es la prioridad, guiando a tus usuarios directamente hacia lo que importa.
              </p>
              <div className="flex gap-6 pt-6 animate-reveal [animation-delay:0.6s]">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex-1 backdrop-blur-md">
                  <span className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Inversión</span>
                  {/* David: Precio sincronizado */}
                  <span className="text-3xl font-black">${price}</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex-1 backdrop-blur-md">
                  <span className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Entrega Est.</span>
                  <span className="text-3xl font-black uppercase">7-10 Días</span>
                </div>
              </div>
            </div>

            <div className="relative aspect-square animate-reveal [animation-delay:0.5s]">
              <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_60s_linear_infinite] opacity-10" />
              <div className="flex items-center justify-center h-full">
                <div className="relative w-72 h-72 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-3xl p-8 group">
                   <div className="absolute -top-12 -right-12 z-20 animate-[float-slow_6s_ease-in-out_infinite]">
                      <div className="rgb-border-container">
                         <div className="rgb-border-bg" />
                         <div className="relative w-56 h-40 bg-white rounded-xl overflow-hidden flex flex-col">
                            <div className="h-5 w-full bg-white px-3 flex items-center justify-between border-b border-gray-100">
                               <div className="flex gap-1 items-center">
                                  <div className="w-2 h-2 bg-indigo-600 rounded-sm" />
                                  <div className="w-8 h-1 bg-gray-200 rounded-full" />
                               </div>
                               <div className="w-10 h-2 bg-indigo-600 rounded-full" />
                            </div>
                            <div className="flex-1 p-4 flex">
                               <div className="w-1/2 space-y-2 pt-1">
                                  <div className="h-3 w-full bg-gray-900 rounded-full" />
                                  <div className="h-3 w-4/5 bg-gray-900 rounded-full" />
                                  <div className="h-4 w-12 bg-indigo-500 rounded-sm mt-3" />
                               </div>
                               <div className="w-1/2 flex items-center justify-center">
                                  <div className="w-16 h-16 bg-gradient-to-tr from-indigo-50 to-cyan-50 rounded-lg" />
                                </div>
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="space-y-5 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="h-2 w-full bg-white/30 rounded-full" />
                      <div className="h-2 w-3/4 bg-white/30 rounded-full" />
                      <div className="h-32 w-full bg-cyan-500/10 rounded-xl border border-cyan-500/30" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Características del Paquete Nebula */}
      <section className="py-24 relative z-10 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 space-y-4 text-center lg:text-left">
            <h2 className="text-sm font-mono text-indigo-400 tracking-[0.3em] uppercase">Módulo_Especificaciones</h2>
            <p className="text-4xl font-bold tracking-tight">Sistemas Integrados en Nebula.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Diseño Personalizable",
                desc: "Arquitectura Next.js 15 + Tailwind adaptada totalmente a tu identidad visual, garantizando una estética única y profesional.",
                label: "CUSTOM_INTERFACE"
              },
              {
                title: "SEO On-Page",
                desc: "Optimización técnica de meta-datos y estructura semántica personalizada para asegurar el máximo alcance en buscadores.",
                label: "VISIBILITY"
              },
              {
                title: "Google Analytics 4",
                desc: "Configuración de telemetría específica para tu negocio, midiendo las conversiones y eventos que realmente te importan.",
                label: "TELEMETRY"
              },
              {
                title: "Mentoring Estratégico",
                desc: "Asesoría personalizada para optimizar tu mensaje y estructura de venta, alineando la landing page con tus objetivos comerciales.",
                label: "STRATEGY"
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl backdrop-blur-md hover:border-cyan-500/40 transition-all group">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                </div>
                <span className="text-[9px] font-mono text-gray-500 block mb-2 tracking-widest">{feature.label}</span>
                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN DE CIERRE Y CONTRATACIÓN */}
      <section className="py-32 relative z-10 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 rounded-[3rem] p-12 md:p-20 text-center backdrop-blur-xl overflow-hidden relative">
            {/* Decoración de fondo */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
                El motor que tu <br /> 
                <span className="text-cyan-400">visión necesita.</span>
              </h2>
              
              <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                No es solo una landing page; es una herramienta de ingeniería diseñada para convertir curiosidad en clientes. Combinamos el stack más potente del mercado con asesoría estratégica real.
              </p>

              <div className="pt-8">
                <Link 
                  href="/uplink?pkg=nebula" 
                  className="inline-flex items-center gap-6 bg-white text-black px-10 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-cyan-500 hover:text-white transition-all transform active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)] group"
                >
                  INICIAR AHORA
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>

              <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest pt-4">
                Disponibilidad inmediata // Sistema Nebula V.1.0
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center relative z-10 backdrop-blur-md">
        <div className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.5em]">
          Gravity Labs Deployment System © 2026 // Encrypted Connection
        </div>
      </footer>
    </main>
  );
}