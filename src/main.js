import { createApp } from 'vue'
import App from './App.vue'
import router from './router'   // now this file exists

import "@/styles/experience_page.css";
import "@/styles/main_page.css"

createApp(App).use(router).mount('#app')
