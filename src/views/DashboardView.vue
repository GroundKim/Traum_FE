<template>
  <div>
    <div class="flex flex-wrap mt-4">
      <div class="w-full">
        <div class="flex gap-10">
          <tree-list @dragStart="onDragStart" @modalOpen="handleModal" />
          <BabylonScene
            ref="babylonScene"
            @removeItem="console.log('도착확인')"
            class="w-full pr-10"
          />
        </div>
        <div class="px-10 py-4"></div>
        <line-chart-detail :data="data"></line-chart-detail>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import BabylonScene from '../components/BabylonScene.vue'
import LineChartDetail from '../components/charts/LineChart.vue'
import TreeList from '../components/lists/TreeList.vue'

const babylonScene = ref(null)

const data = {}

const currentModal = ref(null)
const showModal = ref(false)

const onDragStart = (item) => {
  console.log('Drag started:', item)
}

const handleModal = (item) => {
  currentModal.value = item
  showModal.value = true
}

onMounted(() => {})

onUnmounted(() => {})
</script>
