import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// Inicjalizacja Resend z kluczem API
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Akceptujemy tylko zapytania POST
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Nur POST-Anfragen erlaubt' });
  }

  try {
    const data = request.body;

    // Walidacja danych (prosta)
    if (!data.name || !data.email || !data.message) {
      return response.status(400).json({ message: 'Fehlende Pflichtfelder' });
    }

    // Formatowanie adresu
    const { street, streetNumber, postalCode, city } = data.addressComponents;
    const fullAddress = `${street} ${streetNumber}, ${postalCode} ${city}`;

    // Formatowanie treści maila
    const emailBody = `
      Neue Nachricht vom Kontaktformular:
      -----------------------------------------
      Nachricht:
      ${data.message}
      -----------------------------------------
      Kontaktdaten des Kunden:
      Adresse: ${fullAddress}
      Telefon: ${data.phone || 'Nicht angegeben'}
      E-Mail: ${data.email}
    `;

    // Wysyłka maila
    const { data: emailResponse, error } = await resend.emails.send({
      from: 'Kontakt <onboarding@resend.dev>', // WAŻNE: To musi być domena zweryfikowana w Resend
      to: ['TWOJ_EMAIL_DOCELOWY@example.com'], // <-- PODMIEŃ NA SWÓJ PRAWDZIWY E-MAIL
      subject: `Anfrage von ${data.name} – ${data.inquiryType}`,
      text: emailBody,
    });

    if (error) {
      console.error({ error });
      return response.status(500).json({ message: 'Fehler beim Senden der E-Mail', error });
    }

    return response.status(200).json({ message: 'E-Mail wurde erfolgreich gesendet', data: emailResponse });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: 'Ein unbekannter Fehler ist aufgetreten', error });
  }
}
