<script setup>
import { useMainStore } from "@/stores/main";
import { computed } from "vue";
import { CheckIcon } from "vue-tabler-icons";
import { VueUiIcon } from "vue-data-ui";

const store = useMainStore()
const isCopy = computed(() => store.isCopy);
    
</script>

<template>
    <div style="z-index:10000000" v-if="isCopy" class="animate-ping origin-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col place-items-center gap-2 rounded-full" :style="{
        background: store.mainColor + 20
    }">    
        <div style="z-index:10000000" v-if="isCopy" class="animate-pulse h-[100px] w-[100px] flex place-items-center place-content-center ">
            <VueUiIcon name="copyLeft" :stroke="store.mainColor" :size="100"/>
        </div>
    </div>
</template>