"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase'; // Conexión con el núcleo de datos

/**
 * Gravity Labs - Detalle de Servicio: Titanium System (V-0.5.1)
 * David: Infraestructura de Backend y Seguridad.
 * UPDATE: Sincronización dinámica de PRECIO desde el núcleo (gravity_services).
 */
export default function TitaniumSystem() {
  const [mounted, setMounted] = useState(false);
  const [price, setPrice] = useState<string>('---'); // Estado para el precio dinámico

  useEffect(() => {
    setMounted(true);

    /**
     * David: Protocolo de sincronización de precio.
     * Consulta el registro de 'Titanium System' en el inventario.
     */
    const syncPrice = async () => {
      try {
        const { data, error } = await supabase
          .from('gravity_services')
          .select('precio')
          .eq('nombre', 'Titanium System') // Identificador único en DB
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

  if (!mounted) return <div className="min-h-screen bg-[#05070a]" />;

  return (
    <main className="min-h-screen bg-[#05070a] text-white overflow-hidden relative selection:bg-cyan-500/30">
      
      {/* Capas de Fondo: Red de Datos Subterránea */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-cyan-600/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-slate-600/5 blur-[130px] rounded-full animate-pulse" />
        
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <style>{`
        @keyframes core-pulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.05); opacity: 1; } }
        @keyframes data-flow { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
        
        /* Animación de borde RGB técnica (Cian - Acero) */
        @keyframes titanium-border-flow {
          0% { border-color: #06b6d4; box-shadow: 0 0 15px rgba(6, 182, 212, 0.1); }
          50% { border-color: #64748b; box-shadow: 0 0 10px rgba(100, 116, 139, 0.1); }
          100% { border-color: #06b6d4; box-shadow: 0 0 15px rgba(6, 182, 212, 0.1); }
        }

        .animate-reveal { animation: revealUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        @keyframes revealUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Navegación */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#05070a]/50 backdrop-blur-2xl border-b border-white/5">
        <div className="flex justify-between items-center px-10 py-6 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity">
              <Image src="/logo.png" alt="Gravity Labs" fill className="object-contain" />
            </div>
            <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-gray-400 group-hover:text-white transition-colors">Regresar</span>
          </Link>
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest border border-cyan-500/20 px-4 py-2 rounded-full backdrop-blur-md">
            CORE_ID: V-0.5_TITANIUM
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
                <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-[0.8em]">Secure_Backend_Systems</span>
              </div>
              <h1 className="text-7xl md:text-8xl font-black tracking-tighter animate-reveal [animation-delay:0.2s]">
                Titanium <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-slate-500 italic">System.</span>
              </h1>
              <p className="text-gray-400 text-xl font-light leading-relaxed max-w-xl animate-reveal [animation-delay:0.4s]">
                Ingeniería de servidor para soportar tráfico masivo. Construimos la columna vertebral de tu negocio con seguridad de grado militar y bases de datos optimizadas.
              </p>
              <div className="flex gap-6 pt-6 animate-reveal [animation-delay:0.6s]">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex-1 backdrop-blur-md">
                  <span className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Inversión Base</span>
                  {/* David: Precio dinámico sincronizado */}
                  <span className="text-3xl font-black text-cyan-400">${price}</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex-1 backdrop-blur-md">
                  <span className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Despliegue</span>
                  <span className="text-3xl font-black uppercase text-white">40-50 Días</span>
                </div>
              </div>
            </div>

            {/* Visual: Núcleo de Titanium */}
            <div className="relative aspect-square flex items-center justify-center animate-reveal [animation-delay:0.5s]">
              <div className="relative w-full max-w-[450px] h-[500px] flex items-center justify-center">
                
                {/* Estructura Central de Servidor */}
                <div className="relative w-72 h-96 bg-[#0a0f14] border-[2px] rounded-3xl shadow-2xl overflow-hidden animate-[titanium-border-flow_8s_linear_infinite] z-20 flex flex-col p-8">
                  <div className="flex justify-between items-center mb-10">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-cyan-500/30 rounded-full" />
                    </div>
                    <span className="text-[8px] font-mono text-cyan-500 tracking-widest uppercase">Encryption_ON</span>
                  </div>

                  {/* Núcleo (Core) */}
                  <div className="flex-1 flex flex-col justify-center items-center space-y-6">
                    <div className="w-32 h-32 rounded-full border border-cyan-500/20 flex items-center justify-center relative">
                      <div className="absolute inset-0 rounded-full border-t-2 border-cyan-500 animate-[spin_4s_linear_infinite]" />
                      <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center animate-[core-pulse_3s_ease-in-out_infinite]">
                        <div className="w-10 h-10 bg-cyan-500/20 rounded-lg rotate-45 border border-cyan-500/40" />
                      </div>
                    </div>
                    
                    <div className="w-full space-y-3">
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-cyan-500/50" />
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-slate-500/50" />
                      </div>
                    </div>
                  </div>

                  {/* Terminal inferior */}
                  <div className="mt-6 pt-4 border-t border-white/5">
                     <div className="text-[7px] font-mono text-gray-500 uppercase mb-1">Process_Log:</div>
                     <div className="text-[7px] font-mono text-cyan-400/70 lowercase tracking-tighter">
                        titanium_syncing_data... [OK]
                     </div>
                  </div>
                </div>

                {/* Paneles Flotantes */}
                <div className="absolute top-10 -right-8 w-48 bg-[#0d141b]/90 border border-white/5 rounded-2xl p-6 backdrop-blur-2xl z-30 shadow-2xl">
                   <div className="text-[8px] font-mono text-gray-500 mb-3 uppercase tracking-widest">Firewall_Status</div>
                   <div className="flex items-center gap-3">
                      <div className="flex-1 h-1 bg-cyan-500/20 rounded-full overflow-hidden">
                         <div className="h-full w-full bg-cyan-400 animate-[data-flow_2s_linear_infinite]" />
                      </div>
                      <span className="text-[9px] font-bold text-cyan-400">100%</span>
                   </div>
                </div>

                <div className="absolute bottom-10 -left-10 w-56 bg-[#0d141b]/90 border border-white/5 rounded-3xl p-7 backdrop-blur-2xl z-10 shadow-2xl">
                   <div className="text-[8px] font-mono text-gray-500 mb-4 uppercase tracking-widest">Database_Queries</div>
                   <div className="flex items-end gap-1.5 h-10">
                      {[60, 40, 90, 70, 85, 55].map((h, i) => (
                        <div key={i} className="flex-1 bg-slate-500/30 rounded-t-sm" style={{ height: `${h}%` }} />
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Características Técnicas */}
      <section className="py-24 relative z-10 px-8 border-t border-white/5 bg-cyan-500/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 space-y-4 text-center lg:text-left">
            <h2 className="text-sm font-mono text-cyan-400 tracking-[0.3em] uppercase">Core_System_Capabilities</h2>
            <p className="text-4xl font-bold tracking-tight">Arquitectura Imperturbable.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Servidores Escalables", desc: "Infraestructura en la nube lista para escalar horizontalmente según la demanda de tráfico.", label: "CLOUD_AUTO_SCALE" },
              { title: "Seguridad Titanium", desc: "Capas de cifrado extremo a extremo y protocolos de protección contra ataques DDoS.", label: "CYBER_DEFENSE" },
              { title: "Bases de Datos", desc: "Optimización de consultas y estructuras NoSQL/SQL para tiempos de respuesta de milisegundos.", label: "DATA_EFFICIENCY" },
              { title: "API de Alto Nivel", desc: "Construcción de endpoints robustos y documentados para una integración perfecta.", label: "CORE_CONNECT" }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-md hover:border-cyan-500/40 transition-all group">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 border border-cyan-500/20 group-hover:scale-110 transition-transform">
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

      {/* Cierre */}
      <section className="py-32 relative z-10 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 rounded-[3rem] p-12 md:p-24 text-center backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <div className="relative z-10 space-y-10">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                Poder <br />
                <span className="text-cyan-400 italic">Centralizado.</span>
              </h2>
              <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                No dejes tu estabilidad al azar. Titanium System es la garantía de que tu plataforma nunca se detendrá, sin importar el volumen de usuarios.
              </p>
              <div className="pt-6">
                <Link 
                  href="/uplink?pkg=titanium" 
                  className="inline-flex items-center gap-6 bg-white text-black px-14 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-cyan-500 hover:text-white transition-all transform active:scale-95 shadow-2xl shadow-cyan-500/20 group"
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
          Titanium Core Unit © 2026 // Authored by David
        </div>
      </footer>
    </main>
  );
}