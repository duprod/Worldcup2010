<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import MinimalText from '../components/GlitchText.vue'; // Usamos GlitchText (MinimalText)

// --- CAMBIO CLAVE: Ya NO importamos estáticamente el JSON ---
// import clasificacionData from '/clasificacion.json'; 

// Hacemos la data reactiva. Inicialmente la dejamos vacía.
const clasificacion = ref([]); // Ahora es un array vacío que se llenará con fetch
const isOrderCorrupt = ref(false); // Glitch automático
const isManualRearrange = ref(false); // Glitch manual de orden
const corruptionInterval = ref(null);

// Definición de las columnas de la tabla
const headers = [
  '#', 'NATIONAL TEAM', 'PL', 'W', 'D', 'L', 'GF', 'GA', 'ROUND'
];

// --- MAPEO COMPLETO DE CÓDIGOS DE PAÍS ---
const teamCodes = {
    "Spain": "es", "Netherlands": "nl", "Germany": "de", "Uruguay": "uy",
    "Argentina": "ar", "Brazil": "br", "Ghana": "gh", "Paraguay": "py",
    "Japan": "jp", "Chile": "cl", "Mexico": "mx", "United States": "us",
    "England": "gb-eng", "Portugal": "pt", "Slovakia": "sk", "South Korea": "kr",
    "Serbia": "rs", "Switzerland": "ch", "Slovenia": "si", "South Africa": "za",
    "Australia": "au", "Greece": "gr", "Denmark": "dk", "Nigeria": "ng",
    "Algeria": "dz", "Honduras": "hn", "New Zealand": "nz", "Cameroon": "cm",
    "Ivory Coast": "ci", "Italy": "it", "France": "fr", "North Korea": "kp",
};

// --- FUNCIÓN AUXILIAR PARA OBTENER LA URL DE LA BANDERA (Con posible fallo) ---
const getFlagUrl = (teamName) => {
    const code = teamCodes[teamName];
    if (code) {
        // Fallo de bandera al azar si hay corrupción (automática o manual)
        if ((isOrderCorrupt.value || isManualRearrange.value) && Math.random() < 0.1) {
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5/hPwAH/gH/s3w9XAAAAABJRU5ErkJggg=='; // Píxel negro/error
        }
        return `https://flagcdn.com/w20/${code.toLowerCase()}.png`;
    }
    return ''; 
};

// --- LÓGICA DE CORRUPCIÓN DEL ORDEN (Automático) ---
const startOrderCorruption = () => {
    corruptionInterval.value = setInterval(() => {
        isOrderCorrupt.value = true;
        
        // El fallo dura muy poco, simulando un "reordenamiento" forzado
        setTimeout(() => {
            isOrderCorrupt.value = false;
        }, 40); 
        
    }, Math.random() * 3000 + 1000); // Glitch cada 1 a 4 segundos
};

// --- INTERACCIÓN SIMPLE: REORDENAMIENTO MANUAL ---
const toggleRearrange = () => {
    // Al hacer clic, forzamos el reordenamiento manual.
    isManualRearrange.value = !isManualRearrange.value; 
};

// Función para simular el desplazamiento de un dato numérico (PL, W, D, L, GF, GA)
const getCorruptedData = (value) => {
    if (isOrderCorrupt.value || isManualRearrange.value) {
        // Altera el valor levemente si es numérico
        if (!isNaN(value)) {
            const numValue = parseInt(value);
            // La corrupción manual añade un efecto más fuerte
            const multiplier = isManualRearrange.value ? 5 : 2; 
            return numValue + Math.floor(Math.random() * multiplier); 
        }
    }
    return value;
}

