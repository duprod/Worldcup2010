<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import GlitchText from '../components/GlitchText.vue';

// Importar el nuevo JSON
// import estadisticasData from '/stats.json' // Se elimina la importación estática

// --- CAMBIOS CLAVE: Inicializamos los datos como refs vacíos ---
const estadisticasData = ref({ titulo: 'DATOS NO CARGADOS', categorias: [] }); // Placeholder/inicialización
const categorias = ref([]); // Inicialmente vacío
const isDataFlickering = ref(false); 
const corruptionInterval = ref(null);

// Función para obtener la URL de la bandera (con posible fallo)
const getFlagUrl = (code) => {
  // Simulación de fallo de carga de la imagen si el sistema está corrupto
  if (isDataFlickering.value && Math.random() < 0.25) {
      // Devolvemos un píxel de "error" (magenta)
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4z8BQDwAEgAGHWAWNgAAAAABJRU5ErkJggg=='; 
  }
  return `https://flagcdn.com/w20/${code.toLowerCase()}.png`;
};

// --- FUNCIÓN DE CARGA ASÍNCRONA CON FETCH ---
const fetchStatsData = async () => {
    try {
        const response = await fetch('/stats.json'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Asignamos el objeto completo y la propiedad categorías a los refs
        estadisticasData.value = data;
        categorias.value = data.categorias;
        
    } catch (error) {
        console.error("Fallo al cargar los datos de estadísticas:", error);
    }
};

// --- LÓGICA DE CORRUPCIÓN DE DATOS ---
const startDataFlicker = () => {
    // Primero, limpiamos cualquier intervalo existente si se llama esta función de nuevo
    if (corruptionInterval.value) {
        clearInterval(corruptionInterval.value);
    }

    corruptionInterval.value = setInterval(() => {
        // Activamos el parpadeo
        isDataFlickering.value = true;
        
        // El parpadeo es muy breve
        setTimeout(() => {
            isDataFlickering.value = false;
        }, 50); 
        
    }, Math.random() * 2000 + 300); // Frecuencia aleatoria de 0.3 a 2.3 segundos
};

// --- INTERACCIÓN SIMPLE: REINICIAR EL GLITCH AL HACER CLIC ---
const restartFlicker = () => {
    // Al hacer clic, forzamos un glitch inmediato y reiniciamos el ciclo automático.
    isDataFlickering.value = true;
    setTimeout(() => {
        isDataFlickering.value = false;
    }, 100); 
    startDataFlicker(); 
};

// Función para aplicar un pequeño desplazamiento de valor a las estadísticas
const getCorruptedValue = (value) => {
    if (isDataFlickering.value) {
        // Si es un número, lo alteramos
        if (!isNaN(value)) {
            const numValue = parseInt(value);
            // Pequeña alteración numérica (-1, 0, +1)
            return numValue + Math.floor(Math.random() * 3) - 1; 
        }
    }
    return value;
}

onMounted(() => {
    // 1. Cargamos los datos
    fetchStatsData();
    // 2. Iniciamos la corrupción
    startDataFlicker();
});

onBeforeUnmount(() => {
    if (corruptionInterval.value) {
        clearInterval(corruptionInterval.value);
    }
});
</script>

<template>
  <div class="stats-view-container netart-container">
    
    <GlitchText 
      :text="isDataFlickering ? 'DATOS: ERROR DE CUANTIFICACIÓN' : estadisticasData.titulo.toUpperCase()" 
      class="view-title" 
      :class="{'glitch-active-title': isDataFlickering}"
    />
    <p class="subtitle netart-subtitle">
        La cuantificación del recuerdo. Todos los datos individuales son <span :class="{'corrupted-word': isDataFlickering}">ficción numérica</span>.
    </p>
    
    <p class="instruction-simple">
        [CLIC en una tarjeta para FORZAR un escaneo de datos]
    </p>

    <div class="grid-container">
      
      <div 
        v-for="categoria in categorias" 
        :key="categoria.id" 
        class="stat-card netart-card"
        :class="{'card-flicker': isDataFlickering}"
        
        @click="restartFlicker" >
        
        <h2 class="card-title">{{ categoria.nombre }} // FAILED_READ</h2>
        
        <ul class="stats-list">
          <li v-for="(dato, index) in categoria.datos" :key="index" class="stat-item">
            
            <span class="player-info">
              <img 
                :src="getFlagUrl(dato.flag)" 
                :alt="`${dato.pais} flag`" 
                class="flag-icon glitch-flag"
              >
              
              <template v-if="categoria.id === 'awards'">
                <span class="player-name award-text-glitch">{{ dato.premio }}</span> — 
                <span class="player-award-winner critical-data">{{ dato.jugador }}</span>
              </template>
              <template v-else>
                <span class="player-name" :class="{'name-shift': isDataFlickering && index % 2 === 0}">{{ dato.jugador }}</span> 
                
                <span class="value-display">
                    (<span 
                        class="numeric-glitch" 
                        :class="{'glitch-active-value': isDataFlickering}"
                    >
                        {{ getCorruptedValue(dato.valor) }}
                    </span>)
                </span>
              </template>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ============================================== */
/* --- ESTILOS: NET ART / METADATA CORRUPTA --- */
/* ============================================== */

/* Base y Tipografía */
.netart-container {
  min-height: calc(100vh - 50px);
  padding: 50px 20px;
  background-color: #0d0d0d; /* Fondo muy oscuro */
  color: #00ffaa; /* Verde neón/cian de datos */
  font-family: 'Consolas', monospace;
  text-align: center;
  filter: contrast(1.1);
  overflow: hidden;
}

/* Instrucción de interacción */
.instruction-simple {
    color: #ff8800;
    font-size: 0.8em;
    margin-bottom: 20px;
}

.view-title {
  margin-bottom: 5px;
  color: #ff00ff; /* Magenta de error */
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.5);
}

