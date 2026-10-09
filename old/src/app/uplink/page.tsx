"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';

/**
 * Gravity Labs - Inteligencia de Acceso v4.8.4 (Auth & Role Persistence Fix)
 * David: Se corrige el error de "Rol Insuficiente" mediante el uso de user_metadata.
 * Se asegura que el registro en la tabla de perfiles ocurra bajo una sesión limpia.
 */
function UplinkContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<'email' | 'login' | 'register' | 'verification'>('email');
  
  // Datos de usuario
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  
  // Manejo de teléfono segmentado
  const [prefijo, setPrefijo] = useState('+58');
  const [telefonoInput, setTelefonoInput] = useState('');
  
  // Estados de verificación
  const [emailCodeInput, setEmailCodeInput] = useState('');
  const [phoneCodeInput, setPhoneCodeInput] = useState('');
  const [generatedEmailOtp, setGeneratedEmailOtp] = useState(''); 
  const [generatedPhoneOtp, setGeneratedPhoneOtp] = useState(''); 
  
  const [loading, setLoading] = useState(false);
  const selectedPkg = searchParams.get('pkg');

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  
  const handlePhoneChange = (val: string) => {
    let cleanValue = val.replace(/\D/g, ''); 
    if (cleanValue.startsWith('0')) {
      cleanValue = cleanValue.substring(1);
    }
    setTelefonoInput(cleanValue);
  };

  const formatNombreCapitalizado = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getFullPhone = () => `${prefijo}${telefonoInput}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (step === 'email') return checkUser();
    if (step === 'login') return handleLogin();
    if (step === 'register') return handlePreRegister(); 
    if (step === 'verification') return handleVerifyAndSubmit();
  };

  /**
   * Verificación inicial de existencia de usuario
   */
  const checkUser = async () => {
    if (!validateEmail(email)) return alert("ERROR: Formato de email inválido.");
    setLoading(true);

    try {
      // 1. Verificar si existe en perfiles_usuarios
      const { data: profile } = await supabase
        .from('perfiles_usuarios')
        .select('email, rol, nombre')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (profile) {
        // Usuario existe en perfiles_usuarios, ir directamente a login
        setStep('login');
      } else {
        // No existe, ir a registro
        setStep('register');
      }
    } catch (err) {
      console.error("Error en verificación:", err);
      setStep('register');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Proceso de Login con sincronización de sesión activa
   */
  const handleLogin = async () => {
    setLoading(true);
    try {
      const sanitizedEmail = email.toLowerCase().trim();

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: password,
      });

      if (authError) {
        console.error("Error de autenticación:", authError);
        // Mensaje más amigable para el usuario
        if (authError.message.includes('Invalid login credentials')) {
          alert('Credenciales incorrectas. Si olvidaste tu contraseña, contacta al administrador.');
        } else {
          alert(`Error de acceso: ${authError.message}`);
        }
        setLoading(false);
        return;
      }

      const { data: userProfile, error: profileError } = await supabase
        .from('perfiles_usuarios')
        .select('nombre, email, rol')
        .eq('email', sanitizedEmail)
        .single();

      if (profileError) {
        console.error("Error buscando perfil:", profileError);
        alert(`PERFIL_NO_ENCONTRADO: ${profileError.message}`);
        setLoading(false);
        return;
      }

      if (!userProfile) {
        alert("PERFIL_NO_ENCONTRADO: No se encontró el perfil del usuario.");
        setLoading(false);
        return;
      }

      console.log("Perfil encontrado:", userProfile);
      
      const isAdmin = userProfile.rol === 'admin' || userProfile.rol === 'staff';
      const targetUrl = isAdmin ? '/admin/soporte' : '/dashboard';
      
      const query = new URLSearchParams({ 
        name: userProfile.nombre, 
        email: userProfile.email 
      });
      if (selectedPkg) query.append('pkg', selectedPkg);

      router.push(`${targetUrl}?${query.toString()}`);
    } catch (err: any) {
      alert(`ERROR_SISTEMA: ${err.message}`);
      setLoading(false);
    }
  };

  /**
   * Pre-registro: Generación y despacho de OTP dual
   */
  const handlePreRegister = async () => {
    const palabras = nombre.trim().split(/\s+/);
    if (palabras.length < 2) {
      alert("ERROR_IDENTIDAD: Introduzca nombre y apellido.");
      return;
    }

    if (!nombre || !telefonoInput || !password) {
      alert("CAMPOS_INCOMPLETOS: Por favor rellene todos los campos.");
      return;
    }
    
    setLoading(true);
    const eOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const pOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    setGeneratedEmailOtp(eOtp);
    setGeneratedPhoneOtp(pOtp);
    
    try {
      const fullPhone = getFullPhone();
      const sanitizedEmail = email.toLowerCase().trim();

      await Promise.all([
        fetch('/api/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: sanitizedEmail, otp: eOtp }),
        }),
        fetch('/api/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telefono: fullPhone, otp: pOtp }),
        })
      ]);

      setStep('verification');
    } catch (err) {
      alert("ERROR_COMUNICACION: Fallo al enviar códigos.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verificación final y creación de identidad
   * David: Implementación de registro atómico con asignación forzada de rol 'cliente'.
   */
  const handleVerifyAndSubmit = async () => {
    if (emailCodeInput !== generatedEmailOtp || phoneCodeInput !== generatedPhoneOtp) {
      alert("VALIDACION_FALLIDA: Códigos incorrectos.");
      return;
    }
    
    setLoading(true);
    try {
      const nombreFormateado = formatNombreCapitalizado(nombre);
      const sanitizedEmail = email.toLowerCase().trim();

      // Limpieza de estados de sesión previos para evitar errores 400
      await supabase.auth.signOut();

      // 1. Registro en Supabase Auth con metadatos de perfil
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: password,
        options: {
          data: {
            full_name: nombreFormateado,
            role: 'cliente'
          }
        }
      });

      // Si el usuario ya existe en Auth, intentar hacer login
      if (authError && authError.message.includes('User already registered')) {
        console.log('Usuario ya existe en Auth, intentando login...');
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: sanitizedEmail,
          password: password,
        });
        
        if (loginError) {
          throw new Error('Usuario existe pero credenciales inválidas. Use recuperación de contraseña.');
        }
      } else if (authError) {
        throw authError;
      }

      // 2. Verificar si el perfil ya existe en perfiles_usuarios
      const { data: existingProfile } = await supabase
        .from('perfiles_usuarios')
        .select('email')
        .eq('email', sanitizedEmail)
        .maybeSingle();

      if (!existingProfile) {
        // 3. Registro manual en la tabla perfiles_usuarios para persistencia
        const { error: regError } = await supabase
          .from('perfiles_usuarios')
          .insert([{ 
            email: sanitizedEmail, 
            nombre: nombreFormateado, 
            telefono: getFullPhone(), 
            password: password, // Almacenado para referencia técnica
            rol: 'cliente' 
          }]);

        if (regError) {
          console.error("DB_INSERT_ERROR:", regError);
          throw new Error("Sincronización de base de datos fallida.");
        }
      }

      // Redirección directa al Dashboard tras registro exitoso
      const query = new URLSearchParams({ 
        name: nombreFormateado, 
        email: sanitizedEmail 
      });
      if (selectedPkg) query.append('pkg', selectedPkg);
      
      router.push(`/dashboard?${query.toString()}`);
    } catch (err: any) {
      alert(`FALLO_REGISTRO: ${err.message}`);
      setLoading(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#010103]" />;

  return (
    <main className="min-h-screen bg-[#010103] text-white flex items-center justify-center p-6 relative overflow-hidden font-mono italic">
      {/* Background FX */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-15%] w-[70%] h-[70%] bg-indigo-600/15 blur-[160px] rounded-full animate-pulse opacity-60" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[70%] h-[70%] bg-cyan-600/15 blur-[160px] rounded-full animate-pulse opacity-60" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="relative group animate-reveal">
          <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 via-cyan-400 to-purple-600 rounded-[2.6rem] blur-[2px] opacity-20 animate-rgb-border" />
          
          <div className="relative bg-[#050508]/95 border border-white/5 rounded-[2.5rem] p-10 md:p-14 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-cyan-400/60 to-transparent animate-scan" />

            {/* Header / Logo */}
            <div className="flex justify-between items-center mb-12">
              <div className="relative w-8 h-8 opacity-40">
                <Image 
                  src="/logo.png" 
                  alt="Gravity" 
                  fill 
                  sizes="32px"
                  className="object-contain brightness-125" 
                />
              </div>
              <div className="flex items-center gap-3">
                <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_10px] ${loading ? 'bg-yellow-500 shadow-yellow-500' : 'bg-cyan-500 shadow-cyan-500'} animate-flicker`} />
                <span className="text-[9px] text-gray-500 tracking-[0.3em] uppercase italic font-bold">
                  {loading ? 'Procesando' : 'Sistema_Seguro'}
                </span>
              </div>
            </div>

            {/* Step Titles */}
            <div className="mb-10 space-y-3">
              <h1 className="text-4xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-linear-to-b from-white to-white/40">
                {step === 'email' && "Uplink."}
                {step === 'login' && "Acceso."}
                {step === 'register' && "Perfil."}
                {step === 'verification' && "Shield."}
              </h1>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] leading-relaxed italic">
                {step === 'email' && "Identifique su terminal de acceso."}
                {step === 'login' && "Usuario reconocido. Introduzca credenciales."}
                {step === 'register' && "Nuevo registro. Introduzca sus datos."}
                {step === 'verification' && "Doble validación activa. SMS + EMAIL."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {step !== 'verification' && (
                <div className="space-y-2">
                  <label className="text-[9px] text-gray-700 uppercase tracking-[0.4em] ml-1 italic">Email</label>
                  <input 
                    required type="email" disabled={step !== 'email'}
                    className="w-full bg-white/1 border border-white/5 rounded-2xl p-4 text-sm focus:border-cyan-500/40 outline-none transition-all disabled:opacity-30 italic text-cyan-50/90 shadow-inner"
                    placeholder="usuario@dominio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}

              {step === 'register' && (
                <>
                  <div className="space-y-2 animate-reveal">
                    <label className="text-[9px] text-gray-700 uppercase tracking-[0.4em] ml-1 italic">Nombre y Apellido</label>
                    <input 
                      required type="text"
                      className="w-full bg-white/1 border border-white/5 rounded-2xl p-4 text-sm focus:border-indigo-500/40 outline-none transition-all italic text-white shadow-inner"
                      placeholder="Ej: Pedro Campos"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 animate-reveal">
                    <label className="text-[9px] text-gray-700 uppercase tracking-[0.4em] ml-1 italic">Teléfono</label>
                    <div className="flex gap-2">
                      <select 
                        value={prefijo}
                        onChange={(e) => setPrefijo(e.target.value)}
                        className="bg-white/5 border border-white/5 rounded-2xl px-3 text-[11px] text-white outline-none focus:border-indigo-500/40 italic appearance-none cursor-pointer"
                      >
                        <option value="+58">+58 (VE)</option>
                        <option value="+1">+1 (US/CA)</option>
                        <option value="+34">+34 (ES)</option>
                        <option value="+57">+57 (CO)</option>
                        <option value="+56">+56 (CL)</option>
                        <option value="+54">+54 (AR)</option>
                        <option value="+507">+507 (PA)</option>
                        <option value="+52">+52 (MX)</option>
                      </select>
                      <input 
                        required type="tel"
                        className="flex-1 bg-white/1 border border-white/5 rounded-2xl p-4 text-sm focus:border-indigo-500/40 outline-none transition-all italic text-white shadow-inner"
                        placeholder="4121234567"
                        value={telefonoInput}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              {(step === 'login' || step === 'register') && (
                <div className="space-y-2 animate-reveal">
                  <label className="text-[9px] text-gray-700 uppercase tracking-[0.4em] ml-1 italic">Password</label>
                  <input 
                    required type="password"
                    className="w-full bg-white/1 border border-white/5 rounded-2xl p-4 text-sm focus:border-indigo-500/40 outline-none transition-all italic text-white shadow-inner"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}

              {step === 'verification' && (
                <div className="space-y-6 animate-reveal">
                  <div className="space-y-2">
                    <label className="text-[9px] text-cyan-500 uppercase tracking-[0.4em] ml-1 italic">Código Email</label>
                    <input 
                      required type="text" maxLength={6}
                      className="w-full bg-cyan-500/5 border border-cyan-500/30 rounded-2xl p-4 text-center text-xl tracking-[0.5em] focus:border-cyan-400 outline-none transition-all italic text-white shadow-inner"
                      placeholder="000000"
                      value={emailCodeInput}
                      onChange={(e) => setEmailCodeInput(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] text-purple-500 uppercase tracking-[0.4em] ml-1 italic">Código SMS</label>
                    <input 
                      required type="text" maxLength={6}
                      className="w-full bg-purple-500/5 border border-purple-500/30 rounded-2xl p-4 text-center text-xl tracking-[0.5em] focus:border-purple-400 outline-none transition-all italic text-white shadow-inner"
                      placeholder="000000"
                      value={phoneCodeInput}
                      onChange={(e) => setPhoneCodeInput(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <button 
                disabled={loading}
                className="group/btn relative w-full py-5 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.5em] overflow-hidden transition-all active:scale-[0.97] disabled:opacity-50 mt-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                <div className="absolute inset-0 bg-linear-to-r from-cyan-400 via-indigo-500 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-all duration-700 animate-rgb-border" />
                <span className="relative z-10 group-hover/btn:text-white transition-colors duration-300">
                  {loading ? 'Procesando...' : 
                   step === 'email' ? 'Verificar Correo' : 
                   step === 'login' ? 'Acceder' : 
                   step === 'register' ? 'Enviar Códigos' : 
                   'Validar Identidad'}
                </span>
              </button>

              {step !== 'email' && (
                <button 
                  type="button"
                  onClick={() => { 
                    setStep('email'); 
                    setPassword(''); 
                    setEmailCodeInput('');
                    setPhoneCodeInput('');
                  }}
                  className="w-full text-[9px] text-gray-800 uppercase tracking-[0.4em] hover:text-cyan-400 transition-colors pt-2 italic font-bold"
                >
                  Reiniciar Proceso
                </button>
              )}
            </form>
          </div>
        </div>

        <p className="text-center mt-12 text-[9px] text-gray-800 uppercase tracking-[0.8em] italic font-bold">
          <span className="animate-flicker">Gravity Labs // Identity Shield v4.8</span>
        </p>
      </div>

      <style>{`
        .animate-reveal { animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes revealUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scan { 0% { transform: translateY(0); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(600px); opacity: 0; } }
        .animate-scan { animation: scan 4s linear infinite; }
        .animate-flicker { animation: flicker 2s infinite; }
        @keyframes rgb-border { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
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