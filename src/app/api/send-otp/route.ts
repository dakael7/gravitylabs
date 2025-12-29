import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * PROTOCOLO DE TRANSMISIÓN DE CRIPTOGRAFÍA TEMPORAL (OTP)
 * David: Estética minimalista estilo Apple para máxima seriedad y confianza.
 */
export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'Gravity Labs <onboarding@resend.dev>', 
      to: [email],
      subject: `${otp} es tu código de verificación de Gravity Labs`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container {
              max-width: 560px;
              margin: 0 auto;
              padding: 40px 20px;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #1d1d1f;
              line-height: 1.5;
            }
            .logo {
              font-size: 21px;
              font-weight: 600;
              letter-spacing: -0.02em;
              margin-bottom: 40px;
              color: #000;
            }
            .title {
              font-size: 24px;
              font-weight: 600;
              letter-spacing: -0.015em;
              margin-bottom: 24px;
            }
            .text {
              font-size: 17px;
              color: #424245;
              margin-bottom: 32px;
            }
            .code-container {
              margin: 32px 0;
              font-size: 36px;
              font-weight: 700;
              letter-spacing: 0.2em;
              color: #000;
            }
            .footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #d2d2d7;
              font-size: 12px;
              color: #86868b;
            }
            .footer-link {
              color: #0066cc;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">Gravity Labs</div>
            
            <h1 class="title">Verifica tu dirección de correo electrónico.</h1>
            
            <p class="text">
              Para completar la configuración de tu cuenta de Gravity Labs, introduce el siguiente código en la pantalla de registro:
            </p>

            <div class="code-container">
              ${otp}
            </div>

            <p class="text" style="font-size: 14px;">
              Este código caducará en 10 minutos. Si no has solicitado este código, puedes ignorar este mensaje con total seguridad.
            </p>

            <div class="footer">
              Enviado por Gravity Labs para verificar la identidad de ${email}.<br>
              © 2025 Gravity Labs. Todos los derechos reservados.
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) return NextResponse.json({ error }, { status: 400 });

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}