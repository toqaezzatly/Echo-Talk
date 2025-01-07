import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_REACT_APP_BASE_URL': JSON.stringify(env.VITE_REACT_APP_BASE_URL || 'http://localhost:4000'),
    },
  };
});