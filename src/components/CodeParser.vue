<script setup>
import { useMainStore } from '@/stores/main';
import { computed } from 'vue';
import { VueHiCode } from "vue-hi-code";
import "vue-hi-code/style.css";

const props = defineProps({
    content: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
});

const store = useMainStore();

const config = computed(() => {
    return {
        colorFunction: store.codeTheme.caution,
        colorKeywords: store.codeTheme.energy,
        copyIconColor: store.mainColor
    }
});

</script>

<template>
    <div class="relative">
        <VueHiCode :content="content" :language="language" v-bind="config" @copy="store.copy()"/>
    </div>
</template>