import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
    const isDarkMode = ref(true);
    const isCopy = ref(false);
    const mainColor = ref('#FF3000');
    const mainPalette = ref({palette:{ sadness:'', error: '', neutrality: '', happiness: '', success: ''}})
    const downloads = ref([]);
    const stars = ref(0);

    function copy() {
        isCopy.value = true;
        setTimeout(() => {
            isCopy.value = false;
        }, 600);
    }

    return {
        isDarkMode,
        isCopy,
        copy,
        mainColor,
        mainPalette,
        downloads,
        stars
    }
})