// --- NUEVA FUNCIÓN DE CARGA ASÍNCRONA CON FETCH ---
const fetchClasificacion = async () => {
    try {
        // Usamos la ruta relativa al archivo en la carpeta 'public'
        const response = await fetch('/clasificacion.json'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        clasificacion.value = data; // Asignamos los datos al ref reactivo
    } catch (error) {
        console.error("Fallo al cargar la clasificación:", error);
    }
};

onMounted(() => {
    // 1. Cargamos los datos
    fetchClasificacion(); 
    // 2. Iniciamos la corrupción
    startOrderCorruption();
});

onBeforeUnmount(() => {
    if (corruptionInterval.value) {
        clearInterval(corruptionInterval.value);
    }
});
</script>

<template>
  <div class="clasificacion-view-container netart-container">
    
    <MinimalText 
      :text="isOrderCorrupt || isManualRearrange ? 'CLASIFICACIÓN >> RANKING MUTANTE' : 'CLASIFICACIÓN FINAL'" 
      class="view-title" 
      :class="{'glitch-active-title': isOrderCorrupt || isManualRearrange}"
    />

    <p class="subtitle netart-subtitle">
        El registro final es <span :class="{'corrupted-word': isOrderCorrupt || isManualRearrange}">autoridad temporal</span>. El orden siempre se rompe.
    </p>
    
    <p class="instruction-simple">
        [CLIC en la tabla para FORZAR el reordenamiento del ranking]
    </p>

    <div class="table-wrapper" @click="toggleRearrange"> <table 
        class="minimal-table netart-table" 
        :class="{
          'table-glitch-active': isOrderCorrupt,
          'rearrange-active': isManualRearrange  /* Clase de reordenamiento manual */
        }"
      >
        <thead> 
          <tr>
            <th v-for="(header, index) in headers" :key="index" scope="col" :class="{'header-glitch': isOrderCorrupt || isManualRearrange}">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(team, index) in clasificacion" 
            :key="team.rank"
            :class="{
                'row-shift': isOrderCorrupt && index % 4 === 0,
                'manual-rearrange-row': isManualRearrange
            }"
          >
            <td class="rank-data" :class="{'rank-glitch': isOrderCorrupt || isManualRearrange}">
                {{ getCorruptedData(team.rank) }} 
            </td>
            
            <td class="team-name team-name-cell"> 
                <img :src="getFlagUrl(team.team)" :alt="`${team.team} flag`" class="flag-icon">
                {{ team.team.toUpperCase() }}
            </td>
            
            <td :class="{'numeric-data-glitch': isOrderCorrupt || isManualRearrange}">{{ getCorruptedData(team.pl) }}</td>
            <td :class="{'numeric-data-glitch': isOrderCorrupt || isManualRearrange}">{{ getCorruptedData(team.w) }}</td>
            <td :class="{'numeric-data-glitch': isOrderCorrupt || isManualRearrange}">{{ getCorruptedData(team.d) }}</td>
            <td :class="{'numeric-data-glitch': isOrderCorrupt || isManualRearrange}">{{ getCorruptedData(team.l) }}</td>
            <td :class="{'numeric-data-glitch': isOrderCorrupt || isManualRearrange}">{{ getCorruptedData(team.gf) }}</td>
            <td :class="{'numeric-data-glitch': isOrderCorrupt || isManualRearrange}">{{ getCorruptedData(team.ga) }}</td>
            
            <td :class="{'final-round-glitch': team.rank <= 4, 'round-glitch': isOrderCorrupt || isManualRearrange}">{{ team.round }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
/* ============================================== */
/* --- ESTILOS: NET ART / ORDEN ROTO --- */
/* ============================================== */

/* Base y Tipografía */
.netart-container {
  min-height: calc(100vh - 50px);
  padding: 50px 20px;
  background-color: #000000; /* Fondo negro */
  color: #c0c0c0; 
  font-family: 'Consolas', monospace; 
  text-align: center;
  filter: contrast(1.1);
  overflow: hidden;
}

.instruction-simple {
    color: #00ffaa;
    font-size: 0.8em;
    margin-bottom: 20px;
}

.view-title {
  color: #ff00ff;
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

.table-wrapper {
    max-width: 1000px;
    margin: 0 auto;
    overflow-x: auto;
    cursor: pointer; /* Indica que la tabla es clickeable */
}

/* Tabla Rota */
.netart-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9em;
  transition: all 0.05s linear;
}

/* --- REORDENAMIENTO MANUAL (FX de Desorden) --- */
.rearrange-active {
    /* Forzamos que la tabla se vea desordenada cuando el usuario hace clic */
    border: 2px solid #ff00ff;
    animation: table-pulse 0.5s infinite alternate;
}

.manual-rearrange-row {
    /* Mueve las filas individualmente para crear un efecto de desorden sin cambiar los datos */
    transform: translateY(calc(var(--rank) * 1px)) translateX(calc(var(--rank) * 0.5px));
    filter: saturate(1.5);
    /* Nota: 'var(--rank)' requeriría inyección de CSS variable desde Vue,
       pero usaremos el reordenamiento visual simple de la tabla entera para evitar JS extra. */
}
/* Al mantener 'rearrange-active' en la tabla, el glitch visual es suficiente para el concepto. */

.netart-table th, .netart-table td {
  padding: 10px 15px;
  border-bottom: 1px dashed #003333; 
  color: #00ffaa;
  transition: all 0.05s linear;
}

/* Encabezados Corruptos */
.netart-table th {
  background-color: #001111;
  color: #ffffff;
  font-weight: 400; 
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.header-glitch {
    background-color: #ff0000;
    color: #ffffff;
    animation: header-flash 0.1s infinite alternate;
}

.table-glitch-active {
    filter: brightness(1.2) hue-rotate(5deg);
}

/* Filas Corruptas */
.row-shift {
    transform: translateY(1px);
    background-color: rgba(255, 0, 0, 0.1);
}

/* --- RANK DATA (El punto más crítico) --- */
.rank-data {
    font-weight: 700;
    font-size: 1.1em;
    color: #ff00ff;
}

.rank-glitch {
    color: #ff0000;
    text-shadow: 0 0 5px #ff0000;
    animation: rank-jump 0.05s infinite alternate;
}

/* --- ESTILOS DE BANDERA Y ALINEACIÓN --- */
.team-name-cell {
    display: flex;
    align-items: center;
    color: #00ffaa;
}

.flag-icon {
    width: 20px;
    height: 15px;
    margin-right: 8px; 
    border: 1px solid #ff00ff; /* Borde magenta */
    flex-shrink: 0;
}

.team-name {
    font-weight: 500;
}

/* --- DATOS NUMÉRICOS (Valores que no se pueden confiar) --- */
.numeric-data-glitch {
    color: #ffcc00; /* Amarillo/naranja de advertencia */
    animation: data-tremble 0.1s infinite step-end;
}

/* --- COLUMNA DE RONDA --- */
.round-glitch {
    filter: brightness(0.5);
    font-style: italic;
    color: #888888;
}

.final-round-glitch {
    color: #ffffff;
    font-weight: 700;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

/* ------------------ */
/* --- ANIMACIONES --- */
/* ------------------ */

@keyframes title-glitch {
    0% { transform: skewX(0.5deg); }
    100% { transform: skewX(-0.5deg); }
}

@keyframes header-flash {
    0% { background-color: #ff0000; }
    100% { background-color: #550000; }
}

@keyframes rank-jump {
    0% { transform: translateY(0); }
    50% { transform: translateY(-1px); }
    100% { transform: translateY(0); }
}

@keyframes data-tremble {
    0% { transform: translateX(0.5px); }
    100% { transform: translateX(-0.5px); }
}

@keyframes table-pulse {
    0% { box-shadow: 0 0 10px rgba(255, 0, 255, 0.5); }
    100% { box-shadow: 0 0 5px rgba(255, 0, 255, 0.2); }
}
</style>