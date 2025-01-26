<script setup>
import { useMainStore } from "@/stores/main";
import { computed, ref } from "vue";
import {
  VueDataUi,
  shiftColorHue
} from "vue-data-ui";
import "vue-data-ui/style.css"

const store = useMainStore();
const isDarkMode = computed(() => store.isDarkMode);


function makeSeries() {
  let arr = [];
  let initColor = store.mainColor;

  for(let i = 0; i < 14; i += 1) {
    arr.push({
      from: i,
      to: i + 1,
      color: shiftColorHue(initColor, i/100),
      name: '▼'
    })
  }

  return arr.reverse();
}

const gaugeValue = ref(9.5);

const dataset = computed(() => {
  return {
    base: 0,
    value: gaugeValue.value,
    series: makeSeries(),
  };
});

const config = computed(() => {
  return {
    responsive: false,
    theme: "",
    customPalette: [],
    style: {
      fontFamily: "inherit",
      chart: {
        backgroundColor: "transparent",
        color: "#2D353C",
        animation: { use: true, speed: 1, acceleration: 1 },
        layout: {
          radiusRatio: 1,
          track: { size: 5, useGradient: true, gradientIntensity: 20 },
          markers: {
            show: false,
          },
          segmentSeparators: {
            show: false,
          },
          segmentNames: {
            show: true,
            fontSize: 40
          },
          pointer: {
            type: "pointy",
            size: 1.2,
            stroke: '#1A1A1A',
            strokeWidth: 12,
            useRatingColor: false,
            color: "#2A2A2A",
            circle: {
              radius: 12,
              stroke: "#1A1A1A",
              strokeWidth: 2,
              color: isDarkMode.value ? '#CCCCCC' : "#F3F4F6",
            },
          },
        },
        legend: {
          show: false,
        },
        title: {
          text: "",
        },
      },
    },
    userOptions: {
      show: false,
    },
  };
});
</script>

<template>
  <div class="w-full max-w-[400px] h-[150px]">
    <VueDataUi component="VueUiGauge" :dataset="dataset" :config="config"/>
  </div>
</template>
