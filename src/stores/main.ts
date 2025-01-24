import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
    const isDarkMode = ref(true);
    const isCopy = ref(false);
    const mainColor = ref('#FF3000')

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
        mainColor
    }
})