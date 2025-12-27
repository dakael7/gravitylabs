import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // David: Importamos la instancia, no la función

export async function GET() {
  try {
    const { data: services, error } = await supabase
      .from('gravity_services')
      .select('*')
      .eq('is_active', true); // Solo trae los activos

    if (error) throw error;

    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Error al cargar datos' }, { status: 500 });
  }
}