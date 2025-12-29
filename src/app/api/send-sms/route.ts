import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

/**
 * PROTOCOLO DE VERIFICACIÓN SMS
 * David: Envío de códigos de seguridad a terminales móviles.
 */
export async function POST(req: Request) {
  try {
    const { telefono, otp } = await req.json();

    await client.messages.create({
      body: `Gravity Labs: Tu codigo de verificacion es ${otp}. No lo compartas con nadie.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: telefono
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('SMS Error:', err);
    return NextResponse.json({ error: 'Error al enviar SMS' }, { status: 500 });
  }
}