<template>
  <div class="tree-list flex flex-col h-full">
    <div class="flex items-center justify-between p-4 flex-shrink-0">
      <button @click="prevCategory" class="category-button" :disabled="currentIndex === 0">
        <font-awesome-icon icon="chevron-left" />
      </button>
      <div class="flex-grow flex items-center justify-between px-4 text-white">
        <div class="flex items-center">
          <span class="mr-4 text-base uppercase font-bold">{{ currentCategory.name }}</span>
          <font-awesome-icon v-if="currentCategory.name == 'eduKit'" icon="fire-burner" size="2x" />
          <font-awesome-icon
            v-if="currentCategory.name == 'sensor'"
            :icon="['fas', 'bolt']"
            size="2x"
          />
        </div>
        <div>
          <font-awesome-icon
            icon="circle-plus"
            size="2x"
            @click="
              addItem(
                currentIndex,
                Math.floor(Math.random() * 1000 + 5),
                currentCategory.name,
                1803,
                50,
                '3d',
                `0,0,0`
              )
            "
          />
        </div>
      </div>
      <button
        @click="nextCategory"
        class="category-button"
        :disabled="currentIndex === categories.length - 1"
      >
        <font-awesome-icon icon="chevron-right" />
      </button>
    </div>
    <ul class="flex-grow flex flex-col overflow-auto">
      <li
        v-for="item in currentCategory.items"
        :key="item.name"
        class="flex bg-[#ffffff17] items-center justify-between text-base text-white text-center px-4 py-2 mb-2 mx-4 uppercase rounded-lg shadow-md cursor-move flex-shrink-0"
        draggable="true"
        @dragstart="onDragStart($event, item)"
      >
        {{ item.name }}
        <div class="flex justify-end w-[300px]">
          <treeModal :item="item" @setCondition="setCondition" />
          <button
            v-if="currentCategory.name == 'eduKit'"
            @click="sendStartCommand(item)"
            class="bg-green-800 text-white text-sm px-1 py-1 get-started font-bold rounded outline-none focus:outline-none mr-1 mb-1 bg-color1 active:bg-color1"
            :class="{
              'opacity-50 cursor-not-allowed': item.meshName == 'eduKit' && item.meshId < 100005
            }"
          >
            가동
          </button>
          <button
            v-if="currentCategory.name == 'eduKit'"
            @click="sendStopCommand(item)"
            class="bg-red-800 text-white text-sm px-1 py-1 get-started font-bold rounded outline-none focus:outline-none mr-1 mb-1 bg-color1 active:bg-color1"
            :class="{
              'opacity-50 cursor-not-allowed': item.meshName == 'eduKit' && item.meshId < 100005
            }"
          >
            중지
          </button>
          <button
            v-if="currentCategory.name == 'eduKit'"
            @click="sendResetCommand()"
            class="bg-blue-800 text-white text-sm px-1 py-1 get-started font-bold rounded outline-none focus:outline-none mr-1 mb-1 bg-color1 active:bg-color1"
            :class="{
              'opacity-50 cursor-not-allowed': item.meshName == 'eduKit' && item.meshId < 100005
            }"
          >
            리셋
          </button>
          <button
            @click="
              currentCategory.name == 'sensor'
                ? openPopup(item)
                : $router.push(`/dashboard/${item.meshId}`)
            "
            class="bg-purple-800 text-white text-sm px-1 py-1 get-started font-bold rounded outline-none focus:outline-none mr-1 mb-1 bg-color1 active:bg-color1"
            :class="{
              'opacity-50 cursor-not-allowed': item.meshName == 'eduKit' && item.meshId < 100005
            }"
          >
            조회
          </button>
          <button
            @click="emitRemoveItem(item)"
            class="bg-black text-white text-sm px-1 py-1 get-started font-bold rounded outline-none focus:outline-none mr-1 mb-1 bg-color1 active:bg-color1"
            :class="{
              'opacity-50 cursor-not-allowed': item.meshName == 'eduKit' && item.meshId < 100005
            }"
          >
            삭제
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import emitter from '@/components/eventBus.js'
import treeModal from '@/components/modals/treeModal.vue'
import io from 'socket.io-client'
import axios from 'axios'

