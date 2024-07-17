<!-- TreeComponent.vue -->
<template>
  <div class="tree">
    <ul>
      <li v-for="category in categories" :key="category.name">
        {{ category.name }}
        <ul>
          <li
            v-for="item in category.items"
            :key="item.name"
            draggable="true"
            @dragstart="onDragStart($event, item)"
          >
            {{ item.name }}
            <treeModal :item="item" @setCondition="setCondition" />
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from 'vue'
import treeModal from '@/components/modals/treeModal.vue'

export default {
  name: 'TreeComponent',
  components: {
    treeModal
  },
  setup(props, { emit }) {
    const categories = ref([
      {
        name: '키트',
        items: [
          { name: '키트1', type: '3d', meshName: 'box' },
          { name: 'eduKit', type: '3d', meshName: 'eduKit', mqttTopic: 'eduKit', threshold: '10' } // 새로운 eduKit 항목 추가
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

    return {
      categories,
      onDragStart,
      openModal,
      setCondition
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
