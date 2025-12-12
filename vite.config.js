import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import pkg from './package.json';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
    define: {
    __APP_VERSION__: JSON.stringify(pkg.version)
  }
})