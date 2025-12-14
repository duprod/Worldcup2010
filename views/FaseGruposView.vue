<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import GlitchText from '../components/GlitchText.vue'; 
// import datosFaseGrupos from '/grupos.json'; // Eliminamos la importación estática

// Inicializamos la data reactiva como un array vacío que se llenará con fetch
const gruposData = ref([]); 
const isDataCorrupt = ref(false); 
const isManualGlitching = ref(false); 
const corruptionTimer = ref(null);

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

const getFlagUrl = (teamName) => {
    const code = teamCodes[teamName];
    if (code) {
        // La URL de la bandera puede estar corrupta si cualquier glitch está activo
        if ((isDataCorrupt.value || isManualGlitching.value) && Math.random() < 0.1) {
             return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='; // Píxel blanco/transparente
        }
        return `https://flagcdn.com/w20/${code.toLowerCase()}.png`;
    }
    return ''; 
};

// --- Lógica de Corrupción Automática (Tiempo) ---
const startSystemGlitch = () => {
    corruptionTimer.value = setInterval(() => {
        isDataCorrupt.value = true;
        
        setTimeout(() => {
            isDataCorrupt.value = false;
        }, Math.random() * 50 + 20); 
        
    }, Math.random() * 4000 + 1000); // Glitch cada 1 a 5 segundos
};

// --- Lógica de Corrupción Manual (Hover) ---
const forceManualGlitch = (isActive) => {
    // Si la corrupción manual se activa, se mantiene activa mientras el ratón esté encima.
    isManualGlitching.value = isActive; 
};

// --- FUNCIÓN DE CARGA ASÍNCRONA CON FETCH ---
const fetchGruposData = async () => {
    try {
        const response = await fetch('/grupos.json'); // Usamos la ruta al archivo en 'public'
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Asignamos la propiedad 'grupos' del JSON a la variable reactiva
        if (data && data.grupos) {
             gruposData.value = data.grupos;
        } else {
             console.error("JSON cargado, pero no contiene la propiedad 'grupos'.");
        }
    } catch (error) {
        console.error("Fallo al cargar los datos de la fase de grupos:", error);
    }
};


onMounted(() => {
    // 1. Cargamos los datos
    fetchGruposData();
    // 2. Iniciamos la corrupción
    startSystemGlitch();
});

onBeforeUnmount(() => {
    if (corruptionTimer.value) {
        clearInterval(corruptionTimer.value);
    }
});

</script>

