<template>
  <div>
    <div class="flex flex-wrap mt-4">
      <div class="w-full">
        <div class="flex gap-10">
          <tree-list @dragStart="onDragStart" @modalOpen="handleModal" />
          <BabylonScene ref="babylonScene" class="w-full pr-10" />
        </div>
        <div class="px-10 py-4">
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
        </div>
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

const workingState = ref(false)
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
