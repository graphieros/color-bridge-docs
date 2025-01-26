<script setup>
import { useMainStore } from "@/stores/main";
import { ref, computed, onMounted } from "vue";
import { VueDataUi } from "vue-data-ui";

const data = ref(null);
const store = useMainStore();
const isDarkMode = computed(() => store.isDarkMode);

const max = computed(() => {
    return data.value ? Math.max(...data.value.map(d => d.value)) : 0
})

const config = computed(() => {
    return {
        style: {
            scaleMax: max.value,
            backgroundColor: 'transparent',
            fontFamily: "inherit",
            chartWidth: 360,
            line: {
                color: store.mainColor,
                strokeWidth: 1,
                smooth: true
            },
            zeroLine: {
                color: "#505050",
                strokeWidth: 1
            },
            plot: {
                show: true,
                radius: 4,
                stroke: "#FFFFFF",
                strokeWidth: 1
            },
            verticalIndicator: {
                show: true,
                strokeWidth: 1.5,
                color: '#A1A1A1'
            },
            dataLabel: {
                position: "left",
                fontSize: 48,
                bold: true,
                color: store.mainColor,
                roundingValue: 1,
                valueType: "latest"
            },
            title: {
                show: true,
                textAlign: "left",
                color: isDarkMode.value ? '#CCCCCC' : '#1A1A1A',
                fontSize: 16,
                bold: true,
                text: "Daily downloads - Last 90 days"
            },
            area: {
                show: true,
                useGradient: true,
                opacity: 30,
                color: store.mainColor
            }
        }
    }
})

const step = ref(0);

const start = ref("2025-01-01");
const lastDate = ref(new Date(Date.now()));

const end = computed(() => {
    const day = lastDate.value.getDate();
    const month = lastDate.value.getMonth() + 1;
    const year = lastDate.value.getFullYear();
    return `${year}-${String(month).length === 1 ? `0${month}` : month}-${String(day).length === 1 ? `0${day}` : day}`;
});

const url_downloads = computed(() => {
    return `https://api.npmjs.org/downloads/range/${start.value}:${end.value}/color-bridge`;
});


onMounted(() => {
    fetch(url_downloads.value, {
        method: 'GET',
        mode: 'cors',
        cache: 'default'
    })
        .then((response) => {
            return response.json();
        })
        .then(json => {
            store.downloads = json.downloads;
            data.value = json.downloads.map(d => {
                return {
                    period: d.day,
                    value: d.downloads
                }
            }).slice(-90, -1);
        })
        .catch(err => {
            data.value = [{ period: "", value: 0 }]
        })
        .finally(() => step.value += 1);

    fetch(`https://api.github.com/repos/graphieros/color-bridge`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            store.stars = data.stargazers_count;
        })
        .catch(error => {
            console.error('There was a problem fetching the data:', error);
        })
})

</script>

<template>
    <div :style="{
        width: '400px',
        margin: '0 auto',
    }">
        <VueDataUi v-if="data" component="VueUiSparkline" :dataset="data" :config="config" :key="step" />
    </div>
</template>