export default {
  name: 'TreeComponent',
  components: {
    treeModal
  },
  setup() {
    const currentIndex = ref(0)
    const categories = ref([
      {
        name: 'eduKit',
        items: [
          {
            meshId: 100005,
            name: 'eduKit1',
            type: '3d',
            meshName: 'eduKit',
            mqttTopic: 'edge/edukit/status',
            threshold: '10',
            location: '0,0,0',
            color: null
          },
          {
            meshId: 100004,
            name: 'eduKit2',
            type: '3d',
            meshName: 'eduKit',
            mqttTopic: 'edge/edukit/status',
            threshold: '10',
            location: '0,0,0',
            color: null
          },
          {
            meshId: 100003,
            name: 'eduKit3',
            type: '3d',
            meshName: 'eduKit',
            mqttTopic: 'edge/edukit/status',
            threshold: '10',
            location: '0,0,0',
            color: null
          },
          {
            meshId: 100002,
            name: 'eduKit4',
            type: '3d',
            meshName: 'eduKit',
            mqttTopic: 'edge/edukit/status',
            threshold: '10',
            location: '0,0,0',
            color: null
          },
          {
            meshId: 100001,
            name: 'eduKit5',
            type: '3d',
            meshName: 'eduKit',
            mqttTopic: 'edge/edukit/status',
            threshold: '10',
            location: '0,0,0',
            color: null
          }
          // ... 다른 eduKit 아이템들
        ]
      },
      {
        name: 'sensor',
        items: []
      }
    ])

    const currentCategory = computed(() => categories.value[currentIndex.value])

    const prevCategory = () => {
      if (currentIndex.value > 0) currentIndex.value--
    }

    const nextCategory = () => {
      if (currentIndex.value < categories.value.length - 1) currentIndex.value++
    }

    const addItem = (index, meshId, meshName, mqttTopic, threshold, type, location) => {
      const newItem = {
        meshId,
        name: meshName + meshId,
        type,
        meshName,
        mqttTopic,
        threshold,
        color: null,
        location
      }
      categories.value[index].items.push(newItem)
    }

    const onDragStart = (event, item) => {
      event.dataTransfer.setData('application/json', JSON.stringify(item))
    }

    const setCondition = (item) => {
      const categoryIndex = item.meshName === 'eduKit' ? 0 : 1
      const itemIndex = categories.value[categoryIndex].items.findIndex(
        (el) => el.meshId === item.meshId
      )
      if (itemIndex !== -1) {
        categories.value[categoryIndex].items[itemIndex] = item
        emitter.emit('updateItem', item)
        openPopup(item)
      }
    }

    const emitRemoveItem = (item) => {
      emitter.emit('removeItem', item)
    }

    const openPopup = (item) => {
      const width = 600
      const height = 400
      const left = (window.screen.width - width) / 2
      const top = (window.screen.height - height) / 2
      const popupUrl = `/popup/${item.name}/${item.threshold}/${item.mqttTopic}`
      window.open(popupUrl, item.name, `width=${width},height=${height},left=${left},top=${top}`)
    }

    const fetchSensorList = async () => {
      try {
        const response = await axios.get('http://traum.groundkim.com:3001/sensor/object/list')

        // 응답 데이터를 id 기준으로 오름차순 정렬
        const sortedData = response.data.sort((a, b) => a.id - b.id)

        sortedData.forEach((el) => {
          addItem(1, el.id, 'sensor', el.mqttTopic, el.threshold, '3d', el.location)
        })
      } catch (error) {
        console.error('Failed to fetch sensor list', error)
      }
    }
    const socket = ref(null)
    const connectSocket = () => {
      socket.value = io(`ws://${import.meta.env.VITE_SOCKET_IO_URL}`, {
        transports: ['websocket'],
        reconnectionAttempts: 1,
        reconnectionDelay: 1000
      })

      socket.value.on('connect', () => {
        console.log('Connected to Socket.IO server.')
        socket.value.emit('joinRoom', 'UVC-EDU-01')
      })

      socket.value.on('disconnect', () => {
        console.log('Disconnected from Socket.IO server.')
      })

      socket.value.on('connect_error', (error) => {
        console.log('Socket.IO Error:', error)
      })
    }

    const sendSocketMessage = (command) => {
      if (socket.value && socket.value.connected) {
        socket.value.emit(`SENDUVC-EDU-01`, JSON.stringify(command))
        console.log(`Command sent:`, command)
      } else {
        console.log('Socket.IO is not connected. Cannot send command.')
      }
    }

    const sendStartCommand = (item) => {
      sendSocketMessage({ tagId: '1', value: '1' })
      emitter.emit('startItem', item)
    }

    const sendStopCommand = (item) => {
      sendSocketMessage({ tagId: '1', value: '0' })
      emitter.emit('alarmItem', item)
    }

    const sendResetCommand = () => {
      sendSocketMessage({ tagId: '8', value: '1' })
    }
    onMounted(() => {
      fetchSensorList()
      connectSocket()
    })

    return {
      categories,
      currentIndex,
      currentCategory,
      prevCategory,
      nextCategory,
      addItem,
      onDragStart,
      setCondition,
      emitRemoveItem,
      openPopup,
      sendStartCommand,
      sendStopCommand,
      sendResetCommand
    }
  }
}
</script>

<style scoped>
.tree-list {
  display: flex;
  flex-direction: column;
}

.category-button {
  background-color: transparent;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.category-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.category-button:not(:disabled):hover {
  opacity: 0.7;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  min-height: 60px;
}
</style>
