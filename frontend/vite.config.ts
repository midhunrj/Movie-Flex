// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';
// import {viteCommonjs} from '@originjs/vite-plugin-commonjs';

// export default defineConfig({
//   plugins: [react(),viteCommonjs()],
//   base:"/",
//   build: {
//     outDir: 'dist',
//     sourcemap: true,
//     emptyOutDir: true,
//     rollupOptions: {
//       output: {
//         manualChunks(id) {
//           if (id.includes('node_modules')) {
//             return id
//               .toString()
//               .split('node_modules/')[1]
//               .split('/')[0]
//               .toString();
//           }
//         },
//       },
//     },
//   },
//   resolve: {
//     alias: {
//       '@components': '/src/components',
//       '@redux': '/src/redux',
//       '@services': '/src/services',
//       '@utils': '/src/utils',
//       '@routes': '/src/routes',
//       '@': path.resolve(__dirname, './src'),
//        '@coreui': 'node_modules/@coreui',
      
//     }
//   },
//   server:{
//     port:5173,
//     open:true,
//   },
//   optimizeDeps: {
//     exclude: ['pdfkit','jspdf']  // Example: Exclude problematic dependencies (replace pdfkit with the actual one if identified)
//   }
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base:"/",
  build: {
    outDir: 'build',
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      external: ['pdfkit'], // Replace 'pdfkit' with the problematic library
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@redux': path.resolve(__dirname, './src/redux'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@routes': path.resolve(__dirname, './src/routes'),
    },
  },
  
  server:{
    port:5173,
    open:true,
  }
});