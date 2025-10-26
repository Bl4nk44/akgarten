import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// Inicjalizacja Resend z kluczem API
const resend = new Resend(process.env.VITE_RESEND_API_KEY);

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Akceptujemy tylko zapytania POST
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    const data = request.body;

    // Walidacja danych (prosta)
    if (!data.name || !data.email || !data.message) {
      return response.status(400).json({ message: 'Missing required fields' });
    }

    // Formatowanie adresu
    const { street, streetNumber, postalCode, city } = data.addressComponents;
    const fullAddress = `${street} ${streetNumber}, ${postalCode} ${city}`;

    // Formatowanie treści maila
    const emailBody = `
      Nowa wiadomość z formularza kontaktowego:
      -----------------------------------------
      Wiadomość:
      ${data.message}
      -----------------------------------------
      Dane kontaktowe klienta:
      Adres: ${fullAddress}
      Telefon: ${data.phone || 'Nie podano'}
      Email: ${data.email}
    `;

    // Wysyłka maila
    const { data: emailResponse, error } = await resend.emails.send({
      from: 'Kontakt <onboarding@resend.dev>', // WAŻNE: To musi być domena zweryfikowana w Resend
      to: ['TWOJ_EMAIL_DOCELOWY@example.com'], // <-- PODMIEŃ NA SWÓJ PRAWDZIWY E-MAIL
      subject: `Zapytanie od ${data.name} - ${data.inquiryType}`,
      text: emailBody,
    });

    if (error) {
      console.error({ error });
      return response.status(500).json({ message: 'Error sending email', error });
    }

    return response.status(200).json({ message: 'Email sent successfully', data: emailResponse });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: 'An unknown error occurred', error });
  }
}
