<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterView } from 'vue-router';
import { useMainStore } from './stores/main';
import { SunIcon, MoonIcon, BrandGithubFilledIcon, StarFilledIcon } from "vue-tabler-icons";
import { VueUiIcon } from "vue-data-ui";
import pack from "../package.json"

const store = useMainStore();

const isDarkMode = computed(() => store.isDarkMode);

onMounted(() => {
  if(!localStorage.theme) {
    localStorage.setItem('theme', 'dark');
    document.documentElement.classList.add("dark");
    store.isDarkMode = true;
  } else {
    document.documentElement.classList.add(localStorage.theme);
  }
})

function changeTheme() {
    if (localStorage.theme === "dark") {
        localStorage.theme = "light";
        document.documentElement.classList.remove("dark");
        store.isDarkMode = false;
    } else {
        localStorage.theme = "dark";
        document.documentElement.classList.add("dark");
        store.isDarkMode = true;
    }
}

</script>

<template>
  <header class="sticky top-0 left-0 py-2 card w-full flex justify-center shadow px-5 z-100">
    <div class="w-full max-w-[1200px] flex flew-row place-items-center justify-between">
      <div class="text-2xl flex flex-row place-items-center gap-2">
        <VueUiIcon name="moodLaughing":stroke="store.mainColor" :size="24"/>
        <span style="font-weight: bold">
          Color Bridge
        </span>
        <code class="text-xs">v{{ pack.dependencies["color-bridge"].replace('^', '') }}</code>
      </div>
      <div class="flex flex-row gap-6 place-items-center pr-6">
        <button @click="changeTheme" class="cursor-pointer">
          <SunIcon v-if="isDarkMode"/>
          <MoonIcon v-else/>
        </button>
        <button class="cursor-pointer relative">
          <a href="https://github.com/graphieros/color-bridge" target="_blank">
            <BrandGithubFilledIcon :style="{ color: isDarkMode ? store.mainColor : '#1A1A1A'}"/>
            <div class="absolute -top-3 left-[100%] flex flex-row text-right place-items-center tabular-nums gap-0.5">
              <StarFilledIcon :size="12" class="text-orange-300"/>
              <span v-if="store.stars">
                {{ store.stars }}
              </span>
            </div>
          </a>
        </button>
      </div>
    </div>
    <div v-if="store.mainPalette" class="fixed top-[46px] h-0.5 w-full left-0" :style="{
      background: `linear-gradient(to right, ${store.mainPalette.palette.sadness}, ${store.mainPalette.palette.error}, ${store.mainPalette.palette.neutrality}, ${store.mainPalette.palette.happiness}, ${store.mainPalette.palette.success})`,
    }"/>
  </header>

  <RouterView />
</template>