.glitch-active-title {
    animation: title-glitch 0.05s infinite alternate;
}

.netart-subtitle {
  color: #008888;
  margin-bottom: 40px;
  font-size: 0.9em;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.corrupted-word {
    color: #ff0000;
    font-weight: bold;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Tarjeta de Estadística (Contenedor de datos) */
.netart-card {
  border: 1px dashed #005555;
  padding: 20px;
  background-color: #1a1a1a;
  text-align: left;
  transition: all 0.05s linear;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.1);
  cursor: pointer; /* Indicamos que es interactivo */
}

.netart-card:hover {
    /* Efecto hover simple para feedback */
    border-color: #ff00ff;
    transform: translateY(-2px);
}

.card-flicker {
    /* Efecto visual de parpadeo y desplazamiento en la tarjeta */
    border-color: #ff0000;
    box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
    transform: translateX(1px);
}

.card-title {
  font-size: 1.2em;
  font-weight: 400;
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 1px dashed #00ffaa;
  padding-bottom: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #ffffff;
}

.stats-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.stat-item {
  padding: 8px 0;
  border-bottom: 1px dashed #003333;
  font-size: 0.9em;
  color: #00ffaa;
}

.stat-item:last-child {
    border-bottom: none;
}

.player-info {
    display: flex;
    align-items: center;
}

.glitch-flag {
    width: 20px;
    height: 15px;
    margin-right: 10px;
    border: 1px solid #ff00ff; /* Borde magenta */
    transition: all 0.01s;
}

.player-name, .player-award-winner {
    font-weight: 500;
}

/* --- ESTILOS ESPECÍFICOS DE GLITCH --- */

/* Nombre del Jugador: Desplazamiento sutil */
.name-shift {
    color: #ffcc00; /* Advertencia */
    animation: name-shake 0.1s infinite alternate;
}

/* Valor Numérico: El punto clave de la falsificación */
.value-display {
    margin-left: auto;
}

.numeric-glitch {
    color: #ff0000;
    font-weight: bold;
    font-size: 1.1em;
    transition: all 0.01s;
}

.glitch-active-value {
    /* El valor numérico se distorsiona con el estado */
    text-shadow: 0 0 3px #ff0000;
    animation: value-flicker 0.05s infinite alternate;
}

/* Premios (Awards): Confusión textual */
.award-text-glitch {
    color: #ff00ff;
    font-style: italic;
}

.critical-data {
    color: #ffffff;
    font-weight: bold;
}

/* ------------------ */
/* --- ANIMACIONES --- */
/* ------------------ */

@keyframes title-glitch {
    0% { transform: skewX(1deg); }
    100% { transform: skewX(-1deg); }
}

@keyframes name-shake {
    0% { transform: translateX(0.5px); }
    100% { transform: translateX(-0.5px); }
}

@keyframes value-flicker {
    0% { opacity: 0.8; transform: scale(1.05); }
    100% { opacity: 1.0; transform: scale(1.0); }
}
</style>