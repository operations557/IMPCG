# Heferon — IMPCG Companion (PWA pilot)

A pilot **Vite + React** Progressive Web App that:
- embeds the **IMPCG 2024 PDF** in-app (with page jump),
- provides a small set of demo tools,
- includes a **secure Gemini proxy** so your API key stays server-side.

> PDF lives at `public/IMPCG_2024.pdf`

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Deploy (recommended: Vercel)

### 1) Environment variable
Set **GEMINI_API_KEY** in your deploy platform’s environment variables.

### 2) Vercel settings
- Build Command: `npm run build`
- Output Directory: `dist`
- Serverless endpoint: `POST /api/gemini`

This repo includes `vercel.json` so SPA routing works and `/api/*` routes to functions.

## Deploy (Render / Railway / Cloud Run)

This repo includes an optional Express server (`server.mjs`) that serves `dist/` and exposes `POST /api/gemini`.

- Build: `npm install && npm run build`
- Start: `npm start`

## Notes on security

Do **not** put `GEMINI_API_KEY` into Vite env variables that ship to the browser.
This code calls Gemini from the server-side endpoint (`/api/gemini`) instead.
