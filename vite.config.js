import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/linux-security-audit-and-monitoring/',
  plugins: [react()],
})
