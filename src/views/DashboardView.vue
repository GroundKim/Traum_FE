<template>
  <div>
    <div class="flex flex-wrap mt-4">
      <div class="w-full">
        <fwb-button color="default">Default</fwb-button>
        <fwb-button color="alternative">Alternative</fwb-button>
        <fwb-button color="dark">Dark</fwb-button>
        <fwb-button color="light">Light</fwb-button>
        <fwb-button color="green">Green</fwb-button>
        <fwb-button color="red">Red</fwb-button>
        <fwb-button color="yellow">Yellow</fwb-button>
        <fwb-button color="purple">Purple</fwb-button>
        <fwb-button color="pink">Pink</fwb-button>
        <div class="flex gap-10 w-full h-[400px]">
          <tree-list
            class="overflow-y-scroll w-[800px]"
            @dragStart="onDragStart"
            @modalOpen="handleModal"
          />
          <BabylonScene
            ref="babylonScene"
            @removeItem="console.log('도착확인')"
            class="w-full pr-10"
          />
        </div>
        <div class="px-10 py-4"></div>
        <line-chart-detail :singleValue="singleValue" :singleTime="singleTime"></line-chart-detail>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import mqtt from 'mqtt'

import BabylonScene from '@/components/BabylonScene.vue'
import LineChartDetail from '@/components/charts/LineChart.vue'
import TreeList from '@/components/lists/TreeList.vue'

const babylonScene = ref(null)

const currentModal = ref(null)
const showModal = ref(false)

const client = ref(null)
const connectionStatus = ref('Disconnected')
const receivedMessages = ref([])

const singleValue = ref()
const singleTime = ref()

const onDragStart = (item) => {
  console.log('Drag started:', item)
}

const handleModal = (item) => {
  currentModal.value = item
  showModal.value = true
}

onMounted(() => {
  client.value = mqtt.connect('ws://localhost:9001')

  client.value.on('connect', () => {
    console.log('Connected to MQTT broker')
    connectionStatus.value = 'Connected'
    client.value.subscribe('test/topic', (err) => {
      if (!err) {
        console.log('Subscribed to test/topic')
      }
    })
  })

  client.value.on('message', (topic, message) => {
    const messageStr = message.toString()
    console.log(`Received message on topic ${topic}: ${messageStr}`)
    receivedMessages.value.push(`${topic}: ${messageStr}`)

    try {
      const messageObj = JSON.parse(messageStr)
      if (messageObj.value !== undefined) {
        singleValue.value = Number(messageObj.value)
        singleTime.value = new Date(messageObj.time).toLocaleTimeString()
        // updateChartData()
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
})

onUnmounted(() => {
  if (client.value) {
    client.value.end()
  }
})
</script>

<!-- <ul>
  <li v-for="(value, index) in values" :key="index">
    Value: {{ value }}, Time: {{ times[index] }}
  </li>
</ul> -->
