"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';

/**
 * Gravity Labs - Inteligencia de Acceso v3.0
 * Sistema unificado con derivación de roles (Admin/Client).
 * MOD: Captura de parámetro 'pkg' para flujo de contratación directa.
 */
function UplinkContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<'email' | 'login' | 'register'>('email');
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Capturamos el paquete si el cliente viene de una landing específica
  const selectedPkg = searchParams.get('pkg');

  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * PASO 1: Verificación de identidad en el núcleo.
   */
  const checkUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('perfiles_usuarios')
        .select('email')
        .eq('email', email.toLowerCase())
        .single();

      setTimeout(() => {
        if (data) {
          setStep('login');
        } else {
          setStep('register');
        }
        setLoading(false);
      }, 800);
    } catch (err) {
      setStep('register');
      setLoading(false);
    }
  };

  /**
   * PASO 2: Ejecución de Vínculo (Auth).
   */
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Preparamos la base de la URL de destino
      let targetUrl = '';
      let userName = '';
      let userEmail = '';

      if (step === 'register') {
        const { error: regError } = await supabase
          .from('perfiles_usuarios')
          .insert([{ 
            email: email.toLowerCase(), 
            nombre: nombre, 
            password: password,
            rol: 'cliente' 
          }]);

        if (regError) throw regError;
        userName = nombre;
        userEmail = email;
        targetUrl = '/dashboard';

      } else {
        const { data: user, error: logError } = await supabase
          .from('perfiles_usuarios')
          .select('nombre, email, rol, password')
          .eq('email', email.toLowerCase())
          .single();

        if (logError || !user || user.password !== password) {
          alert("ACCESS_DENIED: Firma o llave de acceso no válida.");
          setLoading(false);
          return;
        } 
        
        userName = user.nombre;
        userEmail = user.email;
        targetUrl = user.rol === 'admin' ? '/admin/soporte' : '/dashboard';
      }

      // Construcción inteligente de la redirección con preservación de paquete
      const finalParams = new URLSearchParams({
        name: userName,
        email: userEmail
      });

      if (selectedPkg) {
        finalParams.append('pkg', selectedPkg);
      }

      router.push(`${targetUrl}?${finalParams.toString()}`);

    } catch (err) {
      console.error("Critical Protocol Error:", err);
      alert("ERROR_DE_SISTEMA: No se pudo establecer el vínculo con el servidor.");
      setLoading(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#020205]" />;

  return (
    <main className="min-h-screen bg-[#020205] text-white flex items-center justify-center p-6 relative overflow-hidden selection:bg-cyan-500/30 font-mono italic">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/10 blur-[140px] rounded-full animate-pulse" />
      </div>

      <Link 
        href="/" 
        className="fixed top-10 left-10 z-50 flex items-center gap-3 group opacity-50 hover:opacity-100 transition-all duration-500"
      >
        <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-cyan-500/40 transition-all">
          <svg className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <span className="text-[10px] tracking-[0.4em] uppercase text-gray-500 group-hover:text-white pt-1">Return_Port</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div className="relative group animate-reveal">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500/50 via-cyan-500/50 to-indigo-500/50 rounded-[2.5rem] blur-sm opacity-20 group-hover:opacity-60 transition duration-1000" />
          
          <div className="relative bg-[#07070b]/90 border border-white/10 rounded-[2.5rem] p-10 md:p-14 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

            <div className="flex justify-between items-center mb-12">
              <div className="relative w-8 h-8 opacity-60">
                <Image src="/logo.png" alt="Gravity" fill className="object-contain" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px] ${loading ? 'bg-yellow-500 shadow-yellow-500' : 'bg-cyan-500 shadow-cyan-500'} animate-pulse`} />
                <span className="text-[9px] text-gray-600 tracking-[0.3em] uppercase italic leading-none">
                  {loading ? 'Sincronizando...' : 'Terminal_Listo'}
                </span>
              </div>
            </div>

            <div className="mb-10 space-y-2">
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                {step === 'email' && (selectedPkg ? `Configurar ${selectedPkg}.` : "Uplink.")}
                {step === 'login' && "Acceso."}
                {step === 'register' && "Registro."}
              </h1>
              <p className="text-gray-500 text-[9px] uppercase tracking-[0.2em] leading-relaxed italic">
                {step === 'email' && (selectedPkg ? `Iniciando despliegue de sistema ${selectedPkg}.` : "Identifica tu canal para establecer el vínculo.")}
                {step === 'login' && "Identidad reconocida. Introduce tu llave de acceso."}
                {step === 'register' && "Firma no detectada. Crea un nuevo perfil de cliente."}
              </p>
            </div>

            <form onSubmit={step === 'email' ? checkUser : handleFinalSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] text-gray-700 uppercase tracking-widest ml-1 italic">Canal_Email</label>
                <input 
                  required
                  type="email"
                  disabled={step !== 'email'}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-sm focus:border-cyan-500/40 focus:bg-cyan-500/5 outline-none transition-all disabled:opacity-30 italic"
                  placeholder="ej. ejemplo@gravity.labs"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {step === 'register' && (
                <div className="space-y-2 animate-reveal">
                  <label className="text-[9px] text-gray-700 uppercase tracking-widest ml-1 italic">Nombre_Operador</label>
                  <input 
                    required
                    type="text"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-sm focus:border-indigo-500/40 outline-none transition-all italic"
                    placeholder="Tu nombre completo"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
              )}

              {(step === 'login' || step === 'register') && (
                <div className="space-y-2 animate-reveal">
                  <label className="text-[9px] text-gray-700 uppercase tracking-widest ml-1 italic">Llave_Acceso</label>
                  <input 
                    required
                    type="password"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-sm focus:border-indigo-500/40 outline-none transition-all italic"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}

              <button 
                disabled={loading}
                className="group/btn relative w-full py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] overflow-hidden transition-all active:scale-[0.98] disabled:opacity-50 mt-4 shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-all duration-500" />
                <span className="relative z-10 group-hover/btn:text-white transition-colors">
                  {loading ? 'Estableciendo Enlace...' : step === 'email' ? 'Continuar' : step === 'login' ? 'Conectar' : 'Crear Perfil'}
                </span>
              </button>

              {step !== 'email' && (
                <button 
                  type="button"
                  onClick={() => { setStep('email'); setPassword(''); }}
                  className="w-full text-[9px] text-gray-700 uppercase tracking-[0.3em] hover:text-cyan-400 transition-colors pt-2 italic"
                >
                  ← Cambiar canal de acceso
                </button>
              )}
            </form>
          </div>
        </div>

        <p className="text-center mt-12 text-[8px] text-gray-800 uppercase tracking-[0.8em] italic">
          Gravity Labs // Secure_Uplink_Terminal_v3.0
        </p>
      </div>

      <style>{`
        .animate-reveal { animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes revealUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </main>
  );
}

// David: Suspense wrapper para manejar searchParams en Next.js Client Components
export default function UplinkPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020205]" />}>
      <UplinkContent />
    </Suspense>
  );
}