<template>
  <div class="grupos-view-container netart-container">
    
    <GlitchText 
      :text="isDataCorrupt || isManualGlitching ? 'ERROR_DE_CUADRÍCULA::0101' : 'FASE DE GRUPOS: ESTRUCTURA FALSA'" 
      class="view-title" 
      :class="{'glitch-active-text': isDataCorrupt || isManualGlitching}"
    />
    <p class="subtitle netart-subtitle">
        La memoria de las rondas iniciales es <span :class="{'corrupted-word': isDataCorrupt || isManualGlitching}">caótica</span> y se desintegra.
    </p>
    
    <div 
        v-for="grupo in gruposData" 
        :key="grupo.nombre" 
        class="group-card"
        :class="{'glitch-border': isDataCorrupt}"
        
        @mouseenter="forceManualGlitch(true)"
        @mouseleave="forceManualGlitch(false)"
    >
        
        <h2 class="group-title">{{ grupo.nombre.toUpperCase() }} // STATUS: OK</h2>
        
        <table 
            class="minimal-data-table corrupted-data-table"
            :class="{'glitch-table-active': isDataCorrupt || isManualGlitching}"
        >
            <thead>
                <tr>
                    <th :class="{'glitch-header': isDataCorrupt || isManualGlitching}">EQUIPO</th>
                    <th>PJ</th>
                    <th>PG</th>
                    <th>PE</th>
                    <th>PP</th>
                    <th>GF</th>
                    <th>GC</th>
                    <th class="pts-col">PTS</th>
                </tr>
            </thead>
            <tbody>
                <tr 
                    v-for="(equipo, index) in grupo.clasificacion" 
                    :key="index"
                    :class="{'glitch-row-shift': isDataCorrupt && index % 3 === 0}"
                >
                    <td class="team-name">
                        <img :src="getFlagUrl(equipo.equipo)" :alt="`${equipo.equipo} flag`" class="flag-icon">
                        {{ equipo.equipo }}
                    </td>
                    <td :class="{'data-shift': isDataCorrupt || isManualGlitching}">{{ equipo.pj }}</td> 
                    <td :class="{'data-shift': isDataCorrupt || isManualGlitching}">{{ equipo.pg }}</td> 
                    <td :class="{'data-shift': isDataCorrupt || isManualGlitching}">{{ equipo.pe }}</td> 
                    <td :class="{'data-shift': isDataCorrupt || isManualGlitching}">{{ equipo.pp }}</td> 
                    <td :class="{'data-shift': isDataCorrupt || isManualGlitching}">{{ equipo.gf }}</td> 
                    <td :class="{'data-shift': isDataCorrupt || isManualGlitching}">{{ equipo.gc }}</td> 
                    <td class="pts-col" :class="{'critical-pts-glitch': isDataCorrupt || isManualGlitching}">{{ equipo.pts }}</td>
                </tr>
            </tbody>
        </table>

        <h3 class="partidos-title">Partidos Jugados: <span class="memory-leak">MEMORY LEAK</span></h3>
        <ul class="partidos-list">
            <li 
                v-for="partido in grupo.partidos" 
                :key="partido.id" 
                class="match-item-aligned"
                :class="{'match-glitch-active': isDataCorrupt || isManualGlitching}"
            >
                <span class="match-detail-date">{{ partido.fecha }}</span>
                <span class="match-detail-score">
                    <img :src="getFlagUrl(partido.equipoA)" :alt="`${partido.equipoA} flag`" class="flag-icon glitch-flag"> 
                    <span class="team-A-corrupt">{{ partido.equipoA }}</span> 
                    <span :class="{'score-glitch': isDataCorrupt || isManualGlitching}">{{ partido.golesA }}</span> 
                    — 
                    <span :class="{'score-glitch': isDataCorrupt || isManualGlitching}">{{ partido.golesB }}</span> 
                    <span class="team-B-corrupt">{{ partido.equipoB }}</span>
                    <img :src="getFlagUrl(partido.equipoB)" :alt="`${partido.equipoB} flag`" class="flag-icon glitch-flag">
                </span>
            </li>
        </ul>
    </div>
    
    <router-link to="/eliminatorias" class="next-step-link final-rupture-link">
        <span class="corrupted-link-text" :class="{'severe-link-glitch': isDataCorrupt || isManualGlitching}">VER FASE FINAL > ERROR DE ENLACE</span>
    </router-link>
  </div>
</template>

<style scoped>
/* ============================================== */
/* --- ESTILOS: NET ART / DATA-COLLAPSE --- */
/* ============================================== */

/* Fondo, Texto Base y Tipografía */
.netart-container {
  min-height: calc(100vh - 50px);
  padding: 50px 20px;
  background-color: #111111; /* Oscuro y pesado */
  color: #00ffaa; /* Verde aguamarina/cian de sistema */
  font-family: 'Consolas', 'Courier New', monospace; /* Fuente de terminal/datos */
  text-align: center;
  filter: contrast(1.1);
}

.view-title {
  margin-bottom: 5px;
  color: #ff00ff; /* Magenta de error */
}

.glitch-active-text {
    animation: text-glitch-quick 0.05s infinite alternate;
}

.netart-subtitle {
  color: #008888;
  margin-bottom: 40px;
  font-size: 1em;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.corrupted-word {
    color: #ff0000;
    font-weight: bold;
}

/* Contenedor de la Tarjeta de Grupo */
.group-card {
    max-width: 800px;
    margin: 25px auto 50px auto; 
    background-color: #0d0d0d;
    padding: 25px;
    border: 1px solid #005555;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
    transition: all 0.05s linear; /* Para aplicar el glitch visual abrupto */
}

/* El glitch manual se aplica a través de la clase isManualGlitching 
   que se inyecta en la tabla y los datos cuando el mouse entra al card. */

.glitch-border {
    /* Efecto visual de borde que se rompe (Automático) */
    border: 3px solid #ff0000;
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
    transform: translateX(2px) translateY(-1px);
}

.group-title {
    color: #ffffff;
    margin-bottom: 15px;
    border-bottom: 1px solid #00ffaa;
    padding-bottom: 10px;
    font-size: 1.4em;
    font-weight: 400;
    letter-spacing: 0.2em;
}

/* Estilo de la tabla Corrupta */
.corrupted-data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  margin-bottom: 20px;
}

