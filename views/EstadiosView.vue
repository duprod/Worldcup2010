<script setup>
import GlitchText from '../components/GlitchText.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'; // Importamos ref y hooks de ciclo de vida.

// --- DATOS SUBVERTIDOS de los estadios del Mundial 2010 ---
const estadios = [
  { nombre: "Soccer City", ciudad: "Johannesburgo", capacity: "94,736", image: "/images/soccer.png", status: "FRAGMENTO_01" },
  { nombre: "Moses Mabhida Stadium", ciudad: "Durban", capacity: "62,760", image: "/images/MosesMabhida.png", status: "ERROR_404" },
  { nombre: "Green Point Stadium", ciudad: "Ciudad del Cabo", capacity: "64,100", image: "/images/greenpoint.png", status: "MEMORY_LEAK" },
  { nombre: "Ellis Park Stadium", ciudad: "Johannesburgo", capacity: "55,686", image: "/images/ellispark.png", status: "FRAGMENTO_02" },
  { nombre: "Loftus Versfeld Stadium", ciudad: "Pretoria", capacity: "51,760", image: "/images/LOFTUSVERSFELD_.png", status: "DATABEND_ACTIVE" },
  { nombre: "Nelson Mandela Bay Stadium", ciudad: "Puerto Elizabeth", capacity: "42,486", image: "/images/NelsonMandela.png", status: "CORRUPTED_FILE" },
];

// --- Lógica de Corrupción (Glitch temporal basado en sistema) ---

const isGlitching = ref(false);
const glitchInterval = ref(null);

// Función para activar y desactivar el Glitch aleatoriamente
const startSystemGlitch = () => {
  // El glitch ocurre cada 2-5 segundos
  glitchInterval.value = setInterval(() => {
    isGlitching.value = true;
    
    // El glitch dura solo 50ms (simulando un fallo rápido de renderizado)
    setTimeout(() => {
      isGlitching.value = false;
    }, 50);

  }, Math.random() * 3000 + 2000); // Intervalo aleatorio entre 2000ms y 5000ms
};

onMounted(() => {
  startSystemGlitch();
});

onBeforeUnmount(() => {
  // Limpiamos el intervalo al salir para evitar fugas de memoria
  if (glitchInterval.value) {
    clearInterval(glitchInterval.value);
  }
});

// Función que devuelve la clase condicional para la imagen
const getImageGlitchClass = (index) => {
    // Solo aplicamos el glitch si el estado global está activo.
    // Usamos el índice para que no todas las imágenes fallen a la vez, dando un efecto más orgánico.
    if (isGlitching.value && index % 2 === 0) {
        return 'active-glitch-shift';
    }
    if (isGlitching.value && index % 3 === 1) {
        return 'active-glitch-color';
    }
    return '';
};

</script>

<template>
  <div class="estadios-view-container netart-container">
    
    <GlitchText 
      text="ESTADIOS // ARCHIVO CORRUPTO" 
      class="view-title glitch-title" 
      :class="{'glitch-text-active': isGlitching}"
    />

    <p class="subtitle netart-subtitle">
      _La estructura física del recuerdo se presenta en su forma más pura y 
      <span :class="{'corrupt-text-active': isGlitching}">
        inestable.
      </span>
    </p>

    <div class="estadios-grid">
      <div 
        v-for="(estadio, index) in estadios" 
        :key="index" 
        class="stadium-card netart-card"
      >
        
        <div class="image-wrapper">
          <img 
            :src="estadio.image" 
            :alt="estadio.nombre" 
            class="stadium-image glitch-image"
            :class="getImageGlitchClass(index)"
          />
        </div>

        <h2 class="stadium-name">{{ estadio.nombre.toUpperCase() }}</h2>
        <p class="stadium-data">{{ estadio.ciudad }} | CAP: <span class="data-glitch">{{ estadio.capacity }}</span></p>
        <p class="stadium-status">{{ estadio.status }}</p>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* ============================================== */
/* --- ESTILOS: NET ART / GLITCH / DATA BENDING --- */
/* ============================================== */

/* * PALETA: Bajo contraste, estética de terminal y error de sistema. */
/* * Tipografía: Monoespaciada y fuentes sin serifa para una estética de terminal/web 1.0. */

