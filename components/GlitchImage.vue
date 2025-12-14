<script setup>
// Propiedades para recibir la ruta de la imagen y el texto alternativo
defineProps({
  src: String,
  alt: String
})
</script>

<template>
  <div class="image-container">
    <img :src="src" :alt="alt" class="glitch-img" />
  </div>
</template>

<style scoped>
.image-container {
  max-width: 500px;
  height: auto;
  margin-top: 40px;
  overflow: hidden; 
  border: 3px solid #ff00ff; /* Marco glitch */
}

.glitch-img {
  width: 100%;
  display: block;
  /* Aplicar filtros CSS para simular corrupción de archivo y baja calidad */
  filter: hue-rotate(90deg) contrast(150%) blur(0.5px) saturate(0.5);
  animation: image-shift 15s infinite alternate-reverse; /* Movimiento lento y errático */
  transform-origin: center;
}

@keyframes image-shift {
  0% { transform: scale(1.1) translate(2px, -3px); }
  25% { transform: scale(1.0) translate(-5px, 5px); }
  50% { transform: scale(1.15) translate(0, 0); }
  75% { transform: scale(1.05) translate(8px, -8px); }
  100% { transform: scale(1.1) translate(2px, -3px); }
}
</style>