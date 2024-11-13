import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': '/src/components',
      '@redux': '/src/redux',
      '@services': '/src/services',
      '@utils': '/src/utils',
      '@routes': '/src/routes'
    }
  },
  server:{
    port:5173,
    open:true,
  }
});
