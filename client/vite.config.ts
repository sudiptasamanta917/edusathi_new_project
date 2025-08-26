import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const serverTarget = env.VITE_SERVER_URL || 'http://localhost:3001';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['lucide-react', '@radix-ui/react-dialog'],
          },
        },
      },
    },
    server: {
      proxy: {
        '/api': {
          target: serverTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
