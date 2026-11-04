import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // Stores and i18n touch localStorage and <html lang>, so tests need a DOM.
      environment: 'jsdom',
      include: ['src/**/*.spec.js'],
    },
  }),
)
