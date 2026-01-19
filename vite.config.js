import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  // IMPORTANT for GitHub Pages:
  // This must match your repository name exactly.
  // Your site URL in the screenshot is:
  // https://max959954.github.io/fronted_final_project/
  // so the base path is "/fronted_final_project/".
  base: '/fronted_final_project/',

  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
