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

const store = useMainStore();
const isDarkMode = computed(() => store.isDarkMode);

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
const { palette, hues } = colorBridge({culture: '${selectedCulture.value}'});
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
    const { palette:p, hues } = colorBridge({ culture: selectedCulture.value });
    return {
        palette:p,
        hues
    }
})

watch(() => selectedCulture.value, (c) => {
  store.mainColor = p.value.palette.success;
})

const selectedColor = computed(() => store.mainColor);
const textColor = computed(() => isDarkMode.value ? '#CCCCCC' : '#1A1A1A')

</script>

<template>
  <main class="flex w-full justify-center py-18">
    <div class="max-w-[1200px] flex flex-col place-items-center gap-20 px-5">

      <div class="flex flex-col sm:flex-row gap-4 place-items-center justify-between">
        <h1 class="text-4xl text-center sm:text-left max-w-[30ch]">
          Generate region-specific <span :style="{ color: p.palette.success }">color palettes</span> based on cultural contexts
        </h1>

        <ColorBridgeGauge />
      </div>

      <button class="cursor-pointer relative pr-8 w-fit" @click="copyToClipboard('npm i color-bridge', true)">
        <CopyIcon class="absolute top-1/2 -translate-y-1/2 right-0" :style="{ color: selectedColor }"/>
        <code>npm i color-bridge</code>
      </button>

      <div class="mt-12 code-parser p-5 rounded relative w-full max-w-[650px]">
        <button class="cursor-pointer absolute top-2 right-2" @click="copyToClipboard(installationCode, true)">
          <CopyIcon :style="{ color: selectedColor }"/>
        </button>
        <CodeParser :content="installationCode" language="javascript"/>
      </div>

      <div class="flex flex-col gap-1">
        <div class="select">
					<select class="select-text" v-model="selectedCulture" id="culture" :style="{background: `${p.palette.success}20`}">
            <option v-for="culture in cultures">{{ culture }}</option>
					</select>
					<span class="select-highlight"></span>
					<span class="select-bar"></span>
					<label for="culture" class="select-label" :data-dark="isDarkMode">Select a culture</label>
				</div>
      </div>

      <PaletteUnit :culture="selectedCulture" @click="(color) => copyToClipboard(color, true)"/>
    </div>
  </main>
  <ConfirmCopy />
</template>


<style>
.select {
	position: relative;
	width: 350px;
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