<template>
  <div>
    <h1>h1-모달</h1>
    <p>팝업컨텐츠:{{ name }}</p>
    <LineChart :singleTime="singleTime" :singleValue="singleValue" :threshold="threshold" :name="name"/>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import LineChart from '@/components/charts/LineChartPop.vue'
import mqtt from 'mqtt'

const client = ref(null)
const connectionStatus = ref()
const singleTime = ref(null)
const singleValue = ref(null)

const props = defineProps({
  name: String,
  threshold: Number,
  mqttTopic: String
})
const handleReadItem = () => {
 
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
        singleValue.value = Number(messageObj[0].value)
        singleTime.value = new Date(messageObj[2].value).toLocaleTimeString()
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
// popupStore.item을 사용하여 필요한 작업 수행

onMounted(() => {
  handleReadItem()
})

// 팝업이 닫힐 때 item 초기화
onUnmounted(() => {})
</script>