"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import Image from 'next/image';

/**
 * Gravity Labs - CORE ADMINISTRATION (Red Protocol) v5.0.2
 * UI Optimization: David - Enhanced contrast and color legibility.
 * Functional Integrity: CRUD, Real-time sync, and system logs maintained.
 */
export default function AdminControlPanel() {
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
   * User filtering logic based on multiple fields.
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
   * Monitoring client online status through specific channels.
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
   * Message history and real-time support listener.
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
   * Attachment management for support tickets.
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

  /**
   * Staff outgoing communication trigger.
   */
  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selectedClient) return;
    await supabase.from('mensajes_soporte').insert([{ emisor_nombre: "GRAVITY_ADMIN", contenido: reply, cliente_email: selectedClient, es_staff: true, leido: false }]);
    await logActivity('INFO', `TERMINAL_MSG: Respuesta enviada a ${selectedClient}`);
    setReply('');
  };

  return (
    <main className="flex h-screen bg-[#030000] text-red-500 font-mono uppercase italic text-[10px] overflow-hidden relative selection:bg-red-950/40">
      
      {/* SYSTEM SCANNER AND DYNAMIC NEBULA DECORATION */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-red-600/30 shadow-[0_0_25px_red] animate-scan z-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(50,0,0,0.1)_0%,transparent_70%)] animate-pulse-slow" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-200 contrast-150" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full animate-float" />
      </div>

      <aside className="w-20 lg:w-64 border-r border-red-900/30 bg-black/40 backdrop-blur-xl flex flex-col items-center lg:items-start p-6 relative z-10 shadow-[20px_0_50px_rgba(0,0,0,0.8)]">
        <div className="mb-12 relative group cursor-crosshair">
          <div className="absolute inset-0 bg-red-600 blur-2xl opacity-10 group-hover:opacity-50 transition-all duration-700 scale-150" />
          <Image src="/logo.png" alt="Gravity" width={30} height={30} className="relative grayscale brightness-200 contrast-150 group-hover:rotate-180 transition-transform duration-1000" />
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
              className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all relative group overflow-hidden
                ${activeTab === item.id ? 'bg-red-600/20 border border-red-500/40 text-red-400 shadow-[0_0_20px_rgba(220,38,38,0.15)]' : 'text-red-900/60 hover:text-red-500 hover:bg-white/5'}`}
            >
              <span className={`text-lg transition-transform group-hover:scale-125 ${activeTab === item.id ? 'animate-pulse' : ''}`}>{item.icon}</span>
              <span className="hidden lg:block font-black tracking-[0.2em]">{item.label}</span>
              {activeTab === item.id && (
                <div className="absolute left-0 w-1 h-full bg-red-600 shadow-[2px_0_10px_red]" />
              )}
            </button>
          ))}
        </nav>
      </aside>

      <section className="grow flex flex-row overflow-hidden relative z-10">
        
        {/* TAB: SERVICES */}
        {activeTab === 'servicios' ? (
          <div className="grow p-10 overflow-y-auto custom-scrollbar animate-reveal">
            <header className="mb-10 border-l-4 border-red-600 pl-6 relative">
              <div className="absolute -left-1 top-0 h-full w-4 bg-red-600/10 blur-md" />
              <h2 className="text-2xl font-black tracking-[0.5em] text-red-500 italic">SERVICIOS</h2>
              <p className="text-red-400 mt-2 font-bold uppercase tracking-widest text-[8px]">Control en tiemop real de servicios publicados.</p>
            </header>

            {editingServiceId && (
              <div className="mb-10 p-8 border border-red-600/40 rounded-3xl bg-red-950/20 grid grid-cols-1 md:grid-cols-3 gap-6 animate-reveal">
                <div className="flex flex-col gap-2">
                  <label className="text-[7px] text-red-400 font-black">ID_NOMENCLATURA</label>
                  <input value={serviceData.nombre} onChange={e => setServiceData({...serviceData, nombre: e.target.value})} className="bg-black border border-red-900/40 p-4 rounded-xl text-[9px] outline-none focus:border-red-500 transition-all text-red-400" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[7px] text-red-400 font-black">USD_VALUATION</label>
                  <input value={serviceData.precio} onChange={e => setServiceData({...serviceData, precio: e.target.value})} className="bg-black border border-red-900/40 p-4 rounded-xl text-[9px] outline-none focus:border-red-500 transition-all text-red-400" />
                </div>
                <div className="flex items-end gap-2">
                   <button onClick={() => handleUpdateService(editingServiceId)} className="grow bg-red-600 text-black p-4 rounded-xl font-black text-[9px] hover:bg-white transition-all uppercase">
                    {updatingId ? 'SYNC_IN_PROGRESS...' : 'OVERWRITE_KERNEL'}
                   </button>
                   <button onClick={() => setEditingServiceId(null)} className="p-4 bg-red-900/20 rounded-xl text-red-500 hover:bg-red-500 hover:text-black transition-all">✕</button>
                </div>
                <div className="md:col-span-3 flex flex-col gap-2">
                  <label className="text-[7px] text-red-400 font-black">TECHNICAL_SPECS</label>
                  <textarea value={serviceData.descripcion} onChange={e => setServiceData({...serviceData, descripcion: e.target.value})} className="bg-black border border-red-900/40 p-4 rounded-xl text-[9px] outline-none h-20 normal-case font-sans focus:border-red-500 transition-all text-gray-300" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicesList.map((service, i) => (
                <div key={i} className="bg-black/60 border border-red-900/30 p-8 rounded-3xl hover:border-red-500/50 transition-all group relative overflow-hidden backdrop-blur-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 blur-3xl -mr-12 -mt-12 group-hover:bg-red-600/20 transition-all" />
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { 
                      setEditingServiceId(service.id); 
                      setServiceData({ nombre: service.nombre, precio: service.precio, descripcion: service.descripcion, is_active: service.is_active });
                    }} className="text-red-400 bg-red-950 p-2 rounded-lg border border-red-900/40 hover:bg-red-600 hover:text-black transition-all">✎</button>
                  </div>
                  <span className="text-[7px] text-red-500/60 font-black tracking-[0.3em] italic uppercase">{service.categoria}</span>
                  <h3 className="text-sm font-black text-white mt-2 group-hover:text-red-500 transition-colors tracking-tighter uppercase">{service.nombre}</h3>
                  <div className="my-6 flex items-end">
                    <span className="text-3xl font-black text-red-600 leading-none group-hover:scale-110 transition-transform origin-left">${service.precio}</span>
                    <span className="text-[8px] text-red-400 font-black ml-2 mb-1">USD_UNIT</span>
                  </div>
                  <p className="text-[9px] text-gray-300 leading-relaxed italic normal-case font-sans line-clamp-3 mb-6 border-l border-red-900/40 pl-4">
                    {service.descripcion}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${service.is_active ? 'bg-red-500 shadow-[0_0_15px_red] animate-pulse' : 'bg-gray-800'}`} />
                    <span className="text-[7px] text-red-500 font-black tracking-widest uppercase">{service.is_active ? 'ACTIVE_DEPLO' : 'SYSTEM_HALT'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'soporte' ? (
          <>
            <div className="w-80 border-r border-red-900/30 bg-black/20 backdrop-blur-md flex flex-col relative">
              <div className="absolute inset-0 bg-gradient-to-b from-red-600/5 to-transparent pointer-events-none" />
              <header className="p-8 border-b border-red-900/20 relative z-10">
                <h2 className="text-red-500 font-black tracking-[0.3em] text-[9px] uppercase flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
                  SOPORTE ACTIVO
                </h2>
              </header>
              <div className="grow overflow-y-auto custom-scrollbar z-10">
                {chats.map((chat) => (
                  <button
                    key={chat.cliente_email}
                    onClick={() => setSelectedClient(chat.cliente_email)}
                    className={`w-full p-6 text-left border-b border-red-900/10 transition-all relative group ${selectedClient === chat.cliente_email ? 'bg-red-600/15' : 'hover:bg-white/5'}`}
                  >
                    <div className="flex justify-between items-center">
                      <p className={`font-black tracking-tighter uppercase ${selectedClient === chat.cliente_email ? 'text-red-400' : 'text-red-900/80'}`}>{chat.emisor_nombre}</p>
                      <div className="flex items-center gap-2">
                        {onlineUsers[chat.cliente_email.toLowerCase()] ? (
                          <span className="text-[6px] text-red-400 font-black animate-pulse bg-red-950/40 px-2 py-0.5 rounded border border-red-500/30">LIVE</span>
                        ) : (
                          <span className="text-[6px] text-red-900/40 font-black uppercase">Idle</span>
                        )}
                        {!chat.es_staff && !chat.leido && (
                          <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_20px_red]" />
                        )}
                      </div>
                    </div>
                    <p className="text-[8px] text-red-400/50 mt-1 lowercase italic font-bold tracking-tight">{chat.cliente_email}</p>
                    {selectedClient === chat.cliente_email && <div className="absolute right-0 top-0 w-1 h-full bg-red-600 shadow-[-5px_0_20px_red]" />}
                  </button>
                ))}
              </div>
            </div>
            <div className="grow flex flex-col bg-[#020000] relative">
              {selectedClient ? (
                <>
                  <header className="p-8 border-b border-red-900/30 bg-black/80 backdrop-blur-2xl z-20 flex justify-between items-center shadow-2xl">
                    <h3 className="text-xs font-black italic tracking-widest uppercase">Uplink: <span className="text-red-500 ml-2 animate-pulse">{selectedClient}</span></h3>
                    <div className="flex items-center gap-4">
                      {onlineUsers[selectedClient.toLowerCase()] ? (
                        <div className="flex items-center gap-3">
                          <div className="h-1 w-20 bg-red-950 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600 w-2/3 animate-loading-bar" />
                          </div>
                          <span className="px-4 py-2 bg-red-600 text-black text-[8px] font-black rounded-lg tracking-widest uppercase">Stable_Connection</span>
                        </div>
                      ) : (
                        <span className="px-4 py-2 border border-red-900/40 text-[8px] font-black rounded-lg text-red-400/60 tracking-widest uppercase">OFFLINE</span>
                      )}
                    </div>
                  </header>
                  <div className="grow p-10 overflow-y-auto space-y-8 custom-scrollbar bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.05)_0%,transparent_60%)]">
                    {messages.map((m, i) => (
                      <div key={i} className={`flex flex-col ${m.es_staff ? 'items-end' : 'items-start'} animate-reveal`}>
                        <span className="text-[7px] text-red-400/60 mb-2 uppercase tracking-[0.3em] font-black italic">{m.es_staff ? 'DAVID_ADMIN' : m.emisor_nombre}</span>
                        <div className={`max-w-md p-5 rounded-2xl border transition-all duration-500 ${m.es_staff ? 'bg-red-600 text-black font-black rounded-tr-none border-transparent shadow-[0_10px_40px_rgba(220,38,38,0.25)] hover:scale-[1.02]' : 'bg-black/80 backdrop-blur-sm border-red-900/50 text-red-400 rounded-tl-none shadow-[0_15px_30px_rgba(0,0,0,0.8)]'}`}>
                          {m.contenido.startsWith('[IMAGE]:') ? (
                            <img src={m.contenido.replace('[IMAGE]:', '')} className="rounded-lg max-h-80 border border-red-900/30" alt="Buffer" />
                          ) : m.contenido.startsWith('[FILE]:') ? (
                            <a href={m.contenido.split('|')[1]} target="_blank" className="flex items-center gap-4 p-4 bg-black/40 rounded-xl italic border border-red-900/30 hover:border-red-500 transition-all">
                              <span className="text-xl">📁</span>
                              <div className="flex flex-col">
                                <span className="text-[9px] underline font-black">{m.contenido.split('|')[0].replace('[FILE]:', '')}</span>
                                <span className="text-[7px] text-red-400 uppercase font-black">External_Data_Link</span>
                              </div>
                            </a>
                          ) : (
                            <span className="normal-case font-sans font-semibold tracking-tight leading-relaxed text-xs italic">{m.contenido}</span>
                          )}
                          {m.es_staff && (
                            <div className="flex justify-end mt-2">
                              <span className={`text-[8px] ${m.leido ? 'text-black' : 'text-black/40'}`}>{m.leido ? 'ACK_RECEIVED' : 'SENT'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={scrollAnchor} />
                  </div>
                  <form onSubmit={sendReply} className="p-8 bg-black/90 border-t border-red-900/30 backdrop-blur-3xl relative z-20">
                    <div className="flex items-center gap-4 bg-[#080000] border border-red-900/40 rounded-2xl p-3 focus-within:border-red-500 focus-within:shadow-[0_0_30px_rgba(220,38,38,0.1)] transition-all">
                      <label className={`cursor-pointer p-4 rounded-xl hover:bg-red-600 hover:text-black transition-all group ${uploading ? 'animate-pulse' : ''}`}>
                        <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                        <span className="text-xl">{uploading ? '...' : '📎'}</span>
                      </label>
                      <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="INYECTAR COMANDO DE RESPUESTA..." className="grow bg-transparent p-4 text-[11px] outline-none normal-case font-sans font-bold text-red-400 placeholder:text-red-900/40" />
                      <button className="px-10 py-4 bg-red-600 text-black font-black text-[10px] rounded-xl active:scale-95 shadow-[0_5px_20px_rgba(220,38,38,0.4)] hover:bg-white transition-all uppercase tracking-widest">Execute</button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="grow flex items-center justify-center text-red-900/10 tracking-[3em] font-black italic select-none animate-pulse-slow">AWAITING_UPLINK</div>
              )}
            </div>
          </>
        ) : activeTab === 'usuarios' ? (
          <div className="grow p-10 overflow-y-auto custom-scrollbar animate-reveal">
            <header className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-l-4 border-red-600 pl-8 relative">
              <div className="absolute -left-1 top-0 h-full w-4 bg-red-600/10 blur-md" />
              <div>
                <h2 className="text-3xl font-black tracking-[0.2em] text-red-500 italic uppercase">USUARIOS</h2>
                <div className="flex gap-6 items-center mt-4">
                  <button 
                    onClick={() => { setIsCreating(!isCreating); setEditingUserId(null); setUserData({ nombre: '', email: '', telefono: '', rol: 'cliente' }); }}
                    className="bg-red-600 text-black px-6 py-3 rounded-xl text-[9px] font-black hover:bg-white transition-all shadow-lg uppercase tracking-widest"
                  >
                    {isCreating ? 'HALT_CREATION' : '＋ CREATE_NODE'}
                  </button>
                  <p className="text-red-400 mt-2 font-bold uppercase tracking-widest text-[8px]">Indexación de usuarios en la base de datos.</p>
                </div>
              </div>
              <div className="relative w-full lg:w-120 group">
                <input 
                  type="text"
                  placeholder="FILTER BY ID / EMAIL / PHONE..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/40 border border-red-900/40 rounded-xl p-5 pl-12 text-[10px] font-black outline-none focus:border-red-500 transition-all placeholder:text-red-900/40 text-red-400 group-hover:bg-black/80"
                />
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-red-600 opacity-40 text-lg group-hover:scale-110 transition-transform">🔍</span>
              </div>
            </header>

            {(isCreating || editingUserId) && (
              <div className="mb-12 p-10 border border-red-600/40 rounded-[2.5rem] bg-red-950/20 grid grid-cols-1 md:grid-cols-4 gap-6 animate-reveal">
                <div className="flex flex-col gap-2">
                  <label className="text-[7px] text-red-400 font-black uppercase">Identity_Name</label>
                  <input placeholder="NOMBRE" value={userData.nombre || ''} onChange={e => setUserData({...userData, nombre: e.target.value})} className="bg-black border border-red-900/40 p-5 rounded-xl text-[10px] outline-none text-red-400 focus:border-red-500 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[7px] text-red-400 font-black uppercase">Email_Port</label>
                  <input placeholder="EMAIL" value={userData.email || ''} onChange={e => setUserData({...userData, email: e.target.value})} className="bg-black border border-red-900/40 p-5 rounded-xl text-[10px] outline-none text-red-400 focus:border-red-500 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[7px] text-red-400 font-black uppercase">Phone_Link</label>
                  <input placeholder="TELÉFONO" value={userData.telefono || ''} onChange={e => setUserData({...userData, telefono: e.target.value})} className="bg-black border border-red-900/40 p-5 rounded-xl text-[10px] outline-none text-red-400 focus:border-red-500 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[7px] text-red-400 font-black uppercase">Auth_Level</label>
                  <div className="flex gap-3">
                    <select value={userData.rol || 'cliente'} onChange={e => setUserData({...userData, rol: e.target.value})} className="grow bg-black border border-red-900/40 p-5 rounded-xl text-[10px] outline-none uppercase text-red-400 cursor-pointer">
                      <option value="cliente">CLIENTE</option>
                      <option value="staff">STAFF</option>
                      <option value="disabled">REVOCADO</option>
                    </select>
                    <button onClick={editingUserId ? () => handleUpdateUser(editingUserId) : handleCreateUser} className="bg-red-600 text-black px-8 rounded-xl font-black text-[10px] hover:bg-white transition-all">
                      {editingUserId ? 'OVERWRITE' : 'COMMIT'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredUsers.map((user, i) => (
                <div key={i} className={`bg-black/60 border border-red-900/30 p-8 rounded-4xl hover:border-red-500/50 transition-all group relative overflow-hidden backdrop-blur-sm ${user.rol === 'disabled' ? 'opacity-30 grayscale' : ''} hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]`}>
                  <div className="absolute top-0 right-0 p-5 flex gap-3 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => { setEditingUserId(user.id); setUserData({ nombre: user.nombre || '', email: user.email || '', telefono: user.telefono || '', rol: user.rol || 'cliente' }); setIsCreating(false); }} className="text-red-400 bg-red-950 p-2 rounded-lg border border-red-900/40 hover:bg-red-500 hover:text-black transition-all">✎</button>
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 bg-red-950 p-2 rounded-lg border border-red-900/40 hover:bg-red-600 hover:text-black transition-all">✕</button>
                  </div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-red-950/40 border border-red-500/40 rounded-full flex items-center justify-center text-red-500 font-black text-lg italic shadow-[0_0_15px_rgba(255,0,0,0.3)] group-hover:scale-110 transition-transform">
                      {user.nombre?.charAt(0) || 'N'}
                    </div>
                    <span className={`text-[7px] font-black tracking-[0.4em] uppercase px-3 py-1 rounded-full border ${user.rol === 'staff' ? 'border-red-500 bg-red-950/60 text-red-400 shadow-[0_0_10px_red]' : 'border-red-900/40 text-red-900'}`}>
                      {user.rol || 'CLIENTE'}
                    </span>
                  </div>
                  <p className="text-sm font-black text-white mb-2 group-hover:text-red-500 transition-colors uppercase tracking-tight italic">{user.nombre || "ID_PENDING"}</p>
                  <p className="text-[9px] text-red-400/60 font-bold lowercase italic mb-8 border-b border-red-900/20 pb-4">{user.email}</p>
                  <div className="grow space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[7px] text-red-500/60 font-black uppercase">Comm_Link:</span>
                      <span className="text-[8px] text-gray-300 font-bold">{user.telefono || "NULL"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[7px] text-red-500/60 font-black uppercase">Reg_Stamp:</span>
                      <span className="text-[8px] text-gray-300 font-bold">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'sistema' ? (
          <div className="grow p-10 overflow-hidden flex flex-col animate-reveal">
            <header className="mb-8 flex justify-between items-end border-b border-red-900/30 pb-6 relative">
              <div className="absolute bottom-0 left-0 w-40 h-1 bg-red-600/40 blur-sm" />
              <div>
                <h2 className="text-2xl font-black tracking-[0.5em] text-red-500 italic uppercase">CONSOLE LOGS</h2>
                <p className="text-red-400 mt-2 font-bold uppercase tracking-widest text-[8px]">Auditoría de bajo nivel en tiempo real.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]" />
                <div className="text-[9px] text-red-500 font-black tracking-widest uppercase italic">Persistence_Core: Active</div>
              </div>
            </header>
            <div className="grow bg-black/40 border border-red-900/30 rounded-3xl p-10 overflow-y-auto custom-scrollbar font-mono relative backdrop-blur-sm shadow-inner">
              <div className="absolute top-4 right-8 text-[8px] text-red-900/10 font-black tracking-[1em] rotate-90 origin-right select-none">GRAVITY_KERNEL_V5</div>
              <div className="space-y-4">
                {systemLogs.map((log) => (
                  <div key={log.id} className="flex gap-6 border-b border-red-900/10 py-3 animate-reveal-left group hover:bg-red-600/10 transition-colors px-4 rounded-lg">
                    <span className="text-red-400/40 text-[9px] font-bold">[{log.time}]</span>
                    <span className={`font-black text-[9px] tracking-widest min-w-15 ${
                      log.type === 'ERROR' ? 'text-red-500 shadow-[0_0_10px_red]' : 
                      log.type === 'WARN' ? 'text-yellow-500' : 
                      log.type === 'USER' ? 'text-blue-400' : 'text-green-400'
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-gray-300 italic font-medium tracking-tight group-hover:text-red-500 transition-colors uppercase text-[9px]">{log.message}</span>
                  </div>
                ))}
              </div>
              <div ref={scrollAnchor} />
            </div>
          </div>
        ) : (activeTab === 'solicitudes' || activeTab === 'requerimientos' || activeTab === 'proyectos') ? (
          <div className="grow p-10 overflow-y-auto custom-scrollbar animate-reveal">
            <header className="mb-12 border-l-4 border-red-600 pl-8 relative">
              <div className="absolute -left-1 top-0 h-full w-4 bg-red-600/10 blur-md" />
              <h2 className="text-3xl font-black tracking-[0.2em] text-red-500 italic uppercase">
                {activeTab === 'requerimientos' ? 'REQUERIMIENTOS' : 
                 activeTab === 'proyectos' ? 'PROYECTOS' : 'New_Contract_Queue'}
              </h2>
              <p className="text-red-400 mt-3 font-bold uppercase tracking-widest text-[9px]">Monitoreo de flujo de trabajo y estados de ejecución.</p>
            </header>
            <div className="grid grid-cols-1 gap-6">
              {projectRequests
                .filter(req => {
                  if (activeTab === 'requerimientos') return req.paquete_seleccionado === 'REQUERIMIENTO_ADICIONAL';
                  if (activeTab === 'proyectos') return true;
                  return req.paquete_seleccionado !== 'REQUERIMIENTO_ADICIONAL';
                })
                .map((req, i) => (
                <div key={i} className="bg-black/40 border border-red-900/30 p-8 rounded-[2.5rem] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 animate-reveal hover:border-red-500/50 transition-all backdrop-blur-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
                  <div className="grow">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-black text-white italic tracking-tighter uppercase">{req.proyecto_nombre}</span>
                      <span className={`text-[7px] px-3 py-1 rounded-full border font-black uppercase tracking-widest ${
                        req.estado === 'completado' ? 'border-green-500 text-green-400 bg-green-950/40 shadow-[0_0_10px_rgba(0,255,0,0.2)]' : 
                        req.estado === 'en_proceso' ? 'border-blue-500 text-blue-400 bg-blue-950/40 shadow-[0_0_10px_rgba(0,0,255,0.2)]' : 
                        'border-red-500 text-red-400 bg-red-950/40 shadow-[0_0_10px_rgba(255,0,0,0.2)] animate-pulse'
                      }`}>
                        {req.estado.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[9px] text-red-400/60 mt-2 font-bold italic tracking-tight uppercase border-b border-red-900/20 pb-2 mb-4 w-fit">{req.cliente_email}</p>
                    <p className="text-[10px] text-gray-300 mt-4 leading-relaxed max-w-2xl font-sans italic border-l border-red-900/30 pl-6 normal-case">{req.descripcion}</p>
                    <div className="flex gap-6 mt-6">
                      {req.brief_url && (
                        <a href={req.brief_url} target="_blank" className="text-[8px] bg-red-600 text-black px-4 py-2 rounded-lg font-black hover:bg-white transition-all uppercase tracking-widest shadow-[0_5px_15px_rgba(220,38,38,0.3)]">Open_Brief_Data ↗</a>
                      )}
                      <span className="text-[8px] text-red-400 font-black uppercase flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-600 rounded-full animate-ping" />
                        Class: {req.paquete_seleccionado}
                      </span>
                    </div>
                  </div>
                  <div className="w-full lg:w-64">
                    <label className="text-[7px] text-red-400 font-black uppercase mb-2 block tracking-widest">Update_Status</label>
                    <select 
                      disabled={updatingId === req.id}
                      value={req.estado} 
                      onChange={(e) => handleStatusChange(req.id, e.target.value)}
                      className="w-full bg-black/80 border border-red-900/40 text-[10px] font-black p-5 rounded-xl outline-none focus:border-red-500 transition-all text-red-400 uppercase cursor-pointer"
                    >
                      <option value="en_revision">STATUS_REVISION</option>
                      <option value="aprobado">STATUS_APROBADO</option>
                      <option value="en_proceso">STATUS_PROCESO</option>
                      <option value="completado">STATUS_COMPLETADO</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grow flex items-center justify-center text-red-900/5 tracking-[5em] font-black italic select-none animate-pulse-slow">GRAVITY_NUCLEUS</div>
        )}
      </section>

      {/* TECHNICAL FOOTER WITH STATUS INDICATOR */}
      <footer className="absolute bottom-0 left-0 w-full p-4 border-t border-red-900/20 bg-black/90 backdrop-blur-2xl z-30 flex justify-between items-center shadow-[0_-20px_50px_rgba(0,0,0,0.9)]">
        <div className="flex gap-10 items-center">
          <p className="text-[8px] text-red-400 font-black uppercase tracking-[0.6em] italic flex items-center gap-3">
            <span className="w-2 h-2 bg-red-600 rounded-full shadow-[0_0_10px_red] animate-pulse" />
            COPYRIGHT 2026 | GRAVITY LABS ROOT | Core_v5.0.4
          </p>
          <div className="hidden md:flex gap-4 text-[7px] text-red-400/50 uppercase font-black">
            <span className="animate-pulse text-red-500">Lat: 12ms</span>
            <span className="text-red-500">Buff: 100%</span>
            <span className="text-red-500">Prot: SSL_RED</span>
          </div>
        </div>
        <div className="flex items-center gap-8 text-[8px] uppercase tracking-widest font-black text-red-400/40">
          <span className="text-red-900/60 animate-pulse">Encryption: AES-256-KRNL</span>
          <span className="text-red-400 bg-red-950/60 px-4 py-1.5 rounded-full border border-red-500/30 shadow-[0_0_15px_rgba(255,0,0,0.15)]">SECURE_SERVER</span>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; } 
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #7f1d1d; border-radius: 10px; box-shadow: inset 0 0 5px rgba(0,0,0,0.5); }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ef4444; }

        @keyframes scan {
          0% { top: -10%; opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { top: 110%; opacity: 0; }
        }
        .animate-scan { animation: scan 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }

        @keyframes reveal {
          from { opacity: 0; transform: translateY(20px) scale(0.98); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .animate-reveal { animation: reveal 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }

        @keyframes reveal-left {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-reveal-left { animation: reveal-left 0.4s ease-out forwards; }

        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar { animation: loading-bar 3s infinite linear; }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -20px); }
        }
        .animate-float { animation: float 15s ease-in-out infinite; }
      `}</style>
    </main>
  );
}