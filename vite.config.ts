/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  // CRITICAL for the host containers: Polkadot Desktop serves the product from
  // `polkadot://<name>.<tld>` and the browser shell serves it from a sandboxed
  // subdomain. Absolute asset paths ("/assets/...") resolve against the shell's
  // root in both, not the product's, so every chunk 404s. Relative paths are
  // also what the DotNS/IPFS publish expects.
  base: './',
  resolve: {
    alias: { '@': resolve(__dirname, './src') }
  },
  build: {
    // No inlined assets: the host containers serve the product under a strict
    // CSP, and an inlined data: URI script or style is refused.
    assetsInlineLimit: 0,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
