import express from 'express';

const app = express();
const port = 3001;

app.use(express.json({ limit: '10mb' }));

// Ten serwer był tylko do hot-reloadu /api/chat z Vercel edge. Usuwamy go, bo backend działa w ./backend.
app.get('*', (_req, res) => {
  res.status(410).json({ error: 'Endpoint entfernt. Verwenden Sie den Backend-Server unter /backend.' });
});

app.listen(port, () => {
  console.log(`Leerer Dev-Server läuft auf http://localhost:${port} (nur Platzhalter).`);
});
