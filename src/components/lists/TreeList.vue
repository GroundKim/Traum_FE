<!-- TreeComponent.vue -->
<template>
  <div class="tree flex">
    <ul>
      <li v-for="(category, index) in categories" :key="category.name">
        <div class="flex justify-between p-4">
          <div class="flex items-center">
            <span class="mr-4 text-3xl uppercase font-bold">{{ category.name }}</span>
            <font-awesome-icon v-if="category.name == 'eduKit'" icon="fire-burner" size="3x" />
            <font-awesome-icon v-if="category.name == 'sensor'" :icon="['fas', 'bolt']" size="3x" />
          </div>
          <div>
            <font-awesome-icon
              icon="circle-plus"
              size="3x"
              @click="
                addItem(index, Math.floor(Math.random() * 1000+5), category.name, 1803, 50, '3d')
              "
            />
          </div>
        </div>
        <ul>
          <li
            class="flex items-center justify-between text-center px-4 py-2 text-2xl uppercase rounded-lg shadow-md cursor-move"
            v-for="item in category.items"
            :key="item.name"
            draggable="true"
            @dragstart="onDragStart($event, item)"
          >
            {{ item.name }}

            <div class="flex justify-between">
              <treeModal :item="item" @setCondition="setCondition" />
              <button
                v-if="category.name == 'eduKit'"
                @click="sendStartCommand(item)"
                class="bg-green-500 text-white text-xl px-4 py-1 get-started font-bold rounded outline-none focus:outline-none mr-1 mb-1 bg-color1 active:bg-color1"
              >
                가동
              </button>

              <button
                v-if="category.name == 'eduKit'"
                @click="sendStopCommand(item)"
                class="bg-red-500 text-white text-xl px-4 py-1 get-started font-bold rounded outline-none focus:outline-none mr-1 mb-1 bg-color1 active:bg-color1"
              >
                중지
              </button>

              <button
                v-if="category.name == 'eduKit'"
                @click="sendResetCommand()"
                class="bg-blue-500 text-white text-xl px-4 py-1 get-started font-bold rounded outline-none focus:outline-none mr-1 mb-1 bg-color1 active:bg-color1"
              >
                리셋
              </button>
              <button
                
                @click="category.name == 'sensor'? openPopup(item): $router.push(`/dashboard/${item.meshId}`)"
                class="bg-blue-500 text-white text-xl px-4 py-1 get-started font-bold rounded outline-none focus:outline-none mr-1 mb-1 bg-color1 active:bg-color1"
          
                :class="{ 'opacity-50 cursor-not-allowed': item.meshName == 'eduKit' && item.meshId > 1}"
                
              >
                조회
              </button>

              <button
                @click="emitRemoveItem(item)"
                class="bg-black text-white text-xl px-4 py-1 get-started font-bold rounded outline-none focus:outline-none mr-1 mb-1 bg-color1 active:bg-color1"
              >
                삭제
              </button>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from 'vue'
