<template>
  <div
    class="bg-white relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-opacity-50"
  >
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h2 class="text-black text-xl font-semibold">Object 1</h2>
        </div>
      </div>
    </div>
    <div class="p-4 flex-auto">
      <!-- Chart -->
      <div class="relative chart-container">
        <canvas ref="chart"></canvas>
        <button @click="addData">업뎃</button>
      </div>
    </div>
  </div>
</template>

<style>
.chart-container {
  width: 100%;
  height: 400px; /* 원하는 높이로 설정하세요 */
}
</style>
<script>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js'
import { watch } from 'vue'

export default {
  props: {
    singleTime: {
      type: String,
      required: false
    },
    singleValue: {
      type: Number
    }
  },
  setup(props) {
    const chart = ref(null)
    let myChart = null

    onMounted(() => {
      let config = {
        type: 'line',
        data: {
          labels: [0],
          datasets: [
            {
              label: 'X',
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
            x: {
              ticks: {
                fontColor: 'rgba(255,255,255,.7)'
              },
              display: true,
              scaleLabel: {
                display: false,
                labelString: 'Month',
                fontColor: 'black'
              },
              grid: {
                display: false,
                borderDash: [2],
                borderDashOffset: [2],
                color: 'rgba(33, 37, 41, 0.3)',
                zeroLineColor: 'rgba(0, 0, 0, 0)',
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2]
              }
            },
            y: {
              ticks: {
                fontColor: 'rgba(255,255,255,.7)'
              },
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Value',
                fontColor: 'black'
              },
              grid: {
                borderDash: [3],
                borderDashOffset: [3],
                drawBorder: false,
                color: 'rgba(255, 255, 255, 0.15)',
                zeroLineColor: 'rgba(33, 37, 41, 0)',
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2]
              }
            }
          }
        }
      }

      if (chart.value) {
        let ctx = chart.value.getContext('2d')
        myChart = new Chart(ctx, config)
      }
    })

    const updateChart = (singleValue, singleTime) => {
      if (myChart) {
        // console.log('수정진입')

        // myChart.data.labels = Array.from({ length: props.data.data[0].length }, (_, i) =>
        //   (i * (3 / 120)).toFixed(1)
        // )
        if (myChart.data.labels.length >= 100) {
          myChart.data.labels.shift() // 첫 번째 요소 제거
          myChart.data.datasets[0].data.shift() // 첫 번째 데이터 제거
        }

        myChart.data.labels.push(singleTime)
        myChart.data.datasets[0].data.push(singleValue)

        console.log(myChart.data.labels)
        console.log(myChart.data.datasets[0].data)
        console.log('label', myChart.data.labels, props.times)

        myChart.update()
      }
    }

    const watcher = watch(
      () => [props.singleValue, props.singleTime],
      (newValue) => {
        const singleValue = newValue[0]
        const singleTime = newValue[1]

        console.log('watched')
        console.log(singleTime)
        updateChart(singleValue, singleTime)
      },
      { deep: true }
    )

    return { chart, watcher }
  }
}
</script>
