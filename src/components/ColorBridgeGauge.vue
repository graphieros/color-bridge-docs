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

  for(let i = 0; i < 85; i += 1) {
    arr.push({
      from: i,
      to: i + 1,
      color: shiftColorHue(initColor, i/500)
    })
  }

  return arr;
}

const gaugeValue = ref(55);

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
            color: "#2D353C",
            bold: true,
            fontSizeRatio: 1,
            offsetY: 0,
            roundingValue: 0,
            formatter: null,
            prefix: "",
            suffix: "",
          },
          segmentSeparators: {
            show: false,
            offsetOut: 0,
            offsetIn: 0,
            stroke: "#2D353C",
            strokeWidth: 2,
          },
          segmentNames: {
            show: false,
            curved: true,
            offsetRatio: 1.1,
            fontSize: 16,
            useSerieColor: true,
            bold: false,
          },
          pointer: {
            type: "pointy",
            size: 1.2,
            stroke: isDarkMode.value ? '#1A1A1A' : '#FFFFFF',
            strokeWidth: 12,
            useRatingColor: false,
            color: "#2A2A2A",
            circle: {
              radius: 10,
              stroke: "#1A1A1A",
              strokeWidth: 2,
              color: "#FFFFFF",
            },
          },
        },
        legend: {
          show: false,
          fontSize: 48,
          prefix: "",
          suffix: "",
          roundingValue: 1,
          showPlusSymbol: true,
          useRatingColor: true,
          color: "#2D353C",
          formatter: null,
        },
        title: {
          text: "",
          color: "#2D353C",
          fontSize: 20,
          bold: true,
          textAlign: "center",
          paddingLeft: 0,
          paddingRight: 0,
          subtitle: { color: "#A1A1A1", text: "", fontSize: 16, bold: false },
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
