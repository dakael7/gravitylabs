"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';

/**
 * Gravity Labs - Inteligencia de Acceso v3.0
 * David: Textos actualizados a un tono directo y profesional.
 */
function UplinkContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<'email' | 'login' | 'register'>('email');
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedPkg = searchParams.get('pkg');

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let targetUrl = '';
      let userName = '';
      let userEmail = '';

      if (step === 'register') {
        const { error: regError } = await supabase
          .from('perfiles_usuarios')
          .insert([{ 
            email: email.toLowerCase(), 
            nombre: nombre, 
            telefono: telefono, 
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
          alert("ERROR: Credenciales no válidas.");
          setLoading(false);
          return;
        } 
        
        userName = user.nombre;
        userEmail = user.email;
        targetUrl = user.rol === 'admin' ? '/admin/soporte' : '/dashboard';
      }

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
      alert("ERROR_DE_SISTEMA: No se pudo establecer la conexión.");
      setLoading(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#010103]" />;

  return (
    <main className="min-h-screen bg-[#010103] text-white flex items-center justify-center p-6 relative overflow-hidden selection:bg-cyan-500/30 font-mono italic">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-15%] w-[70%] h-[70%] bg-indigo-600/15 blur-[160px] rounded-full animate-pulse opacity-60" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[70%] h-[70%] bg-cyan-600/15 blur-[160px] rounded-full animate-pulse opacity-60" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-150 pointer-events-none" />
      </div>

      <Link 
        href="/" 
        className="fixed top-10 left-10 z-50 flex items-center gap-3 group opacity-40 hover:opacity-100 transition-all duration-700"
      >
        <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-cyan-500/50 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all">
          <svg className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <span className="text-[9px] tracking-[0.5em] uppercase text-gray-600 group-hover:text-white pt-1">Volver</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div className="relative group animate-reveal">
          
          <div className="absolute -inset-[2px] bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-600 rounded-[2.6rem] blur-[2px] opacity-20 group-hover:opacity-40 transition duration-1000 animate-rgb-border" />
          
          <div className="relative bg-[#050508]/95 border border-white/5 rounded-[2.5rem] p-10 md:p-14 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-scan" />

            <div className="flex justify-between items-center mb-12">
              <div className="relative w-8 h-8 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                <Image src="/logo.png" alt="Gravity" fill className="object-contain brightness-125" />
              </div>
              <div className="flex items-center gap-3">
                <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_10px] ${loading ? 'bg-yellow-500 shadow-yellow-500' : 'bg-cyan-500 shadow-cyan-500'} animate-flicker`} />
                <span className="text-[9px] text-gray-500 tracking-[0.3em] uppercase italic leading-none font-bold">
                  {loading ? 'Procesando' : 'Sistema_Activo'}
                </span>
              </div>
            </div>

            <div className="mb-10 space-y-3">
              <h1 className="text-4xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                {step === 'email' && (selectedPkg ? `${selectedPkg}.` : "Uplink.")}
                {step === 'login' && "Acceso."}
                {step === 'register' && "Registro."}
              </h1>
              <div className="h-[1px] w-12 bg-cyan-500/50" />
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] leading-relaxed italic">
                {step === 'email' && (selectedPkg ? `Configuración de servicio: ${selectedPkg}.` : "Ingrese correo electrónico corporativo.")}
                {step === 'login' && "Usuario identificado. Ingrese clave de acceso."}
                {step === 'register' && "Usuario no registrado. Complete los campos de perfil."}
              </p>
            </div>

            <form onSubmit={step === 'email' ? checkUser : handleFinalSubmit} className="space-y-6">
              
              <div className="space-y-2 group/input">
                <label className="text-[9px] text-gray-700 uppercase tracking-[0.4em] ml-1 italic group-focus-within/input:text-cyan-500 transition-colors">Email</label>
                <input 
                  required
                  type="email"
                  disabled={step !== 'email'}
                  className="w-full bg-white/[0.01] border border-white/5 rounded-2xl p-4 text-sm focus:border-cyan-500/40 focus:bg-cyan-500/[0.03] outline-none transition-all disabled:opacity-30 italic text-cyan-50/90 shadow-inner"
                  placeholder="usuario@dominio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {step === 'register' && (
                <>
                  <div className="space-y-2 animate-reveal">
                    <label className="text-[9px] text-gray-700 uppercase tracking-[0.4em] ml-1 italic">Nombre</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-white/[0.01] border border-white/5 rounded-2xl p-4 text-sm focus:border-indigo-500/40 focus:bg-indigo-500/[0.03] outline-none transition-all italic text-white shadow-inner"
                      placeholder="Nombre Completo"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 animate-reveal">
                    <label className="text-[9px] text-gray-700 uppercase tracking-[0.4em] ml-1 italic">Teléfono</label>
                    <input 
                      required
                      type="tel"
                      className="w-full bg-white/[0.01] border border-white/5 rounded-2xl p-4 text-sm focus:border-indigo-500/40 focus:bg-indigo-500/[0.03] outline-none transition-all italic text-white shadow-inner"
                      placeholder="+58 000 0000000"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>
                </>
              )}

              {(step === 'login' || step === 'register') && (
                <div className="space-y-2 animate-reveal">
                  <label className="text-[9px] text-gray-700 uppercase tracking-[0.4em] ml-1 italic">Password</label>
                  <input 
                    required
                    type="password"
                    className="w-full bg-white/[0.01] border border-white/5 rounded-2xl p-4 text-sm focus:border-indigo-500/40 focus:bg-indigo-500/[0.03] outline-none transition-all italic text-white shadow-inner"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}

              <button 
                disabled={loading}
                className="group/btn relative w-full py-5 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.5em] overflow-hidden transition-all active:scale-[0.97] disabled:opacity-50 mt-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-all duration-700 animate-rgb-border" />
                <span className="relative z-10 group-hover/btn:text-white transition-colors duration-300">
                  {loading ? 'Ejecutando...' : step === 'email' ? 'Continuar' : step === 'login' ? 'Acceder' : 'Crear Perfil'}
                </span>
              </button>

              {step !== 'email' && (
                <button 
                  type="button"
                  onClick={() => { setStep('email'); setPassword(''); }}
                  className="w-full text-[9px] text-gray-800 uppercase tracking-[0.4em] hover:text-cyan-400 transition-colors pt-2 italic font-bold"
                >
                  // Corregir Email
                </button>
              )}
            </form>
          </div>
        </div>

        <p className="text-center mt-12 text-[9px] text-gray-800 uppercase tracking-[0.8em] italic font-bold">
          <span className="animate-flicker">Gravity Labs // Versión 3.0</span>
        </p>
      </div>

      <style>{`
        .animate-reveal { animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes revealUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(600px); opacity: 0; }
        }
        .animate-scan { animation: scan 4s linear infinite; }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
          70% { opacity: 0.9; }
        }
        .animate-flicker { animation: flicker 2s infinite; }

        @keyframes rgb-border {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        .animate-rgb-border { animation: rgb-border 8s linear infinite; }
      `}</style>
    </main>
  );
}

export default function UplinkPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#010103]" />}>
      <UplinkContent />
    </Suspense>
  );
}