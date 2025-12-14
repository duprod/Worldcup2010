// src/router/index.js

// 1. IMPORTAR LAS FUNCIONES DE VUE ROUTER
import { createRouter, createWebHistory } from 'vue-router'

// Importaciones de las vistas
import HomeView from '../views/HomeView.vue'
import EstadiosView from '../views/EstadiosView.vue'
import FaseGruposView from '../views/FaseGruposView.vue'
import EliminatoriasView from '../views/EliminatoriasView.vue'
import StatsView from '../views/StatsView.vue'
import BalonView from '../views/BalonView.vue'
// AÑADIDO: Importamos la nueva vista de Clasificación
import ClasificacionView from '../views/ClasificacionView.vue' 


const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/estadios', name: 'Estadios', component: EstadiosView },
  { path: '/grupos', name: 'FaseGrupos', component: FaseGruposView },
  { path: '/eliminatorias', name: 'Eliminatorias', component: EliminatoriasView },
  { path: '/stats', name: 'Stats', component: StatsView },
  { path: '/balon', name: 'Balón', component: BalonView },
  // AÑADIDO: Definición de la ruta para la Clasificación
  { path: '/clasificacion', name: 'Clasificacion', component: ClasificacionView },
]

// 2. CREAR EL OBJETO ROUTER
const router = createRouter({
  // Define el modo de historial
  history: createWebHistory(import.meta.env.BASE_URL), 
  routes // Usa el array de rutas que definiste
})

// 3. EXPORTAR POR DEFECTO
export default router