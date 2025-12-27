"use client";

import React, { useEffect, useState, Suspense, useRef } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

/**
 * Gravity Labs - Operations Dashboard v4.2
 * David: Dashboard cliente con métricas de proyecto, estado de red y chat sincronizado.
 * MOD: Nombres de paquetes sincronizados con la Homepage para productización.
 */
function DashboardContent() {
  const [mounted, setMounted] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'projects' | 'support' | 'profile' | 'requirements'>('overview');
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [onlineStaff, setOnlineStaff] = useState<any[]>([]); 
  
  // David: Estados para la gestión de solicitudes de proyectos
  const [projectLoading, setProjectLoading] = useState(false);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [projectData, setProjectData] = useState({ 
    name: '', 
    desc: '', 
    fileUrl: '', 
    package: 'NEBULA_LANDING',
    category: 'MODIFICACION_DISEÑO' // David: Categoría por defecto para requerimientos
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const scrollAnchor = useRef<HTMLDivElement>(null);
  
  const userName = searchParams.get('name') || 'OPERADOR';
  const clientEmail = searchParams.get('email') || ''; 

  // David: Catálogo de paquetes sincronizado con la Homepage
  const CATALOG_PACKAGES = [
    { id: 'NEBULA_LANDING', name: 'Nebula Landing', category: 'Web' },
    { id: 'SUPERNOVA_BUSINESS', name: 'Supernova Business', category: 'Web' },
    { id: 'GALACTIC_ECOMMERCE', name: 'Galactic E-Commerce', category: 'Web' },
    { id: 'ORBIT_APP', name: 'Orbit App', category: 'Sistemas' },
    { id: 'TITANIUM_SYSTEMS', name: 'Titanium Systems', category: 'Sistemas' },
    { id: 'COSMOS_ENTERPRISE', name: 'Cosmos Enterprise', category: 'Sistemas' }
  ];

  // David: Categorías para requerimientos adicionales
  const REQUIREMENT_CATEGORIES = [
    { id: 'MODIFICACION_DISEÑO', name: '🎨 Modificación de Diseño' },
    { id: 'NUEVA_FUNCIONALIDAD', name: '⚡ Funcionalidad Nueva' },
    { id: 'OPTIMIZACION', name: '🚀 Optimización de Rendimiento' },
    { id: 'ERROR_SISTEMA', name: '🛠 Reporte de Error / Bug' },
    { id: 'AJUSTE_CONTENIDO', name: '📝 Ajuste de Contenido / Copys' }
  ];

  useEffect(() => {
    setMounted(true);
    
    const pkgFromUrl = searchParams.get('pkg')?.toUpperCase();
    if (pkgFromUrl) {
      setActiveView('projects');
      setShowNewProjectForm(true);
      // David: Se busca coincidencia exacta o por ID para el pre-llenado desde la URL
      const matchedPkg = CATALOG_PACKAGES.find(p => p.id === pkgFromUrl || p.id.includes(pkgFromUrl))?.id || 'NEBULA_LANDING';
      setProjectData(prev => ({ 
        ...prev, 
        package: matchedPkg,
        name: `DESPLIEGUE_${matchedPkg}` 
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    if ((activeView === 'projects' || activeView === 'requirements') && clientEmail) {
      const fetchProjects = async () => {
        const { data } = await supabase
          .from('solicitudes_proyectos')
          .select('*')
          .eq('cliente_email', clientEmail.toLowerCase())
          .order('created_at', { ascending: false });
        if (data) setUserProjects(data);
      };
      fetchProjects();
    }
  }, [activeView, clientEmail, projectLoading]);

  useEffect(() => {
    if (scrollAnchor.current) {
      scrollAnchor.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  /**
   * PROTOCOLO DE PRESENCIA GLOBAL
   */
  useEffect(() => {
    if (!clientEmail || !mounted) return;

    const globalPresence = supabase.channel('global-customer-presence');
    globalPresence.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await globalPresence.track({
          email: clientEmail.toLowerCase(),
          user: userName,
          online_at: new Date().toISOString()
        });
      }
    });

    const staffChannel = supabase.channel('staff-online-status')
      .on('presence', { event: 'sync' }, () => {
        const state = staffChannel.presenceState();
        const admins = Object.keys(state).map(key => state[key][0]);
        setOnlineStaff(admins);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(globalPresence);
      supabase.removeChannel(staffChannel);
    };
  }, [clientEmail, mounted, userName]);

  /**
   * PROTOCOLO DE TIEMPO REAL: Mensajería de Soporte
   */
  useEffect(() => {
    if (activeView === 'support' && clientEmail) {
      const fetchMessages = async () => {
        const { data } = await supabase
          .from('mensajes_soporte')
          .select('*')
          .eq('cliente_email', clientEmail.toLowerCase())
          .order('created_at', { ascending: true });
        if (data) setMessages(data);

        await supabase
          .from('mensajes_soporte')
          .update({ leido: true })
          .eq('cliente_email', clientEmail.toLowerCase())
          .eq('es_staff', true)
          .eq('leido', false);
      };

      fetchMessages();

      const channel = supabase
        .channel(`chat_${clientEmail.toLowerCase()}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'mensajes_soporte',
          filter: `cliente_email=eq.${clientEmail.toLowerCase()}` 
        }, (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => [...prev, payload.new]);
            if (payload.new.es_staff) {
              supabase.from('mensajes_soporte').update({ leido: true }).eq('id', payload.new.id).then();
            }
          } else if (payload.eventType === 'UPDATE') {
            setMessages((prev) => prev.map(m => m.id === payload.new.id ? payload.new : m));
          }
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [activeView, clientEmail]);

  /**
   * David: Lógica de envío para nuevas solicitudes
   */
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectLoading(true);
    try {
      const isExtraReq = activeView === 'requirements';
      const pkgName = isExtraReq ? 'REQUERIMIENTO_ADICIONAL' : (CATALOG_PACKAGES.find(p => p.id === projectData.package)?.name || projectData.package);
      
      const { error } = await supabase.from('solicitudes_proyectos').insert([{
        cliente_email: clientEmail.toLowerCase(),
        cliente_nombre: userName,
        proyecto_nombre: isExtraReq ? `[${projectData.category}] ${projectData.name}` : projectData.name,
        descripcion: projectData.desc,
        paquete_seleccionado: pkgName,
        brief_url: projectData.fileUrl,
        estado: 'en_revision'
      }]);
      
      if (error) throw error;
      alert(`SISTEMA: ${isExtraReq ? 'Requerimiento adicional' : 'Solicitud de despliegue'} recibida.`);
      setShowNewProjectForm(false);
      router.replace(`/dashboard?name=${userName}&email=${clientEmail}`);
    } catch (err) {
      alert("ERROR_CRITICO_EN_SOLICITUD");
    } finally { setProjectLoading(false); }
  };

  /**
   * GESTIÓN DE ENVÍO Y ARCHIVOS ADJUNTOS
   */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isProjectBrief = false) => {
    const file = e.target.files?.[0];
    if (!file || !clientEmail) return;
    setUploading(true);
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;
    const filePath = isProjectBrief ? `proyectos_briefs/${fileName}` : `clientes/${fileName}`;
    try {
      const { error: uploadError } = await supabase.storage.from('soporte_adjuntos').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('soporte_adjuntos').getPublicUrl(filePath);
      
      if (isProjectBrief) {
        setProjectData({ ...projectData, fileUrl: publicUrl });
      } else {
        const contenidoAdjunto = file.type.startsWith('image/') ? `[IMAGE]:${publicUrl}` : `[FILE]:${file.name}|${publicUrl}`;
        await supabase.from('mensajes_soporte').insert([{ emisor_nombre: userName, contenido: contenidoAdjunto, cliente_email: clientEmail.toLowerCase(), es_staff: false, leido: false }]);
      }
    } catch (err) { alert("ERROR_TRANSMISION"); } finally { setUploading(false); }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !clientEmail) return;
    const { error } = await supabase.from('mensajes_soporte').insert([{ emisor_nombre: userName, contenido: newMessage, cliente_email: clientEmail.toLowerCase(), es_staff: false, leido: false }]);
    if (!error) setNewMessage('');
  };

  const handleLogout = () => router.push('/uplink');

  if (!mounted) return <div className="min-h-screen bg-[#020205]" />;

  return (
    <main className="h-screen bg-[#020205] text-white flex flex-col md:flex-row relative overflow-hidden">
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full" />
      </div>

      <aside className="w-full md:w-24 lg:w-64 bg-[#050508]/80 backdrop-blur-xl border-r border-white/5 flex flex-col items-center lg:items-start p-6 lg:p-8 z-30">
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-full animate-pulse" />
          <Image src="/logo.png" alt="Gravity" width={32} height={32} className="relative opacity-90" />
        </div>

        <nav className="flex flex-col gap-3 w-full">
          {[
            { id: 'overview', label: 'Inicio', icon: '◈' },
            { id: 'projects', label: 'Proyectos', icon: '⌬' },
            { id: 'requirements', label: 'Requerimientos', icon: '⌬' },
            { id: 'support', label: 'Soporte', icon: '▣' },
            { id: 'profile', label: 'Mi Perfil', icon: '⚙' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id as any); setShowNewProjectForm(false); }}
              className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-[10px] font-mono uppercase tracking-[0.2em] transition-all group ${
                activeView === item.id 
                ? 'bg-cyan-500 text-black font-bold shadow-[0_0_25px_rgba(6,182,212,0.3)]' 
                : 'text-gray-500 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <span className={`text-sm ${activeView === item.id ? 'text-black' : 'text-cyan-500 group-hover:scale-110 transition-transform'}`}>{item.icon}</span>
              <span className="hidden lg:block">{item.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} className="mt-auto flex items-center gap-4 px-4 py-4 rounded-2xl text-[10px] font-mono uppercase tracking-[0.2em] text-gray-700 hover:text-red-400 transition-colors w-full group">
          <span className="text-sm group-hover:rotate-12 transition-transform">⎋</span>
          <span className="hidden lg:block">Desconectar</span>
        </button>
      </aside>

      <section className="flex-grow flex flex-col p-6 md:p-12 overflow-hidden relative z-10 h-full">
        <header className="flex justify-between items-start mb-8 flex-shrink-0">
          <div>
            <h2 className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.5em] mb-2 italic">System_Status: Operational</h2>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">
              {activeView === 'overview' && `Bienvenido, ${userName}`}
              {activeView === 'projects' && "Centro de Proyectos"}
              {activeView === 'requirements' && "Protocolo Adicional"}
              {activeView === 'support' && "Enlace Directo Staff"}
              {activeView === 'profile' && "Configuración"}
            </h1>
          </div>

          <div className="flex flex-col items-end">
            {(activeView === 'projects' || activeView === 'requirements') && !showNewProjectForm && (
                <button 
                  onClick={() => {
                    setShowNewProjectForm(true);
                    if(activeView === 'requirements') {
                      setProjectData({ ...projectData, name: '', package: 'REQUERIMIENTO_ADICIONAL', category: 'MODIFICACION_DISEÑO' });
                    }
                  }} 
                  className="bg-white text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500 transition-all shadow-xl"
                >
                  {activeView === 'requirements' ? '+ Nuevo Requerimiento' : '+ Nueva Solicitud'}
                </button>
            )}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] mt-2`}>
                <span className={`w-1.5 h-1.5 rounded-full ${onlineStaff.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest leading-none">
                    {onlineStaff.length > 0 ? `Staff_En_Línea: ${onlineStaff.length}` : 'Staff_Offline'}
                </span>
            </div>
          </div>
        </header>

        <div className="animate-reveal flex-grow overflow-hidden flex flex-col">
          {activeView === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 italic overflow-y-auto custom-scrollbar pb-10">
              <div className="lg:col-span-2 bg-gradient-to-br from-[#0a0a0f] to-[#050508] border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-8xl font-black">◈</span>
                </div>
                <h3 className="text-3xl font-bold mb-6 leading-tight">Tu infraestructura está siendo <br/> procesada por el núcleo.</h3>
                <div className="flex gap-4">
                  <button onClick={() => setActiveView('support')} className="px-8 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all shadow-xl">Iniciar Consulta</button>
                  <button onClick={() => setActiveView('requirements')} className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Generar Requerimiento</button>
                </div>
              </div>
            </div>
          )}

          {(activeView === 'projects' || activeView === 'requirements') && (
            <div className="flex-grow overflow-y-auto pb-10 custom-scrollbar italic font-mono">
              {showNewProjectForm ? (
                <div className="max-w-2xl bg-[#08080c] border border-white/10 p-10 rounded-[3rem] shadow-2xl mx-auto animate-reveal">
                  <div className="flex justify-between items-center mb-6 text-cyan-500">
                    <h3 className="text-xl font-black uppercase tracking-tighter">
                      {activeView === 'requirements' ? 'Nuevo Requerimiento' : 'Crear Nuevo Proyecto'}
                    </h3>
                    <button onClick={() => setShowNewProjectForm(false)} className="text-[9px] text-gray-600 hover:text-white uppercase">Cerrar</button>
                  </div>
                  <form onSubmit={handleProjectSubmit} className="space-y-6">
                    {activeView === 'projects' ? (
                      <div>
                        <label className="text-[9px] text-gray-700 uppercase block mb-2 tracking-widest">Paquete de Servicio</label>
                        <select 
                          required 
                          value={projectData.package} 
                          onChange={(e) => setProjectData({...projectData, package: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-[10px] text-white font-bold uppercase outline-none focus:border-cyan-500/50 appearance-none"
                        >
                          {CATALOG_PACKAGES.map(pkg => (
                            <option key={pkg.id} value={pkg.id} className="bg-[#08080c] text-white">[{pkg.category}] {pkg.name}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="text-[9px] text-gray-600 uppercase block mb-2 tracking-widest">Categoría del Requerimiento</label>
                        <select 
                          required 
                          value={projectData.category} 
                          onChange={(e) => setProjectData({...projectData, category: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-[10px] text-white font-bold uppercase outline-none focus:border-cyan-500/50 appearance-none"
                        >
                          {REQUIREMENT_CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id} className="bg-[#08080c] text-white">{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="text-[9px] text-gray-600 block mb-2 tracking-widest">Título Breve</label>
                      <input required value={projectData.name} onChange={e => setProjectData({...projectData, name: e.target.value})} type="text" placeholder="Ej: Ajuste de colores en footer" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-cyan-500 uppercase" />
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-600 block mb-2 tracking-widest">Especificaciones</label>
                      <textarea required onChange={e => setProjectData({...projectData, desc: e.target.value})} rows={4} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-cyan-500" placeholder="Describe los detalles técnicos del requerimiento..." />
                    </div>

                    {/* David: Bloque de observación de costo adicional */}
                    {activeView === 'requirements' && (
                      <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-3">
                        <span className="text-amber-500 text-xs">⚠️</span>
                        <p className="text-[9px] text-amber-500/80 leading-relaxed uppercase tracking-wider">
                          <span className="font-black">OBSERVACIÓN:</span> Este requerimiento será analizado por el núcleo técnico. Las solicitudes fuera del alcance inicial <span className="text-amber-500 font-bold underline">pueden conllevar costos adicionales</span>.
                        </p>
                      </div>
                    )}

                    <div className="border-2 border-dashed border-white/5 p-8 rounded-2xl text-center hover:border-cyan-500/20 transition-all">
                      <label className="cursor-pointer text-[10px] text-gray-500">
                        <input type="file" onChange={(e) => handleFileUpload(e, true)} className="hidden" accept=".pdf" />
                        {uploading ? 'SUBIENDO...' : projectData.fileUrl ? '✅ ARCHIVO_CARGADO' : '📎 ADJUNTAR REFERENCIA (PDF)'}
                      </label>
                    </div>
                    <button type="submit" disabled={projectLoading || uploading} className="w-full py-5 bg-white text-black font-black text-[10px] rounded-2xl shadow-lg hover:bg-cyan-500 tracking-[0.4em] transition-all">
                      {projectLoading ? 'TRANSMITIENDO...' : 'ENVIAR AL NÚCLEO'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-[10px] text-gray-500 uppercase tracking-[0.4em] mb-6">
                    {activeView === 'requirements' ? 'Historial de Requerimientos' : 'Administrar Solicitudes'}
                  </h3>
                  {userProjects.filter(p => activeView === 'requirements' ? p.paquete_seleccionado === 'REQUERIMIENTO_ADICIONAL' : p.paquete_seleccionado !== 'REQUERIMIENTO_ADICIONAL').length === 0 ? (
                    <div className="py-20 text-center border border-dashed border-white/5 rounded-[2rem]">
                        <p className="text-gray-600 text-[10px] uppercase tracking-widest">Sin registros activos.</p>
                    </div>
                  ) : (
                    userProjects
                      .filter(p => activeView === 'requirements' ? p.paquete_seleccionado === 'REQUERIMIENTO_ADICIONAL' : p.paquete_seleccionado !== 'REQUERIMIENTO_ADICIONAL')
                      .map((proj, i) => (
                      <div key={i} className="bg-[#0a0a0f] border border-white/5 p-6 rounded-3xl flex justify-between items-center group hover:border-cyan-500/30 transition-all animate-reveal">
                        <div className="flex gap-6 items-center">
                          <div className={`w-10 h-10 rounded-xl ${activeView === 'requirements' ? 'bg-purple-500/10 text-purple-500' : 'bg-cyan-500/10 text-cyan-500'} flex items-center justify-center font-bold tracking-tighter text-xs`}>
                            {proj.proyecto_nombre.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm uppercase tracking-tighter">{proj.proyecto_nombre}</h4>
                            <p className="text-[9px] text-gray-600 uppercase tracking-widest">{proj.paquete_seleccionado}</p>
                          </div>
                        </div>
                        <span className={`text-[8px] font-black uppercase px-4 py-1.5 rounded-full ${proj.estado === 'en_revision' ? 'text-yellow-500 bg-yellow-500/10' : 'text-green-500 bg-green-500/10'}`}>
                          ● {proj.estado.replace('_', ' ')}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {activeView === 'support' && (
            <div className="bg-[#08080c] border border-white/5 rounded-[3rem] flex-grow flex flex-col overflow-hidden italic shadow-2xl relative w-full mb-4">
                <div className="p-8 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md flex justify-between items-center flex-shrink-0">
                  <div>
                    <h3 className="font-bold text-cyan-400 text-lg tracking-tighter uppercase">Terminal_Seguro // {userName}</h3>
                    <p className="text-[9px] font-mono text-gray-600 uppercase tracking-widest italic">Uplink: {clientEmail}</p>
                  </div>
                </div>
                
                <div className="flex-grow p-8 overflow-y-auto space-y-6 custom-scrollbar flex flex-col bg-[url('/grid.png')] bg-repeat">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.es_staff ? 'items-start' : 'items-end'} animate-reveal`}>
                      <span className="text-[8px] font-mono text-gray-700 uppercase mb-1 px-2 tracking-widest">
                        {msg.es_staff ? 'GRAVITY_STAFF' : msg.emisor_nombre}
                      </span>
                      <div className={`max-w-[75%] p-5 rounded-3xl text-xs transition-all ${
                        msg.es_staff 
                        ? 'bg-white/5 border border-white/10 rounded-tl-none text-gray-300 shadow-lg backdrop-blur-sm' 
                        : 'bg-cyan-500 text-black font-bold rounded-tr-none shadow-[0_10px_30px_rgba(6,182,212,0.2)]'
                      }`}>
                        {msg.contenido.startsWith('[IMAGE]:') ? (
                          <img src={msg.contenido.replace('[IMAGE]:', '')} className="rounded-xl max-h-72" alt="Adjunto" />
                        ) : msg.contenido.startsWith('[FILE]:') ? (
                          <a href={msg.contenido.split('|')[1]} target="_blank" className="flex items-center gap-3 p-3 bg-black/10 rounded-xl underline decoration-black/20 hover:bg-black/20 transition-all">
                             <span className="text-lg">📄</span>
                             <div className="overflow-hidden">
                                <p className="truncate">{msg.contenido.split('|')[0].replace('[FILE]:', '')}</p>
                             </div>
                          </a>
                        ) : (
                          <span className="normal-case font-sans tracking-normal leading-relaxed text-[13px]">{msg.contenido}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={scrollAnchor} />
                </div>

                <form onSubmit={sendMessage} className="p-8 bg-[#050508] border-t border-white/5 flex-shrink-0">
                  <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-[2rem] p-3 px-5 focus-within:border-cyan-500/40 transition-all backdrop-blur-md">
                    <label className={`cursor-pointer p-3 text-cyan-500 hover:text-cyan-400 hover:scale-110 transition-all ${uploading ? 'animate-pulse' : ''}`}>
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(e)} disabled={uploading} />
                      <span className="text-xl">{uploading ? '...' : '📎'}</span>
                    </label>
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Escribir mensaje maestro..." className="flex-grow bg-transparent p-3 text-sm outline-none normal-case font-sans" />
                    <button type="submit" className="px-8 py-4 bg-cyan-500 text-black font-black text-[10px] rounded-2xl active:scale-95 shadow-lg uppercase tracking-widest hover:brightness-110 transition-all">Transmitir</button>
                  </div>
                </form>
            </div>
          )}
        </div>

        <footer className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[8px] font-mono text-gray-800 tracking-[0.6em] uppercase italic gap-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 bg-cyan-900 rounded-full animate-ping" />
            <span>Gravity Labs Ops // v4.2</span>
          </div>
          <span className="text-cyan-900/40 font-bold">Secure_Connection: True // Node: HQ_LATAM</span>
        </footer>
      </section>

      <style>{`
        .animate-reveal { animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes revealUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.1); border-radius: 20px; }
      `}</style>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020205] flex items-center justify-center font-mono text-[10px] text-gray-800 tracking-[1em] animate-pulse">SYSTEM_BOOT_SEQUENCE...</div>}>
      <DashboardContent />
    </Suspense>
  );
}