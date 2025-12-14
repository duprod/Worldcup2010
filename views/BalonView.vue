<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import GlitchText from '../components/GlitchText.vue'; 

// --- Estados y Refs ---
const mouseX = ref(0);
const mouseY = ref(0);
const rotationX = ref(0);
const rotationY = ref(0);
const hasMoved = ref(false); 
const corruptionLevel = ref(0); 
const audioGlitchInterval = ref(null);

let fanAudio = null; 
let goalAudio = null; 
const isGoalScored = ref(false); 

// --- FUNCIÓN PARA CONTROLAR EL VOLUMEN (Basado en la posición X) ---
const updateVolumeAndCorruption = (xPos) => {
    const viewportWidth = window.innerWidth;
    const criticalZoneStart = viewportWidth * 0.4; 
    
    // 1. CÁLCULO DE VOLUMEN
    let distanceToGoal = Math.max(0, xPos - criticalZoneStart);
    const normalizedVolume = Math.min(1, distanceToGoal / (viewportWidth * 0.6));
    const goalMultiplier = isGoalScored.value ? 0.05 : 1.0; 
    
    if (fanAudio) {
      const newVolume = (0.01 + (normalizedVolume * 0.99)) * goalMultiplier;
      fanAudio.volume = newVolume;
    }
    
    // 2. CÁLCULO DE CORRUPCIÓN
    const distanceToOrigin = Math.min(viewportWidth * 0.4, viewportWidth - xPos);
    corruptionLevel.value = Math.min(100, (viewportWidth - xPos) / (viewportWidth) * 100); 
};

// --- FUNCIÓN PARA MARCAR EL GOL (El Colapso del Sistema) ---
const scoreGoal = () => {
    if (!goalAudio || isGoalScored.value) return;

    isGoalScored.value = true;
    
    goalAudio.volume = 1.0; 
    goalAudio.playbackRate = 0.8; 
    goalAudio.currentTime = 0; 
    goalAudio.play().catch(e => console.error("Fallo al iniciar audio de gol:", e));
    
    setTimeout(() => {
        isGoalScored.value = false;
        goalAudio.pause();
        goalAudio.playbackRate = 1.0; 
    }, 4000); 
};

// --- LÓGICA DEL GLITCH DE AUDIO (Simulación de ruido y estática) ---
const startAudioGlitch = () => {
    audioGlitchInterval.value = setInterval(() => {
        if (fanAudio && !isGoalScored.value) {
            if (fanAudio.volume < 0.1) {
                 fanAudio.playbackRate = Math.random() < 0.2 ? 0.5 : 1.0; 
                 fanAudio.volume = Math.random() * 0.15; 
            } else {
                 fanAudio.playbackRate = 1.0; 
            }
        }
    }, 100); 
};

// --- LÓGICA DE INTERACCIÓN ---
const handleMouseMove = (event) => {
    if (!hasMoved.value) {
        hasMoved.value = true;
        if (fanAudio) {
            fanAudio.play().catch(e => console.error("Fallo al iniciar audio:", e));
        }
    }
    
    mouseX.value = event.clientX;
    mouseY.value = event.clientY;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    rotationY.value = (event.clientX - centerX) / 25; 
    rotationX.value = -(event.clientY - centerY) / 25; 
    
    updateVolumeAndCorruption(event.clientX); 
};


// --- CICLO DE VIDA (Audio y Listeners) ---
onMounted(() => {
    fanAudio = new Audio('/aficion.mp3'); 
    fanAudio.loop = true; 
    fanAudio.volume = 0.01; 
    
    goalAudio = new Audio('/golefecto.mp3'); 

    window.addEventListener('mousemove', handleMouseMove);
    startAudioGlitch();
});

onBeforeUnmount(() => {
    window.removeEventListener('mousemove', handleMouseMove);
    if (fanAudio) fanAudio.pause();
    if (goalAudio) goalAudio.pause();
    if (audioGlitchInterval.value) clearInterval(audioGlitchInterval.value);
});

// Estilo dinámico para la imagen de la pelota (Glitch Visual)
const getBallGlitchStyle = () => {
    const level = corruptionLevel.value / 100; // 0 a 1
    
    return {
        // La pelota se mantiene en B/N pero su corrupción (saturate, hue-rotate) aún funciona
        'filter': `
            grayscale(100%)
            saturate(${1 - level * 0.8}) 
            hue-rotate(${level * 180}deg) 
            contrast(${1 + level * 0.3})
            blur(${level * 1}px)
        `,
        'transform': `
            translateZ(0) 
            rotateX(${rotationX.value}deg) 
            rotateY(${rotationY.value}deg) 
            translateX(${level * 5}px)
        `,
        'box-shadow': `
             0 0 10px rgba(${level * 255}, 0, 0, ${level * 0.5})
        `
    };
};
</script>

<template>
  <div class="jabulani-view-container netart-container">
    
    <GlitchText 
      :text="corruptionLevel.toFixed(0) > 50 ? 'JABULANI >> DATOS ERRÓNEOS' : 'JABULANI // INTERFAZ ROTA'" 
      class="view-title glitch-title" 
      :class="{'severe-glitch': corruptionLevel.toFixed(0) > 80}"
    />

    <p class="subtitle">
        {{ hasMoved ? 'Mueve el cursor hacia la derecha para la simulación...' : 'Inicia la Inmersión. Cualquier movimiento es relevante.' }}
        <span v-if="hasMoved"> | Ruido: {{ corruptionLevel.toFixed(0) }}%</span>
    </p>

    <div 
      class="jabulani-object"
      :class="{'visible': hasMoved}"
      :style="{ 
        transform: `translate(${mouseX - 100}px, ${mouseY - 100}px)`,
        left: '0', 
        top: '0',
        zIndex: 100 
      }"
    >
      <img 
        src="/images/pelota.png" 
        alt="Balón Jabulani Corrupto" 
        class="ball-image"
        :style="getBallGlitchStyle()"
      >
    </div>

    <button 
        id="goal-button"
        @click="scoreGoal"
        :disabled="isGoalScored"
        :class="{'scored-error': isGoalScored}"
    >
        {{ isGoalScored ? '>>> G⚽L <ERROR>' : 'GOL // Fallo del Sistema' }}
    </button>

    <div 
        class="goal-zone-indicator" 
        :class="{'goal-flash': isGoalScored}"
    >
        <span v-if="isGoalScored" class="goal-text-overlay">DATA SURGE</span>
    </div>
    
  </div>
