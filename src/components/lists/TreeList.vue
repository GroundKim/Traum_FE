<!-- TreeComponent.vue -->
<template>
  <div class="tree">
    <ul>
      <li v-for="(category, index) in categories" :key="category.name">
        {{ category.name }}
        <button
          @click="addItem(index, Math.floor(Math.random() * 1000), category.name, 1803, 50, '3d')"
        >
          Add Item
        </button>
        <ul>
          <li
            class="flex items-center text-center px-4 py-2 text-2xl uppercase rounded-lg shadow-md cursor-move"
            v-for="item in category.items"
            :key="item.name"
            draggable="true"
            @dragstart="onDragStart($event, item)"
          >
            {{ item.name }}
            <treeModal :item="item" @setCondition="setCondition" />
            <button
              @click="sendStartCommand()"
              class="bg-blue-500 text-white text-xl px-4 py-1 get-started font-bold rounded outline-none focus:outline-none mr-1 mb-1 bg-color1 active:bg-color1"
            >
              가동
            </button>
            
            <button
              @click="sendStopCommand()"
              class="bg-blue-500 text-white text-xl px-4 py-1 get-started font-bold rounded outline-none focus:outline-none mr-1 mb-1 bg-color1 active:bg-color1"
            >
              중지
            </button>

            <button
              @click="sendResetCommand()"
              class="bg-blue-500 text-white text-xl px-4 py-1 get-started font-bold rounded outline-none focus:outline-none mr-1 mb-1 bg-color1 active:bg-color1"
            >
              리셋
            </button>

            <button
              @click="emitRemoveItem(item)"
              class="bg-blue-500 text-white text-xl px-4 py-1 get-started font-bold rounded outline-none focus:outline-none mr-1 mb-1 bg-color1 active:bg-color1"
            >
              삭제
            </button>

            <button
              @click="emitReadItem(item)"
              class="bg-blue-500 text-white text-xl px-4 py-1 get-started font-bold rounded outline-none focus:outline-none mr-1 mb-1 bg-color1 active:bg-color1"
            >
              조회
            </button>
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
            name: 'eduKit',
            type: '3d',
            meshName: 'eduKit',
            mqttTopic: 'eduKit',
            threshold: '10'
          },
          {
            meshId: 2,
            name: 'eduKit',
            type: '3d',
            meshName: 'eduKit',
            mqttTopic: 'eduKit',
            threshold: '10'
          },
          {
            meshId: 3,
            name: 'eduKit',
            type: '3d',
            meshName: 'eduKit',
            mqttTopic: 'eduKit',
            threshold: '10'
          },
          {
            meshId: 4,
            name: 'eduKit',
            type: '3d',
            meshName: 'eduKit',
            mqttTopic: 'eduKit',
            threshold: '10'
          },
          {
            meshId: 5,
            name: 'eduKit',
            type: '3d',
            meshName: 'eduKit',
            mqttTopic: 'eduKit',
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
    ]);
    const onDragStart = (event, item) => {
      event.dataTransfer.setData('application/json', JSON.stringify(item))
      emit('dragStart', item)
    }

    const openModal = (item) => {
      emit('modalOpen', item)
    }

    const setCondition = (item) => {
      console.log('setCondition', item)
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
        console.log(categories.value[categoryIndex].items[itemIndex])
        console.log(categories.value[categoryIndex].items[itemIndex])
        console.log(categories.value[categoryIndex].items[itemIndex])
        console.log(categories.value[categoryIndex].items[itemIndex])
        console.log(categories.value[categoryIndex].items[itemIndex])
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
      console.log(item)
      console.log(item)
      console.log(item)
      console.log(item)
      emitter.emit('updateItem', item)
    }

    const emitReadItem = (item) => {
      emitter.emit('readItem', item)
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
      emitRemoveItem
    }
  },
  data() {
    return {
      socket: null,
      socketStatus: 'Disconnected',
      edukitId: "UVC-EDU-01",
      connectAttempts: 0,
      maxConnectAttempts: 1
    };
  },
  mounted() {
    this.connectSocket();
  },
  methods: {
    connectSocket() {
      if (this.connectAttempts >= this.maxConnectAttempts) {
        console.log("Maximum connection attempts reached. Stopping further attempts.");
        return;
      }

      this.socket = io('http://192.168.0.20:8282', {
        transports: ['websocket'],
        reconnectionAttempts: 1,
        reconnectionDelay: 1000
      });

      this.socket.on('connect', () => {
        this.socketStatus = 'Connected';
        console.log("Connected to Socket.IO server.");
        this.socket.emit('joinRoom', this.edukitId);
        this.connectAttempts = 0; // Reset attempts on successful connection
      });

      this.socket.on('message', (msg) => {
        console.log("Received message: " + msg);
      });

      this.socket.on('disconnect', () => {
        this.socketStatus = 'Disconnected';
        console.log("Disconnected from Socket.IO server.");
      });

      this.socket.on('connect_error', (error) => {
        this.socketStatus = 'Error';
        this.connectAttempts++;
        console.log("Socket.IO Error: " + error);
        if (this.connectAttempts < this.maxConnectAttempts) {
          console.log(`Reconnection attempt ${this.connectAttempts}`);
          this.connectSocket();
        } else {
          console.log("Reconnection failed. Stopping further attempts.");
        }
      });
    },
    sendSocketMessage(command) {
      if (this.socket && this.socket.connected) {
        const message = {
          tagId: command.tagId,
          value: command.value
        };
        this.socket.emit(`SEND${this.edukitId}`, JSON.stringify(message));
        console.log(`Command sent with tagId ${command.tagId} and value ${command.value}.`);
      } else {
        console.log("Socket.IO is not connected. Cannot send command.");
      }
    },
    sendStartCommand() {
      this.sendSocketMessage({ tagId: "1", value: "1" });
    },
    sendStopCommand() {
      this.sendSocketMessage({ tagId: "1", value: "0" });
    },
    sendResetCommand() {
      this.sendSocketMessage({ tagId: "8", value: "1" });
    }
  },
}
</script>

<style scoped>
.tree ul {
  list-style-type: none;
  padding-left: 20px;
}
</style>