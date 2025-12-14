<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import GlitchText from '../components/GlitchText.vue'; 

// ⚠️ CAMBIOS CLAVE: Eliminamos la importación estática y definimos una variable reactiva para los datos.
// import datosPartidos from ''; // Se elimina
const eliminatoriasData = ref([]); // Inicialmente vacío (array vacío)
const isTimelineCorrupt = ref(false); 
const corruptionInterval = ref(null);
const skippedMatches = ref([]); 

// --- MAPEO COMPLETO DE CÓDIGOS DE PAÍS (Mantenido) ---
const teamCodes = {
    "South Africa": "za", "Mexico": "mx", "Uruguay": "uy", "France": "fr",
    "Argentina": "ar", "South Korea": "kr", "Greece": "gr", "Nigeria": "ng",
    "United States": "us", "England": "gb-eng", "Slovenia": "si", "Algeria": "dz",
    "Germany": "de", "Ghana": "gh", "Australia": "au", "Serbia": "rs",
    "Netherlands": "nl", "Japan": "jp", "Denmark": "dk", "Cameroon": "cm",
    "Paraguay": "py", "Slovakia": "sk", "New Zealand": "nz", "Italy": "it",
    "Brazil": "br", "Portugal": "pt", "Ivory Coast": "ci", "North Korea": "kp",
    "Spain": "es", "Chile": "cl", "Switzerland": "ch", "Honduras": "hn"
};

// --- FUNCIÓN AUXILIAR PARA OBTENER LA URL DE LA BANDERA (Con posible fallo) ---
const getFlagUrl = (teamName) => {
    const code = teamCodes[teamName];
    if (code) {
         // Falla si la línea de tiempo está corrupta para simular datos perdidos
        if (isTimelineCorrupt.value && Math.random() < 0.2) {
             return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        }
        return `https://flagcdn.com/w20/${code.toLowerCase()}.png`;
    }
    return ''; 
};

// --- LÓGICA DE CORRUPCIÓN DE LA LÍNEA DE TIEMPO (Automático) ---
const startTimelineCorruption = () => {
    corruptionInterval.value = setInterval(() => {
        isTimelineCorrupt.value = true;
        
        // El fallo dura un tiempo muy breve para simular un "salto"
        setTimeout(() => {
            isTimelineCorrupt.value = false;
        }, 30); 
        
    }, Math.random() * 2000 + 500); // Glitch cada 0.5 a 2.5 segundos
};

// --- LÓGICA INTERACTIVA: OMITIR REGISTRO (Doble Clic) ---
const skipMatch = (matchId) => {
    if (!skippedMatches.value.includes(matchId)) {
        skippedMatches.value.push(matchId);
    } else {
        // Opción: permitir reactivar si se hace doble clic de nuevo
        skippedMatches.value = skippedMatches.value.filter(id => id !== matchId);
    }
};

const isSkipped = (matchId) => {
    return skippedMatches.value.includes(matchId);
};

