"use client";

import { useEffect, useState } from 'react';

/**
 * Gravity Labs - Hook de Consumo de Servicios
 * David: Este hook centraliza la comunicación con la API de servicios.
 * Se ha optimizado la lógica de búsqueda para evitar errores de sincronización (ERR_SYNC).
 */
export function useServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Error al conectar con el servidor');
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  /**
   * David: Función de búsqueda mejorada. 
   * Compara el identificador con el 'slug' o el 'nombre' del servicio en la DB.
   */
  const getService = (identifier: string) => {
    if (!services || services.length === 0) return null;
    
    const searchId = identifier?.toString().trim().toLowerCase();
    
    return services.find(s => 
      s.slug?.toString().trim().toLowerCase() === searchId || 
      s.nombre?.toString().trim().toLowerCase() === searchId
    );
  };

  return { services, getService, loading, error };
}