.corrupted-data-table th, .corrupted-data-table td {
  padding: 8px 15px;
  border-bottom: 1px dashed #003333;
}

.corrupted-data-table th {
  background-color: #001111;
  color: #00ffaa;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Glitch de Tabla */
.glitch-table-active {
    filter: brightness(1.5);
    transform: skewX(-0.5deg);
}

.glitch-header {
    background-color: #ff0000;
    color: #ffffff;
    animation: header-color-flash 0.1s infinite alternate;
}

.glitch-row-shift {
    transform: translateY(2px);
    background-color: rgba(255, 0, 0, 0.1);
}

/* Estilos de Bandera y Equipo */
.team-name {
    display: flex; 
    align-items: center;
    font-weight: 400;
    color: #00ffaa;
    gap: 8px; 
}

.flag-icon {
    width: 20px;
    height: 15px;
    border: 1px solid #ff00ff; /* Borde de error magenta */
    flex-shrink: 0;
}

/* Glitch de Datos */
.data-shift {
    color: #ffcc00; /* Amarillo de advertencia */
    animation: data-shift-small 0.1s infinite step-end;
}

.pts-col {
    text-align: center;
    font-weight: 700;
    color: #ffffff;
}

.critical-pts-glitch {
    color: #ff0000;
    text-shadow: 0 0 5px #ff0000;
    animation: pts-glitch-scale 0.1s infinite alternate;
}

/* --- Listado de Partidos Jugados --- */
.partidos-title {
    font-size: 1em;
    font-weight: 400;
    color: #ffffff;
    margin-top: 25px;
    border-top: 1px dashed #005555;
    padding-top: 15px;
    text-align: center; 
}

.memory-leak {
    color: #ff00ff;
    font-size: 0.9em;
    margin-left: 10px;
}

.partidos-list {
    list-style: none;
    padding: 0;
    margin-top: 10px;
}

.match-item-aligned { 
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 7px 0;
    font-size: 0.9em;
    color: #00ffaa;
    transition: all 0.05s;
}

.match-glitch-active {
    filter: hue-rotate(90deg);
    transform: skewX(0.5deg);
}

.match-detail-date {
    font-size: 0.8em;
    color: #005555;
    margin-right: 25px; 
}

.score-glitch {
    color: #ff0000;
    font-weight: bold;
    animation: score-glitch-flash 0.1s infinite alternate;
}

.team-A-corrupt, .team-B-corrupt {
    color: #ffffff;
}

.glitch-flag {
    opacity: 0.8;
}

/* Enlace a la Siguiente Fase */
.next-step-link {
    display: inline-block;
    margin-top: 50px;
    color: #ff00ff;
    text-decoration: none;
    font-size: 1.1em;
    padding: 15px 30px;
    border: 3px double #ff00ff;
    background-color: #000000;
    transition: all 0.2s;
    letter-spacing: 0.2em;
}

.next-step-link:hover {
    background-color: #ff00ff;
    color: #000000;
    border-color: #ffffff;
}

.severe-link-glitch {
    color: #ff8800; /* Naranja de advertencia */
    animation: link-break 0.1s infinite alternate;
}

/* ------------------ */
/* --- ANIMACIONES --- */
/* ------------------ */

@keyframes text-glitch-quick {
    0% { transform: skewX(1deg); }
    100% { transform: skewX(-1deg); }
}

@keyframes header-color-flash {
    0% { background-color: #ff0000; }
    100% { background-color: #880000; }
}

@keyframes data-shift-small {
    0% { transform: translateX(0.5px); }
    100% { transform: translateX(-0.5px); }
}

@keyframes pts-glitch-scale {
    0% { transform: scale(1.05); }
    100% { transform: scale(1.0); }
}

@keyframes score-glitch-flash {
    0% { opacity: 0.5; }
    100% { opacity: 1.0; }
}

@keyframes link-break {
    0% { transform: translateY(0); text-shadow: 0 0 5px #ff8800; }
    100% { transform: translateY(-1px); text-shadow: 0 0 1px #ff8800; }
}
</style>