import emitter from '@/components/eventBus.js'
import treeModal from '@/components/modals/treeModal.vue'
import io from 'socket.io-client'
export default {
  name: 'TreeComponent',
  components: {
    treeModal
  },
  setup(props, { emit }) {
    class MeshItem {
      constructor(meshId, meshName, mqttTopic, threshold, type) {
        this.meshId = meshId // Automatically assign a unique ID
        this.name = meshName + meshId
        this.type = type
        this.meshName = meshName
        this.mqttTopic = mqttTopic
        this.threshold = threshold
        this.color = null
      }
    }

    const addItem = (index, meshId, meshName, mqttTopic, threshold, type) => {
      const newItem = new MeshItem(meshId, meshName, mqttTopic, threshold, type)
      categories.value[index].items.push(newItem)
      console.log(categories.value[index].items)
      console.log('add-start', newItem)
    }
    const categories = ref([
      {
        name: 'eduKit',
        items: [
          {
            meshId: 1,
            name: 'eduKit1',
            type: '3d',
            meshName: 'eduKit',
            mqttTopic: 'edge/edukit/status',
            threshold: '10'
          },
          {
            meshId: 2,
            name: 'eduKit2',
            type: '3d',
            meshName: 'eduKit',
            mqttTopic: 'edge/edukit/status',
            threshold: '10'
          },
          {
            meshId: 3,
            name: 'eduKit3',
            type: '3d',
            meshName: 'eduKit',
            mqttTopic: 'edge/edukit/status',
            threshold: '10'
          },
          {
            meshId: 4,
            name: 'eduKit4',
            type: '3d',
            meshName: 'eduKit',
            mqttTopic: 'edge/edukit/status',
            threshold: '10'
          },
          {
            meshId: 5,
            name: 'eduKit5',
            type: '3d',
            meshName: 'eduKit',
            mqttTopic: 'edge/edukit/status',
            threshold: '10'
          }
        ]
      },
      {
        name: 'sensor',
        items: [
          {
            meshId: 10,
            name: 'sensor1',
            type: '3d',
            meshName: 'sensor',
            mqttTopic: 'edge/sensor/temperature-1',
            threshold: '1'
          }
        ]
      }
    ])
    const onDragStart = (event, item) => {
      event.dataTransfer.setData('application/json', JSON.stringify(item))
      emit('dragStart', item)
    }

    const openModal = (item) => {
      emit('modalOpen', item)
    }

    const setCondition = (item) => {
      let categoryIndex
      let itemIndex
      switch (item.meshName) {
        case 'eduKit':
          categoryIndex = 0
          break
        case 'sensor':
          categoryIndex = 1
          break
      }
      itemIndex = categories.value[categoryIndex].items.findIndex((el) => el.meshId === item.meshId)

      if (itemIndex !== -1) {
        // 해당 요소를 item으로 교체
        categories.value[categoryIndex].items[itemIndex] = item
        emitUpdateItem(item)
        
      } else {
        console.log(`Item with meshId ${item.meshId} not found.`)
      }
    }

    const emitRemoveItem = (item) => {
      emitter.emit('removeItem', item)
    }
    const emitAlarmItem = (item) => {
      emitter.emit('alarmItem', item)
    }
    const emitUpdateItem = (item) => {
      emitter.emit('updateItem', item)
      // emitter.emit('updateItemColor', item)
      openPopup(item)
    }

    const emitReadItem = (item) => {
      emitter.emit('readItem', item)
    }

    const openPopup = (item) => {
      const width = 600
      const height = 400
      const left = (window.screen.width - width) / 2
      const top = (window.screen.height - height) / 2



      const popupUrl = `/popup/${item.name}/${item.threshold}/${item.mqttTopic}`
      const popName=`/popup/${item.name}/${item.threshold}/${item.mqttTopic}`
      const popup = window.open(
        popupUrl,
        popName,
        `width=${width},height=${height},left=${left},top=${top}`
      )

      if (popup) {
        popup.onload = () => {
          // 필요한 경우 추가 로직
        }
      }
    }

    return {
      categories,
      onDragStart,
      openModal,
      setCondition,
      emitAlarmItem,
      emitUpdateItem,
      emitReadItem,
      addItem,
      emitRemoveItem,
      openPopup
    }
  },
  data() {
    return {
      socket: null,
      socketStatus: 'Disconnected',
      edukitId: 'UVC-EDU-01',
      connectAttempts: 0,
      maxConnectAttempts: 1
    }
  },
  mounted() {
    this.connectSocket()
  },
  methods: {
    connectSocket() {
      if (this.connectAttempts >= this.maxConnectAttempts) {
        console.log('Maximum connection attempts reached. Stopping further attempts.')
        return
      }


        this.socket = io(`ws://${import.meta.env.VITE_SOCKET_IO_URL}`, {
          
        transports: ['websocket'],

        reconnectionAttempts: 1,
        reconnectionDelay: 1000
      })

      this.socket.on('connect', () => {
        this.socketStatus = 'Connected'
        console.log('Connected to Socket.IO server.')
        this.socket.emit('joinRoom', this.edukitId)
        this.connectAttempts = 0 // Reset attempts on successful connection
      })

      this.socket.on('message', (msg) => {
        console.log("here")
        console.log("here")
        console.log("here")
        console.log("here")
        console.log('Received message: ' + msg)
      })

      this.socket.on('disconnect', () => {
        this.socketStatus = 'Disconnected'
        console.log('Disconnected from Socket.IO server.')
      })

      this.socket.on('connect_error', (error) => {
        this.socketStatus = 'Error'
        this.connectAttempts++
        console.log('Socket.IO Error: ' + error)
        if (this.connectAttempts < this.maxConnectAttempts) {
          console.log(`Reconnection attempt ${this.connectAttempts}`)
          this.connectSocket()
        } else {
          console.log('Reconnection failed. Stopping further attempts.')
        }
      })
    },
    sendSocketMessage(command) {
      if (this.socket && this.socket.connected) {
        const message = {
          tagId: command.tagId,
          value: command.value
        }
        this.socket.emit(`SEND${this.edukitId}`, JSON.stringify(message))
        console.log(`Command sent with tagId ${command.tagId} and value ${command.value}.`)
      } else {
        console.log('Socket.IO is not connected. Cannot send command.')
      }
    },
    sendStartCommand(item) {
      this.sendSocketMessage({ tagId: '1', value: '1' })
      emitter.emit('startItem', item)
      console.log(item)
    },
    sendStopCommand(item) {
      this.sendSocketMessage({ tagId: '1', value: '0' })
      emitter.emit('alarmItem', item)
    },
    sendResetCommand() {
      this.sendSocketMessage({ tagId: '8', value: '1' })
    }
  }
}
</script>

<style scoped>
.tree ul {
  list-style-type: none;
  padding-left: 20px;
}
</style>
