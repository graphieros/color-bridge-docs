<script setup>
import { useMainStore } from "@/stores/main";
import { ref, computed } from "vue";
import colorBridge from "color-bridge";

const store = useMainStore();
const isDarkMode = computed(() => store.isDarkMode);

const { textColorForBackground } = colorBridge()

console.log(textColorForBackground('#6376DD'))

</script>

<template>
    <div></div>
</template>