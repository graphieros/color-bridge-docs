<script setup>
import { useMainStore } from "@/stores/main";
import { ref, computed } from "vue";
import colorBridge from "color-bridge";
import { VueUiIcon } from "vue-data-ui";
import { CopyIcon } from "vue-tabler-icons";
import CodeParser from "./CodeParser.vue";

const store = useMainStore();
const isDarkMode = computed(() => store.isDarkMode);

const { utils } = colorBridge();
const {
    textColorForBackground,
    createHues,
    createShiftedHues,
    lightenHexColor,
    shiftHue,
    darkenHexColor
} = utils();

function copyToClipboard(conf, justText = false) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    if (justText) {
        selBox.value = conf;
    } else {
        selBox.value = JSON.stringify(conf);
    }
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    store.copy();
}

function parseColor(color) {
    let r = 0, g = 0, b = 0, alpha = 1;

    if (color.startsWith("rgba")) {
        const rgbaMatch = color.match(/rgba?\((\d+), (\d+), (\d+), ([\d.]+)\)/);
        if (rgbaMatch) {
            [, r, g, b, alpha] = rgbaMatch.map(Number);
        }
    } else if (color.startsWith("rgb")) {
        const rgbMatch = color.match(/rgb\((\d+), (\d+), (\d+)\)/);
        if (rgbMatch) {
            [, r, g, b] = rgbMatch.map(Number);
        }
    } else if (color.startsWith("#")) {
        const hex = color.replace("#", "");
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
            r = parseInt(hex.slice(0, 2), 16);
            g = parseInt(hex.slice(2, 4), 16);
            b = parseInt(hex.slice(4, 6), 16);
        }
    }

    return { r, g, b, alpha };
}

function calculateLuminance({ r, g, b }) {
    const normalize = (value) =>
        value / 255 <= 0.03928
            ? value / 255 / 12.92
            : Math.pow((value / 255 + 0.055) / 1.055, 2.4);

    return 0.2126 * normalize(r) + 0.7152 * normalize(g) + 0.0722 * normalize(b);
}

function calculateContrastRatio(color1, color2) {
    const rgb1 = parseColor(color1);
    const rgb2 = parseColor(color2);

    const luminance1 = calculateLuminance(rgb1);
    const luminance2 = calculateLuminance(rgb2);

    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);

    return (lighter + 0.05) / (darker + 0.05);
}


const installationCode = computed(() => {
    return `import colorBridge from "color-bridge";

const { utils } = colorBridge();
const {
  createHues,
  createShiftedHues,
  darkenHexColor,
  lightenHexColor,
  shiftHue,
  textColorForBackground
} = utils();
`
})

const selectedColor = ref(store.mainColor);


const force_light = ref(0.2);
const force_dark = ref(0.2);
const shift_step = ref(0.018);
const shift_range = ref(0.3);
const force_hue = ref(0.04);

const selectedHues = computed(() => {
    return createHues({ hexColor: selectedColor.value });
})

const selectedShiftedHues = computed(() => {
    return createShiftedHues({
        hexColor: selectedColor.value,
        step: shift_step.value,
        range: shift_range.value
    })
})

const code_createHues = computed(() => {
    return `const myHues = createHues({ hexColor: "${selectedColor.value}" });`
});

const code_createShiftedHues = computed(() => {
    return `const myHues = createShiftedHues({ 
        hexColor: "${selectedColor.value}", 
        step: ${shift_step.value}, 
        range: ${shift_range.value} 
    });`
});

const code_textColorForBackground = computed(() => {
    return `const myTextColor = textColorForBackground("${selectedColor.value}");`
})

const code_lightenHexColor = computed(() => {
    return `const lightened = lightenHexColor("${selectedColor.value}");`
})

const code_darkenHexColor = computed(() => {
    return `const darkened = darkenHexColor("${selectedColor.value}");`
})

const code_shiftedHexColor = computed(() => {
    return `const shifted = shiftHue({
        hexColor: "${selectedColor.value}",
        force: ${force_hue.value}
    });`
})

</script>

