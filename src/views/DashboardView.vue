<template>
  <div>
    <div class="flex flex-wrap mt-4">
      <div class="w-full">
        {{ connectionStatus }}
        <font-awesome-icon :icon="['fas', 'circle-plus']" class="mr-2" />
        <font-awesome-icon :icon="['fas', 'circle-plus']" class="mr-2" />
        <fwb-button color="default">Default</fwb-button>
        <fwb-button color="alternative">Alternative</fwb-button>
        <fwb-button color="dark">Dark</fwb-button>
        <fwb-button color="light">Light</fwb-button>
        <fwb-button color="green">Green</fwb-button>
        <fwb-button color="red">Red</fwb-button>
        <fwb-button color="yellow">Yellow</fwb-button>
        <fwb-button color="purple">Purple</fwb-button>
        <fwb-button color="pink">Pink</fwb-button>
        <div class="flex gap-10 w-full h-[500px]">
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
        <line-chart-detail
          class="h-[280px]"
          :selectedItem="selectedItem"
          :singleValue="singleValue"
          :singleTime="singleTime"
        ></line-chart-detail>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import mqtt from 'mqtt'
import emitter from '@/components/eventBus.js'

import BabylonScene from '@/components/BabylonScene.vue'
import LineChartDetail from '@/components/charts/LineChart.vue'
import TreeList from '@/components/lists/TreeList.vue'

const babylonScene = ref(null)
const currentModal = ref(null)
const showModal = ref(false)
const client = ref(null)
const connectionStatus = ref('Disconnected')

const selectedItem = ref({})
const singleValue = ref()
const singleTime = ref()
// const socketURL = process.env.SOCKET_ADDRESS

const onDragStart = (item) => {
  console.log('Drag started:', item)
}

const handleModal = (item) => {
  currentModal.value = item
  showModal.value = true
}

const handleReadItem = (item) => {
  client.value = mqtt.connect(`ws://${import.meta.env.VITE_SOCKET_URL}`)
  client.value.on('connect', () => {
    console.log('Connected to MQTT broker')
    connectionStatus.value = 'Connected'
    selectedItem.value = item
    client.value.subscribe(selectedItem.value.mqttTopic, (err) => {
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
        let textColor = 'white'
        if (singleValue.value >= Number(selectedItem.value.threshold)) {
          textColor = 'red'
        } else if (singleValue.value <= Number(selectedItem.value.threshold)) {
          textColor = 'white'
        }
        console.log(selectedItem.value)
        console.log(selectedItem.value)
        console.log(selectedItem.value)
        console.log(selectedItem.value)
        console.log(selectedItem.value)
        console.log(selectedItem.value.threshold)
        console.log(textColor)
        console.log(textColor)
        console.log(textColor)
        emitter.emit('updateItemColor', [selectedItem.value, textColor])
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
  emitter.on('readItem', handleReadItem)
})

onUnmounted(() => {
  emitter.off('readItem', handleReadItem)
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
