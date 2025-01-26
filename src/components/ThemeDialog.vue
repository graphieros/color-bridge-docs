<script setup>
import { useMainStore } from "@/stores/main";
import { ref, computed } from "vue";
import { VueUiIcon } from "vue-data-ui";
import colorBridge from "color-bridge";
import { ShoppingCartIcon, UserIcon } from "vue-tabler-icons";

const store = useMainStore();
const isDarkMode = computed(() => store.isDarkMode);

const { utils, bridge } = colorBridge();

const { textColorForBackground, lightenHexColor } = utils();

const dialog = ref(null);

function openDialog() {
    if(dialog.value) {
        dialog.value.showModal();
    }
}

function closeDialog() {
    if(dialog.value) {
        dialog.value.close();
    }
}

const select_cultures = ref([
    'african',
    'chinese',
    'indian',
    'japanese',
    'latinAmerican',
    'middleEastern',
    'southeastAsian',
    'western'
]);

const selectedCulture = ref(select_cultures.value[0])

const select_themes = ref([
    'business',
    'celebration',
    'luxury',
    'technology',
    'minimalist'
]);

const activeTheme = computed(() => {
    const { themes } = bridge({ culture: selectedCulture.value });
    return themes[selectedTheme.value]
})

const selectedTheme = ref(select_themes.value[0]);

defineExpose({
    openDialog,
    closeDialog
})

</script>

<template>
    <dialog ref="dialog" class="fixed top-[60px] left-[60px] overflow-hidden"
        :style="{
            width: 'calc(100vw - 120px)',
            height: 'calc(100vh - 120px)',
            background: `radial-gradient(at top left, ${activeTheme.backgroundColor}, white)`
        }"
    >
    <div class="w-full card py-2 relative z-10">
        
        <button class="absolute top-1 right-1 cursor-pointer p-1" :style="{
            background: store.mainColor
        }" @click="closeDialog">
            <VueUiIcon name="close" :stroke="textColorForBackground(store.mainColor)"/>
        </button>

        <div class="flex flex-row flex-wrap gap-2 p-2">

            <div class="flex flex-col">
                <label for="culture_dialog" :style="{ color: isDarkMode ? '#CCCCCC' : '#1A1A1A'}" :data-dark="isDarkMode">Select a culture</label>
                <select class="w-[200px]" v-model="selectedCulture" id="culture_dialog" :style="{ background: '#FFFFFF', color: '#1A1A1A' }">
                    <option v-for="culture in select_cultures">{{ culture }}</option>
                </select>
            </div>

            <div class="flex flex-col">
                <label for="theme" :style="{ color: isDarkMode ? '#CCCCCC' : '#1A1A1A'}" :data-dark="isDarkMode">Select a theme</label>
                <select class="w-[200px]" v-model="selectedTheme" id="theme" :style="{ background: '#FFFFFF', color: '#1A1A1A' }">
                    <option v-for="theme in select_themes">{{ theme }}</option>
                </select>
            </div>
        </div>
    </div>

    <div class="absolute top-[78px] left-0 w-full bg-white h-[60px] flex flex-row place-items-center justify-end px-12 gap-4" :style="{
        borderBottom: `1px solid ${activeTheme.tertiary }`
    }">
        <UserIcon :style="{ color: activeTheme.primary }"/>
        <ShoppingCartIcon/>
    </div>

    <div class="flex flex-row justify-between z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div class="text-[64px] w-[400px] leading-18" :style="{ color: activeTheme.textColor, fontWeight: 'bold' }">
            This is how <span :style="{ color: activeTheme.primary, fontWeight: 'bold' }">heroes</span> do it.
            <div class="text-[18px] w-[400px] leading-18" :style="{ color: activeTheme.textColor }">
            A new {{ selectedTheme }} concept.
        </div>
        </div>
        <div class="w-[200px] h-[64px] flex flex-row place-items-center justify-center shadow-md rounded" :style="{
            background: `radial-gradient(at top left, ${lightenHexColor({ hexColor: activeTheme.primary, force: 0.4})}, ${activeTheme.primary})`,
            marginTop: '4.3rem'
        }">
            <span :style="{ color: textColorForBackground(activeTheme.primary), fontWeight: 'bold' }" class="text-xl">
                Start now !
            </span>
        </div>
    </div>

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" class="absolute bottom-12 rotate-4 left-0" style="opacity: 0.2">
        <path :fill="activeTheme.primary" fill-opacity="1" d="M0,224L48,224C96,224,192,224,288,208C384,192,480,160,576,170.7C672,181,768,235,864,229.3C960,224,1056,160,1152,128C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" class="absolute bottom-0 left-0" style="opacity: 1">
        <path :fill="activeTheme.backgroundColor" fill-opacity="1" d="M0,224L48,224C96,224,192,224,288,208C384,192,480,160,576,170.7C672,181,768,235,864,229.3C960,224,1056,160,1152,128C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
    </svg>

    </dialog>
</template>

<style scoped>
dialog {
    animation: showDialog 0.3s ease-in-out;
}

@keyframes showDialog {
    0% {
        transform: scale(0.9,0.9);
        opacity: 0;
    }
    100% {
        transform: scale(1,1);
        opacity: 1;
    }
}
</style>