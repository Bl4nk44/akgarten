import express from 'express';
import chokidar from 'chokidar';
import path from 'path';

const app = express();
const port = 3001; // API server on a separate port

app.use(express.json({ limit: '10mb' }));

const API_DIR = path.join(process.cwd(), 'api');

let apiHandler;

async function loadApiHandler() {
  try {
    // Bust the cache
    const modulePath = `file://${path.join(API_DIR, 'chat.ts')}?t=${Date.now()}`;
    const module = await import(modulePath);
    apiHandler = module.default;
    console.log('✅ API handler loaded successfully.');
  } catch (error) {
    console.error('❌ Failed to load API handler:', error);
    apiHandler = (req, res) => {
      res.status(500).json({ error: 'Failed to load API handler.' });
    };
  }
}

app.all('/api/chat', (req, res) => {
  if (apiHandler) {
    apiHandler(req, res);
  } else {
    res.status(503).json({ error: 'API handler not loaded yet.' });
  }
});

// Watch for changes in the API directory
chokidar.watch(API_DIR).on('all', (event, path) => {
  if (path.endsWith('.ts')) {
    console.log(`🔄 Detected change in ${path}, reloading API handler...`);
    loadApiHandler();
  }
});

app.listen(port, () => {
  console.log(`🚀 API server listening on http://localhost:${port}`);
  loadApiHandler();
});
