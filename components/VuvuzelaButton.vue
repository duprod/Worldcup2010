<script setup>
import { ref, onMounted } from 'vue'

const isPlaying = ref(false)
let vuvuzelaAudio = null

// Inicializamos el objeto de audio al montar el componente
onMounted(() => {
  // La ruta debe apuntar al archivo en la carpeta 'public'
  vuvuzelaAudio = new Audio('/vuvuzela.mp3') 
  vuvuzelaAudio.loop = true // Net.Art: ¡Hacemos que el ruido sea infinito!
});

const playVuvuzela = () => {
  if (!vuvuzelaAudio) return;

  if (!isPlaying.value) {
    // Intentar reproducir. Manejamos el error si el navegador lo bloquea.
    vuvuzelaAudio.play().catch(error => {
      console.error("Fallo al reproducir audio:", error);
      alert("¡El navegador bloqueó el caos sonoro! Haga otro clic.");
    });
    isPlaying.value = true;
  } else {
    // Detener y rebobinar para que la próxima vez empiece desde el inicio
    vuvuzelaAudio.pause();
    vuvuzelaAudio.currentTime = 0; 
    isPlaying.value = false;
  }
};
</script>

<template>
  <button @click="playVuvuzela" class="vuvuzela-btn">
    {{ isPlaying ? '🔇 SILENCIO (FALLO DE SISTEMA)' : '🔊 INICIAR CAOS SONORO' }}
  </button>
</template>

<style scoped>
.vuvuzela-btn {
  /* Estilo que evoque la vuvuzela o un botón de advertencia */
  background-color: #ff0000; /* Fondo rojo de peligro */
  color: #00ff00; /* Texto verde de terminal */
  border: 4px dashed #00ff00;
  padding: 15px 30px;
  font-size: 1.2em;
  font-family: 'Courier New', monospace;
  cursor: crosshair; /* Cursor que confunde */
  box-shadow: 0 0 10px #ff0000;
  /* Parpadeo rápido y molesto */
  animation: aggressive-blink 0.3s infinite alternate; 
}

@keyframes aggressive-blink {
    from { opacity: 1; transform: scale(1.0); }
    to { opacity: 0.7; transform: scale(1.05); }
}
</style>