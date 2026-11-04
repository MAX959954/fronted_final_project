import { fileURLToPath, URL } from 'node:url'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { imagetools } from 'vite-imagetools'

// GitHub Pages only knows real files, so /catalog or /product/ember-lp opened directly
// (or after F5) would be a 404. Pages serves 404.html for every unknown path: making it a
// copy of index.html boots the app there, and Vue Router renders the requested route.
function spaFallback() {
  let outDir
  return {
    name: 'spa-fallback-404',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the site from https://max959954.github.io/fronted_final_project/,
  // so every asset URL needs the repository name as its base path.
  base: '/fronted_final_project/',

  plugins: [vue(), vueDevTools(), imagetools(), spaFallback()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
