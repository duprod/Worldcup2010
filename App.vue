<script setup>
// Script minimalista: no necesita lógica global específica
</script>

<template>
  <nav class="minimal-nav netart-nav">
    <router-link to="/" class="nav-item netart-item">INICIO</router-link>
    <span class="separator netart-separator">//</span>
    
    <router-link to="/balon" class="nav-item netart-item">JABULANI</router-link>
    <span class="separator netart-separator">//</span>
    
    <router-link to="/estadios" class="nav-item netart-item">ESTADIOS</router-link>
    <span class="separator netart-separator">//</span>
    
    <router-link to="/grupos" class="nav-item netart-item">GRUPOS</router-link>
    <span class="separator netart-separator">//</span>
    
    <router-link to="/eliminatorias" class="nav-item netart-item">ELIMINATORIAS</router-link>
    <span class="separator netart-separator">//</span>
    
    <router-link to="/stats" class="nav-item netart-item">DATOS</router-link>
    <span class="separator netart-separator">//</span>
    
    <router-link to="/clasificacion" class="nav-item netart-item">CLASIFICACIÓN</router-link>
  </nav>

  <router-view></router-view>
</template>

<style>
/* --- INICIO: Importación de fuente para Net Art (Bitcount Prop Single) --- */
@import url('https://fonts.googleapis.com/css2?family=Bitcount+Prop+Single:wght@100..900&display=swap');

/* ⚠️ ESTILOS GLOBALES: Aplicamos el fondo y tipografía de Net Art a toda la app */
body {
  background-color: #000000; /* Fondo negro puro para la estética de terminal */
  color: #cccccc; /* Texto gris de sistema */
  /* Aplicamos la fuente Bitcount Prop Single */
  font-family: 'Bitcount Prop Single', monospace; 
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
</style>

<style scoped>
/* ============================================== */
/* --- ESTILOS: NET ART / INTERFAZ DE COMANDO --- */
/* ============================================== */

.netart-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  background-color: #0d0d0d; /* Fondo negro oscuro */
  
  /* Borde de datos corruptos */
  border-bottom: 2px dashed #ff00ff; 
  
  font-size: 0.8em;
  font-weight: 400;
  
  /* Sombra/resplandor sutil de error */
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.2); 
  
  /* Aseguramos que el contenido fluya si hay demasiados elementos */
  flex-wrap: wrap; 
}

.netart-item {
  color: #00ffaa; /* Cian/Verde de datos */
  text-decoration: none;
  padding: 5px 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em; 
  transition: all 0.1s ease-out; /* Transición rápida para el glitch visual */
  
  /* Estilo de comando */
  border: 1px dotted transparent; 
  
  /* Aseguramos que los items también usen Bitcount, por si el body tiene fallbacks */
  font-family: 'Bitcount Prop Single', monospace; 
}

.netart-item:hover,
/* Estilo del enlace activo: Magenta de error */
.router-link-active {
  color: #ff00ff; 
  font-weight: 700;
  background-color: rgba(255, 0, 255, 0.1); 
  /* Efecto de marco de comando activo */
  border: 1px solid #ff00ff; 
  transform: scale(1.05);
}

.netart-separator {
  color: #888888; /* Separador de estructura */
  padding: 0 8px;
  font-weight: 300;
}
</style>