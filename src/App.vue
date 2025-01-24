<script setup lang="ts">
import { computed, onMounted } from "vue";
import { RouterView } from 'vue-router';
import { useMainStore } from './stores/main';
import { SunIcon, MoonIcon, BrandGithubFilledIcon } from "vue-tabler-icons";
import { VueUiIcon } from "vue-data-ui";

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
        <VueUiIcon name="moodLaughing":stroke="store.mainColor" :size="20"/>
        color-bridge
        <span class="text-xs">v1.0.0</span>
      </div>
      <div class="flex flex-row gap-6 place-items-center">
        <button @click="changeTheme" class="cursor-pointer">
          <SunIcon v-if="isDarkMode"/>
          <MoonIcon v-else/>
        </button>
        <button class="cursor-pointer">
          <a href="https://github.com/graphieros/color-bridge" target="_blank">
            <BrandGithubFilledIcon/>
          </a>
        </button>
      </div>
    </div>
  </header>

  <RouterView />
</template>