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
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'TreeComponent',
  setup(props, { emit }) {
    const categories = ref([
      {
        name: '키트',
        items: [
          { name: '키트1', type: '3d', meshName: 'box' },
          { name: '키트2', type: 'normal' },
          { name: '키트3', type: 'normal' }
        ]
      },
      {
        name: '온도계',
        items: [
          { name: '온도계1', type: 'normal' },
          { name: '온도계2', type: '3d', meshName: 'sphere' }
        ]
      }
    ])

    const onDragStart = (event, item) => {
      event.dataTransfer.setData('application/json', JSON.stringify(item))
      emit('dragStart', item)
    }

    return {
      categories,
      onDragStart
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
