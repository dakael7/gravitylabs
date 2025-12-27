"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import Image from 'next/image';

/**
 * Gravity Labs - CORE ADMINISTRATION (Red Protocol) v4.9.2
 * David: Consola con protocolo de presencia, logs PERSISTENTES y auditoría de cambios.
 * UPDATE: Unificación de lógica de proyectos para visualización y modificación global.
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
   * David: PROTOCOLO DE PERSISTENCIA DE LOGS (DB + LOCAL)
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
   * David: CARGA Y GESTIÓN DE SERVICIOS
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
   * PROTOCOLO DE AUTO-SCROLL
   */
  useEffect(() => {
    if (scrollAnchor.current) {
      scrollAnchor.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, systemLogs]);

  /**
   * David: ESCUCHA DE CAMBIOS EN BASE DE DATOS Y CARGA DE HISTÓRICO
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
   * PROTOCOLO DE PRESENCIA STAFF
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
   * 1. Cargar datos globales y presencia
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
   * David: Cargar Directorio de Usuarios
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
   * David: Gestión CRUD Usuarios
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
   * David: Gestión de Status de Proyectos
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
   * David: Filtro de búsqueda
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
   * RASTREO DE CLIENTES ONLINE
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
   * 2. Cargar mensajes
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
   * 3. Gestión de Adjuntos
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
   * 4. Envío de respuesta Staff
   */
  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selectedClient) return;
    await supabase.from('mensajes_soporte').insert([{ emisor_nombre: "GRAVITY_ADMIN", contenido: reply, cliente_email: selectedClient, es_staff: true, leido: false }]);
    await logActivity('INFO', `TERMINAL_MSG: Respuesta enviada a ${selectedClient}`);
    setReply('');
  };

  return (
    <main className="flex h-screen bg-[#050000] text-white font-mono uppercase italic text-[10px] overflow-hidden">
      
      <aside className="w-20 lg:w-64 border-r border-red-900/20 bg-[#080000] flex flex-col items-center lg:items-start p-6">
        <div className="mb-12 relative group">
          <div className="absolute inset-0 bg-red-600 blur-xl opacity-20" />
          <Image src="/logo.png" alt="Gravity" width={30} height={30} className="relative grayscale brightness-200" />
        </div>
        <nav className="flex flex-col gap-4 w-full">
          {['soporte', 'servicios', 'requerimientos', 'proyectos', 'usuarios', 'sistema'].map((id) => (
            <button key={id} onClick={() => setActiveTab(id as any)} className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${activeTab === id ? 'bg-red-600 text-white' : 'text-gray-600 hover:text-red-400'}`}>
              <span className="text-lg">
                {id === 'soporte' ? '◈' : id === 'servicios' ? '⌬' : id === 'requerimientos' ? '⧇' : id === 'proyectos' ? '▣' : id === 'usuarios' ? '⧇' : '▦'}
              </span>
              <span className="hidden lg:block font-black tracking-widest">{id}</span>
            </button>
          ))}
        </nav>
      </aside>

      <section className="flex-grow flex flex-row overflow-hidden">
        {activeTab === 'servicios' ? (
          <div className="flex-grow p-10 overflow-y-auto custom-scrollbar">
            <header className="mb-10">
              <h2 className="text-lg font-black tracking-[0.5em] text-red-500 italic">NÚCLEO_DE_SERVICIOS</h2>
              <p className="text-gray-600 mt-2">Control maestro de precios y despliegues en vivo</p>
            </header>

            {editingServiceId && (
              <div className="mb-10 p-8 border border-red-600/30 rounded-[2rem] bg-red-600/5 grid grid-cols-1 md:grid-cols-3 gap-4 animate-reveal">
                <div className="flex flex-col gap-2">
                  <label className="text-[7px] text-red-500">NOMBRE_DEL_SERVICIO</label>
                  <input value={serviceData.nombre} onChange={e => setServiceData({...serviceData, nombre: e.target.value})} className="bg-black/40 border border-red-900/20 p-4 rounded-xl text-[9px] outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[7px] text-red-500">INVERSIÓN_USD</label>
                  <input value={serviceData.precio} onChange={e => setServiceData({...serviceData, precio: e.target.value})} className="bg-black/40 border border-red-900/20 p-4 rounded-xl text-[9px] outline-none" />
                </div>
                <div className="flex items-end gap-2">
                   <button onClick={() => handleUpdateService(editingServiceId)} className="flex-grow bg-red-600 p-4 rounded-xl font-black text-[9px] hover:bg-red-500 transition-all">
                    {updatingId ? 'SINCRONIZANDO...' : 'ACTUALIZAR_NÚCLEO'}
                   </button>
                   <button onClick={() => setEditingServiceId(null)} className="p-4 bg-white/5 rounded-xl text-gray-500">✕</button>
                </div>
                <div className="md:col-span-3 flex flex-col gap-2">
                  <label className="text-[7px] text-red-500">DESCRIPCIÓN_TÉCNICA</label>
                  <textarea value={serviceData.descripcion} onChange={e => setServiceData({...serviceData, descripcion: e.target.value})} className="bg-black/40 border border-red-900/20 p-4 rounded-xl text-[9px] outline-none h-20 normal-case font-sans" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesList.map((service, i) => (
                <div key={i} className="bg-[#050000] border border-red-900/20 p-8 rounded-[2rem] hover:border-red-600/40 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { 
                      setEditingServiceId(service.id); 
                      setServiceData({ nombre: service.nombre, precio: service.precio, descripcion: service.descripcion, is_active: service.is_active });
                    }} className="text-red-500 bg-red-500/10 p-2 rounded-full hover:bg-red-500 hover:text-white transition-all">✎</button>
                  </div>
                  <span className="text-[7px] text-gray-700 font-black tracking-widest">{service.categoria}</span>
                  <h3 className="text-xs font-black text-white mt-2 group-hover:text-red-400 transition-colors">{service.nombre}</h3>
                  <div className="my-6">
                    <span className="text-2xl font-black text-red-600">${service.precio}</span>
                    <span className="text-[8px] text-gray-600 ml-2">USD_MIN</span>
                  </div>
                  <p className="text-[8px] text-gray-500 leading-relaxed italic normal-case font-sans line-clamp-3 mb-6">
                    {service.descripcion}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className={`w-1 h-1 rounded-full ${service.is_active ? 'bg-green-500 shadow-[0_0_5px_green]' : 'bg-red-500'}`} />
                    <span className="text-[6px] text-gray-700">{service.is_active ? 'DESPLIEGUE_ACTIVO' : 'SISTEMA_OFFLINE'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'soporte' ? (
          <>
            <div className="w-80 border-r border-red-900/10 bg-[#030000] flex flex-col">
              <header className="p-8 border-b border-red-900/10">
                <h2 className="text-red-500 font-black tracking-widest">Canales_Activos</h2>
              </header>
              <div className="flex-grow overflow-y-auto">
                {chats.map((chat) => (
                  <button
                    key={chat.cliente_email}
                    onClick={() => setSelectedClient(chat.cliente_email)}
                    className={`w-full p-6 text-left border-b border-red-900/5 transition-all relative ${selectedClient === chat.cliente_email ? 'bg-red-900/10 border-r-2 border-red-600' : ''}`}
                  >
                    <div className="flex justify-between items-center">
                      <p className={`font-bold ${selectedClient === chat.cliente_email ? 'text-red-400' : 'text-gray-400'}`}>{chat.emisor_nombre}</p>
                      <div className="flex items-center gap-2">
                        {onlineUsers[chat.cliente_email.toLowerCase()] ? (
                          <span className="text-[6px] text-green-500 font-black animate-pulse">ONLINE</span>
                        ) : (
                          <span className="text-[6px] text-gray-800">OFFLINE</span>
                        )}
                        {!chat.es_staff && !chat.leido && (
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,1)]" />
                        )}
                      </div>
                    </div>
                    <p className="text-[7px] text-gray-600 mt-1 lowercase italic">{chat.cliente_email}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-grow flex flex-col bg-[#020000] relative">
              {selectedClient ? (
                <>
                  <header className="p-8 border-b border-red-900/10 backdrop-blur-md z-10 flex justify-between items-center">
                    <h3 className="text-sm font-black italic tracking-tighter">Terminal: <span className="text-red-500">{selectedClient}</span></h3>
                    {onlineUsers[selectedClient.toLowerCase()] ? (
                      <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-[7px] font-black rounded-full text-green-500 animate-pulse">CONEXIÓN_ESTABLE // ONLINE</span>
                    ) : (
                      <span className="px-3 py-1 bg-white/5 border border-white/10 text-[7px] font-black rounded-full text-gray-700">MODO_ESPERA // OFFLINE</span>
                    )}
                  </header>
                  <div className="flex-grow p-10 overflow-y-auto space-y-6 custom-scrollbar">
                    {messages.map((m, i) => (
                      <div key={i} className={`flex flex-col ${m.es_staff ? 'items-end' : 'items-start'} animate-reveal`}>
                        <span className="text-[7px] text-gray-700 mb-1 uppercase tracking-widest">{m.es_staff ? 'GRAVITY_ADMIN' : m.emisor_nombre}</span>
                        <div className={`max-w-md p-4 rounded-2xl ${m.es_staff ? 'bg-red-600 text-white font-bold rounded-tr-none' : 'bg-white/5 border border-white/10 text-gray-300'}`}>
                          {m.contenido.startsWith('[IMAGE]:') ? <img src={m.contenido.replace('[IMAGE]:', '')} className="rounded-lg max-h-60" /> : m.contenido.startsWith('[FILE]:') ? <a href={m.contenido.split('|')[1]} target="_blank" className="flex items-center gap-3 p-2 bg-black/20 rounded-lg italic"><span>📄</span><span className="text-[9px] underline">{m.contenido.split('|')[0].replace('[FILE]:', '')}</span></a> : <span className="normal-case font-sans font-medium tracking-normal leading-relaxed">{m.contenido}</span>}
                          {m.es_staff && <div className="flex justify-end mt-1"><span className={`text-[8px] ${m.leido ? 'text-white' : 'text-white/40'}`}>{m.leido ? '✓✓' : '✓'}</span></div>}
                        </div>
                      </div>
                    ))}
                    <div ref={scrollAnchor} />
                  </div>
                  <form onSubmit={sendReply} className="p-8 bg-[#050000] border-t border-red-900/20">
                    <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-2 px-4 focus-within:border-red-600/40 transition-all">
                      <label className={`cursor-pointer p-3 rounded-xl hover:bg-red-600/10 ${uploading ? 'animate-pulse' : ''}`}><input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} /><span className="text-lg text-red-500">{uploading ? '...' : '📎'}</span></label>
                      <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Escribir mensaje maestro..." className="flex-grow bg-transparent p-3 text-xs outline-none normal-case font-sans" />
                      <button className="px-6 py-3 bg-red-600 text-white font-black text-[9px] rounded-xl active:scale-95 shadow-lg">ENVIAR</button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-grow flex items-center justify-center text-red-900/10 tracking-[2em] font-black italic">SELECCIONAR_TERMINAL</div>
              )}
            </div>
          </>
        ) : activeTab === 'usuarios' ? (
          <div className="flex-grow p-10 overflow-y-auto custom-scrollbar">
            <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <h2 className="text-lg font-black tracking-[0.5em] text-red-500 italic">DIRECTORIO_DE_CLIENTES</h2>
                <div className="flex gap-4 items-center mt-2">
                  <button 
                    onClick={() => { setIsCreating(!isCreating); setEditingUserId(null); setUserData({ nombre: '', email: '', telefono: '', rol: 'cliente' }); }}
                    className="bg-red-600 px-4 py-2 rounded-lg text-[8px] font-black hover:bg-red-500 transition-colors"
                  >
                    {isCreating ? 'CANCELAR_CREACIÓN' : '＋ CREAR_NUEVO_USUARIO'}
                  </button>
                  <p className="text-gray-600">Base de datos de usuarios registrados en el núcleo</p>
                </div>
              </div>
              <div className="relative w-full lg:w-96">
                <input 
                  type="text"
                  placeholder="BUSCAR NOMBRE, EMAIL O TEL..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-red-900/5 border border-red-900/20 rounded-xl p-4 pl-10 text-[9px] font-black outline-none focus:border-red-600 transition-all placeholder:text-red-900/40"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600 opacity-40">🔍</span>
              </div>
            </header>

            {(isCreating || editingUserId) && (
              <div className="mb-10 p-8 border border-red-600/30 rounded-[2rem] bg-red-600/5 grid grid-cols-1 md:grid-cols-4 gap-4 animate-reveal">
                <input placeholder="NOMBRE" value={userData.nombre || ''} onChange={e => setUserData({...userData, nombre: e.target.value})} className="bg-black/40 border border-red-900/20 p-4 rounded-xl text-[9px] outline-none" />
                <input placeholder="EMAIL" value={userData.email || ''} onChange={e => setUserData({...userData, email: e.target.value})} className="bg-black/40 border border-red-900/20 p-4 rounded-xl text-[9px] outline-none" />
                <input placeholder="TELÉFONO" value={userData.telefono || ''} onChange={e => setUserData({...userData, telefono: e.target.value})} className="bg-black/40 border border-red-900/20 p-4 rounded-xl text-[9px] outline-none" />
                <div className="flex gap-2">
                  <select value={userData.rol || 'cliente'} onChange={e => setUserData({...userData, rol: e.target.value})} className="flex-grow bg-black/40 border border-red-900/20 p-4 rounded-xl text-[9px] outline-none uppercase">
                    <option value="cliente">CLIENTE</option>
                    <option value="staff">STAFF</option>
                    <option value="disabled">DESHABILITADO</option>
                  </select>
                  <button onClick={editingUserId ? () => handleUpdateUser(editingUserId) : handleCreateUser} className="bg-red-600 px-6 rounded-xl font-black text-[9px]">
                    {editingUserId ? 'GUARDAR' : 'CREAR'}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user, i) => (
                <div key={i} className={`bg-[#050000] border border-red-900/20 p-8 rounded-[2rem] hover:border-red-600/40 transition-all group relative overflow-hidden ${user.rol === 'disabled' ? 'opacity-40 grayscale' : ''}`}>
                  <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingUserId(user.id); setUserData({ nombre: user.nombre || '', email: user.email || '', telefono: user.telefono || '', rol: user.rol || 'cliente' }); setIsCreating(false); }} className="text-blue-500 hover:text-blue-400">✎</button>
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-400">✕</button>
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-red-600/10 rounded-full flex items-center justify-center text-red-500 font-black">
                      {user.nombre?.charAt(0) || 'U'}
                    </div>
                    <span className="text-[6px] text-gray-800 font-black tracking-widest">{user.rol || 'CLIENTE'}</span>
                  </div>
                  <p className="text-xs font-black text-white mb-1 group-hover:text-red-400 transition-colors uppercase">{user.nombre || "SIN_NOMBRE"}</p>
                  <p className="text-[8px] text-red-500/80 lowercase italic mb-6">{user.email}</p>
                  <div className="space-y-2 border-t border-red-900/10 pt-4">
                    <p className="text-[7px] text-gray-600 uppercase">TEL: <span className="text-gray-400">{user.telefono || "NO_ASIGNADO"}</span></p>
                    <p className="text-[7px] text-gray-600 uppercase">ALTA: <span className="text-gray-400">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'sistema' ? (
          <div className="flex-grow p-10 overflow-hidden flex flex-col">
            <header className="mb-6 flex justify-between items-end">
              <div>
                <h2 className="text-lg font-black tracking-[0.5em] text-red-500 italic">LOG_ACTIVIDAD_GLOBAL</h2>
                <p className="text-gray-600 mt-2">Auditoría completa de movimientos en el núcleo</p>
              </div>
              <div className="text-[8px] text-red-900 animate-pulse font-black">● STORAGE_PERSISTENCE_ACTIVE</div>
            </header>
            <div className="flex-grow bg-[#030000] border border-red-900/20 rounded-[2rem] p-8 overflow-y-auto custom-scrollbar font-mono">
              <div className="space-y-2">
                {systemLogs.map((log) => (
                  <div key={log.id} className="flex gap-4 border-b border-red-900/5 py-2 animate-reveal">
                    <span className="text-gray-700">[{log.time}]</span>
                    <span className={`font-black ${
                      log.type === 'ERROR' ? 'text-red-600' : 
                      log.type === 'WARN' ? 'text-yellow-500' : 
                      log.type === 'USER' ? 'text-blue-500' : 'text-green-500'
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-gray-400 lowercase italic">{log.message}</span>
                  </div>
                ))}
              </div>
              <div ref={scrollAnchor} />
            </div>
          </div>
        ) : (activeTab === 'solicitudes' || activeTab === 'requerimientos' || activeTab === 'proyectos') ? (
          <div className="flex-grow p-10 overflow-y-auto custom-scrollbar">
            <header className="mb-10">
              <h2 className="text-lg font-black tracking-[0.5em] text-red-500 italic">
                {activeTab === 'requerimientos' ? 'PROTOCOLO_REQUERIMIENTOS' : 
                 activeTab === 'proyectos' ? 'LISTADO_GLOBAL_PROYECTOS' : 'GESTIÓN_SOLICITUDES'}
              </h2>
              <p className="text-gray-600 mt-2">Seguimiento de flujo de trabajo y estados del sistema</p>
            </header>
            <div className="grid grid-cols-1 gap-4">
              {projectRequests
                .filter(req => {
                  // David: Filtro unificado basado en la necesidad de visualización global en Proyectos
                  if (activeTab === 'requerimientos') return req.paquete_seleccionado === 'REQUERIMIENTO_ADICIONAL';
                  if (activeTab === 'proyectos') return true; // Visualiza TODOS los proyectos sin importar el status
                  return req.paquete_seleccionado !== 'REQUERIMIENTO_ADICIONAL';
                })
                .map((req, i) => (
                <div key={i} className="bg-[#050000] border border-red-900/20 p-8 rounded-[2rem] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 animate-reveal">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-white">{req.proyecto_nombre}</span>
                      <span className={`text-[6px] px-2 py-0.5 rounded-full border ${
                        req.estado === 'completado' ? 'border-green-500 text-green-500' : 
                        req.estado === 'en_proceso' ? 'border-blue-500 text-blue-500' : 
                        'border-red-900 text-red-900'
                      }`}>
                        {req.estado}
                      </span>
                    </div>
                    <p className="text-[9px] text-gray-600 mt-1 lowercase italic">{req.cliente_email}</p>
                    <p className="text-[10px] text-gray-400 mt-4 leading-relaxed max-w-2xl">{req.descripcion}</p>
                    <div className="flex gap-4 mt-4">
                      {req.brief_url && (
                        <a href={req.brief_url} target="_blank" className="text-[7px] text-red-500 hover:underline">ABRIR_BRIEF_TÉCNICO ↗</a>
                      )}
                      <span className="text-[7px] text-gray-800">CATEGORÍA: {req.paquete_seleccionado}</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-48">
                    <select 
                      disabled={updatingId === req.id}
                      value={req.estado} 
                      onChange={(e) => handleStatusChange(req.id, e.target.value)}
                      className="w-full bg-[#080000] border border-red-900/30 text-[9px] font-black p-4 rounded-xl outline-none focus:border-red-600 transition-all text-red-500 uppercase"
                    >
                      <option value="en_revision">En Revisión</option>
                      <option value="aprobado">Aprobado</option>
                      <option value="en_proceso">En Proceso</option>
                      <option value="completado">Completado</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center text-red-900/10 tracking-[2em] font-black italic">GRAVITY_NUCLEUS</div>
        )}
      </section>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(220, 38, 38, 0.1); }`}</style>
    </main>
  );
}