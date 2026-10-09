"use client";

import { useEffect, useState } from 'react';

/**
 * Gravity Labs - Hook de Consumo de Servicios
 * David: Optimización final para sincronización por columna 'slug'.
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
   * David: Match exacto por slug para eliminar el error ERR_SYNC.
   */
  const getService = (identifier: string) => {
    if (!services || services.length === 0) return null;
    
    // Comparamos el identificador del frontend con el slug de la DB
    return services.find(s => s.slug === identifier);
  };

  return { services, getService, loading, error };
}