// --- NUEVA FUNCIÓN DE CARGA ASÍNCRONA CON FETCH ---
const fetchEliminatorias = async () => {
    try {
        // Asumimos que el JSON se llama 'eliminatorias.json' y está en 'public'
        const response = await fetch('/partidos.json'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const datosPartidos = await response.json();
        
        // Asignamos la propiedad 'eliminatorias' del JSON a la variable reactiva
        if (datosPartidos && datosPartidos.eliminatorias) {
             eliminatoriasData.value = datosPartidos.eliminatorias;
        } else {
             console.error("JSON cargado, pero no contiene la propiedad 'eliminatorias'.");
        }
       
    } catch (error) {
        console.error("Fallo al cargar la clasificación:", error);
    }
};

onMounted(() => {
    // 1. Cargamos los datos
    fetchEliminatorias();
    // 2. Iniciamos la corrupción
    startTimelineCorruption();
});

onBeforeUnmount(() => {
    if (corruptionInterval.value) {
        clearInterval(corruptionInterval.value);
    }
});
</script>

<template>
  <div class="eliminatorias-view-container netart-container">
    
    <GlitchText 
      :text="isTimelineCorrupt ? 'TIEMPO_EXTRA_NO_REGISTRADO' : 'FASE FINAL: LÍNEA DE TIEMPO ROTA'" 
      class="view-title" 
      :class="{'glitch-active-title': isTimelineCorrupt}"
    />

    <p class="subtitle netart-subtitle">
        El registro histórico se mantiene <span :class="{'corrupted-word': isTimelineCorrupt}">errático</span> e incierto.
    </p>
    
    <p class="instruction-manual">
        [DOBLE-CLIC en un partido para OMITIR/SALTAR el registro histórico]
    </p>

    <div class="bracket-container">
      
      <div 
        v-for="ronda in eliminatoriasData" 
        :key="ronda.ronda" 
        class="ronda-block"
      >
        <h2 class="ronda-title" :class="{'glitch-active-text': isTimelineCorrupt}">
            {{ ronda.ronda.toUpperCase() }} // <span class="data-status">STATUS: FRAGMENTED</span>
        </h2>

        <div 
            v-for="match in ronda.partidos" 
            :key="match.id" 
            class="match-card"
            :class="[
                {'match-card-glitch': isTimelineCorrupt},
                {'skipped-record': isSkipped(match.id)} // Clase para omitido
            ]"
            @dblclick="skipMatch(match.id)" >
          
          <div class="match-info">
            
            <span class="team team-a team-left-align">
                <img :src="getFlagUrl(match.equipoA)" :alt="`${match.equipoA} flag`" class="flag-icon glitch-flag">
                {{ match.equipoA }}
            </span>
            
            <span class="score score-a critical-score" :class="{'score-glitch-active': isTimelineCorrupt}">
              {{ match.golesA }}
            </span>
            
            <span class="vs-text">—</span> 
            
            <span class="score score-b critical-score" :class="{'score-glitch-active': isTimelineCorrupt}">
              {{ match.golesB }}
            </span>
            
            <span class="team team-b team-right-align">
                {{ match.equipoB }}
                <img :src="getFlagUrl(match.equipoB)" :alt="`${match.equipoB} flag`" class="flag-icon glitch-flag">
            </span>
          </div>

          <p class="match-details details-centered">
            <span class="details-container">
                <template v-if="match.isPenaltis">
                    <span class="detail-text penaltis-data" :class="{'penaltis-glitch': isTimelineCorrupt}">
                        (Penaltis: {{ match.golesPenaltisA }} - {{ match.golesPenaltisB }})
                    </span>
                </template>
                <span v-if="match.tiempoExtra" class="extra-time-text" :class="{'extra-time-glitch': isTimelineCorrupt}">
                    (T.E. // RITMO ROTO)
                </span>
                <span v-if="match.tipoPartido" class="match-type">{{ match.tipoPartido }}</span>
            </span>
          </p>
          
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ============================================== */
/* --- ESTILOS: NET ART / TIEMPO ROTO --- */
/* ============================================== */

/* Base y Tipografía */
.netart-container {
  min-height: calc(100vh - 50px);
  padding: 50px 20px;
  background-color: #000000; /* Fondo negro */
  color: #c0c0c0; /* Gris de terminal */
  font-family: 'Consolas', monospace; 
  text-align: center;
  filter: contrast(1.1);
  overflow: hidden; 
}

/* Instrucción para el usuario */
.instruction-manual {
    color: #00ffaa;
    font-size: 0.8em;
    margin-bottom: 20px;
}

.view-title {
  margin-bottom: 5px;
  color: #ff00ff; /* Magenta */
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.5);
}

