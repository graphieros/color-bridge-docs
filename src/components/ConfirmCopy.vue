<script setup>
import { useMainStore } from "@/stores/main";
import { computed } from "vue";
import { CheckIcon } from "vue-tabler-icons";

const store = useMainStore()
const isCopy = computed(() => store.isCopy);
    
</script>

<template>
    <div style="z-index:10000000" v-if="isCopy" class="origin-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col place-items-center gap-2 bg-[#FFFFFF40] rounded-full shadow-md">    
        <div style="z-index:10000000" v-if="isCopy" class="animate-pulse h-[80px] w-[80px] flex place-items-center place-content-center ">
            <CheckIcon size="42" class="text-yellow-500"/>
        </div>
    </div>
</template>