<script setup>
import { ref, computed } from "vue";
import colorBridge from "color-bridge";
import { useMainStore } from "@/stores/main";
import { VueUiIcon } from "vue-data-ui";

const store = useMainStore();
const emit = defineEmits(['click'])

const isDarkMode = computed(() => store.isDarkMode);

const props = defineProps({
    culture: {
        type: String,
        required: true
    }
})

const p = computed(() => {
    const { palette:p, hues } = colorBridge({ culture: props.culture });
    return {
        palette:p,
        hues
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
</template>