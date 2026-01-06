import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    // If you ever use `npm run preview`, bind to $PORT on hosts like Render/Railway.
    preview: {
      host: '0.0.0.0',
      port: Number.parseInt(process.env.PORT || '4173', 10),
      strictPort: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
