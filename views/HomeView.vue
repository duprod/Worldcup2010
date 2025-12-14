<script setup>
import GlitchText from '../components/GlitchText.vue' 
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router'; 

const router = useRouter(); 

let vuvuzelaAudio = null;
const isNoiseActive = ref(false);       
const isTraumaActive = ref(false);      
const hasExperiencedNoise = ref(false); 

// --- Lógica de Control de Audio / Ruido ---

const handleAudioEnd = () => {
    isNoiseActive.value = false;
    isTraumaActive.value = false;
    hasExperiencedNoise.value = true;
};

const stopNoise = () => {
    if (vuvuzelaAudio && isTraumaActive.value) {
        vuvuzelaAudio.pause(); // Dispara onpause, que llama a handleAudioEnd
    }
};

onMounted(() => {
    vuvuzelaAudio = new Audio('/vuvucela.mp3'); 
    vuvuzelaAudio.volume = 0.8; 
    vuvuzelaAudio.loop = true; 
    
    vuvuzelaAudio.onpause = handleAudioEnd;
    vuvuzelaAudio.load();
});

onBeforeUnmount(() => {
    if (vuvuzelaAudio) {
        vuvuzelaAudio.pause();
        vuvuzelaAudio.onpause = null;
    }
});

// Función que se llama al hacer clic en el botón
const handleInitialClick = async () => {
    if (isTraumaActive.value) {
        // --- Fase 2: Detener Ruido y Navegar ---
        stopNoise(); 
        
        await nextTick();
        
        router.push('/clasificacion');
        
    } else if (!hasExperiencedNoise.value) {
        // --- Fase 1: Activar el Ruido (Primer clic) ---
        isNoiseActive.value = true;
        isTraumaActive.value = true;
        
        try {
            vuvuzelaAudio.currentTime = 0; 
            await vuvuzelaAudio.play();
        } catch (error) {
            console.warn("Navegador bloqueó el audio. Simulando trauma visual:", error);
            setTimeout(stopNoise, 1500); 
        }
    } else {
         // --- Fase 3: Navegar (Clic después del trauma) ---
         router.push('/clasificacion');
    }
};

// Lógica para el texto del botón
const buttonText = computed(() => {
    if (isTraumaActive.value && isNoiseActive.value) {
        return 'CLIC PARA DETENER RUIDO >> NAVEGAR';
    }
    if (hasExperiencedNoise.value) {
        return 'VER REGISTRO FRAGMENTADO >>';
    }
    return 'CLIC PARA ACTIVAR EL TRAUMA SONORO';
});
</script>

<template>
  <div 
    class="home-view-container netart-container"
    :class="{'noise-active-bg': isNoiseActive}"
  >
    
    <GlitchText 
      :text="isNoiseActive ? 'NOISE INPUT: 404' : 'MUNDIAL 2010'" 
      class="title-main glitch-title" 
      :class="{'glitch-active-title': isNoiseActive}"
    />

    <p class="reflection-text netart-reflection">
        EL EVENTO HA TERMINADO. SÓLO QUEDA LA ESTRUCTURA <span :class="{'corrupted-word': isNoiseActive}">DAÑADA.</span>
    </p>

    <div class="interactive-zone">
      <p class="instruction-text netart-instruction">
        {{ isTraumaActive ? '¡INFORME SONORO EN PROCESO! Detenga el ruido para acceder.' : 'INTERFACE_DORMANT | Active el ruido para acceder al registro.' }}
      </p>
      
      <button
        class="nav-link netart-link"
        @click="handleInitialClick"
        :class="{
            'noise-playing': isTraumaActive,
            'link-ready': hasExperiencedNoise && !isTraumaActive
        }"
      >
        <span :class="{'noise-text-effect': isTraumaActive}">
            {{ buttonText }}
        </span>
      </button>
    </div>

    <div class="abstract-line" :class="{'noise-line-active': isNoiseActive}"></div>
    
  </div>
</template>

<style scoped>
/* ============================================== */
/* --- ESTILOS: NET ART / ESTRUCTURA VACÍA --- */
/* ============================================== */

