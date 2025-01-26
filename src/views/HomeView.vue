<script setup>
import { ref, computed } from "vue";
import CodeParser from "../components/CodeParser.vue";
import { CopyIcon } from "vue-tabler-icons";
import { useMainStore } from "@/stores/main";
import ConfirmCopy from "../components/ConfirmCopy.vue";
import PaletteUnit from "../components/PaletteUnit.vue";
import colorBridge from "color-bridge";
import { watch } from "vue";
import ColorBridgeGauge from "../components/ColorBridgeGauge.vue";
import { VueUiIcon } from "vue-data-ui";
import UtilityFunctions from "@/components/UtilityFunctions.vue";
import ThemeDialog from "@/components/ThemeDialog.vue";

const store = useMainStore();
const isDarkMode = computed(() => store.isDarkMode);

const { bridge, utils } = colorBridge();

const { textColorForBackground } = utils();

function copyToClipboard(conf, justText=false) {
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

const installationCode = computed(() => {
  return `import colorBridge from "color-bridge";

const { bridge, utils } = colorBridge();
const { palette, hues, themes } = bridge({culture: '${selectedCulture.value}'});
const {
  createHues,
  darkenHexColor,
  lightenHexColor,
  textColorForBackground
} = utils();
`
})

const selectedCulture = ref('chinese')

const cultures = ref([
  'african',
  'chinese',
  'indian',
  'japanese',
  'latinAmerican',
  'middleEastern',
  'southeastAsian',
  'western'
])

const p = computed(() => {
    const { palette:p, hues} = bridge({ culture: selectedCulture.value });
    return {
        palette:p,
        hues,
    }
})

watch(() => selectedCulture.value, (c) => {
  store.mainColor = p.value.palette.success;
  store.mainPalette = p.value
}, { immediate: true})

const selectedColor = computed(() => store.mainColor);
const textColor = computed(() => isDarkMode.value ? '#CCCCCC' : '#1A1A1A')

const dialog = ref(null);

</script>

<template>
  <div 
    v-if="store.mainPalette"
    class="invisible sm:visible fixed -top-0] left-0"
    :style="{
      border: `0px solid ${store.mainPalette.palette.neutrality}`,
      height: '500px',
      width: '500px',
      background: `radial-gradient(at top left,${store.mainPalette.palette.happiness}, ${store.mainPalette.palette.success}, transparent, transparent, transparent, transparent)`,
      opacity: 0.1,
      pointerEvents: 'none',
    }"
  />

  <main class="flex w-full justify-center py-18">
    <div class="max-w-[1200px] flex flex-col place-items-center gap-12 px-5">

      <div class="flex flex-col sm:flex-row gap-4 place-items-center justify-between">
        <h1 class="text-4xl text-center sm:text-left max-w-[30ch]">
          Generate region-specific <span :style="{ color: p.palette.success }">color palettes</span> based on cultural contexts
        </h1>
        <ColorBridgeGauge />
      </div>

      <div class="flex flex-row gap-4 justify-center pt-4">
          <div class="flex flex-col justify-center place-items-center">
            <div class="relative h-[54px] w-[54px] rounded-full" :style="{ background: `radial-gradient(${p.hues.sadness[6]}, ${p.hues.sadness[12]})` }">
              <VueUiIcon 
                name="moodSad" :stroke="textColorForBackground(p.palette.sadness)" :stroke-width="0.5" :size="50" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                :style="{
                  filter: 'drop-shadow(0 1px 1px #6A6A6A)'
                }"
              />
            </div>
            <code class="text-xs">sadness</code>
            <code>{{ p.palette.sadness }}</code>
          </div>

          <div class="flex flex-col justify-center place-items-center">
            <div class="relative h-[54px] w-[54px] rounded-full" :style="{ background: `radial-gradient(${p.hues.error[6]}, ${p.hues.error[12]})` }">
              <VueUiIcon name="moodFlat" :stroke="textColorForBackground(p.palette.error)" :stroke-width="0.5" :size="50" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" :style="{
                  filter: 'drop-shadow(0 1px 1px #6A6A6A)'
                }"/>
            </div>
            <code class="text-xs">error</code>
            <code>{{ p.palette.error }}</code>
          </div>

          <div class="flex flex-col justify-center place-items-center">

            <div class="relative h-[54px] w-[54px] rounded-full" :style="{ background: `radial-gradient(${p.hues.neutrality[6]}, ${p.hues.neutrality[12]})` }">
              <VueUiIcon name="moodNeutral" :stroke="textColorForBackground(p.palette.neutrality)" :stroke-width="0.5" :size="50" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" :style="{
                  filter: 'drop-shadow(0 1px 1px #6A6A6A)'
                }"/>
            </div>
            <code class="text-xs">neutrality</code>
            <code>{{ p.palette.neutrality }}</code>
          </div>

          <div class="flex flex-col justify-center place-items-center">
            <div class="relative h-[54px] w-[54px] rounded-full" :style="{ background: `radial-gradient(${p.hues.happiness[6]}, ${p.hues.happiness[12]})` }">
              <VueUiIcon name="smiley" :stroke="textColorForBackground(p.palette.happiness)" :size="50" :stroke-width="0.5" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" :style="{
                  filter: 'drop-shadow(0 1px 1px #6A6A6A)'
                }"/>
            </div>
            <code class="text-xs">happiness</code>
            <code>{{ p.palette.happiness }}</code>
          </div>

          <div class="flex flex-col justify-center place-items-center">
            <div class="relative h-[54px] w-[54px] rounded-full" :style="{ background: `radial-gradient(${p.hues.success[6]}, ${p.hues.success[12]})` }">
              <VueUiIcon name="moodHappy" :stroke="textColorForBackground(p.palette.success)" :size="50" :stroke-width="0.5" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" :style="{
                  filter: 'drop-shadow(0 1px 1px #6A6A6A)'
                }"/>
            </div>
            <code class="text-xs">success</code>
            <code>{{ p.palette.success }}</code>
          </div>
      </div>

      <button class="cursor-pointer relative pr-8 w-fit" @click="copyToClipboard('npm i color-bridge', true)">
        <CopyIcon class="absolute top-1/2 -translate-y-1/2 right-0" :style="{ color: selectedColor }"/>
        <code class="text-3xl">npm i color-bridge</code>
      </button>

      <div class="flex flex-col gap-1 justify-center place-items-center">
        <div class="select">
					<select class="select-text" v-model="selectedCulture" id="culture" :style="{background: `${p.palette.success}20`}">
            <option v-for="culture in cultures">{{ culture }}</option>
					</select>
					<span class="select-highlight"></span>
					<span class="select-bar"></span>
					<label for="culture" class="select-label" :data-dark="isDarkMode">Select a culture</label>
				</div>
      </div>

      <div class="mt-12 code-parser p-5 rounded relative w-full max-w-[650px]">
        <button class="cursor-pointer absolute top-2 right-2" @click="copyToClipboard(installationCode, true)">
          <CopyIcon :style="{ color: selectedColor }"/>
        </button>
        <CodeParser :content="installationCode" language="javascript"/>
      </div>
      
      <PaletteUnit :culture="selectedCulture" @click="(color) => copyToClipboard(color, true)"/>

      <button @click="dialog.openDialog()"
        class="invisible sm:visible py-2 px-6 cursor-pointer rounded"
        :style="{
          background: selectedColor,
          color: textColorForBackground(selectedColor)
        }"
      >
        Play with themes
      </button>

      <div class="flex flex-col gap-1 justify-center place-items-center">
        <div class="select">
					<select class="select-text" v-model="selectedCulture" id="culture" :style="{background: `${p.palette.success}20`}">
            <option v-for="culture in cultures">{{ culture }}</option>
					</select>
					<span class="select-highlight"></span>
					<span class="select-bar"></span>
					<label for="culture" class="select-label" :data-dark="isDarkMode">Select a culture</label>
				</div>
      </div>

      <UtilityFunctions />

    </div>
  </main>

  <div :style="{
      background: `linear-gradient(to right, ${p.palette.sadness}, ${p.palette.error}, ${p.palette.neutrality}, ${p.palette.happiness}, ${p.palette.success})`,
      margin: '0 auto'
    }"
    class="w-full h-1 rounded-full max-w-[1200px]"
  />

  <footer class="w-full py-12 flex flex-col">
    <div class="flex flex-row gap-2 place-items-center justify-center">
      <VueUiIcon name="copyLeft" :stroke="isDarkMode ? selectedColor : '#1A1A1A'"/>
      <span><span style="font-weight:bold">color-bridge</span> {{ new Date().getFullYear() }}</span>
    </div>
    <div class="flex flex-row justify-center gap-1">All charts are composed with <a href="https://vue-data-ui.graphieros.com/" class="underline" target="_blank" :style="{ color: isDarkMode ? selectedColor : '#1A1A1A' }">Vue Data UI</a></div>
  </footer>
  <ConfirmCopy />

  <ThemeDialog ref="dialog">
  </ThemeDialog>
