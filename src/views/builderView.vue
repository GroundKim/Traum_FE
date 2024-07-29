<template>
  <div>
    <div class="flex flex-wrap mt-4">
      <div class="w-full">
        <div class="flex gap-10 w-full h-[700px]">
          <div class="overflow-y-auto w-[500px] h-full">
            <tree-list @dragStart="onDragStart" @modalOpen="handleModal" />
          </div>
          <div class="pr-10 h-[400px] flex-grow overflow-hidden">
            <BabylonScene
              ref="babylonScene"
              @removeItem="console.log('도착확인')"
              @sceneReady="handleSceneReady"
              class="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import mqtt from 'mqtt'
import emitter from '@/components/eventBus.js'

import BabylonScene from '@/components/BabylonScene.vue'
import TreeList from '@/components/lists/TreeList.vue'
const babylonScene = ref(null)
const currentModal = ref(null)
const showModal = ref(false)
const client = ref(null)
const connectionStatus = ref('Disconnected')

const selectedItem = ref({})
const singleValue = ref()
const singleTime = ref()
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
