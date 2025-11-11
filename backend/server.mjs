import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';

// Sprawdzenie kluczowych zmiennych środowiskowych
if (!process.env.RESEND_API_KEY) {
  throw new Error('Fehlende Umgebungsvariable RESEND_API_KEY.');
}
if (!process.env.TARGET_EMAIL) {
  throw new Error('Fehlende Umgebungsvariable TARGET_EMAIL.');
}

const app = express();
const port = process.env.PORT || 3001;

// Inicjalizacja Resend z kluczem API
const resend = new Resend(process.env.RESEND_API_KEY);
const targetEmail = process.env.TARGET_EMAIL;

// Middleware
app.use(cors()); // Na razie otwarte, można zawęzić do domeny produkcyjnej
app.use(express.json());

// Endpoint dla health checka
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Endpoint do wysyłania e-maili
app.post('/api/send-email', async (req, res) => {
  try {
    const data = req.body;

    // Walidacja danych
    if (!data.name || !data.email || !data.message) {
      return res.status(400).json({ message: 'Fehlende Pflichtfelder' });
    }

    const { street, streetNumber, postalCode, city } = data.addressComponents;
    const fullAddress = `${street} ${streetNumber}, ${postalCode} ${city}`;

    const emailBody = `
      Neue Nachricht vom Kontaktformular:
      -----------------------------------------
      Nachricht:
      ${data.message}
      -----------------------------------------
      Kontaktdaten des Kunden:
      Name: ${data.name}
      Adresse: ${fullAddress}
      Telefon: ${data.phone || 'Nicht angegeben'}
      E-Mail: ${data.email}
    `;

    const { data: emailResponse, error } = await resend.emails.send({
      from: 'Kontakt Akgarten <kontakt@akgarten.com>', // WAŻNE: Podmień na zweryfikowaną domenę w Resend
      to: [targetEmail],
      subject: `Anfrage von ${data.name} – ${data.inquiryType}`,
      text: emailBody,
    });

    if (error) {
      console.error({ error });
      return res.status(500).json({ message: 'Fehler beim Senden der E-Mail', error });
    }

    return res.status(200).json({ message: 'E-Mail wurde erfolgreich gesendet' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ein unbekannter Fehler ist aufgetreten' });
  }
});

// Start serwera
app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