</template>


<style>
.select {
	position: relative;
	width: 350px;
  color: #8A8A8A;
}

.select-text {
	position: relative;
	font-family: inherit;
	background-color: transparent;
	width: 350px;
	padding: 10px;
	font-size: 18px;
	border-radius: 2px 2px 0 0;
	border: none;
	border-bottom: 1px solid v-bind(selectedColor+40);
}

.select-text:focus {
	outline: none;
	border-bottom: 1px solid rgba(0,0,0, 0);
}

.select .select-text {
	appearance: none;
	-webkit-appearance:none
}

.select:after {
	position: absolute;
	top: 1.5rem;
	right: 10px;
	/* arrow */
	width: 0;
	height: 0;
	padding: 0;
	content: '';
	border-left: 6px solid transparent;
	border-right: 6px solid transparent;
	border-top: 6px solid v-bind(selectedColor);
	pointer-events: none;
}

.select-label {
  color: #1A1A1A;
	font-size: 18px;
	font-weight: normal;
	position: absolute;
	pointer-events: none;
	left: 0;
	top: 1rem;
	transition: 0.2s ease all;
}

.select-text:focus ~ .select-label, .select-text:valid ~ .select-label {
	color: #1A1A1A;
	top: -20px;
	transition: 0.2s ease all;
	font-size: 14px;
  color: v-bind(textColor);
}

.select-bar {
	position: relative;
	display: block;
	width: 350px;
}

.select-bar:before, .select-bar:after {
  content: '';
  height: 2px;
  width: 0;
  bottom: 1px;
  background: v-bind(selectedColor);
  position: absolute;
  transition: 0.2s ease all;
}

.select-bar:before {
	left: 50%;
}

.select-bar:after {
	right: 50%;
}

.select-text:focus ~ .select-bar:before, .select-text:focus ~ .select-bar:after {
	width: 50%;
}

.select-highlight {
	position: absolute;
	height: 60%;
	width: 100px;
	top: 25%;
	left: 0;
	pointer-events: none;
	opacity: 0.5;
}
</style>