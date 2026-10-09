"use client";

import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';

interface AdminData {
  nombre: string;
  email: string;
  telefono: string;
  rol: 'admin' | 'staff';
  password: string;
}

export default function CreateAdminForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState<AdminData>({
    nombre: '',
    email: '',
    telefono: '',
    rol: 'admin',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: adminData.email.toLowerCase(),
        password: adminData.password,
        email_confirm: true,
        user_metadata: {
          full_name: adminData.nombre,
          role: adminData.rol
        }
      });

      if (authError) {
        // Si el usuario ya existe en Auth, solo crear en perfiles_usuarios
        if (authError.message.includes('already registered')) {
          console.log('Usuario ya existe en Auth, creando solo en perfiles_usuarios...');
        } else {
          throw authError;
        }
      }

      // 2. Crear/actualizar en perfiles_usuarios
      const { error: profileError } = await supabase
        .from('perfiles_usuarios')
        .upsert({
          email: adminData.email.toLowerCase(),
          nombre: adminData.nombre,
          telefono: adminData.telefono,
          rol: adminData.rol,
          password: adminData.password // Para referencia
        }, {
          onConflict: 'email'
        });

      if (profileError) {
        throw profileError;
      }

      alert('✅ Administrador creado exitosamente');
      onSuccess();
      
      // Reset form
      setAdminData({
        nombre: '',
        email: '',
        telefono: '',
        rol: 'admin',
        password: ''
      });
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/40 border border-red-500/30 p-8 rounded-[2.5rem]">
      <h3 className="text-xl font-black text-red-500 mb-6">Crear Nuevo Administrador</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[9px] text-red-500 font-black uppercase">Nombre Completo</label>
          <input
            type="text"
            required
            value={adminData.nombre}
            onChange={(e) => setAdminData({...adminData, nombre: e.target.value})}
            className="w-full bg-zinc-900/50 border border-white/10 p-4 rounded-2xl text-[11px] outline-none text-white focus:border-red-500"
            placeholder="Nombre del administrador"
          />
        </div>

        <div>
          <label className="text-[9px] text-red-500 font-black uppercase">Email</label>
          <input
            type="email"
            required
            value={adminData.email}
            onChange={(e) => setAdminData({...adminData, email: e.target.value})}
            className="w-full bg-zinc-900/50 border border-white/10 p-4 rounded-2xl text-[11px] outline-none text-white focus:border-red-500"
            placeholder="admin@ejemplo.com"
          />
        </div>

        <div>
          <label className="text-[9px] text-red-500 font-black uppercase">Teléfono</label>
          <input
            type="tel"
            required
            value={adminData.telefono}
            onChange={(e) => setAdminData({...adminData, telefono: e.target.value})}
            className="w-full bg-zinc-900/50 border border-white/10 p-4 rounded-2xl text-[11px] outline-none text-white focus:border-red-500"
            placeholder="+584121234567"
          />
        </div>

        <div>
          <label className="text-[9px] text-red-500 font-black uppercase">Contraseña</label>
          <input
            type="password"
            required
            value={adminData.password}
            onChange={(e) => setAdminData({...adminData, password: e.target.value})}
            className="w-full bg-zinc-900/50 border border-white/10 p-4 rounded-2xl text-[11px] outline-none text-white focus:border-red-500"
            placeholder="Contraseña para el login"
          />
        </div>

        <div>
          <label className="text-[9px] text-red-500 font-black uppercase">Rol</label>
          <select
            value={adminData.rol}
            onChange={(e) => setAdminData({...adminData, rol: e.target.value as 'admin' | 'staff'})}
            className="w-full bg-zinc-900/50 border border-white/10 p-4 rounded-2xl text-[11px] outline-none text-white cursor-pointer focus:border-red-500"
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white p-4 rounded-2xl font-black text-[11px] hover:bg-red-500 transition-all disabled:opacity-50"
        >
          {loading ? 'Creando...' : 'Crear Administrador'}
        </button>
      </form>
    </div>
  );
}
