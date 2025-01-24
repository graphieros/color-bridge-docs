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
        <CopyIcon class="absolute top-1/2 -translate-y-1/2 right-0"/>
        <code>npm i color-bridge</code>
      </button>

      <div class="mt-12 code-parser p-5 rounded relative w-full max-w-[650px]">
        <button class="cursor-pointer absolute top-2 right-2" @click="copyToClipboard(installationCode, true)">
          <CopyIcon class="text-[#CCCCCC]"/>
        </button>
        <CodeParser :content="installationCode" language="javascript"/>
      </div>

      <div class="flex flex-col gap-1">
        <label class="pl-0" for="culture">Select a culture:</label>
        <div class="flex flex-row gap-2 place-items-center">
          <!-- <div :style="{
            backgroundColor: p.palette.success,
            height: '12px',
            width: '12px',
            borderRadius: '50%'
          }"/> -->
          <code>
            <select v-model="selectedCulture" id="culture" class="py-2 px-2 rounded text-xl" :style="{
              border: `1px solid ${p.palette.success}`,
              background: `${p.palette.success}20`
            }">
              <option v-for="culture in cultures">{{ culture }}</option>
            </select>
          </code>
        </div>
      </div>

      <PaletteUnit :culture="selectedCulture" @click="(color) => copyToClipboard(color, true)"/>
    </div>
  </main>
  <ConfirmCopy />
</template>
