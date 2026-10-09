const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Necesitas la service key

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Faltan variables de entorno. Requiere NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function syncUsersToAuth() {
  try {
    console.log('🔄 Iniciando sincronización de usuarios...');
    
    // 1. Obtener todos los usuarios de perfiles_usuarios
    const { data: profiles, error: profilesError } = await supabase
      .from('perfiles_usuarios')
      .select('*');
    
    if (profilesError) {
      console.error('❌ Error obteniendo perfiles:', profilesError);
      return;
    }
    
    console.log(`📋 Encontrados ${profiles.length} perfiles en perfiles_usuarios`);
    
    // 2. Obtener usuarios existentes en Supabase Auth
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error obteniendo usuarios de Auth:', usersError);
      return;
    }
    
    const existingEmails = users.map(user => user.email.toLowerCase());
    console.log(`👤 Existentes ${existingEmails.length} usuarios en Supabase Auth`);
    
    // 3. Sincronizar usuarios que no existen en Auth
    let syncedCount = 0;
    let errorCount = 0;
    
    for (const profile of profiles) {
      const email = profile.email.toLowerCase();
      
      if (!existingEmails.includes(email)) {
        try {
          console.log(`🔐 Creando usuario en Auth: ${email}`);
          
          // Generar una contraseña temporal (puedes cambiarla después)
          const tempPassword = 'TempPassword123!';
          
          const { data, error } = await supabase.auth.admin.createUser({
            email: email,
            password: tempPassword,
            email_confirm: true,
            user_metadata: {
              full_name: profile.nombre,
              role: profile.rol
            }
          });
          
          if (error) {
            console.error(`❌ Error creando usuario ${email}:`, error);
            errorCount++;
          } else {
            console.log(`✅ Usuario creado: ${email} (Contraseña temporal: ${tempPassword})`);
            syncedCount++;
          }
        } catch (err) {
          console.error(`❌ Error creando usuario ${email}:`, err);
          errorCount++;
        }
      } else {
        console.log(`⏭️  Usuario ya existe en Auth: ${email}`);
      }
    }
    
    console.log(`\n🎉 Sincronización completada:`);
    console.log(`   ✅ Usuarios sincronizados: ${syncedCount}`);
    console.log(`   ❌ Errores: ${errorCount}`);
    console.log(`   📝 Usa las contraseñas temporales "TempPassword123!" para el primer login`);
    console.log(`   🔐 Luego cambia las contraseñas desde el panel de Supabase`);
    
  } catch (err) {
    console.error('❌ Error en sincronización:', err);
  }
}

syncUsersToAuth();
