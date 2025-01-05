import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base:"/",
  build: {
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@components': '/src/components',
      '@redux': '/src/redux',
      '@services': '/src/services',
      '@utils': '/src/utils',
      '@routes': '/src/routes',
      '@': path.resolve(__dirname, './src'),
       '@coreui': 'node_modules/@coreui',
      
    }
  },
  server:{
    port:5173,
    open:true,
  }
});
