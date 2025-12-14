// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // <--- 1. Importar el router

const app = createApp(App)

app.use(router) // <--- 2. Usar el router en la aplicación
app.mount('#app')
