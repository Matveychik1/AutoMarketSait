
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // React + Tailwind CSS v4
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    // Підключення до ASP.NET Core Web API

    proxy: {
      '/api': {
        target: 'https://localhost:7042',
        changeOrigin: true,
        secure: false,
      },

      '/uploads': {
        target: 'https://localhost:7042',
        changeOrigin: true,
        secure: false,
      },
    },


    // Ігноруємо файли Visual Studio та C# бекенду
    watch: {
      ignored: [
        '**/backend/**',
        '**/.vs/**',
        '**/bin/**',
        '**/obj/**',
      ],
    },
  },
});