.glitch-active-title {
    animation: title-glitch 0.03s infinite alternate;
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

/* Contenedor del Cuadro */
.bracket-container {
  max-width: 800px;
  margin: 0 auto;
}

.ronda-title {
    color: #ffffff; 
    margin: 30px 0 15px;
    border-bottom: 1px dashed #005555;
    padding-bottom: 10px;
    font-size: 1.1em;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    transition: all 0.05s;
}

.data-status {
    color: #ff8800; /* Advertencia */
    font-size: 0.9em;
    margin-left: 10px;
}

.glitch-active-text {
    filter: hue-rotate(180deg);
}

/* Tarjeta del Partido: El Segmento de la Línea de Tiempo */
.match-card {
  border-bottom: 1px dashed #003333; 
  margin-bottom: 5px;
  padding: 10px 0;
  background-color: transparent;
  transition: all 0.2s linear; /* Hacemos la transición más lenta para el efecto de omisión */
  cursor: pointer; /* Indicamos que es interactivo */
  
  display: flex;
  flex-direction: column;
  justify-content: center; 
}

/* --- ESTILO DE REGISTRO OMITIDO (NET ART) --- */
.skipped-record {
    opacity: 0.1; /* Se vuelve casi invisible */
    pointer-events: none; /* Desactivar interacciones si está omitido (se reactiva con la lógica JS) */
    background-color: #550000; /* Sutil fondo rojo de eliminación */
    text-decoration: line-through; /* Tachamos todo el texto */
}

.match-card-glitch {
    /* Desplazamiento visual rápido de toda la tarjeta */
    transform: translateX(1px) skewX(0.5deg);
    filter: brightness(1.5) contrast(0.8);
    border-bottom: 1px solid #ff0000;
}

/* Contenedor de Marcadores */
.match-info {
  display: flex;
  justify-content: space-around;
  align-items: center; 
  font-size: 1.1em; 
  font-weight: 400;
  min-height: 30px; 
}

/* Equipos */
.team {
    width: 30%; 
    color: #c0c0c0;
    font-size: 0.85em;
    font-weight: 500;
    letter-spacing: 0.05em;
    display: flex; 
    align-items: center;
    flex-shrink: 0; 
}

.team-left-align {
    justify-content: flex-end; 
    gap: 8px; 
    padding-right: 5px; 
}

.team-right-align {
    justify-content: flex-start;
    gap: 8px;
    padding-left: 5px;
}

.glitch-flag {
    border: 1px solid #ff00ff;
    opacity: 0.8;
}

/* Marcadores: El Punto de Colapso */
.critical-score {
    width: 5%;
    color: #ffffff; 
    font-weight: 700;
    text-align: center;
    transition: all 0.01s;
}

.score-glitch-active {
    /* El número tiembla y cambia de color violentamente */
    color: #ff0000; 
    text-shadow: 0 0 5px #ff0000;
    animation: score-flicker 0.05s infinite alternate;
}

.vs-text {
    font-size: 1em;
    color: #555555; 
    font-weight: 300;
}

/* Detalles del Partido (Metadata Subvertida) */
.match-details {
    font-size: 0.8em;
    color: #555555;
    margin-top: 5px;
    display: flex; 
    justify-content: center; 
    min-height: 18px; 
}

.penaltis-data {
    color: #ff8800; /* Naranja de advertencia */
}

.penaltis-glitch {
    /* El dato de penaltis es crucial, lo distorsionamos */
    font-weight: bold;
    animation: data-shift-small 0.1s infinite step-end;
}

.extra-time-glitch {
    color: #ff00ff; /* Magenta: tiempo irreal */
    font-style: italic;
    animation: text-shake-subtle 0.1s infinite alternate;
}

/* ------------------ */
/* --- ANIMACIONES --- */
/* ------------------ */

@keyframes title-glitch {
    0% { transform: translateX(2px); }
    100% { transform: translateX(-2px); }
}

@keyframes score-flicker {
    0% { transform: skewX(1deg) scale(1.1); }
    100% { transform: skewX(-1deg) scale(1.0); }
}

@keyframes data-shift-small {
    0% { transform: translateX(0.5px); }
    100% { transform: translateX(-0.5px); }
}

@keyframes text-shake-subtle {
    0% { transform: translateY(0.5px); }
    100% { transform: translateY(-0.5px); }
}
</style>