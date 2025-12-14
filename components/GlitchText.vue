<script setup>
// Propiedad que recibe el texto
const props = defineProps({
  text: {
    type: String,
    required: true
  }
})
// NOTA: El script de caos/glitch ha sido eliminado
</script>

<template>
  <h1 class="glitch-effect">
    {{ text }}
  </h1>
</template>

<style scoped>
/* ============================================== */
/* --- ESTILO: Bitcount Prop Single (Display Roto) --- */
/* ============================================== */

.glitch-effect {
  /* --- CAMBIO CLAVE: APLICACIÓN DE LA FUENTE BITCOUNT --- */
  font-family: 'Bitcount Prop Single', monospace; 
  
  /* Color: Alto contraste */
  color: #111111; 
  
  /* Diseño: Seriedad y Estructura (ajustado para la fuente Bitcount) */
  letter-spacing: 0.4em; 
  text-transform: uppercase;
  font-size: 2.8em; 
  font-weight: 500; 
  
  /* Posicionamiento y Estabilidad */
  position: relative;
  text-align: center;
  margin: 0.5em 0;
  padding: 0;
  line-height: 1.2;
  transition: all 0.3s ease-out; 
}

/* Mantenemos un hover sutil: Simula el enfoque del cursor de terminal */
.glitch-effect:hover {
    color: #000000; /* Negro puro */
    letter-spacing: 0.45em; 
}
/* NOTA: Eliminamos las reglas ::before, ::after y @keyframes */
</style>