// src/composables/useJabulaniMotion.js
import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useJabulaniMotion() {
    // Variables reactivas
    const mouseX = ref(0);
    const mouseY = ref(0);
    const rotationX = ref(0);
    const rotationY = ref(0);
    const hasMoved = ref(false); 

    // Inicialización del audio
    let fanAudio = null;

    // --- FUNCIÓN PARA CONTROLAR EL VOLUMEN (Basado en la posición X) ---
    const updateVolume = (xPos) => {
        if (!fanAudio) return;

        const viewportWidth = window.innerWidth;
        const criticalZoneStart = viewportWidth * 0.5;
        let distanceToGoal = Math.max(0, xPos - criticalZoneStart);
        const normalizedVolume = Math.min(1, distanceToGoal / (viewportWidth * 0.5));
        
        // Mínimo de 0.05 para el murmullo
        const newVolume = 0.05 + (normalizedVolume * 0.95);
        fanAudio.volume = newVolume;
    };

    // --- LÓGICA DE MOVIMIENTO ---
    const handleMouseMove = (event) => {
        if (!hasMoved.value) {
            hasMoved.value = true;
            // Iniciar la reproducción silenciosa al interactuar
            if (fanAudio) {
                fanAudio.play().catch(e => console.error("Fallo al iniciar audio:", e));
            }
        }
        
        mouseX.value = event.clientX;
        mouseY.value = event.clientY;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        rotationY.value = (event.clientX - centerX) / 50; 
        rotationX.value = -(event.clientY - centerY) / 50; 
        
        updateVolume(event.clientX); 
    };

    // --- CICLO DE VIDA (Montaje de listeners y audio) ---
    onMounted(() => {
        fanAudio = new Audio('/aficion.mp3'); 
        fanAudio.loop = true;
        fanAudio.volume = 0.05;

        window.addEventListener('mousemove', handleMouseMove);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (fanAudio) {
            fanAudio.pause();
        }
    });

    // Retornar todas las variables reactivas y funciones que necesita el template
    return {
        mouseX,
        mouseY,
        rotationX,
        rotationY,
        hasMoved
    };
}