/* Base y Tipografía (Fondo Negro, Tipografía de Consola/Sistema) */
.netart-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around; 
  padding: 80px 20px; 
  
  background-color: #000000; /* FONDO NEGRO PURO */
  color: #cccccc; 
  font-family: 'Consolas', monospace; 
  text-align: center;
  
  transition: filter 0.1s linear; 
  filter: contrast(1.2); /* Mantenemos el contraste de la interfaz */
}

/* ELIMINACIÓN DEL PSEUDO-ELEMENTO DE FONDO (YA NO ES NECESARIO) */
/* .netart-container::before { ... } */


/* Efecto de corrupción en el fondo cuando hay ruido */
.noise-active-bg {
    filter: blur(0.5px) contrast(1.1) brightness(1.2) hue-rotate(-5deg);
}

/* Aseguramos que el contenido esté encima del fondo */
.view-title, .subtitle, .interactive-zone, .abstract-line {
    position: relative;
    z-index: 2; 
}


/* --- TÍTULO: SIN CONTORNO DE ALTO CONTRASTE --- */
.glitch-title {
  font-size: 3.5vw; 
  font-weight: 700;
  margin-bottom: 20px;
  color: #ff00ff; /* Magenta */
  
  text-shadow: 
    0 0 15px rgba(255, 0, 255, 0.8),
    0 0 5px rgba(255, 0, 255, 0.5); /* Resplandor Magenta/Neón */
  
  letter-spacing: 0.2em;
  transition: color 0.1s;
}

.glitch-active-title {
    color: #ff0000; /* Rojo cuando el ruido domina */
    animation: text-glitch-quick 0.05s infinite alternate;
}

/* Frase de Reflexión (Metadato) */
.netart-reflection {
  font-size: 1.1em;
  color: #00ffaa; /* Cian de sistema */
  text-transform: uppercase; 
  margin: 20px 0 50px 0;
  letter-spacing: 0.2em;
}

.corrupted-word {
    color: #ff0000;
    font-weight: bold;
    animation: text-glitch-quick 0.2s infinite alternate;
}

/* Zona Interactiva */
.netart-instruction {
  color: #ff8800; /* Naranja de advertencia */
  font-size: 1em;
  margin-bottom: 30px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

/* Botón de Navegación (Estilo de botón de terminal/comando) */
.netart-link {
  /* Resetear estilos de botón/enlace */
  border: none;
  background-color: transparent;
  padding: 0;
  margin: 0;
  
  /* Estilos principales */
  color: #ffffff; 
  text-decoration: none;
  border: 2px solid #ffffff; 
  padding: 15px 35px;
  transition: all 0.2s ease;
  font-size: 1.2em;
  font-weight: 400;
  letter-spacing: 0.3em;
  cursor: pointer;
  
  text-align: center;
}

.netart-link:hover {
  background-color: #ffffff;
  color: #000000; 
  border-color: #000000;
}

/* Estado de RUIDO ACTIVO */
.noise-playing {
    border-color: #ff0000 !important;
    color: #ff0000 !important;
    background-color: rgba(255, 0, 0, 0.1);
    animation: critical-error 0.5s infinite alternate;
}

/* Texto del enlace con efecto de ruido */
.noise-text-effect {
    color: #ff0000; 
    animation: text-glitch-quick 0.05s infinite alternate;
}

/* Estado de PREPARADO PARA NAVEGAR */
.link-ready {
    border-color: #00ffaa !important;
    color: #00ffaa !important;
    opacity: 1 !important;
    animation: none !important;
}

.link-ready:hover {
    background-color: #00ffaa !important;
    color: #000000 !important;
}

/* Elemento Abstracto de Separación (Medidor de Ruido) */
.abstract-line {
    width: 200px;
    height: 5px;
    background-color: #003333; 
    margin-top: 50px;
    transition: background-color 0.1s, transform 0.1s;
}

.noise-line-active {
    background-color: #ff0000; 
    transform: scaleX(2.5) skewX(1deg); 
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.7);
}

/* --- ANIMACIONES --- */
@keyframes text-glitch-quick {
    0% { transform: skewX(1deg) translateX(1px); }
    100% { transform: skewX(-1deg) translateX(-1px); }
}

@keyframes critical-error {
    from { 
        box-shadow: 0 0 15px #ff0000;
    }
    to {
        box-shadow: 0 0 5px #ff0000;
    }
}
</style>