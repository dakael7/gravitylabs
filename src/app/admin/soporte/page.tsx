"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CreateAdminForm from './create-admin';

/**
 * Gravity Labs - CORE ADMINISTRATION (Neon-Nebula Protocol) v6.1.0
 * UI Optimization: David - Enhanced Luminosity, RGB Glow Borders & Dynamic Nebulas.
 * Maintains full logical integrity and professional documentation.
 */
export default function AdminControlPanel() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'soporte' | 'requerimientos' | 'proyectos' | 'solicitudes' | 'sistema' | 'usuarios' | 'servicios'>('soporte');
  const [chats, setChats] = useState<any[]>([]); 
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [uploading, setUploading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({}); 
  
  const [projectRequests, setProjectRequests] = useState<any[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);

  const [servicesList, setServicesList] = useState<any[]>([]);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceData, setServiceData] = useState({ nombre: '', precio: '', descripcion: '', is_active: true });

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState({ nombre: '', email: '', telefono: '', rol: 'cliente' });

  const scrollAnchor = useRef<HTMLDivElement>(null);

  /**
   * Protocolo de Validación de Rol: ADMIN/STAFF
   * David: Validación para acceso al panel de administración
   */
  useEffect(() => {
    const validateAdminRole = async () => {
      // 1. Verificar sesión de Auth
      const { data: { session }, error: authError } = await supabase.auth.getSession();

      if (authError || !session) {
        console.warn("ACCESO_DENEGADO: Sin sesión activa.");
        router.replace('/uplink');
        return;
      }

      // 2. Consultar tabla perfiles_usuarios para validar ROL usando el email
      const { data: profile, error: dbError } = await supabase
        .from('perfiles_usuarios')
        .select('nombre, email, rol, telefono')
        .eq('email', session.user.email?.toLowerCase())
        .single();

      // Validación para roles admin o staff
      if (dbError || !profile || !['admin', 'staff'].includes(profile.rol?.toLowerCase())) {
        console.error("ACCESO_RESTRINGIDO: Rol insuficiente para administración.");
        // Si es cliente, redirigir al dashboard
        if (profile && profile.rol?.toLowerCase() === 'cliente') {
          console.log("Usuario cliente detectado, redirigiendo a /dashboard");
          router.replace('/dashboard');
          return;
        }
        await supabase.auth.signOut(); 
        router.replace('/uplink');
        return;
      }
      
      setAuthLoading(false);
    };

    validateAdminRole();
  }, [router]);

  /**
   * Application logging protocol for system traceability.
   */
  const logActivity = useCallback(async (type: 'INFO' | 'WARN' | 'ERROR' | 'USER', message: string) => {
    const adminTag = "DAVID_ADMIN";
    const newLog = {
      id: Math.random().toString(36),
      time: new Date().toLocaleTimeString(),
      type,
      message: `[${adminTag}] ${message}`
    };
    
    setSystemLogs(prev => [newLog, ...prev].slice(0, 50));

    try {
      await supabase.from('logs_sistema').insert([{
        tipo: type,
        mensaje: message,
        autor: adminTag,
        fecha_hora: new Date().toISOString()
      }]);
    } catch (err) {
      console.error("Critical System Log Failure", err);
    }
  }, []);

  /**
   * Service catalog data fetching.
   */
  const fetchServices = useCallback(async () => {
    const { data } = await supabase
      .from('gravity_services')
      .select('*')
      .order('categoria', { ascending: true });
    if (data) setServicesList(data);
  }, []);

  const handleUpdateService = async (id: string) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from('gravity_services')
      .update(serviceData)
      .eq('id', id);

    if (!error) {
      await logActivity('INFO', `PRECIO_SYNC: ${serviceData.nombre} actualizado a $${serviceData.precio}`);
      setEditingServiceId(null);
      fetchServices();
    } else {
      alert("ERROR_SYNC_SERVICE");
    }
    setUpdatingId(null);
  };

  /**
   * Viewport management for message synchronization.
   */
  useEffect(() => {
    if (scrollAnchor.current) {
      scrollAnchor.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, systemLogs]);

  /**
   * Real-time subscription for system events and logs.
   */
  useEffect(() => {
    if (activeTab === 'sistema') {
      const fetchLogs = async () => {
        const { data } = await supabase
          .from('logs_sistema')
          .select('*')
          .order('fecha_hora', { ascending: false })
          .limit(100);
        
        if (data) {
          const formattedLogs = data.map(l => ({
            id: l.id,
            time: new Date(l.fecha_hora).toLocaleTimeString(),
            type: l.tipo,
            message: `[${l.autor}] ${l.mensaje}`
          }));
          setSystemLogs(formattedLogs);
        }
      };
      fetchLogs();
    }

    const globalChannel = supabase.channel('system_monitoring')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensajes_soporte' }, (payload) => {
        if (!payload.new.es_staff) {
          logActivity('INFO', `Mensaje entrante de ${payload.new.emisor_nombre}`);
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'solicitudes_proyectos' }, (payload) => {
        logActivity('USER', `Nueva solicitud recibida: ${payload.new.proyecto_nombre}`);
      })
      .subscribe();

    return () => { supabase.removeChannel(globalChannel); };
  }, [activeTab, logActivity]);

  /**
   * Staff presence tracking via Supabase Presence.
   */
  useEffect(() => {
    const staffPresence = supabase.channel('staff-online-status', {
      config: { presence: { key: 'GRAVITY_ADMIN_SESSION' } }
    });

    staffPresence.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await staffPresence.track({
          name: "DAVID_ADMIN",
          online_at: new Date().toISOString()
        });
      }
    });

    return () => { supabase.removeChannel(staffPresence); };
  }, []);

  /**
   * Initial data load for communication dashboard.
   */
  useEffect(() => {
    const fetchGlobalData = async () => {
      const { data } = await supabase
        .from('mensajes_soporte')
        .select('cliente_email, emisor_nombre, created_at, es_staff, leido')
        .order('created_at', { ascending: false });

      if (data) {
        const unique = Array.from(new Map(data.map(item => [item['cliente_email'], item])).values());
        setChats(unique);
      }
    };

    fetchGlobalData();
    
    const channel = supabase.channel('core_admin_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mensajes_soporte' }, () => {
        fetchGlobalData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeTab]);

  /**
   * User directory fetching protocol.
   */
  const fetchUsers = useCallback(async () => {
    const { data } = await supabase
      .from('perfiles_usuarios') 
      .select('id, email, nombre, created_at, rol, telefono')
      .order('created_at', { ascending: false });
    if (data) setUsersList(data);
  }, []);

  useEffect(() => {
    if (activeTab === 'solicitudes' || activeTab === 'requerimientos' || activeTab === 'proyectos') {
      const fetchProjects = async () => {
        const { data } = await supabase
          .from('solicitudes_proyectos')
          .select('*')
          .order('created_at', { ascending: false });
        if (data) setProjectRequests(data);
      };
      fetchProjects();
    }

    if (activeTab === 'usuarios') fetchUsers();
    if (activeTab === 'servicios') fetchServices();
  }, [activeTab, fetchUsers, fetchServices]);

  /**
   * User CRUD operations.
   */
  const handleCreateUser = async () => {
    const { error } = await supabase.from('perfiles_usuarios').insert([userData]);
    if (!error) {
      await logActivity('USER', `CREACIÓN_USUARIO: ${userData.email} (${userData.rol})`);
      setIsCreating(false);
      setUserData({ nombre: '', email: '', telefono: '', rol: 'cliente' });
      fetchUsers();
    }
  };

  const handleUpdateUser = async (id: string) => {
    const { error } = await supabase.from('perfiles_usuarios').update(userData).eq('id', id);
    if (!error) {
      await logActivity('INFO', `MODIFICACIÓN_USUARIO: Identidad ${userData.email} actualizada`);
      setEditingUserId(null);
      fetchUsers();
    }
  };

  const handleDeleteUser = async (id: string) => {
    const targetUser = usersList.find(u => u.id === id);
    if (confirm("¿ELIMINAR ACCESO DEFINITIVAMENTE?")) {
      const { error } = await supabase.from('perfiles_usuarios').delete().eq('id', id);
      if (!error) {
        await logActivity('ERROR', `ELIMINACIÓN_CRÍTICA: Acceso revocado para ${targetUser?.email || id}`);
        fetchUsers();
      }
    }
  };

  /**
   * Project status synchronization.
   */
  const handleStatusChange = async (projectId: string, newStatus: string) => {
    setUpdatingId(projectId);
    const project = projectRequests.find(p => p.id === projectId);
    try {
      const { error } = await supabase
        .from('solicitudes_proyectos')
        .update({ estado: newStatus })
        .eq('id', projectId);

      if (error) throw error;

      await logActivity('INFO', `STATUS_SYNC: ${project?.proyecto_nombre} movido a ${newStatus.toUpperCase()}`);
      setProjectRequests(prev => prev.map(p => 
        p.id === projectId ? { ...p, estado: newStatus } : p
      ));
    } catch (err) {
      alert("ERROR_SYNC_STATUS");
    } finally {
      setUpdatingId(null);
    }
  };

  /**
   * User filtering logic.
   */
  const filteredUsers = usersList.filter(user => {
    const search = searchTerm.toLowerCase();
    return (
      (user.nombre?.toLowerCase().includes(search)) ||
      (user.email?.toLowerCase().includes(search)) ||
      (user.telefono?.includes(search)) ||
      (user.rol?.toLowerCase().includes(search))
    );
  });

  /**
   * Presence monitoring.
   */
  useEffect(() => {
    const channels = chats.map(chat => {
      const clientEmail = chat.cliente_email.toLowerCase();
      const channel = supabase.channel(`online-status-${clientEmail}`)
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const isOnline = Object.keys(state).length > 0;
          setOnlineUsers(prev => ({ ...prev, [clientEmail]: isOnline }));
        })
        .subscribe();
      return channel;
    });

    return () => { channels.forEach(ch => supabase.removeChannel(ch)); };
  }, [chats]);

  /**
   * Message history listener.
   */
  useEffect(() => {
    if (selectedClient && activeTab === 'soporte') {
      const fetchMsgs = async () => {
        const { data } = await supabase
          .from('mensajes_soporte')
          .select('*')
          .eq('cliente_email', selectedClient)
          .order('created_at', { ascending: true });
        setMessages(data || []);

        await supabase
          .from('mensajes_soporte')
          .update({ leido: true })
          .eq('cliente_email', selectedClient)
          .eq('es_staff', false)
          .eq('leido', false);
      };

      fetchMsgs();

      const channel = supabase.channel(`room_${selectedClient}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'mensajes_soporte', 
          filter: `cliente_email=eq.${selectedClient}` 
        }, (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => [...prev, payload.new]);
            if (!payload.new.es_staff) {
              supabase.from('mensajes_soporte').update({ leido: true }).eq('id', payload.new.id).then();
            }
          } else if (payload.eventType === 'UPDATE') {
            setMessages((prev) => prev.map(m => m.id === payload.new.id ? payload.new : m));
          }
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [selectedClient, activeTab]);

  /**
   * Support attachments.
   */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedClient) return;
    setUploading(true);
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;
    const filePath = `adjuntos/${fileName}`;
    try {
      const { error: uploadError } = await supabase.storage.from('soporte_adjuntos').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('soporte_adjuntos').getPublicUrl(filePath);
      const contenidoAdjunto = file.type.startsWith('image/') ? `[IMAGE]:${publicUrl}` : `[FILE]:${file.name}|${publicUrl}`;
      await supabase.from('mensajes_soporte').insert([{ emisor_nombre: "GRAVITY_ADMIN", contenido: contenidoAdjunto, cliente_email: selectedClient, es_staff: true, leido: false }]);
      await logActivity('INFO', `TRANSFERENCIA_ARCHIVOS: Adjunto enviado a terminal ${selectedClient}`);
    } catch (err) { alert("ERROR_DE_CARGA"); } finally { setUploading(false); }
  };

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selectedClient) return;
    await supabase.from('mensajes_soporte').insert([{ emisor_nombre: "GRAVITY_ADMIN", contenido: reply, cliente_email: selectedClient, es_staff: true, leido: false }]);
    await logActivity('INFO', `TERMINAL_MSG: Respuesta enviada a ${selectedClient}`);
    setReply('');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#020205] flex items-center justify-center font-mono text-[10px] text-red-900 tracking-[1em] animate-pulse uppercase">
        Verifying_Admin_Access...
      </div>
    );
  }

  return (
    <main className="flex h-screen bg-[#020205] text-zinc-300 font-mono uppercase italic text-[10px] overflow-hidden relative selection:bg-red-500/30">
      
      {/* BACKGROUND NEBULA SYSTEM AND ATMOSPHERIC LIGHTING */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Dynamic Nebulas */}
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-red-600/10 blur-[180px] rounded-full animate-pulse-slow mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[150px] rounded-full animate-float mix-blend-overlay" />
        <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] bg-purple-900/5 blur-[120px] rounded-full animate-pulse-slow" />
        
        {/* CRT Scanline and Noise */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />
        
        {/* Moving Laser Scanner */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-scan z-50" />
      </div>

      <aside className="w-20 lg:w-64 border-r border-white/10 bg-black/60 backdrop-blur-3xl flex flex-col items-center lg:items-start p-6 relative z-10 shadow-[20px_0_50px_rgba(0,0,0,0.8)]">
        <div className="mb-12 relative group cursor-crosshair px-2">
          <div className="absolute inset-0 bg-red-500 blur-3xl opacity-10 group-hover:opacity-30 transition-all duration-700 scale-150" />
          <Image src="/logo.png" alt="Gravity" width={40} height={40} className="relative grayscale brightness-200 contrast-125 group-hover:rotate-180 transition-transform duration-1000" />
        </div>
        <nav className="flex flex-col gap-4 w-full">
          {[
            { id: 'soporte', icon: '◈', label: 'SOPORTE' },
            { id: 'servicios', icon: '⌬', label: 'SERVICIOS' },
            { id: 'requerimientos', icon: '⧇', label: 'REQUERIMIENTOS' },
            { id: 'proyectos', icon: '▣', label: 'PROYECTOS' },
            { id: 'usuarios', icon: '⧇', label: 'USUARIOS' },
            { id: 'sistema', icon: '▦', label: 'CONSOLE LOGS' }
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as any)} 
              className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all relative group overflow-hidden border
                ${activeTab === item.id 
                  ? 'bg-white/10 border-red-500/50 text-white shadow-[0_0_30px_rgba(239,68,68,0.15)]' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-200 hover:bg-white/5 hover:border-white/10'}`}
            >
              <span className={`text-lg transition-transform group-hover:scale-125 ${activeTab === item.id ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : ''}`}>{item.icon}</span>
              <span className="hidden lg:block font-bold tracking-[0.2em]">{item.label}</span>
              {activeTab === item.id && (
                <div className="absolute left-0 w-1.5 h-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)] rounded-r-full" />
              )}
            </button>
          ))}
        </nav>
      </aside>

      <section className="grow flex flex-row overflow-hidden relative z-10">
        
        {activeTab === 'servicios' ? (
          <div className="grow p-10 overflow-y-auto custom-scrollbar animate-reveal">
            <header className="mb-10 border-l-4 border-red-500 pl-8 relative">
              <h2 className="text-3xl font-black tracking-[0.4em] text-white italic drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">SERVICIOS</h2>
              <p className="text-zinc-400 mt-2 font-bold uppercase tracking-widest text-[9px]">Global service indexing and valuation node.</p>
            </header>

            {editingServiceId && (
              <div className="mb-10 p-10 border border-red-500/30 rounded-[2.5rem] bg-black/80 backdrop-blur-2xl grid grid-cols-1 md:grid-cols-3 gap-8 animate-reveal shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                <div className="flex flex-col gap-3">
                  <label className="text-[8px] text-red-500 font-black tracking-widest">ID_NOMENCLATURA</label>
                  <input value={serviceData.nombre} onChange={e => setServiceData({...serviceData, nombre: e.target.value})} className="bg-zinc-900/50 border border-white/10 p-5 rounded-2xl text-[10px] outline-none focus:border-red-500 transition-all text-white shadow-inner" />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[8px] text-red-500 font-black tracking-widest">USD_VALUATION</label>
                  <input value={serviceData.precio} onChange={e => setServiceData({...serviceData, precio: e.target.value})} className="bg-zinc-900/50 border border-white/10 p-5 rounded-2xl text-[10px] outline-none focus:border-red-500 transition-all text-white shadow-inner" />
                </div>
                <div className="flex items-end gap-3">
                   <button onClick={() => handleUpdateService(editingServiceId)} className="grow bg-red-600 text-white p-5 rounded-2xl font-black text-[10px] hover:bg-red-500 transition-all uppercase shadow-lg shadow-red-900/40 active:scale-95">
                    {updatingId ? 'SYNCING...' : 'COMMIT_DATA'}
                   </button>
                   <button onClick={() => setEditingServiceId(null)} className="p-5 bg-zinc-800 rounded-2xl text-zinc-400 hover:bg-zinc-700 transition-all">✕</button>
                </div>
                <div className="md:col-span-3 flex flex-col gap-3">
                  <label className="text-[8px] text-red-500 font-black tracking-widest">TECHNICAL_SPECS</label>
                  <textarea value={serviceData.descripcion} onChange={e => setServiceData({...serviceData, descripcion: e.target.value})} className="bg-zinc-900/50 border border-white/10 p-5 rounded-2xl text-[10px] outline-none h-28 normal-case font-sans focus:border-red-500 transition-all text-zinc-200" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicesList.map((service, i) => (
                <div key={i} className="bg-black/40 border border-white/10 p-10 rounded-[2.5rem] hover:border-red-500/50 transition-all group relative overflow-hidden backdrop-blur-xl shadow-2xl hover:shadow-red-500/10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/5 blur-[80px] -mr-20 -mt-20 group-hover:bg-red-500/15 transition-all" />
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                    <button onClick={() => { 
                      setEditingServiceId(service.id); 
                      setServiceData({ nombre: service.nombre, precio: service.precio, descripcion: service.descripcion, is_active: service.is_active });
                    }} className="text-white bg-red-600/20 p-3 rounded-xl border border-red-500/30 hover:bg-red-600 transition-all backdrop-blur-md">✎</button>
                  </div>
                  <span className="text-[8px] text-red-500 font-black tracking-[0.4em] uppercase drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">{service.categoria}</span>
                  <h3 className="text-lg font-black text-white mt-3 tracking-tighter uppercase italic">{service.nombre}</h3>
                  <div className="my-8 flex items-end">
                    <span className="text-4xl font-black text-white leading-none tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">${service.precio}</span>
                    <span className="text-[9px] text-zinc-500 font-black ml-3 mb-1 uppercase">USD_NET</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed normal-case font-sans mb-8 line-clamp-4">
                    {service.descripcion}
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <div className={`w-2 h-2 rounded-full ${service.is_active ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,1)] animate-pulse' : 'bg-zinc-700'}`} />
                    <span className="text-[8px] text-zinc-400 font-black tracking-widest uppercase">{service.is_active ? 'SYSTEM_ACTIVE' : 'OFFLINE'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'soporte' ? (
          <>
            <div className="w-80 border-r border-white/10 bg-black/40 backdrop-blur-3xl flex flex-col relative">
              <header className="p-8 border-b border-white/10 relative z-10 bg-gradient-to-b from-black/20 to-transparent">
                <h2 className="text-white font-black tracking-[0.4em] text-[10px] uppercase flex items-center gap-4">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]" />
                  SYNCED_TERMINALS
                </h2>
              </header>
              <div className="grow overflow-y-auto custom-scrollbar z-10">
                {chats.map((chat) => (
                  <button
                    key={chat.cliente_email}
                    onClick={() => setSelectedClient(chat.cliente_email)}
                    className={`w-full p-8 text-left border-b border-white/5 transition-all relative group ${selectedClient === chat.cliente_email ? 'bg-red-500/5' : 'hover:bg-white/5'}`}
                  >
                    <div className="flex justify-between items-center">
                      <p className={`font-black tracking-tighter uppercase text-sm italic ${selectedClient === chat.cliente_email ? 'text-red-500' : 'text-zinc-400 group-hover:text-zinc-100'}`}>{chat.emisor_nombre}</p>
                      <div className="flex items-center gap-3">
                        {onlineUsers[chat.cliente_email.toLowerCase()] ? (
                          <span className="text-[7px] text-red-500 font-black bg-red-500/10 px-2 py-1 rounded border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]">LIVE</span>
                        ) : (
                          <span className="text-[7px] text-zinc-600 font-black uppercase">IDLE</span>
                        )}
                        {!chat.es_staff && !chat.leido && (
                          <span className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_15px_red] animate-bounce" />
                        )}
                      </div>
                    </div>
                    <p className="text-[9px] text-zinc-600 mt-2 lowercase font-bold truncate opacity-60 group-hover:opacity-100">{chat.cliente_email}</p>
                    {selectedClient === chat.cliente_email && <div className="absolute right-0 top-0 w-1 h-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]" />}
                  </button>
                ))}
              </div>
            </div>
            <div className="grow flex flex-col bg-transparent relative">
              {selectedClient ? (
                <>
                  <header className="p-8 border-b border-white/10 bg-black/40 backdrop-blur-3xl z-20 flex justify-between items-center shadow-xl">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-red-600/10 border border-red-500/30 rounded-2xl flex items-center justify-center text-red-500 font-black italic shadow-inner">
                        {selectedClient.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-black italic tracking-widest text-white uppercase">ID_PORT: <span className="text-red-500 ml-2 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">{selectedClient}</span></h3>
                        <p className="text-[8px] text-zinc-500 font-black tracking-widest mt-1">ENCRYPTED_SIGNAL_STABLE</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-zinc-400 hover:text-white transition-all">⚙</button>
                    </div>
                  </header>
                  <div className="grow p-10 overflow-y-auto space-y-10 custom-scrollbar bg-black/10 backdrop-blur-sm">
                    {messages.map((m, i) => (
                      <div key={i} className={`flex flex-col ${m.es_staff ? 'items-end' : 'items-start'} animate-reveal`}>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-black italic">{m.es_staff ? 'CORE_OVERRIDE' : m.emisor_nombre}</span>
                          <span className="text-[7px] text-zinc-700 font-bold">{new Date(m.created_at).toLocaleTimeString()}</span>
                        </div>
                        <div className={`max-w-xl p-6 rounded-[2rem] border transition-all duration-500 shadow-2xl relative overflow-hidden ${
                          m.es_staff 
                          ? 'bg-white text-black font-bold rounded-tr-none border-transparent' 
                          : 'bg-zinc-900/80 border-white/10 text-zinc-100 rounded-tl-none backdrop-blur-md'
                        }`}>
                          {m.es_staff && <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />}
                          {m.contenido.startsWith('[IMAGE]:') ? (
                            <img src={m.contenido.replace('[IMAGE]:', '')} className="rounded-2xl max-h-96 border border-white/10 shadow-2xl" alt="Transmitted Data" />
                          ) : m.contenido.startsWith('[FILE]:') ? (
                            <a href={m.contenido.split('|')[1]} target="_blank" className="flex items-center gap-6 p-5 bg-black/40 rounded-2xl italic border border-white/10 hover:border-red-500 transition-all group/file">
                              <span className="text-2xl group-hover/file:scale-110 transition-transform">📂</span>
                              <div className="flex flex-col">
                                <span className="text-[10px] underline font-black text-white">{m.contenido.split('|')[0].replace('[FILE]:', '')}</span>
                                <span className="text-[8px] text-red-500 uppercase font-black tracking-widest mt-1">REMOTE_CONTENT_SAFE</span>
                              </div>
                            </a>
                          ) : (
                            <span className="normal-case font-sans font-medium text-sm leading-relaxed tracking-tight">{m.contenido}</span>
                          )}
                        </div>
                        {m.es_staff && (
                          <div className="flex items-center gap-2 mt-3">
                             <span className={`text-[8px] font-black tracking-widest ${m.leido ? 'text-red-500 shadow-[0_0_8px_red]' : 'text-zinc-700'}`}>
                              {m.leido ? 'TRANSMISSION_ACK' : 'SENDING_PACKETS...'}
                             </span>
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={scrollAnchor} />
                  </div>
                  <form onSubmit={sendReply} className="p-10 bg-black/60 border-t border-white/10 backdrop-blur-3xl relative z-20">
                    <div className="flex items-center gap-6 bg-zinc-900/50 border border-white/10 rounded-3xl p-4 focus-within:border-red-500/50 transition-all shadow-2xl focus-within:shadow-red-500/5">
                      <label className={`cursor-pointer p-4 rounded-2xl hover:bg-white/10 transition-all ${uploading ? 'animate-pulse' : ''}`}>
                        <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                        <span className="text-2xl opacity-50 hover:opacity-100 transition-opacity">🖇</span>
                      </label>
                      <input 
                        value={reply} 
                        onChange={(e) => setReply(e.target.value)} 
                        placeholder="TERMINAL_COMMAND_ENTRY..." 
                        className="grow bg-transparent p-4 text-[13px] outline-none normal-case font-sans font-medium text-white placeholder:text-zinc-700" 
                      />
                      <button className="px-12 py-5 bg-red-600 text-white font-black text-[11px] rounded-2xl hover:bg-red-500 transition-all uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(239,68,68,0.4)] active:scale-95">EXEC_SEND</button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="grow flex items-center justify-center text-zinc-900 tracking-[5em] font-black italic select-none opacity-20">GRAVITY_CORE</div>
              )}
            </div>
          </>
        ) : activeTab === 'usuarios' ? (
          <div className="grow p-10 overflow-y-auto custom-scrollbar animate-reveal">
            <header className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-l-4 border-white/20 pl-10 relative">
              <div>
                <h2 className="text-4xl font-black tracking-tight text-white italic uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">USERS_VAULT</h2>
                <div className="flex gap-4 items-center mt-6">
                  <button 
                    onClick={() => { setIsCreating(!isCreating); setEditingUserId(null); setUserData({ nombre: '', email: '', telefono: '', rol: 'cliente' }); }}
                    className="bg-red-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black hover:bg-red-500 transition-all uppercase tracking-widest shadow-[0_0_25px_rgba(239,68,68,0.3)]"
                  >
                    {isCreating ? 'HALT_CREATION' : '＋ NEW_CLIENT'}
                  </button>
                  <button 
                    onClick={() => { setIsCreating(false); setEditingUserId(null); }}
                    className="bg-orange-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black hover:bg-orange-500 transition-all uppercase tracking-widest shadow-[0_0_25px_rgba(251,146,60,0.3)]"
                  >
                    ＋ NEW_ADMIN
                  </button>
                  <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">Neural user mapping and access logs.</p>
                </div>
              </div>
              <div className="relative w-full lg:w-[450px]">
                <input 
                  type="text"
                  placeholder="FILTER_DATABASE_IDENTITY..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-900/60 border border-white/10 rounded-2xl p-6 pl-14 text-[11px] font-bold outline-none focus:border-red-500/50 transition-all text-white placeholder:text-zinc-700 shadow-2xl"
                />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 opacity-20 text-xl">⚛</span>
              </div>
            </header>

            {/* Formulario de creación de administradores */}
            <CreateAdminForm onSuccess={fetchUsers} />

            {(isCreating || editingUserId) && (
              <div className="mb-12 p-12 border border-red-500/30 rounded-[3rem] bg-black/80 backdrop-blur-2xl grid grid-cols-1 md:grid-cols-4 gap-8 animate-reveal shadow-2xl">
                <div className="flex flex-col gap-3">
                  <label className="text-[9px] text-red-500 font-black uppercase tracking-widest">FULL_NAME</label>
                  <input placeholder="ENTITY_NAME" value={userData.nombre || ''} onChange={e => setUserData({...userData, nombre: e.target.value})} className="bg-zinc-900/50 border border-white/10 p-5 rounded-2xl text-[11px] outline-none text-white focus:border-red-500 transition-all" />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[9px] text-red-500 font-black uppercase tracking-widest">UPLINK_MAIL</label>
                  <input placeholder="EMAIL_ADDRESS" value={userData.email || ''} onChange={e => setUserData({...userData, email: e.target.value})} className="bg-zinc-900/50 border border-white/10 p-5 rounded-2xl text-[11px] outline-none text-white focus:border-red-500 transition-all" />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[9px] text-red-500 font-black uppercase tracking-widest">VOICE_CHANNEL</label>
                  <input placeholder="PHONE_NUMBER" value={userData.telefono || ''} onChange={e => setUserData({...userData, telefono: e.target.value})} className="bg-zinc-900/50 border border-white/10 p-5 rounded-2xl text-[11px] outline-none text-white focus:border-red-500 transition-all" />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[9px] text-red-500 font-black uppercase tracking-widest">AUTH_PRIVILEGES</label>
                  <div className="flex gap-4">
                    <select value={userData.rol || 'cliente'} onChange={e => setUserData({...userData, rol: e.target.value})} className="grow bg-zinc-900/50 border border-white/10 p-5 rounded-2xl text-[11px] outline-none uppercase text-white cursor-pointer hover:border-red-500/30 transition-all">
                      <option value="cliente">CLIENT_MODULE</option>
                      <option value="staff">ROOT_ADMIN</option>
                      <option value="disabled">LOCKED_VOID</option>
                    </select>
                    <button onClick={editingUserId ? () => handleUpdateUser(editingUserId) : handleCreateUser} className="bg-white text-black px-10 rounded-2xl font-black text-[11px] hover:bg-zinc-200 transition-all shadow-xl active:scale-95">
                      {editingUserId ? 'SYNC' : 'SAVE'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredUsers.map((user, i) => (
                <div key={i} className={`bg-black/40 border border-white/10 p-10 rounded-[3rem] hover:border-red-500 transition-all group relative overflow-hidden backdrop-blur-xl shadow-2xl ${user.rol === 'disabled' ? 'grayscale opacity-30 scale-95' : 'hover:-translate-y-2'}`}>
                  <div className="absolute top-0 right-0 p-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                    <button onClick={() => { setEditingUserId(user.id); setUserData({ nombre: user.nombre || '', email: user.email || '', telefono: user.telefono || '', rol: user.rol || 'cliente' }); setIsCreating(false); }} className="text-white bg-zinc-800 p-3 rounded-xl border border-white/10 hover:bg-red-600 transition-all shadow-lg">✎</button>
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 bg-zinc-800 p-3 rounded-xl border border-white/10 hover:bg-red-900/80 transition-all shadow-lg">✕</button>
                  </div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-600/20 to-transparent border border-red-500/30 rounded-[1.5rem] flex items-center justify-center text-red-500 font-black text-xl italic shadow-inner">
                      {user.nombre?.charAt(0) || 'U'}
                    </div>
                    <span className={`text-[8px] font-black tracking-[0.3em] uppercase px-4 py-2 rounded-full border shadow-[0_0_15px_rgba(0,0,0,0.5)] ${user.rol === 'staff' ? 'border-red-600 text-red-500 bg-red-600/5' : 'border-zinc-700 text-zinc-500'}`}>
                      {user.rol || 'CLIENT'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tighter italic drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{user.nombre || "GUEST_UNID"}</h3>
                  <p className="text-[10px] text-zinc-500 lowercase font-bold italic mb-10 truncate opacity-60 group-hover:opacity-100">{user.email}</p>
                  <div className="space-y-4 border-t border-white/10 pt-8">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest italic">UPLINK_STATUS:</span>
                      <span className="text-[9px] text-zinc-300 font-bold bg-white/5 px-3 py-1 rounded-lg border border-white/5">ACTIVE</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest italic">JOIN_DATE:</span>
                      <span className="text-[9px] text-zinc-300 font-bold">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'VOID'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'sistema' ? (
          <div className="grow p-10 overflow-hidden flex flex-col animate-reveal">
            <header className="mb-10 flex justify-between items-end border-b border-white/10 pb-8">
              <div>
                <h2 className="text-4xl font-black tracking-[0.4em] text-white italic uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">ROOT_CON_LOGS</h2>
                <p className="text-zinc-500 mt-4 font-bold uppercase tracking-[0.3em] text-[9px] italic">Global kernel trace monitoring / real-time auditing.</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[8px] text-red-500 font-black tracking-widest mb-1">STABLE_UPTIME</span>
                  <span className="text-white font-black text-xs tracking-widest">99.98%</span>
                </div>
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(239,68,68,1)]" />
              </div>
            </header>
            <div className="grow bg-black/60 border border-white/10 rounded-[3rem] p-10 overflow-y-auto custom-scrollbar font-mono relative backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)]">
              <div className="space-y-4">
                {systemLogs.map((log) => (
                  <div key={log.id} className="flex gap-10 border-b border-white/5 py-5 animate-reveal-left group hover:bg-white/5 px-6 rounded-2xl transition-all duration-300">
                    <span className="text-zinc-600 text-[9px] font-bold italic tracking-tighter">[{log.time}]</span>
                    <span className={`font-black text-[9px] tracking-[0.3em] min-w-15 drop-shadow-[0_0_10px_currentColor] ${
                      log.type === 'ERROR' ? 'text-red-500' : 
                      log.type === 'WARN' ? 'text-yellow-500' : 
                      log.type === 'USER' ? 'text-white' : 'text-zinc-500'
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-zinc-300 font-medium tracking-tight uppercase text-[10px] group-hover:text-white transition-colors normal-case font-sans italic">{log.message}</span>
                  </div>
                ))}
              </div>
              <div ref={scrollAnchor} />
            </div>
          </div>
        ) : (activeTab === 'solicitudes' || activeTab === 'requerimientos' || activeTab === 'proyectos') ? (
          <div className="grow p-10 overflow-y-auto custom-scrollbar animate-reveal">
            <header className="mb-14 border-l-4 border-red-500 pl-10 relative">
              <h2 className="text-4xl font-black tracking-tighter text-white italic uppercase">
                {activeTab === 'requerimientos' ? 'CLIENT_REQS' : 
                 activeTab === 'proyectos' ? 'PROJECT_NODES' : 'PENDING_PROTOCOLS'}
              </h2>
              <p className="text-zinc-500 mt-4 font-bold uppercase tracking-[0.4em] text-[10px] italic">Workflow synchronization and operational state.</p>
            </header>
            <div className="grid grid-cols-1 gap-8">
              {projectRequests
                .filter(req => {
                  if (activeTab === 'requerimientos') return req.paquete_seleccionado === 'REQUERIMIENTO_ADICIONAL';
                  if (activeTab === 'proyectos') return true;
                  return req.paquete_seleccionado !== 'REQUERIMIENTO_ADICIONAL';
                })
                .map((req, i) => (
                <div key={i} className="bg-black/50 border border-white/10 p-12 rounded-[3.5rem] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 animate-reveal hover:border-red-500/30 transition-all backdrop-blur-3xl shadow-2xl relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="grow">
                    <div className="flex items-center gap-6">
                      <span className="text-xl font-black text-white italic tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{req.proyecto_nombre}</span>
                      <span className={`text-[8px] px-5 py-2 rounded-full border font-black uppercase tracking-[0.3em] shadow-lg ${
                        req.estado === 'completado' ? 'border-zinc-500 text-zinc-300 bg-zinc-500/5' : 
                        req.estado === 'en_proceso' ? 'border-red-500 text-red-500 bg-red-500/5 animate-pulse' : 
                        'border-zinc-800 text-zinc-600 bg-zinc-800/5'
                      }`}>
                        {req.estado.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[10px] text-red-500 mt-3 font-bold italic tracking-widest uppercase opacity-70">{req.cliente_email}</p>
                    <div className="mt-8 p-8 bg-black/40 border border-white/5 rounded-[2rem] shadow-inner">
                        <p className="text-[12px] text-zinc-300 leading-relaxed font-sans italic normal-case">{req.descripcion}</p>
                    </div>
                    <div className="flex gap-8 mt-10 items-center">
                      {req.brief_url && (
                        <a href={req.brief_url} target="_blank" className="text-[9px] bg-white text-black px-8 py-3 rounded-xl font-black hover:bg-zinc-200 transition-all uppercase tracking-widest shadow-xl active:scale-95">DOWNLOAD_BRIEF_SYNC</a>
                      )}
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">PROTO_PACK:</span>
                        <span className="text-[10px] text-zinc-400 font-black uppercase italic">{req.paquete_seleccionado}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-[280px] bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <label className="text-[9px] text-zinc-500 font-black uppercase mb-4 block tracking-[0.3em] italic">MOD_FLOW_STATE</label>
                    <select 
                      disabled={updatingId === req.id}
                      value={req.estado} 
                      onChange={(e) => handleStatusChange(req.id, e.target.value)}
                      className="w-full bg-black border border-white/10 text-[10px] font-black p-5 rounded-2xl outline-none focus:border-red-500 transition-all text-white uppercase cursor-pointer hover:bg-zinc-900 shadow-inner"
                    >
                      <option value="en_revision">CORE_REVIEW</option>
                      <option value="aprobado">STAGED_OK</option>
                      <option value="en_proceso">ACTIVE_BUILD</option>
                      <option value="completado">FINALIZED_VOID</option>
                    </select>
                    {updatingId === req.id && (
                        <div className="mt-4 h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 animate-loading-bar w-1/2 shadow-[0_0_10px_red]" />
                        </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grow flex items-center justify-center text-zinc-900 tracking-[6em] font-black italic select-none opacity-10 animate-pulse">GRAVITY</div>
        )}
      </section>

      {/* SYSTEM STATUS FOOTER */}
      <footer className="absolute bottom-0 left-0 w-full p-6 border-t border-white/10 bg-black/90 backdrop-blur-3xl z-30 flex justify-between items-center shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        <div className="flex gap-14 items-center pl-4">
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,1)]" />
            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.6em] italic">
              GRAVITY_LABS_ROOT_ACCESS // © 2026
            </p>
          </div>
          <div className="hidden xl:flex gap-8 text-[8px] text-zinc-600 uppercase font-black italic tracking-widest border-l border-white/10 pl-8">
            <span className="flex items-center gap-2"><span className="text-red-500">PING:</span> 14.02ms</span>
            <span className="flex items-center gap-2"><span className="text-red-500">CORE_TEMP:</span> 34°C</span>
            <span className="flex items-center gap-2"><span className="text-red-500">TRAFFIC:</span> 1.2GB/s</span>
          </div>
        </div>
        <div className="flex items-center gap-8 pr-4">
          <span className="px-5 py-2 rounded-xl border border-white/10 text-[8px] text-zinc-400 font-black tracking-[0.4em] bg-white/5 uppercase italic">QUANTUM_ENCRYPT: ON</span>
          <span className="text-red-500 font-black text-[9px] tracking-widest drop-shadow-[0_0_5px_red]">v6.1.0_STABLE</span>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; } 
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(239,68,68,0.2); border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(239,68,68,0.5); box-shadow: 0 0 15px rgba(239,68,68,0.3); }

        @keyframes scan {
          0% { top: -5%; opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { top: 105%; opacity: 0; }
        }
        .animate-scan { animation: scan 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); filter: blur(180px); }
          50% { opacity: 0.6; transform: scale(1.1); filter: blur(220px); }
        }
        .animate-pulse-slow { animation: pulse-slow 10s ease-in-out infinite; }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -40px) rotate(2deg); }
          66% { transform: translate(-20px, 20px) rotate(-1deg); }
        }
        .animate-float { animation: float 25s ease-in-out infinite; }

        @keyframes reveal {
          from { opacity: 0; transform: translateY(30px) scale(0.95); filter: blur(15px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .animate-reveal { animation: reveal 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }

        @keyframes reveal-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-reveal-left { animation: reveal-left 0.5s ease-out forwards; }

        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-loading-bar { animation: loading-bar 2s infinite linear; }
      `}</style>
    </main>
  );
}