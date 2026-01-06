import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

// Cloud Run sets PORT. If missing (local), default to 8080.
const PORT = Number.parseInt(process.env.PORT || '8080', 10);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

// Simple health check for Cloud Run
app.get('/healthz', (_req, res) => {
  res.status(200).json({ ok: true });
});

// Server-side Gemini proxy (keeps API key secret)
app.post('/api/gemini', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Missing GEMINI_API_KEY on server' });
      return;
    }

    const question = (req.body?.question ?? '').toString().trim();
    if (!question) {
      res.status(400).json({ error: 'Missing question' });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });

    const system =
      'You are a document assistant for the South African IMPCG 2024 (maternal and perinatal care). ' +
      'Answer by summarising guideline concepts at a high level. ' +
      'Do NOT give personalised medical advice, diagnoses, or dosing for a specific patient. ' +
      'Always remind the user to verify against the official guideline and local protocols.';

    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

    const response = await ai.models.generateContent({
      model,
      contents: [
        { role: 'user', parts: [{ text: `${system}\n\nQuestion: ${question}` }] },
      ],
    });

    res.status(200).json({ text: response.text ?? '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err?.message ?? 'Server error' });
  }
});

// Serve the built app
const distDir = path.join(__dirname, 'dist');
app.use(express.static(distDir));

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`IMPCG PWA listening on :${PORT}`);
});
