<template>
  <div
    class="bg-white relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-opacity-50"
  >
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h2 class="text-black text-xl font-semibold">{{ currentName }}</h2>
        </div>
      </div>
    </div>
    <div class="p-4 flex-auto">
      <!-- Chart -->
      <div class="relative chart-container">
        <canvas ref="chart"></canvas>
      </div>
    </div>
  </div>
</template>

<style>
.chart-container {
  width: 100%;
  height: 200px; /* 원하는 높이로 설정하세요 */
}
</style>
<script>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js'
import 'chartjs-plugin-annotation'

export default {
  props: {
    selectedItem: {
      type: Object,
      required: false,
      default: () => ({ name: 'targetName' })
    },
    singleTime: {
      type: String,
      required: false
    },
    singleValue: {
      type: Number,
      required: false
    },
    threshold: {
      type: Number,
      required: false
    },
    name: {
      type: String
    }
  },
  setup(props) {
    const chart = ref(null)
    let myChart = null
    const currentName = ref(null)
    

    onMounted(() => {
      let config = {
        type: 'line',
        data: {
          labels: [0],
          datasets: [
            {
              label: 'Sensor',
              backgroundColor: '#4c51bf',
              borderColor: '#4c51bf',
              data: [0],
              fill: false
            }
          ]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          title: {
            display: false,
            text: 'Sales Charts',
            fontColor: 'black'
          },
          legend: {
            labels: {
              fontColor: 'black'
            },
            align: 'end',
            position: 'bottom'
          },
          tooltips: {
            mode: 'index',
            intersect: false
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  fontColor: 'black' // 변경: x축 레이블 색상을 검은색으로 설정
                },
                display: true,
                scaleLabel: {
                  display: false,
                  labelString: 'Month',
                  fontColor: 'black'
                },
                gridLines: {
                  display: false,
                  color: 'rgba(0, 0, 0, 0.1)' // 변경: 그리드 라인 색상을 연한 검은색으로 설정
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  fontColor: 'black', // 변경: y축 레이블 색상을 검은색으로 설정
                  fontSize: 20,
                  max: 0,
                  min: 0,
                  stepSize: 50 / 2,
                  callback: function (value) {
                    return value.toFixed(2) // 소수점 두 자리까지 표시
                  }
                },
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Value',
                  fontColor: 'black',
                  fontSize: 16
                },
                gridLines: {
                  color: 'rgba(0, 0, 0, 0.1)' // 변경: 그리드 라인 색상을 연한 검은색으로 설정
                }
              }
            ]
          },
          annotation: {
            annotations: [
              {
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: 0,
                borderColor: 'rgba(255, 0, 0, 0.5)',
                borderWidth: 2,
                borderDash: [10, 5],
                label: {
                  content: 'Threshold',
                  enabled: true,
                  position: 'left',
                  fontColor: 'red', // 변경: 주석 레이블 색상을 검은색으로 설정
                  fontSize: 20
                }
              }
            ]
          }
        }
      }

      if (chart.value) {
        let ctx = chart.value.getContext('2d')
        myChart = new Chart(ctx, config)
      }
    })

    const updateChart = (singleValue, singleTime, threshold,name) => {
      if (myChart) {
        if (myChart.data.labels.length >= 20) {
          myChart.data.labels.shift()
          myChart.data.datasets[0].data.shift()
        }
        myChart.data.labels.push(singleTime)
        myChart.data.datasets[0].data.push(singleValue)
        console.log(threshold)
        console.log(threshold)
        console.log(threshold)
        console.log(threshold)

        // y축 범위 동적 조정
        const maxValue = Math.max(...myChart.data.datasets[0].data, threshold)
        const minValue = Math.min(...myChart.data.datasets[0].data, threshold)

        myChart.options.scales.yAxes[0].ticks.max = maxValue * 1.2
        myChart.options.scales.yAxes[0].ticks.min = minValue * 0.8

        myChart.options.scales.yAxes[0].ticks.stepSize = maxValue / 4

        myChart.options.annotation.annotations[0].value = threshold
        myChart.update()
        currentName.value=name
      }
    }

    const resetChart = (newName) => {
      if (myChart) {
        currentName.value = newName
        myChart.data.labels = []
        myChart.data.datasets[0].data = []
        myChart.update()
      }
    }

    watch(
      () => [props.singleValue, props.singleTime, props.threshold,props.name],
      (newValue) => {
        console.log(newValue)
        console.log(newValue)
        console.log(newValue)
        console.log(newValue)
        console.log(newValue)
        const [singleValue, singleTime, threshold,name] = newValue
        updateChart(singleValue, singleTime, threshold,name)
      },
      { deep: true }
    )

    watch(
      () => props.selectedItem,
      (newValue) => {
        const newName = newValue.name
        resetChart(newName)
      },
      { deep: true }
    )

    return { chart, currentName }
  }
}
</script>