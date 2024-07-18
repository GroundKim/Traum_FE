<!-- TreeComponent.vue -->
<template>
  <div class="tree">
    <ul>
      <li v-for="category in categories" :key="category.name">
        {{ category.name }}
        <button @click="addItem">Add Item</button>
        <ul>
          <li
            class="flex"
            v-for="item in category.items"
            :key="item.name"
            draggable="true"
            @dragstart="onDragStart($event, item)"
          >
            {{ item.name }}
            <treeModal :item="item" @setCondition="setCondition" />
            <button
              @click="() => {}"
              class="text-xl px-4 py-1 get-started font-bold rounded outline-none focus:outline-none mr-1 mb-1 bg-color1 active:bg-color1"
              :class="{
                'bg-color3 text-white active:bg-emerald-600': !(true === workingState),
                'bg-gray-400 border-blueGray-600 text-white active:bg-emerald-600':
                  true === workingState
              }"
            >
              가동
            </button>
            <button
              @click="() => {}"
              class="text-xl px-4 py-1 get-started font-bold rounded outline-none focus:outline-none mr-1 mb-1 bg-color1 active:bg-color1"
              :class="{
                'bg-color3 text-white active:bg-emerald-600': true === workingState,
                'bg-gray-400 border-blueGray-600 text-white active:bg-emerald-600': !(
                  true === workingState
                )
              }"
            >
              중지
            </button>
            <button
              @click="emitRemoveItem(item)"
              class="text-xl px-4 py-1 get-started font-bold rounded outline-none focus:outline-none mr-1 mb-1 bg-color1 active:bg-color1"
              :class="{
                'bg-color3 text-white active:bg-emerald-600': !(true === workingState),
                'bg-gray-400 border-blueGray-600 text-white active:bg-emerald-600':
                  true === workingState
              }"
            >
              삭제
            </button>
            <button
              @click="emitAlarmItem(item)"
              class="bg-color3 text-white text-xl px-4 py-1 get-started font-bold rounded outline-none focus:outline-none mr-1 mb-1 bg-color1 active:bg-color1"
            >
              알람
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

export default {
  name: 'TreeComponent',
  components: {
    treeModal
  },
  setup(props, { emit }) {
    class EduKit {
      constructor(name, type, meshName, mqttTopic, threshold) {
        this.meshId = Math.floor(Math.random() * 10000) // Automatically assign a unique ID
        this.name = name
        this.type = type
        this.meshName = meshName
        this.mqttTopic = mqttTopic
        this.threshold = threshold
      }
    }
    const addItem = () => {
      const newItem = new EduKit('eduKit', '3d', 'eduKit', 'eduKit', '10')
      categories.value[0].items.push(newItem)
      console.log('add-start', newItem)
    }
    const categories = ref([
      {
        name: '키트',
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
        name: '온도계',
        items: [{ name: '온도계2', type: '3d', meshName: 'sphere' }]
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
      console.log('setCondition', item)
    }

    const emitRemoveItem = (item) => {
      emitter.emit('removeItem', item)
      console.log('remove-start', item)
    }
    const emitAlarmItem = (item) => {
      emitter.emit('alarmItem', item)
      console.log('remove-start', item)
    }

    return {
      categories,
      onDragStart,
      openModal,
      setCondition,
      emitRemoveItem,
      emitAlarmItem,
      addItem
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
