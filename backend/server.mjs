import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';

// Sprawdzenie kluczowych zmiennych środowiskowych
if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing VITE_RESEND_API_KEY environment variable.');
}
if (!process.env.TARGET_EMAIL) {
  throw new Error('Missing TARGET_EMAIL environment variable.');
}

const app = express();
const port = process.env.PORT || 3001;

// Inicjalizacja Resend z kluczem API
const resend = new Resend(process.env.RESEND_API_KEY);
const targetEmail = process.env.TARGET_EMAIL;

// Middleware
app.use(cors()); // Na razie otwarte, można zawęzić do domeny produkcyjnej
app.use(express.json());

// Endpoint do wysyłania e-maili
app.post('/api/send-email', async (req, res) => {
  try {
    const data = req.body;

    // Walidacja danych
    if (!data.name || !data.email || !data.message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const { street, streetNumber, postalCode, city } = data.addressComponents;
    const fullAddress = `${street} ${streetNumber}, ${postalCode} ${city}`;

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

    const { data: emailResponse, error } = await resend.emails.send({
      from: 'Kontakt Akgarten <kontakt@twoja-domena.com>', // WAŻNE: Podmień na zweryfikowaną domenę w Resend
      to: [targetEmail],
      subject: `Zapytanie od ${data.name} - ${data.inquiryType}`,
      text: emailBody,
    });

    if (error) {
      console.error({ error });
      return res.status(500).json({ message: 'Error sending email', error });
    }

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An unknown error occurred' });
  }
});

// Start serwera
app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
