<template>
  <div>
    <FwbSpinner v-if="ispending" size="12" />
    <LineChart
      v-else-if="!ispending"
      :singleTime="watchedSingleTime"
      :singleValue="watchedSingleValue"
      :threshold="Number(threshold)"
      :name="name"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import LineChart from '@/components/charts/LineChartPop.vue'
import { FwbSpinner } from 'flowbite-vue'

import mqtt from 'mqtt'
import axios from 'axios'
const client = ref(null)
const connectionStatus = ref()
const singleTime = ref(null)
const singleValue = ref(null)
const initValue = ref([])
const initTime = ref([])
const ispending = ref(true)

const watchedSingleTime = computed(() => {
  console.log('Single time updated:', initTime.value.length)
  return initTime.value[initTime.value.length - 1]
})
const watchedSingleValue = computed(() => {
  console.log('Single value updated:', initValue.value.length)
  return initValue.value[initValue.value.length - 1]
})

const props = defineProps({
  name: String,
  mqttTopic: String,
  threshold: String
})

const handleReadItem2 = async () => {
  try {
    ispending.value = true
    const response = await axios.get(
      'http://traum.groundkim.com:3001/influx/sensor/topic/history/temperature-1?elapsed=15s'
    )

    response.data.forEach((item) => {
      if ('temperature' in item) {
        initValue.value.push(Number(item.temperature))
        initTime.value.push(new Date(item.time).toLocaleTimeString())
      }
      if (initValue.value.length > 0) {
        console.log(initValue.value.length - 1)
        singleValue.value = initValue.value[initValue.value.length - 1]
        singleTime.value = initTime.value[initTime.value.length - 1]
      }
    })
    ispending.value = false

    // REST API 데이터 처리가 완료된 후 MQTT 연결 시작
  } catch (error) {
    console.error('Failed to fetch sensor list', error)
  }
  setupMQTT()
}

const setupMQTT = () => {
  const mqttTopic = props.mqttTopic
  client.value = mqtt.connect(`ws://${import.meta.env.VITE_SOCKET_URL}`)

  client.value.on('connect', () => {
    console.log('Connected to MQTT broker')
    connectionStatus.value = 'Connected'

    client.value.subscribe(mqttTopic, (err) => {
      if (!err) {
        console.log('Subscribed to ....')
      }
    })
  })

  client.value.on('message', (topic, message) => {
    const messageStr = message.toString()
    try {
      const messageObj = JSON.parse(messageStr)
      if (messageObj !== undefined) {
        initValue.value.push(Number(messageObj[0].value))
        initTime.value.push(new Date(messageObj[2].value).toLocaleTimeString())

        // 항상 마지막 값으로 업데이트
        singleValue.value = initValue.value[initValue.value.length - 1]
        singleTime.value = initTime.value[initTime.value.length - 1]
      }
    } catch (error) {
      console.error('Error parsing message:', error)
    }
  })

  client.value.on('error', (error) => {
    console.error('MQTT connection error:', error)
    connectionStatus.value = 'Error: ' + error.message
  })

  client.value.on('close', () => {
    connectionStatus.value = 'Disconnected'
  })
}

onMounted(() => {
  handleReadItem2()
})

// 팝업이 닫힐 때 item 초기화
onUnmounted(() => {})
</script>
