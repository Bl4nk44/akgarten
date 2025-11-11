import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import OpenAI from 'openai';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import morgan from 'morgan';
import crypto from 'crypto';

// Sprawdzenie kluczowych zmiennych środowiskowych
if (!process.env.RESEND_API_KEY) {
  throw new Error('Fehlende Umgebungsvariable RESEND_API_KEY.');
}
if (!process.env.TARGET_EMAIL) {
  throw new Error('Fehlende Umgebungsvariable TARGET_EMAIL.');
}
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Fehlende Umgebungsvariable OPENAI_API_KEY.');
}

const app = express();
const port = process.env.PORT || 3001;
app.set('trust proxy', 1);

// Inicjalizacja Resend z kluczem API
const resend = new Resend(process.env.RESEND_API_KEY);
const targetEmail = process.env.TARGET_EMAIL;

// OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Middleware
app.use(helmet());

// x-request-id middleware
app.use((req, res, next) => {
  const headerId = req.headers['x-request-id'];
  const id = typeof headerId === 'string' && headerId.trim() ? headerId : crypto.randomUUID();
  (req).id = id; // adnotacja runtime, TS nas nie obchodzi tutaj
  res.setHeader('x-request-id', id);
  next();
});

// Logging
morgan.token('id', (req) => (req).id || '-');
app.use(morgan(':id :remote-addr :method :url :status :res[content-length] - :response-time ms'));

app.use(express.json({ limit: '5mb' }));

const allowedOrigins = process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.split(',').map(s => s.trim()).filter(Boolean) : [];
if (allowedOrigins.length > 0) {
  app.use(cors({ origin: allowedOrigins, credentials: true }));
}

// Rate limiting
const emailLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: 'draft-7', legacyHeaders: false });
const chatLimiter = rateLimit({ windowMs: 60 * 1000, max: 20, standardHeaders: 'draft-7', legacyHeaders: false });

// Validation schemas
const AddressSchema = z.object({
  street: z.string(),
  streetNumber: z.string(),
  postalCode: z.string(),
  city: z.string(),
});
const EmailPayloadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  inquiryType: z.string().optional(),
  message: z.string().min(1),
  addressComponents: AddressSchema,
});
const ChatMessageSchema = z.object({
  role: z.string(),
  content: z.any(),
});
const ChatPayloadSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1),
});

// Endpoint dla health checka
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Endpoint do wysyłania e-maili
app.post('/api/send-email', emailLimiter, async (req, res) => {
  try {
    const parsed = EmailPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Fehlende Pflichtfelder' });
    }
    const data = parsed.data;

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

    const emailHtml = `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222;">
        <h2 style="margin:0 0 12px;">Neue Nachricht vom Kontaktformular</h2>
        <p><strong>Nachricht:</strong><br/>${escapeHtml(data.message).replace(/\n/g, '<br/>')}</p>
        <hr style="border:0;border-top:1px solid #eee;margin:16px 0;"/>
        <h3 style="margin:0 0 8px;">Kontaktdaten des Kunden</h3>
        <p>
          <strong>Name:</strong> ${escapeHtml(data.name)}<br/>
          <strong>Adresse:</strong> ${escapeHtml(fullAddress)}<br/>
          <strong>Telefon:</strong> ${data.phone ? escapeHtml(data.phone) : 'Nicht angegeben'}<br/>
          <strong>E-Mail:</strong> ${escapeHtml(data.email)}
        </p>
      </div>
    `;

    const { data: emailResponse, error } = await resend.emails.send({
      from: 'Kontakt Akgarten <kontakt@akgarten.com>',
      to: [targetEmail],
      subject: `Anfrage von ${data.name} – ${data.inquiryType || 'Kontaktformular'}`,
      text: emailBody,
      html: emailHtml,
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

// Endpoint do czatu OpenAI
app.post('/api/chat', chatLimiter, async (req, res) => {
  try {
    const parsed = ChatPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Messages sind erforderlich.' });
    }
    const { messages } = parsed.data;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
    });

    const content = completion.choices?.[0]?.message?.content ?? '';
    return res.status(200).json({ text: content });
  } catch (err) {
    console.error('OpenAI Fehler:', err);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Prosty HTML escaper (wystarczy na nasze potrzeby)
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Start serwera
app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
