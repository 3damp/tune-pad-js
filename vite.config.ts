import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/tune-pad-js/',
  resolve: {
    alias: {
      src: '/src',
    },
  },
})
