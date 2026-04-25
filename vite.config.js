import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/linux-security-audit-and-monitoring/',
  plugins: [react()],
})