.netart-container {
  /* Fondo oscuro y textura de "pantalla de error" */
  min-height: calc(100vh - 50px);
  padding: 50px 20px;
  background-color: #000000;
  color: #00ff00; /* Texto verde neon */
  font-family: 'Courier New', monospace; 
  text-align: center;
  filter: brightness(1.2) contrast(1.1); 
  cursor: default; /* Eliminamos el cursor de ratón para un glitch basado en el sistema */
}

/* Título */
.view-title {
  margin-bottom: 5px;
  color: #ff00ff;
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.5);
}

.glitch-text-active {
    animation: text-shake 0.05s infinite alternate;
}

/* Subtítulo */
.netart-subtitle {
  color: #00aaaa;
  margin-bottom: 50px;
  font-size: 0.9em;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

/* El texto inestable cambia de color y se distorsiona */
.corrupt-text-active {
    color: #ff0000;
    font-weight: bold;
    animation: flicker 0.05s infinite alternate; /* Animación más rápida para el glitch del sistema */
}

/* Grid y Tarjetas */
.estadios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.netart-card {
  border: 1px dashed #008800;
  padding-bottom: 15px;
  background-color: rgba(0, 50, 0, 0.2);
  overflow: hidden;
  transition: all 0.5s; /* Transición más lenta para destacar el glitch instantáneo */
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.1);
}

/* --- INTERACCIÓN: CORRUPCIÓN POR HOVER --- */
.netart-card:hover {
    /* Mueve la tarjeta ligeramente y cambia el borde (Data Break) */
    transform: translate(3px, -2px) rotate(0.5deg);
    border-color: #ff0000; /* Borde de error al interactuar */
    transition: transform 0.05s, border-color 0.05s; /* Transición muy rápida */
}

.netart-card:hover .glitch-image {
    /* La imagen sufre un glitch visual al enfocar */
    filter: hue-rotate(100deg) brightness(1.8) blur(0.5px);
    transform: scale(1.05) translate(-3px, 3px);
}

.netart-card:hover .stadium-name {
    /* El nombre tiembla */
    text-shadow: 0 0 5px #ff00ff;
    animation: text-shake 0.1s infinite alternate;
}
/* ------------------------------------------- */

.image-wrapper {
    overflow: hidden;
    margin-bottom: 10px;
    height: 200px; 
    border-bottom: 1px solid #00ff00;
}

/* Imagen: El corazón del Glitch */
.glitch-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: none; /* Quitamos la transición para que el glitch sea instantáneo y abrupto */
  filter: sepia(0.5) hue-rotate(180deg); /* Glitch inicial estático */
}

/* Clases de Corrupción aplicadas por JS */
.active-glitch-shift {
    transform: translate(5px, -3px) scale(1.05);
    filter: brightness(2) saturate(0.5);
}

.active-glitch-color {
    filter: hue-rotate(90deg) contrast(1.5) blur(1px);
    transform: skewX(-2deg);
}


/* Datos de texto */
.stadium-name {
    color: #ffffff;
    font-size: 1.1em;
    font-weight: 700;
    margin-top: 15px;
    letter-spacing: 0.2em;
    text-shadow: 0 0 2px #ff00ff;
}

.stadium-data {
    color: #00ff00;
    font-size: 0.85em;
    margin: 8px 0;
    letter-spacing: 0.1em;
}

/* Distorsión leve de los datos numéricos */
.data-glitch {
    color: #ff0000;
    font-style: italic;
    animation: data-shift 1s infinite step-end;
}

/* Nuevo estado: El metadato de corrupción */
.stadium-status {
    color: #ff8800;
    font-size: 0.7em;
    margin-top: 5px;
    padding-top: 5px;
    border-top: 1px dotted #ff8800;
    text-transform: uppercase;
}

/* ------------------ */
/* --- ANIMACIONES --- */
/* ------------------ */

/* Animación de Glitch/parpadeo para el texto inestable */
@keyframes flicker {
  0% { text-shadow: 0 0 1px #ff0000; }
  50% { text-shadow: 0 0 5px #ff0000; }
  100% { text-shadow: 0 0 1px #ff0000; }
}

/* Pequeño temblor del texto principal */
@keyframes text-shake {
    0% { transform: translateX(0.5px) translateY(0); }
    100% { transform: translateX(-0.5px) translateY(0.5px); }
}

/* Animación de cambio/salto de los datos numéricos */
@keyframes data-shift {
    0% { transform: translateX(0); }
    25% { transform: translateX(1px); }
    50% { transform: translateX(-1px); }
    75% { transform: translateX(2px); }
    100% { transform: translateX(0); }
}
</style>