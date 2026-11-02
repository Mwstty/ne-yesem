import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
try { process.loadEnvFile(path.join(root, '.env')); } catch { /* .env yok: demo modu */ }

const { recommend } = await import('./recommend.js');
const { fetchPhoto } = await import('./places.js');

const app = express();
app.use(express.json({ limit: '50kb' }));

app.get('/api/config', (_req, res) => {
  res.json({ mode: process.env.GOOGLE_MAPS_API_KEY ? 'live' : 'demo', ai: Boolean(process.env.AI_API_KEY) });
});

app.post('/api/recommend', async (req, res) => {
  try {
    res.json(await recommend(req.body ?? {}, process.env));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Beklenmeyen hata.' });
  }
});

app.get('/api/photo', async (req, res) => {
  const name = String(req.query.name ?? '');
  if (!process.env.GOOGLE_MAPS_API_KEY || !/^places\/[\w-]+\/photos\/[\w-]+$/.test(name)) return res.status(404).end();
  try {
    const { type, buf } = await fetchPhoto(process.env.GOOGLE_MAPS_API_KEY, name);
    res.set('Content-Type', type).set('Cache-Control', 'public, max-age=86400').send(buf);
  } catch { res.status(502).end(); }
});

const dist = path.join(root, 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

const port = Number(process.env.PORT) || 3000;
const server = app.listen(port, () => {
  console.log(`Ne Yesem? http://localhost:${port} adresinde çalışıyor.`);
  console.log(process.env.GOOGLE_MAPS_API_KEY ? 'Mod: GERÇEK VERİ (Google Places)' : 'API anahtarı eksik: GOOGLE_MAPS_API_KEY yok -> DEMO MODU');
  console.log(process.env.AI_API_KEY ? 'AI: aktif' : 'API anahtarı eksik: AI_API_KEY yok -> kural tabanlı seçim');
});
server.on('error', (e) => {
  console.error(e.code === 'EADDRINUSE' ? `HATA: ${port} portu zaten kullanımda. Ne Yesem? zaten açık olabilir.` : e.message);
  process.exit(1);
});