<template>
    <div class="flex flex-col w-full">
        <h2 class="flex flex-row px-2 gap-2 place-items-center" :style="{
            background: `linear-gradient(to right, ${store.mainColor + 20}, transparent)`
        }">
            <VueUiIcon name="func" :stroke="isDarkMode ? store.mainPalette.palette.success : '#1A1A1A'" /><code
                class="text-xl">Utility functions</code>
        </h2>

        <div class="mt-12 code-parser p-5 rounded relative w-full max-w-[650px]" style="margin: 0 auto">
            <button class="cursor-pointer absolute top-2 right-2" @click="copyToClipboard(installationCode, true)">
                <CopyIcon :style="{ color: store.mainColor }" />
            </button>
            <CodeParser :content="installationCode" language="javascript" />
        </div>

        <div class="w-full p-4  bg-[#FFFFFF10] rounded" style="margin: 1rem 0">
            <h3 class="flex flew-row gap-2 place-items-center text-md">
                <VueUiIcon name="func" :stroke="isDarkMode ? store.mainPalette.palette.success : '#1A1A1A'"
                    :size="16" /><code>createHues</code>
            </h3>

            <div class="flex flex-col" style="margin: 1rem 0">
                <label for="hue_select">Select color:</label>
                <input id="hue_select" type="color" v-model="selectedColor" />
            </div>
            <div class="mt-12 code-parser p-5 rounded relative w-full max-w-[650px]" style="margin: 0 auto">
                <button class="cursor-pointer absolute top-2 right-2" @click="copyToClipboard(code_createHues, true)">
                    <CopyIcon :style="{ color: store.mainColor }" />
                </button>
                <CodeParser :content="code_createHues" language="javascript" />
            </div>

            <div style="margin-top: 1rem">Result:</div>
            <div class="grid grid-cols-17">
                <div class="h-[40px] w-full" v-for="c in selectedHues" :style="{ background: c }" />
            </div>
            <code class="text-xs">
                {{ selectedHues }}
            </code>
        </div>

        <div class="w-full p-4  bg-[#FFFFFF10] rounded" style="margin: 1rem 0">
            <h3 class="flex flew-row gap-2 place-items-center text-md">
                <VueUiIcon name="func" :stroke="isDarkMode ? store.mainPalette.palette.success : '#1A1A1A'"
                    :size="16" /><code>createShiftedHues</code>
            </h3>

            <div class="flex flew-row gap-2 place-items-center" style="margin: 1rem 0">
                <div class="flex flex-col">
                    <label for="hue_select">Select color:</label>
                    <input id="hue_select" type="color" v-model="selectedColor" />
                </div>
                <div class="flex flex-col">
                    <label for="shift_range">Select range:</label>
                    <input type="range" id="shift_range" v-model="shift_range" :min="0.1" :max="0.5" :step="0.01" :style="{
                            accentColor: store.mainColor
                        }"/>
                </div>
            </div>
            <div class="mt-12 code-parser p-5 rounded relative w-full max-w-[650px]" style="margin: 0 auto">
                <button class="cursor-pointer absolute top-2 right-2" @click="copyToClipboard(code_createShiftedHues, true)">
                    <CopyIcon :style="{ color: store.mainColor }" />
                </button>
                <CodeParser :content="code_createShiftedHues" language="javascript" />
            </div>

            <div style="margin-top: 1rem">Result:</div>
            <div class="grid grid-cols-17">
                <div class="h-[40px] w-full" v-for="c in selectedShiftedHues" :style="{ background: c }" />
            </div>
            <code class="text-xs">
                    {{ selectedShiftedHues }}
                </code>
        </div>

        <div class="w-full p-4  bg-[#FFFFFF10] rounded" style="margin: 1rem 0">
            <h3 class="flex flew-row gap-2 place-items-center text-md">
                <VueUiIcon name="func" :stroke="isDarkMode ? store.mainPalette.palette.success : '#1A1A1A'"
                    :size="16" /><code>textColorForBackground</code>
            </h3>

            <div class="flex flex-col" style="margin: 1rem 0">
                <label for="hue_select">Select color:</label>
                <input id="hue_select" type="color" v-model="selectedColor" />
            </div>
            <div class="mt-12 code-parser p-5 rounded relative w-full max-w-[650px]" style="margin: 0 auto">
                <button class="cursor-pointer absolute top-2 right-2" @click="copyToClipboard(code_textColorForBackground, true)">
                    <CopyIcon :style="{ color: store.mainColor }" />
                </button>
                <CodeParser :content="code_textColorForBackground" language="javascript" />
            </div>

            <div style="margin-top: 1rem">Result:</div>

            <div class="w-full p-4"
                :style="{ background: selectedColor, color: textColorForBackground(selectedColor) }">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia quis magnam nesciunt ipsum qui,
                dignissimos accusamus laborum maxime delectus dolore rem provident earum praesentium omnis ex corporis
                recusandae sint. Praesentium!
            </div>
            <div class="w-full flex flex-col place-items-center justify-center text-center" style="margin-top:2rem;">
                <span>Contrast ratio</span>
                <span class="text-[64px] tabular-nums" :style="{
                    fontWeight: 'bold',
                }">{{ calculateContrastRatio(selectedColor, textColorForBackground(selectedColor)).toFixed(2) }}</span>
            </div>
        </div>

        <div class="w-full p-4  bg-[#FFFFFF10] rounded" style="margin: 1rem 0">
            <h3 class="flex flew-row gap-2 place-items-center text-md">
                <VueUiIcon name="func" :stroke="isDarkMode ? store.mainPalette.palette.success : '#1A1A1A'"
                    :size="16" /><code>lightenHexColor</code>
            </h3>

            <div class="flex flex-row gap-4">
                <div class="flex flex-col" style="margin: 1rem 0">
                    <label for="hue_select">Select color:</label>
                    <input id="hue_select" type="color" v-model="selectedColor" />
                </div>
                <div class="flex flex-col" style="margin: 1rem 0">
                    <label for="force_light">Force:</label>
                    <div class="flex flew-row place-items-center gap-2">
                        <input id="force_light" type="range" min="0" max="1" step="0.01" v-model="force_light" :style="{
                            accentColor: store.mainColor
                        }" />{{ force_light }}
                    </div>
                </div>
            </div>
            <div class="mt-12 code-parser p-5 rounded relative w-full max-w-[650px]" style="margin: 0 auto">
                <button class="cursor-pointer absolute top-2 right-2" @click="copyToClipboard(code_lightenHexColor, true)">
                    <CopyIcon :style="{ color: store.mainColor }" />
                </button>
                <CodeParser :content="code_lightenHexColor" language="javascript" />
            </div>

            <div style="margin-top: 1rem">Result:</div>
            <div class="w-full text-[36px] text-center" :style="{
                background: lightenHexColor({ hexColor: selectedColor, force: force_light}),
                color: textColorForBackground(lightenHexColor({ hexColor: selectedColor, force: force_light}))
            }">
                <code>
                    {{ lightenHexColor({ hexColor: selectedColor, force: force_light}) }}
                </code>
            </div>
        </div>

        <div class="w-full p-4  bg-[#FFFFFF10] rounded" style="margin: 1rem 0">
            <h3 class="flex flew-row gap-2 place-items-center text-md">
                <VueUiIcon name="func" :stroke="isDarkMode ? store.mainPalette.palette.success : '#1A1A1A'"
                    :size="16" /><code>darkenHexColor</code>
            </h3>

            <div class="flex flex-row gap-4">
                <div class="flex flex-col" style="margin: 1rem 0">
                    <label for="hue_select">Select color:</label>
                    <input id="hue_select" type="color" v-model="selectedColor" />
                </div>
                <div class="flex flex-col" style="margin: 1rem 0">
                    <label for="force_dark">Force:</label>
                    <div class="flex flew-row place-items-center gap-2">
                        <input id="force_dark" type="range" min="0" max="1" step="0.01" v-model="force_dark" :style="{
                            accentColor: store.mainColor
                        }" />{{ force_dark }}
                    </div>
                </div>
            </div>
            <div class="mt-12 code-parser p-5 rounded relative w-full max-w-[650px]" style="margin: 0 auto">
                <button class="cursor-pointer absolute top-2 right-2" @click="copyToClipboard(code_darkenHexColor, true)">
                    <CopyIcon :style="{ color: store.mainColor }" />
                </button>
                <CodeParser :content="code_darkenHexColor" language="javascript" />
            </div>

            <div style="margin-top: 1rem">Result:</div>
            <div class="w-full text-[36px] text-center" :style="{
                background: darkenHexColor({ hexColor: selectedColor, force: force_dark}),
                color: textColorForBackground(darkenHexColor({ hexColor: selectedColor, force: force_dark}))
            }">
                <code>
                    {{ darkenHexColor({ hexColor: selectedColor, force: force_dark}) }}
                </code>
            </div>
        </div>

        <div class="w-full p-4  bg-[#FFFFFF10] rounded" style="margin: 1rem 0">
            <h3 class="flex flew-row gap-2 place-items-center text-md">
                <VueUiIcon name="func" :stroke="isDarkMode ? store.mainPalette.palette.success : '#1A1A1A'"
                    :size="16" /><code>shiftHue</code>
            </h3>

            <div class="flex flex-row gap-4">
                <div class="flex flex-col" style="margin: 1rem 0">
                    <label for="hue_select">Select color:</label>
                    <input id="hue_select" type="color" v-model="selectedColor" />
                </div>
                <div class="flex flex-col" style="margin: 1rem 0">
                    <label for="force_hue">Force:</label>
                    <div class="flex flew-row place-items-center gap-2">
                        <input id="force_hue" type="number" min="0" max="1" step="0.001" v-model="force_hue" :style="{
                            accentColor: store.mainColor
                        }" />{{ force_hue }}
                    </div>
                </div>
            </div>
            <div class="mt-12 code-parser p-5 rounded relative w-full max-w-[650px]" style="margin: 0 auto">
                <button class="cursor-pointer absolute top-2 right-2" @click="copyToClipboard(code_shiftedHexColor, true)">
                    <CopyIcon :style="{ color: store.mainColor }" />
                </button>
                <CodeParser :content="code_shiftedHexColor" language="javascript" />
            </div>

            <div style="margin-top: 1rem">Result:</div>
            <div class="w-full text-[36px] text-center" :style="{
                background: shiftHue({ hexColor: selectedColor, force: force_hue}),
                color: textColorForBackground(shiftHue({ hexColor: selectedColor, force: force_hue}))
            }">
                <code>
                    {{ shiftHue({ hexColor: selectedColor, force: force_hue}) }}
                </code>
            </div>
        </div>
    </div>
</template>