import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import reveal from './directives/reveal'
import { i18nReady } from './i18n'

import '@/styles/global.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('reveal', reveal)

// Mount once the visitor's language is in, so the first paint is already translated.
i18nReady.then(() => app.mount('#app'))
