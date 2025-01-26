<script setup>
import { ref, computed } from "vue";
import colorBridge from "color-bridge";
import { useMainStore } from "@/stores/main";
import { VueUiIcon } from "vue-data-ui";

const store = useMainStore();
const emit = defineEmits(['click'])

const isDarkMode = computed(() => store.isDarkMode);

const { bridge, utils } = colorBridge();

const { textColorForBackground } = utils();

const props = defineProps({
    culture: {
        type: String,
        required: true
    }
})

const p = computed(() => {
    const { palette:p, hues, themes,} = bridge({ culture: props.culture });
    return {
        palette:p,
        hues,
        themes
    }
})

</script>

<template>
    <div class="flex flex-col">
        <h2 class="flex flex-row px-2 gap-2 place-items-center" :style="{
            background: `linear-gradient(to right, ${store.mainColor+20}, transparent)`
        }"><VueUiIcon name="palette" :stroke="isDarkMode ? p.palette.success : '#1A1A1A'"/><code class="text-xl">palette</code></h2>
        <div class="flex flew-row flex-wrap justify-center gap-4">
            <div v-for="feeling in Object.keys(p.palette)">
                <div class="flex flex-col gap-1 w-[100px] sm:w-[200px]">
                <div class="flex flex-col">
                    <code style="font-weight: bold">{{ feeling }}</code>
                    <code>{{ p.palette[feeling] }}</code>
                </div>
                <button :style="{
                    height: '40px',
                    width: '100%',
                    background: p.palette[feeling],
                    border: isDarkMode ? '1px solid #3A3A3A' : '1px solid #CCCCCC',
                    cursor: 'pointer'
                }" @click="emit('click', p.palette[feeling])"/>
                </div>
            </div>
        </div>
    </div>

    <div class="flex flex-col">
        <h2 class="flex flex-row px-2 gap-2 place-items-center" :style="{
            background: `linear-gradient(to right, ${store.mainColor+20}, transparent)`
        }"><VueUiIcon name="chartWaffle" :stroke="isDarkMode ? p.palette.success : '#1A1A1A'"/><code class="text-xl">hues</code></h2>
        <div class="flex flew-row flex-wrap justify-center gap-4">
            <div v-for="feeling in Object.keys(p.palette)">
                <div class="flex flex-col w-[100px] sm:w-[200px]">
                    <div class="flex flex-col">
                        <code style="font-weight: bold">{{ feeling }}</code>
                    </div>

                    <div class="flex flex-row gap-2" v-for="color in p.hues[feeling]">
                        <code>{{ color }}</code>

                        <button
                            class="cursor-pointer w-full"
                            @click="emit('click', color)"
                            :style="{
                                background: color,
                                height: '20px',
                            }"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="flex flex-col">
        <h2 class="flex flex-row px-2 gap-2 place-items-center" :style="{
            background: `linear-gradient(to right, ${store.mainColor+20}, transparent)`
        }"><VueUiIcon name="legend" :stroke="isDarkMode ? p.palette.success : '#1A1A1A'"/><code class="text-xl">themes</code></h2>
        <div class="flex flex-col gap-4">
            <div v-for="theme in Object.keys(p.themes)" class="grid grid-cols-2 gap-2 sm:gap-8">
                <div class="text-xs sm:text-sm">
                    <h3 class="pb-5"><code>{{ theme }}</code></h3>
                    <div class="flex flex-row gap-2 place-items-center" v-for="key in Object.keys(p.themes[theme])">
                        <button class="h-[20px] w-[40px] outline outline-gray-300 cursor-pointer" :style="{ background: p.themes[theme][key] }" @click="emit('click', p.themes[theme][key])"/>
                        <code class="text-[9px] sm:text-sm">{{ p.themes[theme][key] }}</code>
                        <code class="text-[9px] sm:text-sm">{{ key }}</code>
                    </div>
                </div>

                <div :style="{ background: p.themes[theme].backgroundColor }" class="relative shadow h-[150px] rounded">
                    <div :style="{ color: p.themes[theme].textColor, borderBottom: `2px solid ${p.themes[theme].tertiary}` }" class="pl-[12px] py-2">
                        {{ theme }}
                    </div>
                    
                    <div :style="{ background: p.themes[theme].secondary }" class="absolute top-2 right-3 rounded-full h-[20px] w-[20px] shadow flex flex-row place-items-center justify-center">
                        <VueUiIcon name="starFill" :stroke="textColorForBackground(p.themes[theme].secondary)" :size="10"/>
                    </div>
                    <div :style="{ background: p.themes[theme].primary, color: textColorForBackground(p.themes[theme].primary) }" class="absolute top-[114px] left-[24px] h-[24px] w-[80px] shadow-md rounded-full text-center">
                        Action!
                    </div>
                    <div :style="{ color: p.themes[theme].textColor, fontWeight: 'bold' }" class="absolute top-14 left-[24px] text-2xl leading-6">
                        This is <span :style="{ color: p.themes[theme].primary, fontWeight: 'bold'}">the Hero</span> section
                    </div>
                    <svg class="absolute bottom-3 right-6 h-[50px] w-[50px] bg-transparent rotate-5" viewBox="0 0 50 50" :style="{
                        filter: `drop-shadow(0 1px 1px ${p.themes[theme].primary})`
                    }">
                        <path 
                            d="M 5 25 C 16 36 18.3333 38.3333 25 45 C 31.6667 31.6667 37 18 45 5"
                            fill="none"
                            :stroke="p.themes[theme].tertiary"
                            stroke-linecap="round"
                            stroke-width="1.6"
                        />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>