</template>

<style scoped>
/* ============================================== */
/* --- ESTILOS: NET ART / INTERFAZ ROTA / SONIDO --- */
/* ============================================== */

/* El contenedor principal mantiene la apariencia general oscura */
.netart-container {
  min-height: 100vh;
  padding: 50px 20px;
  color: #dddddd; 
  font-family: 'Courier New', monospace; 
  text-align: center;
  position: relative; 
  overflow: hidden;
  
  background-color: #000; 
  cursor: none; 
  filter: contrast(1.2); 
}

/* Pseudo-elemento para el fondo B/N */
.netart-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/images/campo.png'); 
    background-size: cover;
    background-position: center left; 
    
    /* --- MODIFICACIÓN CLAVE AQUÍ --- */
    /* Usamos multiple filtros para controlar la oscuridad y el contraste del B/N */
    filter: 
        grayscale(90%)        /* 90% B/N (Permite un TINTE de color si quieres) */
        contrast(1.5)         /* Aumenta mucho el contraste (líneas más blancas, fondo más negro) */
        brightness(0.7);      /* Oscurece el fondo */
        
    z-index: 0;
}

/* Aseguramos que el contenido esté encima del pseudo-elemento */
.view-title, .subtitle, .jabulani-object, #goal-button, .goal-zone-indicator {
    position: relative;
    z-index: 2; 
}


/* --- TÍTULO: CLAVE PARA LA CONSISTENCIA DE ERROR Y LEGIBILIDAD --- */
.glitch-title { 
  color: #ff00ff; 
  
  /* Sombra de texto múltiple para crear un fuerte contorno negro y un resplandor magenta */
  text-shadow: 
    -2px -2px 0 #000, 
    2px -2px 0 #000, 
    -2px 2px 0 #000, 
    2px 2px 0 #000,  /* Sombra negra para borde 4 direcciones */
    0 0 18px rgba(255, 0, 255, 1), /* Resplandor intenso Magenta */
    0 0 25px rgba(255, 0, 255, 0.7); 
    
  transition: all 0.1s;
}

.severe-glitch {
    color: #ff0000; 
    animation: text-shake 0.1s infinite alternate;
}

.subtitle {
  color: #00ff00; /* Verde: estado de sistema */
  margin-bottom: 40px;
  font-size: 0.9em;
  letter-spacing: 0.2em;
}

/* El Objeto Jabulani (La distorsión del cursor) */
.jabulani-object {
  position: absolute;
  pointer-events: none; 
  z-index: 100; 
  opacity: 0;
  transition: opacity 0.5s ease;
  perspective: 1000px; 
}

.jabulani-object.visible {
    opacity: 1;
}

.ball-image {
  width: 200px; 
  height: 200px;
  opacity: 1.0; 
  border-radius: 50%;
  border: 5px dashed #ff0000; 
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
  transition: all 0.1s linear; 
}

/* Indicador de Zona de Gol (El borde de la realidad) */
.goal-zone-indicator {
    position: absolute;
    right: 0;
    top: 0;
    width: 60%; 
    height: 100%;
    border-left: 5px dashed #00ff00; 
    background-color: rgba(0, 255, 0, 0.05); 
    pointer-events: none;
}

.goal-flash {
    background-color: rgba(255, 0, 0, 0.3); 
    animation: flash 0.1s infinite alternate;
}

.goal-text-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 5em;
    color: white;
    text-shadow: 0 0 20px #ff0000;
    opacity: 0.8;
}

/* --- ESTILO PARA EL BOTÓN (Punto de Falla) --- */
#goal-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 50px;
    z-index: 101; 
    padding: 20px 40px;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    background-color: #000000; 
    color: #ff00ff; /* Magenta */
    border: 3px solid #ff00ff;
    border-radius: 0; 
    box-shadow: 0 0 15px rgba(255, 0, 255, 0.7);
    transition: all 0.1s linear;
}

#goal-button:hover:not(:disabled) {
    background-color: #111111;
    color: #00ffff; 
    border-color: #00ffff;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.9);
    transform: translateY(-50%) skewX(2deg); 
}

.scored-error {
    cursor: wait;
    background-color: #ff0000; 
    color: #ffffff;
    border-color: #ffffff;
    animation: critical-error 0.05s infinite alternate;
}

/* ------------------ */
/* --- ANIMACIONES --- */
/* ------------------ */

@keyframes text-shake {
    0% { transform: translate(1px, 0); }
    100% { transform: translate(-1px, 0); }
}

@keyframes flash {
    from { opacity: 1; }
    to { opacity: 0.8; }
}

@keyframes critical-error {
    from { 
        box-shadow: 0 0 30px #ff0000, 0 0 5px #ffffff;
        transform: translateY(-50%) scale(1.05) skewX(-1deg);
    }
    to {
        box-shadow: 0 0 10px #ff0000;
        transform: translateY(-50%) scale(1.0) skewX(1deg); 
    }
}
</style>