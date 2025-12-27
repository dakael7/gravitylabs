import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// David: Esta variable la lee del 'secret' que ya configuraste
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { record } = await req.json()

    // David: Solo notificamos si el mensaje NO es del staff (es_staff === false)
    if (record.es_staff) {
      return new Response(JSON.stringify({ message: "Ignored staff message" }), { 
        status: 200,
        headers: { "Content-Type": "application/json" } 
      })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Gravity Labs <onboarding@resend.dev>', // David: Luego puedes usar tu dominio verificado
        to: ['cdsantana2005@outlook.com'], // AGREGA AQUÍ TU CORREO Y LOS DE TUS ADMINS
        subject: `🚨 NUEVO MENSAJE DE SOPORTE: ${record.emisor_nombre}`,
        html: `
          <div style="font-family: sans-serif; background: #050508; color: white; padding: 40px; border-radius: 20px;">
            <h1 style="color: #06b6d4; font-style: italic;">GRAVITY_NUCLEUS_ALERT</h1>
            <hr style="border: 0; border-top: 1px solid #1e1e24; margin: 20px 0;" />
            <p style="text-transform: uppercase; font-size: 10px; letter-spacing: 2px; color: #666;">Emisor del Sistema</p>
            <p style="font-size: 18px;"><strong>${record.emisor_nombre}</strong> (${record.cliente_email})</p>
            
            <div style="background: #0a0a0f; padding: 20px; border-left: 4px solid #06b6d4; margin: 20px 0; font-style: italic;">
              "${record.contenido}"
            </div>
            
            <a href="https://tu-url-del-admin.com" style="display: inline-block; background: #06b6d4; color: black; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase;">Abrir Terminal de Control</a>
            
            <p style="font-size: 9px; color: #333; margin-top: 40px;">Gravity Labs Ops v3.9 // Protocolo de Notificación Automática</p>
          </div>
        `,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
})