// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Usar las variables de entorno prefijadas con REACT_APP_
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Para depuración: Imprime los valores para verificar que se están cargando
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Anon Key:", supabaseAnonKey);

// Verificar que las variables se están cargando (solo para depuración)
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Las variables de entorno de Supabase no están configuradas. Asegúrate de tener un archivo .env en la raíz con REACT_APP_SUPABASE_URL y REACT_APP_SUPABASE_ANON_KEY');
    // Considera lanzar un error o deshabilitar la app si esto es crítico
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);