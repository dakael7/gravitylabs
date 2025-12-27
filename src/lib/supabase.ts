import { createClient } from '@supabase/supabase-js';

/**
 * Gravity Labs - Core Database Connection
 * David: Inicialización validada para el canal de comunicación con Supabase.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Transmisión de cliente hacia la infraestructura de datos
export const supabase = createClient(supabaseUrl, supabaseAnonKey);