<!-- Chart.vue -->
<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

export default {
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const chartCanvas = ref(null)
    let chart = null

    const createChart = () => {
      const ctx = chartCanvas.value.getContext('2d')
      chart = new Chart(ctx, {
        type: 'line',
        data: props.chartData,
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'second',
                displayFormats: {
                  second: 'HH:mm:ss'
                }
              },
              title: {
                display: true,
                text: 'Time'
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Value'
              }
            }
          }
        }
      })
    }

    onMounted(() => {
      createChart()
    })

    watch(
      () => props.chartData,
      (newData) => {
        if (chart) {
          chart.data = newData
          chart.update()
        }
      },
      { deep: true }
    )

    return { chartCanvas }
  }
}
</script>
