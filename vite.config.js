import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [react()],
    server: {
      port: 3001,
      open: !process.env.VERCEL,
    },
    build: {
      outDir: 'dist', // Vercel expects 'dist' by default
      sourcemap: isProduction ? false : 'inline',
      minify: isProduction ? 'esbuild' : false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            vendor: ['framer-motion', 'three'],
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    define: {
      'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
    },
  };
});
