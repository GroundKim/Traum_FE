<template>
  <div>
    <div class="flex flex-wrap mt-4">
      <div class="w-full">
        <fwb-card href="#">
          <div class="p-5">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Noteworthy technology acquisitions 2021
            </h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">
              Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse
              chronological order.
            </p>
          </div>
        </fwb-card>
      </div>
      <div class="px-10 py-4"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import mqtt from 'mqtt'
import { FwbCard } from 'flowbite-vue'

import emitter from '@/components/eventBus.js'

const client = ref(null)
const connectionStatus = ref('Disconnected')

const selectedItem = ref({})
const singleValue = ref()
const singleTime = ref()

const handleReadItem = (item) => {
  client.value = mqtt.connect('ws://192.168.0.32:9001')
  client.value.on('connect', () => {
    console.log('Connected to MQTT broker')
    connectionStatus.value = 'Connected'
    selectedItem.value = item
    client.value.subscribe(item.mqttTopic, (err) => {
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
        if (singleValue.value >= Number(item.threshold)) {
          textColor = 'red'
        }
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
